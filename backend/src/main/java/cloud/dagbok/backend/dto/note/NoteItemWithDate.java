package cloud.dagbok.backend.dto.note;

import java.util.List;

public record NoteItemWithDate(List<NotesCountByDate> notes) {}
