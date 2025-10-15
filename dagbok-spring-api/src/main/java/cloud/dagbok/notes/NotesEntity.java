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

  /**
   * Default no-argument constructor required by JPA for entity instantiation.
   */
  public NotesEntity() {
  }

  /**
   * Creates a NotesEntity with the given text content and associated user.
   *
   * @param notes the textual content of the note
   * @param user the owning UserEntity associated with this note
   */
  public NotesEntity(String notes, UserEntity user) {
    this.notes = notes;
    this.user = user;
  }

  /**
   * Retrieve the primary key for this note.
   *
   * @return the UUID of the note
   */
  public UUID getId() {
    return id;
  }

  /**
   * Sets the entity's primary key UUID.
   *
   * @param id the UUID to assign as this entity's primary key
   */
  public void setId(UUID id) {
    this.id = id;
  }

  /**
   * Gets the user associated with this note.
   *
   * @return the associated UserEntity
   */
  public UserEntity getUser() {
    return user;
  }

  /**
   * Set the UserEntity associated with this note.
   *
   * @param user the UserEntity to associate with this note; must not be null (stored in a non-nullable user_id column)
   */
  public void setUser(UserEntity user) {
    this.user = user;
  }

  /**
   * Gets the textual content of the note.
   *
   * @return the note text (never null)
   */
  public String getNotes() {
    return notes;
  }

  /**
   * Set the textual content of this note.
   *
   * @param notes the text content for the note; must not be null
   */
  public void setNotes(String notes) {
    this.notes = notes;
  }
}