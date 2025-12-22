"use client";

import { useState, useCallback } from "react";
import CalendarUI from "@/app/calendar/CalendarUI";
import NotesModal from "@/app/calendar/NotesModal";

const CalendarHandler = () => {
  const [saveStatus, setSaveStatus] = useState("");

  const handleSaveNote = useCallback(
    async (year: number, month: number, day: number, text: string) => {
      if (!text.trim()) {
        setSaveStatus("Text is empty");
        return;
      }

      setSaveStatus("Skriver...");

      try {
        const noteDate = new Date(year, month, day);
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
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus("Fel vid sparning");
      }
    },
    [],
  );

  const onNavigateToDagbok = (
    year: number,
    month: number,
    day: number,
    text: string,
  ): void => {
    console.log(
      `Navigating to dagbok for ${year}-${month + 1}-${day} with text: ${text}`,
    );
  };

  return (
    <div className="min-h-screen font-inter p-4">
      <CalendarUI
        onSaveNote={handleSaveNote}
        onNavigateToDagbok={onNavigateToDagbok}
      />
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
