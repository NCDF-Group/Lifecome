/** Base URL pulled from env – falls back to the live server so the app works without .env */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://lifecome-backend.onrender.com";

// ─── Error Types ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
  }

  /** First human-readable message the backend sends, if any. */
  get userMessage(): string {
    if (typeof this.body === "object" && this.body !== null) {
      const b = this.body as Record<string, unknown>;
      if (typeof b.message === "string") return b.message;
      if (Array.isArray(b.message)) return (b.message as string[]).join(", ");
    }
    return this.message;
  }
}

// ─── Request helpers ──────────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  token?: string;
  /** Extra headers */
  headers?: Record<string, string>;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts.headers,
  };

  if (opts.token) {
    headers["Authorization"] = `Bearer ${opts.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // Some endpoints return 204 with no body
  if (res.status === 204) return undefined as T;

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    // Log the full response in dev so it's easy to inspect in DevTools
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[API] ${method} ${path} → ${res.status}`,
        JSON.stringify(json, null, 2),
      );
    }
    throw new ApiError(res.status, json);
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, body, opts),
  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, body, opts),
  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>("PUT", path, body, opts),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>("DELETE", path, undefined, opts),
};
