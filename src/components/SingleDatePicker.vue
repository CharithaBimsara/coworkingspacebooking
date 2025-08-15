
    formatLocalDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
<template>
  <div class="single-date-picker">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <div 
        @click="toggleCalendar"
        class="input-field cursor-pointer flex items-center justify-between"
        :class="{ 'border-primary': showCalendar }"
      >
        <span v-if="selectedDate" class="text-gray-900">
          {{ formatDate(selectedDate) }}
        </span>
        <span v-else class="text-gray-500">{{ placeholder }}</span>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div 
        v-if="showCalendar" 
        class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-60 p-4"
        style="min-width: 295px;"
      >
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
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="day in daysOfWeek" 
            :key="day"
            class="text-center text-xs font-medium text-gray-500 py-2"
          >
            {{ day }}
          </div>
        </div>
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
  <!-- Removed Apply, Clear, and Cancel buttons. Date selection is now instant. -->
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
  name: 'SingleDatePicker',
  props: {
    modelValue: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select date'
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
      selectedDate: null as string | null,
      tempDate: null as string | null,
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
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      const days: CalendarDate[] = []
      const currentDateObj = new Date(startDate)
      for (let i = 0; i < 42; i++) {
        const isCurrentMonth = currentDateObj.getMonth() === month
        const dateString = this.formatLocalDate(currentDateObj)
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
        this.selectedDate = newValue
        this.tempDate = newValue
      },
      immediate: true
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    formatLocalDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    toggleCalendar(): void {
      this.showCalendar = !this.showCalendar
      if (this.showCalendar) {
        this.tempDate = this.selectedDate
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
      const dateString = this.formatLocalDate(dateObj.date)
      this.selectedDate = dateString
      this.$emit('update:modelValue', this.selectedDate)
      this.$emit('change', this.selectedDate)
      this.showCalendar = false
    },
    isDateDisabled(date: Date): boolean {
  const dateString = this.formatLocalDate(date)
      if (this.minDate && dateString < this.minDate) {
        return true
      }
      if (this.maxDate && dateString > this.maxDate) {
        return true
      }
      return false
    },
    getDateClasses(dateObj: CalendarDate): string {
  const dateString = this.formatLocalDate(dateObj.date)
      const classes = []
      if (dateObj.disabled) {
        classes.push('text-gray-300 cursor-not-allowed')
      } else if (!dateObj.isCurrentMonth) {
        classes.push('text-gray-400 hover:bg-gray-100')
      } else {
        classes.push('text-gray-900 hover:bg-gray-100')
      }
      if (this.tempDate === dateString) {
        classes.push('bg-primary text-white hover:bg-primary/90')
      }
  const today = this.formatLocalDate(new Date())
      if (dateString === today && !classes.some(c => c.includes('bg-primary'))) {
        classes.push('ring-2 ring-primary ring-inset')
      }
      return classes.join(' ')
    },
    formatDate(date: string): string {
      if (!date) return ''
      // Parse as local date to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
  // clearSelection, cancelSelection, and applySelection removed (no longer needed)
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
