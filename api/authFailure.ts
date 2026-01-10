import { BACKEND_BASE_URL } from "../config/urls";

// redirect to login if auth fails
export function handleAuthFailure(response: Response): never {
  if (response.status === 401) {
    window.location.href = `${BACKEND_BASE_URL}/login`;
  }
  throw new Error(`Request failed: ${response.status}`);
}
