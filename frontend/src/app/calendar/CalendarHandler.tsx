"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import CalendarUI from "@/app/calendar/CalendarUI";
import NotesModal from "@/app/calendar/NotesModal";

interface Note {
  id: number;
  text: string;
}

interface NotesData {
  notes: Note[];
}

const CalendarHandler = () => {
  const [saveStatus, setSaveStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notesData, setNotesData] = useState<NotesData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const handleSaveNote = useCallback(
    async (
      year: number,
      month: number,
      day: number,
      text: string,
      prompt: boolean,
      model: string,
    ) => {
      if (!text.trim()) {
        setSaveStatus("Text is empty");
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 3000);
        return;
      }

      setSaveStatus("Skriver...");

      try {
        const noteDate = new Date(year, month, day + 1);
        const isoDate = noteDate.toISOString();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              date: isoDate,
              prompt,
              model,
            }),
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setSaveStatus("Sparat");
        setNotesData(null);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus("Fel vid sparning");
      } finally {
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 3000);
      }
    },
    [],
  );

  const onNavigateToDagbok = async (
    year: number,
    month: number,
    day: number,
  ): Promise<void> => {
    setIsModalOpen(true);

    const date = new Date(year, month, day);
    const formatted = date.toLocaleDateString("sv-SE");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notes/user?date=${formatted}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setNotesData(data);
      } else {
        console.error(`Failed to fetch notes: HTTP ${res.status}`);
        setNotesData(null);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotesData(null);
    }
  };

  const findNote = async (query: string): Promise<void> => {
    setIsSearching(true);
    setSearchError(null);
    setNotesData(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notes/user/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (res.ok) {
        const data = await res.json();
        setNotesData(data);
        setIsModalOpen(true);
      } else {
        const errorMessage =
          res.status === 400
            ? "Ogiltig sökning. Kontrollera din sökfråga."
            : `Kunde inte söka anteckningar (HTTP ${res.status})`;
        setSearchError(errorMessage);
        console.error(`Failed to fetch notes: HTTP ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setSearchError("Ett fel uppstod vid sökning. Försök igen.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setNotesData(null);
    setSearchError(null);
  }, []);

  const handleDelete = async (noteId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${noteId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setSaveStatus("Raderat");
        setNotesData((prevData) => {
          if (!prevData) return prevData;
          return {
            notes: prevData.notes.filter((note) => note.id !== noteId),
          };
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error(`Failed to delete note: HTTP ${response.status}`);
        setSaveStatus("Fel vid radering");
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
      setSaveStatus("Fel vid radering");
    }
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleNoteEdit = async (noteId: number, draftText: string) => {
    try {
      if (!draftText.trim()) {
        setSaveStatus("Text får inte vara tom");
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 3000);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: noteId,
            text: draftText,
          }),
          credentials: "include",
        },
      );

      if (response.ok) {
        setSaveStatus("Uppdaterat");
        setNotesData((prevData) => {
          if (!prevData) return prevData;
          return {
            notes: prevData.notes.map((note) =>
              note.id === noteId ? { ...note, text: draftText } : note,
            ),
          };
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error(`Failed to update note: HTTP ${response.status}`);
        setSaveStatus("Fel vid uppdatering");
      }
    } catch (err) {
      console.error("Failed to update note:", err);
      setSaveStatus("Fel vid uppdatering");
    }
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 3000);
  };

  return (
    <div className="font-inter min-h-screen p-4">
      <CalendarUI
        onSaveNote={handleSaveNote}
        onNavigateToDagbok={onNavigateToDagbok}
        refreshKey={refreshKey}
        onSearch={findNote}
        isSearching={isSearching}
        searchError={searchError}
      />
      {isModalOpen && (
        <NotesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          notesData={notesData}
          onEdit={handleNoteEdit}
          onDelete={handleDelete}
        />
      )}
      {saveStatus && (
        <div
          className="fixed right-4 bottom-4 z-50 rounded-lg bg-[#FF7518] p-3 text-sm text-white shadow-xl"
          role="status"
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default CalendarHandler;
