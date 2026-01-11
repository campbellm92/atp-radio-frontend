import { BACKEND_BASE_URL } from "../config/urls";

export async function fetchAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/token`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}
