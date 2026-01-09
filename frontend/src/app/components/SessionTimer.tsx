"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/props";

interface SessionTimerProps {
  user: User | null;
  text?: string;
  className?: string;
}

const DEMO_SESSION_KEY = "demoSessionStart";
const DEMO_SESSION_DURATION = 5 * 60 * 1000;

/**
 * SessionTimer component for demo user sessions.
 * Note: This timer relies on client-side localStorage and can be manipulated by users.
 * The actual session expiration is enforced server-side by JWT token expiration (5 minutes).
 * This component provides user-friendly visual feedback but does not control access.
 */
export default function SessionTimer({
  user,
  text,
  className,
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "DEMO") {
      localStorage.removeItem(DEMO_SESSION_KEY);
      return;
    }

    const startTimeStr = localStorage.getItem(DEMO_SESSION_KEY);
    const parsedTime = startTimeStr ? parseInt(startTimeStr, 10) : null;
    const startTime =
      parsedTime && !isNaN(parsedTime) ? parsedTime : Date.now();

    if (!startTimeStr) {
      localStorage.setItem(DEMO_SESSION_KEY, startTime.toString());
    }

    const updateTimer = () => {
      const elapsed = Date.now() - startTime;
      const remaining = DEMO_SESSION_DURATION - elapsed;

      if (remaining <= 0) {
        localStorage.removeItem(DEMO_SESSION_KEY);
        router.push("/");
        router.refresh();
        setTimeLeft(0);
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user, router]);

  if (user?.role !== "DEMO" || timeLeft === null || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = minutes < 2;

  return (
    <div
      className={`flex items-center gap-2 text-sm transition-colors ${
        isWarning ? "text-red-500/70" : "text-gray-400"
      } ${className || ""}`}
    >
      {isWarning && (
        <svg
          className="h-4 w-4 animate-pulse"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>
        {text} {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
