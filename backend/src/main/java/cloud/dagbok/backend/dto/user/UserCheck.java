package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserCheck(@NotBlank String password, @NotBlank String username) {
  @Override
  public String toString() {
    return "UserCheck[password=*****, email=" + username + "]";
  }
}
