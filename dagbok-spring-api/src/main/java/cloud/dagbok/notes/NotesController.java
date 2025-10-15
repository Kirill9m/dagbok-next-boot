package cloud.dagbok.notes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class NotesController {
  private static final Logger log = LoggerFactory.getLogger(NotesController.class);
  private final NotesService notesService;

  public NotesController(NotesService notesService) {
    this.notesService = notesService;
  }

  @PostMapping("/notes")
  public ResponseEntity<Notes> addUserNote(@RequestBody Notes userNotes) {
    log.info("New user note {}", userNotes);
    return ResponseEntity.ok(notesService.addNoteToUser(userNotes));
  }

  @GetMapping("/notes/{userId}")
  public ResponseEntity<List<Notes>> getUserNotes(@PathVariable String userId) {
    log.info("Fetching notes for user: {}", userId);
    UUID userUuid;
    try {
      userUuid = UUID.fromString(userId);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }

    return ResponseEntity.ok(notesService.getNotesByUser(userUuid));
  }
}
