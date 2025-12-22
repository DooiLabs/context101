const DOCS_API_BASE_URL = "https://api.context101.org";

function getBaseUrl() {
  return DOCS_API_BASE_URL.replace(/\/$/, "");
}

function buildUrl(path: string) {
  const base = getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeLibraryId(id: string) {
  return id.startsWith("/") ? id : `/${id}`;
}

function clampTokens(tokens: number) {
  return Math.max(10000, Math.min(100000, tokens));
}

export async function fetchDocs(params: {
  id: string;
  mode?: "code" | "info";
  tokens?: number;
  topic?: string;
}) {
  const url = new URL(buildUrl("/api/docs"));
  url.searchParams.set("id", normalizeLibraryId(params.id));
  url.searchParams.set("mode", params.mode ?? "code");
  url.searchParams.set("tokens", String(clampTokens(params.tokens ?? 10000)));
  if (params.topic) {
    url.searchParams.set("topic", params.topic);
  }

  const response = await fetch(url, { method: "GET" });
  const text = await response.text();
  if (!response.ok) {
    return `Error ${response.status}: ${text}`;
  }

  if (
    !text ||
    text.includes("No content available") ||
    text.includes("No context data available")
  ) {
    return "No content available for this mode. Try mode=info or mode=code.";
  }

  return text;
}
