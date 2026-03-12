const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

// redirect to login if auth fails
export function handleAuthFailure(response: Response): never {
  if (response.status === 401) {
    window.location.href = `${API_BASE_URL}/auth/login`;
  }
  throw new Error(`Request failed: ${response.status}`);
}
