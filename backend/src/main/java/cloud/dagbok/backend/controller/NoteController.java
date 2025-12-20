package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.note.Note;
import cloud.dagbok.backend.dto.note.NoteCreateRequest;
import cloud.dagbok.backend.dto.note.NoteNew;
import cloud.dagbok.backend.dto.user.ApiPrincipal;
import cloud.dagbok.backend.dto.user.UserNotes;
import cloud.dagbok.backend.service.NoteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NoteController {
  private final NoteService noteService;
  private static final Logger log = LoggerFactory.getLogger(NoteController.class);

  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  @PostMapping("/notes")
  public ResponseEntity<NoteNew> createNote(
      @Valid @RequestBody NoteCreateRequest request, Authentication authentication) {

    ApiPrincipal apiPrincipal = (ApiPrincipal) authentication.getPrincipal();

    log.info("Received note request: {}", request);
    assert apiPrincipal != null;
    var createdNote = noteService.createNewUserNote(request, apiPrincipal.userId());
    log.info("Created note: {}", createdNote);
    return ResponseEntity.status(201).body(createdNote);
  }

  @DeleteMapping("/notes/{noteId}")
  public ResponseEntity<Note> deleteNote(@PathVariable Long noteId, Authentication authentication) {

    ApiPrincipal apiPrincipal = (ApiPrincipal) authentication.getPrincipal();

    assert apiPrincipal != null;
    log.info(
        "Received request to delete note with id: {} for user with id: {}",
        noteId,
        apiPrincipal.userId());
    var deleteNote = noteService.deleteNote(noteId, apiPrincipal.userId());
    log.info("Deleted note with id: {}", deleteNote.id());
    return ResponseEntity.ok(deleteNote);
  }

  @GetMapping("/notes/user")
  public ResponseEntity<UserNotes> getUserById(Authentication authentication) {
    ApiPrincipal apiPrincipal = (ApiPrincipal) authentication.getPrincipal();
    assert apiPrincipal != null;
    log.info("User: {} requested notes", apiPrincipal.userId());
    return ResponseEntity.ok(noteService.findUserAndGetNotes(apiPrincipal.email()));
  }
}
