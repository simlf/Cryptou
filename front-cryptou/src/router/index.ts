import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import GraphView from "../views/GraphView.vue";
import Articles from "../views/Articles.vue";
import HomeView from "../views/HomeView.vue";
import SettingView from "../views/SettingView.vue";
import { Settings } from "@amcharts/amcharts5/.internal/core/util/Entity";

export const routeNames = {
  login: "login",
  register: "register",
  graph: "graph",
  articles: "articles",
  setting: "setting",
  home: "home",
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: routeNames.home,
      component: HomeView,
    },
    {
      path: "/login",
      name: routeNames.login,
      component: LoginView,
    },
    {
      path: "/register",
      name: routeNames.register,
      component: RegisterView,
    },
    {
      path: "/graph",
      name: routeNames.graph,
      component: GraphView,
    },
    {
      path: "/articles",
      name: routeNames.articles,
      component: Articles,
    },
    {
      path: "/settings",
      name: routeNames.setting,
      component: SettingView,
    },
  ],
});

export default router;
