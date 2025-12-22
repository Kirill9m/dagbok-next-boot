package cloud.dagbok.backend.dto.user;

import cloud.dagbok.backend.dto.note.NoteResponse;
import java.util.List;

public record UserNotes(List<NoteResponse> notes) {}
