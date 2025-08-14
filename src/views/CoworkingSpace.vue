<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto container-padding py-8">
        <div class="text-center">
          <h1 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Co-working Space
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Collaborative workspaces designed for teams and companies who need flexible office solutions
          </p>
        </div>
      </div>
    </div>

    <!-- Advanced Search -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-20">
      <div class="max-w-7xl mx-auto container-padding py-6">
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <div>
              <DateRangePicker
                v-model="searchFilters.dateRange"
                label="Date Range"
                placeholder="Select dates"
                :min-date="today"
                @change="onDateRangeChange"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                v-model="searchFilters.location" 
                type="text" 
                placeholder="Enter location"
                class="input-field"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Seat Count</label>
              <select v-model="searchFilters.seatCount" class="input-field">
                <option value="">Any size</option>
                <option value="1-5">1-5 seats</option>
                <option value="6-15">6-15 seats</option>
                <option value="16-30">16-30 seats</option>
                <option value="31+">31+ seats</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
              <select v-model="searchFilters.subscriptionType" class="input-field">
                <option value="">All options</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annual</option>
              </select>
            </div>
            <div class="flex justify-end mt-6 lg:justify-start space-x-3">
              <button @click="clearFilters" class="btn-secondary" :disabled="isSearching">Clear</button>
              <button @click="applyFilters" class="btn-primary" :disabled="isSearching">
                {{ isSearching ? 'Searching...' : 'Search' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto container-padding py-8">
      <!-- Results Summary -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ filteredSpaces.length }} Co-working Spaces Found
          </h2>
          <p class="text-gray-600">{{ getFilterSummary() }}</p>
        </div>
        <div class="flex items-center gap-4">
          <select v-model="sortBy" class="input-field text-sm py-2" @change="applySorting">
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="capacity">Largest Capacity</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading co-working spaces...</p>
      </div>

      <!-- Co-working Spaces Grid -->
      <div v-else-if="filteredSpaces.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="space in sortedSpaces" 
          :key="space.id"
          class="bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
          @click="viewSpace(space.id)"
        >
          <div class="relative">
            <img 
              :src="space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" 
              :alt="space.name"
              class="w-full h-48 object-cover rounded-t-xl"
            >
            <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
              {{ getMaxCapacity(space) }} seats
            </div>
            <div class="absolute top-3 left-3">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', space.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ space.isAvailable ? 'Available' : 'Full' }}
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ space.name }}</h3>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-1 text-sm text-gray-600">{{ space.rating }}</span>
              </div>
            </div>
            
            <div class="flex items-center text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {{ space.location }}
            </div>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="feature in space.features.slice(0, 3)" :key="feature" 
                class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {{ feature }}
              </span>
            </div>
            
            <!-- Pricing Packages -->
            <div class="space-y-3 mb-4">
              <div v-if="space.pricing?.monthly" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Monthly</span>
                <span class="font-semibold text-gray-900">${{ space.pricing.monthly }}/month</span>
              </div>
              <div v-if="space.pricing?.annual" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Annual</span>
                <span class="font-semibold text-gray-900">${{ space.pricing.annual }}/year</span>
              </div>
              <div v-if="space.pricing?.monthly && space.pricing?.annual" class="text-xs text-green-600 font-medium">
                Save ${{ getSavings(space) }} with annual plan
              </div>
            </div>
            
            <button class="w-full btn-primary text-sm py-2">
              View Details & Subscribe
            </button>
          </div>
        </div>
      </div>

      <!-- No Results - Show Suggestions -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No co-working spaces found</h3>
        <p class="text-gray-600 mb-8">Try adjusting your search criteria or check out these related options</p>
        
        <!-- Suggested Alternatives -->
        <div v-if="suggestedSpaces.length > 0" class="max-w-4xl mx-auto">
          <h4 class="text-lg font-semibold text-gray-900 mb-6">
            {{ searchFilters.location ? `Co-working Spaces in Other Locations` : 'Suggested Co-working Spaces' }}
          </h4>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="space in suggestedSpaces" 
              :key="space.id"
              class="bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
              @click="viewSpace(space.id)"
            >
              <div class="relative">
                <img 
                  :src="space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'"
                  :alt="space.name"
                  class="w-full h-32 object-cover rounded-t-xl"
                >
                <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
                  {{ getMaxCapacity(space) }} seats
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ space.name }}</h3>
                <div class="flex items-center text-gray-600 mb-2">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ space.location }}
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm">
                    <div v-if="space.pricing?.monthly" class="font-semibold text-gray-900">${{ space.pricing.monthly }}/month</div>
                    <div v-if="space.pricing?.annual" class="text-gray-600">${{ space.pricing.annual }}/year</div>
                  </div>
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', space.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                    {{ space.isAvailable ? 'Available' : 'Check Availability' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import { SpacesAPI } from '../api'
import { SearchSpacesRequestDto } from '../dto/request'
import type { SpaceDto } from '../dto/response'

