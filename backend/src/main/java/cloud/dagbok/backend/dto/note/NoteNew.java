package cloud.dagbok.backend.dto.note;

import java.time.LocalDate;

public record NoteNew(Long id, String text, LocalDate date) {}
