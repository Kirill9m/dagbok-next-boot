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

  const handleSaveNote = useCallback(
    async (year: number, month: number, day: number, text: string) => {
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
            }),
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setSaveStatus("Sparat");
        setNotesData(null);
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

  return (
    <div className="min-h-screen font-inter p-4">
      <CalendarUI
        onSaveNote={handleSaveNote}
        onNavigateToDagbok={onNavigateToDagbok}
      />
      {isModalOpen && (
        <NotesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          notesData={notesData}
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
