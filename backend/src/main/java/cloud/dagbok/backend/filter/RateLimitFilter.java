package cloud.dagbok.backend.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

  @Value("${rate.limit.default.capacity:100}")
  private int defaultCapacity;

  @Value("${rate.limit.default.duration:1}")
  private int defaultDuration;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String key = getClientIP(request);
    String path = request.getRequestURI();

    Bucket bucket = resolveBucket(key, path);

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
    }
  }

  private Bucket resolveBucket(String key, String path) {
    if (path.startsWith("/user/login") || path.startsWith("/user/register")) {
      return cache.computeIfAbsent(key + ":auth", k -> createAuthBucket());
    }
    return cache.computeIfAbsent(key + ":default", k -> createDefaultBucket());
  }

  private Bucket createDefaultBucket() {
    Bandwidth limit =
        Bandwidth.builder()
            .capacity(defaultCapacity)
            .refillIntervally(defaultDuration, Duration.ofMinutes(1))
            .build();

    return Bucket.builder().addLimit(limit).build();
  }

  private Bucket createAuthBucket() {
    Bandwidth limit =
        Bandwidth.builder().capacity(1).refillIntervally(5, Duration.ofMinutes(1)).build();

    return Bucket.builder().addLimit(limit).build();
  }

  private String getClientIP(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      return xForwardedFor.split(",")[0].trim();
    }

    String xRealIP = request.getHeader("X-Real-IP");
    if (xRealIP != null && !xRealIP.isEmpty()) {
      return xRealIP;
    }

    return request.getRemoteAddr();
  }
}
