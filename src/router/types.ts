import type { Component } from "vue";
import "vue-router";

export enum Layout {
  Default = "DefaultLayout",
  Auth = "AuthLayout",
}

declare module "vue-router" {
  interface RouteMeta {
    layout?: Layout;
    layoutComponent?: Component;
  }
}
