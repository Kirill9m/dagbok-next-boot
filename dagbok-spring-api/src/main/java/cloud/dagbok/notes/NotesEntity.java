package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Table(name = "notes")
@Entity
public class NotesEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(updatable = false, nullable = false)
  private UUID id;

  @Column(name = "notes", nullable = false)
  private String notes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  public NotesEntity() {
  }

  public NotesEntity(String notes, UserEntity user) {
    this.notes = notes;
    this.user = user;
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

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
