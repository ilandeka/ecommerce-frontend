export interface PaymentResponse {
    clientSecret: string;
    paymentIntentId: string;
    orderId: number;
}