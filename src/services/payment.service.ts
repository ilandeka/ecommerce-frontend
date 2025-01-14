import api from './api';
import type { PaymentResponse } from "../types/payment";

export const paymentService = {
    async createPaymentIntent(orderId: number, currency: string = 'USD'): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>('/api/payments/create-payment-intent', {
            orderId,
            currency
        });
        return response.data;
    }
};