package cloud.dagbok.service;

import jakarta.persistence.EntityNotFoundException;
import cloud.dagbok.dto.note.Note;
import cloud.dagbok.dto.note.NoteNew;
import cloud.dagbok.dto.note.NoteResponse;
import cloud.dagbok.dto.user.UserNotes;
import cloud.dagbok.entity.NoteEntity;
import cloud.dagbok.entity.UserEntity;
import cloud.dagbok.repository.NoteRepository;
import cloud.dagbok.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class NoteService {
  private final UserRepository userRepository;
  private final NoteRepository noteRepository;

  public NoteService(UserRepository userRepository, NoteRepository noteRepository) {
    this.userRepository = userRepository;
    this.noteRepository = noteRepository;
  }

  @Transactional
  public NoteNew createNewUserNote(Note note, Long userId) {
    UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId)
    );

    var savedEntity = noteRepository.save(new NoteEntity(null, user, note.value(), null, null));
    return new NoteNew(
            savedEntity.getId(),
            savedEntity.getValue(),
            savedEntity.getCreatedAt()
    );
  }

  @Transactional(readOnly = true)
  public UserNotes findUserAndGetNotes(String email) {
    UserEntity user = userRepository
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

    return new UserNotes(
            user.getName(),
            user.getNotes().stream().filter(note -> note.getDeletedAt() == null)
                    .map(note -> new NoteResponse(
                            note.getId(),
                            note.getValue())).toList());

  }

  @Transactional
  public Note deleteNote(Long noteId, Long userId) {
    NoteEntity noteToDelete = noteRepository.findByIdAndUserIdAndDeletedAtIsNull(noteId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found with id: " + noteId + " for user with id: " + userId));

    noteToDelete.setDeletedAt(LocalDateTime.now());
    var deletedNote = noteRepository.save(noteToDelete);

    return new Note(
            deletedNote.getId(),
            deletedNote.getValue(),
            deletedNote.getUser().getId(),
            deletedNote.getCreatedAt(),
            deletedNote.getDeletedAt()
    );
  }
}

