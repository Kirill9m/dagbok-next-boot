package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoteUpdateRequest(@NotNull Long id, @NotBlank String text) {}
