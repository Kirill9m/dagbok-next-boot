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


  /**
   * Creates a NotesService configured with the required repositories.
   *
   * @param repository     repository used for CRUD operations on NotesEntity
   * @param userRepository repository used to access UserEntity data
   */
  public NotesService(NotesRepository repository, UserRepository userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  /**
   * Retrieve all notes belonging to the specified user.
   *
   * @param userId the UUID of the user whose notes to retrieve
   * @return a list of Notes for the given user, or an empty list if the user has no notes
   */
  public List<Notes> getNotesByUser(UUID userId) {
    var notesEntity = repository.findByUserId(userId);

    return notesEntity.stream().map(this::entityToNote).toList();
  }

  /**
   * Creates and persistently saves a new note for the user identified in {@code userNotes}.
   *
   * @param userNotes domain object containing the target user's id and the note text; the note's id (if any) is ignored
   * @return the saved Notes populated with the persisted entity's id and data
   * @throws IllegalArgumentException if no user exists with the provided userId
   */
  @Transactional
  public Notes addNoteToUser(Notes userNotes) {
    UserEntity user = userRepository.findById(userNotes.userId())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    var entityToSave = new NotesEntity(userNotes.notes(), user);
    var savedEntity = repository.save(entityToSave);
    return entityToNote(savedEntity);
  }

  /**
   * Convert a NotesEntity to a Notes domain object.
   *
   * @param note the entity to convert
   * @return a Notes containing the entity's id, notes text, and the associated user's id
   */
  private Notes entityToNote(NotesEntity note) {
    return new Notes(
            note.getId(),
            note.getNotes(),
            note.getUser().getId());
  }
}