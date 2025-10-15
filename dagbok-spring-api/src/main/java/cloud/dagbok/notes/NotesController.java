package cloud.dagbok.notes;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Slf4j
public class NotesController {
  private final NotesService notesService;

  /**
   * Create a NotesController that delegates note operations to the provided service.
   *
   * @param notesService the service used to manage and retrieve notes for users
   */
  public NotesController(NotesService notesService) {
    this.notesService = notesService;
  }

  /**
   * Create a new note for a user.
   *
   * @param userNotes the note to create; validated before persistence
   * @return a ResponseEntity with the created note in the body and HTTP 201 Created status
   */
  @PostMapping("/notes")
  public ResponseEntity<Notes> addUserNote(@Valid @RequestBody Notes userNotes) {
    log.info("New user note {}", userNotes);
    return ResponseEntity.status(201)
            .body(notesService.addNoteToUser(userNotes));
  }

  /**
   * Fetches notes for the user identified by the given UUID string.
   *
   * @param userId a string representation of the user's UUID; must be a valid UUID
   * @return a ResponseEntity containing the list of Notes for the specified user (HTTP 200),
   *         or a 400 Bad Request with an empty list if `userId` is not a valid UUID
   */
  @GetMapping("/notes/{userId}")
  public ResponseEntity<List<Notes>> getUserNotes(@PathVariable String userId) {
    log.info("Fetching notes for user: {}", userId);
    UUID userUuid;
    try {
      userUuid = UUID.fromString(userId);
    } catch (IllegalArgumentException e) {
      log.warn("Invalid UUID format for userId: {}", userId);
      return ResponseEntity.badRequest()
              .body(List.of());
    }

    return ResponseEntity.ok(notesService.getNotesByUser(userUuid));
  }
}