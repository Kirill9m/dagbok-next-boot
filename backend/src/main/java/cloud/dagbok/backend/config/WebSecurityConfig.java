package cloud.dagbok.backend.config;

import cloud.dagbok.backend.filter.JwtAuthenticationFilter;
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

  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  public WebSecurityConfig(JwtAuthenticationFilter apiKeyFilter) {
    this.apiKeyFilter = apiKeyFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/user/login",
                        "/user/register",
                        "/user/demo",
                        "/user/logout",
                        "/actuator/health",
                        "/api/health",
                        "/api/status",
                        "/api/public/**",
                        "/error")
                    .permitAll()
                    .requestMatchers("/api/**", "/user/me", "/user/prompt", "/user/model")
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
      configuration.setAllowedOrigins(origins);
    }

    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    source.registerCorsConfiguration("/user/**", configuration);
    source.registerCorsConfiguration("/actuator/**", configuration);

    return source;
  }
}
