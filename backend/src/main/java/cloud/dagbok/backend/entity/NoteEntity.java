package cloud.dagbok.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "notes")
public class NoteEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(length = 2000)
  private String text;

  @Column(nullable = false)
  private LocalDate date;

  @CreationTimestamp private LocalDateTime createdAt;
  private LocalDateTime deletedAt;

  @Column private Integer tokensUsed;

  @Column private Double costUSD;

  public LocalDateTime getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(LocalDateTime deletedAt) {
    this.deletedAt = deletedAt;
  }

  public NoteEntity() {}

  public NoteEntity(
      Long id,
      UserEntity user,
      String text,
      LocalDate date,
      LocalDateTime createdAt,
      LocalDateTime deletedAt) {
    this.id = id;
    this.user = user;
    this.text = text;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    this.date = date;
  }

  public Double getCostUSD() {
    return costUSD;
  }

  public void setCostUSD(Double costUSD) {
    this.costUSD = costUSD;
  }

  public Integer getTokensUsed() {
    return tokensUsed;
  }

  public void setTokensUsed(Integer tokensUsed) {
    this.tokensUsed = tokensUsed;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public String getText() {
    return text;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setText(String text) {
    this.text = text;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }
}
