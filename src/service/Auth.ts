import router from "@/router";
import { onError, onSuccess } from "./Toast";

export const AuthTokenKey = "auth_token";

export const getAuthToken = () => {
  const token =
    localStorage.getItem(AuthTokenKey) || sessionStorage.getItem(AuthTokenKey);
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
};

const clearAuthToken = () => {
  localStorage.removeItem(AuthTokenKey);
  sessionStorage.removeItem(AuthTokenKey);
};

export const logout = () => {
  clearAuthToken();
  router.push("/login");
};

export const onAuthError = (message?: string) => {
  onError(message || "Auth error");
  clearAuthToken();
  router.push("/login");
};

export const onAuthSuccess = (token: string, rememberMe: boolean) => {
  onSuccess("Auth success");
  clearAuthToken();
  if (rememberMe) {
    localStorage.setItem(AuthTokenKey, token);
  } else {
    sessionStorage.setItem(AuthTokenKey, token);
  }
  router.push("/");
};
