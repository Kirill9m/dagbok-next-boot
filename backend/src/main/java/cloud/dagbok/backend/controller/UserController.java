package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.token.Token;
import cloud.dagbok.backend.dto.user.*;
import cloud.dagbok.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

  private final UserService userService;
  private static final Logger log = LoggerFactory.getLogger(UserController.class);

  @Value("${cookie.secure:true}")
  private boolean cookieSecure;

  public UserController(UserService userService) {
    this.userService = userService;
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
    Token tokens = userService.loginUser(user.username(), user.password());

    ResponseCookie cookie = createCookie("accessToken", tokens.token(), 60 * 60 * 24 * 7);
    log.info("User logged in successfully");

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  /**
   * Creates a demo user account with a 5-minute session.
   * Note: This endpoint should be protected with rate limiting to prevent abuse.
   * Consider implementing IP-based rate limiting or CAPTCHA protection.
   */
  @PostMapping("/demo")
  public ResponseEntity<Void> demo() {
    log.info("Demo user login attempt");
    Token token = userService.demoLogin();

    ResponseCookie cookie = createCookie("accessToken", token.token(), 60 * 5);

    log.info("Demo user session created successfully");

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfile> getUserInfo(Authentication authentication) {
    Principal apiPrincipal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(apiPrincipal, "Principal cannot be null");
    log.info("Fetching user info");

    UserProfile profile = userService.getUserProfile(apiPrincipal.username());
    return ResponseEntity.ok(profile);
  }

  @PutMapping("/prompt")
  public ResponseEntity<UserProfile> updateUserPrompt(
      Authentication authentication, @Valid @RequestBody UpdatePromptRequest prompt) {
    Principal apiPrincipal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(apiPrincipal, "Principal cannot be null");
    log.info("Updating user prompt");

    UserProfile updatedProfile =
        userService.updateUserPrompt(apiPrincipal.userId(), prompt.newPrompt());
    return ResponseEntity.ok(updatedProfile);
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

  @PatchMapping("/model")
  public ResponseEntity<UserProfile> updateUserModel(
      Authentication authentication, @Valid @RequestBody UpdateModelRequest request) {
    Principal apiPrincipal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(apiPrincipal, "Principal cannot be null");
    log.info("Updating user model");

    UserProfile updatedProfile =
        userService.updateUserModel(apiPrincipal.userId(), request.model());
    return ResponseEntity.ok(updatedProfile);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@CookieValue(name = "accessToken", required = false) String token) {
    if (token != null && !token.isEmpty()) {
      userService.invalidateToken(token);
    }
    ResponseCookie cookie = createCookie("accessToken", "", 0);
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }
}
