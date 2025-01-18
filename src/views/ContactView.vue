<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-900 to-primary-800 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Contact Us
        </h1>
        <p class="text-primary-100 text-lg max-w-2xl">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-4">Get in Touch</h2>
            <p class="text-neutral-600">
              Have a question about our products or services? Our team is here to help.
            </p>
          </div>

          <!-- Contact Details -->
          <div class="space-y-6">
            <!-- Location -->
            <div class="flex items-start space-x-4">
              <div class="bg-primary-100 p-3 rounded-lg">
                <MapPin class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Our Location</h3>
                <p class="text-neutral-600">123 Store Street, City, Country</p>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start space-x-4">
              <div class="bg-primary-100 p-3 rounded-lg">
                <Phone class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Phone</h3>
                <p class="text-neutral-600">+1 234 567 8900</p>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div class="bg-primary-100 p-3 rounded-lg">
                <Mail class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Email</h3>
                <p class="text-neutral-600">support@store.com</p>
              </div>
            </div>

            <!-- Hours -->
            <div class="flex items-start space-x-4">
              <div class="bg-primary-100 p-3 rounded-lg">
                <Clock class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Business Hours</h3>
                <p class="text-neutral-600">Monday - Friday: 9am - 5pm</p>
                <p class="text-neutral-600">Saturday: 10am - 2pm</p>
                <p class="text-neutral-600">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-sm p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-700">
                Full Name
              </label>
              <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  required
                  class="mt-1 py-2 border block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  :disabled="loading"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  required
                  class="mt-1 py-2 border block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  :disabled="loading"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-neutral-700">
                Subject
              </label>
              <input
                  v-model="form.subject"
                  type="text"
                  id="subject"
                  required
                  class="mt-1 py-2 border block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  :disabled="loading"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-neutral-700">
                Message
              </label>
              <textarea
                  v-model="form.message"
                  id="message"
                  rows="4"
                  required
                  class="mt-1 py-2 border block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  :disabled="loading"
              ></textarea>
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Send Message</span>
              <Loader2 v-else class="w-5 h-5 animate-spin" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';
import api from '../services/api';

const { showToast } = useToast();
const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

async function handleSubmit() {
  loading.value = true;
  try {
    // Replace with your actual API endpoint
    await api.post('/api/contact', form);

    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');

    // Reset form
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';

  } catch (error) {
    showToast('Failed to send message. Please try again later.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>