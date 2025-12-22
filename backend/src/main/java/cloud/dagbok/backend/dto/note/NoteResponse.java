package cloud.dagbok.backend.dto.note;

import java.time.LocalDate;

public record NoteResponse(LocalDate date, String value) {}
