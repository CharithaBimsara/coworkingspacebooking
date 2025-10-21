<template>
  <div class="custom-time-range-picker">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ label }}</label>
  <div class="md:flex md:items-center md:gap-2 sm:flex sm:flex-row sm:items-center sm:gap-2 flex flex-col gap-2 w-full">
  <div class="relative w-full flex-grow">
        <input
          type="text"
          v-model="startTimeDisplay"
          @focus="openDropdown('start')"
          @blur="onBlur('start')"
          readonly
          class="custom-time-input dark:bg-gray-900 dark:text-white dark:border-gray-700 w-full"
          placeholder="Start time"
        />
        <div v-if="showStartDropdown" class="dropdown custom-scrollbar absolute w-full left-0 mt-1 dark:bg-gray-800 dark:border-gray-700">
          <div 
            v-for="time in timeOptions" 
            :key="time" 
            @mousedown.prevent="selectTime('start', time)" 
            :class="['dropdown-item', { selected: startTime === time, disabled: isStartTimeDisabled(time) }]"
          >
            <span>{{ time }}</span>
            <span v-if="isStartTimeDisabled(time)" class="text-xs text-red-500 ml-2">Booked</span>
          </div>
        </div>
      </div>
      <span class="mx-1 dark:text-white sm:block hidden">-</span>
      <div class="relative sm:hidden flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 -mt-1 -mb-1">
        to
      </div>
  <div class="relative w-full flex-grow">
        <input
          type="text"
          v-model="endTimeDisplay"
          @focus="openDropdown('end')"
          @blur="onBlur('end')"
          readonly
          :disabled="!startTime"
          :class="[
            'custom-time-input dark:bg-gray-900 dark:text-white dark:border-gray-700 w-full', 
            { 
              'disabled': !startTime,
              'highlight-needed': shouldHighlightEndTime
            }
          ]"
          :placeholder="!startTime ? 'End time' : 'Enter end time'"
        />
        <div v-if="showEndDropdown && startTime" class="dropdown custom-scrollbar w-full absolute left-0 mt-1 dark:bg-gray-800 dark:border-gray-700">
          <div 
            v-for="time in availableEndTimeOptions" 
            :key="time" 
            @mousedown.prevent="selectTime('end', time)" 
            :class="['dropdown-item', { selected: endTime === time, disabled: isEndTimeDisabled(time) }]"
          >
            <span>{{ time }}</span>
            <span v-if="isEndTimeDisabled(time)" class="text-xs text-red-500 ml-2">Booked</span>
          </div>
        </div>
      </div>
      <div v-if="loading" class="ml-2">
        <div class="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'CustomTimeRangePicker',
  props: {
    modelValue: {
      type: Object as PropType<{ start: string; end: string }>,
      default: () => ({ start: '', end: '' })
    },
    label: {
      type: String,
      default: ''
    },
    disabledStartTimes: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    disabledEndTimes: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    operatingStartTime: {
      type: String,
      default: '09:00'
    },
    operatingEndTime: {
      type: String,
      default: '18:00'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'start-time-change', 'end-time-change'],
  setup(props, { emit }) {
    const showStartDropdown = ref(false)
    const showEndDropdown = ref(false)

    function openDropdown(type: 'start' | 'end') {
      if (type === 'end' && !localStartTime.value) {
        return; // Don't open end dropdown if no start time
      }
      
      if (type === 'start') {
        showStartDropdown.value = true;
        showEndDropdown.value = false;
      } else {
        showEndDropdown.value = true;
        showStartDropdown.value = false;
      }
    }
    
    const localStartTime = ref(props.modelValue.start)
    const localEndTime = ref(props.modelValue.end)

    watch(() => props.modelValue, (val) => {
      localStartTime.value = val.start
      localEndTime.value = val.end
    })

    // Generate time options based on operating hours
    const timeOptions = computed(() => {
      // Parse operating hours
      const startHour = parseInt(props.operatingStartTime.split(':')[0])
      const startMin = parseInt(props.operatingStartTime.split(':')[1])
      const endHour = parseInt(props.operatingEndTime.split(':')[0])
      const endMin = parseInt(props.operatingEndTime.split(':')[1])
      
      // Calculate total minutes and number of 30-minute slots
      const startTotalMinutes = startHour * 60 + startMin
      const endTotalMinutes = endHour * 60 + endMin
      
      // For start times, we generate options up to 30 minutes before the end time
      // For end times (when selected by the user), we'll include the actual end time
      const lastStartTimeMinutes = endTotalMinutes - 30
      
      const durationMinutes = lastStartTimeMinutes - startTotalMinutes
      const numSlots = Math.floor(durationMinutes / 30) + 1
      
      // Generate time slots at 30-minute intervals, ensuring the last start time is 30 minutes before end time
      return Array.from({ length: numSlots }, (_, i) => {
        const slotMinutes = startTotalMinutes + (i * 30)
        const hour = Math.floor(slotMinutes / 60)
        const min = slotMinutes % 60
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      })
    })

    const startTimeDisplay = computed(() => localStartTime.value || '')
    const endTimeDisplay = computed(() => localEndTime.value || '')

    function selectTime(type: 'start' | 'end', time: string) {
      if (type === 'start') {
        if (isStartTimeDisabled(time)) return;
        localStartTime.value = time
        localEndTime.value = '' // Reset end time when start time changes
        showStartDropdown.value = false
        emit('update:modelValue', { start: time, end: '' })
        emit('start-time-change', time) // Emit start time change event
      } else {
        if (isEndTimeDisabled(time)) return;
        localEndTime.value = time
        showEndDropdown.value = false
        emit('update:modelValue', { start: localStartTime.value, end: time })
        emit('end-time-change', time) // Emit end time change event
      }
    }

    function onBlur(type: 'start' | 'end') {
      setTimeout(() => {
        if (type === 'start') showStartDropdown.value = false
        else showEndDropdown.value = false
      }, 100)
    }

    const isStartTimeDisabled = (time: string) => {
      return props.disabledStartTimes.includes(time);
    }

    const isEndTimeDisabled = (time: string) => {
      return props.disabledEndTimes.includes(time);
    }

    // Only show end times that are after the selected start time
    const availableEndTimeOptions = computed(() => {
      if (!localStartTime.value) return [];
      
      // Make sure to include the end time in options
      const endHour = parseInt(props.operatingEndTime.split(':')[0]);
      const endMin = parseInt(props.operatingEndTime.split(':')[1]);
      const endTimeOption = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
      
      const startTimeMinutes = convertTimeToMinutes(localStartTime.value);
      
      // Get all time options after the selected start time
      let validEndTimes = timeOptions.value.filter((time: string) => {
        const timeMinutes = convertTimeToMinutes(time);
        return timeMinutes > startTimeMinutes; // End time must be after start time
      });
      
      // Add the end time if it's not already in the list and is after the selected start time
      const endTimeMinutes = convertTimeToMinutes(endTimeOption);
      if (endTimeMinutes > startTimeMinutes && !validEndTimes.includes(endTimeOption)) {
        validEndTimes = [...validEndTimes, endTimeOption];
      }
      
      return validEndTimes;
    });

    // Check if we should highlight end time (start time selected but end time not)
    const shouldHighlightEndTime = computed(() => {
      return !!(localStartTime.value && !localEndTime.value);
    });

    // Helper function to convert time string to minutes
    function convertTimeToMinutes(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }

    return {
      showStartDropdown,
      showEndDropdown,
      startTime: localStartTime,
      endTime: localEndTime,
      timeOptions,
      selectTime,
      startTimeDisplay,
      endTimeDisplay,
      onBlur,
      openDropdown,
      isStartTimeDisabled,
      isEndTimeDisabled,
      availableEndTimeOptions,
      shouldHighlightEndTime
    }
  }
})
</script>

