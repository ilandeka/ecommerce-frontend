import { ref } from 'vue'

interface Toast {
    message: string;
    type: 'success' | 'error';
    id: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
    function showToast(message: string, type: 'success' | 'error') {
        const id = nextId++;
        toasts.value.push({ message, type, id });
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }

    function removeToast(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    return {
        toasts,
        showToast,
        removeToast,
    };
}