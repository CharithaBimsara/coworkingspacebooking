<template>
  <div class="custom-time-range-picker">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="flex items-center gap-2">
      <div class="relative">
        <input
          type="text"
          v-model="startTimeDisplay"
          @focus="openDropdown('start')"
          @blur="onBlur('start')"
          readonly
          class="custom-time-input"
          placeholder="Start time"
        />
        <div v-if="showStartDropdown" class="dropdown absolute left-0 mt-1">
          <div 
            v-for="time in timeOptions" 
            :key="time" 
            @mousedown.prevent="selectTime('start', time)" 
            :class="['dropdown-item', { selected: startTime === time, disabled: isStartTimeDisabled(time) }]"
          >
            {{ time }}
          </div>
        </div>
      </div>
      <span class="mx-1">-</span>
      <div class="relative">
        <input
          type="text"
          v-model="endTimeDisplay"
          @focus="openDropdown('end')"
          @blur="onBlur('end')"
          readonly
          class="custom-time-input"
          placeholder="End time"
        />
        <div v-if="showEndDropdown" class="dropdown absolute left-0 mt-1">
          <div 
            v-for="time in timeOptions" 
            :key="time" 
            @mousedown.prevent="selectTime('end', time)" 
            :class="['dropdown-item', { selected: endTime === time, disabled: isEndTimeDisabled(time) }]"
          >
            {{ time }}
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
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showStartDropdown = ref(false)
    const showEndDropdown = ref(false)

    function openDropdown(type: 'start' | 'end') {
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

    const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
      const hour = Math.floor(i / 2)
      const min = i % 2 === 0 ? '00' : '30'
      return `${hour.toString().padStart(2, '0')}:${min}`
    })

    const startTimeDisplay = computed(() => localStartTime.value || '')
    const endTimeDisplay = computed(() => localEndTime.value || '')

    function selectTime(type: 'start' | 'end', time: string) {
      if (type === 'start') {
        if (isStartTimeDisabled(time)) return;
        localStartTime.value = time
        showStartDropdown.value = false
        emit('update:modelValue', { start: time, end: localEndTime.value })
      } else {
        if (isEndTimeDisabled(time)) return;
        localEndTime.value = time
        showEndDropdown.value = false
        emit('update:modelValue', { start: localStartTime.value, end: time })
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
      isEndTimeDisabled
    }
  }
})
</script>

<style scoped>
.custom-time-range-picker {
  position: relative;
  width: 100%;
}
.custom-time-input {
  width: 120px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  outline: none;
  font-size: 0.75rem; /* text-xs */
  color: #111;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.custom-time-input:focus {
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
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
.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #111;
  font-size: 0.75rem; /* text-xs */
  transition: background 0.15s, color 0.15s;
}
.dropdown-item.selected,
.dropdown-item:hover:not(.disabled) {
  background: #000;
  color: #fff;
}
.dropdown-item.disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>