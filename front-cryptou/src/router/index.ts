import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';

export const routeNames = {
    login: "login",
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: routeNames.login,
            component: LoginView,
        },
    ],
});

export default router;