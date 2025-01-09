import {defineStore} from 'pinia'
import {onMounted, ref} from 'vue'
import type {AuthResponse, User} from '../types/auth'
import {authService} from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    // Check if authenticated
    async function checkAuth() {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (accessToken && storedUser) {
            try {
                user.value = JSON.parse(storedUser);
                isAuthenticated.value = true;

                // Verify token is still valid with backend
                await authService.getCurrentUser();
            } catch (error) {
                clearAuthData();
            }
        }
    }

    async function login(email: string, password: string) {
        const response = await authService.login({ email, password });
        setAuthData(response);
    }

    async function register(fullName: string, email: string, password: string) {
        const response = await authService.register({ fullName, email, password });
        setAuthData(response);
    }

    async function logout() {
        await authService.logout();
        clearAuthData();
    }

    function setAuthData(response: AuthResponse) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        // Also store user data
        localStorage.setItem('user', JSON.stringify({
            email: response.email,
            fullName: response.fullName,
        }));
        user.value = {
            email: response.email,
            fullName: response.fullName,
        };
        isAuthenticated.value = true;
    }

    function clearAuthData() {
        localStorage.clear();
        user.value = null;
        isAuthenticated.value = false;
    }

    // Initialize auth state when store is created
    onMounted(() => {
        checkAuth();
    });

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth
    };
});