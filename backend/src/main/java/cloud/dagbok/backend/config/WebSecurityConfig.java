package cloud.dagbok.backend.config;

import cloud.dagbok.backend.filter.JwtAuthenticationFilter;
import cloud.dagbok.backend.filter.RateLimitFilter;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {

  private final JwtAuthenticationFilter apiKeyFilter;
  private final RateLimitFilter rateLimitFilter;

  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  public WebSecurityConfig(JwtAuthenticationFilter apiKeyFilter, RateLimitFilter rateLimitFilter) {
    this.apiKeyFilter = apiKeyFilter;
    this.rateLimitFilter = rateLimitFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/user/login",
                        "/user/register",
                        "/user/demo",
                        "/actuator/health",
                        "/api/health",
                        "/api/status",
                        "/api/public/**",
                        "/error")
                    .permitAll()
                    .requestMatchers(
                        "/api/**", "/user/me", "/user/prompt", "/user/model", "/user/logout")
                    .authenticated()
                    .anyRequest()
                    .denyAll());
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    if (allowedOrigins != null && !allowedOrigins.isBlank()) {
      List<String> origins = Arrays.stream(allowedOrigins.split(",")).map(String::trim).toList();

      if (origins.contains("*")) {
        throw new IllegalArgumentException(
            "Wildcard origins (*) not allowed with credentials enabled");
      }

      configuration.setAllowedOrigins(origins);
    }

    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(
        Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    source.registerCorsConfiguration("/user/**", configuration);
    source.registerCorsConfiguration("/actuator/**", configuration);

    return source;
  }
}
