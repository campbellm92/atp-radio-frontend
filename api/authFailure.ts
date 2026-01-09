import { BASE_URL } from "./baseURL";

// redirect to login if auth fails
export function handleAuthFailure(response: Response): never {
  if (response.status === 401) {
    window.location.href = `${BASE_URL}/login`;
  }
  throw new Error(`Request failed: ${response.status}`);
}
