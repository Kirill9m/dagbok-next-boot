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
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
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
    <main className={"min-h-screen flex sm:items-center justify-center"}>
      <div className="bg-[#2A2A2A] w-full h-screen overflow-hidden flex flex-col sm:rounded-lg sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-3xl shadow-2xl relative p-4">
        <div className="sm:p-1 border-b border-white/10">
          <h2
            id="settings-modal-title"
            className="text-2xl font-semibold text-white"
          >
            Inställningar
            <span className={"text-xs font-semibold mb-6"}>(Avancerat)</span>
          </h2>
        </div>
        <div className={"justify-center text-center mb-6"}>
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
              className="relative rounded-lg p-4 w-full shadow-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-[#1A1A1A] min-h-[100px] text-left resize-none"
              rows={15}
            />
          </div>
          <div
            id="char-count"
            className="text-sm text-gray-400 mt-1 text-right"
            aria-live="polite"
          >
            {userPrompt.length}/{maxLength} tecken
          </div>
          <button
            className="text-white mt-4 px-4 py-2 rounded bg-[#FF7518] sm:bg-transparent sm:text-gray-400 sm:hover:bg-[#FF7518] sm:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Sparar..." : "Spara"}
          </button>
        </div>
      </div>
      {saveStatus && (
        <div className="fixed bottom-4 right-4 bg-[#FF7518] text-white p-3 rounded-lg shadow-xl z-50 text-sm">
          {saveStatus}
        </div>
      )}
    </main>
  );
};

export default SettingsForm;
