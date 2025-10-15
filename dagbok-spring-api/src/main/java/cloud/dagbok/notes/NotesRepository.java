package cloud.dagbok.notes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotesRepository extends JpaRepository<NotesEntity, Long> {
  /**
 * Finds all notes belonging to the user with the specified UUID.
 *
 * @param userId the UUID of the user whose notes should be retrieved
 * @return a list of NotesEntity objects associated with the given userId
 */
List<NotesEntity> findByUserId(UUID userId);
}