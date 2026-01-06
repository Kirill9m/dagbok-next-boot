package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotNull;

public record UpdateModelRequest(@NotNull String model) {}
