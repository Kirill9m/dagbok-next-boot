"use client";

import React, { useState } from "react";

interface MonthlyPlannerProps {
  onNavigateToDagbok: (
    year: number,
    month: number,
    day: number,
    text: string,
  ) => void;
  onSaveNote: (
    year: number,
    month: number,
    day: number,
    text: string,
    prompt: boolean,
  ) => void;
}

const CalendarUI: React.FC<MonthlyPlannerProps> = ({
  onNavigateToDagbok,
  onSaveNote,
}) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [chosenDay, setChosenDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [promptEnabled, setPromptEnabled] = useState(true);

  const handleNavigate = (direction: "prev" | "next") => {
    setMonth((prevMonth) => {
      let newMonth = prevMonth;
      let newYear = year;

      if (direction === "prev") {
        if (newMonth === 0) {
          newMonth = 11;
          newYear--;
        } else {
          newMonth--;
        }
      } else {
        if (newMonth === 11) {
          newMonth = 0;
          newYear++;
        } else {
          newMonth++;
        }
      }

      setYear(newYear);
      setChosenDay(null);
      return newMonth;
    });
  };

  const handleNoteChange = (day: number, text: string) => {
    const noteKey = `${year}-${month + 1}-${day}`;
    setNotes((prev) => ({ ...prev, [noteKey]: text }));
  };

  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = new Date(year, month).toLocaleString("sv-SE", {
    month: "long",
  });

  const dateStyles =
    "border-2 border-gray-700 bg-[#4A4A4A] text-white rounded-lg p-4 transform transition-all duration-300 ease-in-out hover:scale-[1.03] cursor-pointer shadow-md";

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#2A2A2A] rounded-xl shadow-2xl text-white max-w-7xl mx-auto my-8">
      <div className="text-center mb-6">
        <div className="text-sm text-gray-400 mb-1 font-inter">Datum</div>
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => handleNavigate("prev")}
            className="text-[#FF7518] text-xl font-bold p-2 rounded-full hover:bg-gray-700 transition"
          >
            &lt;
          </button>
          <div className="text-center">
            <span className="text-2xl font-extrabold block">{year}</span>
            <div className="text-[#FF7518] font-bold uppercase tracking-wider mt-1">
              {monthName}
            </div>
          </div>
          <button
            onClick={() => handleNavigate("next")}
            className="text-[#FF7518] text-xl font-bold p-2 rounded-full hover:bg-gray-700 transition"
          >
            &gt;
          </button>
        </div>
        <div className="flex justify-end mt-2">
          <label htmlFor="prompt-toggle" className="flex items-center gap-2">
            <input
              type="checkbox"
              id="prompt-toggle"
              className="accent-[#FF7518]"
              checked={promptEnabled}
              onChange={(e) => setPromptEnabled(e.target.checked)}
            />
            <span>Prompt</span>
          </label>
        </div>
      </div>

      <div className="calendar mt-8">
        <div className="hidden sm:grid grid-cols-7 text-center mb-4 font-bold text-gray-300 border-b border-gray-700 pb-2">
          {weekDays.map((dayName) => (
            <div key={dayName} className="text-sm uppercase tracking-wider">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 sm:gap-4">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="hidden sm:block min-h-24"></div>
          ))}

          {days.map((day) => {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const chosen = day === chosenDay;

            const getDayClass = () => {
              let classes = dateStyles;
              if (chosen)
                classes += " border-[#FF7518] shadow-lg shadow-[#FF7518]/50";
              else if (isToday)
                classes += " border-[#FF7518] shadow-lg shadow-white/50";
              return classes;
            };

            const noteKey = `${year}-${month + 1}-${day}`;
            const noteText = notes[noteKey] || "";

            return (
              <div
                key={day}
                className={getDayClass()}
                tabIndex={0}
                onClick={() => {
                  setChosenDay(day);
                  onNavigateToDagbok(year, month, day, noteText);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setChosenDay(day);
                    onNavigateToDagbok(year, month, day, noteText);
                  }
                }}
                role="button"
              >
                <div className="flex justify-between items-start mb-1">
                  <strong className="text-lg">{day}</strong>
                </div>

                <textarea
                  aria-label={`Anteckningar för ${day} ${monthName} ${year}`}
                  value={noteText}
                  onChange={(e) => handleNoteChange(day, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-10 p-2 text-sm bg-transparent text-gray-100 rounded-xl border border-white/10 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7518]/20"
                />

                <button
                  className="mt-1 bg-transparent text-gray-400 px-2 py-1 rounded hover:text-white hover:bg-[#FF7518] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveNote(year, month, day, noteText, promptEnabled);
                    const noteKey = `${year}-${month + 1}-${day}`;
                    setNotes((prev) => {
                      const next = { ...prev };
                      delete next[noteKey];
                      return next;
                    });
                  }}
                >
                  Spara
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarUI;
