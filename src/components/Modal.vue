<!-- src/components/Modal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Modal Panel -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full">
        <!-- Close button -->
        <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Modal content -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineEmits(['close']);
</script>