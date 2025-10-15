package cloud.dagbok.user;

import cloud.dagbok.notes.NotesEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("UserEntity Tests")
class UserEntityTest {

  @Test
  @DisplayName("Should create UserEntity with no-args constructor")
  void shouldCreateWithNoArgsConstructor() {
    UserEntity user = new UserEntity();
    assertNotNull(user);
    assertNull(user.getId());
    assertNull(user.getUserName());
    assertNull(user.getPasswordHash());
    assertNull(user.getNotes());
  }

  @Test
  @DisplayName("Should create UserEntity with all-args constructor")
  void shouldCreateWithAllArgsConstructor() {
    UUID id = UUID.randomUUID();
    List<NotesEntity> notes = new ArrayList<>();
    UserEntity user = new UserEntity(id, "testuser", "hashedpassword", notes);

    assertEquals(id, user.getId());
    assertEquals("testuser", user.getUserName());
    assertEquals("hashedpassword", user.getPasswordHash());
    assertEquals(notes, user.getNotes());
  }

  @Test
  @DisplayName("Should set and get username")
  void shouldSetAndGetUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    assertEquals("testuser", user.getUserName());
  }

  @Test
  @DisplayName("Should set and get password hash")
  void shouldSetAndGetPasswordHash() {
    UserEntity user = new UserEntity();
    user.setPasswordHash("hashedpassword123");
    assertEquals("hashedpassword123", user.getPasswordHash());
  }

  @Test
  @DisplayName("Should handle username with special characters")
  void shouldHandleUsernameWithSpecialCharacters() {
    UserEntity user = new UserEntity();
    user.setUserName("user.name+test@example");
    assertEquals("user.name+test@example", user.getUserName());
  }

  @Test
  @DisplayName("Should handle empty username")
  void shouldHandleEmptyUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("");
    assertEquals("", user.getUserName());
  }

  @Test
  @DisplayName("Should handle null username")
  void shouldHandleNullUsername() {
    UserEntity user = new UserEntity();
    user.setUserName(null);
    assertNull(user.getUserName());
  }

  @Test
  @DisplayName("Should handle very long username")
  void shouldHandleVeryLongUsername() {
    String longUsername = "a".repeat(1000);
    UserEntity user = new UserEntity();
    user.setUserName(longUsername);
    assertEquals(longUsername, user.getUserName());
  }

  @Test
  @DisplayName("Should handle unicode characters in username")
  void shouldHandleUnicodeCharactersInUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("user_你好_世界");
    assertEquals("user_你好_世界", user.getUserName());
  }

  @Test
  @DisplayName("Should handle empty password hash")
  void shouldHandleEmptyPasswordHash() {
    UserEntity user = new UserEntity();
    user.setPasswordHash("");
    assertEquals("", user.getPasswordHash());
  }

  @Test
  @DisplayName("Should handle null password hash")
  void shouldHandleNullPasswordHash() {
    UserEntity user = new UserEntity();
    user.setPasswordHash(null);
    assertNull(user.getPasswordHash());
  }

  @Test
  @DisplayName("Should handle long password hash")
  void shouldHandleLongPasswordHash() {
    String longHash = "a".repeat(500);
    UserEntity user = new UserEntity();
    user.setPasswordHash(longHash);
    assertEquals(longHash, user.getPasswordHash());
  }

  @Test
  @DisplayName("Should get notes list")
  void shouldGetNotesList() {
    List<NotesEntity> notes = new ArrayList<>();
    UserEntity user = new UserEntity(UUID.randomUUID(), "testuser", "hash", notes);
    assertEquals(notes, user.getNotes());
  }

  @Test
  @DisplayName("Should handle null notes list")
  void shouldHandleNullNotesList() {
    UserEntity user = new UserEntity(UUID.randomUUID(), "testuser", "hash", null);
    assertNull(user.getNotes());
  }

  @Test
  @DisplayName("Should handle empty notes list")
  void shouldHandleEmptyNotesList() {
    List<NotesEntity> emptyNotes = new ArrayList<>();
    UserEntity user = new UserEntity(UUID.randomUUID(), "testuser", "hash", emptyNotes);
    assertTrue(user.getNotes().isEmpty());
  }

  @Test
  @DisplayName("Should handle multiple notes")
  void shouldHandleMultipleNotes() {
    UserEntity user = new UserEntity();
    user.setUserName("testuser");
    
    List<NotesEntity> notes = new ArrayList<>();
    notes.add(new NotesEntity("Note 1", user));
    notes.add(new NotesEntity("Note 2", user));
    notes.add(new NotesEntity("Note 3", user));
    
    UserEntity userWithNotes = new UserEntity(UUID.randomUUID(), "testuser", "hash", notes);
    assertEquals(3, userWithNotes.getNotes().size());
  }

  @Test
  @DisplayName("Should support updating username")
  void shouldSupportUpdatingUsername() {
    UserEntity user = new UserEntity();
    user.setUserName("oldusername");
    assertEquals("oldusername", user.getUserName());
    
    user.setUserName("newusername");
    assertEquals("newusername", user.getUserName());
  }

  @Test
  @DisplayName("Should support updating password hash")
  void shouldSupportUpdatingPasswordHash() {
    UserEntity user = new UserEntity();
    user.setPasswordHash("oldhash");
    assertEquals("oldhash", user.getPasswordHash());
    
    user.setPasswordHash("newhash");
    assertEquals("newhash", user.getPasswordHash());
  }

  @Test
  @DisplayName("Should maintain ID immutability through getter only")
  void shouldMaintainIdImmutability() {
    UUID id = UUID.randomUUID();
    UserEntity user = new UserEntity(id, "testuser", "hash", null);
    assertEquals(id, user.getId());
    // No setter for ID, so it remains immutable after construction
  }

  @Test
  @DisplayName("Should handle username with whitespace")
  void shouldHandleUsernameWithWhitespace() {
    UserEntity user = new UserEntity();
    user.setUserName("  user name  ");
    assertEquals("  user name  ", user.getUserName());
  }

  @Test
  @DisplayName("Should handle password hash with special characters")
  void shouldHandlePasswordHashWithSpecialCharacters() {
    UserEntity user = new UserEntity();
    user.setPasswordHash("$2a$10$N9qo8uLOickgx2ZMRZoMye");
    assertEquals("$2a$10$N9qo8uLOickgx2ZMRZoMye", user.getPasswordHash());
  }
}