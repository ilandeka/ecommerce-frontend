export interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    id: number;
    total: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    createdAt: string;
    items: OrderItem[];
    shippingInfo: ShippingInfo;
}

export interface OrdersResponse {
    content: Order[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}