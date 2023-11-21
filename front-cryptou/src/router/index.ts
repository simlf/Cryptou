import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

export const routeNames = {
    login: "login",
    register: "register",
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: routeNames.login,
            component: LoginView,
        },
        {
            path: "/register",
            name: routeNames.register,
            component: RegisterView,
        },
    ],
});

export default router;