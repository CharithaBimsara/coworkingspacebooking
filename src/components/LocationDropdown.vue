<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-3">{{ label }}</label>
    <div class="relative">
      <input 
        v-model="searchQuery"
        @input="onInput"
        @focus="showDropdown = true"
        @blur="onBlur"
        type="text" 
        :placeholder="placeholder"
        class="input-field pl-10"
        autocomplete="off"
      >
      <!-- <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg> -->
      
      <!-- Clear button -->
      <button 
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Dropdown -->
    <div 
      v-if="showDropdown && (filteredLocations.length > 0 || isLoading)"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar min-w-[260px]"
    >
      <!-- Loading state -->
      <div v-if="isLoading" class="p-3 text-center text-gray-500">
        <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span class="ml-2">Loading locations...</span>
      </div>
      
      <!-- Location suggestions -->
      <div v-else>
        <button
          v-for="location in filteredLocations"
          :key="location.id"
          @mousedown="selectLocation(location)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          <div class="flex items-center">
            <svg class="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <div>
              <div class="font-medium text-gray-900">{{ location.name }}</div>
              <div class="text-sm text-gray-500">{{ location.description }}</div>
            </div>
          </div>
        </button>
        
        <!-- No results -->
        <div v-if="filteredLocations.length === 0 && searchQuery" class="p-4 text-center text-gray-500">
          <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>No locations found for "{{ searchQuery }}"</p>
          <p class="text-xs mt-1">Try a different search term</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Location {
  id: number
  name: string
  description: string
  city: string
  state: string
  country: string
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
    }
  },
  
  emits: ['update:modelValue', 'change'],
  
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      isLoading: false,
      locations: [
        {
          id: 1,
          name: 'Downtown, San Francisco',
          description: 'Financial District, CA',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 2,
          name: 'Mission Bay, San Francisco',
          description: 'Tech Hub, CA',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 3,
          name: 'SOMA, San Francisco',
          description: 'South of Market, CA',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 4,
          name: 'Financial District, San Francisco',
          description: 'Business Center, CA',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 5,
          name: 'Union Square, San Francisco',
          description: 'Shopping District, CA',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 6,
          name: 'Palo Alto, California',
          description: 'Silicon Valley, CA',
          city: 'Palo Alto',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 7,
          name: 'Mountain View, California',
          description: 'Tech Center, CA',
          city: 'Mountain View',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 8,
          name: 'Redwood City, California',
          description: 'Peninsula, CA',
          city: 'Redwood City',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 9,
          name: 'San Jose, California',
          description: 'Capital of Silicon Valley, CA',
          city: 'San Jose',
          state: 'CA',
          country: 'USA'
        },
        {
          id: 10,
          name: 'Oakland, California',
          description: 'East Bay, CA',
          city: 'Oakland',
          state: 'CA',
          country: 'USA'
        }
      ] as Location[]
    }
  },
  
  computed: {
    filteredLocations(): Location[] {
      if (!this.searchQuery) {
        return this.locations.slice(0, 5) // Show top 5 popular locations
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.locations.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query)
      )
    }
  },
  
  watch: {
    modelValue: {
      handler(newValue) {
        this.searchQuery = newValue
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
      this.$emit('update:modelValue', this.searchQuery)
      this.showDropdown = true
    },
    
    onBlur(): void {
      // Delay hiding dropdown to allow for click events
      setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    
    selectLocation(location: Location): void {
      this.searchQuery = location.name
      this.$emit('update:modelValue', location.name)
      this.$emit('change', location)
      this.showDropdown = false
    },
    
    clearSearch(): void {
      this.searchQuery = ''
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

/* Custom scrollbar for dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px !important;
  background: #f3f4f6 !important;
  border-radius: 10px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1 40%, #a5b4fc 100%) !important;
  border-radius: 10px !important;
  min-height: 40px !important;
  border: 2px solid #f3f4f6 !important;
  transition: background 0.2s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #4338ca 40%, #818cf8 100%) !important;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #f3f4f6;
}