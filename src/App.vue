<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <FloatingBookingSummary v-if="showFloatingBookingSummary" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FloatingBookingSummary from './components/FloatingBookingSummary.vue'
import { useBookingStore } from './stores/booking'
import { useThemeStore } from './stores/theme'
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
    const route = useRoute();
    
    // Flag to track if user is on the booking summary page
    const isOnBookingSummaryPage = computed(() => route.name === 'BookingSummary');
    
    // Flag to control the display of the floating summary
    const showFloatingBookingSummary = computed(() => {
      // Show if there are items in the booking AND either:
      // 1. User explicitly clicked "Add another service" (isAddingMoreServices) OR
      // 2. User is NOT on the booking summary page
      return bookingStore.currentBooking.length > 0 && 
        (bookingStore.isAddingMoreServices || !isOnBookingSummaryPage.value);
    });

    onMounted(() => {
      // Initialize theme first for consistent appearance
      themeStore.initTheme();
      
      // Then initialize booking data
      bookingStore.initializeBooking();
      // Ensure isAddingMoreServices is false on app load, as a safeguard
      bookingStore.setAddingMoreServices(false);
    });

    return {
      bookingStore,
      showFloatingBookingSummary
    };

    return {
      bookingStore
    }
  }
})
</script>

<style scoped>
#app {

  min-height: 100vh;
}
</style>
