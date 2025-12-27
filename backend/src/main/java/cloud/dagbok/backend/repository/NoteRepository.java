package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.NoteEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
  Optional<NoteEntity> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);

  List<NoteEntity> findByDateAndUserIdAndDeletedAtIsNull(LocalDate date, Long userId);
}
