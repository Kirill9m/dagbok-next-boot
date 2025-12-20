package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.token.TokenRequest;
import cloud.dagbok.backend.dto.token.UpdatedToken;
import cloud.dagbok.backend.dto.user.User;
import cloud.dagbok.backend.dto.user.UserCheck;
import cloud.dagbok.backend.dto.user.UserNew;
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
    log.info("Attempting to register user: {} {}", user.name(), user.email());
    userService.registerUser(user);
    log.info("New user created: {}", user.email());
    return ResponseEntity.status(201).build();
  }

  @PostMapping("/login")
  public ResponseEntity<Void> login(@Valid @RequestBody UserCheck user) {
    log.info("User api check: {}", user.email());
    TokenRequest tokens = userService.loginUser(user.email(), user.password());

    ResponseCookie cookie = ResponseCookie.from("accessToken", tokens.token())
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .maxAge(60 * 60)
        .sameSite("Lax")
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokens.refreshToken())
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .maxAge(7 * 24 * 60 * 60)
        .sameSite("Lax")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
        .build();
  }

  @PutMapping("/refresh")
  public ResponseEntity<Void> updateToken(
      @CookieValue(name = "accessToken", required = false) String accessToken,
      @CookieValue(name = "refreshToken", required = false) String refreshToken) {
    log.info("Token update request received: {}", accessToken);
    UpdatedToken tokens = tokenService.updateToken(accessToken, refreshToken);

    ResponseCookie cookie = ResponseCookie.from("accessToken", tokens.token())
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .maxAge(60 * 60)
        .sameSite("Lax")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .build();
  }
}