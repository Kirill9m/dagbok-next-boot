package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePromptRequest(@NotBlank @Size(max = 2000) String newPrompt) {}
