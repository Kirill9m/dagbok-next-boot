"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");

      setMessage("Inloggning lyckades");
      await router.push("/");
    } catch {
      setMessage("Fel användarnamn eller lösenord");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#2A2A2A] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <h1 className="text-2xl font-semibold text-center mb-6">Logga in</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              E-postadress
            </label>
            <input
              id="email"
              type="email"
              placeholder="du@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-transparent border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF7518]/30 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-transparent border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF7518]/30 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-[#FF7518] hover:bg-[#ff8833] text-white font-medium transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
        )}

        <div className="text-center text-sm mt-6">
          <a
            href="/register"
            className="text-[#FF7518] hover:underline transition"
          >
            Har du inget konto? Registrera dig
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
