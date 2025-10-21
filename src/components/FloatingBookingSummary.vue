<template>
  <!-- Standalone peek indicator - only visible when the main component is hidden -->
  <div 
    v-if="shouldShowSummary && isHidden && !isExpanded"
    class="peek-indicator"
    @mouseenter="showSummary"
    @click="showSummary"
  >
    <!-- Cart Icon -->
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
      <circle cx="9" cy="21" r="1" fill="currentColor" />
      <circle cx="20" cy="21" r="1" fill="currentColor" />
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
      <!-- Enhanced expanded content design -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Booking Summary
        </h2>
        <div class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">
          {{ bookingData.length }} {{ bookingData.length === 1 ? 'Item' : 'Items' }}
        </div>
      </div>
      
      <div v-if="bookingData.length > 0">
        <div class="space-y-3 max-h-60 overflow-auto pr-1 mb-5 booking-items-container">
          <div 
            v-for="(booking, index) in bookingData" 
            :key="index" 
            class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center"
          >
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 dark:text-white truncate">{{ booking.space?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                <span class="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500 mr-2"></span>
                {{ formatProductType(booking.productType) }}
              </p>
            </div>
            <div class="text-right">
              <span class="font-medium text-green-600 dark:text-green-400">LKR {{ booking.totalPrice || 0 }}</span>
            </div>
          </div>
        </div>
        
        <!-- Price summary with improved design -->
        <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <div class="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>LKR {{ totalAmount }}</span>
          </div>
          <div class="flex items-center justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
            <span>Total</span>
            <span class="text-green-600 dark:text-green-400">LKR {{ totalAmount }}</span>
          </div>
        </div>
        
        <!-- Enhanced checkout button with animation -->
        <button @click.stop="goToCheckout" class="w-full checkout-btn mt-6">
          <span>Go to Checkout</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div v-else class="empty-booking-state">
        <div class="flex flex-col items-center justify-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-center">Your booking is empty.</p>
        </div>
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
              <h3 class="font-medium text-gray-900 dark:text-white">Your Booking</h3>
            </div>
            <span class="text-green-500 font-bold">LKR {{ totalAmount }}</span>
          </div>
        </div>
        
        <div class="mini-body" v-if="bookingData.length > 0">
          <div class="space-label text-gray-600 dark:text-gray-300">
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
          <div class="empty-state text-gray-600 dark:text-gray-400">No spaces booked yet</div>
        </div>
        
        <div class="mini-footer">
          <span class="view-text text-gray-700 dark:text-gray-300">
            <span v-if="isSearchPage" class="text-black">← Return to Summary</span>
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
    
    // Show the floating summary when:
    // 1. There are items in the booking
    // 2. We're either adding more services or the user isn't on the BookingSummary page
    // 3. The component is expanded
    const shouldShowSummary = computed(() => {
      const hasItems = bookingData.value.length > 0;
      const isAddingMore = bookingStore.isAddingMoreServices;
      const isOnBookingSummaryPage = route.name === 'BookingSummary';
      
      // ALWAYS check if there are booking items - never show if there are no items
      if (!hasItems) {
        return false;
      }
      
      // Don't show on BookingSummary page, unless explicitly adding more services
      if (isOnBookingSummaryPage && !isAddingMore) {
        return false;
      }
      
      // Always show when adding more services or when expanded
      return isAddingMore || isExpanded.value || !isOnBookingSummaryPage;
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
      }, 3500); // Hide after 3.5 seconds of inactivity for faster response
    }
    
    // Initialize the component's behavior on mount
    onMounted(() => {
      // Start hidden
      isHidden.value = true;
      
      // Check if there are booking items and if we're adding more services or not on BookingSummary
      const hasItems = bookingData.value.length > 0;
      const isAddingMore = bookingStore.isAddingMoreServices;
      const isOnBookingSummaryPage = route.name === 'BookingSummary';
      const shouldShow = hasItems && (isAddingMore || !isOnBookingSummaryPage);
      
      // If we should show, display the component and then minimize after a delay
      if (shouldShow) {
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
        // Keep hidden if we shouldn't show
        isHidden.value = true;
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
    watch(bookingData, (newBookingData) => {
      // Update hasBookingItems for tracking changes
      hasBookingItems.value = newBookingData.length > 0;
      
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
  bottom: 90px; /* Moved up to be above the WhatsApp button */
  right: 15px;
  left: 15px;
  z-index: 1000;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); /* Refined elastic animation */
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  will-change: transform, opacity, box-shadow; /* Performance optimization */
  transform-origin: bottom right;
  filter: drop-shadow(0 10px 15px rgba(74, 255, 53, 0.15));
}

/* Hidden state - improved animation with swoop effect */
.floating-summary.is-hidden {
  transform: translateX(calc(100% + 20px)) translateY(30px) scale(0.8) rotate(5deg);
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
}

.summary-tab {
  background-color: transparent;
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 90px; /* Moved up to be above the WhatsApp button */
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
  bottom: 90px; /* Moved up to be above the WhatsApp button */
  right: 30px;
}

.mini-booking-summary {
  width: 280px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform: translateY(0);
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Modern gradient accent on the right side */
.mini-booking-summary::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #4aff35, #34d9a5);
  border-radius: 0 16px 16px 0;
  transition: all 0.4s ease;
}

.dark .mini-booking-summary {
  background-color: rgba(31, 41, 55, 0.95);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25), 0 3px 10px rgba(0, 0, 0, 0.15);
  border-color: rgba(55, 65, 81, 0.6);
}

.mini-booking-summary:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(74, 255, 53, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Growing accent effect on hover */
.mini-booking-summary:hover::before {
  width: 5px;
  box-shadow: 0 0 15px 2px rgba(74, 255, 53, 0.5);
}

.dark .mini-booking-summary:hover {
  box-shadow: 0 15px 35px rgba(74, 255, 53, 0.2), 0 5px 15px rgba(0, 0, 0, 0.3);
}

.mini-header {
  background-color: white;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.7);
  position: relative;
  overflow: hidden;
}

.mini-header::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(to left, rgba(74, 255, 53, 0.07), transparent);
  transform: skewX(-15deg) translateX(10px);
  pointer-events: none;
}

.dark .mini-header {
  background-color: rgba(17, 24, 39, 0.95);
  border-bottom-color: rgba(55, 65, 81, 0.5);
}

.dark .mini-header::after {
  background: linear-gradient(to left, rgba(74, 255, 53, 0.05), transparent);
}

.mini-body {
  padding: 14px 16px;
  max-height: 120px;
  overflow-y: auto;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 255, 53, 0.3) transparent;
}

