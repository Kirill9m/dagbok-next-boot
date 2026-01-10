export default function PromptEditor({
  userPrompt,
  setUserPrompt,
  isSaving,
  setIsSaving,
  setSaveStatus,
  timeoutId,
  setTimeoutId,
}: {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  setSaveStatus: (status: string) => void;
  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: (id: NodeJS.Timeout | null) => void;
}) {
  const maxLength = 2000;

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
        const error = await res.json();

        if (error.error === "Too many requests") {
          const msg = `För många förfrågningar. Försök igen om ${error.retryAfter} sekunder`;
          setSaveStatus(msg);
          return;
        }
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
    <>
      <p className="mb-6 text-sm text-gray-400 sm:text-base">
        Anpassa systemprompt. Ändringar här påverkar hur dina anteckningar
        bearbetas och formateras.
      </p>
      <a className="text-[#FF7518] hover:underline" href="/info/prompts">
        Exempel
      </a>
      <div className="prose prose-invert max-w-none">
        <textarea
          id="prompt-textarea"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          maxLength={maxLength}
          aria-describedby="char-count"
          className="relative min-h-[100px] w-full resize-none rounded-lg bg-[#1A1A1A] p-4 text-left shadow-2xl outline-none focus:ring-2 focus:ring-[#FF7518]/20"
          rows={12}
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
    </>
  );
}
