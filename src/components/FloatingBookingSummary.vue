<template>
  <!-- Standalone peek indicator - only visible when the main component is hidden -->
  <div 
    v-if="shouldShowSummary && isHidden && !isExpanded"
    class="peek-indicator"
    @mouseenter="showSummary"
    @click="showSummary"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    <div class="peek-badge">{{ bookingData.length }}</div>
  </div>

  <!-- Main floating summary component -->
  <div 
    v-if="shouldShowSummary && (!isHidden || isExpanded)"
    :class="['floating-summary', { 
      'is-expanded': isExpanded, 
      'is-search-page': isSearchPage, 
      'is-global-view': !isSearchPage,
      'is-hidden': isHidden && !isExpanded
    }]"
    @mouseenter="showSummary"
    @mouseleave="startHideTimer"
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
    <div v-else class="summary-tab" :class="{ 'centered-on-search': isSearchPage }">
      
      <div class="mini-booking-summary" @click.stop="goToBookingSummary">
        <div class="mini-header">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <h3 class="font-medium">Your Booking</h3>
            </div>
            <span class="text-green-500 font-bold">${{ totalAmount }}</span>
          </div>
        </div>
        
        <div class="mini-body" v-if="bookingData.length > 0">
          <div class="space-label">
            {{ bookingData.length }} {{ bookingData.length === 1 ? 'space' : 'spaces' }} booked
          </div>
          <div class="mini-item" v-for="(booking, index) in bookingDataPreview" :key="index">
            <div class="flex items-center">
              <span class="mini-dot"></span>
              <span class="truncate text-sm">{{ booking.space?.name || 'Space' }}</span>
            </div>
          </div>
          <div v-if="bookingData.length > 2" class="more-items">
            +{{ bookingData.length - 2 }} more
          </div>
        </div>
        <div class="mini-body" v-else>
          <div class="empty-state">No spaces booked yet</div>
        </div>
        
        <div class="mini-footer">
          <span class="view-text">
            <span v-if="isSearchPage">← Return to Summary</span>
            <span v-else>View Booking Summary</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FloatingBookingSummary',
  setup() {
    const bookingStore = useBookingStore()
    const router = useRouter()
    const route = useRoute()
    const isExpanded = ref(false)
    const isHidden = ref(true) // Start hidden
    const isHovering = ref(false) // Track mouse hovering
    const inactivityTimeout = ref<number | null>(null) // For tracking inactivity
    const isSearchPage = computed(() => route.name === 'SearchResults')
    const hasBookingItems = ref(false)
    
    // Check local storage for "addAnotherService" flag
    const checkAddAnotherServiceFlag = () => {
      return localStorage.getItem('addAnotherServiceClicked') === 'true'
    }

    const bookingData = computed(() => bookingStore.currentBooking)
    const totalAmount = computed(() => bookingData.value.reduce((total, booking) => total + (booking.totalPrice || 0), 0))
    
    // No longer needed with our updated logic, but keeping for potential future use
    // Now we only exclude the BookingSummary page itself
    const isPostBookingSummaryPage = computed(() => {
      return route.name === 'BookingSummary';
    });

    // Show the floating summary if:
    // 1. We have items in the booking AND
    // 2. The user clicked "Add another service" button AND
    // 3. We're not on the BookingSummary page itself
    const shouldShowSummary = computed(() => {
      const hasItems = bookingData.value.length > 0;
      const addAnotherClicked = checkAddAnotherServiceFlag();
      const isOnBookingSummaryPage = route.name === 'BookingSummary';
      
      // Update hasBookingItems for tracking changes
      hasBookingItems.value = hasItems;
      
      // ALWAYS check if there are booking items - never show if there are no items
      if (!hasItems) {
        return false;
      }
      
      // Show on all pages when conditions are met, except BookingSummary page
      if (addAnotherClicked && !isOnBookingSummaryPage) {
        return true;
      }
      
      // Always show when expanded regardless of page
      return isExpanded.value;
    })
    
    // Preview data - limited to first 2 bookings for the mini view
    const bookingDataPreview = computed(() => bookingData.value.slice(0, 2))

    const toggleExpansion = () => {
      isExpanded.value = !isExpanded.value
      
      if (isExpanded.value) {
        // When expanded, always show fully and cancel any hide timer
        isHidden.value = false
        if (inactivityTimeout.value) {
          clearTimeout(inactivityTimeout.value)
          inactivityTimeout.value = null
        }
        
        // Add click outside listener
        setTimeout(() => {
          document.addEventListener('click', handleClickOutside)
        }, 10)
      } else {
        // Remove click outside listener when collapsed
        document.removeEventListener('click', handleClickOutside)
        
        // Start hide timer when collapsed
        startHideTimer()
      }
    }
    
    // Handle clicks outside the component
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click was outside the floating summary
      if (!target.closest('.floating-summary')) {
        isExpanded.value = false
        document.removeEventListener('click', handleClickOutside)
        startHideTimer()
      }
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
    
    // Methods to handle showing and hiding based on user interaction
    const showSummary = () => {
      isHovering.value = true;
      isHidden.value = false;
      
      // Clear any existing timeout
      if (inactivityTimeout.value) {
        clearTimeout(inactivityTimeout.value);
        inactivityTimeout.value = null;
      }
      
      // Reset the timer to hide after a longer period when explicitly shown
      inactivityTimeout.value = window.setTimeout(() => {
        if (!isHovering.value && !isExpanded.value) {
          isHidden.value = true;
        }
      }, 5000); // Hide after 5 seconds of inactivity when explicitly shown
    }
    
    const startHideTimer = () => {
      isHovering.value = false;
      
      // Set a timeout to hide after inactivity
      if (inactivityTimeout.value) {
        clearTimeout(inactivityTimeout.value);
      }
      
      // Shorter timeout to hide quickly when mouse leaves
      inactivityTimeout.value = window.setTimeout(() => {
        if (!isHovering.value && !isExpanded.value) {
          isHidden.value = true;
        }
      }, 1500); // Hide after 1.5 seconds of inactivity for faster response
    }
    
    // Initialize the component's behavior on mount
    onMounted(() => {
      // Start hidden
      isHidden.value = true;
      
      // Check if "Add Another Service" was clicked
      const addAnotherServiceClicked = checkAddAnotherServiceFlag();
      
      // If "Add Another Service" was clicked, show for longer then minimize to peek indicator
      if (addAnotherServiceClicked) {
        setTimeout(() => {
          isHidden.value = false;
          // Hide after 3 seconds of initial display if user isn't interacting
          setTimeout(() => {
            if (!isHovering.value) {
              isHidden.value = true;
            }
          }, 3000);
        }, 1000);
      } else {
        // Standard behavior if not coming from "Add Another Service"
        setTimeout(() => {
          isHidden.value = false;
          setTimeout(() => {
            if (!isHovering.value) {
              isHidden.value = true;
            }
          }, 2000);
        }, 1500);
      }
    });
    
    // Clean up event listeners when component is unmounted
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      if (inactivityTimeout.value) {
        clearTimeout(inactivityTimeout.value);
      }
    });
    
    // Watch bookingData for changes and hide summary if there are no items
    watch(bookingData, (newBookingData: any[]) => {
      if (newBookingData.length === 0) {
        // Clear the add another service flag when all items are removed
        localStorage.removeItem('addAnotherServiceClicked');
      }
    });
    
    // Watch route changes to handle showing/hiding when navigating between pages
    watch(() => route.name, (newRouteName) => {
      const addAnotherServiceClicked = checkAddAnotherServiceFlag();
      const hasItems = bookingData.value.length > 0;
      
      // If we navigated to BookingSummary, hide the component
      if (newRouteName === 'BookingSummary') {
        isHidden.value = true;
        return;
      }
      
      // If we navigated to any other page and "Add Another Service" was clicked and we have items,
      // briefly show the component then hide it
      if (addAnotherServiceClicked && hasItems && newRouteName !== 'BookingSummary') {
        isHidden.value = false;
        // Hide after a brief moment if user isn't interacting
        setTimeout(() => {
          if (!isHovering.value) {
            isHidden.value = true;
          }
        }, 2500);
      }
    });

    return {
      isExpanded,
      isSearchPage,
      hasBookingItems,
      bookingData,
      bookingDataPreview,
      totalAmount,
      isHidden,
      isHovering,
      toggleExpansion,
      goToCheckout,
      formatProductType,
      goToBookingSummary,
      shouldShowSummary,
      showSummary,
      startHideTimer
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
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); /* Smoother animation */
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  will-change: transform, opacity; /* Performance optimization */
}

