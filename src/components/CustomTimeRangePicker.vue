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
          <div v-for="time in timeOptions" :key="time" @mousedown.prevent="selectTime('start', time)" :class="['dropdown-item', { selected: startTime === time }]">
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
          <div v-for="time in timeOptions" :key="time" @mousedown.prevent="selectTime('end', time)" :class="['dropdown-item', { selected: endTime === time }]">
            {{ time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'CustomTimeRangePicker',
  props: {
    modelValue: {
      type: Object as () => { start: string|null, end: string|null },
      default: () => ({ start: null, end: null })
    },
    label: {
      type: String,
      default: ''
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
    const startTime = ref(props.modelValue.start)
    const endTime = ref(props.modelValue.end)

    const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
      const hour = Math.floor(i / 2)
      const min = i % 2 === 0 ? '00' : '30'
      return `${hour.toString().padStart(2, '0')}:${min}`
    })

    const startTimeDisplay = computed(() => startTime.value || '')
    const endTimeDisplay = computed(() => endTime.value || '')

    watch(() => props.modelValue, (val) => {
      startTime.value = val.start
      endTime.value = val.end
    })

    function selectTime(type: 'start' | 'end', time: string) {
      if (type === 'start') {
        startTime.value = time
        showStartDropdown.value = false
      } else {
        endTime.value = time
        showEndDropdown.value = false
      }
      emit('update:modelValue', { start: startTime.value, end: endTime.value })
    }

    function onBlur(type: 'start' | 'end') {
      setTimeout(() => {
        if (type === 'start') showStartDropdown.value = false
        else showEndDropdown.value = false
      }, 100)
    }

    return {
      showStartDropdown,
      showEndDropdown,
      startTime,
      endTime,
      timeOptions,
      selectTime,
      startTimeDisplay,
      endTimeDisplay,
      onBlur,
      openDropdown
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
.dropdown-item:hover {
  background: #000;
  color: #fff;
}
</style>
