import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import type { AuthResponse, User } from '../types/auth'
import { authService } from '../services/auth.service'

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

    async function login(credentials: { email: string; password: string; rememberMe: boolean }) {
        const response = await authService.login(credentials);
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
     * Parse roles from various input formats into a clean array of validated roles
     * @param roles - Can be an array of roles, a string representation of roles, or undefined
     * @returns Array of validated role strings
     */
    function parseRoles(roles: unknown): string[] {
        // If no roles provided, return empty array
        if (!roles) return [];

        // Handle array input
        if (Array.isArray(roles)) {
            return roles.filter(role => isValidRole(String(role)));
        }

        // Handle string input
        if (typeof roles === 'string') {
            // If the string looks like an array (e.g., "[ROLE_USER, ROLE_ADMIN]")
            if (roles.startsWith('[') && roles.endsWith(']')) {
                try {
                    // Attempt to parse as JSON
                    const parsed = JSON.parse(roles);
                    if (Array.isArray(parsed)) {
                        return parsed.filter(role => isValidRole(String(role)));
                    }
                } catch {
                    // If JSON parsing fails, fall back to string splitting
                    return roles
                        .slice(1, -1)  // Remove brackets
                        .split(',')
                        .map(role => role.trim())
                        .filter(isValidRole);
                }
            }

            // Handle single role string
            return isValidRole(roles) ? [roles] : [];
        }

        // Log unexpected input for debugging
        console.warn('Unexpected roles format:', roles);
        return [];
    }

    /**
     * Validate that a role matches our expected format
     * This prevents injection of malicious role strings
     */
    function isValidRole(role: string): boolean {
        // Define valid roles explicitly
        const validRoles = new Set(['ROLE_USER', 'ROLE_ADMIN']);

        // Clean the role string before validation
        const cleanedRole = role.trim().toUpperCase();

        // Check if it's a valid role
        return validRoles.has(cleanedRole);
    }

    // Add a type guard for checking admin role specifically
    function isAdmin(): boolean {
        return hasRole('ROLE_ADMIN');
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
        hasRole,
        isAdmin
    };
});