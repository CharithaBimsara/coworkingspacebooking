<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto container-padding py-8">
        <div class="text-center">
          <h1 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Meeting Rooms
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional meeting spaces equipped with latest technology for productive discussions
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-auto mx-auto container-padding py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <MeetingRoomFilter 
            :initial-filters="searchFilters"
            @filters-changed="onFiltersChanged"
          />
        </div>

        <!-- Results Area -->
        <div class="lg:col-span-3">
          <!-- Results Summary -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ filteredRooms.length }} Meeting Rooms Found
              </h2>
              <p class="text-gray-600">{{ getFilterSummary() }}</p>
            </div>
            <div class="flex items-center gap-4">
              <select v-model="sortBy" class="input-field text-sm py-2" @change="applySorting">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity">Capacity</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="mt-4 text-gray-600">Loading meeting rooms...</p>
          </div>

          <!-- Meeting Rooms Grid -->
          <div v-else-if="filteredRooms.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="room in sortedRooms" 
              :key="room.id"
              class="bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
              @click="viewRoom(room.id)"
            >
              <div class="relative">
                <img 
                  :src="room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" 
                  :alt="room.name"
                  class="w-full h-48 object-cover rounded-t-xl"
                >
                <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
                  {{ room.capacity }} seats
                </div>
                <div class="absolute top-3 left-3">
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ room.isAvailable ? 'Available' : 'Booked' }}
                  </span>
                </div>
              </div>
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ room.name }}</h3>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-sm text-gray-600">{{ room.rating }}</span>
                  </div>
                </div>
                
                <div class="flex items-center text-gray-600 mb-3">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ room.location }}
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="feature in room.features.slice(0, 3)" :key="feature" 
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {{ feature }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xl font-bold text-gray-900">
                      ${{ getHourlyRate(room) }}/hour
                    </div>
                    <div class="text-sm text-gray-600">Minimum 1 hour</div>
                  </div>
                  <button class="btn-primary text-sm px-4 py-2">
                    View Details
                  </button>
                </div>
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
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No meeting rooms found</h3>
            <p class="text-gray-600 mb-8">Try adjusting your search criteria or check out these related options</p>
            
            <!-- Suggested Alternatives -->
            <div v-if="suggestedRooms.length > 0" class="max-w-4xl mx-auto">
              <h4 class="text-lg font-semibold text-gray-900 mb-6">
                {{ searchFilters.location ? `Meeting Rooms in Other Locations` : 'Suggested Meeting Rooms' }}
              </h4>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  v-for="room in suggestedRooms" 
                  :key="room.id"
                  class="bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
                  @click="viewRoom(room.id)"
                >
                  <div class="relative">
                    <img 
                      :src="room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'"
                      :alt="room.name"
                      class="w-full h-32 object-cover rounded-t-xl"
                    >
                    <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
                      {{ room.capacity }} seats
                    </div>
                  </div>
                  
                  <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ room.name }}</h3>
                    <div class="flex items-center text-gray-600 mb-2">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ room.location }}
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="text-lg font-bold text-gray-900">
                        ${{ getHourlyRate(room) }}/hour
                      </div>
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                        {{ room.isAvailable ? 'Available' : 'Check Availability' }}
                      </span>
                    </div>
                  </div>
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
import MeetingRoomFilter from '../components/MeetingRoomFilter.vue'
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
  time: string
  seating: string
  minRating: string
}

