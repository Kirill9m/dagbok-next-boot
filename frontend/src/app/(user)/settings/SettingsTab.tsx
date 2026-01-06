export const SettingsTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="mb-4 flex gap-2 border-b border-white/10">
      <button
        onClick={() => setActiveTab("tab1")}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === "tab1"
            ? "border-b-2 border-[#FF7518] text-[#FF7518]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Prompt
      </button>
      <button
        onClick={() => setActiveTab("tab2")}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === "tab2"
            ? "border-b-2 border-[#FF7518] text-[#FF7518]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Model
      </button>
    </div>
  );
};
