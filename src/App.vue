<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <ToastContainer />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/NavBar.vue'
import ToastContainer from './components/ToastContainer.vue'

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});
</script>