export default defineComponent({
  name: 'MeetingRooms',
  
  components: {
    MeetingRoomFilter
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
        time: '',
        seating: '',
        minRating: '0'
      } as SearchFilters,
      
      sortBy: 'price-low',
      
      // Loading states
      isLoading: false,
      isSearching: false,
      
      // Data from API
      allRooms: [] as SpaceDto[],
      suggestedRooms: [] as SpaceDto[],
      
      // Filtered and sorted data
      filteredRooms: [] as SpaceDto[],
      sortedRooms: [] as SpaceDto[]
    }
  },
  
  computed: {
    today(): string {
      return new Date().toISOString().split('T')[0]
    }
  },
  
  async mounted() {
    await this.loadMeetingRooms()
    this.applyFiltersAndSorting()
  },
  
  methods: {
    onFiltersChanged(newFilters: SearchFilters): void {
      this.searchFilters = { ...this.searchFilters, ...newFilters }
      this.applyFiltersAndSorting()
    },
    async loadMeetingRooms(): Promise<void> {
      try {
        this.isLoading = true
        
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'meeting-room',
          location: this.searchFilters.location || undefined
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        
        if (response.success) {
          this.allRooms = response.spaces || []
          
          // Load suggested rooms if no results
          if (this.allRooms.length === 0) {
            await this.loadSuggestedRooms()
          }
        } else {
          console.error('Failed to load meeting rooms:', response.message)
          await this.loadSuggestedRooms()
        }
      } catch (error) {
        console.error('Error loading meeting rooms:', error)
        await this.loadSuggestedRooms()
      } finally {
        this.isLoading = false
      }
    },
    
    async loadSuggestedRooms(): Promise<void> {
      try {
        // First try to get meeting rooms from different locations
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'meeting-room'
          // Don't filter by location to get rooms from other areas
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        if (response.success && response.spaces && response.spaces.length > 0) {
          // Filter out rooms from the same location if user searched for a specific location
          let availableRooms = response.spaces
          if (this.searchFilters.location) {
            availableRooms = response.spaces.filter(space =>
              !space.location.toLowerCase().includes(this.searchFilters.location.toLowerCase())
            )
          }
          this.suggestedRooms = availableRooms.slice(0, 3)
        } else {
          // Fallback to featured spaces
          const featuredResponse = await SpacesAPI.getFeaturedSpaces()
          if (featuredResponse.success) {
            this.suggestedRooms = (featuredResponse.spaces || [])
              .filter(space => space.productType === 'meeting-room')
              .slice(0, 3)
          }
        }
      } catch (error) {
        console.error('Error loading suggested rooms:', error)
      }
    },
    
    async applyFilters(): Promise<void> {
      try {
        this.isSearching = true
        
        const searchRequest = new SearchSpacesRequestDto({
          spaceType: 'meeting-room',
          location: this.searchFilters.location || undefined
        })
        
        const response = await SpacesAPI.searchSpaces(searchRequest)
        
        if (response.success) {
          this.allRooms = response.spaces || []
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
      this.filteredRooms = this.allRooms.filter(room => {
        // Location filter (additional local filtering)
        if (this.searchFilters.location && 
            !room.location.toLowerCase().includes(this.searchFilters.location.toLowerCase())) {
          return false
        }
        
        // Seating filter
        if (this.searchFilters.seating) {
          const [min, max] = this.getSeatingRange(this.searchFilters.seating)
          const capacity = room.capacity || 0
          if (capacity < min || (max && capacity > max)) {
            return false
          }
        }

        // Time filter
        if (this.searchFilters.time) {
          // Assuming room.availableTimes is an array of strings like 'morning', 'afternoon', 'evening'
          // Or you might need to parse room.availableTimes based on your actual data structure
          // For now, a simple check:
          // if (!room.availableTimes || !room.availableTimes.includes(this.searchFilters.time)) {
          //   return false;
          // }
        }

        // Date Range filter
        if (this.searchFilters.dateRange.startDate && this.searchFilters.dateRange.endDate) {
          // This would require more complex logic to check room availability based on date ranges
          // For now, assuming all rooms are available for any date range if not specified otherwise
        }

        // Rating filter
        if (this.searchFilters.minRating !== '0' && room.rating < parseFloat(this.searchFilters.minRating)) {
          return false
        }
        
        return true
      })
      
      this.applySorting()
    },
    
    applySorting(): void {
      const rooms = [...this.filteredRooms]
      
      switch (this.sortBy) {
        case 'price-low':
          this.sortedRooms = rooms.sort((a, b) => this.getHourlyRate(a) - this.getHourlyRate(b))
          break
        case 'price-high':
          this.sortedRooms = rooms.sort((a, b) => this.getHourlyRate(b) - this.getHourlyRate(a))
          break
        case 'capacity':
          this.sortedRooms = rooms.sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
          break
        case 'rating':
          this.sortedRooms = rooms.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        default:
          this.sortedRooms = rooms
      }
    },
    
    getSeatingRange(range: string): [number, number | null] {
      switch (range) {
        case '2-4':
          return [2, 4]
        case '5-8':
          return [5, 8]
        case '9-15':
          return [9, 15]
        case '16+':
          return [16, null]
        default:
          return [0, null]
      }
    },
    
    getFilterSummary(): string {
      const parts: string[] = []
      if (this.searchFilters.location) parts.push(`in ${this.searchFilters.location}`)
      
      if (this.searchFilters.dateRange.startDate && this.searchFilters.dateRange.endDate) {
        const start = new Date(this.searchFilters.dateRange.startDate)
        const end = new Date(this.searchFilters.dateRange.endDate)
        const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
        parts.push(`from ${start.toLocaleDateString('en-US', formatOptions)} to ${end.toLocaleDateString('en-US', formatOptions)}`)
      }
      
      if (this.searchFilters.time) parts.push(`during ${this.searchFilters.time}`)
      if (this.searchFilters.seating) parts.push(`for ${this.searchFilters.seating} people`)
      if (this.searchFilters.minRating !== '0') parts.push(`${this.searchFilters.minRating}+ stars`)
      
      return parts.length > 0 ? parts.join(', ') : 'All available meeting rooms'
    },
    
    clearFilters(): void {
      this.searchFilters = {
        dateRange: {
          startDate: null,
          endDate: null
        },
        location: '',
        time: '',
        seating: '',
        minRating: '0'
      }
      this.applyFiltersAndSorting()
    },
    
    getHourlyRate(room: SpaceDto): number {
      return room.pricing?.hourly || 0
    },
    
    async viewRoom(id: number): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() },
          query: { type: 'meeting-room' }
        })
      } catch (error) {
        console.error('Error navigating to room details:', error)
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
    
    'searchFilters.seating'() {
      this.applyFiltersAndSorting()
    },
    
    'searchFilters.time'() {
      this.applyFiltersAndSorting()
    },
    
    'searchFilters.dateRange'() {
      this.applyFiltersAndSorting()
    },

    'searchFilters.minRating'() {
      this.applyFiltersAndSorting()
    }
  }
})
</script>
