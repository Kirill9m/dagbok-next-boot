"use client";

import { useEffect, useState } from "react";
import { AndroidIcon, AppleIconOrange } from "@/app/components/icons";

interface UserChoiceProps {
  platform: "ios" | "android" | "";
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const AppInstallInfo = () => {
  const [userChoice, setUserChoice] = useState<UserChoiceProps>({
    platform: "",
  });
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(installEvent);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return (
    <div className="mt-3 w-full rounded-3xl bg-[#2A2A2A] p-4">
      <h4 className="mb-2 font-semibold">
        Installera appen på din telefon för snabbare åtkomst
      </h4>

      <div className="mb-3 flex gap-2">
        <AppleIconOrange
          onClick={() => setUserChoice({ platform: "ios" })}
          className="h-8 w-8 cursor-pointer"
          aria-label="Välj iOS installation"
          role="button"
          tabIndex={0}
        />

        <AndroidIcon
          onClick={() => setUserChoice({ platform: "android" })}
          className="h-8 w-6 text-white"
          aria-label="Välj Android installation"
          role="button"
          tabIndex={0}
        />
      </div>

      {userChoice.platform === "ios" && (
        <>
          <p className="mb-2 text-sm">För att installera på din iPhone/iPad:</p>
          <ol className="ml-4 space-y-1 text-sm">
            <li>Tryck på Dela-knappen ⎙</li>
            <li>Välj &quot;Lägg till på hemskärmen&quot;</li>
            <li>Tryck på &quot;Lägg till&quot;</li>
          </ol>
        </>
      )}

      {userChoice.platform === "android" && (
        <>
          <p className="mb-2 text-sm">För att installera på din Android:</p>

          {canInstall ? (
            <button
              onClick={handleInstall}
              className="rounded-xl bg-black px-4 py-2 text-sm text-white"
            >
              Installera appen
            </button>
          ) : (
            <p className="text-sm">Installation är inte tillgänglig just nu.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AppInstallInfo;
