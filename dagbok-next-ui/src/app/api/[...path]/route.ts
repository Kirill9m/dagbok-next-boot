import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function handler(req: NextRequest) {
  const originalPath = req.nextUrl.pathname;
  const backendPath = originalPath.replace(/^\/api/, "");
  const url = `${BACKEND_URL}${backendPath}`;

  console.log("Proxy →", req.method, url);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: Object.fromEntries(req.headers),
  };

  if (req.method !== "GET" && req.body) {
    fetchOptions.body = await req.text();
  }

  try {
    const backendRes = await fetch(url, fetchOptions);
    const contentType = backendRes.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const text = await backendRes.text();
    return new NextResponse(text, { status: backendRes.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Backend unreachable", { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };