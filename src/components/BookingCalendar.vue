<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Calendar View</h2>
      <div class="flex items-center space-x-4">
        <!-- Month Navigation -->
        <div class="flex items-center space-x-2">
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white min-w-[140px] text-center">
            {{ currentMonthYear }}
          </h3>
          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- View Toggle -->
        <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="viewType = 'month'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewType === 'month' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            Month
          </button>
          <button
            @click="viewType = 'week'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewType === 'week' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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
        <span class="text-gray-600 dark:text-gray-300">Confirmed</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-primary rounded-full"></div>
        <span class="text-gray-600 dark:text-gray-300">Completed</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span class="text-gray-600 dark:text-gray-300">Cancelled</span>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div v-if="viewType === 'month'" class="grid grid-cols-7 gap-1">
      <!-- Day Headers -->
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
      >
        {{ day }}
      </div>

      <!-- Calendar Days -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'min-h-[100px] p-2 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900',
          day.isToday ? 'bg-primary/5 dark:bg-primary/20 border-primary/30 dark:border-primary/40' : ''
        ]"
      >
        <!-- Day Number -->
        <div
          :class="[
            'text-sm font-medium mb-1',
            day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500',
            day.isToday ? 'text-primary dark:text-primary/80' : ''
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
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white">{{ day.dayName }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ day.dateString }}</p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ day.bookings.length }} booking{{ day.bookings.length !== 1 ? 's' : '' }}
          </div>
        </div>

        <div v-if="day.bookings.length === 0" class="text-sm text-gray-400 dark:text-gray-500 italic">
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
                <div class="text-sm font-medium">{{ formatCurrency(booking.totalAmount) }}</div>
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
        class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Booking Details</h3>
          <button
            @click="selectedBooking = null"
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
              <h4 class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.space.name }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ selectedBooking.space.location }}</p>
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
                <span class="ml-1 text-xs text-gray-600 dark:text-gray-400">{{ selectedBooking.space.rating }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Booking ID:</span>
              <p class="font-medium">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Status:</span>
              <p :class="['font-medium', getStatusColor(selectedBooking.status)]">
                {{ selectedBooking.status }}
              </p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Date:</span>
              <p class="font-medium">{{ formatDate(selectedBooking.date) }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Duration:</span>
              <p class="font-medium">{{ formatDuration(selectedBooking.duration) }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Guests:</span>
              <p class="font-medium">{{ selectedBooking.guests }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Total:</span>
              <p class="font-medium">{{ formatCurrency(selectedBooking.totalAmount) }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="selectedBooking = null"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
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
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { formatDateLocal } from '../utils/dateUtils'
import { formatCurrency } from '../utils/formatUtils'

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
        const dateString = formatDateLocal(currentDate)
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
        
        const dateString = formatDateLocal(date)
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
          return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800`
        case 'Completed':
          return `${baseClasses} bg-primary/10 dark:bg-primary/30 text-primary/90 dark:text-primary/80 border-primary/30 dark:border-primary/40`
        case 'Cancelled':
          return `${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800`
        default:
          return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600`
      }
    },
    
    getStatusColor(status: string): string {
      switch (status) {
        case 'Confirmed':
          return 'text-green-600 dark:text-green-400'
        case 'Completed':
          return 'text-primary dark:text-primary/80'
        case 'Cancelled':
          return 'text-red-600 dark:text-red-400'
        default:
          return 'text-gray-600 dark:text-gray-400'
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
    },
    
    formatCurrency(price: any): string {
      return formatCurrency(price)
    }
  }
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>