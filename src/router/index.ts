import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/login',
            component: () => import('../views/LoginView.vue'),
            meta: { requiresAuth: false, requiresGuest: true }
        },
        {
            path: '/register',
            component: () => import('../views/RegisterView.vue'),
            meta: { requiresAuth: false, requiresGuest: true }
        },
        {
            path: '/products',
            component: () => import('../views/ProductsView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/about',
            component: () => import('../views/AboutView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/contact',
            component: () => import('../views/ContactView.vue'),
            meta: { requiresAuth: false }
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
        {
            path: '/forgot-password',
            component: () => import('../views/ForgotPasswordView.vue'),
            meta: { requiresAuth: false, requiresGuest: true }
        },
        {
            path: '/reset-password',
            component: () => import('../views/ResetPasswordView.vue'),
            meta: { requiresAuth: false }
        }
    ],
});

router.beforeEach(async (_to, _from, next) => {
    const authStore = useAuthStore();

    // Force authentication check before proceeding
    await authStore.checkAuth();

    // If authenticated and trying to access guest routes
    if (_to.meta.requiresGuest && authStore.isAuthenticated) {
        next({path: '/'});
        return;
    }

    // If needs authentication and not authenticated
    if (_to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({
            path: '/login',
            query: {redirect: _to.fullPath}
        });
        return;
    }

    next();
});

export default router;
