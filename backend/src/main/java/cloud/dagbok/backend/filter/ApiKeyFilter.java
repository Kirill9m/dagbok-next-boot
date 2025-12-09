package cloud.dagbok.backend.filter;

import cloud.dagbok.backend.dto.user.ApiPrincipal;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.repository.UserRepository;
import cloud.dagbok.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;

  public ApiKeyFilter(UserRepository userRepository, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    boolean shouldNotFilter =
        path.startsWith("/user/")
            || path.equals("/api/health")
            || path.equals("/api/status")
            || path.startsWith("/api/public/");

    return shouldNotFilter;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String path = request.getRequestURI();

    if (!path.startsWith("/api/")) {
      filterChain.doFilter(request, response);
      return;
    }

    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer ")) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing JWT token");
      return;
    }

    String token = header.substring(7);

    if (!jwtUtil.validateJwtToken(token)) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
      return;
    }

      String email;
      try {
          email = jwtUtil.getUsernameFromToken(token);
          } catch (io.jsonwebtoken.JwtException e) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
          return;
          }

    if (email == null) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token does not contain user info");
      return;
    }

    UserEntity user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found for provided token");
      return;
    }

    ApiPrincipal apiPrincipal = new ApiPrincipal(user.getId(), user.getEmail());
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
            apiPrincipal, null, AuthorityUtils.createAuthorityList("ROLE_API_USER"));
    SecurityContextHolder.getContext().setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }
}
