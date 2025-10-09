"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import MonthlyPlanner from "@/app/components/MonthlyPlanner";

const Calendar = () => {
  const [statusMessage, setStatusMessage] = useState<string>(
    "Klicka på en dag för att navigera.",
  );
  const [saveStatus, setSaveStatus] = useState<String>("");

  const saveTimeRef = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = 1000;

  const showSaveStatus = (message:String) => {
    setSaveStatus(message);
    setTimeout(() => {
      setSaveStatus("");
    }, 1000)
  }

  const handleNavigateToDagbok = useCallback(
    (year: number, month: number, day: number, text: String) => {
      const date = new Date(year, month, day);
      const formattedDate = date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      setStatusMessage(`${formattedDate} + ${text}`);
    },
    [],
  );

  const handleSaveNote = useCallback(
    (year: number, month: number, day: number, text: string) => {

      if(saveTimeRef.current) {
        clearTimeout(saveTimeRef.current);
        saveTimeRef.current = null;
      }

      setSaveStatus("Skriver...");

      saveTimeRef.current = setTimeout(() => {
        console.log(`Note saved for ${year}-${month + 1}-${day}: ${text}`);
        showSaveStatus(text.trim() ? "Sparat ✅" : "Rensat 🗑️");

        saveTimeRef.current = null;
      }, debounceDelay);
    },
    [],
  );

  return (
    <div className="min-h-screen font-inter p-4">
      <div className="flex justify-center mb-6">
        <div className="text-center text-lg p-3 max-w-[250px] bg-[#2A2A2A] text-gray-300 rounded-lg shadow-inner border border-gray-700">
          {statusMessage}
        </div>
      </div>
      <MonthlyPlanner
        onNavigateToDagbok={handleNavigateToDagbok}
        onSaveNote={handleSaveNote}
      />
      {saveStatus && (
        <div
          className="
            fixed bottom-4 right-4
            bg-[#FF7518] text-white
            p-3 rounded-lg shadow-xl
            transition-opacity duration-500
            z-50 max-w-[200px] text-sm
          "
          role="status"
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default Calendar;
