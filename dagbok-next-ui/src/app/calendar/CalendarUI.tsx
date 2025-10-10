"use client";

import React, { useState } from "react";

interface MonthlyPlannerProps {
  onNavigateToDagbok: (
    year: number,
    month: number,
    day: number,
    text: string,
  ) => void;
  onSaveNote: (year: number, month: number, day: number, text: string) => void;
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

  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = new Date(year, month).toLocaleString("sv-SE", {
    month: "long",
  });

  const currentMonthIsLocked = false;

  const handleTextChange = (day: number, newText: string) => {
    const noteKey = `${year}-${month + 1}-${day}`;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [noteKey]: newText,
    }));

    onSaveNote(year, month, day, newText);
  };

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
            const locked = currentMonthIsLocked;
            const hasDagbokEntry = false;
            const chosen = day === chosenDay;

            const getDayClass = () => {
              let classes = dateStyles;

              if (locked) {
                classes += " cursor-not-allowed opacity-50";
              } else if (chosen) {
                classes += " border-[#FF7518] shadow-lg shadow-[#FF7518]/50";
              } else if (isToday) {
                classes += " border-[#FF7518] shadow-lg shadow-white/50";
              }

              return classes;
            };

            const noteKey = `${year}-${month + 1}-${day}`;
            const dayText = notes[noteKey] || "";

            return (
              <div
                key={day}
                className={getDayClass()}
                tabIndex={0}
                onClick={
                  locked
                    ? undefined
                    : () => {
                        setChosenDay(day);
                        onNavigateToDagbok(year, month, day, dayText);
                      }
                }
                onKeyDown={
                  locked
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setChosenDay(day);
                          onNavigateToDagbok(year, month, day, dayText);
                        }
                      }
                }
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1">
                    <strong className="text-lg">
                      <span className="sm:hidden mr-2 text-[#FF7518] font-normal">
                        {
                          weekDays[
                            (new Date(year, month, day).getDay() + 6) % 7
                          ]
                        }
                        :
                      </span>
                      {day}
                    </strong>
                  </div>
                  {hasDagbokEntry && (
                    <span className="text-sm" title="Dagbokspost finns"></span>
                  )}
                </div>
                <textarea
                  aria-label={`Anteckningar för ${day} ${monthName} ${year}`}
                  value={dayText}
                  onChange={(event) =>
                    handleTextChange(day, event.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-10 p-2 text-sm bg-transparent backdrop-blur-md text-gray-100 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FF7518]/20 focus:border-transparent transition-all duration-300 shadow-inner placeholder-gray-500 resize-none"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarUI;
