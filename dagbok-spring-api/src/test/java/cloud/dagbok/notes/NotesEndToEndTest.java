package cloud.dagbok.notes;

import cloud.dagbok.user.UserEntity;
import cloud.dagbok.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
@DisplayName("Notes End-to-End Tests")
class NotesEndToEndTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("testdb")
      .withUsername("test")
      .withPassword("test");

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotesRepository notesRepository;

  private UserEntity testUser;

  @BeforeEach
  void setUp() {
    notesRepository.deleteAll();
    userRepository.deleteAll();

    testUser = new UserEntity();
    testUser.setUserName("testuser");
    testUser.setPasswordHash("hashedpassword");
    testUser = userRepository.save(testUser);
  }

  @Test
  @DisplayName("E2E: Complete workflow - create note and retrieve it")
  void completeWorkflowCreateAndRetrieve() throws Exception {
    // Create a note
    Notes inputNote = new Notes(null, "E2E test note", testUser.getId());
    
    String createResponse = mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.notes").value("E2E test note"))
        .andExpect(jsonPath("$.userId").value(testUser.getId().toString()))
        .andReturn()
        .getResponse()
        .getContentAsString();

    // Retrieve the note
    mockMvc.perform(get("/notes/{userId}", testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].notes").value("E2E test note"))
        .andExpect(jsonPath("$[0].userId").value(testUser.getId().toString()));
  }

  @Test
  @DisplayName("E2E: Create multiple notes and retrieve all")
  void createMultipleNotesAndRetrieveAll() throws Exception {
    // Create multiple notes
    for (int i = 1; i <= 3; i++) {
      Notes note = new Notes(null, "Note " + i, testUser.getId());
      mockMvc.perform(post("/notes")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(note)))
          .andExpect(status().isCreated());
    }

    // Retrieve all notes
    mockMvc.perform(get("/notes/{userId}", testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(3)))
        .andExpect(jsonPath("$[*].notes", containsInAnyOrder("Note 1", "Note 2", "Note 3")));
  }

  @Test
  @DisplayName("E2E: Attempt to create note for non-existent user")
  void attemptCreateNoteForNonExistentUser() throws Exception {
    Notes inputNote = new Notes(null, "Test note", java.util.UUID.randomUUID());
    
    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().is5xxServerError());
  }

  @Test
  @DisplayName("E2E: Retrieve notes for user with no notes")
  void retrieveNotesForUserWithNoNotes() throws Exception {
    mockMvc.perform(get("/notes/{userId}", testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(0)));
  }

  @Test
  @DisplayName("E2E: Invalid request validation")
  void invalidRequestValidation() throws Exception {
    String invalidJson = String.format("{\"id\":null,\"notes\":null,\"userId\":\"%s\"}", testUser.getId());
    
    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest());
  }

  @Test
  @DisplayName("E2E: Special characters in notes")
  void specialCharactersInNotes() throws Exception {
    String specialNote = "Note with !@#$%^&*() chars";
    Notes inputNote = new Notes(null, specialNote, testUser.getId());
    
    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(inputNote)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.notes").value(specialNote));

    mockMvc.perform(get("/notes/{userId}", testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].notes").value(specialNote));
  }

  @Test
  @DisplayName("E2E: Multiple users with isolated notes")
  void multipleUsersWithIsolatedNotes() throws Exception {
    // Create second user
    UserEntity user2 = new UserEntity();
    user2.setUserName("testuser2");
    user2.setPasswordHash("hashedpassword2");
    user2 = userRepository.save(user2);

    // Create notes for both users
    Notes note1 = new Notes(null, "User 1 Note", testUser.getId());
    Notes note2 = new Notes(null, "User 2 Note", user2.getId());

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(note1)))
        .andExpect(status().isCreated());

    mockMvc.perform(post("/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(note2)))
        .andExpect(status().isCreated());

    // Verify isolation
    mockMvc.perform(get("/notes/{userId}", testUser.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].notes").value("User 1 Note"));

    mockMvc.perform(get("/notes/{userId}", user2.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].notes").value("User 2 Note"));
  }
}