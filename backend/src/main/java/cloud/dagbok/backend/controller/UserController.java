package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.token.Token;
import cloud.dagbok.backend.dto.user.Principal;
import cloud.dagbok.backend.dto.user.User;
import cloud.dagbok.backend.dto.user.UserCheck;
import cloud.dagbok.backend.dto.user.UserProfile;
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
    Token tokens = userService.loginUser(user.email(), user.password());

    ResponseCookie cookie = createCookie("accessToken", tokens.token(), 60 * 60 * 24 * 7);
    log.info("User logged in successfully");

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfile> getUserInfo(Authentication authentication) {
    Principal apiPrincipal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(apiPrincipal, "Principal cannot be null");
    log.info("Fetching user info");

    UserProfile profile = userService.getUserProfile(apiPrincipal.email());
    return ResponseEntity.ok(profile);
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
