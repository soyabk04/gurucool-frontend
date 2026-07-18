import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Requests that must never trigger a refresh-and-retry loop.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/accesstoken", "/auth/logout"];

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/accesstoken")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      originalRequest?.url?.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return api(originalRequest);
      }

      // The refresh token is gone/expired too — the session is truly over.
      // Send the user back to login rather than letting requests fail silently.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);