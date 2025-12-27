package cloud.dagbok.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "users")
public class UserEntity {
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
  List<NoteEntity> notes = new ArrayList<>();

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String password;

  @Column(nullable = false, unique = true)
  private String email;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private TokenEntity token;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  private String prompt;

  public TokenEntity getToken() {
    return token;
  }

  public void setToken(TokenEntity token) {
    this.token = token;
  }

  public UserEntity(String prompt) {
    this.prompt = prompt;
  }

  public UserEntity() {}

  public UserEntity(
      Long id,
      String name,
      String passwordHashed,
      String email,
      List<NoteEntity> notes,
      Role role,
      String prompt) {
    this.id = id;
    this.name = name;
    this.password = passwordHashed;
    this.email = email;
    this.notes = notes;
    this.role = role;
    this.prompt = prompt;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPassword() {
    return password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public List<NoteEntity> getNotes() {
    return notes;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public String getPrompt() {
    return prompt;
  }

  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass =
        o instanceof HibernateProxy
            ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass()
            : o.getClass();
    Class<?> thisEffectiveClass =
        this instanceof HibernateProxy
            ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass()
            : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    UserEntity user = (UserEntity) o;
    return getId() != null && Objects.equals(getId(), user.getId());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy
        ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode()
        : getClass().hashCode();
  }
}
