import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/process',
            name: 'process',
            component: () => import('../views/ProcessView.vue')
        },

        {
            path: '/account-list',
            name: 'account-list',
            component: () => import('../views/AccountListView.vue')
        },
        {
            path: '/payment-list',
            name: 'payment-list',
            component: () => import('../views/PaymentListView.vue')
        },
        {
            path: '/payment-info',
            name: 'payment-info',
            component: () => import('../features/PaymentForm.vue')
        },
        {
            path: '/payment-info/:id',
            name: 'payment-info',
            component: () => import('../features/PaymentForm.vue')
        }
    ]
});

export default router;
