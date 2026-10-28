<template>
  <div class="min-h-screen bg-gray-50">
    <DemoBanner v-if="DEMO_MODE" />
    <Navbar />
    <ToastContainer />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { DEMO_MODE } from './constants/demo'
import DemoBanner from './components/DemoBanner.vue'
import Navbar from './components/NavBar.vue'
import ToastContainer from './components/ToastContainer.vue'
import Footer from './components/Footer.vue'

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});
</script>