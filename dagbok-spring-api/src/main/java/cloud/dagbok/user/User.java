package cloud.dagbok.user;

import java.util.UUID;

public record User(
        UUID id,
        String userName,
        String password

) {
}
