package cloud.dagbok.backend.dto.token;

import jakarta.validation.constraints.NotBlank;

public record Token(@NotBlank String token) {}
