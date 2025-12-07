"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api";

interface HealthResponse {
    status: string;
    message: string;
}

const HealthBanner = () => {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<HealthResponse>("/api/health")
            .then(setHealth)
            .catch((err) => {
                console.error(err);
                setError("Dagbok API is not running");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-500 text-white py-1 px-2 rounded-lg text-sm">
                <p>Loading API status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500 text-white py-0.5 px-2 rounded-lg text-sm">
                <p>{error}</p>
            </div>
        );
    }

    if (!health) return null;

    const isHealthy = health.status === "UP";
    const bgColor = isHealthy ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`${bgColor} text-white py-0.5 px-2 rounded-lg text-sm`}>
            <p>
                <span className="mx-2">{health.message}</span>
            </p>
        </div>
    );
};

export default HealthBanner;