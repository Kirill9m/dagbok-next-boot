package cloud.dagbok.notes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    return ResponseEntity.status(200).
            body(notesService.addNoteToUser(userNotes));
  }

  @GetMapping("/notes")
  public ResponseEntity<List<Notes>> getUserNotes(@RequestBody Notes userNotes) {
    log.info("{} notes by user", userNotes);
    return ResponseEntity.status(200).body(notesService.getNotesByUser(userNotes.userId()));
  }
}
