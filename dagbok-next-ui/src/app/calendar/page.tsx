"use client";

import { useCallback, useState } from "react";
import MonthlyPlanner from "@/app/components/MonthlyPlanner";

const Calendar = () => {
  const [statusMessage, setStatusMessage] = useState<string>(
    "Klicka på en dag för att navigera.",
  );
  const handleNavigateToDagbok = useCallback(
    (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      const formattedDate = date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      setStatusMessage(`${formattedDate}`);
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
      <MonthlyPlanner onNavigateToDagbok={handleNavigateToDagbok} />
    </div>
  );
};

export default Calendar;
