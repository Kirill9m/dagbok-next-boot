package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("NotesEntity Tests")
class NotesEntityTest {

  private UserEntity testUser;

  @BeforeEach
  void setUp() {
    testUser = new UserEntity();
    testUser.setUserName("testuser");
    testUser.setPasswordHash("hashedpassword");
  }

  @Test
  @DisplayName("Should create NotesEntity with default constructor")
  void shouldCreateWithDefaultConstructor() {
    NotesEntity notesEntity = new NotesEntity();
    assertNotNull(notesEntity);
    assertNull(notesEntity.getId());
    assertNull(notesEntity.getNotes());
    assertNull(notesEntity.getUser());
  }

  @Test
  @DisplayName("Should create NotesEntity with parameterized constructor")
  void shouldCreateWithParameterizedConstructor() {
    String noteContent = "This is a test note";
    NotesEntity notesEntity = new NotesEntity(noteContent, testUser);

    assertNotNull(notesEntity);
    assertEquals(noteContent, notesEntity.getNotes());
    assertEquals(testUser, notesEntity.getUser());
    assertNull(notesEntity.getId()); // ID is null until persisted
  }

  @Test
  @DisplayName("Should set and get id")
  void shouldSetAndGetId() {
    NotesEntity notesEntity = new NotesEntity();
    UUID testId = UUID.randomUUID();
    notesEntity.setId(testId);
    assertEquals(testId, notesEntity.getId());
  }

  @Test
  @DisplayName("Should set and get notes content")
  void shouldSetAndGetNotes() {
    NotesEntity notesEntity = new NotesEntity();
    String noteContent = "Updated note content";
    notesEntity.setNotes(noteContent);
    assertEquals(noteContent, notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should set and get user")
  void shouldSetAndGetUser() {
    NotesEntity notesEntity = new NotesEntity();
    notesEntity.setUser(testUser);
    assertEquals(testUser, notesEntity.getUser());
  }

  @Test
  @DisplayName("Should handle empty note content")
  void shouldHandleEmptyNoteContent() {
    NotesEntity notesEntity = new NotesEntity("", testUser);
    assertEquals("", notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should handle very long note content")
  void shouldHandleVeryLongNoteContent() {
    String longContent = "a".repeat(10000);
    NotesEntity notesEntity = new NotesEntity(longContent, testUser);
    assertEquals(longContent, notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should handle special characters in notes")
  void shouldHandleSpecialCharactersInNotes() {
    String specialContent = "Note with special chars: !@#$%^&*(){}[]|\\:\";<>?,./~`";
    NotesEntity notesEntity = new NotesEntity(specialContent, testUser);
    assertEquals(specialContent, notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should handle unicode characters in notes")
  void shouldHandleUnicodeCharactersInNotes() {
    String unicodeContent = "Unicode test: 你好世界 🌍 émojis ñ ü";
    NotesEntity notesEntity = new NotesEntity(unicodeContent, testUser);
    assertEquals(unicodeContent, notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should allow null notes content when set explicitly")
  void shouldAllowNullNotesContent() {
    NotesEntity notesEntity = new NotesEntity("initial", testUser);
    notesEntity.setNotes(null);
    assertNull(notesEntity.getNotes());
  }

  @Test
  @DisplayName("Should allow changing user")
  void shouldAllowChangingUser() {
    NotesEntity notesEntity = new NotesEntity("note", testUser);
    UserEntity newUser = new UserEntity();
    newUser.setUserName("newuser");
    newUser.setPasswordHash("newhash");
    
    notesEntity.setUser(newUser);
    assertEquals(newUser, notesEntity.getUser());
    assertEquals("newuser", notesEntity.getUser().getUserName());
  }
}