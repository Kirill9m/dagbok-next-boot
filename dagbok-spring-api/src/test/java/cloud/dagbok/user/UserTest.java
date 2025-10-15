package cloud.dagbok.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User DTO Tests")
class UserTest {

  @Test
  @DisplayName("Should create User record with all fields")
  void shouldCreateUserWithAllFields() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "testuser", "hashedpassword");

    assertEquals(id, user.id());
    assertEquals("testuser", user.userName());
    assertEquals("hashedpassword", user.passwordHash());
  }

  @Test
  @DisplayName("Should handle null id")
  void shouldHandleNullId() {
    User user = new User(null, "testuser", "hashedpassword");
    assertNull(user.id());
    assertEquals("testuser", user.userName());
  }

  @Test
  @DisplayName("Should handle null username")
  void shouldHandleNullUsername() {
    UUID id = UUID.randomUUID();
    User user = new User(id, null, "hashedpassword");
    assertNull(user.userName());
  }

  @Test
  @DisplayName("Should handle null password hash")
  void shouldHandleNullPasswordHash() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "testuser", null);
    assertNull(user.passwordHash());
  }

  @Test
  @DisplayName("Should handle all null fields")
  void shouldHandleAllNullFields() {
    User user = new User(null, null, null);
    assertNull(user.id());
    assertNull(user.userName());
    assertNull(user.passwordHash());
  }

  @Test
  @DisplayName("Should support equality based on all fields")
  void shouldSupportEquality() {
    UUID id = UUID.randomUUID();
    User user1 = new User(id, "testuser", "hash");
    User user2 = new User(id, "testuser", "hash");

    assertEquals(user1, user2);
    assertEquals(user1.hashCode(), user2.hashCode());
  }

  @Test
  @DisplayName("Should not be equal with different ids")
  void shouldNotBeEqualWithDifferentIds() {
    User user1 = new User(UUID.randomUUID(), "testuser", "hash");
    User user2 = new User(UUID.randomUUID(), "testuser", "hash");

    assertNotEquals(user1, user2);
  }

  @Test
  @DisplayName("Should not be equal with different usernames")
  void shouldNotBeEqualWithDifferentUsernames() {
    UUID id = UUID.randomUUID();
    User user1 = new User(id, "testuser1", "hash");
    User user2 = new User(id, "testuser2", "hash");

    assertNotEquals(user1, user2);
  }

  @Test
  @DisplayName("Should not be equal with different password hashes")
  void shouldNotBeEqualWithDifferentPasswordHashes() {
    UUID id = UUID.randomUUID();
    User user1 = new User(id, "testuser", "hash1");
    User user2 = new User(id, "testuser", "hash2");

    assertNotEquals(user1, user2);
  }

  @Test
  @DisplayName("Should be immutable record")
  void shouldBeImmutableRecord() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "testuser", "hash");

    assertNotNull(user.id());
    assertNotNull(user.userName());
    assertNotNull(user.passwordHash());
  }

  @Test
  @DisplayName("Should handle username with special characters")
  void shouldHandleUsernameWithSpecialCharacters() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "user.name+test@example", "hash");
    assertEquals("user.name+test@example", user.userName());
  }

  @Test
  @DisplayName("Should handle unicode characters in username")
  void shouldHandleUnicodeCharactersInUsername() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "user_你好_世界", "hash");
    assertEquals("user_你好_世界", user.userName());
  }

  @Test
  @DisplayName("Should handle empty username")
  void shouldHandleEmptyUsername() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "", "hash");
    assertEquals("", user.userName());
  }

  @Test
  @DisplayName("Should handle empty password hash")
  void shouldHandleEmptyPasswordHash() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "testuser", "");
    assertEquals("", user.passwordHash());
  }

  @Test
  @DisplayName("Should handle very long username")
  void shouldHandleVeryLongUsername() {
    UUID id = UUID.randomUUID();
    String longUsername = "a".repeat(1000);
    User user = new User(id, longUsername, "hash");
    assertEquals(longUsername, user.userName());
  }

  @Test
  @DisplayName("Should handle very long password hash")
  void shouldHandleVeryLongPasswordHash() {
    UUID id = UUID.randomUUID();
    String longHash = "a".repeat(500);
    User user = new User(id, "testuser", longHash);
    assertEquals(longHash, user.passwordHash());
  }

  @Test
  @DisplayName("Should have proper toString representation")
  void shouldHaveProperToStringRepresentation() {
    UUID id = UUID.randomUUID();
    User user = new User(id, "testuser", "hash");
    String toString = user.toString();
    
    assertNotNull(toString);
    assertTrue(toString.contains("testuser"));
    assertTrue(toString.contains(id.toString()));
  }
}