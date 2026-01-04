"use client";

import { useState, useCallback } from "react";
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

  const handleSaveNote = useCallback(
    async (
      year: number,
      month: number,
      day: number,
      text: string,
      prompt: boolean,
    ) => {
      if (!text.trim()) {
        setSaveStatus("Text is empty");
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
        setTimeout(() => setSaveStatus(""), 3000);
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

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDelete = async (noteId: number) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Note is deleted successfully");
        setNotesData((prevData) => {
          if (!prevData) return prevData;
          return {
            notes: prevData.notes.filter((note) => note.id !== noteId),
          };
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen font-inter p-4">
      <CalendarUI
        onSaveNote={handleSaveNote}
        onNavigateToDagbok={onNavigateToDagbok}
        refreshKey={refreshKey}
      />
      {isModalOpen && (
        <NotesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          notesData={notesData}
          onEdit={(noteId) => {
            console.log("Radigera note:", noteId);
          }}
          onDelete={(noteId) => {
            handleDelete(noteId);
          }}
        />
      )}
      {saveStatus && (
        <div
          className="fixed bottom-4 right-4 bg-[#FF7518] text-white p-3 rounded-lg shadow-xl z-50 text-sm"
          role="status"
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default CalendarHandler;
