<template>
  <div class="relative" ref="dropdownContainer">
    <label v-if="label" class="block text-sm font-medium text-gray-800 dark:text-white mb-3">{{ label }}</label>
    <div class="relative">
      <!-- Location Icon -->
      <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <!-- <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg> -->
      </div>
      <input 
        v-model="searchQuery"
        @focus="showDropdown = true"
        @blur="onBlur"
        type="text" 
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        class="input-field pl-10 text-gray-800 dark:text-white bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
        autocomplete="off"
      >
      <!-- Clear button -->
      <button 
        v-if="searchQuery"
        @click="clearSearch"
        :disabled="disabled"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Dropdown -->
    <div 
      v-if="showDropdown && !disabled && (filteredLocations.length > 0 || isLoading || locations.length === 0)"
  class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto custom-scrollbar min-w-[260px]"
    >
      <!-- Loading state -->
      <div v-if="isLoading" class="p-3 text-center text-sm text-gray-800 dark:text-white">
        <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 dark:border-gray-600"></div>
        <span class="ml-2">Loading locations...</span>
      </div>
      
      <!-- Location suggestions -->
      <div v-else>
        <button
          v-for="location in filteredLocations"
          :key="location.id"
          @mousedown="selectLocation(location)"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
        >
          <div class="flex items-center">
            <svg class="w-4 h-4 text-gray-800 dark:text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <div>
              <div class="font-medium text-xs text-gray-800 dark:text-white">{{ location.name }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-300">{{ location.description || location.address }}</div>
            </div>
          </div>
        </button>
        
        <!-- No search results -->
        <div v-if="filteredLocations.length === 0 && searchQuery" class="p-4 text-center text-sm text-gray-800 dark:text-white">
          <svg class="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>No locations found for "{{ searchQuery }}"</p>
          <p class="text-xs mt-1 text-gray-600 dark:text-gray-400">Try a different search term</p>
        </div>
        
        <!-- No locations available at all -->
        <div v-else-if="locations.length === 0 && !isLoading" class="p-4 text-center text-sm text-gray-800 dark:text-white">
          <svg class="w-8 h-8 text-amber-500 dark:text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>Location service is temporarily unavailable</p>
          <p class="text-xs mt-1 text-gray-600 dark:text-gray-400">Please try again later or type your location</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Location {
  id: number
  name: string
  description?: string
  city?: string
  state?: string
  country?: string
  address?: string
  url?: string
}

export default defineComponent({
  name: 'LocationDropdown',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter location'
    },
    locations: {
      type: Array as PropType<Location[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'change'],
  
  data() {
    return {
      searchQuery: this.modelValue || '',
      showDropdown: false,
      isLoading: false,
      selectedLocation: null as Location | null
    }
  },
  
  computed: {
    filteredLocations(): Location[] {
      // No fallback locations - rely on parent component to handle API failures
      if (!this.locations.length) {
        return [];
      }

      if (!this.searchQuery) {
        return this.locations.slice(0, 5) // Show top 5 locations
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.locations.filter((location: Location) => 
        location.name.toLowerCase().includes(query) ||
        (location.city && location.city.toLowerCase().includes(query)) ||
        (location.address && location.address.toLowerCase().includes(query)) ||
        (location.description && location.description.toLowerCase().includes(query))
      )
    }
  },
  
  watch: {
    modelValue: {
      handler(newValue) {
        if (typeof newValue === 'string') {
          this.searchQuery = newValue
        }
      },
      immediate: true
    }
  },
  
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  
  methods: {
    onInput(): void {
      if (this.disabled) return;
      this.$emit('update:modelValue', this.searchQuery)
      this.showDropdown = true
    },
    
    onBlur(): void {
      if (this.disabled) return;
      // Delay hiding dropdown to allow for click events
      setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    
    selectLocation(location: Location): void {
      if (this.disabled) return;
      this.searchQuery = location.name
      this.selectedLocation = location
      
      // Emit the name as a string for v-model compatibility
      this.$emit('update:modelValue', location.name)
      
      // Emit the full location object for the @change event
      this.$emit('change', location)
      
      this.showDropdown = false
    },
    
    clearSearch(): void {
      if (this.disabled) return;
      this.searchQuery = ''
      this.selectedLocation = null
      this.$emit('update:modelValue', '')
      this.$emit('change', null)
    },
    
    handleClickOutside(event: Event): void {
      const target = event.target as Element
      if (!this.$el.contains(target)) {
        this.showDropdown = false
      }
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  /* background: #FFFFFF; White background */
}

.input-field:focus {
  border-color: #D1D5DB; /* Lighter gray on focus */
  box-shadow: none
}

/* Custom scrollbar for dropdown */
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
</style>

