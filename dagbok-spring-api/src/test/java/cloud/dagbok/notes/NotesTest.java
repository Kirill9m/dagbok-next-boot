package cloud.dagbok.notes;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Notes DTO Validation Tests")
class NotesTest {

  private static Validator validator;

  @BeforeAll
  static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  @DisplayName("Should create valid Notes record")
  void shouldCreateValidNotes() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "Test note", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertTrue(violations.isEmpty());
    assertEquals(id, notes.id());
    assertEquals("Test note", notes.notes());
    assertEquals(userId, notes.userId());
  }

  @Test
  @DisplayName("Should fail validation when id is null")
  void shouldFailValidationWhenIdIsNull() {
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(null, "Test note", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertFalse(violations.isEmpty());
    assertEquals(1, violations.size());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals("id")));
  }

  @Test
  @DisplayName("Should fail validation when notes is null")
  void shouldFailValidationWhenNotesIsNull() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, null, userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertFalse(violations.isEmpty());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals("notes")));
  }

  @Test
  @DisplayName("Should fail validation when notes is blank")
  void shouldFailValidationWhenNotesIsBlank() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertFalse(violations.isEmpty());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals("notes")));
  }

  @Test
  @DisplayName("Should fail validation when notes is only whitespace")
  void shouldFailValidationWhenNotesIsWhitespace() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "   ", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertFalse(violations.isEmpty());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals("notes")));
  }

  @Test
  @DisplayName("Should fail validation when userId is null")
  void shouldFailValidationWhenUserIdIsNull() {
    UUID id = UUID.randomUUID();
    Notes notes = new Notes(id, "Test note", null);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertFalse(violations.isEmpty());
    assertEquals(1, violations.size());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getPropertyPath().toString().equals("userId")));
  }

  @Test
  @DisplayName("Should fail validation with multiple null fields")
  void shouldFailValidationWithMultipleNullFields() {
    Notes notes = new Notes(null, null, null);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertTrue(violations.size() >= 3);
  }

  @Test
  @DisplayName("Should accept notes with special characters")
  void shouldAcceptNotesWithSpecialCharacters() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "Note with !@#$%^&*() special chars", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertTrue(violations.isEmpty());
  }

  @Test
  @DisplayName("Should accept notes with unicode characters")
  void shouldAcceptNotesWithUnicodeCharacters() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "Unicode: 你好世界 🌍", userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertTrue(violations.isEmpty());
  }

  @Test
  @DisplayName("Should accept very long notes")
  void shouldAcceptVeryLongNotes() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    String longNote = "a".repeat(10000);
    Notes notes = new Notes(id, longNote, userId);

    Set<ConstraintViolation<Notes>> violations = validator.validate(notes);
    assertTrue(violations.isEmpty());
  }

  @Test
  @DisplayName("Should be immutable record")
  void shouldBeImmutableRecord() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes = new Notes(id, "Test", userId);

    // Verify that we cannot modify the values (compilation test)
    assertNotNull(notes.id());
    assertNotNull(notes.notes());
    assertNotNull(notes.userId());
  }

  @Test
  @DisplayName("Should support equality based on all fields")
  void shouldSupportEquality() {
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes1 = new Notes(id, "Test", userId);
    Notes notes2 = new Notes(id, "Test", userId);

    assertEquals(notes1, notes2);
    assertEquals(notes1.hashCode(), notes2.hashCode());
  }

  @Test
  @DisplayName("Should not be equal with different values")
  void shouldNotBeEqualWithDifferentValues() {
    UUID id1 = UUID.randomUUID();
    UUID id2 = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    Notes notes1 = new Notes(id1, "Test", userId);
    Notes notes2 = new Notes(id2, "Test", userId);

    assertNotEquals(notes1, notes2);
  }
}