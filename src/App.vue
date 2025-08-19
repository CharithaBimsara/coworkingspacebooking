<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <FloatingBookingSummary v-if="bookingStore.currentBooking.length > 0 && bookingStore.isAddingMoreServices" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FloatingBookingSummary from './components/FloatingBookingSummary.vue'
import { useBookingStore } from './stores/booking'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    FloatingBookingSummary
  },
  setup() {
    const bookingStore = useBookingStore();

    onMounted(() => {
      bookingStore.initializeBooking();
      // Ensure isAddingMoreServices is false on app load, as a safeguard
      bookingStore.setAddingMoreServices(false);
    });

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
