import api from './api';
import type { OrdersResponse } from '../types/order';

export const orderService = {
    async getMyOrders(page: number = 0, size: number = 10, sort: string = 'createdAt,desc') {
        const response = await api.get<OrdersResponse>('/orders/my-orders', {
            params: {
                page,
                size,
                sort
            }
        });
        return response.data;
    }
};