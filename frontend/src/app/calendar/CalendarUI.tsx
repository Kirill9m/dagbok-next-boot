"use client";

import React, { useEffect, useState } from "react";
import { AIRobotHeadIcon, SearchIcon } from "@/app/components/icons";

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
  refreshKey?: number;
}

const CalendarUI: React.FC<MonthlyPlannerProps> = ({
  onNavigateToDagbok,
  onSaveNote,
  refreshKey,
}) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [chosenDay, setChosenDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [promptEnabled, setPromptEnabled] = useState(true);
  const [notesCountByDay, setNotesCountByDay] = useState<
    Record<string, number>
  >({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");

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
    "relative border-2 border-gray-700 bg-[#4A4A4A] text-white rounded-lg p-4 transform transition-all duration-300 ease-in-out hover:scale-[1.03] cursor-pointer shadow-md";

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notes/counts/${year}/${month + 1}`,
          { credentials: "include" },
        );

        if (res.ok) {
          const data = await res.json();
          const counts: Record<string, number> = {};
          if (data.counts && Array.isArray(data.counts)) {
            data.counts.forEach((item: { date: string; count: number }) => {
              const datePart = item.date.split("-");
              const d = Number.parseInt(datePart[2], 10);
              const m = Number.parseInt(datePart[1], 10);
              const y = Number.parseInt(datePart[0], 10);
              const key = `${y}-${m}-${d}`;
              counts[key] = item.count;
            });
          }
          setNotesCountByDay(counts);
        } else {
          console.error("Failed to load counts: HTTP", res.status);
          setNotesCountByDay({});
        }
      } catch (err) {
        console.error("Failed to load counts:", err);
        setNotesCountByDay({});
      } finally {
        setIsLoadingCounts(false);
      }
    };

    void loadCounts();
  }, [year, month, refreshKey]);

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
            className="text-[#FF7518] text-xs font-bold p-2 rounded-full hover:bg-gray-700 transition"
          >
            &gt;
          </button>
        </div>

        <div className="flex justify-center mt-4 gap-1">
          <div className="flex items-center gap-2 bg-[#4A4A4A] rounded-lg px-4 py-2 w-full max-w-md">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sök..."
              className="bg-transparent outline-none text-white w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("search clicked: " + searchInput);
                }
              }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <label
            htmlFor="prompt-toggle"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="prompt-toggle"
              className="sr-only"
              checked={promptEnabled}
              onChange={(e) => setPromptEnabled(e.target.checked)}
            />
            <AIRobotHeadIcon
              className={`w-10 h-10 transition-colors duration-300 ${
                promptEnabled ? "text-[#FF7518]" : "text-gray-400"
              }`}
            />
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
                <div
                  role="button"
                  className="flex justify-between items-start mb-1"
                >
                  <strong className="text-lg">{day}</strong>
                  {notesCountByDay[`${year}-${month + 1}-${day}`] > 0 && (
                    <span className="absolute -top-2 -right-2 grid min-h-6 min-w-6 place-items-center rounded-full bg-[#FF7518] py-1 px-1 text-xs font-bold text-white shadow-lg border border-white/20 z-10">
                      {notesCountByDay[`${year}-${month + 1}-${day}`]}
                    </span>
                  )}
                </div>

                <textarea
                  aria-label={`Anteckningar för ${day} ${monthName} ${year}`}
                  value={noteText}
                  onChange={(e) => handleNoteChange(day, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-16 sm:h-12 p-2 text-sm bg-transparent text-gray-100 rounded-xl border border-white/10 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7518]/20"
                />

                <button
                  className="mt-2 w-full sm:w-auto bg-transparent text-gray-400 px-4 py-2 rounded hover:text-white hover:bg-[#FF7518] transition min-h-[44px] text-sm font-medium"
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
