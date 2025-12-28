package cloud.dagbok.backend.service;

import static cloud.dagbok.backend.utils.BCryptUtil.checkPassword;
import static cloud.dagbok.backend.utils.BCryptUtil.hashPassword;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;
  private final JwtUtil jwtUtil;
  private static final String DEFAULT_PROMPT =
      "Help me add entries to the calendar, and assist with removing unnecessary content, checking"
          + " grammar, rewriting for clarity, and returning only the final, clean version without"
          + " comments.";

  public UserService(
      UserRepository userRepository, TokenRepository tokenRepository, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.jwtUtil = jwtUtil;
  }

  @Transactional
  public void registerUser(User user) {
    if (userRepository.existsByEmail(user.email())) {
      throw new ConflictException(user.email() + " is already registered");
    }

    userRepository.save(
        new UserEntity(
            null,
            user.name(),
            hashPassword(user.password()),
            user.email(),
            new java.util.ArrayList<>(),
            Role.USER,
            DEFAULT_PROMPT));
  }

  @Transactional
  public Token loginUser(String email, String password) {
    UserEntity user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Invalid credentials"));

    if (!checkPassword(password, user.getPassword())) {
      throw new EntityNotFoundException("Invalid credentials");
    }

    String accessToken = jwtUtil.generateToken(email, 1000 * 60 * 60 * 24 * 7L);

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

  @Transactional(readOnly = true)
  public UserProfile getUserProfile(String email) {
    UserEntity user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

    return new UserProfile(
        user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getPrompt());
  }

  public UserProfile updateUserPrompt(Long userId, String newPrompt) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

    user.setPrompt(newPrompt);
    userRepository.save(user);
    return new UserProfile(
        user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getPrompt());
  }
}
