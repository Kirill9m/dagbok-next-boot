package cloud.dagbok.backend.repository;

import cloud.dagbok.backend.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<TokenEntity, Long> {
  Optional<TokenEntity> findByRefreshToken(String refreshToken);
  Optional<TokenEntity> findByToken(String token);
}