import api from './api';

export interface PaymentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

export const paymentService = {
    async createPaymentIntent(orderId: number, currency: string = 'USD'): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>('/payments/create-payment-intent', {
            orderId,
            currency
        });
        return response.data;
    }
};