package cloud.dagbok.backend.controller;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import cloud.dagbok.backend.dto.note.Model;
import cloud.dagbok.backend.dto.note.NoteCreateRequest;
import cloud.dagbok.backend.dto.note.NoteNew;
import cloud.dagbok.backend.entity.NoteEntity;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.exceptionHandler.MonthlyCostLimitExceededException;
import cloud.dagbok.backend.repository.NoteRepository;
import cloud.dagbok.backend.repository.UserRepository;
import cloud.dagbok.backend.service.NoteService;
import cloud.dagbok.backend.service.OpenRouterService;
import cloud.dagbok.backend.utils.PromptUtil;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NoteServiceNoteCreateTest {

  @Mock private UserRepository userRepository;

  @Mock private NoteRepository noteRepository;

  @Mock private OpenRouterService openRouterService;

  @InjectMocks private NoteService noteService;

  @Captor private ArgumentCaptor<NoteEntity> noteCaptor;

  @Test
  void createNewUserNote_promptTrue_aiSuccess_savesAiTextAndCost() {
    UUID userId = UUID.randomUUID();
    UserEntity user = new UserEntity();
    user.setId(userId);
    user.setUsername("testUser");

    Model model = Model.GPT_4O_MINI;
    user.setModel(model);
    user.setPrompt("system prompt");

    when(userRepository.findById(userId)).thenReturn(Optional.of(user));

    LocalDateTime noteDate = LocalDateTime.of(2025, 1, 1, 10, 0);
    NoteCreateRequest request = new NoteCreateRequest("original text", noteDate, true);

    PromptUtil.ChatResult chatResult =
        new PromptUtil.ChatResult("AI text", 200, 100, 100, 0.50); // cost = 0.50$

    when(openRouterService.chat(
            eq(user.getModel().getValue()), eq(user.getPrompt()), eq(request.text())))
        .thenReturn(chatResult);

    when(noteRepository.getTotalCostUSDByUserIdByMonth(eq(userId), anyInt(), anyInt()))
        .thenReturn(0.005);

    when(noteRepository.save(any(NoteEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    NoteNew result = noteService.createNewUserNote(request, userId);

    verify(openRouterService).chat(user.getModel().getValue(), user.getPrompt(), request.text());

    verify(noteRepository).save(noteCaptor.capture());
    NoteEntity savedNote = noteCaptor.getValue();

    assertThat(savedNote.getUser()).isEqualTo(user);
    assertThat(savedNote.getDate()).isEqualTo(noteDate.toLocalDate());
    assertThat(savedNote.getTokensUsed()).isEqualTo(200);
    assertThat(savedNote.getCostUSD()).isEqualTo(0.50);

    assertThat(savedNote.getText()).startsWith("AI text");
    assertThat(savedNote.getText()).contains("testUser");

    verify(userRepository).save(user);
  }

  @Test
  void createNewUserNote_promptTrue_aiThrowsGenericException_fallsBackToOriginalText() {
    UUID userId = UUID.randomUUID();
    UserEntity user = new UserEntity();
    user.setId(userId);
    user.setUsername("testUser");
    Model model = Model.GPT_4O_MINI;
    user.setModel(model);
    user.setPrompt("system prompt");

    when(userRepository.findById(userId)).thenReturn(Optional.of(user));

    LocalDateTime noteDate = LocalDateTime.of(2025, 1, 1, 10, 0);
    NoteCreateRequest request = new NoteCreateRequest("original text", noteDate, true);

    when(openRouterService.chat(any(), any(), any())).thenThrow(new RuntimeException("AI error"));

    when(noteRepository.save(any(NoteEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    NoteNew result = noteService.createNewUserNote(request, userId);

    verify(openRouterService).chat(any(), any(), any());

    verify(noteRepository).save(noteCaptor.capture());
    NoteEntity savedNote = noteCaptor.getValue();

    assertThat(savedNote.getTokensUsed()).isNull();
    assertThat(savedNote.getCostUSD()).isEqualTo(0.0);

    assertThat(savedNote.getText()).startsWith("original text");
    assertThat(savedNote.getText()).contains("testUser");

    verify(userRepository, never()).save(user);
  }

  @Test
  void createNewUserNote_promptTrue_monthlyLimitExceeded_throwsException() {
    UUID userId = UUID.randomUUID();
    UserEntity user = new UserEntity();
    user.setId(userId);
    user.setUsername("testUser");
    Model model = Model.GPT_4O_MINI;
    user.setModel(model);
    user.setPrompt("system prompt");

    when(userRepository.findById(userId)).thenReturn(Optional.of(user));

    LocalDateTime noteDate = LocalDateTime.now();
    NoteCreateRequest request = new NoteCreateRequest("text", noteDate, true);

    PromptUtil.ChatResult chatResult =
        new PromptUtil.ChatResult("AI text", 200, 100, 100, 1.0); // cost > 0

    when(openRouterService.chat(any(), any(), any())).thenReturn(chatResult);

    when(noteRepository.getTotalCostUSDByUserIdByMonth(eq(userId), anyInt(), anyInt()))
        .thenReturn(1.5);

    assertThatThrownBy(() -> noteService.createNewUserNote(request, userId))
        .isInstanceOf(MonthlyCostLimitExceededException.class);

    verify(noteRepository, never()).save(any());
  }

  @Test
  void createNewUserNote_promptFalse_aiNotCalled() {
    UUID userId = UUID.randomUUID();
    UserEntity user = new UserEntity();
    user.setId(userId);
    user.setUsername("testUser");
    when(userRepository.findById(userId)).thenReturn(Optional.of(user));

    LocalDateTime noteDate = LocalDateTime.now();
    NoteCreateRequest request = new NoteCreateRequest("some text", noteDate, false);

    when(noteRepository.save(any(NoteEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    NoteNew result = noteService.createNewUserNote(request, userId);

    verify(openRouterService, never()).chat(any(), any(), any());
    verify(noteRepository).save(any(NoteEntity.class));
  }

  @Test
  void createNewUserNote_userNotFound_throwsEntityNotFound() {
    UUID userId = UUID.randomUUID();
    when(userRepository.findById(userId)).thenReturn(Optional.empty());

    LocalDateTime noteDate = LocalDateTime.now();
    NoteCreateRequest request = new NoteCreateRequest("text", noteDate, false);

    assertThatThrownBy(() -> noteService.createNewUserNote(request, userId))
        .isInstanceOf(EntityNotFoundException.class);
  }
}
