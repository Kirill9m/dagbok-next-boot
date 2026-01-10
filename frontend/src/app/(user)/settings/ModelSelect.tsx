interface ModelSelectProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  setSaveStatus: (status: string) => void;
  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: (id: NodeJS.Timeout | null) => void;
}

const MODEL_OPTIONS = [
  { value: "openai/gpt-4o-mini", label: "GPT-4O Mini" },
  { value: "xiaomi/mimo-v2-flash:free", label: "Xiaomi Mimo V2 Flash (free)" },
];

export default function ModelSelect({
  selectedModel,
  setSelectedModel,
  isSaving,
  setIsSaving,
  setSaveStatus,
  timeoutId,
  setTimeoutId,
}: ModelSelectProps) {
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/model`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();

        if (error.error === "Too many requests") {
          const msg = `För många förfrågningar. Försök igen om ${error.retryAfter} sekunder`;
          setSaveStatus(msg);
          return;
        }
      }

      setSaveStatus("Modell uppdaterad!");
    } catch (error) {
      console.error("Failed to update user model:", error);
      setSaveStatus("Fel vid uppdatering av modell.");
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
        Välj AI-modell. Ändringar här påverkar hur dina anteckningar bearbetas.
      </p>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className={`w-full cursor-pointer touch-manipulation rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-gray-100 transition-all duration-100 hover:bg-white/10 focus:ring-2 focus:ring-[#FF7518]/20 focus:outline-none sm:py-2 sm:text-sm`}
      >
        {MODEL_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#1A1A1A] text-gray-100"
          >
            {option.label}
          </option>
        ))}
      </select>
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
