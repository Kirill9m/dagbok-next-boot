package cloud.dagbok.backend.dto.note;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record NoteItemWithDate(@NotNull List<NotesCountByDate> notes) {}
