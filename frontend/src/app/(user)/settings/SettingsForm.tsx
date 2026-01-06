"use client";

import { User } from "@/lib/props";
import { useEffect, useState } from "react";
import ModelSelect from "@/app/(user)/settings/ModelSelect";
import PromptEditor from "@/app/(user)/settings/PromptEditor";
import { SettingsTabs } from "@/app/(user)/settings/SettingsTab";

interface SettingsModalProps {
  user?: User;
}

const SettingsForm = ({ user }: SettingsModalProps) => {
  const [userPrompt, setUserPrompt] = useState(user?.prompt || "");
  const [selectedModel, setSelectedModel] = useState(
    user?.model || "openai/gpt-4o-mini",
  );
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

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
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mb-6 justify-center text-center">
          {activeTab == "tab1" && (
            <PromptEditor
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              setSaveStatus={setSaveStatus}
              timeoutId={timeoutId}
              setTimeoutId={setTimeoutId}
            />
          )}
          {activeTab == "tab2" && (
            <ModelSelect
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              setSaveStatus={setSaveStatus}
              timeoutId={timeoutId}
              setTimeoutId={setTimeoutId}
            />
          )}
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
