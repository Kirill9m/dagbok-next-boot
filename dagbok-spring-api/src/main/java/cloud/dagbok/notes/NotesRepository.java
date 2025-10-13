package cloud.dagbok.notes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotesRepository extends JpaRepository<NotesEntity, Long> {
  List<NotesEntity> findByUserId(String userId);
}
