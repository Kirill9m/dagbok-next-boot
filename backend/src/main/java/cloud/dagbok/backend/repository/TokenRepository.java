package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.TokenEntity;
import cloud.dagbok.backend.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<TokenEntity, UUID> {
  Optional<TokenEntity> findByToken(String token);

  Optional<TokenEntity> findByUser(UserEntity user);
}
