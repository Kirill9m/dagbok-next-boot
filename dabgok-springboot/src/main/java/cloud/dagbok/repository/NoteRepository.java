package cloud.dagbok.repository;

import cloud.dagbok.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
  Optional<NoteEntity> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);
}