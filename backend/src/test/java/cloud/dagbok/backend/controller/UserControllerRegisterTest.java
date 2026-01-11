package cloud.dagbok.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import cloud.dagbok.backend.dto.user.User;
import cloud.dagbok.backend.exceptionHandler.GlobalExceptionHandler;
import cloud.dagbok.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.client.RestTestClient;

public class UserControllerRegisterTest {
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
  @DisplayName("Should return 201 CREATED when registration is successful")
  void register_WithValidCredentials_ReturnsCreated() {
    doNothing().when(userService).registerUser(any(User.class));

    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "testuser", "password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isCreated();
  }

  @Test
  @DisplayName("Should return 409 CONFLICT when username is already taken")
  void register_WithExistingUsername_ReturnsConflict() {
    Mockito.doThrow(
            new cloud.dagbok.backend.exceptionHandler.ConflictException(
                "testuser is already registered"))
        .when(userService)
        .registerUser(any(User.class));

    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "testuser", "password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isEqualTo(409);
  }

  @Test
  @DisplayName("Should return 400 BAD REQUEST when username is invalid")
  void register_WithInvalidUsername_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "ab", "password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 BAD REQUEST when password is too short")
  void register_WithShortPassword_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "validuser", "password": "short"}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 BAD REQUEST when body is empty")
  void register_WithEmptyBody_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body("")
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 BAD REQUEST when password is missing")
  void register_WithMissingPassword_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"username": "validuser"}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  @DisplayName("Should return 400 BAD REQUEST when username is missing")
  void register_WithMissingUsername_ReturnsBadRequest() {
    client
        .post()
        .uri("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .body(
            """
            {"password": "password123"}
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }
}
