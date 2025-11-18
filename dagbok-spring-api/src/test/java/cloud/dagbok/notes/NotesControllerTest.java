package cloud.dagbok.notes;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotesController.class)
@DisplayName("NotesController Integration Tests")
class NotesControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private NotesService notesService;

  private UUID noteId;
  private UUID userId;
  private Notes testNote;

  @BeforeEach
  void setUp() {
    noteId = UUID.randomUUID();
    userId = UUID.randomUUID();
    testNote = new Notes(noteId, "Test note content", userId);
  }

  @Test
  @DisplayName("POST /notes - Should create note successfully")
  void shouldCreateNoteSuccessfully() throws Exception {
    Notes inputNote = new Notes(null, "New note", userId);
    when(notesService.addNoteToUser(any(Notes.class))).thenReturn(testNote);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(noteId.toString()))
        .andExpect(jsonPath("$.notes").value("Test note content"))
        .andExpect(jsonPath("$.userId").value(userId.toString()));

    verify(notesService, times(1)).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should return 400 for invalid request with null notes")
  void shouldReturn400ForNullNotes() throws Exception {
    String invalidJson = String.format("{\"id\":null,\"notes\":null,\"userId\":\"%s\"}", userId);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should return 400 for blank notes")
  void shouldReturn400ForBlankNotes() throws Exception {
    String invalidJson = String.format("{\"id\":null,\"notes\":\" \",\"userId\":\"%s\"}", userId);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should return 400 for missing userId")
  void shouldReturn400ForMissingUserId() throws Exception {
    String invalidJson = "{\"id\":null,\"notes\":\"Test note\",\"userId\":null}";

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should handle service exception")
  void shouldHandleServiceException() throws Exception {
    Notes inputNote = new Notes(null, "New note", userId);
    when(notesService.addNoteToUser(any(Notes.class)))
        .thenThrow(new IllegalArgumentException("User not found"));

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().is5xxServerError());
  }

  @Test
  @DisplayName("POST /notes - Should accept notes with special characters")
  void shouldAcceptNotesWithSpecialCharacters() throws Exception {
    String specialContent = "Note with !@#$%^&*() special chars";
    Notes inputNote = new Notes(null, specialContent, userId);
    Notes returnNote = new Notes(noteId, specialContent, userId);
    when(notesService.addNoteToUser(any(Notes.class))).thenReturn(returnNote);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.notes").value(specialContent));
  }

  @Test
  @DisplayName("POST /notes - Should accept notes with unicode characters")
  void shouldAcceptNotesWithUnicodeCharacters() throws Exception {
    String unicodeContent = "Unicode: 你好世界 🌍";
    Notes inputNote = new Notes(null, unicodeContent, userId);
    Notes returnNote = new Notes(noteId, unicodeContent, userId);
    when(notesService.addNoteToUser(any(Notes.class))).thenReturn(returnNote);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.notes").value(unicodeContent));
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should return notes for user")
  void shouldReturnNotesForUser() throws Exception {
    Notes note1 = new Notes(UUID.randomUUID(), "Note 1", userId);
    Notes note2 = new Notes(UUID.randomUUID(), "Note 2", userId);
    List<Notes> notes = Arrays.asList(note1, note2);

    when(notesService.getNotesByUser(userId)).thenReturn(notes);

    mockMvc.perform(get("/notes/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].notes").value("Note 1"))
        .andExpect(jsonPath("$[1].notes").value("Note 2"))
        .andExpect(jsonPath("$[0].userId").value(userId.toString()))
        .andExpect(jsonPath("$[1].userId").value(userId.toString()));

    verify(notesService, times(1)).getNotesByUser(userId);
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should return empty list when no notes found")
  void shouldReturnEmptyListWhenNoNotesFound() throws Exception {
    when(notesService.getNotesByUser(userId)).thenReturn(List.of());

    mockMvc.perform(get("/notes/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(0)));

    verify(notesService, times(1)).getNotesByUser(userId);
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should return 400 for invalid UUID")
  void shouldReturn400ForInvalidUuid() throws Exception {
    mockMvc.perform(get("/notes/{userId}", "invalid-uuid"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$", hasSize(0)));

    verify(notesService, never()).getNotesByUser(any(UUID.class));
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should return 400 for malformed UUID")
  void shouldReturn400ForMalformedUuid() throws Exception {
    mockMvc.perform(get("/notes/{userId}", "123-456-789"))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).getNotesByUser(any(UUID.class));
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should handle service exception")
  void shouldHandleServiceExceptionOnGet() throws Exception {
    when(notesService.getNotesByUser(userId))
        .thenThrow(new RuntimeException("Database error"));

    mockMvc.perform(get("/notes/{userId}", userId))
        .andExpect(status().is5xxServerError());
  }

  @Test
  @DisplayName("POST /notes - Should return 400 for malformed JSON")
  void shouldReturn400ForMalformedJson() throws Exception {
    String malformedJson = "{\"notes\":\"Test\",\"userId\":";

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(malformedJson))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should return 400 for empty request body")
  void shouldReturn400ForEmptyRequestBody() throws Exception {
    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(""))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }

  @Test
  @DisplayName("POST /notes - Should accept very long note content")
  void shouldAcceptVeryLongNoteContent() throws Exception {
    String longContent = "a".repeat(10000);
    Notes inputNote = new Notes(null, longContent, userId);
    Notes returnNote = new Notes(noteId, longContent, userId);
    when(notesService.addNoteToUser(any(Notes.class))).thenReturn(returnNote);

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.notes").value(longContent));
  }

  @Test
  @DisplayName("GET /notes/{userId} - Should handle multiple notes with same user")
  void shouldHandleMultipleNotesWithSameUser() throws Exception {
    List<Notes> manyNotes = Arrays.asList(
        new Notes(UUID.randomUUID(), "Note 1", userId),
        new Notes(UUID.randomUUID(), "Note 2", userId),
        new Notes(UUID.randomUUID(), "Note 3", userId),
        new Notes(UUID.randomUUID(), "Note 4", userId),
        new Notes(UUID.randomUUID(), "Note 5", userId)
    );

    when(notesService.getNotesByUser(userId)).thenReturn(manyNotes);

    mockMvc.perform(get("/notes/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(5)));

    verify(notesService, times(1)).getNotesByUser(userId);
  }

  @Test
  @DisplayName("POST /notes - Should validate all fields are present")
  void shouldValidateAllFieldsPresent() throws Exception {
    String incompleteJson = "{\"notes\":\"Test note\"}";

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(incompleteJson))
        .andExpect(status().isBadRequest());

    verify(notesService, never()).addNoteToUser(any(Notes.class));
  }
}