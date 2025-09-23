<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <FloatingBookingSummary v-if="showFloatingBookingSummary" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FloatingBookingSummary from './components/FloatingBookingSummary.vue'
import { useBookingStore } from './stores/booking'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    FloatingBookingSummary
  },
  setup() {
    const bookingStore = useBookingStore();
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const route = useRoute();
    

    // Hide floating summary on payment, summary, confirmation, and IPG loading pages
    const hiddenRoutes = [
      'Payment',
      'BookingSummary',
      'BookingConfirmation',
      'PaymentGateway',
    ];
    const showFloatingBookingSummary = computed(() => {
      return (
        bookingStore.currentBooking.length > 0 &&
        bookingStore.isAddingMoreServices &&
        !hiddenRoutes.includes(route.name as string)
      );
    });

    onMounted(() => {
      // Initialize theme first for consistent appearance
      themeStore.initTheme();
      
      // Initialize auth data from localStorage
      authStore.initializeAuth();
      
      // Then initialize booking data
      bookingStore.initializeBooking();
      // Ensure isAddingMoreServices is false on app load, as a safeguard
      bookingStore.setAddingMoreServices(false);
    });

    return {
      showFloatingBookingSummary
    };
  }
})
</script>

<style scoped>
#app {

  min-height: 100vh;
}

#appheader {
  display: block;
}
body[iframe-mode] #appheader {
  display: none;
}
</style>
