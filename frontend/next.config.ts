import type { NextConfig } from "next";

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    const destination =
      apiBase.length > 0 ? `${apiBase}/api/:path*` : `/api/:path*`;

    return [
      {
        source: "/api/:path*",
        destination,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
