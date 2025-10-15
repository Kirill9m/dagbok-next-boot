package cloud.dagbok.notes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotesRepository extends JpaRepository<NotesEntity, Long> {
  List<NotesEntity> findByUserId(UUID userId);
}
