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
          <!-- Space Information -->
          <div class="bg-white rounded-xl p-6 shadow-card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Space Details</h2>
            <div class="flex space-x-4">
  <img 
    v-if="bookingData.space && bookingData.space.image" 
    :src="bookingData.space.image" 
    :alt="bookingData.space.name || 'Space Image'" 
    class="w-24 h-24 rounded-lg object-cover"
  >
  <img 
    v-else 
    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
    alt="Default Space Image" 
    class="w-24 h-24 rounded-lg object-cover"
  >
  <div class="flex-1">
    <h3 class="text-lg font-semibold text-gray-900">{{ bookingData.space?.name || 'Unknown Space' }}</h3>
    <div class="flex items-center text-gray-600 mt-1">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
      {{ bookingData.space?.location || 'Unknown Location' }}
    </div>
    <!-- ... rest of the template remains unchanged -->
  </div>
</div>
            
            <!-- Booking Details -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid sm:grid-cols-2 gap-4">
                <div v-if="productType === 'meeting-room'">
                  <label class="text-sm font-medium text-gray-700">Date Range & Time</label>
                  <p class="text-gray-900 font-semibold">{{ formatDateRange() }}</p>
                  <p class="text-gray-600 text-sm">{{ bookingData.booking?.startTime }} - {{ getEndTime() }} ({{ bookingData.booking?.duration }}h)</p>
                </div>
                <div v-else>
                  <label class="text-sm font-medium text-gray-700">Subscription Period</label>
                  <p class="text-gray-900 font-semibold">{{ formatDateRange() }}</p>
                  <p class="text-gray-600 text-sm">{{ getPackageDisplayName() }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Product Type</label>
                  <p class="text-gray-900 font-semibold">{{ formatProductType(productType) }}</p>
                  <p v-if="productType === 'meeting-room'" class="text-gray-600 text-sm">Capacity: {{ bookingData.space?.capacity || 'N/A' }} people</p>
                  <p v-else-if="productType === 'coworking-space'" class="text-gray-600 text-sm">Team Size: {{ bookingData.teamSize || 'N/A' }}</p>
                  <p v-else class="text-gray-600 text-sm">Individual workspace</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Guest Information -->
          <div class="bg-white rounded-xl p-6 shadow-card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Guest Information</h2>
            <form @submit.prevent="proceedToPayment" class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    v-model="guestInfo.firstName" 
                    type="text" 
                    required
                    class="input-field"
                    placeholder="Enter your first name"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    v-model="guestInfo.lastName" 
                    type="text" 
                    required
                    class="input-field"
                    placeholder="Enter your last name"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  v-model="guestInfo.email" 
                  type="email" 
                  required
                  class="input-field"
                  placeholder="Enter your email address"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input 
                  v-model="guestInfo.phone" 
                  type="tel" 
                  required
                  class="input-field"
                  placeholder="Enter your phone number"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea 
                  v-model="guestInfo.specialRequests" 
                  rows="3"
                  class="input-field resize-none"
                  placeholder="Any special requirements or notes for your booking..."
                ></textarea>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input 
                      v-model="guestInfo.emergencyContactName" 
                      type="text" 
                      class="input-field"
                      placeholder="Emergency contact name"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input 
                      v-model="guestInfo.emergencyContactPhone" 
                      type="tel" 
                      class="input-field"
                      placeholder="Emergency contact phone"
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Price Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Price Summary</h2>
            
            <!-- Price breakdown -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ getServiceDisplayName() }}</span>
                <span class="font-semibold">${{ basePrice || 170 }}</span>
              </div>
              
              <div v-if="facilitiesPrice > 0" class="flex items-center justify-between">
                <span class="text-gray-600">Additional Facilities</span>
                <span class="font-semibold">${{ facilitiesPrice }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Service Fee</span>
                <span class="font-semibold">${{ serviceFee }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Taxes</span>
                <span class="font-semibold">${{ taxes }}</span>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import type { UserDto } from '../dto/response'

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
  
  data() {
    return {
      // Guest information form
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      } as GuestInfo,
      
      // Promo code
      promoCode: '',
      promoCodeApplied: false,
      promoCodeMessage: '',
      
      // Booking data from Pinia store
      bookingData: {} as any,
      productType: 'meeting-room',
      
      // Space types pricing
      spaceTypes: {
        'hot-desk': { name: 'Hot Desk', hourly: 8, daily: 25, weekly: 150 },
        'dedicated-desk': { name: 'Dedicated Desk', hourly: 12, daily: 35, weekly: 210 },
        'private-office': { name: 'Private Office', hourly: 25, daily: 75, weekly: 450 },
        'meeting-room': { name: 'Meeting Room', hourly: 30, daily: 120, weekly: 600 }
      }
    }
  },
  
  computed: {
    basePrice() {
      if (this.productType === 'meeting-room') {
        const hourlyRate = this.bookingData.space?.hourlyRate || 85
        const duration = parseInt(this.bookingData.booking?.duration || '2')
        return hourlyRate * duration
      } else {
        return this.bookingData.totalPrice || this.bookingData.pricing?.total || 0
      }
    },
    
    facilitiesPrice(): number {
      if (this.productType === 'meeting-room' && this.bookingData.facilities) {
        const prices: Record<string, number> = { tv: 25, printer: 15, catering: 50 }
        return this.bookingData.facilities.reduce((total: number, facility: string) => {
          return total + (prices[facility] || 0)
        }, 0)
      }
      return 0
    },
    
    serviceFee() {
      return Math.round((this.basePrice + this.facilitiesPrice) * 0.1)
    },
    
    taxes() {
      return Math.round((this.basePrice + this.facilitiesPrice + this.serviceFee) * 0.0875)
    },
    
    discount(): number {
      return this.promoCodeApplied ? Math.round(this.basePrice * 0.1) : 0
    },
    
    totalAmount() {
      return this.basePrice + this.facilitiesPrice + this.serviceFee + this.taxes - this.discount
    },
    
    isFormValid() {
      return this.guestInfo.firstName && 
             this.guestInfo.lastName && 
             this.guestInfo.email && 
             this.guestInfo.phone
    }
  },
  
  mounted() {
    const bookingStore = useBookingStore()
    const authStore = useAuthStore()
    
    // Initialize booking from store
    bookingStore.initializeBooking()
    
    // Define a fallback booking data
    const fallbackBookingData = {
      spaceId: 1,
      productType: 'meeting-room',
      space: {
        id: 1,
        name: 'Executive Boardroom',
        location: 'Downtown, San Francisco',
        rating: 4.9,
        reviews: 127,
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      booking: {
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        duration: '2'
      },
      facilities: [],
      totalPrice: 170,
      pricing: {
        basePrice: 170,
        facilitiesPrice: 0,
        total: 170
      }
    }

    // Get booking data from Pinia store
    if (bookingStore.currentBooking) {
      this.bookingData = bookingStore.currentBooking
      this.productType = this.bookingData.productType || 'meeting-room'
      
      // Validate space data
      if (!this.bookingData.space || !this.bookingData.space.image || !this.bookingData.space.name || !this.bookingData.space.location) {
        console.warn('Invalid or missing space data, using fallback')
        this.bookingData = { ...this.bookingData, space: { ...fallbackBookingData.space } }
      }
    } else {
      console.log('No booking data found, using fallback data')
      this.bookingData = { ...fallbackBookingData }
      this.productType = 'meeting-room'
    }

    // Auto-fill guest info from current user if logged in
    authStore.initializeAuth()
    const currentUser = authStore.currentUser
    if (currentUser) {
      this.guestInfo.firstName = currentUser.firstName || ''
      this.guestInfo.lastName = currentUser.lastName || ''
      this.guestInfo.email = currentUser.email || ''
      this.guestInfo.phone = currentUser.phone || ''
    } else {
      // Set demo data if no user is logged in
      this.guestInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        specialRequests: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      }
    }

    console.log('Final booking data:', this.bookingData)
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
    
    formatDateRange(): string {
      const startDate = this.bookingData.booking?.startDate || this.bookingData.subscription?.startDate || this.bookingData.startDate
      const endDate = this.bookingData.booking?.endDate || this.bookingData.subscription?.endDate || this.bookingData.endDate
      
      if (!startDate || !endDate) {
        // Fallback to legacy date field
        const legacyDate = this.bookingData.booking?.date || this.bookingData.date
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
    
    formatDuration(duration: string): string {
      switch (duration) {
        case 'hourly':
          return 'Hourly booking'
        case 'daily':
          return 'Full day access'
        case 'weekly':
          return 'Weekly access'
        default:
          return 'Full day access'
      }
    },
    
    formatProductType(type: string): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[type] || type
    },
    
    getServiceDisplayName() {
      if (this.productType === 'meeting-room') {
        const duration = this.bookingData.booking?.duration || '2'
        return `Meeting Room (${duration}h)`
      } else if (this.productType === 'hot-desk') {
        return this.getPackageDisplayName()
      } else {
        return this.getPackageDisplayName()
      }
    },
    
    getPackageDisplayName(): string {
      const packageType = this.bookingData.package || 'monthly'
      const names: Record<string, string> = {
        daily: 'Daily Pass',
        monthly: 'Monthly Subscription',
        annual: 'Annual Subscription'
      }
      return names[packageType] || 'Subscription'
    },
    
    getEndTime() {
      if (this.productType !== 'meeting-room') return ''
      const startTime = this.bookingData.booking?.startTime || '09:00'
      const duration = parseInt(this.bookingData.booking?.duration || '2')
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHour = hours + duration
      return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
    
    changeSelection() {
      this.$router.push({
        name: 'SpaceDetails',
        params: { id: this.bookingData.spaceId }
      })
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
      console.log('Proceeding to payment...', {
        isValid: this.isFormValid,
        guestInfo: this.guestInfo
      })

      const bookingStore = useBookingStore()

      // Provide default guest info if missing
      const finalGuestInfo = {
        firstName: this.guestInfo.firstName || 'Demo',
        lastName: this.guestInfo.lastName || 'User',
        email: this.guestInfo.email || 'demo@workspace.com',
        phone: this.guestInfo.phone || '(555) 123-4567',
        specialRequests: this.guestInfo.specialRequests,
        emergencyContactName: this.guestInfo.emergencyContactName,
        emergencyContactPhone: this.guestInfo.emergencyContactPhone
      }

      // Update booking details with guest info and pricing
      const updatedBookingDetails = {
        ...this.bookingData,
        guestInfo: finalGuestInfo,
        pricing: {
          basePrice: this.basePrice || 170,
          facilitiesPrice: this.facilitiesPrice || 0,
          serviceFee: this.serviceFee || 17,
          taxes: this.taxes || 15,
          discount: this.discount || 0,
          total: this.totalAmount || 202
        },
        promoCode: this.promoCodeApplied ? this.promoCode : null
      }

      console.log('Updating booking details for payment:', updatedBookingDetails)
      bookingStore.updateBookingDetails(updatedBookingDetails)

      this.$router.push({ name: 'Payment' })
    }
  }
})
</script>
