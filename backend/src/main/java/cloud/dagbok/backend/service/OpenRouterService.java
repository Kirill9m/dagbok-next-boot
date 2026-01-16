package cloud.dagbok.backend.service;

import cloud.dagbok.backend.service.PromptService.ChatResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenRouterService {

  @Value("${openrouter.api-key}")
  private String apiKey;

  public ChatResult chat(String model, String prompt, String message) {
    return PromptService.chat(apiKey, model, prompt, message);
  }
}
