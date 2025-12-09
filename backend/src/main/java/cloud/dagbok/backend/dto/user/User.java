package cloud.dagbok.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record User(@NotBlank String name,
                   @NotBlank
                   @Size(min = 8, message = "Password must be at least 8 characters")
                   String password,
                   @NotBlank
                   @Email
                   String email) {
        @Override
    public String toString() {
            return "User[name=" + name + ", password=*****, email=" + email + "]";
        }
}