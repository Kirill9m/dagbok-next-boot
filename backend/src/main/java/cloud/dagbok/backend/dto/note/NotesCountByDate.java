package cloud.dagbok.backend.dto.note;

import java.time.LocalDate;

public record NotesCountByDate(LocalDate date, Long count) {}
