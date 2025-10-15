package cloud.dagbok.user;

import cloud.dagbok.notes.NotesEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Getter
  private UUID id;

  @Column(name = "username", nullable = false, unique = true)
  @Setter
  @Getter
  private String userName;

  @Column(name = "password_hash", nullable = false)
  @Setter
  @Getter
  private String passwordHash;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  @Getter
  private List<NotesEntity> notes;
}