.mini-body::-webkit-scrollbar {
  width: 4px;
}

.mini-body::-webkit-scrollbar-thumb {
  background-color: rgba(74, 255, 53, 0.3);
  border-radius: 10px;
}

.mini-body::-webkit-scrollbar-track {
  background: transparent;
}

.mini-footer {
  background: linear-gradient(to right, rgba(249, 250, 251, 0.7), rgba(249, 250, 251, 0.9));
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid rgba(240, 240, 240, 0.5);
  position: relative;
  overflow: hidden;
}

.mini-footer::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, transparent, #4aff35, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mini-booking-summary:hover .mini-footer::before {
  opacity: 1;
}

.dark .mini-footer {
  background: linear-gradient(to right, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 1));
  border-top-color: rgba(55, 65, 81, 0.5);
}

.mini-item {
  margin-bottom: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  background-color: rgba(74, 255, 53, 0.05);
  border: 1px solid rgba(74, 255, 53, 0.08);
}

.mini-item:hover {
  background-color: rgba(74, 255, 53, 0.1);
  transform: translateX(3px);
}

.mini-dot {
  height: 8px;
  width: 8px;
  background: linear-gradient(135deg, #4aff35, #34d9a5);
  box-shadow: 0 0 5px rgba(74, 255, 53, 0.5);
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
  position: relative;
}

.mini-dot::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(74, 255, 53, 0.3);
  animation: pulse-dot 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

@keyframes pulse-dot {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.space-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 12px;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  position: relative;
}

.space-label::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(74, 255, 53, 0.3), transparent);
  margin-left: 8px;
}

.space-label.text-gray-600.dark\:text-gray-300 {
  color: #6b7280;
}

.dark .space-label.text-gray-600.dark\:text-gray-300 {
  color: #9ca3af;
}

.view-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color, #4f46e5);
}

