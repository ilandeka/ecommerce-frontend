import api from './api'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

export const authService = {

    async getCurrentUser(): Promise<AuthResponse> {
        const response = await api.get<AuthResponse>('/api/auth/me');
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/api/auth/logout');
        localStorage.clear();
    },
};