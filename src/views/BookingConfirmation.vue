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
              <!-- <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg> -->
              Download Receipt
            </button>
          </div>
        </div>

        <!-- QR Code and Space Info -->
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div class="md:col-span-1 text-center">
            <div class="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 16h4m4 0h2" />
                </svg>
                <p class="text-sm font-medium">QR Access Code</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">Scan to access the space</p>
          </div>
          
          <div class="md:col-span-2">
            <div class="flex space-x-4 mb-6">
              <img :src="confirmationData.space.image" :alt="confirmationData.space.name" class="w-20 h-20 rounded-lg object-cover">
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ confirmationData.space.name }}</h3>
                <div class="flex items-center text-gray-600 mb-2">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ confirmationData.space.location }}
                </div>
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg v-for="star in 5" :key="star" :class="['w-4 h-4', star <= confirmationData.space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-600">{{ confirmationData.space.rating }} ({{ confirmationData.space.reviews }} reviews)</span>
                </div>
              </div>
            </div>
            
            <!-- Booking Information Grid -->
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Date:</span>
                    <span class="font-medium">{{ formatDate(confirmationData.date) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-medium">{{ formatDuration(confirmationData.duration) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Space Type:</span>
                    <span class="font-medium">{{ formatSpaceType(confirmationData.spaceType) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Guests:</span>
                    <span class="font-medium">{{ confirmationData.guests }} {{ confirmationData.guests === 1 ? 'guest' : 'guests' }}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Guest Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">{{ confirmationData.guestInfo.firstName }} {{ confirmationData.guestInfo.lastName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium">{{ confirmationData.guestInfo.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phone:</span>
                    <span class="font-medium">{{ confirmationData.guestInfo.phone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Paid:</span>
                    <span class="font-bold text-green-600">${{ confirmationData.pricing.total }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Included Amenities -->
        <div class="border-t border-gray-200 pt-6">
          <h4 class="font-semibold text-gray-900 mb-4">Included Amenities</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="amenity in includedAmenities" :key="amenity" class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ amenity }}
            </div>
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
        
        <button @click="contactSpace" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact Space
        </button>
        
        <router-link to="/my-bookings" class="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View All Bookings
        </router-link>
      </div>

      <!-- Next Steps Section -->
      <div class="bg-white rounded-xl p-6 shadow-card mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">What to Expect on Arrival</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Check-in Instructions</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Present your QR code at the reception desk
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Show a valid photo ID for verification
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You'll receive your access keycard and workspace tour
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                WiFi credentials will be provided at check-in
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-gray-700">(415) 555-0123</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-700">hello@innovationhub.com</span>
              </div>
              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span class="text-gray-700">123 Innovation Street<br>San Francisco, CA 94105</span>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reception Hours: 8:00 AM - 6:00 PM (24/7 keycard access)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cancellation Policy -->
      <div class="bg-gray-50 rounded-xl p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
        <div class="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Free Cancellation</h3>
            <p class="text-gray-600">Cancel up to 24 hours before your booking for a full refund</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Late Cancellation</h3>
            <p class="text-gray-600">50% refund for cancellations within 24 hours of booking</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">No-Show Policy</h3>
            <p class="text-gray-600">No refund will be provided for no-shows without prior notice</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Confirmation data
const confirmationData = ref<any>({
  bookingId: route.params.bookingId,
  space: {
    name: 'Loading...',
    location: '',
    rating: 0,
    reviews: 0,
    image: ''
  },
  date: '',
  duration: '',
  spaceType: '',
  guests: 1,
  guestInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  pricing: {
    total: 0
  }
})

// Included amenities
const includedAmenities = ref([
  'High-Speed WiFi',
  'Coffee & Tea',
  'Printing Access',
  'Kitchen Access',
  'Phone Booths',
  'Meeting Rooms',
  'Reception Support',
  '24/7 Access'
])

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDuration = (duration: string) => {
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
}

const formatSpaceType = (spaceType: string) => {
  const types: { [key: string]: string } = {
    'hot-desk': 'Hot Desk',
    'dedicated-desk': 'Dedicated Desk',
    'private-office': 'Private Office',
    'meeting-room': 'Meeting Room'
  }
  return types[spaceType] || spaceType
}

const downloadReceipt = () => {
  // In a real app, this would generate and download a PDF receipt
  alert('Receipt download functionality will be implemented. This would generate a PDF receipt with all booking details.')
}

const addToCalendar = () => {
  // In a real app, this would create a calendar event
  const event = {
    title: `Workspace Booking - ${confirmationData.value.space.name}`,
    start: confirmationData.value.date,
    location: confirmationData.value.space.location,
    description: `Booking #${confirmationData.value.bookingId} - ${formatSpaceType(confirmationData.value.spaceType)}`
  }

  // Create Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/-/g, '')}T090000Z/${event.start.replace(/-/g, '')}T180000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`

  window.open(googleCalendarUrl, '_blank')
  alert('✅ Calendar event created! Check your Google Calendar.')
}

const getDirections = () => {
  // Open Google Maps with directions
  const address = encodeURIComponent(confirmationData.value.space.location)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const contactSpace = () => {
  // In a real app, this might open a contact modal or redirect to contact page
  window.location.href = 'tel:+14155550123'
}

// Initialize
onMounted(() => {
  const storedConfirmation = sessionStorage.getItem('bookingConfirmation')
  if (storedConfirmation) {
    const data = JSON.parse(storedConfirmation)
    confirmationData.value = {
      ...data,
      // Ensure we have the booking ID from route params
      bookingId: route.params.bookingId || data.bookingId,
      // Handle different date formats
      date: data.booking?.date || data.startDate || data.date || new Date().toISOString().split('T')[0],
      // Handle duration for different product types
      duration: data.productType === 'meeting-room' ? `${data.booking?.duration || 2} hours` :
                data.package === 'daily' ? 'Daily access' :
                data.package === 'monthly' ? 'Monthly subscription' :
                data.package === 'annual' ? 'Annual subscription' : 'Full day access',
      // Determine space type from product type
      spaceType: data.productType || 'meeting-room',
      // Set guests appropriately
      guests: data.productType === 'coworking-space' ? data.teamSize || '1-5 people' : 1
    }

    console.log('✅ Booking confirmed successfully!', confirmationData.value)
  } else {
    // Create mock confirmation data for demo
    confirmationData.value = {
      bookingId: route.params.bookingId || 'WS' + Date.now().toString().slice(-8),
      space: {
        name: 'The Innovation Hub',
        location: 'Downtown, San Francisco',
        rating: 4.9,
        reviews: 127,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      date: new Date().toISOString().split('T')[0],
      duration: 'Full day access',
      spaceType: 'hot-desk',
      guests: 1,
      guestInfo: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@workspace.com',
        phone: '(555) 123-4567'
      },
      pricing: {
        total: 85
      }
    }

    console.log('📝 Using demo confirmation data')
  }
})
</script>
