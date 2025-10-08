<template>
  <div id="app">
    <NetworkStatusBanner />
    <AppHeader />
    <router-view />
    <FloatingBookingSummary v-if="showFloatingBookingSummary" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FloatingBookingSummary from './components/FloatingBookingSummary.vue'
import NetworkStatusBanner from './components/NetworkStatusBanner.vue'
import { useBookingStore } from './stores/booking'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    FloatingBookingSummary,
    NetworkStatusBanner
  },
  computed: {
    bookingStore() {
      return useBookingStore();
    },
    themeStore() {
      return useThemeStore();
    },
    authStore() {
      return useAuthStore();
    },
    // Hide floating summary on payment, summary, confirmation, and IPG loading pages
    hiddenRoutes() {
      return [
        'Payment',
        'BookingSummary',
        'BookingConfirmation',
        'PaymentGateway',
      ];
    },
    showFloatingBookingSummary() {
      return (
        this.bookingStore.currentBooking.length > 0 &&
        this.bookingStore.isAddingMoreServices &&
        !this.hiddenRoutes.includes(this.$route.name as string)
      );
    }
  },
  mounted() {
    // Initialize theme first for consistent appearance
    this.themeStore.initTheme();
    
    // Initialize auth data from localStorage
    this.authStore.initializeAuth();
    
    // Then initialize booking data
    this.bookingStore.initializeBooking();
    // Ensure isAddingMoreServices is false on app load, as a safeguard
    this.bookingStore.setAddingMoreServices(false);
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
