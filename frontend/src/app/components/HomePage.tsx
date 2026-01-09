"use client";

import AppPreview from "@/app/components/AppPreview";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/props";

interface HomePageProps {
  user?: User | null;
}

export default function HomePage({ user }: HomePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const demoLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Login failed");
          router.push("/calendar");
          router.refresh();
        })
        .catch(() => {
          alert(
            "Något gick fel vid skapandet av demokontot. Försök igen senare.",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 10000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-3xl font-bold text-white">Dagbok Cloud</h1>

      <p className="mb-5 mb-8 max-w-xl text-gray-300">
        Work in progress — a time reporting system currently under development.
      </p>

      <div className="w-full max-w-4xl">
        {!user ? (
          <button
            onClick={demoLogin}
            disabled={loading}
            className="mb-10 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7518]/70 p-3 font-medium text-white transition-all duration-300 hover:bg-[#ff8833] disabled:opacity-60"
          >
            {loading ? "Skapar testkonto" : "Begär testkonto"}
            {loading && (
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
            )}
          </button>
        ) : null}
        <AppPreview />
      </div>
    </div>
  );
}
