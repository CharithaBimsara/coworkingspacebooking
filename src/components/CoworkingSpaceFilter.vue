
<template>
  <div class="bg-white rounded-xl p-6 shadow-card sticky top-32">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
      <button @click="clearAllFilters" class="text-sm text-primary hover:text-primary/80">
        Clear All
      </button>
    </div>

    <!-- Date Range -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Date Range</h4>
      <DateRangePicker
        v-model="filters.dateRange"
        placeholder="Select dates"
        :min-date="today"
        @change="applyFilters"
      />
    </div>

    <!-- Location -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Location</h4>
      <input 
        v-model="filters.location" 
        type="text" 
        placeholder="Enter location"
        class="input-field"
        @input="applyFilters"
      >
    </div>

    <!-- Seat Count -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Seat Count</h4>
      <select v-model="filters.seatCount" class="input-field" @change="applyFilters">
        <option value="">Any size</option>
        <option value="1-5">1-5 seats</option>
        <option value="6-15">6-15 seats</option>
        <option value="16-30">16-30 seats</option>
        <option value="31+">31+ seats</option>
      </select>
    </div>

    <!-- Subscription Type -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Subscription Type</h4>
      <select v-model="filters.subscriptionType" class="input-field" @change="applyFilters">
        <option value="">All options</option>
        <option value="monthly">Monthly</option>
        <option value="annually">Annual</option>
      </select>
    </div>

    <!-- Rating -->
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Rating</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            v-model="filters.minRating" 
            value="4" 
            type="radio" 
            name="rating" 
            class="border-gray-300 text-primary focus:ring-primary"
            @change="applyFilters"
          >
          <span class="ml-2 text-gray-700 flex items-center">
            4+ stars
            <div class="flex ml-1 text-yellow-400">
              <svg v-for="star in 4" :key="star" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </span>
        </label>
        <label class="flex items-center">
          <input 
            v-model="filters.minRating" 
            value="0" 
            type="radio" 
            name="rating" 
            class="border-gray-300 text-primary focus:ring-primary"
            @change="applyFilters"
          >
          <span class="ml-2 text-gray-700">Any rating</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import DateRangePicker from './DateRangePicker.vue'

export default defineComponent({
  name: 'CoworkingSpaceFilter',
  
  components: {
    DateRangePicker
  },
  
  props: {
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['filters-changed'],
  
  setup(props, { emit }) {
    const filters = ref({
      dateRange: { startDate: null, endDate: null },
      location: '',
      seatCount: '',
      subscriptionType: '',
      minRating: '0'
    })

    const today = new Date().toISOString().split('T')[0]

    const applyFilters = () => {
      emit('filters-changed', filters.value)
    }

    const clearAllFilters = () => {
      filters.value = {
        dateRange: { startDate: null, endDate: null },
        location: '',
        seatCount: '',
        subscriptionType: '',
        minRating: '0'
      }
      applyFilters()
    }

    watch(() => props.initialFilters, (newFilters) => {
      filters.value = { ...filters.value, ...newFilters }
    }, { deep: true, immediate: true })

    return {
      filters,
      today,
      applyFilters,
      clearAllFilters
    }
  }
})
</script>
