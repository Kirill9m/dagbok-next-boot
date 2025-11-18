package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import cloud.dagbok.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
@DisplayName("NotesService Integration Tests")
class NotesServiceIntegrationTest {

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
  private NotesService notesService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotesRepository notesRepository;

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
  @DisplayName("Should add note to user and retrieve it")
  void shouldAddNoteToUserAndRetrieveIt() {
    Notes inputNote = new Notes(null, "Integration test note", testUser.getId());
    Notes savedNote = notesService.addNoteToUser(inputNote);

    assertNotNull(savedNote.id());
    assertEquals("Integration test note", savedNote.notes());
    assertEquals(testUser.getId(), savedNote.userId());

    List<Notes> retrievedNotes = notesService.getNotesByUser(testUser.getId());
    assertEquals(1, retrievedNotes.size());
    assertEquals(savedNote.id(), retrievedNotes.get(0).id());
  }

  @Test
  @DisplayName("Should throw exception when adding note to non-existent user")
  void shouldThrowExceptionWhenAddingNoteToNonExistentUser() {
    UUID nonExistentUserId = UUID.randomUUID();
    Notes inputNote = new Notes(null, "Test note", nonExistentUserId);

    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> notesService.addNoteToUser(inputNote)
    );

    assertEquals("User not found", exception.getMessage());
  }

  @Test
  @DisplayName("Should retrieve multiple notes for user")
  void shouldRetrieveMultipleNotesForUser() {
    notesService.addNoteToUser(new Notes(null, "Note 1", testUser.getId()));
    notesService.addNoteToUser(new Notes(null, "Note 2", testUser.getId()));
    notesService.addNoteToUser(new Notes(null, "Note 3", testUser.getId()));

    List<Notes> notes = notesService.getNotesByUser(testUser.getId());

    assertEquals(3, notes.size());
    assertTrue(notes.stream().anyMatch(n -> n.notes().equals("Note 1")));
    assertTrue(notes.stream().anyMatch(n -> n.notes().equals("Note 2")));
    assertTrue(notes.stream().anyMatch(n -> n.notes().equals("Note 3")));
  }

  @Test
  @DisplayName("Should handle concurrent note additions")
  void shouldHandleConcurrentNoteAdditions() {
    notesService.addNoteToUser(new Notes(null, "Concurrent note 1", testUser.getId()));
    notesService.addNoteToUser(new Notes(null, "Concurrent note 2", testUser.getId()));

    List<Notes> notes = notesService.getNotesByUser(testUser.getId());
    assertEquals(2, notes.size());
  }

  @Test
  @DisplayName("Should isolate notes between different users")
  void shouldIsolateNotesBetweenDifferentUsers() {
    UserEntity user2 = new UserEntity();
    user2.setUserName("testuser2");
    user2.setPasswordHash("hashedpassword2");
    user2 = userRepository.save(user2);

    notesService.addNoteToUser(new Notes(null, "User 1 Note", testUser.getId()));
    notesService.addNoteToUser(new Notes(null, "User 2 Note", user2.getId()));

    List<Notes> user1Notes = notesService.getNotesByUser(testUser.getId());
    List<Notes> user2Notes = notesService.getNotesByUser(user2.getId());

    assertEquals(1, user1Notes.size());
    assertEquals(1, user2Notes.size());
    assertEquals("User 1 Note", user1Notes.get(0).notes());
    assertEquals("User 2 Note", user2Notes.get(0).notes());
  }

  @Test
  @DisplayName("Should persist notes with special characters")
  void shouldPersistNotesWithSpecialCharacters() {
    String specialNote = "Note with !@#$%^&*() chars";
    Notes inputNote = new Notes(null, specialNote, testUser.getId());
    Notes savedNote = notesService.addNoteToUser(inputNote);

    List<Notes> retrievedNotes = notesService.getNotesByUser(testUser.getId());
    assertEquals(specialNote, retrievedNotes.get(0).notes());
  }

  @Test
  @DisplayName("Should persist notes with unicode characters")
  void shouldPersistNotesWithUnicodeCharacters() {
    String unicodeNote = "Unicode: 你好世界 🌍";
    Notes inputNote = new Notes(null, unicodeNote, testUser.getId());
    Notes savedNote = notesService.addNoteToUser(inputNote);

    List<Notes> retrievedNotes = notesService.getNotesByUser(testUser.getId());
    assertEquals(unicodeNote, retrievedNotes.get(0).notes());
  }

  @Test
  @DisplayName("Should handle very long note content")
  void shouldHandleVeryLongNoteContent() {
    String longNote = "a".repeat(10000);
    Notes inputNote = new Notes(null, longNote, testUser.getId());
    Notes savedNote = notesService.addNoteToUser(inputNote);

    List<Notes> retrievedNotes = notesService.getNotesByUser(testUser.getId());
    assertEquals(longNote, retrievedNotes.get(0).notes());
  }
}