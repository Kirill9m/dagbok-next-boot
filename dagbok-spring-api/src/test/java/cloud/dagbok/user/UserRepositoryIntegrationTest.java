package cloud.dagbok.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DisplayName("UserRepository Integration Tests")
class UserRepositoryIntegrationTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("testdb")
      .withUsername("test")
      .withPassword("test");

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
  }

  @Test
  @DisplayName("Should save and retrieve user")
  void shouldSaveAndRetrieveUser() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");

    UserEntity saved = userRepository.save(user);

    assertNotNull(saved.getId());
    assertEquals("testuser", saved.getUserName());
    assertEquals("hashedpassword", saved.getPasswordHash());
  }

  @Test
  @DisplayName("Should find user by id")
  void shouldFindUserById() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    UserEntity saved = userRepository.save(user);

    Optional<UserEntity> found = userRepository.findById(saved.getId());

    assertTrue(found.isPresent());
    assertEquals("testuser", found.get().getUserName());
  }

  @Test
  @DisplayName("Should return empty optional for non-existent user")
  void shouldReturnEmptyOptionalForNonExistentUser() {
    Optional<UserEntity> found = userRepository.findById(java.util.UUID.randomUUID());
    assertTrue(found.isEmpty());
  }

  @Test
  @DisplayName("Should update existing user")
  void shouldUpdateExistingUser() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    UserEntity saved = userRepository.save(user);

    saved.setUserName("updateduser");
    saved.setPasswordHash("newhashedpassword");
    UserEntity updated = userRepository.save(saved);

    assertEquals("updateduser", updated.getUserName());
    assertEquals("newhashedpassword", updated.getPasswordHash());
    assertEquals(saved.getId(), updated.getId());
  }

  @Test
  @DisplayName("Should delete user")
  void shouldDeleteUser() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    UserEntity saved = userRepository.save(user);

    userRepository.delete(saved);

    Optional<UserEntity> found = userRepository.findById(saved.getId());
    assertTrue(found.isEmpty());
  }

  @Test
  @DisplayName("Should enforce unique username constraint")
  void shouldEnforceUniqueUsernameConstraint() {
    UserEntity user1 = new UserEntity();
    user1.setUserName("testuser");
    user1.setPasswordHash("hashedpassword1");
    userRepository.save(user1);

    UserEntity user2 = new UserEntity();
    user2.setUserName("testuser");
    user2.setPasswordHash("hashedpassword2");

    assertThrows(DataIntegrityViolationException.class, () -> {
      userRepository.saveAndFlush(user2);
    });
  }

  @Test
  @DisplayName("Should save user with special characters in username")
  void shouldSaveUserWithSpecialCharactersInUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("user.name+test@example");
    user.setPasswordHash("hashedpassword");

    UserEntity saved = userRepository.save(user);
    assertEquals("user.name+test@example", saved.getUserName());
  }

  @Test
  @DisplayName("Should save user with unicode characters in username")
  void shouldSaveUserWithUnicodeCharactersInUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("user_你好_世界");
    user.setPasswordHash("hashedpassword");

    UserEntity saved = userRepository.save(user);
    assertEquals("user_你好_世界", saved.getUserName());
  }

  @Test
  @DisplayName("Should generate UUID for new user")
  void shouldGenerateUuidForNewUser() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    assertNull(user.getId());

    UserEntity saved = userRepository.save(user);
    assertNotNull(saved.getId());
  }

  @Test
  @DisplayName("Should save user with very long password hash")
  void shouldSaveUserWithVeryLongPasswordHash() {
    String longHash = "a".repeat(500);
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash(longHash);

    UserEntity saved = userRepository.save(user);
    assertEquals(longHash, saved.getPasswordHash());
  }

  @Test
  @DisplayName("Should handle multiple users")
  void shouldHandleMultipleUsers() {
    UserEntity user1 = new UserEntity();
    user1.setUserName("testuser1");
    user1.setPasswordHash("hashedpassword1");
    
    UserEntity user2 = new UserEntity();
    user2.setUserName("testuser2");
    user2.setPasswordHash("hashedpassword2");

    userRepository.save(user1);
    userRepository.save(user2);

    assertEquals(2, userRepository.count());
  }

  @Test
  @DisplayName("Should count users correctly")
  void shouldCountUsersCorrectly() {
    assertEquals(0, userRepository.count());

    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    userRepository.save(user);

    assertEquals(1, userRepository.count());
  }

  @Test
  @DisplayName("Should check if user exists by id")
  void shouldCheckIfUserExistsById() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    user.setPasswordHash("hashedpassword");
    UserEntity saved = userRepository.save(user);

    assertTrue(userRepository.existsById(saved.getId()));
    assertFalse(userRepository.existsById(java.util.UUID.randomUUID()));
  }
}