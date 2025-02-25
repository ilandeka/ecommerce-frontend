import api from './api';

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const profileService = {
    async getProfile() {
        const response = await api.get('/api/profile');
        return response.data;
    },

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        const response = await api.post('/api/profile/change-password', {
            currentPassword,
            newPassword,
            confirmPassword
        });
        return response.data;
    }
};