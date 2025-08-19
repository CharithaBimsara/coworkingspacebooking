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
            <div v-if="bookingDetails.length > 0" class="space-y-4 mb-6">
              <div v-for="(booking, index) in bookingDetails" :key="index" class="flex space-x-3">
                <img 
                  v-if="booking.space && booking.space.image" 
                  :src="booking.space.image" 
                  :alt="booking.space.name || 'Space Image'" 
                  class="w-16 h-16 rounded-lg object-cover"
                >
                <img 
                  v-else 
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Default Space Image" 
                  class="w-16 h-16 rounded-lg object-cover"
                >
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate">{{ booking.space?.name || 'Unknown Space' }}</h3>
                  <p class="text-sm text-gray-600 truncate">{{ booking.space?.location || 'Unknown Location' }}</p>
                  <p class="text-sm text-gray-600">{{ formatBookingDate(booking) }}</p>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600 mb-1">
                  Guest: {{ primaryGuestName }}
                </div>
              </div>
            </div>
            
            <!-- Price breakdown -->
            <div class="space-y-3 mb-6">
              <div v-for="(booking, index) in bookingDetails" :key="index" class="flex items-center justify-between">
                <span class="text-gray-600">{{ booking.space.name }}</span>
                <span class="font-semibold">${{ booking.totalPrice || 0 }}</span>
              </div>
              
              <hr class="my-4">
              
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-primary">${{ totalAmount }}</span>
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
              <span v-else>Complete Booking - ${{ totalAmount }}</span>
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
import { defineComponent } from 'vue';
import { useBookingStore } from '../stores/booking';
import type { Booking } from '../stores/booking';

interface CardInfo {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface BillingAddress {
  country: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
}

export default defineComponent({
  name: 'PaymentPage',
  
  data() {
    return {
      processing: false,
      paymentMethod: 'card',
      sameAsGuest: true,
      cardInfo: {
        number: '4242 4242 4242 4242',
        expiry: '12/25',
        cvv: '123',
        name: 'John Doe'
      } as CardInfo,
      billingAddress: {
        country: 'US',
        zipCode: '94105',
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA'
      } as BillingAddress,
    };
  },
  
  computed: {
    bookingStore() {
      return useBookingStore();
    },
    bookingDetails(): Booking[] {
      return this.bookingStore.currentBooking;
    },
    totalAmount(): number {
      return this.bookingDetails.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
    },
    primaryGuestName(): string {
      const guestInfo = this.bookingDetails[0]?.guestInfo;
      return guestInfo ? `${guestInfo.firstName} ${guestInfo.lastName}` : 'Demo User';
    },
    cardType(): string | null {
      const number = this.cardInfo.number.replace(/\s/g, '');
      if (number.startsWith('4')) return 'VISA';
      if (/^5[1-5]/.test(number)) return 'MC';
      if (/^3[47]/.test(number)) return 'AX';
      return null;
    },
    cardTypeClass(): string {
      switch (this.cardType) {
        case 'VISA': return 'from-blue-600 to-blue-700';
        case 'MC': return 'from-red-600 to-red-700';
        case 'AX': return 'from-blue-500 to-blue-600';
        default: return 'from-gray-400 to-gray-500';
      }
    },
    isPaymentFormValid(): boolean {
      if (this.paymentMethod === 'card') {
        return this.cardInfo.number.length >= 19 &&
               this.cardInfo.expiry.length === 5 &&
               this.cardInfo.cvv.length >= 3 &&
               this.cardInfo.name.trim() !== '' &&
               this.billingAddress.zipCode.trim() !== '' &&
               this.billingAddress.address.trim() !== '' &&
               this.billingAddress.city.trim() !== '' &&
               this.billingAddress.state.trim() !== '';
      }
      return true;
    }
  },
  
  mounted() {
    this.bookingStore.initializeBooking();
  },
  
  methods: {
    formatCardNumber(event: Event): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 16) {
        value = value.slice(0, 16);
      }
      const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
      this.cardInfo.number = formattedValue;
    },
    
    formatExpiry(event: Event): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      this.cardInfo.expiry = value;
    },
    
    formatBookingDate(booking: Booking): string {
      const startDate = booking.booking?.startDate || booking.subscription?.startDate || booking.startDate;
      const endDate = booking.booking?.endDate || booking.subscription?.endDate || booking.endDate;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const formatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
      }
      
      const legacyDate = booking.booking?.date || booking.date;
      if (legacyDate) {
        return new Date(legacyDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }
      
      return 'Date not specified';
    },
    
    async processPayment(): Promise<void> {
      if (!this.isPaymentFormValid) return;

      this.processing = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const bookingId = 'WS' + Date.now().toString().slice(-8);
        const confirmationData = {
          bookings: this.bookingDetails,
          bookingId,
          paymentMethod: this.paymentMethod,
          cardInfo: this.paymentMethod === 'card' ? {
            number: '**** ' + this.cardInfo.number.slice(-4),
            name: this.cardInfo.name,
            expiry: this.cardInfo.expiry
          } : null,
          confirmedAt: new Date().toISOString(),
          totalAmount: this.totalAmount
        };

        sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
        this.bookingStore.clearBookingDetails();

        this.$router.push({
          name: 'BookingConfirmation',
          params: { bookingId }
        });
      } catch (error) {
        console.error('Payment processing error:', error);
      } finally {
        this.processing = false;
      }
    }
  }
});
</script>
