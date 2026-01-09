package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.Role;
import cloud.dagbok.backend.entity.UserEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
  boolean existsByUsername(String username);

  Optional<UserEntity> findByUsername(String username);

  List<UserEntity> findByRoleAndCreatedAtBefore(Role role, LocalDateTime before);
}
