package cloud.dagbok.backend.service;

import cloud.dagbok.backend.utils.PromptUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenRouterService {

  private final String apiKey;

  public OpenRouterService(@Value("${openrouter.api-key}") String apiKey) {
    this.apiKey = apiKey;
  }

  public String chat(String model, String prompt, String message) {
    return PromptUtil.chat(apiKey, model, prompt, message);
  }
}
