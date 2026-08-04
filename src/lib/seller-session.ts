import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./session-cookie";

export const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function getSellerToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value;
}

export class SellerApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Server-only fetch helper for everything under /seller - attaches the
 * session's bearer token and calls the backend directly. This is the only
 * place that knows BACKEND_API_URL; the browser never calls the backend.
 */
export async function sellerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getSellerToken();

  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new SellerApiError(res.status, body.error ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
