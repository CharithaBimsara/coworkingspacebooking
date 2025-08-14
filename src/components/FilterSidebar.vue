
<template>
  <div class="bg-white rounded-xl p-6 shadow-card sticky top-32">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
      <button @click="clearAllFilters" class="text-sm text-primary hover:text-primary/80">
        Clear All
      </button>
    </div>

    <!-- Price Range -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Price Range (per day)</h4>
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>${{ priceRange.min }}</span>
          <span>${{ priceRange.max }}</span>
        </div>
        <div class="space-y-2">
          <input 
            v-model="priceRange.min" 
            type="range" 
            min="10" 
            max="100" 
            class="w-full accent-primary"
            @input="applyFilters"
          >
          <input 
            v-model="priceRange.max" 
            type="range" 
            min="10" 
            max="100" 
            class="w-full accent-primary"
            @input="applyFilters"
          >
        </div>
      </div>
    </div>

    <!-- Space Type -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Space Type</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            v-model="selectedSpaceTypes" 
            value="meeting-room" 
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
            @change="applyFilters"
          >
          <span class="ml-2 text-gray-700">Meeting Room</span>
        </label>
        <label class="flex items-center">
          <input 
            v-model="selectedSpaceTypes" 
            value="hot-desk" 
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
            @change="applyFilters"
          >
          <span class="ml-2 text-gray-700">Hot Desk</span>
        </label>
        <label class="flex items-center">
          <input 
            v-model="selectedSpaceTypes" 
            value="coworking-space" 
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
            @change="applyFilters"
          >
          <span class="ml-2 text-gray-700">Co-working Space</span>
        </label>
      </div>
    </div>

    <!-- Rating -->
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Rating</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            v-model="minRating" 
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
            v-model="minRating" 
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

export default defineComponent({
  name: 'FilterSidebar',
  
  props: {
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['filters-changed'],
  
  setup(props, { emit }) {
    const priceRange = ref({ min: 10, max: 100 })
    const selectedSpaceTypes = ref<string[]>([])
    const minRating = ref('0')

    const applyFilters = () => {
      emit('filters-changed', {
        priceRange: priceRange.value,
        selectedSpaceTypes: selectedSpaceTypes.value,
        minRating: minRating.value
      })
    }

    const clearAllFilters = () => {
      priceRange.value = { min: 10, max: 100 }
      selectedSpaceTypes.value = []
      minRating.value = '0'
      applyFilters()
    }

    watch(() => props.initialFilters, (newFilters) => {
      if (newFilters.priceRange) {
        priceRange.value = { ...newFilters.priceRange }
      }
      if (newFilters.selectedSpaceTypes) {
        selectedSpaceTypes.value = [...newFilters.selectedSpaceTypes]
      }
      if (newFilters.minRating) {
        minRating.value = newFilters.minRating
      }
    }, { deep: true, immediate: true })

    return {
      priceRange,
      selectedSpaceTypes,
      minRating,
      applyFilters,
      clearAllFilters
    }
  }
})
</script>