interface DateRange {
  startDate: string | null
  endDate: string | null
}

interface SearchFilters {
  dateRange: DateRange
  location: string
  seatCount: string
  subscriptionType: string
}

export default defineComponent({
  name: 'CoworkingSpace',
  
  components: {
    DateRangePicker
  },
  
  data() {
    return {
      // Search filters
      searchFilters: {
        dateRange: {
          startDate: null,
          endDate: null
        },
        location: (this.$route.query.location as string) || '',
        seatCount: '',
        subscriptionType: ''
      } as SearchFilters,
      
      sortBy: 'price-low',
      
      // Loading states
      isLoading: false,
      isSearching: false,
      
      // Data from API
      allSpaces: [] as SpaceDto[],
      suggestedSpaces: [] as SpaceDto[],
      
      // Filtered and sorted data
      filteredSpaces: [] as SpaceDto[],
      sortedSpaces: [] as SpaceDto[]
    }
  },
  
  computed: {
    today(): string {
      return new Date().toISOString().split('T')[0]
    }
  },
  
  async mounted() {
    await this.loadCoworkingSpaces()
    this.applyFiltersAndSorting()
  },
  
  methods: {
    async loadCoworkingSpaces(): Promise<void> {
      try {
        this.isLoading = true
        
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'coworking-space',
          location: this.searchFilters.location || undefined
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        
        if (response.success) {
          this.allSpaces = response.spaces || []
          
          // Load suggested spaces if no results
          if (this.allSpaces.length === 0) {
            await this.loadSuggestedSpaces()
          }
        } else {
          console.error('Failed to load co-working spaces:', response.message)
          await this.loadSuggestedSpaces()
        }
      } catch (error) {
        console.error('Error loading co-working spaces:', error)
        await this.loadSuggestedSpaces()
      } finally {
        this.isLoading = false
      }
    },
    
    async loadSuggestedSpaces(): Promise<void> {
      try {
        // First try to get co-working spaces from different locations
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'coworking-space'
          // Don't filter by location to get spaces from other areas
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        if (response.success && response.spaces && response.spaces.length > 0) {
          // Filter out spaces from the same location if user searched for a specific location
          let availableSpaces = response.spaces
          if (this.searchFilters.location) {
            availableSpaces = response.spaces.filter(space =>
              !space.location.toLowerCase().includes(this.searchFilters.location.toLowerCase())
            )
          }
          this.suggestedSpaces = availableSpaces.slice(0, 3)
        } else {
          // Fallback to featured spaces
          const featuredResponse = await SpacesAPI.getFeaturedSpaces()
          if (featuredResponse.success) {
            this.suggestedSpaces = (featuredResponse.spaces || [])
              .filter(space => space.productType === 'coworking-space')
              .slice(0, 3)
          }
        }
      } catch (error) {
        console.error('Error loading suggested spaces:', error)
      }
    },
    
    async applyFilters(): Promise<void> {
      try {
        this.isSearching = true
        
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'coworking-space',
          location: this.searchFilters.location || undefined
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        
        if (response.success) {
          this.allSpaces = response.spaces || []
          this.applyFiltersAndSorting()
        }
      } catch (error) {
        console.error('Error applying filters:', error)
      } finally {
        this.isSearching = false
      }
    },
    
    applyFiltersAndSorting(): void {
      // Apply local filters
      this.filteredSpaces = this.allSpaces.filter(space => {
        // Location filter (additional local filtering)
        if (this.searchFilters.location && 
            !space.location.toLowerCase().includes(this.searchFilters.location.toLowerCase())) {
          return false
        }
        
        // Seat count filter
        if (this.searchFilters.seatCount) {
          const [min, max] = this.getSeatRange(this.searchFilters.seatCount)
          const maxCapacity = this.getMaxCapacity(space)
          if (maxCapacity < min || (max && maxCapacity > max)) {
            return false
          }
        }
        
        return true
      })
      
      this.applySorting()
    },
    
    applySorting(): void {
      const spaces = [...this.filteredSpaces]
      
      switch (this.sortBy) {
        case 'price-low':
          this.sortedSpaces = spaces.sort((a, b) => this.getMonthlyPrice(a) - this.getMonthlyPrice(b))
          break
        case 'price-high':
          this.sortedSpaces = spaces.sort((a, b) => this.getMonthlyPrice(b) - this.getMonthlyPrice(a))
          break
        case 'capacity':
          this.sortedSpaces = spaces.sort((a, b) => this.getMaxCapacity(b) - this.getMaxCapacity(a))
          break
        case 'rating':
          this.sortedSpaces = spaces.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        default:
          this.sortedSpaces = spaces
      }
    },
    
    getSeatRange(range: string): [number, number | null] {
      switch (range) {
        case '1-5':
          return [1, 5]
        case '6-15':
          return [6, 15]
        case '16-30':
          return [16, 30]
        case '31+':
          return [31, null]
        default:
          return [0, null]
      }
    },
    
    getFilterSummary(): string {
      const parts: string[] = []
      if (this.searchFilters.location) parts.push(`in ${this.searchFilters.location}`)
      if (this.searchFilters.dateRange.startDate && this.searchFilters.dateRange.endDate) {
        const startDate = new Date(this.searchFilters.dateRange.startDate).toLocaleDateString()
        const endDate = new Date(this.searchFilters.dateRange.endDate).toLocaleDateString()
        parts.push(`${startDate} - ${endDate}`)
      }
      if (this.searchFilters.seatCount) parts.push(`for ${this.searchFilters.seatCount} seats`)
      if (this.searchFilters.subscriptionType) parts.push(`${this.searchFilters.subscriptionType} subscription`)
      
      return parts.length > 0 ? parts.join(', ') : 'All available co-working spaces'
    },
    
    clearFilters(): void {
      this.searchFilters = {
        dateRange: {
          startDate: null,
          endDate: null
        },
        location: '',
        seatCount: '',
        subscriptionType: ''
      }
      this.applyFiltersAndSorting()
    },

    onDateRangeChange(dateRange: DateRange): void {
      this.searchFilters.dateRange = dateRange
      this.applyFiltersAndSorting()
    },
    
    getMonthlyPrice(space: SpaceDto): number {
      return space.pricing?.monthly || 0
    },
    
    getMaxCapacity(space: SpaceDto): number {
      return space.maxCapacity || space.capacity || 0
    },
    
    getSavings(space: SpaceDto): number {
      if (space.pricing?.monthly && space.pricing?.annual) {
        return (space.pricing.monthly * 12) - space.pricing.annual
      }
      return 0
    },
    
    async viewSpace(id: number): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() },
          query: { type: 'coworking-space' }
        })
      } catch (error) {
        console.error('Error navigating to space details:', error)
      }
    }
  },
  
  watch: {
    sortBy() {
      this.applySorting()
    },
    
    'searchFilters.location'() {
      this.applyFiltersAndSorting()
    },
    
    'searchFilters.seatCount'() {
      this.applyFiltersAndSorting()
    },
    
    'searchFilters.subscriptionType'() {
      this.applyFiltersAndSorting()
    }
  }
})
</script>
