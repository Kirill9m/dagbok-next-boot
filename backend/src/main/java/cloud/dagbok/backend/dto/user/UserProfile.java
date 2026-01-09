package cloud.dagbok.backend.dto.user;

import cloud.dagbok.backend.dto.note.Model;
import java.util.UUID;

public record UserProfile(
    UUID id,
    String username,
    String role,
    String prompt,
    Model model,
    double monthlyCost,
    double totalCost) {}
