import { APPS_SCRIPT_URL } from "@/lib/content";

export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function timeoutSignal() {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(20000);
  }
  return undefined;
}

async function readScript(response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return Response.json(parsed, { status: response.ok ? 200 : response.status, headers: JSON_HEADERS });
  } catch {
    return Response.json(
      { result: "error", message: "Content service returned an unexpected response." },
      { status: 502, headers: JSON_HEADERS }
    );
  }
}

function unreachable() {
  return Response.json(
    { result: "error", message: "Content service is unreachable." },
    { status: 502, headers: JSON_HEADERS }
  );
}

export async function GET() {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "GET",
      cache: "no-store",
      signal: timeoutSignal(),
    });
    return readScript(response);
  } catch {
    return unreachable();
  }
}

export async function POST(request) {
  try {
    const body = await request.text();
    const first = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") || "application/x-www-form-urlencoded" },
      body,
      redirect: "manual",
      cache: "no-store",
      signal: timeoutSignal(),
    });
    if (first.status >= 300 && first.status < 400) {
      const location = first.headers.get("location");
      if (!location) return unreachable();
      const followed = await fetch(location, {
        method: "GET",
        cache: "no-store",
        signal: timeoutSignal(),
      });
      return readScript(followed);
    }
    return readScript(first);
  } catch {
    return unreachable();
  }
}
