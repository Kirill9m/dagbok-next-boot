package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.token.TokenRequest;
import cloud.dagbok.backend.dto.token.UpdatedToken;
import cloud.dagbok.backend.dto.user.User;
import cloud.dagbok.backend.dto.user.UserCheck;
import cloud.dagbok.backend.service.TokenService;
import cloud.dagbok.backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

  private final UserService userService;
  private final TokenService tokenService;
  private static final Logger log = LoggerFactory.getLogger(UserController.class);

  @Value("${cookie.secure:true}")
  private boolean cookieSecure;

  public UserController(UserService userService, TokenService tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  @PostMapping("/register")
  public ResponseEntity<Void> register(@Valid @RequestBody User user) {
    log.info("User register attempt");
    userService.registerUser(user);
    log.info("New user created successfully");
    return ResponseEntity.status(201).build();
  }

  @PostMapping("/login")
  public ResponseEntity<Void> login(@Valid @RequestBody UserCheck user) {
    log.info("User login attempt");
    TokenRequest tokens = userService.loginUser(user.email(), user.password());

    ResponseCookie cookie = createCookie("accessToken", tokens.token(), 300);
    ResponseCookie refreshCookie =
        createCookie("refreshToken", tokens.refreshToken(), 60 * 60 * 24 * 7);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
        .build();
  }

  @PutMapping("/refresh")
  public ResponseEntity<Void> updateToken(
      @CookieValue(name = "accessToken") String accessToken,
      @CookieValue(name = "refreshToken") String refreshToken) {
    log.info("User token update attempt");
    UpdatedToken tokens = tokenService.updateToken(accessToken, refreshToken);

    ResponseCookie cookie = createCookie("accessToken", tokens.token(), 300);

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  private ResponseCookie createCookie(String name, String value, int maxAgeSeconds) {
    return ResponseCookie.from(name, value)
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .maxAge(maxAgeSeconds)
        .sameSite("Lax")
        .build();
  }
}
