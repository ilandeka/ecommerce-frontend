<template>
  <div class="fixed top-4 right-4 z-50">
    <TransitionGroup name="toast">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'mb-2 p-4 rounded-md shadow-lg flex items-center',
            getToastClasses(toast.type),
            'text-white',
          ]"
      >
        <!-- Add icons for different toast types -->
        <span class="mr-2">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
          <Info v-else-if="toast.type === 'info'" class="w-5 h-5" />
        </span>
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast';
import { CheckCircle, XCircle, Info } from 'lucide-vue-next';

const { toasts } = useToast();

// Helper function to determine toast classes based on type
function getToastClasses(type: 'success' | 'error' | 'info'): string {
  switch (type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  position: absolute;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>