package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.Role;
import cloud.dagbok.backend.entity.UserEntity;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  boolean existsByUsername(String username);

  Optional<UserEntity> findByUsername(String username);

  @Modifying
  @Transactional
  void deleteByRoleAndCreatedAtBefore(Role role, LocalDateTime before);
}
