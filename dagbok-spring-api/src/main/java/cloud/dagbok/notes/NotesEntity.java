package cloud.dagbok.notes;

import jakarta.persistence.*;

@Table(name = "notes")
@Entity
public class NotesEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "notes")
  private String notes;
  @Column(name = "user_id")
  private String userId;

  public NotesEntity() {
  }

  public NotesEntity(Long id, String notes, String userId) {
    this.id = id;
    this.notes = notes;
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }
}
