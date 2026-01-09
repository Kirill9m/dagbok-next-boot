package cloud.dagbok.backend.dto.user;

import java.util.UUID;

public record Principal(UUID userId, String username) {}