/* Hidden state - slides completely to the right edge */
.floating-summary.is-hidden {
  transform: translateX(100%); /* Completely hide off-screen */
  visibility: hidden; /* Hide completely */
  opacity: 0;
  pointer-events: none; /* Don't capture mouse events when hidden */
}

.summary-tab {
  background-color: transparent;
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 30px; /* Position from the bottom */
  right: 30px; /* Position from the right */
  top: auto;
  left: auto;
  transform: none;
}

.summary-tab.centered-on-search {
  animation: float 2s ease-in-out infinite;
}

.floating-summary:not(.is-expanded) {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.mini-booking-summary {
  width: 250px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateY(0);
  cursor: pointer;
  border-right: 3px solid #4aff35; /* Green accent like in image */
}

.mini-booking-summary:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.mini-header {
  background-color: white;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.mini-body {
  padding: 12px;
  max-height: 100px;
  overflow-y: auto;
}

.mini-footer {
  background-color: #f9fafb;
  padding: 10px 12px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.mini-item {
  margin-bottom: 6px;
  padding: 4px 0;
}

.mini-dot {
  height: 8px;
  width: 8px;
  background-color: var(--primary-color, #4f46e5);
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.space-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.view-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color, #4f46e5);
}

.empty-state {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
}

.more-items {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 6px;
  font-style: italic;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(79, 70, 229, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}

/* Add an attention-grabbing animation for search page */
.centered-on-search .mini-booking-summary {
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.2);
  border: 2px solid rgba(79, 70, 229, 0.3);
}

/* Style for global view (non-search pages) */
.is-global-view .mini-booking-summary {
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
  border: 1px solid rgba(79, 70, 229, 0.2);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.2);
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(79, 70, 229, 0.1);
  }
  100% {
    transform: translateY(0px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.2);
  }
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
  z-index: 1100;
  animation: expand 0.3s ease-out;
}

@keyframes expand {
  from {
    opacity: 0.8;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: translateY(-7px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: translateY(0px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.summary-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 40px);
}

/* Peek indicator styling */
.peek-indicator {
  position: fixed;
  bottom: 30px;
  right: 20px;
  background-color: #4aff35; /* Green color from image */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px 5px rgba(74, 255, 53, 0.3); /* Green glow */
  animation: glow 2s infinite alternate;
  z-index: 1001;
  cursor: pointer;
}

.peek-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 6px 2px rgba(74, 255, 53, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px 4px rgba(74, 255, 53, 0.7);
    transform: scale(1.03);
  }
  100% {
    box-shadow: 0 0 6px 2px rgba(74, 255, 53, 0.5);
    transform: scale(1);
  }
}
</style>
