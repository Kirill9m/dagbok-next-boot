package cloud.dagbok.backend.dto.note;

import java.util.List;

public record NoteResponse(List<NoteItem> notes) {}
