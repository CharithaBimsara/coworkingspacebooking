<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
    <div class="max-w-4xl mx-auto container-padding py-8">
      <!-- Success Message -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">Your workspace is reserved and ready for you</p>
        <div class="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Confirmation #{{ confirmationData.bookingId }}
        </div>
      </div>

            <!-- Booking Details Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h2 class="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Booking Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Space Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Space Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Space Type:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.spaceType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Location:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.location }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Date:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(confirmationData.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Time:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.time }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Duration:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.duration }}</span>
              </div>
            </div>
          </div>
          
          <!-- Guest Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Name:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.guestName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Email:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.guestEmail }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Phone:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.guestPhone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Company:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ confirmationData.company }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- QR Code Section -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access QR Code</h3>
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-center sm:text-left">
              <p class="text-gray-600 dark:text-gray-400 mb-2">Scan this QR code at the entrance for quick access</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">Valid for your booking date and time only</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <canvas ref="qrCanvas" class="w-32 h-32"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <button @click="downloadReceipt" class="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Receipt
        </button>
        
        <button @click="addToCalendar" class="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add to Calendar
        </button>
        
        <button @click="getDirections" class="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Get Directions
        </button>
        
        <button @click="contactSupport" class="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact Support
        </button>
        
        <router-link to="/my-bookings" class="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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

const qrCanvas = ref<HTMLCanvasElement | null>(null)

const primaryBooking = computed(() => confirmationData.value.bookings[0] || { space: {} })

const generateQRCode = async (bookingId: string) => {
  try {
    const qrData = JSON.stringify({
      bookingId: bookingId,
      verificationUrl: `https://curryrealmworkspace.com/verify/${bookingId}`
    })
    
    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrData, { width: 128, margin: 1 })
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('en-US', options)
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
