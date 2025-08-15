<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Advanced Search Bar -->
    <div class="bg-white border-b mr-5 ml-5 rounded-lg border-gray-200 sticky top-16 mt-5 z-40">
      <div class="max-w-8xl mx-10 px-5 py-5">
  <div class="flex flex-wrap items-end justify-start gap-4 w-full relative">
          <div class="flex-grow relative">
            <label class="block text-sm font-medium text-gray-700 mb-2 text-sm">Space Type</label>
            <select v-model="editSearchForm.spaceType" class="input-field text-sm py-2 px-3 w-full">
              <option value="">Space Type</option>
              <option value="meeting-room">Meeting Room</option>
              <option value="hot-desk">Hot Desk</option>
              <option value="coworking-space">Co-working Space</option>
            </select>
          </div>

          <div class="flex-grow">
            <label class="block text-sm font-medium text-gray-700 mb-2 text-sm">Date</label>
            <SingleDatePicker :modelValue="editSearchForm.date === null ? undefined : editSearchForm.date" @update:modelValue="editSearchForm.date = $event" placeholder="Date" class="text-sm py-0 w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700  mb-2">Time Range</label>
            <div class="min-w-[260px]">
              <CustomTimeRangePicker v-model="editSearchForm.timeRange" label="" />
            </div>
          </div>

          <div class="flex-none mr-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
            <input v-model.number="editSearchForm.capacity" type="number" min="1" placeholder="Capacity"
              class="input-field text-xs py-2.5 px-3 w-full">
          </div>

          <div class="flex-shrink-0 pt-5 relative">
            <button @click="updateSearch" class="btn-primary py-3 px-4 text-sm w-40" :disabled="isSearching">
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  <div class="max-w-8xl mx-auto px-2 sm:px-5 py-6">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-2 relative">
        <!-- Filters Sidebar - Narrower -->
  <div class="md:col-span-1 w-full mb-4 md:mb-0 md:ml-14 ml-0 md:max-w-xs md:min-w-[210px]">
          <div class="bg-white rounded-lg p-3 shadow-card sticky top-60 z-30 text-[1.08rem] md:text-base" style="font-size: 1.08rem;">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
              <button @click="clearAllFilters" class="text-sm text-secondary-500 ">
                Clear All
              </button>
            </div>

            <!-- Location Filter -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-base mb-2">Location</h4>
              <input v-model="filters.location" type="text" placeholder="Enter location" class="input-field w-full text-base py-1.5 px-2"
                @input="applyFilters">
            </div>

            <!-- Price Range -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-base mb-2">Price Range (per day)</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>${{ priceRange.min }}</span>
                  <span>${{ priceRange.max }}</span>
                </div>
                <DualRangeSlider v-model:min="priceRange.min" v-model:max="priceRange.max" :minVal="10" :maxVal="1000"
                  @change="applyFilters" class="w-full" />
              </div>
            </div>

            <!-- Facilities -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-base mb-2">Facilities</h4>
              <div class="space-y-1.5">
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="High-Speed WiFi" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-sm">High-Speed WiFi</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="4K Display" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-sm">4K Display</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="Video Conferencing" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-sm">Video Conferencing</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="Natural Light" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-sm">Natural Light</span>
                </label>
              </div>
            </div>

            <!-- Rating -->
            <div>
              <h4 class="font-medium text-gray-900 text-base mb-2">Rating</h4>
              <div class="space-y-1.5">
                <label class="flex items-center">
                  <input v-model="minRating" value="4" type="radio" name="rating"
                    class="border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 flex items-center text-sm">
                    4+ stars
                    <div class="flex ml-1 text-yellow-400">
                      <svg v-for="star in 4" :key="star" class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </span>
                </label>
                <label class="flex items-center">
                  <input v-model="minRating" value="0" type="radio" name="rating"
                    class="border-gray-300 text-primary focus:ring-primary text-xs" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-sm">Any rating</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Area -->
  <div class="md:col-span-3 relative md:mr-14 mr-0">
          <!-- Title and Sort -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ searchResultTitle }}</h2>
              <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                <span v-for="filter in activeFilters" :key="filter"
                  class="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                  {{ filter }}
                  <button @click="removeFilter(filter)" class="ml-1 text-gray-600 hover:text-gray-900 text-xs">
                    &times;
                  </button>
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-xs text-gray-600">Sort by:</label>
              <select v-model="sortBy" class="input-field text-xs py-1.5 px-2" @change="applySorting">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p class="mt-3 text-gray-600 text-sm">Searching spaces...</p>
          </div>

          <!-- Space Cards Grid - 3 per row -->
          <div v-else-if="filteredSpaces.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="space in sortedSpaces" :key="space.id"
              class="card overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200"
              @click="viewSpace(space.id, space.productType)">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img :src="getSpaceImage(space)" :alt="space.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <button @click.stop="toggleFavorite(space.id)"
                  :class="['absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors', isFavorite(space.id) ? 'text-red-500' : 'text-gray-400']">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                <div class="absolute bottom-2 left-2">
                  <span class="bg-white/90 text-gray-900 px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatSpaceType(space.productType) }}
                  </span>
                </div>
              </div>

              <div class="p-3">
                <div class="flex items-start justify-between mb-1.5">
                  <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {{ space.name }}
                  </h3>
                  <div class="text-xl font-bold text-gray-900">
                    ${{ getStartingPrice(space) }}
                    <span class="text-lg font-normal text-gray-600">/{{ getPriceUnit(space.productType) }}</span>
                  </div>
                </div>

                <div class="flex items-center text-gray-600 text-sm mb-2">
                  <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ space.location }}
                </div>

                <!-- <div class="flex items-center mb-3">
                  <div class="flex text-yellow-400">
                    <svg v-for="star in 5" :key="star"
                      :class="['w-3.5 h-3.5', star <= space.rating ? 'fill-current' : 'stroke-current fill-none']"
                      viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-1.5 text-xs text-gray-600">{{ space.rating }} ({{ space.reviews }} reviews)</span>
                </div> -->

                <div class="border-t border-gray-200 mt-3 pt-3">
                  <!-- <h4 class="text-xs font-medium text-gray-900 mb-1.5">Facilities</h4> -->
                  <div class="flex flex-wrap gap-1">
                    <span v-for="feature in space.features.slice(0, 2)" :key="feature"
                      class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                      {{ feature }}
                    </span>
                    <span v-if="space.features.length > 2"
                      class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                      +{{ space.features.length - 2 }} more
                    </span>
                  </div>
                </div>

                
                <button class="btn-primary text-sm w-full  mt-5 py-2 px-3">
                    Select
                  </button>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-8">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1.5">No spaces found</h3>
            <p class="text-gray-600 mb-3 text-sm">Try adjusting your filters or search criteria</p>
            <button @click="clearAllFilters" class="btn-primary text-sm py-1.5 px-4">
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Search Modal -->
    <div v-if="showEditSearch" @click="showEditSearch = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white rounded-lg p-4 w-full max-w-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Edit Search</h2>
          <button @click="showEditSearch = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
            <input v-model="editSearchForm.location" type="text" placeholder="Enter location" class="input-field text-sm py-1.5 px-2">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Space Type</label>
            <select v-model="editSearchForm.spaceType" class="input-field text-sm py-1.5 px-2">
              <option value="">All Types</option>
              <option value="meeting-room">Meeting Room</option>
              <option value="hot-desk">Hot Desk</option>
              <option value="coworking-space">Co-working Space</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="showEditSearch = false" class="btn-primary text-sm py-1.5 px-3">
            Cancel
          </button>
          <button @click="updateSearch" class="btn-primary text-sm py-1.5 px-3" :disabled="isSearching">
            {{ isSearching ? 'Searching...' : 'Update Search' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SpacesAPI } from '../api'
import { SearchSpacesRequestDto } from '../dto/request'
import type { SpaceDto } from '../dto/response'
import DualRangeSlider from '../components/DualRangeSlider.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import SingleDatePicker from '../components/SingleDatePicker.vue'

class SearchFilters {
  location: string
  spaceType: string
  dateRange: { startDate: string | null, endDate: string | null }
  startTime: string
  endTime: string
  capacity: number | null

  constructor(location = '', spaceType = '', dateRange = { startDate: null, endDate: null }, startTime = '', endTime = '', capacity = null) {
    this.location = location
    this.spaceType = spaceType
    this.dateRange = dateRange
    this.startTime = startTime
    this.endTime = endTime
    this.capacity = capacity
  }
}

class PriceRange {
  min: number
  max: number

  constructor(min = 10, max = 1000) {
    this.min = min
    this.max = max
  }
}

class EditSearchForm {
  location: string
  spaceType: string
  date: string | null
  dateRange: { startDate: string | null, endDate: string | null }
  startTime: string
  endTime: string
  timeRange: { start: string, end: string }
  capacity: number | null

  constructor(location = '', spaceType = '', date: string | null = null, dateRange = { startDate: null, endDate: null }, startTime = '', endTime = '', timeRange = { start: '', end: '' }, capacity = null) {
    this.location = location
    this.spaceType = spaceType
    this.date = date
    this.dateRange = dateRange
    this.startTime = startTime
    this.endTime = endTime
    this.timeRange = timeRange
    this.capacity = capacity
  }
}

import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue'

export default defineComponent({
  name: 'SearchResults',
  components: {
    DualRangeSlider,
    DateRangePicker,
    SingleDatePicker,
    CustomTimeRangePicker
  },

  data() {
    return {
      // Loading states
      isLoading: false,
      isSearching: false,

      // Filters from route query
      filters: {
        location: (this.$route.query.location as string) || '',
        spaceType: (this.$route.query.spaceType as string) || '',
        dateRange: {
          startDate: (this.$route.query.startDate as string) || null,
          endDate: (this.$route.query.endDate as string) || null
        },
        startTime: (this.$route.query.startTime as string) || '',
        endTime: (this.$route.query.endTime as string) || '',
        capacity: this.$route.query.capacity ? parseInt(this.$route.query.capacity as string, 10) : null
      } as SearchFilters,

      // View and sorting
      sortBy: 'price-low',

      // Filter states
      priceRange: { min: 10, max: 1000 } as PriceRange,
      selectedSpaceTypes: [] as string[],
      selectedFacilities: [] as string[],
      minRating: '0',

      // Edit search modal
      showEditSearch: false,
      editSearchForm: {
        location: '',
        spaceType: '',
        date: null,
        dateRange: { startDate: null, endDate: null },
        startTime: '',
        endTime: '',
        timeRange: { start: '', end: '' },
        capacity: null
      } as EditSearchForm,
  watch: {
    'editSearchForm.timeRange': {
      handler(this: any, newVal: { start: string, end: string }) {
        this.editSearchForm.startTime = newVal.start;
        this.editSearchForm.endTime = newVal.end;
      },
      deep: true
    },
    'editSearchForm.startTime': {
      handler(this: any, val: string) {
        this.editSearchForm.timeRange.start = val;
      }
    },
    'editSearchForm.endTime': {
      handler(this: any, val: string) {
        this.editSearchForm.timeRange.end = val;
      }
    }
  },

      // Data from API
      allSpaces: [] as SpaceDto[],
      filteredSpaces: [] as SpaceDto[],
      sortedSpaces: [] as SpaceDto[],

      // Favorites (could be loaded from user preferences)
      favoriteSpaceIds: [] as number[]
    }
  },

  async mounted() {
  this.editSearchForm = { ...this.filters, date: null, timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' } }
    await this.loadSpaces()
    this.initializeFilters()
    this.applyFiltersAndSorting()
  },

  computed: {
    activeFilters() {
      const filters = [];
      if (this.selectedSpaceTypes.length > 0) {
        filters.push(...this.selectedSpaceTypes.map(t => this.formatSpaceType(t)));
      }
      if (this.selectedFacilities.length > 0) {
        filters.push(...this.selectedFacilities);
      }
      if (this.minRating !== '0') {
        filters.push(`${this.minRating}+ stars`);
      }
      if (this.priceRange.min !== 10 || this.priceRange.max !== 1000) {
        filters.push(`$${this.priceRange.min} - $${this.priceRange.max}`);
      }
      return filters;
    },
    searchResultTitle() {
      if (this.selectedSpaceTypes.length === 1) {
        return this.formatSpaceType(this.selectedSpaceTypes[0]);
      }
      if (this.selectedSpaceTypes.length > 1) {
        return 'Multiple Space Types';
      }
      if (this.activeFilters.length > 0) {
        return 'Filtered Results';
      }
      return 'All Spaces';
    }
  },

  methods: {
    removeFilter(filterToRemove: string): void {
      // Check and remove from space types
      const spaceTypes: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      };
      for (const key in spaceTypes) {
        if (spaceTypes[key] === filterToRemove) {
          this.selectedSpaceTypes = this.selectedSpaceTypes.filter(t => t !== key);
          this.applyFilters();
          return;
        }
      }

      // Check and remove from facilities
      if (this.selectedFacilities.includes(filterToRemove)) {
        this.selectedFacilities = this.selectedFacilities.filter(f => f !== filterToRemove);
        this.applyFilters();
        return;
      }

      // Check and remove from rating
      if (filterToRemove.endsWith('+ stars')) {
        const rating = filterToRemove.split('+')[0];
        if (this.minRating === rating) {
          this.minRating = '0';
          this.applyFilters();
          return;
        }
      }

      // Check and remove from price range
      if (filterToRemove.startsWith('$')) {
        this.priceRange = { min: 10, max: 1000 };
        this.applyFilters();
        return;
      }
    },

    async loadSpaces(): Promise<void> {
      try {
        this.isLoading = true

        const searchRequest = new SearchSpacesRequestDto({
          location: this.filters.location || undefined,
          spaceType: this.filters.spaceType || undefined
        })

        const response = await SpacesAPI.searchSpaces(searchRequest)

        if (response.success) {
          this.allSpaces = response.spaces || []
        } else {
          console.error('Failed to load spaces:', response.message)
          this.allSpaces = []
        }
      } catch (error) {
        console.error('Error loading spaces:', error)
        this.allSpaces = []
      } finally {
        this.isLoading = false
      }
    },

    initializeFilters(): void {
      // Apply filters from route query
      if (this.$route.query.spaceType) {
        this.selectedSpaceTypes = [this.$route.query.spaceType as string]
      }
    },

    applyFiltersAndSorting(): void {
      this.applyFilters()
      this.applySorting()
    },

    applyFilters(): void {
      this.filteredSpaces = this.allSpaces.filter(space => {
        // Location filter
        if (this.filters.location &&
          !space.location.toLowerCase().includes(this.filters.location.toLowerCase())) {
          return false
        }

        // Price filter (adjusted for different space types)
        const adjustedPrice = this.getAdjustedPrice(space)
        if (adjustedPrice < this.priceRange.min || adjustedPrice > this.priceRange.max) {
          return false
        }

        // Space type filter from sidebar
        if (this.selectedSpaceTypes.length > 0 && !this.selectedSpaceTypes.includes(space.productType)) {
          return false
        }

        // Rating filter
        if (this.minRating !== '0' && space.rating < parseFloat(this.minRating)) {
          return false
        }

        // Facilities filter
        if (this.selectedFacilities.length > 0) {
          // Check if all selected facilities are present in space.features
          const hasAllFacilities = this.selectedFacilities.every(facility =>
            space.features.includes(facility)
          );
          if (!hasAllFacilities) {
            return false;
          }
        }

        // Capacity filter
        if (this.filters.capacity) {
          const spaceCapacity = space.maxCapacity || space.capacity;
          if (!spaceCapacity || spaceCapacity < this.filters.capacity) {
            return false;
          }
        }

        // Date Range filter
        if (this.filters.dateRange.startDate && this.filters.dateRange.endDate) {
          const startDate = new Date(this.filters.dateRange.startDate);
          const endDate = new Date(this.filters.dateRange.endDate);

          let isAvailableDuringRange = true;
          let currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            const dayAvailability = space.availability.find(a => a.date === dateString);

            if (!dayAvailability || !dayAvailability.available) {
              isAvailableDuringRange = false;
              break;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }

          if (!isAvailableDuringRange) {
            return false;
          }
        }

        // Time Range filter (only applies if a single day is selected in date range)
        if (this.filters.startTime && this.filters.endTime && this.filters.dateRange.startDate === this.filters.dateRange.endDate) {
          const selectedDate = this.filters.dateRange.startDate;
          const dayAvailability = space.availability.find(a => a.date === selectedDate);

          if (!dayAvailability || !dayAvailability.available) {
            return false;
          }

          const startMinutes = parseInt(this.filters.startTime.split(':')[0]) * 60 + parseInt(this.filters.startTime.split(':')[1]);
          const endMinutes = parseInt(this.filters.endTime.split(':')[0]) * 60 + parseInt(this.filters.endTime.split(':')[1]);

          let isTimeSlotAvailable = false;
          for (const availableTime of dayAvailability.timeSlots) { // Changed to timeSlots
            const availableTimeMinutes = parseInt(availableTime.time.split(':')[0]) * 60 + parseInt(availableTime.time.split(':')[1]);
            if (availableTime.available && availableTimeMinutes >= startMinutes && availableTimeMinutes < endMinutes) { // Check available property
              isTimeSlotAvailable = true;
              break;
            }
          }

          if (!isTimeSlotAvailable) {
            return false;
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
          this.sortedSpaces = spaces.sort((a, b) => {
            return this.getAdjustedPrice(a) - this.getAdjustedPrice(b)
          })
          break
        case 'price-high':
          this.sortedSpaces = spaces.sort((a, b) => {
            return this.getAdjustedPrice(b) - this.getAdjustedPrice(a)
          })
          break
        case 'rating':
          this.sortedSpaces = spaces.sort((a, b) => b.rating - a.rating)
          break
        case 'availability':
          this.sortedSpaces = spaces.sort((a, b) => {
            // Sort available spaces first
            if (a.isAvailable && !b.isAvailable) return -1
            if (!a.isAvailable && b.isAvailable) return 1
            return 0
          })
          break
        default:
          this.sortedSpaces = spaces
      }
    },

    getAdjustedPrice(space: SpaceDto): number {
      // Normalize prices for comparison (convert to daily equivalent)
      if (space.productType === 'coworking-space' && space.pricing?.monthly) {
        return Math.round(space.pricing.monthly / 30)
      }
      if (space.productType === 'meeting-room' && space.pricing?.hourly) {
        return space.pricing.hourly * 8 // 8-hour day
      }
      return space.pricing?.daily || 0
    },

    getStartingPrice(space: SpaceDto): number {
      if (space.productType === 'meeting-room') {
        return space.pricing?.hourly || 0
      }
      if (space.productType === 'hot-desk') {
        return space.pricing?.daily || 0
      }
      if (space.productType === 'coworking-space') {
        return space.pricing?.monthly || 0
      }
      return 0
    },

    getPriceUnit(productType: string): string {
      switch (productType) {
        case 'meeting-room':
          return 'Per Hour'
        case 'hot-desk':
          return 'Per Month'
        case 'coworking-space':
          return 'Per Month'
        default:
          return 'Per Hour'
      }
    },

    getSpaceImage(space: SpaceDto): string {
      return space.images && space.images.length > 0
        ? space.images[0]
        : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },

    formatSpaceType(type: string): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[type] || type
    },

    async clearAllFilters(): Promise<void> {
      // Reset all filter models
      this.priceRange = { min: 10, max: 1000 };
      this.selectedSpaceTypes = [];
      this.selectedFacilities = [];
      this.minRating = '0';
      this.filters = {
        location: '',
        spaceType: '',
        dateRange: { startDate: null, endDate: null },
        startTime: '',
        endTime: '',
        capacity: null
      };
  this.editSearchForm = { ...this.filters, date: null, timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' } };
      this.sortBy = 'price-low';

      // Update the URL to reflect cleared filters
      try {
        await this.$router.push({ query: {} });
      } catch (error) {
        // Avoid navigation duplicated error
        if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name !== 'NavigationDuplicated') {
          console.error('Error updating route:', error);
        }
      }

      // Reload and re-apply filters
      await this.loadSpaces();
      this.applyFiltersAndSorting();
    },

    editSearch(): void {
  this.editSearchForm = { ...this.filters, date: null, timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' } }
      this.showEditSearch = true
    },

    async updateSearch(): Promise<void> {
      try {
        this.isSearching = true
        this.filters = { ...this.editSearchForm }

        const queryParams: Record<string, any> = {
          location: this.filters.location,
          spaceType: this.filters.spaceType,
          capacity: this.filters.capacity,
          startDate: this.filters.dateRange.startDate,
          endDate: this.filters.dateRange.endDate,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
        };

        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
            delete queryParams[key];
          }
        });

        await this.$router.push({
          name: 'SearchResults',
          query: queryParams
        })

        await this.loadSpaces()
        this.applyFiltersAndSorting()
        this.showEditSearch = false
      } catch (error) {
        console.error('Error updating search:', error)
      } finally {
        this.isSearching = false
      }
    },

    async viewSpace(id: number, type: string): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() },
          query: { type }
        })
      } catch (error) {
        console.error('Error navigating to space details:', error)
      }
    },

    toggleFavorite(id: number): void {
      const index = this.favoriteSpaceIds.indexOf(id)
      if (index > -1) {
        this.favoriteSpaceIds.splice(index, 1)
      } else {
        this.favoriteSpaceIds.push(id)
      }
      // Here you could save to user preferences via API
    },

    isFavorite(id: number): boolean {
      return this.favoriteSpaceIds.includes(id)
    }
  },

  watch: {
    '$route.query': {
      handler(newQuery) {
        this.filters = {
          location: (newQuery.location as string) || '',
          spaceType: (newQuery.spaceType as string) || '',
          dateRange: {
            startDate: (newQuery.startDate as string) || null,
            endDate: (newQuery.endDate as string) || null
          },
          startTime: (newQuery.startTime as string) || '',
          endTime: (newQuery.endTime as string) || '',
          capacity: newQuery.capacity ? parseInt(newQuery.capacity as string, 10) : null
        }
  this.editSearchForm = { ...this.filters, date: null, timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' } };
        this.loadSpaces()
      },
      deep: true
    },

    sortBy() {
      this.applySorting()
    }
  }
})
</script>