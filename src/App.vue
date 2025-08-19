<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <BookingSummary v-if="bookingStore.isFloating" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BookingSummary from './views/BookingSummary.vue'
import { useBookingStore } from './stores/booking'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    BookingSummary
  },
  setup() {
    const bookingStore = useBookingStore();
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
