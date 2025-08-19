<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto container-padding py-8">
      <!-- Success Message -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-heading font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p class="text-xl text-gray-600 mb-4">Your workspace is reserved and ready for you</p>
        <div class="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Confirmation #{{ confirmationData.bookingId }}
        </div>
      </div>

      <!-- Booking Details Card -->
      <div class="bg-white rounded-xl p-8 shadow-card mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Booking Details</h2>
          <div class="flex items-center space-x-3">
            <button @click="downloadReceipt" class="btn-primary">
              Download Receipt
            </button>
          </div>
        </div>

        <!-- Booked Items -->
        <div v-for="(booking, index) in confirmationData.bookings" :key="index" class="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b last:border-b-0">
          <div class="md:col-span-1 text-center">
            <img v-if="booking.space.image" :src="booking.space.image" :alt="booking.space.name" class="w-full h-32 rounded-lg object-cover mx-auto mb-4">
            <img v-else src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Default Space Image" class="w-full h-32 rounded-lg object-cover mx-auto mb-4">
          </div>
          
          <div class="md:col-span-2">
            <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ booking.space.name }}</h3>
            <div class="flex items-center text-gray-600 mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {{ booking.space.location }}
            </div>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date:</span>
                    <span class="font-medium">{{ formatBookingDate(booking) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Type:</span>
                    <span class="font-medium">{{ formatProductType(booking.productType) }}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Price</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Paid:</span>
                    <span class="font-bold text-green-600">${{ booking.totalPrice.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code and Total Summary -->
        <div class="grid md:grid-cols-2 gap-8 items-center border-t border-gray-200 pt-6">
          <div class="text-center">
            <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="Booking QR Code" class="w-32 h-32 mx-auto">
            <p class="text-sm text-gray-600 mt-2">Scan to access the space</p>
          </div>
          <div class="text-right">
            <h3 class="text-xl font-semibold text-gray-900">Total Amount</h3>
            <p class="text-2xl font-bold text-primary">${{ confirmationData.totalAmount.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button @click="addToCalendar" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add to Calendar
        </button>
        
        <button @click="getDirections" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Get Directions
        </button>
        
        <button @click="contactSupport" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact Support
        </button>
        
        <router-link to="/my-bookings" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View All Bookings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { generatePDFReceipt } from '../utils/pdfReceipt'
import QRCode from 'qrcode'

const route = useRoute()

const confirmationData = ref<any>({
  bookingId: route.params.bookingId,
  bookings: [],
  totalAmount: 0,
  guestInfo: { firstName: 'Guest', lastName: 'User' },
  paymentMethod: 'Credit Card',
  confirmedAt: new Date().toISOString()
})

const qrCodeDataUrl = ref('')

const primaryBooking = computed(() => confirmationData.value.bookings[0] || { space: {} })

const generateQRCode = async (bookingId: string) => {
  try {
    const qrData = JSON.stringify({
      bookingId: bookingId,
      verificationUrl: `https://curryrealmworkspace.com/verify/${bookingId}`
    })
    qrCodeDataUrl.value = await QRCode.toDataURL(qrData, { width: 200, margin: 1 })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

const formatBookingDate = (booking: any) => {
  const startDate = booking.booking?.startDate || booking.subscription?.startDate
  const endDate = booking.booking?.endDate || booking.subscription?.endDate
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }
  return 'N/A'
}

const formatProductType = (productType: string) => {
  const types: { [key: string]: string } = {
    'meeting-room': 'Meeting Room',
    'hot-desk': 'Hot Desk',
    'coworking-space': 'Co-working Space'
  }
  return types[productType] || productType
}

const downloadReceipt = async () => {
  try {
    const mappedBookings = confirmationData.value.bookings.map((booking: any) => {
      const mappedBooking: any = {
        spaceId: booking.space.id,
        productType: booking.spaceType,
        space: {
          name: booking.space.name,
          location: booking.space.location,
        },
        totalPrice: booking.totalAmount,
      };

      if (booking.spaceType === 'meeting-room') {
        mappedBooking.booking = {
          startDate: booking.date,
          endDate: booking.date,
          startTime: '09:00', // Placeholder, not available in BookingItem
          duration: booking.duration,
        };
      } else {
        mappedBooking.subscription = {
          startDate: booking.date,
          endDate: booking.date,
          packageType: booking.duration,
        };
      }
      return mappedBooking;
    });

    const receiptData = {
      bookings: mappedBookings,
      bookingId: confirmationData.value.bookingId,
      paymentMethod: confirmationData.value.paymentMethod,
      confirmedAt: confirmationData.value.confirmedAt,
      totalAmount: confirmationData.value.totalAmount,
      guestInfo: confirmationData.value.guestInfo,
    };

    await generatePDFReceipt(receiptData);
  } catch (error) {
    console.error('Failed to generate PDF receipt:', error);
    alert('Could not generate PDF receipt. Please try again later.');
  }
}

const addToCalendar = () => {
  const event = {
    title: `Workspace Booking: ${primaryBooking.value.space.name}`,
    start: primaryBooking.value.booking?.startDate,
    location: primaryBooking.value.space.location,
    description: `Booking #${confirmationData.value.bookingId}`
  }
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/-/g, '')}T090000Z/${event.start.replace(/-/g, '')}T180000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
  window.open(googleCalendarUrl, '_blank')
}

const getDirections = () => {
  const address = encodeURIComponent(primaryBooking.value.space.location)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const contactSupport = () => {
  window.location.href = 'mailto:support@curryrealmworkspace.com'
}

onMounted(() => {
  const storedConfirmation = sessionStorage.getItem('bookingConfirmation');
  if (storedConfirmation) {
    const parsedData = JSON.parse(storedConfirmation);
    if (parsedData.bookings && Array.isArray(parsedData.bookings)) {
      parsedData.bookings = parsedData.bookings.map((booking: any) => {
        if (booking.space && Array.isArray(booking.space.images) && booking.space.images.length > 0) {
          const { images, ...restOfSpace } = booking.space;
          return {
            ...booking,
            space: {
              ...restOfSpace,
              image: images[0]
            }
          };
        }
        return booking;
      });
    }
    confirmationData.value = parsedData;
  } else {
    // Fallback for direct access
    console.warn('No confirmation data found in session storage.');
  }

  if (confirmationData.value.bookingId) {
    generateQRCode(confirmationData.value.bookingId);
  }
});
</script>
