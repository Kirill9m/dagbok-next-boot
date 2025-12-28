"use client";

import { User } from "@/lib/props";
import { useState } from "react";

interface SettingsModalProps {
  user?: User;
}

const SettingsModal = ({ user }: SettingsModalProps) => {
  const [userPrompt, setUserPrompt] = useState(user?.prompt || "");
  const [saveStatus, setSaveStatus] = useState("");
  const maxLength = 2000;

  const handleSave = async () => {
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
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  return (
    <main className={"min-h-screen flex items-center justify-center"}>
      <div className="bg-[#2A2A2A] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <h1 className={"text-2xl font-semibold text-center mb-6"}>
          Inställningar
        </h1>
        <div className={"justify-center text-center mb-6"}>
          <label htmlFor="prompt-textarea" className="mb-2 block">
            Prompt:
          </label>
          <textarea
            id="prompt-textarea"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            maxLength={maxLength}
            aria-describedby="char-count"
            className="relative rounded-lg p-6 w-full shadow-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-[#1A1A1A] min-h-[100px] text-left resize-none"
            rows={5}
          />
          <div
            id="char-count"
            className="text-sm text-gray-400 mt-1 text-right"
            aria-live="polite"
          >
            {userPrompt.length}/{maxLength} tecken
          </div>
          <button
            className="text-gray-400 mt-4 px-4 py-2 rounded hover:bg-[#FF7518] hover:text-white transition"
            onClick={handleSave}
          >
            Spara
          </button>
        </div>
      </div>
      {saveStatus && (
        <div
          className="fixed bottom-4 right-4 bg-[#FF7518] text-white p-3 rounded-lg shadow-xl z-50 text-sm"
          role="status"
        >
          {saveStatus}
        </div>
      )}
    </main>
  );
};

export default SettingsModal;
