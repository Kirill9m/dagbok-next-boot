package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record NoteUpdateRequest(@NotNull UUID id, @NotBlank String text) {}
