package cloud.dagbok.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tokens")
public class TokenEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(nullable = false, unique = true)
  private String token;

  public TokenEntity() {}

  public TokenEntity(UUID id, UserEntity user, String token) {
    this.id = id;
    this.user = user;
    this.token = token;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }
}
