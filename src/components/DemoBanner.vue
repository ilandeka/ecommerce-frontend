<template>
  <div class="bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm">
    <div class="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
      <FlaskConical class="w-4 h-4 shrink-0" />
      <span class="font-semibold">Demo store in test mode.</span>
      <span>
        No real payments: pay with card <span class="font-mono">{{ TEST_CARD.number }}</span>
        ({{ TEST_CARD.details }}). The data is reset every night.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FlaskConical } from 'lucide-vue-next';
import { TEST_CARD } from '../constants/demo';
</script>
