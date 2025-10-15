package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import cloud.dagbok.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotesService {

  private final NotesRepository repository;
  private final UserRepository userRepository;


  public NotesService(NotesRepository repository, UserRepository userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  public List<Notes> getNotesByUser(UUID userId) {
    var notesEntity = repository.findByUserId(userId);

    return notesEntity.stream().map(this::entityToNote).toList();
  }

  @Transactional
  public Notes addNoteToUser(Notes userNotes) {
    UserEntity user = userRepository.findById(userNotes.userId())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    var entityToSave = new NotesEntity(userNotes.notes(), user);
    var savedEntity = repository.save(entityToSave);
    return entityToNote(savedEntity);
  }

  private Notes entityToNote(NotesEntity note) {
    return new Notes(
            note.getId(),
            note.getNotes(),
            note.getUser().getId());
  }
}
