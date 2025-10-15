package cloud.dagbok.notes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record Notes(
        UUID id,
        @NotBlank String notes,
        @NotNull UUID userId
) {
}
