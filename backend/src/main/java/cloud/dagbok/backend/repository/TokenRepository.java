package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.TokenEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<TokenEntity, Long> {
  Optional<TokenEntity> findByRefreshToken(String refreshToken);

  Optional<TokenEntity> findByToken(String token);
}
