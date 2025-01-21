import api from './api';
import type { PaymentResponse } from "../types/payment";
import type { ShippingInfo } from "../types/order";

export const paymentService = {
    // For retrying failed payments
    async retryPayment(orderId: number, currency: string = 'USD'): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>('/api/payments/create-payment-intent', {
            orderId,
            currency
        });
        return response.data;
    },

    // Initial checkout with shipping info
    async initiateCheckout(shippingInfo: ShippingInfo): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>('/api/orders/checkout', {
            shippingInfo: shippingInfo  // Wrap the shipping info in an object
        });
        return response.data;
    }
};