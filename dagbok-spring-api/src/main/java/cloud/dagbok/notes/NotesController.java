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

  public NotesController(NotesService notesService) {
    this.notesService = notesService;
  }

  @PostMapping("/notes")
  public ResponseEntity<Notes> addUserNote(@Valid @RequestBody Notes userNotes) {
    log.info("New user note {}", userNotes);
    return ResponseEntity.status(201)
            .body(notesService.addNoteToUser(userNotes));
  }

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
