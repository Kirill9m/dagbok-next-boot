package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record NoteCreateRequest(
    @NotBlank(message = "Note value cannot be blank") String text, @NotNull LocalDateTime date) {}
