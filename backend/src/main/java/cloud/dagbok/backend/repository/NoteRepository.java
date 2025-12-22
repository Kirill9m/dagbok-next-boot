package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.dto.note.Note;
import cloud.dagbok.backend.entity.NoteEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
  List<NoteEntity> findByUserIdAndDeletedAtIsNull(Long userId);

  Optional<NoteEntity> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);

  List<Note> findByDateAndUser(LocalDate date, Long userId);

  @Query(value = "SELECT * FROM note WHERE value LIKE CONCAT('%', :value, '%')", nativeQuery = true)
  Optional<NoteEntity> findNote(String value);
}
