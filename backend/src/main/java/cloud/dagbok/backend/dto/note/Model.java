package cloud.dagbok.backend.dto.note;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Model {
  GPT_4O_MINI("openai/gpt-4o-mini"),
  MIMO_V2_FLASH("xiaomi/mimo-v2-flash:free");

  private final String value;

  Model(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @JsonCreator
  public static Model fromValue(String value) {
    return switch (value) {
      case "openai/gpt-4o-mini" -> GPT_4O_MINI;
      case "xiaomi/mimo-v2-flash:free" -> MIMO_V2_FLASH;
      default -> throw new IllegalArgumentException("Unknown model: " + value);
    };
  }

  @Override
  public String toString() {
    return value;
  }
}
