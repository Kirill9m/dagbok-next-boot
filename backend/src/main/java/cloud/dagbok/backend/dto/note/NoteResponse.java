package cloud.dagbok.backend.dto.note;

import java.util.List;

public record NoteResponse(Long id, List<String> notes) {}
