import api from './api';

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const profileService = {
    async getProfile() {
        const response = await api.get('/profile');
        return response.data;
    },

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        const response = await api.post('/profile/change-password', {
            currentPassword,
            newPassword,
            confirmPassword
        });
        return response.data;
    }
};