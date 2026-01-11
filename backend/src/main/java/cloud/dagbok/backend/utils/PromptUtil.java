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
import java.util.Map;

public final class PromptUtil {

  private static final URI OPENROUTER_URI =
      URI.create("https://openrouter.ai/api/v1/chat/completions");

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private static final HttpClient CLIENT =
      HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

  private static final Map<String, ModelPricing> MODEL_PRICES =
      Map.of(
          "openai/gpt-4o-mini", new ModelPricing(0.00015, 0.0006),
          "xiaomi/mimo-v2-flash:free", new ModelPricing(0.0, 0.0));

  private PromptUtil() {}

  public static ChatResult chat(String apiKey, String model, String prompt, String message) {
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

      return parseResponse(response.body(), selectedModel);
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
    root.put("temperature", 0.7); // Controls randomness vs. determinism of the output
    root.put("max_tokens", 4500); // Upper limit on the number of tokens in the response

    return MAPPER.writeValueAsString(root);
  }

  private static ChatResult parseResponse(String responseBody, String model) throws Exception {
    JsonNode json = MAPPER.readTree(responseBody);

    JsonNode choices = json.path("choices");
    if (!choices.isArray() || choices.isEmpty()) {
      throw new RuntimeException("No choices in response");
    }
    JsonNode content = choices.get(0).path("message").path("content");
    if (content.isMissingNode() || content.isNull()) {
      JsonNode alt = choices.get(0).path("text");
      if (!alt.isMissingNode() && !alt.isNull()) {
        return new ChatResult(alt.asText(), 0, 0, 0, 0.0);
      }
      throw new RuntimeException("No message content in response");
    }

    String text = content.asText();

    JsonNode usage = json.path("usage");
    int promptTokens = usage.path("prompt_tokens").asInt(0);
    int completionTokens = usage.path("completion_tokens").asInt(0);
    int totalTokens = usage.path("total_tokens").asInt(0);

    double cost = calculateCost(model, promptTokens, completionTokens);

    return new ChatResult(text, totalTokens, promptTokens, completionTokens, cost);
  }

  private static double calculateCost(String model, int promptTokens, int completionTokens) {
    ModelPricing pricing = MODEL_PRICES.get(model);
    if (pricing == null) {
      return 0.0;
    }

    double promptCost = (promptTokens / 1000.0) * pricing.promptPrice;
    double completionCost = (completionTokens / 1000.0) * pricing.completionPrice;

    return promptCost + completionCost;
  }

  private static String safeBody(String body) {
    if (body == null) return "";
    return body.length() > 2000 ? body.substring(0, 2000) + "…" : body;
  }

  public record ChatResult(
      String text, int totalTokens, int promptTokens, int completionTokens, double costUSD) {}

  private record ModelPricing(double promptPrice, double completionPrice) {}
}
