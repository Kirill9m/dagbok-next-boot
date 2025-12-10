package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotBlank;

public record NoteCreateRequest(
        @NotBlank(message = "Note value cannot be blank")
        String value
) {}