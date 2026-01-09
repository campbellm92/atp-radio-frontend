import { BASE_URL } from "./baseURL";
import { handleAuthFailure } from "./authFailure";

export async function fetchAccessToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    credentials: "include",
  });

  if (!response.ok) {
    handleAuthFailure(response);
  }

  const data = await response.json();
  return data.access_token;
}
