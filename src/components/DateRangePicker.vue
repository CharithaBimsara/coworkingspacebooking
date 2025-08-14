<template>
  <div class="date-range-picker">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <div 
        @click="toggleCalendar"
        class="input-field cursor-pointer flex items-center justify-between"
        :class="{ 'border-primary': showCalendar }"
      >
        <span v-if="startDate && endDate" class="text-gray-900">
          {{ formatDateRange() }}
        </span>
        <span v-else class="text-gray-500">{{ placeholder }}</span>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Calendar Dropdown -->
      <div 
        v-if="showCalendar" 
        class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-60 p-4"
        style="min-width: 295px;"
      >
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ currentMonthYear }}
          </h3>
          <button 
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- Days of Week -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="day in daysOfWeek" 
            :key="day"
            class="text-center text-xs font-medium text-gray-500 py-2"
          >
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in calendarDays"
            :key="date.key"
            @click="selectDate(date)"
            :disabled="date.disabled"
            :class="getDateClasses(date)"
            class="h-10 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            {{ date.day }}
          </button>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button 
            @click="clearSelection"
            class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
          <div class="flex space-x-2">
            <button 
              @click="cancelSelection"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="applySelection"
              :disabled="!tempStartDate || !tempEndDate"
              class="px-4 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface CalendarDate {
  date: Date
  day: number
  key: string
  disabled: boolean
  isCurrentMonth: boolean
}

export default defineComponent({
  name: 'DateRangePicker',
  
  props: {
    modelValue: {
      type: Object as () => { startDate: string | null, endDate: string | null },
      default: () => ({ startDate: null, endDate: null })
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select date range'
    },
    minDate: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue', 'change'],
  
  data() {
    return {
      showCalendar: false,
      currentDate: new Date(),
      startDate: null as string | null,
      endDate: null as string | null,
      tempStartDate: null as string | null,
      tempEndDate: null as string | null,
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }
  },
  
  computed: {
    currentMonthYear(): string {
      return this.currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    },
    
    calendarDays(): CalendarDate[] {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      // First day of the month
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // Start from the first Sunday of the calendar
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days: CalendarDate[] = []
      const currentDateObj = new Date(startDate)
      
      // Generate 42 days (6 weeks)
      for (let i = 0; i < 42; i++) {
        const isCurrentMonth = currentDateObj.getMonth() === month
        const dateString = currentDateObj.toISOString().split('T')[0]
        
        days.push({
          date: new Date(currentDateObj),
          day: currentDateObj.getDate(),
          key: dateString,
          disabled: this.isDateDisabled(currentDateObj),
          isCurrentMonth
        })
        
        currentDateObj.setDate(currentDateObj.getDate() + 1)
      }
      
      return days
    }
  },
  
  watch: {
    modelValue: {
      handler(newValue) {
        this.startDate = newValue.startDate
        this.endDate = newValue.endDate
        this.tempStartDate = newValue.startDate
        this.tempEndDate = newValue.endDate
      },
      immediate: true
    }
  },
  
  mounted() {
    // Close calendar when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  
  methods: {
    toggleCalendar(): void {
      this.showCalendar = !this.showCalendar
      if (this.showCalendar) {
        this.tempStartDate = this.startDate
        this.tempEndDate = this.endDate
      }
    },
    
    handleClickOutside(event: Event): void {
      const target = event.target as Element
      if (!this.$el.contains(target)) {
        this.showCalendar = false
      }
    },
    
    previousMonth(): void {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    
    nextMonth(): void {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    
    selectDate(dateObj: CalendarDate): void {
      if (dateObj.disabled) return
      
      const dateString = dateObj.date.toISOString().split('T')[0]
      
      if (!this.tempStartDate || (this.tempStartDate && this.tempEndDate)) {
        // Start new selection
        this.tempStartDate = dateString
        this.tempEndDate = null
      } else if (this.tempStartDate && !this.tempEndDate) {
        // Complete the range
        if (dateString < this.tempStartDate) {
          // If selected date is before start date, swap them
          this.tempEndDate = this.tempStartDate
          this.tempStartDate = dateString
        } else {
          this.tempEndDate = dateString
        }
      }
    },
    
    isDateDisabled(date: Date): boolean {
      const dateString = date.toISOString().split('T')[0]
      
      if (this.minDate && dateString < this.minDate) {
        return true
      }
      
      if (this.maxDate && dateString > this.maxDate) {
        return true
      }
      
      return false
    },
    
    getDateClasses(dateObj: CalendarDate): string {
      const dateString = dateObj.date.toISOString().split('T')[0]
      const classes = []
      
      if (dateObj.disabled) {
        classes.push('text-gray-300 cursor-not-allowed')
      } else if (!dateObj.isCurrentMonth) {
        classes.push('text-gray-400 hover:bg-gray-100')
      } else {
        classes.push('text-gray-900 hover:bg-gray-100')
      }
      
      // Highlight selected dates
      if (this.tempStartDate === dateString || this.tempEndDate === dateString) {
        classes.push('bg-primary text-white hover:bg-primary/90')
      }
      
      // Highlight dates in range
      if (this.tempStartDate && this.tempEndDate && 
          dateString > this.tempStartDate && dateString < this.tempEndDate) {
        classes.push('bg-primary/20 text-primary')
      }
      
      // Today's date
      const today = new Date().toISOString().split('T')[0]
      if (dateString === today && !classes.some(c => c.includes('bg-primary'))) {
        classes.push('ring-2 ring-primary ring-inset')
      }
      
      return classes.join(' ')
    },
    
    formatDateRange(): string {
      if (!this.startDate || !this.endDate) return ''
      
      // Create new Date objects and ensure we get the correct date
      const start = new Date(this.startDate + 'T00:00:00')
      const end = new Date(this.endDate + 'T00:00:00')
      
      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric'
      }
      
      if (start.getFullYear() !== end.getFullYear()) {
        formatOptions.year = 'numeric'
      }
      
      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
    },
    
    clearSelection(): void {
      this.tempStartDate = null
      this.tempEndDate = null
      this.applySelection()
    },
    
    cancelSelection(): void {
      this.tempStartDate = this.startDate
      this.tempEndDate = this.endDate
      this.showCalendar = false
    },
    
    applySelection(): void {
      this.startDate = this.tempStartDate
      this.endDate = this.tempEndDate
      
      const value = {
        startDate: this.startDate,
        endDate: this.endDate
      }
      
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
      this.showCalendar = false
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}
</style>