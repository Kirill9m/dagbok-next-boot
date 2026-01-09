"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TermsModal from "@/app/components/TermsModal";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Lösenordet måste vara minst 8 tecken";
    if (!/[A-Z]/.test(pwd))
      return "Lösenordet måste innehålla minst en stor bokstav";
    if (!/\d/.test(pwd)) return "Lösenordet måste innehålla minst en siffra";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (password !== passwordRepeat) {
      setMessage("Lösenord stämmer inte");
      setLoading(false);
      return;
    }

    if (!agree) {
      setMessage("Du måste godkänna villkoren för att registrera dig.");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      if (!res.ok) throw new Error("Ett fel uppstod");

      router.push("/login");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ett fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="username" className="mb-2 block text-sm">
            Användarnamn
          </label>
          <div>
            <input
              id="username"
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-gray-100 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#FF7518]/30 focus:outline-none"
              required
              minLength={3}
              maxLength={50}
              title="3–50 tecken: endast bokstäver, siffror, understreck (_) och bindestreck (-)."
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-gray-100 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#FF7518]/30 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="repeatPassword" className="mb-2 block text-sm">
              Bekräfta
            </label>
            <input
              id="repeatPassword"
              type="password"
              placeholder="••••••••"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-gray-100 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#FF7518]/30 focus:outline-none"
              required
            />
          </div>
          <label className="mb-4 block">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />{" "}
            Jag har läst och accepterar{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTerms(true);
              }}
              className="text-[#FF7518] underline"
            >
              användarvillkoren
            </button>
            .
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#FF7518] p-3 font-medium text-white transition-all duration-300 hover:bg-[#ff8833] disabled:opacity-60"
          >
            {loading ? "Registrerar..." : "Registrera"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

        <div className="mt-6 text-center text-sm">
          <a
            href="/login"
            className="text-[#FF7518] transition hover:underline"
          >
            Har du redan ett konto? Logga in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
