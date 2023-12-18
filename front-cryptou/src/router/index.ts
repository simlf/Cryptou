import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import GraphView from "../views/GraphView.vue";
import Articles from "../views/Articles.vue";
import HomeView from "../views/HomeView.vue";

export const routeNames = {
    login: "login",
    register: "register",
    graph: "graph",
    articles: "articles",
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
            path: "/graph/:cmid?",
            name: routeNames.graph,
            component: GraphView,
        },
        {
            path: "/articles",
            name: routeNames.articles,
            component: Articles,
        },
    ],
});

export default router;