.view-text.text-gray-700.dark\:text-gray-300 {
  color: var(--primary-color, #4f46e5);
}

.dark .view-text.text-gray-700.dark\:text-gray-300 {
  color: var(--primary-color, #00fe01);
}

.empty-state {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
}

.empty-state.text-gray-600.dark\:text-gray-400 {
  color: #6b7280;
}

.dark .empty-state.text-gray-600.dark\:text-gray-400 {
  color: #9ca3af;
}

.more-items {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 6px;
  font-style: italic;
}

.dark .more-items {
  color: #9ca3af;
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
  width: 380px;
  height: auto;
  max-height: 85vh;
  background-color: white;
  background-image: 
    radial-gradient(circle at top right, rgba(74, 255, 53, 0.08), transparent 250px),
    radial-gradient(circle at bottom left, rgba(52, 217, 165, 0.05), transparent 250px);
  border-radius: 20px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1), 
    0 30px 60px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(74, 255, 53, 0.05);
  bottom: 90px; /* Moved up to be above the WhatsApp button */
  right: 20px;
  cursor: default;
  z-index: 1100;
  animation: expand 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
}

.dark .floating-summary.is-expanded {
  background-color: rgba(17, 24, 39, 0.95);
  background-image: 
    radial-gradient(circle at top right, rgba(74, 255, 53, 0.05), transparent 250px),
    radial-gradient(circle at bottom left, rgba(52, 217, 165, 0.03), transparent 250px);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.25), 
    0 30px 60px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(74, 255, 53, 0.05);
  border: 1px solid rgba(55, 65, 81, 0.5);
}

.floating-summary.is-expanded::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(to right, #4aff35, #34d9a5);
  z-index: 2;
  border-radius: 20px 20px 0 0;
}

@keyframes expand {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
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
  padding: 24px;
  overflow-y: auto;
  max-height: calc(85vh - 48px);
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 255, 53, 0.3) transparent;
}

.summary-content::-webkit-scrollbar {
  width: 5px;
}

.summary-content::-webkit-scrollbar-thumb {
  background-color: rgba(74, 255, 53, 0.3);
  border-radius: 10px;
}

.summary-content::-webkit-scrollbar-track {
  background: transparent;
}

/* Peek indicator styling - modern floating button */
.peek-indicator {
  position: fixed;
  bottom: 90px; /* Moved up to be above the WhatsApp button */
  right: 20px;
  background: linear-gradient(135deg, #4aff35, #34d9a5);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 15px rgba(74, 255, 53, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: pulse-float 3s infinite;
  z-index: 1001;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.peek-indicator::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, rgba(74, 255, 53, 0.7), rgba(52, 217, 165, 0.7));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.peek-indicator:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(74, 255, 53, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2);
}

.peek-indicator:hover::before {
  opacity: 1;
  animation: rotate-border 2s linear infinite;
}

@keyframes rotate-border {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.peek-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  font-size: 11px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse-float {
  0% {
    transform: scale(1) translateY(0);
    box-shadow: 0 3px 15px rgba(74, 255, 53, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 8px 20px rgba(74, 255, 53, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: scale(1) translateY(0);
    box-shadow: 0 3px 15px rgba(74, 255, 53, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
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

/* Enhanced styling for the expanded view elements */
.booking-items-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 255, 53, 0.3) transparent;
}

.booking-items-container::-webkit-scrollbar {
  width: 4px;
}

.booking-items-container::-webkit-scrollbar-thumb {
  background-color: rgba(74, 255, 53, 0.3);
  border-radius: 10px;
}

.booking-items-container::-webkit-scrollbar-track {
  background: transparent;
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4aff35, #34d9a5);
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
  border-radius: 12px;
  border: none;
  outline: none;
  box-shadow: 0 4px 12px rgba(74, 255, 53, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 255, 53, 0.4);
}

.checkout-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(74, 255, 53, 0.4);
}

.checkout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.checkout-btn:hover::before {
  left: 100%;
}

.dark .checkout-btn {
  color: rgba(255, 255, 255, 0.95);
  background: linear-gradient(135deg, #00fe01, #00a370);
  box-shadow: 0 4px 12px rgba(0, 254, 1, 0.2);
}

.dark .checkout-btn:hover {
  box-shadow: 0 6px 16px rgba(0, 254, 1, 0.3);
}

.empty-booking-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
