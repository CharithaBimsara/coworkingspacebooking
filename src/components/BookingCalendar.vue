<template>
  <div class="bg-white rounded-xl shadow-card p-6">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Calendar View</h2>
      <div class="flex items-center space-x-4">
        <!-- Month Navigation -->
        <div class="flex items-center space-x-2">
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-medium text-gray-900 min-w-[140px] text-center">
            {{ currentMonthYear }}
          </h3>
          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- View Toggle -->
        <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            @click="viewType = 'month'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewType === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Month
          </button>
          <button
            @click="viewType = 'week'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewType === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Week
          </button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center space-x-6 mb-6 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-gray-600">Confirmed</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span class="text-gray-600">Completed</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span class="text-gray-600">Cancelled</span>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div v-if="viewType === 'month'" class="grid grid-cols-7 gap-1">
      <!-- Day Headers -->
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="p-3 text-center text-sm font-medium text-gray-500 border-b border-gray-200"
      >
        {{ day }}
      </div>

      <!-- Calendar Days -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'min-h-[100px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors',
          day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
          day.isToday ? 'bg-blue-50 border-blue-200' : ''
        ]"
      >
        <!-- Day Number -->
        <div
          :class="[
            'text-sm font-medium mb-1',
            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
            day.isToday ? 'text-blue-600' : ''
          ]"
        >
          {{ day.date }}
        </div>

        <!-- Bookings for this day -->
        <div class="space-y-1">
          <div
            v-for="booking in day.bookings"
            :key="booking.id"
            @click="selectBooking(booking)"
            :class="[
              'text-xs p-1 rounded cursor-pointer truncate',
              getBookingClass(booking.status)
            ]"
            :title="`${booking.space.name} - ${booking.status}`"
          >
            {{ booking.space.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Week View -->
    <div v-else class="space-y-4">
      <div
        v-for="day in weekDays"
        :key="day.dateString"
        class="border border-gray-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="font-medium text-gray-900">{{ day.dayName }}</h4>
            <p class="text-sm text-gray-600">{{ day.dateString }}</p>
          </div>
          <div class="text-sm text-gray-500">
            {{ day.bookings.length }} booking{{ day.bookings.length !== 1 ? 's' : '' }}
          </div>
        </div>

        <div v-if="day.bookings.length === 0" class="text-sm text-gray-400 italic">
          No bookings
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="booking in day.bookings"
            :key="booking.id"
            @click="selectBooking(booking)"
            :class="[
              'p-3 rounded-lg cursor-pointer transition-colors',
              getBookingClass(booking.status, true)
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <h5 class="font-medium">{{ booking.space.name }}</h5>
                <p class="text-sm opacity-75">{{ booking.space.location }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">${{ booking.totalAmount }}</div>
                <div class="text-xs opacity-75">{{ formatDuration(booking.duration) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div
      v-if="selectedBooking"
      @click="selectedBooking = null"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        @click.stop
        class="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
          <button
            @click="selectedBooking = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex space-x-3">
            <img
              :src="selectedBooking.space.image"
              :alt="selectedBooking.space.name"
              class="w-16 h-16 rounded-lg object-cover"
            >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ selectedBooking.space.name }}</h4>
              <p class="text-sm text-gray-600">{{ selectedBooking.space.location }}</p>
              <div class="flex items-center mt-1">
                <div class="flex text-yellow-400">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    :class="['w-3 h-3', star <= selectedBooking.space.rating ? 'fill-current' : 'stroke-current fill-none']"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-1 text-xs text-gray-600">{{ selectedBooking.space.rating }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Booking ID:</span>
              <p class="font-medium">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <span class="text-gray-600">Status:</span>
              <p :class="['font-medium', getStatusColor(selectedBooking.status)]">
                {{ selectedBooking.status }}
              </p>
            </div>
            <div>
              <span class="text-gray-600">Date:</span>
              <p class="font-medium">{{ formatDate(selectedBooking.date) }}</p>
            </div>
            <div>
              <span class="text-gray-600">Duration:</span>
              <p class="font-medium">{{ formatDuration(selectedBooking.duration) }}</p>
            </div>
            <div>
              <span class="text-gray-600">Guests:</span>
              <p class="font-medium">{{ selectedBooking.guests }}</p>
            </div>
            <div>
              <span class="text-gray-600">Total:</span>
              <p class="font-medium">${{ selectedBooking.totalAmount }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="selectedBooking = null"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              @click="viewBookingDetails"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface BookingItem {
  id: string
  status: 'Confirmed' | 'Completed' | 'Cancelled'
  date: string
  duration: string
  spaceType: string
  guests: number
  totalAmount: number
  basePrice: number
  extraFees: number
  serviceFee: number
  taxes: number
  hasReview: boolean
  space: {
    id: number
    name: string
    location: string
    rating: number
    image: string
  }
}

interface CalendarDay {
  date: number
  dateString: string
  isCurrentMonth: boolean
  isToday: boolean
  bookings: BookingItem[]
}

interface WeekDay {
  dayName: string
  dateString: string
  bookings: BookingItem[]
}

export default defineComponent({
  name: 'BookingCalendar',
  
  props: {
    bookings: {
      type: Array as PropType<BookingItem[]>,
      required: true
    }
  },
  
  emits: ['booking-selected'],
  
  data() {
    return {
      currentDate: new Date(),
      viewType: 'month' as 'month' | 'week',
      selectedBooking: null as BookingItem | null,
      dayHeaders: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  
  computed: {
    currentMonthYear(): string {
      return this.currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    },
    
    calendarDays(): CalendarDay[] {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      // First day of the month
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // Start from the first Sunday of the calendar
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      // End at the last Saturday of the calendar
      const endDate = new Date(lastDay)
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
      
      const days: CalendarDay[] = []
      const currentDate = new Date(startDate)
      const today = new Date()
      
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0]
        const dayBookings = this.bookings.filter(booking => booking.date === dateString)
        
        days.push({
          date: currentDate.getDate(),
          dateString,
          isCurrentMonth: currentDate.getMonth() === month,
          isToday: currentDate.toDateString() === today.toDateString(),
          bookings: dayBookings
        })
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return days
    },
    
    weekDays(): WeekDay[] {
      const startOfWeek = new Date(this.currentDate)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      
      const days: WeekDay[] = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(date.getDate() + i)
        
        const dateString = date.toISOString().split('T')[0]
        const dayBookings = this.bookings.filter(booking => booking.date === dateString)
        
        days.push({
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dateString: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          bookings: dayBookings
        })
      }
      
      return days
    }
  },
  
  methods: {
    previousMonth(): void {
      if (this.viewType === 'month') {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      } else {
        this.currentDate.setDate(this.currentDate.getDate() - 7)
      }
      this.currentDate = new Date(this.currentDate)
    },
    
    nextMonth(): void {
      if (this.viewType === 'month') {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      } else {
        this.currentDate.setDate(this.currentDate.getDate() + 7)
      }
      this.currentDate = new Date(this.currentDate)
    },
    
    selectBooking(booking: BookingItem): void {
      this.selectedBooking = booking
    },
    
    viewBookingDetails(): void {
      if (this.selectedBooking) {
        this.$emit('booking-selected', this.selectedBooking)
        this.selectedBooking = null
      }
    },
    
    getBookingClass(status: string, isWeekView = false): string {
      const baseClasses = isWeekView ? 'hover:opacity-80' : 'hover:opacity-80'
      
      switch (status) {
        case 'Confirmed':
          return `${baseClasses} bg-green-100 text-green-800 border-green-200`
        case 'Completed':
          return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`
        case 'Cancelled':
          return `${baseClasses} bg-red-100 text-red-800 border-red-200`
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`
      }
    },
    
    getStatusColor(status: string): string {
      switch (status) {
        case 'Confirmed':
          return 'text-green-600'
        case 'Completed':
          return 'text-blue-600'
        case 'Cancelled':
          return 'text-red-600'
        default:
          return 'text-gray-600'
      }
    },
    
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    
    formatDuration(duration: string): string {
      const durationMap: { [key: string]: string } = {
        'hourly': 'Hourly',
        'daily': 'Full Day',
        'weekly': 'Weekly',
        'monthly': 'Monthly'
      }
      return durationMap[duration] || 'Full Day'
    }
  }
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>