package cloud.dagbok.notes;

import java.util.UUID;

public record Notes(
        UUID id,
        String notes,
        UUID userId
) {
}
