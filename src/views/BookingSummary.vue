<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto container-padding py-8">
      <!-- Progress indicator -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
            1
          </div>
          <div class="w-16 h-1 bg-primary mx-2"></div>
          <div class="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
            2
          </div>
          <div class="w-16 h-1 bg-gray-300 mx-2"></div>
          <div class="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
            3
          </div>
        </div>
      </div>
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">Booking Summary</h1>
        <p class="text-gray-600">Review your booking details before proceeding to payment</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Booking Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Loop through each booking -->
          <div v-for="(booking, index) in bookingData" :key="index" class="bg-white rounded-xl p-6 shadow-card">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Space Details</h2>
              <button @click="removeBookingItem(booking.spaceId)" class="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
            <div class="flex space-x-4">
              <img 
                v-if="booking.space && booking.space.images && booking.space.images.length > 0" 
                :src="booking.space.images[0]" 
                :alt="booking.space.name || 'Space Image'" 
                class="w-24 h-24 rounded-lg object-cover"
              >
              <img 
                v-else 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Default Space Image" 
                class="w-24 h-24 rounded-lg object-cover"
              >
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ booking.space?.name || 'Unknown Space' }}</h3>
                <div class="flex items-center text-gray-600 mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ booking.space?.location || 'Unknown Location' }}
                </div>
              </div>
            </div>
            
            <!-- Booking Details -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid sm:grid-cols-2 gap-4">
                <div v-if="booking.productType === 'meeting-room'">
                  <label class="text-sm font-medium text-gray-700">Date Range & Time</label>
                  <p class="text-gray-900 font-semibold">{{ formatDateRange(booking) }}</p>
                  <p class="text-gray-600 text-sm">{{ booking.booking?.startTime }} - {{ getEndTime(booking) }} ({{ booking.booking?.duration }}h)</p>
                </div>
                <div v-else>
                  <label class="text-sm font-medium text-gray-700">Subscription Period</label>
                  <p class="text-gray-900 font-semibold">{{ formatDateRange(booking) }}</p>
                  <p class="text-gray-600 text-sm">{{ getPackageDisplayName(booking) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Product Type</label>
                  <p class="text-gray-900 font-semibold">{{ formatProductType(booking.productType) }}</p>
                  <p v-if="booking.productType === 'meeting-room'" class="text-gray-600 text-sm">Capacity: {{ booking.space?.capacity || 'N/A' }} people</p>
                  <p v-else-if="booking.productType === 'coworking-space'" class="text-gray-600 text-sm">Team Size: {{ booking.subscription?.teamSize || 'N/A' }}</p>
                  <p v-else class="text-gray-600 text-sm">Individual workspace</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add another service -->
          <div class="text-center">
            <button @click="addAnotherService" class="btn-secondary">+ Add Another Service</button>
          </div>

          <!-- Guest Information -->
          <div class="bg-white rounded-xl p-6 shadow-card">
            <div v-if="!isAuthenticated">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
              <div v-if="!guestCheckout">
                <p class="text-gray-600 mb-4">You can log in, register, or continue as a guest to complete your booking.</p>
                <div class="flex space-x-4">
                  <button @click="openAuthModal('login')" class="btn-primary">Login</button>
                  <button @click="openAuthModal('register')" class="btn-secondary">Register</button>
                  <button v-if="allowGuestCheckout" @click="guestCheckout = true" class="btn-secondary">Continue as Guest</button>
                </div>
                <p v-if="!allowGuestCheckout" class="text-sm text-gray-500 mt-4">Guest checkout is only available for meeting room bookings.</p>
              </div>
              <div v-if="guestCheckout">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Guest Details</h3>
                <form @submit.prevent="proceedToPayment" class="space-y-4">
                  <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input v-model="guestInfo.firstName" type="text" required class="input-field" placeholder="Enter your first name">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input v-model="guestInfo.lastName" type="text" required class="input-field" placeholder="Enter your last name">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input v-model="guestInfo.email" type="email" required class="input-field" placeholder="Enter your email address">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input v-model="guestInfo.phone" type="tel" required class="input-field" placeholder="Enter your phone number">
                  </div>
                </form>
              </div>
            </div>
            <div v-if="isAuthenticated">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
              <p class="text-gray-600" v-if="currentUser">You are logged in as {{ currentUser.email }}. We will use the information from your profile.</p>
            </div>
          </div>
        </div>

        <!-- Price Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Price Summary</h2>
            
            <!-- Price breakdown -->
            <div class="space-y-3 mb-6">
              <div v-for="(booking, index) in bookingData" :key="index" class="flex items-center justify-between">
                <span class="text-gray-600">{{ getServiceDisplayName(booking) }}</span>
                <span class="font-semibold">${{ booking.totalPrice || 0 }}</span>
              </div>
              
              <hr class="my-4">
              
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-primary">${{ totalAmount }}</span>
              </div>
            </div>

            <!-- Promo code -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input 
                  v-model="promoCode" 
                  type="text" 
                  placeholder="Promo code"
                  class="input-field text-sm"
                >
                <button 
                  @click="applyPromoCode"
                  class="btn-primary text-sm px-4 py-2"
                >
                  Apply
                </button>
              </div>
              <div v-if="promoCodeMessage" :class="['mt-2 text-sm', promoCodeApplied ? 'text-green-600' : 'text-red-600']">
                {{ promoCodeMessage }}
              </div>
            </div>

            <!-- Payment methods preview -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Payment Methods</h3>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div class="w-8 h-6 bg-gradient-to-r from-red-600 to-red-700 rounded text-white flex items-center justify-center text-xs font-bold">
                  MC
                </div>
                <div class="w-8 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                  AX
                </div>
                <svg class="w-8 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z" fill="#253B80"/>
                  <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z" fill="#179BD7"/>
                  <path d="M9.928 16.762h-2.15a1.321 1.321 0 0 0-1.321 1.132l-1.207 7.007c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637l2.725-19.785c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637.374.177.708.384 1.011.622.26.204.492.43.698.677.513.617.848 1.334.952 2.08a3.579 3.579 0 0 1-.288 2.019c-.742 1.92-2.104 3.145-4.113 3.729a8.875 8.875 0 0 1-2.659.408z" fill="#222D65"/>
                </svg>
              </div>
            </div>

            <!-- Proceed to Payment Button -->
            <button 
              @click="proceedToPayment"
              :disabled="!isFormValid"
              class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>

            <!-- Cancellation policy -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">Cancellation Policy</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Free cancellation up to 24 hours before check-in</li>
                <li>• 50% refund for cancellations within 24 hours</li>
                <li>• No refund for no-shows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AuthModals 
      :show-sign-in="showSignInModal" 
      :show-sign-up="showSignUpModal"
      @close="closeAuthModals"
      @user-authenticated="handleUserAuthenticated"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import type { UserDto } from '../dto/response'
import AuthModals from '../components/AuthModals.vue'

interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export default defineComponent({
  name: 'BookingSummary',
  
  components: {
    AuthModals
  },

  data() {
    return {
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      } as GuestInfo,
      promoCode: '',
      promoCodeApplied: false,
      promoCodeMessage: '',
      guestCheckout: false,
      showSignInModal: false,
      showSignUpModal: false,
    }
  },
  
  computed: {
    authStore() {
      return useAuthStore()
    },
    bookingStore() {
      return useBookingStore()
    },
    bookingData() {
      return this.bookingStore.currentBooking
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    currentUser() {
      return this.authStore.currentUser
    },
    allowGuestCheckout() {
      return this.bookingData.every(item => item.productType === 'meeting-room')
    },
    totalAmount() {
      return this.bookingData.reduce((total, booking) => total + (booking.totalPrice || 0), 0)
    },
    isFormValid() {
      if (this.isAuthenticated) {
        return true
      }
      if (this.guestCheckout) {
        return this.guestInfo.firstName && 
               this.guestInfo.lastName && 
               this.guestInfo.email && 
               this.guestInfo.phone
      }
      return false
    }
  },
  
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth && this.currentUser) {
        this.guestInfo.firstName = this.currentUser.firstName || ''
        this.guestInfo.lastName = this.currentUser.lastName || ''
        this.guestInfo.email = this.currentUser.email || ''
        this.guestInfo.phone = this.currentUser.phone || ''
      }
    }
  },

  mounted() {
    this.bookingStore.initializeBooking()
    this.authStore.initializeAuth()

    if (this.isAuthenticated && this.currentUser) {
      this.guestInfo.firstName = this.currentUser.firstName || ''
      this.guestInfo.lastName = this.currentUser.lastName || ''
      this.guestInfo.email = this.currentUser.email || ''
      this.guestInfo.phone = this.currentUser.phone || ''
    }
  },
  
  methods: {
    formatDate(dateString: string): string {
      if (!dateString) return 'Not specified'
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatDateRange(booking: any): string {
      const startDate = booking.booking?.startDate || booking.subscription?.startDate || booking.startDate
      const endDate = booking.booking?.endDate || booking.subscription?.endDate || booking.endDate
      
      if (!startDate || !endDate) {
        const legacyDate = booking.booking?.date || booking.date
        return legacyDate ? this.formatDate(legacyDate) : 'Date not specified'
      }
      
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric'
      }
      
      if (start.getFullYear() !== end.getFullYear()) {
        formatOptions.year = 'numeric'
      }
      
      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
    },
    
    formatProductType(type: string): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[type] || type
    },
    
    getServiceDisplayName(booking: any) {
      if (booking.productType === 'meeting-room') {
        const duration = booking.booking?.duration || '2'
        return `Meeting Room (${duration}h)`
      } else if (booking.productType === 'hot-desk') {
        return this.getPackageDisplayName(booking)
      } else {
        return this.getPackageDisplayName(booking)
      }
    },
    
    getPackageDisplayName(booking: any): string {
      const packageType = booking.subscription?.packageType || 'monthly'
      const names: Record<string, string> = {
        daily: 'Daily Pass',
        monthly: 'Monthly Subscription',
        annual: 'Annual Subscription'
      }
      return names[packageType] || 'Subscription'
    },
    
    getEndTime(booking: any) {
      if (booking.productType !== 'meeting-room') return ''
      const startTime = booking.booking?.startTime || '09:00'
      const duration = parseInt(booking.booking?.duration || '2')
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHour = hours + duration
      return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
    
    addAnotherService() {
      this.$router.push({ name: 'SearchResults' });
    },

    removeBookingItem(spaceId: number) {
      this.bookingStore.removeBookingItem(spaceId);
    },
    
    openAuthModal(type: 'login' | 'register') {
      if (type === 'login') {
        this.showSignInModal = true;
      } else {
        this.showSignUpModal = true;
      }
    },

    closeAuthModals() {
      this.showSignInModal = false;
      this.showSignUpModal = false;
    },

    handleUserAuthenticated() {
      this.closeAuthModals();
    },

    applyPromoCode() {
      if (this.promoCode.toLowerCase() === 'welcome10') {
        this.promoCodeApplied = true
        this.promoCodeMessage = 'Promo code applied! 10% discount'
      } else {
        this.promoCodeApplied = false
        this.promoCodeMessage = 'Invalid promo code'
      }
    },
    
    proceedToPayment(): void {
      if (!this.isFormValid) {
        return;
      }

      const finalGuestInfo = this.isAuthenticated && this.currentUser ? {
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || ''
      } : this.guestInfo;

      const updatedBookings = this.bookingData.map(booking => ({
        ...booking,
        guestInfo: finalGuestInfo,
        promoCode: this.promoCodeApplied ? this.promoCode : null
      }));

      this.bookingStore.updateBookingDetails(updatedBookings);
      this.$router.push({ name: 'Payment' });
    }
  }
})
</script>