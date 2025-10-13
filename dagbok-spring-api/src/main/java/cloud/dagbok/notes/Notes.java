package cloud.dagbok.notes;

public record Notes(
        Long id,
        String notes,
        String userId
) {
}
