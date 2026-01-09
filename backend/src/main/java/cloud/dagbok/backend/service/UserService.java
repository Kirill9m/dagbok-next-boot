package cloud.dagbok.backend.service;

import static cloud.dagbok.backend.dto.note.Model.GPT_4O_MINI;
import static cloud.dagbok.backend.utils.BCryptUtil.checkPassword;
import static cloud.dagbok.backend.utils.BCryptUtil.hashPassword;

import cloud.dagbok.backend.dto.note.Model;
import cloud.dagbok.backend.dto.token.Token;
import cloud.dagbok.backend.dto.user.User;
import cloud.dagbok.backend.dto.user.UserProfile;
import cloud.dagbok.backend.entity.Role;
import cloud.dagbok.backend.entity.TokenEntity;
import cloud.dagbok.backend.entity.UserEntity;
import cloud.dagbok.backend.exceptionHandler.ConflictException;
import cloud.dagbok.backend.repository.TokenRepository;
import cloud.dagbok.backend.repository.UserRepository;
import cloud.dagbok.backend.utils.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;
  private final JwtUtil jwtUtil;
  private static final String DEFAULT_PROMPT =
      """
      You are an expert AI Note Assistant.

      Goal: Turn unstructured notes into clear, professional, and helpful notes in the same language as the input.

      Tasks:
      1. Clean & refine grammar, spelling, and punctuation.
      2. Structure using Markdown: # Header, ## subheaders, bullet points, `inline code`.
      3. Optional: Add brief suggestions or next steps if the note contains tasks or plans.
      """;
  private static final Model DEFAULT_MODEL = GPT_4O_MINI;

  public UserService(
      UserRepository userRepository, TokenRepository tokenRepository, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.jwtUtil = jwtUtil;
  }

  @Transactional
  public void registerUser(User user) {
    if (userRepository.existsByUsername(user.username())) {
      throw new ConflictException(user.username() + " is already registered");
    }

    userRepository.save(
        new UserEntity(
            hashPassword(user.password()),
            user.username(),
            Role.USER,
            DEFAULT_PROMPT,
            DEFAULT_MODEL));
  }

  @Transactional
  public Token loginUser(String username, String password) {
    UserEntity user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("Invalid credentials"));

    if (!checkPassword(password, user.getPassword())) {
      throw new EntityNotFoundException("Invalid credentials");
    }

    String accessToken = jwtUtil.generateToken(user.getUsername(), 1000 * 60 * 60 * 24 * 7L);

    TokenEntity tokenEntity =
        tokenRepository
            .findByUser(user)
            .orElseGet(
                () -> {
                  TokenEntity newToken = new TokenEntity();
                  newToken.setUser(user);
                  return newToken;
                });

    tokenEntity.setToken(accessToken);
    tokenRepository.save(tokenEntity);

    return new Token(accessToken);
  }

  @Transactional
  public Token demoLogin() {
    String username = "demo_" + UUID.randomUUID().toString().substring(0, 8);
    String randomPassword = UUID.randomUUID().toString();

    UserEntity user =
        userRepository.save(
            new UserEntity(
                hashPassword(randomPassword), username, Role.DEMO, DEFAULT_PROMPT, DEFAULT_MODEL));

    String accessToken = jwtUtil.generateToken(username, 1000 * 60 * 5L);

    TokenEntity tokenEntity = new TokenEntity();
    tokenEntity.setUser(user);
    tokenEntity.setToken(accessToken);
    tokenRepository.save(tokenEntity);

    return new Token(accessToken);
  }

  @Transactional(readOnly = true)
  public UserProfile getUserProfile(String username) {
    UserEntity user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

    return toUserProfile(user);
  }

  @Transactional
  public UserProfile updateUserPrompt(Long userId, String newPrompt) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

    user.setPrompt(newPrompt);
    userRepository.save(user);
    return toUserProfile(user);
  }

  @Transactional
  public UserProfile updateUserModel(Long userId, String model) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

    user.setModel(Model.fromValue(model));
    userRepository.save(user);
    return toUserProfile(user);
  }

  private UserProfile toUserProfile(UserEntity user) {
    return new UserProfile(
        user.getId(),
        user.getUsername(),
        user.getRole().name(),
        user.getPrompt(),
        user.getModel(),
        user.getMonthlyCost(),
        user.getTotalCostUSD());
  }

  @Scheduled(cron = "0 0 * * * *")
  public void cleanupExpiredDemoUsers() {
    LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

    userRepository.deleteByRoleAndCreatedAtBefore(Role.DEMO, fiveMinutesAgo);
  }
}
