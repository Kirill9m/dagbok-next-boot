package cloud.dagbok.backend.dto.user;

import cloud.dagbok.backend.dto.note.Model;

public record UserProfile(
    Long id,
    String name,
    String email,
    String role,
    String prompt,
    Model model,
    double monthlyCost,
    double totalCost) {}
