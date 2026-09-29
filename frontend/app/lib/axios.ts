import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true,
  timeout: 15000,
};
export const AxiosInstance = axios.create(options);
const sessionClient = axios.create(options);
let refreshPromise: Promise<unknown> | null = null;

export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = sessionClient.post("/refresh").finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function restoreSession() {
  try {
    await sessionClient.get("/auth/session");
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    await refreshSession();
    await sessionClient.get("/auth/session");
  }
}

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isPublicAuth = /^\/auth\/(login|signup|verify|otp)(?:[/?]|$)/.test(request?.url ?? "");
    if (error.response?.status === 401 && request && !request._retry &&
        !isPublicAuth && request.url !== "/refresh") {
      request._retry = true;
      try {
        await refreshSession();
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401 &&
            typeof window !== "undefined") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
      return AxiosInstance(request);
    }
    return Promise.reject(error);
  }
);
