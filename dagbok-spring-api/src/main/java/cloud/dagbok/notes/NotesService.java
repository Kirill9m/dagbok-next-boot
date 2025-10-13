package cloud.dagbok.notes;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotesService {

  private final NotesRepository repository;


  public NotesService(NotesRepository repository) {
    this.repository = repository;
  }

  public List<Notes> getNotesByUser(String userId) {
    var notesEntity = repository.findByUserId(userId);

    return notesEntity.stream().map(this::EntityToNote).toList();
  }


  public Notes addNoteToUser(Notes userNotes) {
    if (userNotes.id() != null) {
      throw new IllegalArgumentException("user id must not be null");
    }

    var entityToSave = new NotesEntity(
            null,
            userNotes.notes(),
            userNotes.userId()
    );
    var savedEntity = repository.save(entityToSave);
    return EntityToNote(savedEntity);
  }

  private Notes EntityToNote(NotesEntity note) {
    return new Notes(
            note.getId(),
            note.getNotes(),
            note.getUserId());
  }
}
