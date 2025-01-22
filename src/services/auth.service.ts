import api from './api'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
}

export const authService = {

    async getCurrentUser(): Promise<AuthResponse> {
        const response = await api.get<AuthResponse>('/api/auth/me', {
            headers: NO_CACHE_HEADERS
        });
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        // Add cache-busting headers to ensure we always get a fresh response
        const response = await api.post<AuthResponse>('/api/auth/login', data, {
            headers: NO_CACHE_HEADERS
        });
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/api/auth/register', data, {
            headers: NO_CACHE_HEADERS
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/api/auth/logout', {
            headers: NO_CACHE_HEADERS
        });
        localStorage.clear();
    },
};