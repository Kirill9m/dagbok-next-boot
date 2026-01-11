package cloud.dagbok.backend.controller;

import static org.mockito.Mockito.when;

import cloud.dagbok.backend.dto.token.Token;
import cloud.dagbok.backend.exceptionHandler.GlobalExceptionHandler;
import cloud.dagbok.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.client.RestTestClient;

class UserControllerLoginTest {

  RestTestClient client;
  private UserService userService;

  @BeforeEach
  void setup() {
    userService = Mockito.mock(UserService.class);
    client =
        RestTestClient.bindToController(new UserController(userService))
            .configureServer(builder -> builder.setControllerAdvice(new GlobalExceptionHandler()))
            .build();
  }

  @Test
  @DisplayName("Should return 200 OK when credentials are valid")
  void login_WithValidCredentials_ReturnsOk() {
    when(userService.loginUser("testuser", "password123")).thenReturn(new Token("jwt-token"));

    client
        .post()
        .uri("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "testuser", "password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isOk()
        .expectHeader()
        .exists("Set-Cookie");
  }

  @Test
  @DisplayName("Should return 404 when credentials are invalid")
  void login_WithInvalidCredentials_ReturnsNotFound() {
    when(userService.loginUser("wrong", "wrong"))
        .thenThrow(new jakarta.persistence.EntityNotFoundException("Invalid credentials"));

    client
        .post()
        .uri("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "wrong", "password":  "wrong"}
            """)
        .exchange()
        .expectStatus()
        .isNotFound();
  }

  @Test
  @DisplayName("Should return 400 when username is blank")
  void login_WithBlankUsername_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "", "password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 when password is blank")
  void login_WithBlankPassword_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "testuser", "password": ""}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 when body is empty")
  void login_WithEmptyBody_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .body("{}")
        .exchange()
        .expectStatus()
        .isBadRequest();
  }
}
