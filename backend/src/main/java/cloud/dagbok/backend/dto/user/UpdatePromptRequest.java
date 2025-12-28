package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UpdatePromptRequest(@NotBlank String newPrompt) {}
