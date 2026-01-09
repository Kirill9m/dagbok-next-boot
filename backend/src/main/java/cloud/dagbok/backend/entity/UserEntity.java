package cloud.dagbok.backend.entity;

import cloud.dagbok.backend.dto.note.Model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "users")
public class UserEntity {
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = "user",
      cascade = CascadeType.REMOVE,
      orphanRemoval = true)
  List<NoteEntity> notes = new ArrayList<>();

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String password;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(
      name = "created_at",
      nullable = false,
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private LocalDateTime createdAt;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private TokenEntity token;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  @Column(length = 2000)
  private String prompt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private Model model;

  @Column(name = "total_costusd")
  private Double totalCostUSD = 0.0;

  ;

  @Column(name = "monthly_cost")
  private Double monthlyCost = 0.0;

  ;

  public TokenEntity getToken() {
    return token;
  }

  public void setToken(TokenEntity token) {
    this.token = token;
  }

  public UserEntity() {}

  public UserEntity(String passwordHashed, String username, Role role, String prompt, Model model) {
    this.password = passwordHashed;
    this.username = username;
    this.createdAt = LocalDateTime.now();
    this.role = role;
    this.prompt = prompt;
    this.model = model;
  }

  public Double getMonthlyCost() {
    return monthlyCost;
  }

  public void setMonthlyCost(Double monthlyCost) {
    this.monthlyCost = monthlyCost;
  }

  public Double getTotalCostUSD() {
    return totalCostUSD;
  }

  public void setTotalCostUSD(Double totalCostUSD) {
    this.totalCostUSD = totalCostUSD;
  }

  public Model getModel() {
    return model;
  }

  public void setModel(Model model) {
    this.model = model;
  }

  public String getPassword() {
    return password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
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

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
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
