import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    const destination =
      apiBase.length > 0
        ? `${apiBase}/api/:path*`
        : "http://localhost:8080/api/:path*";

    return [
      {
        source: "/api/:path*",
        destination,
      },
    ];
  },
  output: "standalone",
  turbopack: {},
};

export default withPWA(nextConfig);
