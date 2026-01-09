package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record User(
    @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
    @NotBlank
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        @Pattern(
            regexp = "^[a-zA-Z0-9_-]+$",
            message = "Username can only contain letters, numbers, underscores, and hyphens")
        String username) {
  @Override
  public String toString() {
    return "User[username=" + username + ", password=*****]";
  }
}
