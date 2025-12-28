package cloud.dagbok.backend.service;

import cloud.dagbok.backend.dto.note.*;
import cloud.dagbok.backend.entity.NoteEntity;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.repository.NoteRepository;
import cloud.dagbok.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteService {
  private final UserRepository userRepository;
  private final NoteRepository noteRepository;
  private final OpenRouterService openRouterService;
  private static final Logger logger = LoggerFactory.getLogger(NoteService.class);

  @Value("${openrouter.model}")
  private String openRouterModel;

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

    if (request.prompt() != null && request.prompt()) {
      String userPrompt =
          user.getPrompt() != null
              ? user.getPrompt()
                  + " Today is: "
                  + request.date().toLocalDate()
                  + " I'm: "
                  + user.getName()
              : "";
      try {
        textToSave = openRouterService.chat(openRouterModel, userPrompt, request.text());
      } catch (Exception e) {
        logger.error("AI generation failed for user {}, falling back to original text", userId, e);
        textToSave = request.text();
      }
    } else {
      textToSave = request.text();
    }

    return saveNote(user, textToSave, request.date().toLocalDate());
  }

  @Transactional
  protected NoteNew saveNote(UserEntity user, String text, LocalDate date) {
    NoteEntity savedEntity =
        noteRepository.save(new NoteEntity(null, user, text, date, null, null));
    return new NoteNew(savedEntity.getId(), savedEntity.getText(), savedEntity.getDate());
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
}