<style scoped>
.custom-time-range-picker {
  position: relative;
  width: 100%;
}

.dark .custom-time-input {
  border-color: #4B5563 !important;
  color: white;
  font-size: 0.75rem; /* Compact size */
}

.custom-time-input {
  width: 100%;
  margin-top: 2px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  outline: none;
  font-size: 0.75rem; /* text-xs */
  /* color: #111; */
  /* background: #fff; */
  cursor: pointer;
  /* transition: border-color 0.2s, box-shadow 0.2s; */
}

/* Tablet view (sm breakpoint in Tailwind) */
@media (min-width: 640px) and (max-width: 1023px) {
  .custom-time-range-picker .custom-time-input {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex-grow: 1 !important;
  }
  .custom-time-range-picker .relative {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex-grow: 1 !important;
  }
}

/* Desktop view */
@media (min-width: 1024px) {
  .custom-time-input {
    width: 160px;
    max-width: 160px;
    min-width: 160px;
  }
}

.custom-time-input.disabled {
  /* background-color: #f3f4f6; */
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}
.custom-time-input:disabled {
  /* background-color: #f3f4f6; */
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.custom-time-input.highlight-needed {
  animation: pulseHighlight 2s infinite;
  border-color: #f59e0b;
  /* box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2); */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px !important;
  background: #FFFFFF !important; /* White scrollbar track */
  border-radius: 10px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #000000 40%, #4A4A4A 100%) !important; /* Black to dark gray gradient */
  border-radius: 10px !important;
  min-height: 40px !important;
  border: 2px solid #FFFFFF !important; /* White border to match track */
  transition: background 0.2s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1A1A1A 40%, #333333 100%) !important; /* Darker black on hover */
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #000000 #FFFFFF; /* Black thumb, white track */
}

@keyframes pulseHighlight {
  0% {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  }
  25% {
    border-color: #fbbf24;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
  }
  50% {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  }
  75% {
    border-color: #fbbf24;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
  }
  100% {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  }
}
.dropdown {
  position: absolute;
  z-index: 50;
  background: #fff;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  max-height: 220px;
  overflow-y: auto;
  margin-top: 0.25rem;
}
.dark .dropdown {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #111;
  font-size: 0.75rem; /* text-xs */
  transition: background 0.15s, color 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .dropdown-item {
  color: #e5e7eb;
}
.dropdown-item.selected,
.dropdown-item:hover:not(.disabled) {
  background: #000;
  color: #fff;
}
.dark .dropdown-item.selected,
.dark .dropdown-item:hover:not(.disabled) {
  background: #00FE01;
  color: #000;
}
.dropdown-item.disabled {
  /* background-color: #f3f4f6; */
  color: #9ca3af;
  cursor: not-allowed;
}
.dark .dropdown-item.disabled {
  background-color: #374151;
  color: #6b7280;
}
</style>