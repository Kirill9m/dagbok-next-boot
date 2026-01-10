"use client";

import AppPreview from "@/app/components/AppPreview";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@/lib/props";

interface HomePageProps {
  user?: User | null;
}

export default function HomePage({ user }: HomePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("demoRateLimitUnlock");
    if (saved) {
      const unlockTime = parseInt(saved);
      const remaining = Math.max(
        0,
        Math.ceil((unlockTime - Date.now()) / 1000),
      );
      if (remaining > 0) {
        setCountdown(remaining);
        setRetryAfter(remaining);
      } else {
        localStorage.removeItem("demoRateLimitUnlock");
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && retryAfter !== null) {
      setRetryAfter(null);
      setSaveStatus("");
      localStorage.removeItem("demoRateLimitUnlock");
    }
  }, [countdown, retryAfter]);

  const demoLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (countdown > 0) {
      return;
    }

    setLoading(true);
    setSaveStatus("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 429) {
        const retryAfterValue = parseInt(
          res.headers.get("Retry-After") || "60",
        );
        const unlockTime = Date.now() + retryAfterValue * 1000;
        localStorage.setItem("demoRateLimitUnlock", unlockTime.toString());
        setRetryAfter(retryAfterValue);
        setCountdown(retryAfterValue);

        const errorData = await res.json().catch(() => ({}));
        setSaveStatus(
          errorData.error ||
            `För många förfrågningar. Försök igen om ${retryAfterValue} sekunder.`,
        );

        setTimeout(() => setSaveStatus(""), 3000);
        return;
      }

      if (!res.ok) {
        throw new Error(
          "Serverfel vid skapandet av demokontot. Försök igen senare.",
        );
      }

      setSaveStatus("Demokonto skapat! Omdirigerar...");
      setTimeout(() => {
        router.push("/calendar");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error(`Failed to create demo account:`, error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ett oväntat fel uppstod. Försök igen senare.";
      setSaveStatus(errorMessage);

      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-3xl font-bold text-white">Dagbok Cloud</h1>

      <p className="mb-8 max-w-xl text-gray-300">
        Work in progress — a time reporting system currently under development.
      </p>

      <div className="w-full max-w-4xl">
        {!user ? (
          <>
            {countdown > 0 && retryAfter ? (
              <div className="mb-10 w-full p-4">
                <p className="mb-2 text-sm text-white">
                  För många förfrågningar. Vänta {countdown} sekunder.
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full bg-[#FF7518] transition-all duration-1000 ease-linear"
                    style={{
                      width: `${((retryAfter - countdown) / retryAfter) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={demoLogin}
                disabled={loading}
                className="mb-10 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7518]/70 p-3 font-medium text-white transition-all duration-300 hover:bg-[#ff8833] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    Skapar testkonto
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  </>
                ) : (
                  "Begär testkonto"
                )}
              </button>
            )}
          </>
        ) : null}
        <AppPreview />
      </div>

      {saveStatus && (
        <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-[#FF7518] p-4 text-sm text-white shadow-xl transition-opacity duration-300">
          {saveStatus}
        </div>
      )}
    </div>
  );
}
