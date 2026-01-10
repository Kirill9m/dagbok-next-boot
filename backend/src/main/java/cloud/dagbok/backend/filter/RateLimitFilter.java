package cloud.dagbok.backend.filter;

import cloud.dagbok.backend.dto.user.Principal;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@ConditionalOnProperty(name = "rate.limit.enabled", havingValue = "true", matchIfMissing = true)
public class RateLimitFilter extends OncePerRequestFilter {
  private final Cache<String, Bucket> cache =
      Caffeine.newBuilder().maximumSize(10_000).expireAfterAccess(Duration.ofHours(1)).build();

  private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

  @Value("${rate.limit.default.capacity:100}")
  private int defaultCapacity;

  @Value("${rate.limit.default.refill.duration:1}")
  private int defaultDuration;

  @Value("${rate.limit.demo.capacity}")
  private int demoCapacity;

  @Value("${rate.limit.demo.refill.duration}")
  private int demoRefillDuration;

  @Value("${rate.limit.user.capacity}")
  private int userCapacity;

  @Value("${rate.limit.user.refill.duration}")
  private int userRefillDuration;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String key = resolveKey(request);
    String path = request.getRequestURI();

    Bucket bucket = resolveBucket(key, path);

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      long waitForRefill =
          bucket.estimateAbilityToConsume(1).getNanosToWaitForRefill() / 1_000_000_000;

      log.warn("Rate limit exceeded for key={} path={}", key, path);

      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.setHeader("Retry-After", String.valueOf(Math.max(1, waitForRefill)));
      response.setContentType("application/json");
      response
          .getWriter()
          .write(
              "{\"error\":\"Too many requests\",\"retryAfter\":"
                  + Math.max(1, waitForRefill)
                  + "}");
    }
  }

  private Bucket resolveBucket(String key, String path) {
    if (path.startsWith("/user/login") || path.startsWith("/user/register")) {
      return cache.get(key + ":auth", k -> createAuthBucket());
    }
    if (path.startsWith("/user/demo")) {
      return cache.get(key + ":demo", k -> createDemoBucket());
    }
    if (path.startsWith("/user/me")) {
      return cache.get(key + ":me", k -> createCheckMeBucket());
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
        Bandwidth.builder()
            .capacity(userCapacity)
            .refillIntervally(userCapacity, Duration.ofMinutes(userRefillDuration))
            .build();

    return Bucket.builder().addLimit(limit).build();
  }

  private Bucket createDemoBucket() {
    Bandwidth limit =
        Bandwidth.builder()
            .capacity(demoCapacity)
            .refillIntervally(demoCapacity, Duration.ofMinutes(demoRefillDuration))
            .build();

    return Bucket.builder().addLimit(limit).build();
  }

  private Bucket createCheckMeBucket() {
    Bandwidth limit =
        Bandwidth.builder().capacity(200).refillIntervally(200, Duration.ofMinutes(1)).build();

    return Bucket.builder().addLimit(limit).build();
  }

  private String resolveKey(HttpServletRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof Principal p) {
      return "user:" + p.userId();
    }

    return "ip:" + getClientIP(request);
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
