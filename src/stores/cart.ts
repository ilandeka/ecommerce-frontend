import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import type { CartItem } from '../types/cart';

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref<CartItem[]>([]);
    const total = ref(0);
    const loading = ref(false);

    async function fetchCart() {
        loading.value = true;
        try {
            const response = await api.get('/api/cart');
            cartItems.value = response.data.items;
            total.value = response.data.total;
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            loading.value = false;
        }
    }

    async function addToCart(productId: number, quantity: number) {
        try {
            const response = await api.post('/api/cart/add', { productId, quantity });
            cartItems.value = response.data.items;
            total.value = response.data.total;
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);

            return false;
        }
    }

    async function updateCartItem(productId: number, quantity: number) {
        try {
            const response = await api.put('/api/cart/items', { productId, quantity });
            cartItems.value = response.data.items;
            total.value = response.data.total;
            return true;
        } catch (error) {
            console.error('Error updating cart:', error);
            return false;
        }
    }

    async function removeFromCart(productId: number) {
        try {
            const response = await api.delete(`/api/cart/items/${productId}`);
            cartItems.value = response.data.items;
            total.value = response.data.total;
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    }

    async function clearCart() {
        try {
            // Make API call to clear the cart in the backend
            await api.post('/api/cart/clear');
            // Clear the frontend state
            cartItems.value = [];
            total.value = 0;
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }

    return {
        cartItems,
        total,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
    };
});