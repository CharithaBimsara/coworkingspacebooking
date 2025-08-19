<template>
  <div 
    :class="['floating-summary', { 'is-expanded': isExpanded }]"
    @click="toggleExpansion"
  >
    <div v-if="isExpanded" class="summary-content">
      <!-- Expanded content will be based on BookingSummary.vue -->
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
      <div v-if="bookingData.length > 0">
        <div v-for="(booking, index) in bookingData" :key="index" class="mb-4">
          <p class="font-semibold">{{ booking.space?.name }}</p>
          <p class="text-sm text-gray-600">{{ formatProductType(booking.productType) }}</p>
        </div>
        <div class="flex items-center justify-between font-bold text-lg mt-4 pt-4 border-t">
          <span>Total</span>
          <span>${{ totalAmount }}</span>
        </div>
        <button @click.stop="goToCheckout" class="w-full btn-primary mt-4">Go to Checkout</button>
      </div>
      <div v-else>
        <p>Your booking is empty.</p>
      </div>
    </div>
    <div v-else class="summary-tab">
      <button @click.stop="goToBookingSummary" class="btn-secondary py-2 px-4">Return to Booking Summary</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'FloatingBookingSummary',
  setup() {
    const bookingStore = useBookingStore()
    const router = useRouter()
    const isExpanded = ref(false)

    const bookingData = computed(() => bookingStore.currentBooking)
    const totalAmount = computed(() => bookingData.value.reduce((total, booking) => total + (booking.totalPrice || 0), 0))

    const toggleExpansion = () => {
      isExpanded.value = !isExpanded.value
    }

    const goToCheckout = () => {
      router.push({ name: 'BookingSummary' })
    }
    
    const formatProductType = (type: string): string => {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[type] || type
    }

    const goToBookingSummary = () => {
      router.push({ name: 'BookingSummary' })
    }

    return {
      isExpanded,
      bookingData,
      totalAmount,
      toggleExpansion,
      goToCheckout,
      formatProductType,
      goToBookingSummary
    }
  }
})
</script>

<style scoped>
.floating-summary {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.summary-tab {
  background-color: transparent;
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}



.floating-summary.is-expanded {
  width: 350px;
  height: auto;
  max-height: 80vh;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  bottom: 20px;
  right: 20px;
  cursor: default;
}

.summary-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 40px);
}
</style>
