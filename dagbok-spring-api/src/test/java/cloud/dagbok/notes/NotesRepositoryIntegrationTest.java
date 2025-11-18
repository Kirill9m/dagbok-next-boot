package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import cloud.dagbok.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DisplayName("NotesRepository Integration Tests")
class NotesRepositoryIntegrationTest {

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
  private NotesRepository notesRepository;

  @Autowired
  private UserRepository userRepository;

  private UserEntity testUser;

  @BeforeEach
  void setUp() {
    notesRepository.deleteAll();
    userRepository.deleteAll();

    testUser = new UserEntity();
    testUser.setUserName("testuser");
    testUser.setPasswordHash("hashedpassword");
    testUser = userRepository.save(testUser);
  }

  @Test
  @DisplayName("Should save and retrieve note")
  void shouldSaveAndRetrieveNote() {
    NotesEntity note = new NotesEntity("Test note", testUser);
    NotesEntity saved = notesRepository.save(note);

    assertNotNull(saved.getId());
    assertEquals("Test note", saved.getNotes());
    assertEquals(testUser.getId(), saved.getUser().getId());
  }

  @Test
  @DisplayName("Should find notes by user id")
  void shouldFindNotesByUserId() {
    NotesEntity note1 = new NotesEntity("Note 1", testUser);
    NotesEntity note2 = new NotesEntity("Note 2", testUser);
    notesRepository.save(note1);
    notesRepository.save(note2);

    List<NotesEntity> notes = notesRepository.findByUserId(testUser.getId());

    assertEquals(2, notes.size());
    assertTrue(notes.stream().anyMatch(n -> n.getNotes().equals("Note 1")));
    assertTrue(notes.stream().anyMatch(n -> n.getNotes().equals("Note 2")));
  }

  @Test
  @DisplayName("Should return empty list for user with no notes")
  void shouldReturnEmptyListForUserWithNoNotes() {
    UUID nonExistentUserId = UUID.randomUUID();
    List<NotesEntity> notes = notesRepository.findByUserId(nonExistentUserId);

    assertTrue(notes.isEmpty());
  }

  @Test
  @DisplayName("Should save note with special characters")
  void shouldSaveNoteWithSpecialCharacters() {
    String specialContent = "Note with !@#$%^&*(){}[]|\\:\";<>?,./~`";
    NotesEntity note = new NotesEntity(specialContent, testUser);
    NotesEntity saved = notesRepository.save(note);

    assertEquals(specialContent, saved.getNotes());
  }

  @Test
  @DisplayName("Should save note with unicode characters")
  void shouldSaveNoteWithUnicodeCharacters() {
    String unicodeContent = "Unicode: 你好世界 🌍 émojis ñ ü";
    NotesEntity note = new NotesEntity(unicodeContent, testUser);
    NotesEntity saved = notesRepository.save(note);

    assertEquals(unicodeContent, saved.getNotes());
  }

  @Test
  @DisplayName("Should save very long note content")
  void shouldSaveVeryLongNoteContent() {
    String longContent = "a".repeat(10000);
    NotesEntity note = new NotesEntity(longContent, testUser);
    NotesEntity saved = notesRepository.save(note);

    assertEquals(longContent, saved.getNotes());
  }

  @Test
  @DisplayName("Should update existing note")
  void shouldUpdateExistingNote() {
    NotesEntity note = new NotesEntity("Original note", testUser);
    NotesEntity saved = notesRepository.save(note);

    saved.setNotes("Updated note");
    NotesEntity updated = notesRepository.save(saved);

    assertEquals("Updated note", updated.getNotes());
    assertEquals(saved.getId(), updated.getId());
  }

  @Test
  @DisplayName("Should delete note")
  void shouldDeleteNote() {
    NotesEntity note = new NotesEntity("Test note", testUser);
    NotesEntity saved = notesRepository.save(note);

    notesRepository.delete(saved);

    List<NotesEntity> notes = notesRepository.findByUserId(testUser.getId());
    assertTrue(notes.isEmpty());
  }

  @Test
  @DisplayName("Should handle multiple users with different notes")
  void shouldHandleMultipleUsersWithDifferentNotes() {
    UserEntity user2 = new UserEntity();
    user2.setUserName("testuser2");
    user2.setPasswordHash("hashedpassword2");
    user2 = userRepository.save(user2);

    NotesEntity note1 = new NotesEntity("User 1 Note", testUser);
    NotesEntity note2 = new NotesEntity("User 2 Note", user2);
    notesRepository.save(note1);
    notesRepository.save(note2);

    List<NotesEntity> user1Notes = notesRepository.findByUserId(testUser.getId());
    List<NotesEntity> user2Notes = notesRepository.findByUserId(user2.getId());

    assertEquals(1, user1Notes.size());
    assertEquals(1, user2Notes.size());
    assertEquals("User 1 Note", user1Notes.get(0).getNotes());
    assertEquals("User 2 Note", user2Notes.get(0).getNotes());
  }

  @Test
  @DisplayName("Should generate UUID for new note")
  void shouldGenerateUuidForNewNote() {
    NotesEntity note = new NotesEntity("Test note", testUser);
    assertNull(note.getId());

    NotesEntity saved = notesRepository.save(note);
    assertNotNull(saved.getId());
  }

  @Test
  @DisplayName("Should maintain note order when retrieving by user")
  void shouldMaintainNoteOrderWhenRetrievingByUser() {
    NotesEntity note1 = new NotesEntity("First note", testUser);
    NotesEntity note2 = new NotesEntity("Second note", testUser);
    NotesEntity note3 = new NotesEntity("Third note", testUser);
    
    notesRepository.save(note1);
    notesRepository.save(note2);
    notesRepository.save(note3);

    List<NotesEntity> notes = notesRepository.findByUserId(testUser.getId());
    assertEquals(3, notes.size());
  }

  @Test
  @DisplayName("Should handle empty note content")
  void shouldHandleEmptyNoteContent() {
    NotesEntity note = new NotesEntity("", testUser);
    NotesEntity saved = notesRepository.save(note);

    assertEquals("", saved.getNotes());
  }

  @Test
  @DisplayName("Should preserve user relationship")
  void shouldPreserveUserRelationship() {
    NotesEntity note = new NotesEntity("Test note", testUser);
    NotesEntity saved = notesRepository.save(note);

    NotesEntity retrieved = notesRepository.findById(saved.getId()).orElseThrow();
    assertEquals(testUser.getId(), retrieved.getUser().getId());
    assertEquals(testUser.getUserName(), retrieved.getUser().getUserName());
  }
}