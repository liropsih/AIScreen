import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
// import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import { loadLayoutMiddleware } from "./middleware/loadLayoutMiddleware";
import { authMiddleware } from "./middleware/authMiddleware";
import { Layout } from "./types";
import TemplateView from "@/views/TemplateView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: MainView,
    },
    {
      path: "/template/:id?",
      name: "template-view",
      component: TemplateView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        layout: Layout.Auth,
      },
    },
  ],
});

router.beforeEach(authMiddleware);
router.beforeEach(loadLayoutMiddleware);

export default router;
