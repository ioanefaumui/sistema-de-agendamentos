import { cookies } from "next/headers";
export const api = process.env.API_URL || "http://localhost:3001";

export async function serverApiClient(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const newInit: RequestInit = {
    ...init,
    headers,
    cache: "no-store",
  };

  return fetch(input, newInit);
}
