import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/stats',
        name: 'Stats',
        component: () => import('../views/Stats.vue'),
    },
    {
        path: '/budget',
        name: 'Budget',
        component: () => import('../views/Budget.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
