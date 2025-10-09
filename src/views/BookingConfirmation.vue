<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
    <div class="max-w-6xl mx-auto container-padding py-8">
      <!-- Success Message -->
      <div v-if="isSuccess" class="text-center mb-8">
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
          Order #{{ invoiceData?.order_id || 'N/A' }}
        </div>
      </div>

      <!-- Failure Message -->
      <div v-else class="text-center mb-8">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">Your payment could not be processed. Please try again.</p>
        <button
          @click="retryPayment"
          class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry Payment
        </button>
      </div>

      <!-- Invoice Details -->
      <div v-if="isSuccess && invoiceData" class="space-y-8">
        <!-- Customer Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Customer Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Name:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ invoiceData.first_name }} {{ invoiceData.last_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Email:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ invoiceData.email }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Phone:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ invoiceData.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ invoiceData.transaction_id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div v-for="(product, index) in invoiceData.products" :key="product.product_id" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-heading font-bold text-gray-900 dark:text-white">
              {{ getProductTypeDisplayName(product.product_type) }} {{ index + 1 }}
            </h3>
            <div class="text-right">
              <p class="text-2xl font-bold text-primary">LKR {{ product.total_price.toFixed(2) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Space Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Space Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Location:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ product.location_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Product Type:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getProductTypeDisplayName(product.product_type) }}</span>
                </div>
              </div>
            </div>

            <!-- Booking/Schedule Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {{ product.booking_date ? 'Booking Details' : 'Subscription Details' }}
              </h4>
              <div class="space-y-3">
                <!-- For normal bookings -->
                <template v-if="product.booking_date">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Date:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(product.booking_date) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Time:</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatTime(product.start_time) }} - {{ formatTime(product.end_time) }}
                    </span>
                  </div>
                </template>

                <!-- For subscriptions -->
                <template v-else-if="product.subscription_start_date && product.subscription_end_date">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Start Date:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(product.subscription_start_date) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">End Date:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(product.subscription_end_date) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Package:</span>
                    <span class="font-medium text-gray-900 dark:text-white capitalize">{{ product.package_type }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Additional Facilities -->
          <div v-if="product.additional_facilities && product.additional_facilities.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Facilities</h4>
            <div class="space-y-3">
              <div v-for="facility in product.additional_facilities" :key="facility.facility_id" class="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <span class="font-medium text-gray-900 dark:text-white">{{ facility.facility_name }}</span>
                <span class="font-semibold text-primary">LKR {{ facility.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Amount -->
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-heading font-bold text-gray-900 dark:text-white">Total Amount Paid</h3>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-primary">LKR {{ invoiceData.total_amount.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        <!--
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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
        -->
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading invoice details...</p>
      </div>

      <!-- Action Buttons -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
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
import { useRoute, useRouter } from 'vue-router'
import { generatePDFReceipt } from '../utils/pdfReceipt'
// import QRCode from 'qrcode'
import { apiManager } from '../api/apiManager'

// Payment result state
const isSuccess = ref(true)
const paymentResult = ref<any>(null)
const loading = ref(true)
const invoiceData = ref<any>(null)

const route = useRoute()
const router = useRouter()

// const qrCanvas = ref<HTMLCanvasElement | null>(null)

// Interface for invoice data
interface InvoiceProduct {
  product_id: number;
  product_type: string;
  location_name: string;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  package_type: string | null;
  total_price: number;
  additional_facilities: Array<{
    facility_id: number;
    facility_name: string;
    price: number;
  }>;
}

/*
const generateQRCode = async (orderId: string) => {
  try {
    const qrData = JSON.stringify({
      orderId: orderId,
      verificationUrl: `https://spacebooking.com/verify/${orderId}`
    })

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrData, { width: 128, margin: 1 })
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}
*/

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString('en-US', options)
}

const formatTime = (timeString: string | null) => {
  if (!timeString) return 'N/A'
  // Assuming time is in HH:MM:SS format, extract HH:MM
  return timeString.substring(0, 5)
}

const getProductTypeDisplayName = (productType: string) => {
  const typeMap: Record<string, string> = {
    'MeetingRoom': 'Meeting Room',
    'HotDesk': 'Hot Desk',
    'DedicatedDesk': 'Dedicated Desk',
    'CoworkingSpace': 'Co-working Space'
  }
  return typeMap[productType] || productType
}

const downloadReceipt = async () => {
  if (!invoiceData.value) return

  try {
    // Generate PDF invoice using real API data
    await generatePDFReceipt(invoiceData.value.order_id)
  } catch (error) {
    console.error('Failed to generate PDF invoice:', error)
    alert('Could not generate PDF invoice. Please try again later.')
  }
}

const addToCalendar = () => {
  if (!invoiceData.value?.products?.[0]) return

  const product = invoiceData.value.products[0]
  const startDate = product.booking_date || product.subscription_start_date || new Date().toISOString().split('T')[0]

  const event = {
    title: `Workspace Booking: ${getProductTypeDisplayName(product.product_type)}`,
    start: startDate,
    location: product.location_name,
    description: `Order #${invoiceData.value.order_id}`
  }

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/-/g, '')}T090000Z/${event.start.replace(/-/g, '')}T180000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
  window.open(googleCalendarUrl, '_blank')
}

const getDirections = () => {
  if (!invoiceData.value?.products?.[0]) return

  const address = encodeURIComponent(invoiceData.value.products[0].location_name)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const contactSupport = () => {
  window.location.href = 'mailto:support@spacebooking.com'
}

const retryPayment = () => {
  // Restore booking data from sessionStorage
  const retryData = sessionStorage.getItem('retry_booking_data')
  if (retryData) {
    // Store it back for payment page to load
    sessionStorage.setItem('restore_booking_data', retryData)
  }
  router.push('/booking/payment')
}

const loadInvoiceData = async (orderId: string) => {
  try {
    loading.value = true
    const response = await apiManager.getInvoice(orderId)

    if (response.success && response.data) {
      invoiceData.value = response.data
    } else {
      console.error('Failed to load invoice:', response.message)
      // Handle error gracefully
    }
  } catch (error) {
    console.error('Error loading invoice:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const storedResult = sessionStorage.getItem('payment_result')
  if (!storedResult) {
    // No payment result, redirect to home
    router.replace({ name: 'Home' })
    return
  }

  paymentResult.value = JSON.parse(storedResult)
  isSuccess.value = paymentResult.value.success

  if (isSuccess.value && paymentResult.value.orderId) {
    // Load invoice data using the order ID
    await loadInvoiceData(paymentResult.value.orderId)

    // Generate QR code with order ID
    /*
    if (invoiceData.value?.order_id) {
      generateQRCode(invoiceData.value.order_id)
    }
    */
  } else {
    loading.value = false
  }
})
</script>
