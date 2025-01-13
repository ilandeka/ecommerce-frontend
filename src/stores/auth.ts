import {defineStore} from 'pinia'
import {onMounted, ref} from 'vue'
import type {AuthResponse, User} from '../types/auth'
import {authService} from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    /**
     * Initialize authentication state
     * Always verify with backend before granting access
     */
    async function checkAuth() {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            clearAuthData();
            return;
        }

        try {
            // Get fresh user data from backend
            const currentUser = await authService.getCurrentUser();

            // Set user state with validated data from backend
            user.value = {
                email: currentUser.email,
                fullName: currentUser.fullName,
                roles: parseRoles(currentUser.roles)
            };

            isAuthenticated.value = true;
        } catch (error) {
            clearAuthData();
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

    /**
     * Set authentication data after successful login/registration
     * We only store the minimum necessary info in localStorage
     */
    function setAuthData(response: AuthResponse) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Parse and validate roles
        const userRoles = parseRoles(response.roles);

        // Set user state in memory only
        user.value = {
            email: response.email,
            fullName: response.fullName,
            roles: userRoles
        };

        isAuthenticated.value = true;
    }

    /**
     * Clear all auth data on logout or error
     */
    function clearAuthData() {
        localStorage.clear();
        user.value = null;
        isAuthenticated.value = false;
    }

    /**
     * Check if user has a specific role
     * This should always verify with the backend for sensitive operations
     */
    function hasRole(roleToCheck: string): boolean {
        if (!user.value?.roles) return false;

        // Validate the role being checked
        if (!isValidRole(roleToCheck)) {
            console.error('Invalid role check attempted:', roleToCheck);
            return false;
        }

        return user.value.roles.includes(roleToCheck);
    }

    /**
     * Properly parse roles from various formats into a clean array
     * This ensures consistent role handling regardless of input format
     */
    function parseRoles(roles: string[] | string): string[] {

        // If we get a string that looks like an array
        if (typeof roles === 'string' && roles.startsWith('[')) {
            try {
                // First, try to parse it as a JSON array
                const parsed = JSON.parse(roles);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
                // If that fails, do manual parsing
                return roles
                    .replace('[', '')
                    .replace(']', '')
                    .split(',')
                    .map(role => role.trim());
            } catch {
                // If JSON parsing fails, do manual parsing
                return roles
                    .replace('[', '')
                    .replace(']', '')
                    .split(',')
                    .map(role => role.trim());
            }
        }

        // If it's already an array, just return it
        if (Array.isArray(roles)) {
            return roles;
        }

        // If it's a single string role
        if (typeof roles === 'string') {
            return [roles];
        }

        console.warn('Unexpected roles format:', roles);
        return [];
    }

    /**
     * Validate that a role matches our expected format
     * This prevents injection of malicious role strings
     */
    function isValidRole(role: string): boolean {
        // Only allow specific valid roles
        const validRoles = ['ROLE_USER', 'ROLE_ADMIN'];
        return validRoles.includes(role);
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
        checkAuth,
        hasRole
    };
});