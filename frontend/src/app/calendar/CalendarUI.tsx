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
  onSearch: (query: string) => Promise<void>;
  isSearching?: boolean;
  searchError?: string | null;
}

const CalendarUI: React.FC<MonthlyPlannerProps> = ({
  onNavigateToDagbok,
  onSaveNote,
  refreshKey,
  onSearch,
  isSearching = false,
  searchError = null,
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
    "relative cursor-pointer rounded-lg border-2 border-gray-700 bg-[#4A4A4A] p-4 text-white shadow-md transition-all duration-300 ease-in-out hover:scale-[1.03]";

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
    <div className="mx-auto my-8 max-w-7xl rounded-xl bg-[#2A2A2A] p-4 text-white shadow-2xl sm:p-6 md:p-8">
      <div className="mb-6 text-center">
        <div className="font-inter mb-1 text-sm text-gray-400">Datum</div>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => handleNavigate("prev")}
            className="flex min-h-[48px] min-w-[48px] touch-manipulation items-center justify-center rounded-full p-4 text-3xl font-bold text-[#FF7518] transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:bg-gray-700 active:scale-95 active:bg-gray-600 sm:min-h-0 sm:min-w-0 sm:p-2 sm:text-xl"
            aria-label="Föregående månad"
          >
            &lt;
          </button>

          <div className="flex-1 text-center">
            <span className="block text-3xl font-extrabold sm:text-2xl">
              {year}
            </span>
            <div className="mt-1 text-base font-bold tracking-wider text-[#FF7518] uppercase sm:text-sm">
              {monthName}
            </div>
          </div>

          <button
            onClick={() => handleNavigate("next")}
            className="flex min-h-[48px] min-w-[48px] touch-manipulation items-center justify-center rounded-full p-4 text-3xl font-bold text-[#FF7518] transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:bg-gray-700 active:scale-95 active:bg-gray-600 sm:min-h-0 sm:min-w-0 sm:p-2 sm:text-xl"
            aria-label="Nästa månad"
          >
            &gt;
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex w-full justify-center gap-1">
            <div className="flex w-full max-w-md items-center gap-2 rounded-lg bg-[#4A4A4A] px-4 py-2">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sök..."
                maxLength={200}
                aria-label="Sök anteckningar"
                className="w-full bg-transparent text-white outline-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchInput.trim() && !isSearching) {
                    onSearch(searchInput);
                  }
                }}
                disabled={isSearching}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="rounded text-gray-400 hover:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  aria-label="Rensa sökfält"
                  type="button"
                  tabIndex={0}
                >
                  ✕
                </button>
              )}
            </div>
            <label
              htmlFor="prompt-toggle"
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                id="prompt-toggle"
                className="sr-only"
                checked={promptEnabled}
                onChange={(e) => setPromptEnabled(e.target.checked)}
              />
              <AIRobotHeadIcon
                className={`h-10 w-10 transition-colors duration-300 ${
                  promptEnabled ? "text-[#FF7518]" : "text-gray-400"
                }`}
              />
            </label>
          </div>

          {/* Loading and error messages */}
          {isSearching && <div className="text-sm text-gray-400">Söker...</div>}
          {searchError && (
            <div className="text-sm text-red-400" role="alert">
              {searchError}
            </div>
          )}
        </div>
      </div>

      <div className="calendar mt-8">
        <div className="mb-4 hidden grid-cols-7 border-b border-gray-700 pb-2 text-center font-bold text-gray-300 sm:grid">
          {weekDays.map((dayName) => (
            <div key={dayName} className="text-sm tracking-wider uppercase">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7 sm:gap-4">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="hidden min-h-24 sm:block"></div>
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
                  className="mb-1 flex items-start justify-between"
                >
                  <strong className="text-lg">{day}</strong>
                  {notesCountByDay[`${year}-${month + 1}-${day}`] > 0 && (
                    <span className="absolute -top-2 -right-2 z-10 grid min-h-6 min-w-6 place-items-center rounded-full border border-white/20 bg-[#FF7518] px-1 py-1 text-xs font-bold text-white shadow-lg">
                      {notesCountByDay[`${year}-${month + 1}-${day}`]}
                    </span>
                  )}
                </div>

                {/*
                 IMPORTANT: Font size must be at least 16px on mobile
                 to prevent iOS from auto-zooming when the textarea is focused.
                  Do NOT change text-base to text-sm on mobile breakpoint.
                */}
                <textarea
                  aria-label={`Anteckningar för ${day} ${monthName} ${year}`}
                  value={noteText}
                  onChange={(e) => handleNoteChange(day, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-16 w-full resize-none rounded-xl border border-white/10 bg-transparent p-3 text-base text-gray-100 focus:ring-2 focus:ring-[#FF7518]/20 focus:outline-none sm:h-12 sm:p-2 sm:text-sm"
                />

                <button
                  className="mt-2 min-h-[44px] w-full touch-manipulation rounded bg-[#FF7518] px-4 py-2 text-sm font-medium text-white transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] active:scale-[0.98] active:brightness-90 sm:w-auto sm:bg-transparent sm:text-gray-400 sm:hover:bg-[#FF7518] sm:hover:text-white"
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
