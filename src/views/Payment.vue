<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto container-padding py-8">
      <!-- Progress indicator -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
            ✓
          </div>
          <div class="w-16 h-1 bg-green-500 mx-2"></div>
          <div class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
            2
          </div>
          <div class="w-16 h-1 bg-gray-300 mx-2"></div>
          <div class="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
            3
          </div>
        </div>
      </div>
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">Payment</h1>
        <p class="text-gray-600">Secure payment to complete your booking</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Payment Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Payment Method Selection -->
          <div class="bg-white rounded-xl p-6 shadow-card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            
            <div class="space-y-3 mb-6">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                <input v-model="paymentMethod" value="card" type="radio" class="sr-only">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span class="font-medium text-gray-900">Credit or Debit Card</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <div class="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">
                      VISA
                    </div>
                    <div class="w-8 h-6 bg-gradient-to-r from-red-600 to-red-700 rounded text-white flex items-center justify-center text-xs font-bold">
                      MC
                    </div>
                    <div class="w-8 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                      AX
                    </div>
                  </div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                <input v-model="paymentMethod" value="paypal" type="radio" class="sr-only">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <svg class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z" fill="#253B80"/>
                      <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z" fill="#179BD7"/>
                    </svg>
                    <span class="font-medium text-gray-900">PayPal</span>
                  </div>
                  <div class="text-sm text-gray-600">Pay with your PayPal account</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Credit Card Form -->
          <div v-if="paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
            
            <form @submit.prevent="processPayment" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                <div class="relative">
                  <input 
                    v-model="cardInfo.number" 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    @input="formatCardNumber"
                    class="input-field pr-12"
                    required
                  >
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div v-if="cardType" class="w-8 h-6 bg-gradient-to-r rounded text-white flex items-center justify-center text-xs font-bold" :class="cardTypeClass">
                      {{ cardType }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input 
                    v-model="cardInfo.expiry" 
                    type="text" 
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="formatExpiry"
                    class="input-field"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input 
                    v-model="cardInfo.cvv" 
                    type="text" 
                    placeholder="123"
                    maxlength="4"
                    class="input-field"
                    required
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                <input 
                  v-model="cardInfo.name" 
                  type="text" 
                  placeholder="Full name on card"
                  class="input-field"
                  required
                >
              </div>
            </form>
          </div>

          <!-- Billing Address -->
          <div v-if="paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Billing Address</h3>
              <label class="flex items-center">
                <input v-model="sameAsGuest" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary mr-2">
                <span class="text-sm text-gray-600">Same as guest information</span>
              </label>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select v-model="billingAddress.country" class="input-field" required>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input 
                    v-model="billingAddress.zipCode" 
                    type="text" 
                    placeholder="12345"
                    class="input-field"
                    required
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input 
                  v-model="billingAddress.address" 
                  type="text" 
                  placeholder="Street address"
                  class="input-field"
                  required
                >
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input 
                    v-model="billingAddress.city" 
                    type="text" 
                    placeholder="City"
                    class="input-field"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select v-model="billingAddress.state" class="input-field" required>
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-green-800">Your payment is secured with SSL encryption</p>
                <p class="text-xs text-green-700">We never store your payment information</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <!-- Booking details -->
            <div class="space-y-4 mb-6">
              <div class="flex space-x-3">
                <img 
                  v-if="bookingDetails.space && bookingDetails.space.image" 
                  :src="bookingDetails.space.image" 
                  :alt="bookingDetails.space.name || 'Space Image'" 
                  class="w-16 h-16 rounded-lg object-cover"
                >
                <img 
                  v-else 
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Default Space Image" 
                  class="w-16 h-16 rounded-lg object-cover"
                >
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate">{{ bookingDetails.space?.name || 'Unknown Space' }}</h3>
                  <p class="text-sm text-gray-600 truncate">{{ bookingDetails.space?.location || 'Unknown Location' }}</p>
                  <p class="text-sm text-gray-600">{{ formatBookingDate() }}</p>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600 mb-1">
                  Guest: {{ bookingDetails.guestInfo?.firstName || 'Demo' }} {{ bookingDetails.guestInfo?.lastName || 'User' }}
                </div>
                <div class="text-sm text-gray-600 mb-1">{{ formatProductType() }}</div>
                <div class="text-sm text-gray-600">{{ formatBookingDuration() }}</div>
              </div>
            </div>
            
            <!-- Price breakdown -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Base Price</span>
                <span class="font-semibold">${{ bookingDetails.pricing?.basePrice || 170 }}</span>
              </div>
              
              <div v-if="bookingDetails.pricing?.facilitiesPrice > 0" class="flex items-center justify-between">
                <span class="text-gray-600">Additional Facilities</span>
                <span class="font-semibold">${{ bookingDetails.pricing?.facilitiesPrice || 0 }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Service Fee</span>
                <span class="font-semibold">${{ bookingDetails.pricing?.serviceFee || 17 }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Taxes</span>
                <span class="font-semibold">${{ bookingDetails.pricing?.taxes || 15 }}</span>
              </div>
              
              <div v-if="bookingDetails.pricing?.discount > 0" class="flex items-center justify-between text-green-600">
                <span>Discount ({{ bookingDetails.promoCode || 'N/A' }})</span>
                <span class="font-semibold">-${{ bookingDetails.pricing?.discount || 0 }}</span>
              </div>
              
              <hr class="my-4">
              
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-primary">${{ bookingDetails.pricing?.total || 202 }}</span>
              </div>
            </div>

            <!-- Complete Booking Button -->
            <button 
              @click="processPayment"
              :disabled="processing || !isPaymentFormValid"
              class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="processing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Complete Booking - ${{ bookingDetails.pricing?.total || 202 }}</span>
            </button>

            <!-- Money back guarantee -->
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">
                <svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useBookingStore } from '../stores/booking'

interface CardInfo {
  number: string
  expiry: string
  cvv: string
  name: string
}

interface BillingAddress {
  country: string
  zipCode: string
  address: string
  city: string
  state: string
}

export default defineComponent({
  name: 'Payment',
  
  data() {
    return {
      // Payment state
      processing: false,
      paymentMethod: 'card',
      sameAsGuest: true,
      
      // Card information with demo data
      cardInfo: {
        number: '4242 4242 4242 4242',
        expiry: '12/25',
        cvv: '123',
        name: 'John Doe'
      } as CardInfo,
      
      // Billing address with demo data
      billingAddress: {
        country: 'US',
        zipCode: '94105',
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA'
      } as BillingAddress,
      
      // Booking details from Pinia store
      bookingDetails: {} as any
    }
  },
  
  computed: {
    cardType(): string | null {
      const number = this.cardInfo.number.replace(/\s/g, '')
      if (number.startsWith('4')) return 'VISA'
      if (number.startsWith('5') || number.startsWith('2')) return 'MC'
      if (number.startsWith('3')) return 'AX'
      return null
    },
    
    cardTypeClass(): string {
      switch (this.cardType) {
        case 'VISA':
          return 'from-blue-600 to-blue-700'
        case 'MC':
          return 'from-red-600 to-red-700'
        case 'AX':
          return 'from-blue-500 to-blue-600'
        default:
          return 'from-gray-400 to-gray-500'
      }
    },
    
    isPaymentFormValid(): boolean {
      if (this.paymentMethod === 'card') {
        return this.cardInfo.number.length >= 19 &&
               this.cardInfo.expiry.length === 5 &&
               this.cardInfo.cvv.length >= 3 &&
               this.cardInfo.name.trim() !== '' &&
               this.billingAddress.zipCode !== '' &&
               this.billingAddress.address !== '' &&
               this.billingAddress.city !== '' &&
               this.billingAddress.state !== ''
      }
      return true
    }
  },
  
  mounted() {
    const bookingStore = useBookingStore()
    
    // Initialize booking from store
    bookingStore.initializeBooking()
    
    // Define a fallback booking data
    const fallbackBookingDetails = {
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
      guestInfo: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@workspace.com',
        phone: '(555) 123-4567'
      },
      pricing: {
        basePrice: 170,
        facilitiesPrice: 0,
        serviceFee: 17,
        taxes: 15,
        discount: 0,
        total: 202
      },
      booking: {
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        duration: '2'
      }
    }

    // Get booking data from Pinia store
    if (bookingStore.currentBooking) {
      this.bookingDetails = bookingStore.currentBooking
      
      // Validate space data
      if (!this.bookingDetails.space || !this.bookingDetails.space.image || !this.bookingDetails.space.name || !this.bookingDetails.space.location) {
        console.warn('Invalid or missing space data, using fallback space')
        this.bookingDetails.space = { ...fallbackBookingDetails.space }
      }
      
      // Validate guestInfo data
      if (!this.bookingDetails.guestInfo || !this.bookingDetails.guestInfo.firstName || !this.bookingDetails.guestInfo.lastName) {
        console.warn('Invalid or missing guestInfo data, using fallback')
        this.bookingDetails.guestInfo = { ...fallbackBookingDetails.guestInfo }
      }
      
      // Validate pricing data
      if (!this.bookingDetails.pricing || !Number.isFinite(this.bookingDetails.pricing.basePrice) || !Number.isFinite(this.bookingDetails.pricing.total)) {
        console.warn('Invalid or missing pricing data, using fallback')
        this.bookingDetails.pricing = { ...fallbackBookingDetails.pricing }
      }
    } else {
      console.log('No booking data found, using fallback data')
      this.bookingDetails = { ...fallbackBookingDetails }
    }

    console.log('Final payment details:', this.bookingDetails)
  },
  
  methods: {
    formatCardNumber(event: any): void {
      let value = event.target.value.replace(/\s/g, '')
      let formattedValue = value.replace(/(.{4})/g, '$1 ').trim()
      this.cardInfo.number = formattedValue
    },
    
    formatExpiry(event: any): void {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      this.cardInfo.expiry = value
    },
    
    formatBookingDate(): string {
      const startDate = this.bookingDetails.booking?.startDate || this.bookingDetails.subscription?.startDate || this.bookingDetails.startDate
      const endDate = this.bookingDetails.booking?.endDate || this.bookingDetails.subscription?.endDate || this.bookingDetails.endDate
      
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        const formatOptions: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }
        
        return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
      }
      
      // Fallback to legacy date field
      const legacyDate = this.bookingDetails.booking?.date || this.bookingDetails.date
      if (legacyDate) {
        return new Date(legacyDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }
      
      return 'Date not specified'
    },
    
    formatProductType(): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[this.bookingDetails.productType] || 'Workspace'
    },
    
    formatBookingDuration(): string {
      if (this.bookingDetails.productType === 'meeting-room') {
        const duration = this.bookingDetails.booking?.duration || '2'
        return `${duration} hour${duration !== '1' ? 's' : ''}`
      } else {
        const packageType = this.bookingDetails.package || 'monthly'
        const names: Record<string, string> = {
          daily: 'Daily Access',
          monthly: 'Monthly Subscription',
          annual: 'Annual Subscription'
        }
        return names[packageType] || 'Subscription'
      }
    },
    
    async processPayment(): Promise<void> {
      console.log('Processing payment...', {
        paymentMethod: this.paymentMethod,
        bookingDetails: this.bookingDetails
      })

      const bookingStore = useBookingStore()

      // Allow payment processing even if form isn't completely valid for demo
      this.processing = true

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate booking ID
      const bookingId = 'WS' + Date.now().toString().slice(-8)

      // Store booking confirmation data
      const confirmationData = {
        ...this.bookingDetails,
        bookingId,
        paymentMethod: this.paymentMethod,
        cardInfo: this.paymentMethod === 'card' ? {
          number: this.cardInfo.number ? '****' + this.cardInfo.number.slice(-4) : '****4242',
          name: this.cardInfo.name || 'Demo User',
          expiry: this.cardInfo.expiry || '12/25'
        } : null,
        confirmedAt: new Date().toISOString(),
        // Ensure we have all required data
        guestInfo: this.bookingDetails.guestInfo || {
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@workspace.com',
          phone: '(555) 123-4567'
        }
      }

      console.log('Payment processed, storing confirmation:', confirmationData)
      
      // Store confirmation in sessionStorage for the confirmation page
      sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData))
      
      // Clear the current booking from Pinia store
      bookingStore.clearBookingDetails()

      // Navigate to confirmation
      this.$router.push({
        name: 'BookingConfirmation',
        params: { bookingId }
      })
    }
  }
})
</script>