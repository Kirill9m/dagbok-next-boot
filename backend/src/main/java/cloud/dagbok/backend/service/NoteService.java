package cloud.dagbok.backend.service;

import cloud.dagbok.backend.dto.note.*;
import cloud.dagbok.backend.entity.NoteEntity;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.exceptionHandler.MonthlyCostLimitExceededException;
import cloud.dagbok.backend.repository.NoteRepository;
import cloud.dagbok.backend.repository.UserRepository;
import cloud.dagbok.backend.utils.PromptUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteService {
  private final UserRepository userRepository;
  private final NoteRepository noteRepository;
  private final OpenRouterService openRouterService;
  private static final Logger logger = LoggerFactory.getLogger(NoteService.class);
  private static final double SEK_MULTIPLIER = 9.5;

  public NoteService(
      UserRepository userRepository,
      NoteRepository noteRepository,
      OpenRouterService openRouterService) {
    this.userRepository = userRepository;
    this.noteRepository = noteRepository;
    this.openRouterService = openRouterService;
  }

  public NoteNew createNewUserNote(NoteCreateRequest request, Long userId) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

    String textToSave;
    Integer tokens = null;
    Double cost = null;

    if (request.prompt() != null && request.prompt()) {
      try {
        PromptUtil.ChatResult result =
            openRouterService.chat(user.getModel().getValue(), user.getPrompt(), request.text());

        textToSave =
            result.text() + signature(request.date().toLocalDate().toString(), user.getName());
        tokens = result.totalTokens();
        cost = result.costUSD();

        logger.info(
            "AI generation for user {}: {} tokens, USD: {}",
            userId,
            result.totalTokens(),
            result.costUSD());

        if (cost != null && cost > 0) {
          LocalDate now = LocalDate.now();
          Double totalMonthlyCost =
              noteRepository.getTotalCostUSDByUserIdByMonth(
                  user.getId(), now.getYear(), now.getMonthValue());

          if (totalMonthlyCost != null && totalMonthlyCost > 0.1) {
            throw new MonthlyCostLimitExceededException(totalMonthlyCost);
          }
        }

      } catch (MonthlyCostLimitExceededException e) {
        throw e;
      } catch (Exception e) {
        logger.error("AI generation failed for user {}, falling back to original text", userId, e);
        textToSave =
            request.text() + signature(request.date().toLocalDate().toString(), user.getName());
      }
    } else {
      textToSave =
          request.text() + signature(request.date().toLocalDate().toString(), user.getName());
    }

    NoteNew savedNote = saveNote(user, textToSave, request.date().toLocalDate(), tokens, cost);

    if (cost != null && cost > 0) {
      LocalDate now = LocalDate.now();
      Double totalMonthlyCost =
          noteRepository.getTotalCostUSDByUserIdByMonth(
              user.getId(), now.getYear(), now.getMonthValue());
      user.setMonthlyCost(totalMonthlyCost);
      userRepository.save(user);
    }

    return savedNote;
  }

  @Transactional
  protected NoteNew saveNote(
      UserEntity user, String text, LocalDate date, Integer tokens, Double cost) {
    NoteEntity note = new NoteEntity();
    note.setUser(user);
    note.setText(text);
    note.setDate(date);
    note.setTokensUsed(tokens);
    note.setCostUSD(cost != null ? cost * SEK_MULTIPLIER : 0.0);

    noteRepository.save(note);
    return convertToDTO(note);
  }

  private NoteNew convertToDTO(NoteEntity note) {
    return new NoteNew(
        note.getId(),
        note.getText(),
        note.getDate(),
        note.getCostUSD() != null ? note.getCostUSD() : 0.0);
  }

  @Transactional
  public Note deleteNote(Long noteId, Long userId) {
    NoteEntity noteToDelete =
        noteRepository
            .findByIdAndUserIdAndDeletedAtIsNull(noteId, userId)
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Note not found with id: " + noteId + " for user with id: " + userId));

    noteToDelete.setDeletedAt(LocalDateTime.now());
    var deletedNote = noteRepository.save(noteToDelete);

    return new Note(
        deletedNote.getId(),
        deletedNote.getText(),
        deletedNote.getUser().getId(),
        deletedNote.getCreatedAt(),
        deletedNote.getDeletedAt());
  }

  @Transactional(readOnly = true)
  public NoteResponse getNoteByDate(Long userId, LocalDateTime dateTime) {
    LocalDate date = dateTime.toLocalDate();

    List<NoteEntity> entities = noteRepository.findByDateAndUserIdAndDeletedAtIsNull(date, userId);

    List<NoteItem> notes =
        entities.stream().map(e -> new NoteItem(e.getId(), e.getText())).toList();

    return new NoteResponse(notes);
  }

  @Transactional(readOnly = true)
  public NoteItemWithDate getNotesByMonth(Long userId, int year, int month) {
    if (month < 1 || month > 12) {
      throw new IllegalArgumentException("Month must be between 1 and 12, got: " + month);
    }
    if (year < 1900 || year > 2100) {
      throw new IllegalArgumentException("Year must be between 1900 and 2100, got: " + year);
    }
    List<NotesCountByDate> counts = noteRepository.countNotesByDate(userId, year, month);
    return new NoteItemWithDate(counts);
  }

  @Transactional
  public Note updateUserNote(Long id, @NotBlank String text, Long userId) {
    NoteEntity noteEntity =
        noteRepository
            .findByIdAndUserIdAndDeletedAtIsNull(id, userId)
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Note not found with id: " + id + " for user with id: " + userId));

    noteEntity.setText(text);
    NoteEntity updatedEntity = noteRepository.save(noteEntity);
    return new Note(
        updatedEntity.getId(),
        updatedEntity.getText(),
        updatedEntity.getUser().getId(),
        updatedEntity.getCreatedAt(),
        updatedEntity.getDeletedAt());
  }

  private String signature(String date, String name) {
    return """

    ***

    **%s**

    **%s**

    Generated with ❤️ by dagbok.cloud
    """
        .formatted(date, name);
  }

  @Transactional(readOnly = true)
  public NoteResponse findNotesByText(Long userId, String searchText) {
    List<NoteEntity> entities =
        noteRepository.findByTextContainingIgnoreCaseAndUserIdAndDeletedAtIsNull(
            searchText, userId);

    List<NoteItem> notes =
        entities.stream().map(e -> new NoteItem(e.getId(), e.getText())).toList();

    return new NoteResponse(notes);
  }
}
