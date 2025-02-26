import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { getAuthToken } from "@/service/Auth";

export const authMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.name === "login") {
    return next();
  }
  const token = getAuthToken();
  if (!token) {
    return next({ name: "login" });
  }
  return next();
};
