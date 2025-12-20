package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCheck(@NotBlank String password, @NotBlank @Email String email) {
  @Override
  public String toString() {
    return "UserCheck[password=*****, email=" + email + "]";
  }
}
