package cloud.dagbok.backend.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public final class PromptUtil {

  private static final URI OPENROUTER_URI =
      URI.create("https://openrouter.ai/api/v1/chat/completions");

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private static final HttpClient CLIENT =
      HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

  private PromptUtil() {}

  public static String chat(String apiKey, String model, String prompt, String message) {
    try {
      if (apiKey == null || apiKey.isBlank()) {
        throw new IllegalArgumentException("OpenRouter API key is missing");
      }

      String selectedModel = selectModel(model);
      String body = buildChatBody(selectedModel, prompt, message);

      HttpRequest request =
          HttpRequest.newBuilder()
              .uri(OPENROUTER_URI)
              .timeout(Duration.ofSeconds(60))
              .header("Authorization", "Bearer " + apiKey)
              .header("Content-Type", "application/json")
              .header("HTTP-Referer", "https://app.dagbok.cloud")
              .header("X-Title", "dagbok-backend")
              .POST(HttpRequest.BodyPublishers.ofString(body))
              .build();

      HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() / 100 != 2) {
        throw new RuntimeException(
            "OpenRouter error: HTTP "
                + response.statusCode()
                + " body="
                + safeBody(response.body()));
      }

      return extractAssistantText(response.body());
    } catch (Exception e) {
      throw new RuntimeException("Failed to call OpenRouter: " + e.getMessage(), e);
    }
  }

  private static String selectModel(String model) {
    if (model == null || model.isBlank()) {
      return "openai/gpt-4o-mini";
    }
    return model.trim();
  }

  private static String buildChatBody(String model, String prompt, String message)
      throws Exception {
    ObjectNode root = MAPPER.createObjectNode();

    ArrayNode messages = MAPPER.createArrayNode();
    ObjectNode systemMsg =
        MAPPER
            .createObjectNode()
            .put("role", "system")
            .put("content", prompt == null ? "" : prompt);
    ObjectNode userMsg =
        MAPPER
            .createObjectNode()
            .put("role", "user")
            .put("content", message == null ? "" : message);

    messages.add(systemMsg);
    messages.add(userMsg);

    root.put("model", model);
    root.set("messages", messages);
    root.put("temperature", 0.7);

    return MAPPER.writeValueAsString(root);
  }

  private static String extractAssistantText(String responseBody) throws Exception {
    JsonNode json = MAPPER.readTree(responseBody);
    JsonNode choices = json.path("choices");
    if (!choices.isArray() || choices.isEmpty()) {
      throw new RuntimeException("No choices in response");
    }
    JsonNode content = choices.get(0).path("message").path("content");
    if (content.isMissingNode() || content.isNull()) {
      JsonNode alt = choices.get(0).path("text");
      if (!alt.isMissingNode() && !alt.isNull()) return alt.asText();
      throw new RuntimeException("No message content in response");
    }
    return content.asText();
  }

  private static String safeBody(String body) {
    if (body == null) return "";
    return body.length() > 2000 ? body.substring(0, 2000) + "…" : body;
  }
}
