import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const FETCH_TIMEOUT_MS = 30000;

export async function handler(req: NextRequest) {
  const originalPath = req.nextUrl.pathname;
  const backendPath = originalPath.replace(/^\/api/, "");
  const url = `${BACKEND_URL}${backendPath}`;

  console.log("Proxy →", req.method, url);

  const headersToFilter = new Set([
    'host', 'connection', 'content-length',
    'transfer-encoding', 'content-encoding'
    ]);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: Object.fromEntries(
      Array.from(req.headers.entries()).filter(
        ([key]) => !headersToFilter.has(key.toLowerCase())
  )
  ),
  };

  if (req.method !== "GET" && req.body) {
    fetchOptions.body = await req.text();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const backendRes = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      });
    clearTimeout(timeoutId);

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