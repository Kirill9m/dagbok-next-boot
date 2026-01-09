"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Fel användarnamn eller lösenord");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold">Logga in</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm">
              Användarnamn
            </label>
            <input
              id="username"
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-gray-100 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#FF7518]/30 focus:outline-none"
              required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#FF7518] p-3 font-medium text-white transition-all duration-300 hover:bg-[#ff8833] disabled:opacity-60"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        <div className="mt-6 text-center text-sm">
          <a
            href="/register"
            className="text-[#FF7518] transition hover:underline"
          >
            Har du inget konto? Registrera dig
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
