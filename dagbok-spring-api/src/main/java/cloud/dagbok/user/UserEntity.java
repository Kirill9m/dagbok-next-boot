package cloud.dagbok.user;

import cloud.dagbok.notes.NotesEntity;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(name = "username", nullable = false)
  private String userName;

  @Column(name = "password_hash", nullable = false)
  private String password;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<NotesEntity> notes;

  public UserEntity() {
  }

  public UserEntity(UUID id, String userName, String password, List<NotesEntity> notes) {
    this.id = id;
    this.userName = userName;
    this.password = password;
    this.notes = notes;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public List<NotesEntity> getNotes() {
    return notes;
  }

  public void setNotes(List<NotesEntity> notes) {
    this.notes = notes;
  }
}
