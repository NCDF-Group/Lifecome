import { env } from "@/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * A thin, typed wrapper over `fetch` for calls to Lifecome-backend
 * (`/api/v1/...`). Once `npm run generate:api` has produced
 * `src/lib/api/generated/schema.d.ts` from the backend's OpenAPI contract,
 * feature `api.ts` files should call this with those generated request/
 * response types rather than `unknown`.
 *
 * No auth header is attached yet — see README.md "Known gap: admin auth".
 */
export async function apiFetch<TResponse = unknown>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // TODO: attach the staff session's credentials once admin auth exists.
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ApiError(
      `Request to ${path} failed with ${response.status}`,
      response.status,
      body,
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
