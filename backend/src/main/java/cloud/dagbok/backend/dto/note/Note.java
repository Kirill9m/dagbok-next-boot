package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record Note(
    UUID id, @NotNull String text, UUID userId, LocalDateTime createdAt, LocalDateTime deletedAt) {}
