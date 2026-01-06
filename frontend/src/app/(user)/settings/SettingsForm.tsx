"use client";

import { User } from "@/lib/props";
import { useEffect, useState } from "react";

interface SettingsModalProps {
  user?: User;
}

const SettingsForm = ({ user }: SettingsModalProps) => {
  const [userPrompt, setUserPrompt] = useState(user?.prompt || "");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const maxLength = 2000;

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/prompt`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPrompt: userPrompt,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSaveStatus("Prompt uppdaterad!");
    } catch (error) {
      console.error("Failed to update user prompt:", error);
      setSaveStatus("Fel vid uppdatering av prompt.");
    } finally {
      setIsSaving(false);
      if (timeoutId) clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => setSaveStatus(""), 3000);
      setTimeoutId(newTimeoutId);
    }
  };

  return (
    <main className={"flex min-h-screen justify-center sm:items-center"}>
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#2A2A2A] p-4 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-3xl sm:rounded-lg">
        <div className="border-b border-white/10 sm:p-1">
          <h2
            id="settings-modal-title"
            className="text-2xl font-semibold text-white"
          >
            Inställningar
            <span className={"mb-6 text-xs font-semibold"}>(Avancerat)</span>
          </h2>
        </div>
        <div className={"mb-6 justify-center text-center"}>
          <label htmlFor="prompt-textarea" className="mb-2 block pt-5">
            Prompt:
          </label>
          <div className="prose prose-invert max-w-none">
            <textarea
              id="prompt-textarea"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              maxLength={maxLength}
              aria-describedby="char-count"
              className="relative min-h-[100px] w-full resize-none rounded-lg bg-[#1A1A1A] p-4 text-left shadow-2xl outline-none focus:ring-2 focus:ring-blue-500"
              rows={15}
            />
          </div>
          <div
            id="char-count"
            className="mt-1 text-right text-sm text-gray-400"
            aria-live="polite"
          >
            {userPrompt.length}/{maxLength} tecken
          </div>
          <button
            className="mt-4 rounded bg-[#FF7518] px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:bg-transparent sm:text-gray-400 sm:hover:bg-[#FF7518] sm:hover:text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Sparar..." : "Spara"}
          </button>
        </div>
      </div>
      {saveStatus && (
        <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-[#FF7518] p-3 text-sm text-white shadow-xl">
          {saveStatus}
        </div>
      )}
    </main>
  );
};

export default SettingsForm;
