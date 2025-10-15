package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import cloud.dagbok.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotesService Tests")
class NotesServiceTest {

  @Mock
  private NotesRepository notesRepository;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private NotesService notesService;

  private UserEntity testUser;
  private UUID testUserId;
  private UUID noteId;

  @BeforeEach
  void setUp() {
    testUserId = UUID.randomUUID();
    noteId = UUID.randomUUID();
    testUser = new UserEntity();
    testUser.setUserName("testuser");
    testUser.setPasswordHash("hashedpassword");
    // Simulate the ID that would be set by JPA
    testUser = new UserEntity(testUserId, "testuser", "hashedpassword", null);
  }

  @Test
  @DisplayName("Should get notes by user successfully")
  void shouldGetNotesByUserSuccessfully() {
    NotesEntity note1 = new NotesEntity("Note 1", testUser);
    note1.setId(UUID.randomUUID());
    NotesEntity note2 = new NotesEntity("Note 2", testUser);
    note2.setId(UUID.randomUUID());
    List<NotesEntity> notesEntities = Arrays.asList(note1, note2);

    when(notesRepository.findByUserId(testUserId)).thenReturn(notesEntities);

    List<Notes> result = notesService.getNotesByUser(testUserId);

    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("Note 1", result.get(0).notes());
    assertEquals("Note 2", result.get(1).notes());
    assertEquals(testUserId, result.get(0).userId());
    assertEquals(testUserId, result.get(1).userId());
    verify(notesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  @DisplayName("Should return empty list when user has no notes")
  void shouldReturnEmptyListWhenUserHasNoNotes() {
    when(notesRepository.findByUserId(testUserId)).thenReturn(List.of());

    List<Notes> result = notesService.getNotesByUser(testUserId);

    assertNotNull(result);
    assertTrue(result.isEmpty());
    verify(notesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  @DisplayName("Should add note to user successfully")
  void shouldAddNoteToUserSuccessfully() {
    Notes inputNotes = new Notes(null, "New note", testUserId);
    NotesEntity savedEntity = new NotesEntity("New note", testUser);
    savedEntity.setId(noteId);

    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(notesRepository.save(any(NotesEntity.class))).thenReturn(savedEntity);

    Notes result = notesService.addNoteToUser(inputNotes);

    assertNotNull(result);
    assertEquals(noteId, result.id());
    assertEquals("New note", result.notes());
    assertEquals(testUserId, result.userId());
    verify(userRepository, times(1)).findById(testUserId);
    verify(notesRepository, times(1)).save(any(NotesEntity.class));
  }

  @Test
  @DisplayName("Should throw exception when user not found")
  void shouldThrowExceptionWhenUserNotFound() {
    Notes inputNotes = new Notes(null, "New note", testUserId);
    when(userRepository.findById(testUserId)).thenReturn(Optional.empty());

    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> notesService.addNoteToUser(inputNotes)
    );

    assertEquals("User not found", exception.getMessage());
    verify(userRepository, times(1)).findById(testUserId);
    verify(notesRepository, never()).save(any(NotesEntity.class));
  }

  @Test
  @DisplayName("Should handle adding note with special characters")
  void shouldHandleAddingNoteWithSpecialCharacters() {
    String specialNote = "Note with special: !@#$%^&*()";
    Notes inputNotes = new Notes(null, specialNote, testUserId);
    NotesEntity savedEntity = new NotesEntity(specialNote, testUser);
    savedEntity.setId(noteId);

    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(notesRepository.save(any(NotesEntity.class))).thenReturn(savedEntity);

    Notes result = notesService.addNoteToUser(inputNotes);

    assertEquals(specialNote, result.notes());
    verify(notesRepository, times(1)).save(any(NotesEntity.class));
  }

  @Test
  @DisplayName("Should handle adding very long note")
  void shouldHandleAddingVeryLongNote() {
    String longNote = "a".repeat(10000);
    Notes inputNotes = new Notes(null, longNote, testUserId);
    NotesEntity savedEntity = new NotesEntity(longNote, testUser);
    savedEntity.setId(noteId);

    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(notesRepository.save(any(NotesEntity.class))).thenReturn(savedEntity);

    Notes result = notesService.addNoteToUser(inputNotes);

    assertEquals(longNote, result.notes());
    verify(notesRepository, times(1)).save(any(NotesEntity.class));
  }

  @Test
  @DisplayName("Should handle unicode characters in notes")
  void shouldHandleUnicodeCharactersInNotes() {
    String unicodeNote = "Unicode test: 你好世界 🌍 émojis";
    Notes inputNotes = new Notes(null, unicodeNote, testUserId);
    NotesEntity savedEntity = new NotesEntity(unicodeNote, testUser);
    savedEntity.setId(noteId);

    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(notesRepository.save(any(NotesEntity.class))).thenReturn(savedEntity);

    Notes result = notesService.addNoteToUser(inputNotes);

    assertEquals(unicodeNote, result.notes());
  }

  @Test
  @DisplayName("Should handle multiple notes retrieval for same user")
  void shouldHandleMultipleNotesRetrievalForSameUser() {
    NotesEntity note1 = new NotesEntity("Note 1", testUser);
    note1.setId(UUID.randomUUID());
    NotesEntity note2 = new NotesEntity("Note 2", testUser);
    note2.setId(UUID.randomUUID());
    NotesEntity note3 = new NotesEntity("Note 3", testUser);
    note3.setId(UUID.randomUUID());
    
    when(notesRepository.findByUserId(testUserId))
        .thenReturn(Arrays.asList(note1, note2, note3));

    List<Notes> result = notesService.getNotesByUser(testUserId);

    assertEquals(3, result.size());
    verify(notesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  @DisplayName("Should verify entity to DTO conversion")
  void shouldVerifyEntityToDtoConversion() {
    NotesEntity entity = new NotesEntity("Test note", testUser);
    entity.setId(noteId);

    when(notesRepository.findByUserId(testUserId)).thenReturn(List.of(entity));

    List<Notes> result = notesService.getNotesByUser(testUserId);

    assertEquals(1, result.size());
    Notes dto = result.get(0);
    assertEquals(entity.getId(), dto.id());
    assertEquals(entity.getNotes(), dto.notes());
    assertEquals(testUser.getId(), dto.userId());
  }

  @Test
  @DisplayName("Should handle repository exception during save")
  void shouldHandleRepositoryExceptionDuringSave() {
    Notes inputNotes = new Notes(null, "New note", testUserId);
    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(notesRepository.save(any(NotesEntity.class)))
        .thenThrow(new RuntimeException("Database error"));

    assertThrows(RuntimeException.class, () -> notesService.addNoteToUser(inputNotes));
    verify(userRepository, times(1)).findById(testUserId);
  }

  @Test
  @DisplayName("Should handle repository exception during retrieval")
  void shouldHandleRepositoryExceptionDuringRetrieval() {
    when(notesRepository.findByUserId(testUserId))
        .thenThrow(new RuntimeException("Database error"));

    assertThrows(RuntimeException.class, () -> notesService.getNotesByUser(testUserId));
  }
}