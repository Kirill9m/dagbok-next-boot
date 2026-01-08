package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record User(
    @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
    @NotBlank @NotBlank String username) {
  @Override
  public String toString() {
    return "User[name=" + username + ", password=*****, email=" + username + "]";
  }
}
