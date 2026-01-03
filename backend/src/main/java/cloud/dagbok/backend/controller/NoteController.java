package cloud.dagbok.backend.controller;

import cloud.dagbok.backend.dto.note.Note;
import cloud.dagbok.backend.dto.note.NoteCreateRequest;
import cloud.dagbok.backend.dto.note.NoteItemWithDate;
import cloud.dagbok.backend.dto.note.NoteNew;
import cloud.dagbok.backend.dto.note.NoteResponse;
import cloud.dagbok.backend.dto.user.Principal;
import cloud.dagbok.backend.service.NoteService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
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

    Principal principal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(principal, "Principal cannot be null");

    log.info("Received note request: {}", request);
    var createdNote = noteService.createNewUserNote(request, principal.userId());
    log.info("Created note: {}", createdNote);
    return ResponseEntity.status(201).body(createdNote);
  }

  @DeleteMapping("/notes/{noteId}")
  public ResponseEntity<Note> deleteNote(@PathVariable Long noteId, Authentication authentication) {

    Principal apiPrincipal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(apiPrincipal, "Principal cannot be null");

    log.info(
        "Received request to delete note with id: {} for user with id: {}",
        noteId,
        apiPrincipal.userId());
    var deleteNote = noteService.deleteNote(noteId, apiPrincipal.userId());
    log.info("Deleted note with id: {}", deleteNote.id());
    return ResponseEntity.ok(deleteNote);
  }

  @GetMapping("/notes/user")
  public ResponseEntity<NoteResponse> getNotesByDate(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      Authentication authentication) {
    Principal principal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(principal, "Principal cannot be null");

    LocalDateTime dateTime = date.atStartOfDay();

    log.info("User: {} requested notes for date: {}", principal.userId(), date);
    return ResponseEntity.ok(noteService.getNoteByDate(principal.userId(), dateTime));
  }

  @GetMapping("/notes/counts/{year}/{month}")
  public ResponseEntity<NoteItemWithDate> getNoteCountsByMonth(
      @PathVariable int year, @PathVariable int month, Authentication authentication) {
    if (month < 1 || month > 12) {
      throw new IllegalArgumentException("Month must be between 1 and 12");
    }
    if (year < 1900 || year > 2100) {
      throw new IllegalArgumentException("Year must be between 1900 and 2100");
    }
    Principal principal = (Principal) authentication.getPrincipal();
    Objects.requireNonNull(principal, "Principal cannot be null");

    log.info(
        "User: {} requested note counts for year: {} and month: {}",
        principal.userId(),
        year,
        month);

    NoteItemWithDate noteCounts = noteService.getNotesByMonth(principal.userId(), year, month);
    return ResponseEntity.ok(noteCounts);
  }
}
