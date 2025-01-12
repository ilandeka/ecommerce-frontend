import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/login',
            component: () => import('../views/LoginView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/register',
            component: () => import('../views/RegisterView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/products',
            component: () => import('../views/ProductsView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/about',
            component: () => import('../views/AboutView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/cart',
            component: () => import('../views/CartView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/checkout',
            component: () => import('../views/CheckoutView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/payment-success',
            component: () => import('../views/PaymentSuccessView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
    ],
});

router.beforeEach((_to, _from, next) => {
    const authStore = useAuthStore();

    if (_to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (
        (_to.path === '/login' || _to.path === '/register') &&
        authStore.isAuthenticated
    ) {
        next('/');
    } else {
        next();
    }
});

export default router;
