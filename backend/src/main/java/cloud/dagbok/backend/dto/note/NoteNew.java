package cloud.dagbok.backend.dto.note;

import java.time.LocalDate;
import java.util.UUID;

public record NoteNew(UUID id, String text, LocalDate date, Double cost) {}
