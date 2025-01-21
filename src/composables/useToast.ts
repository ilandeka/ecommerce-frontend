import { ref } from 'vue'

interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
    duration?: number;  // Allow custom duration per toast
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

const DEFAULT_DURATION = 3000;

export function useToast() {
    function showToast(
        message: string,
        type: 'success' | 'error' | 'info' = 'info',  // Set default type to 'info'
        duration: number = DEFAULT_DURATION
    ) {
        const id = nextId++;

        // Add new toast
        toasts.value.push({ message, type, id });

        // Set timeout for removal
        setTimeout(() => {
            removeToast(id);
        }, duration);

        // Return id in case we want to remove toast manually
        return id;
    }

    function removeToast(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    // Helper methods for specific toast types
    const success = (message: string, duration?: number) =>
        showToast(message, 'success', duration);

    const error = (message: string, duration?: number) =>
        showToast(message, 'error', duration);

    const info = (message: string, duration?: number) =>
        showToast(message, 'info', duration);

    return {
        toasts,
        showToast,
        success,
        error,
        info,
    };
}