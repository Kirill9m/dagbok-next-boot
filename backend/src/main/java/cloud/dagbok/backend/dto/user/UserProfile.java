package cloud.dagbok.backend.dto.user;

import cloud.dagbok.backend.dto.note.Model;

public record UserProfile(
    String username,
    String role,
    String prompt,
    Model model,
    double monthlyCost,
    double totalCost) {}
