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

  List<NoteEntity> findByTextContainingAndUserIdAndDeletedAtIsNull(String searchText, Long userId);
}
