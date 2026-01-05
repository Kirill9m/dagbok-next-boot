package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.dto.note.NotesCountByDate;
import cloud.dagbok.backend.entity.NoteEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
  Optional<NoteEntity> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);

  List<NoteEntity> findByDateAndUserIdAndDeletedAtIsNull(LocalDate date, Long userId);

  @Query(
"""
    SELECT new cloud.dagbok.backend.dto.note.NotesCountByDate(n.date, COUNT(n))
    FROM NoteEntity n
    WHERE n.user.id = :userId
      AND n.deletedAt IS NULL
      AND YEAR(n.date) = :year
      AND MONTH(n.date) = :month
    GROUP BY n.date
    ORDER BY n.date ASC
""")
  List<NotesCountByDate> countNotesByDate(
      @Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

  /**
   * Finds notes containing the specified text for a given user.
   *
   * <p>Performance note: This query uses LIKE %searchText% which performs a full table scan.
   * For better performance with large datasets, consider:
   * <ul>
   *   <li>Adding a database index on the 'text' column if supported by your database</li>
   *   <li>Using full-text search capabilities (e.g., PostgreSQL's to_tsvector/to_tsquery)</li>
   *   <li>Implementing a dedicated search engine (e.g., Elasticsearch) for complex search requirements</li>
   * </ul>
   *
   * @param searchText the text to search for within note contents
   * @param userId the ID of the user whose notes should be searched
   * @return list of notes containing the search text
   */
  List<NoteEntity> findByTextContainingAndUserIdAndDeletedAtIsNull(String searchText, Long userId);
}
