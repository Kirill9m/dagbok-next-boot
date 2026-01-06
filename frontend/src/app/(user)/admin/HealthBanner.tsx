"use client";

import { useEffect, useState } from "react";

interface HealthResponse {
  status: "UP" | "DOWN";
  groups?: string[];
}

const HealthBanner = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/actuator/health`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("API request failed");
        }

        const data: HealthResponse = await res.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        console.error("Health check error:", err);
        setError("API Offline");
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-500/80 px-3 py-1 text-xs font-medium text-white">
        <span className="animate-pulse">●</span>
        Checking...
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-500/90 px-3 py-1 text-xs font-medium text-white">
        <span className="text-red-200">●</span>
        {error || "API Offline"}
      </div>
    );
  }

  const isHealthy = health.status === "UP";

  return (
    <div
      className={`${
        isHealthy ? "bg-green-500/90" : "bg-red-500/90"
      } flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium text-white`}
    >
      <span className={isHealthy ? "text-green-200" : "text-red-200"}>●</span>
      API {health.status}
    </div>
  );
};

export default HealthBanner;
