package cloud.dagbok.dto.user;

import cloud.dagbok.dto.note.NoteResponse;

import java.util.List;

public record UserNotes(String name, List<NoteResponse> notes) {
}
