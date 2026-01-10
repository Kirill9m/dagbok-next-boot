package cloud.dagbok.backend.filter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Cache<String, Bucket> cache =
      Caffeine.newBuilder().maximumSize(10_000).expireAfterAccess(Duration.ofHours(1)).build();

  @Value("${rate.limit.default.capacity:100}")
  private int defaultCapacity;

  @Value("${rate.limit.default.refill.tokens:1}")
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
      long waitForRefill =
          bucket.estimateAbilityToConsume(1).getNanosToWaitForRefill() / 1_000_000_000;
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.setHeader("Retry-After", String.valueOf(Math.max(1, waitForRefill)));
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
    }
  }

  private Bucket resolveBucket(String key, String path) {
    if (path.equals("/user/login") || path.equals("/user/register")) {
      return cache.get(key + ":auth", k -> createAuthBucket());
    }
    return cache.get(key + ":default", k -> createDefaultBucket());
  }

  private Bucket createDefaultBucket() {
    Bandwidth limit =
        Bandwidth.builder()
            .capacity(defaultCapacity)
            .refillIntervally(defaultCapacity, Duration.ofMinutes(defaultDuration))
            .build();

    return Bucket.builder().addLimit(limit).build();
  }

  private Bucket createAuthBucket() {
    Bandwidth limit =
        Bandwidth.builder().capacity(1).refillIntervally(1, Duration.ofMinutes(5)).build();

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
