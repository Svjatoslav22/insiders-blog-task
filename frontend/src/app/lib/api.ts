import type { ApiError } from "../types";

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const activeToken: string | null =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  if (activeToken) {
    headers.Authorization = `Bearer ${activeToken}`;
  }

  const response: Response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as ApiError | null;
    throw new Error(errorData?.message ?? `Request failed with status ${response.status}`);
  }

  return data as T;
}