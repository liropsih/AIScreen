import type { RouteLocationNormalized } from "vue-router";
import { Layout } from "../types";

export const loadLayoutMiddleware = async (route: RouteLocationNormalized) => {
  const layoutName = route.meta.layout || Layout.Default;

  try {
    const layoutComponent = await import(`@/layouts/${layoutName}.vue`);
    route.meta.layoutComponent = layoutComponent.default;
  } catch (e) {
    console.error(`Error loading layout "${layoutName}":`, e);

    if (layoutName !== Layout.Default) {
      console.log("Default layout loaded");
      const defaultLayoutComponent = await import(
        `@/layouts/${Layout.Default}.vue`
      );
      route.meta.layoutComponent = defaultLayoutComponent.default;
    } else {
      throw new Error("Error loading layout");
    }
  }
};
