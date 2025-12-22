package cloud.dagbok.backend.filter;

import cloud.dagbok.backend.dto.user.Principal;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.repository.UserRepository;
import cloud.dagbok.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;
  private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

  public JwtAuthenticationFilter(UserRepository userRepository, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.equals("/user/login")
        || path.equals("/user/register")
        || path.equals("/actuator/health")
        || path.equals("/api/health")
        || path.equals("/api/status")
        || path.startsWith("/api/public/");
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String path = request.getRequestURI();

    String token = extractTokenFromCookie(request);

    if (token == null) {
      token = extractTokenFromHeader(request);
    }

    if (token == null) {
      log.warn("Missing JWT token for path: {}", path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing JWT token");
      return;
    }

    if (!jwtUtil.validateJwtToken(token)) {
      log.warn("Invalid JWT token for path: {}", path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
      return;
    }

    String email;
    try {
      email = jwtUtil.getUsernameFromToken(token);
    } catch (io.jsonwebtoken.ExpiredJwtException e) {
      log.warn("Expired JWT token for path: {}", path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
      return;
    } catch (io.jsonwebtoken.JwtException e) {
      log.warn("Invalid JWT token for path: {}", path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
      return;
    }

    if (email == null) {
      log.warn("Token does not contain user info for path: {}", path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token does not contain user info");
      return;
    }

    UserEntity user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
      log.warn("User not found for email: {} on path: {}", email, path);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found for provided token");
      return;
    }

    log.debug("Authenticated user: {} for path: {}", email, path);

    Principal principal = new Principal(user.getId(), user.getEmail());
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
            principal, null, AuthorityUtils.createAuthorityList("ROLE_API_USER"));
    SecurityContextHolder.getContext().setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }

  private String extractTokenFromCookie(HttpServletRequest request) {
    if (request.getCookies() != null) {
      for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
        if ("accessToken".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  private String extractTokenFromHeader(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      return header.substring(7);
    }
    return null;
  }
}
