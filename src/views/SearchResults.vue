<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Advanced Search Bar -->
    <div class="bg-white border-b mr-5 ml-5 rounded-lg border-gray-200 fixed top-16 left-0 right-0 z-40 mx-5">
      <div class="max-w-8xl mx-10 px-4 py-2">
        <h1 class="text-base font-bold text-gray-800 mb-3">Search Your WorkSpace</h1>
        <div class="flex flex-row items-center justify-start gap-3 w-full relative">
          <div class="relative min-w-[220px] max-w-[260px] flex flex-col justify-end">
            <label class="block text-xs font-medium text-black mb-0.5">Space Type</label>
            <SpaceTypeDropdown
              v-model="editSearchForm.spaceType"
              :options="spaceTypeOptions"
              label=""
              class="w-full text-xs"
              :compact="false"
              heightClass="h-9"
            />
          </div>

          <div class="flex-grow min-w-[200px] flex flex-col justify-end">
            <label class="block text-xs font-medium text-gray-700 mb-0.5">Date</label>
            <SingleDatePicker :modelValue="editSearchForm.date === null ? undefined : editSearchForm.date"
              @update:modelValue="editSearchForm.date = $event" placeholder="Date" class="text-xs py-0 px-0 w-full h-9" />
          </div>

          <div class="flex flex-col justify-end min-w-[280px]">
            <label class="block text-xs font-medium text-gray-700 mb-1">Time Range</label>
            <div class="h-8 flex items-center">
              <CustomTimeRangePicker v-model="editSearchForm.timeRange" label="" class="h-10" />
            </div>
          </div>

          <div class="flex-none mr-1 flex flex-col justify-end min-w-[100px]">
            <label class="block text-xs font-medium text-gray-700 mb-0.5">Capacity</label>
            <input v-model.number="editSearchForm.capacity" type="number" min="1" placeholder="Capacity"
              class="input-field text-xs py-1.5 px-2 w-full h-9">
          </div>

          <div class="flex-shrink-0 flex flex-col justify-end min-w-[110px]">
            <label class="block text-xs font-medium text-transparent mb-0.5 select-none">Search</label>
            <button @click="updateSearch" class="btn-primary py-2 px-3 text-xs w-32" :disabled="isSearching || !isSearchFormValid">
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-8xl mx-auto px-2 sm:px-5 py-6 mt-24">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
        <!-- Filters Sidebar - Narrower -->
        <div class="md:col-span-1 w-full mb-4 md:mb-0 md:ml-14 ml-0 md:max-w-[280px] md:min-w-[200px]">
          <!-- Mobile Filter Toggle -->
          <div class="md:hidden mb-4">
            <button @click="isFilterOpen = !isFilterOpen"
              class="w-full flex items-center justify-between bg-white p-3 rounded-lg shadow-card">
              <span class="text-lg font-semibold text-gray-900">Filters</span>
              <svg class="w-6 h-6 text-gray-600 transform transition-transform"
                :class="{ 'rotate-180': isFilterOpen }" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </button>
          </div>

          <div
            class="bg-white rounded-lg p-3 shadow-card fixed top-45 left-20 w-64 z-30 max-h-[calc(100vh-12rem)] overflow-y-auto"
            :class="{ 'hidden md:block': !isFilterOpen }">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900">Filters</h3>
              <button @click="clearAllFilters" class="text-xs text-secondary-500">
                Clear All
              </button>
            </div>

            <!-- Location Filter -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-sm mb-2">Location</h4>
              <input v-model="filters.location" type="text" placeholder="Enter location"
                class="input-field w-full text-sm py-1.5 px-2" @input="applyFilters">
            </div>

            <!-- Price Range -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-sm mb-2">Price Range (per day)</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs text-gray-600">
                  <span>${{ priceRange.min }}</span>
                  <span>${{ priceRange.max }}</span>
                </div>
                <DualRangeSlider v-model:min="priceRange.min" v-model:max="priceRange.max" :minVal="10" :maxVal="1000"
                  @change="applyFilters" class="w-full" />
              </div>
            </div>

            <!-- Facilities -->
            <div class="mb-3">
              <h4 class="font-medium text-gray-900 text-sm mb-2">Facilities</h4>
              <div class="space-y-1">
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="High-Speed WiFi" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-xs">High-Speed WiFi</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="4K Display" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-xs">4K Display</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="Video Conferencing" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-xs">Video Conferencing</span>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedFacilities" value="Natural Light" type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-xs">Natural Light</span>
                </label>
              </div>
            </div>

            <!-- Rating -->
            <div>
              <h4 class="font-medium text-gray-900 text-sm mb-2">Rating</h4>
              <div class="space-y-1">
                <label class="flex items-center">
                  <input v-model="minRating" value="4" type="radio" name="rating"
                    class="border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 flex items-center text-xs">
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
                    class="border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary text-xs"
                    :style="{ accentColor: 'var(--color-primary, #000)' }" @change="applyFilters">
                  <span class="ml-2 text-gray-700 text-xs">Any rating</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Area -->
        <div class="md:col-span-3 relative md:mr-14 mr-0 md:-ml-10 ml-0">
          <!-- Title and Sort -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ searchResultTitle }}</h2>
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
          <div v-else-if="filteredSpaces.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="space in sortedSpaces" :key="space.id"
              class="card overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col"
              @click="viewSpace(space.id, space.productType)">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img :src="getSpaceImage(space)" :alt="space.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <button @click.stop="toggleFavorite(space.id)"
                  :class="['absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors', isFavorite(space.id) ? 'text-red-500' : 'text-gray-400']">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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

              <div class="p-2.5 flex flex-col flex-grow">
                <div class="flex-grow">
                  <div class="flex items-start justify-between mb-1">
                    <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                      {{ space.name }}
                    </h3>
                    <div class="text-sm font-bold text-gray-900 ml-2 flex-shrink-0">
                      ${{ getStartingPrice(space) }}
                      <span class="text-xs font-normal text-gray-600 block">/{{ getPriceUnit(space.productType) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center text-gray-600 text-xs mb-1.5">
                    <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span class="truncate">{{ space.location }}</span>
                  </div>

                  <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400">
                      <svg v-for="star in 5" :key="star" :class="['w-3 h-3', star <= space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-1 text-xs text-gray-600">{{ space.rating }} ({{ space.reviews }})</span>
                  </div>

                  <div class="border-t border-gray-200 mt-2 pt-2">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="feature in space.features.slice(0, 2)" :key="feature"
                        class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs leading-tight">
                        {{ feature }}
                      </span>
                      <span v-if="space.features.length > 2"
                        class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs leading-tight">
                        +{{ space.features.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>

                <button class="btn-primary text-xs w-full mt-3 py-2 px-3">
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
            <h3 class="text-sm font-semibold text-gray-900 mb-1.5">No spaces found</h3>
            <p class="text-gray-600 mb-3 text-xs">Try adjusting your filters or search criteria</p>
            <button @click="clearAllFilters" class="btn-primary text-xs py-1.5 px-4">
              Clear All Filters
            </button>

            <!-- Suggestions from other locations -->
            <div v-if="filters.location && allSpaces.length > 0">
              <h4 class="mt-8 mb-2 text-sm font-semibold text-gray-900">Suggestions from other locations</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="space in allSpaces.filter(s => !filters.location || !s.location.toLowerCase().includes(filters.location.toLowerCase()))"
                  :key="space.id"
                  class="card overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col"
                  @click="viewSpace(space.id, space.productType)">
                  <div class="relative aspect-[4/3] overflow-hidden">
                    <img :src="getSpaceImage(space)" :alt="space.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <button @click.stop="toggleFavorite(space.id)"
                      :class="['absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors', isFavorite(space.id) ? 'text-red-500' : 'text-gray-400']">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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

                  <div class="p-2.5 flex flex-col flex-grow">
                    <div class="flex-grow">
                      <div class="flex items-start justify-between mb-1">
                        <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                          {{ space.name }}
                        </h3>
                        <div class="text-sm font-bold text-gray-900 ml-2 flex-shrink-0">
                          ${{ getStartingPrice(space) }}
                          <span class="text-xs font-normal text-gray-600 block">/{{ getPriceUnit(space.productType) }}</span>
                        </div>
                      </div>

                      <div class="flex items-center text-gray-600 text-xs mb-1.5">
                        <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span class="truncate">{{ space.location }}</span>
                      </div>

                      <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400">
                          <svg v-for="star in 5" :key="star" :class="['w-3 h-3', star <= space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span class="ml-1 text-xs text-gray-600">{{ space.rating }} ({{ space.reviews }})</span>
                      </div>

                      <div class="border-t border-gray-200 mt-2 pt-2">
                        <div class="flex flex-wrap gap-1">
                          <span v-for="feature in space.features.slice(0, 2)" :key="feature"
                            class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs leading-tight">
                            {{ feature }}
                          </span>
                          <span v-if="space.features.length > 2"
                            class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs leading-tight">
                            +{{ space.features.length - 2 }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button class="btn-primary text-xs w-full mt-3 py-2 px-3">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            <input v-model="editSearchForm.location" type="text" placeholder="Enter location"
              class="input-field text-sm py-1.5 px-2">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Space Type</label>
            <select v-model="editSearchForm.spaceType" class="input-field text-sm py-1.5 px-2">
              <option value="">All Types</option>
              <option value="meeting-room">Meeting Room</option>
              <option value="hot-desk">Hot Desk</option>
              <option value="dedicated-desk">Dedicated Desk</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="showEditSearch = false" class="btn-primary text-sm py-1.5 px-3">
            Cancel
          </button>
          <button @click="updateSearch" class="btn-primary text-sm py-1.5 px-3" :disabled="isSearching || !isSearchFormValid">
            {{ isSearching ? 'Searching...' : 'Update Search' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SpacesAPI } from '../api';
import { SearchSpacesRequestDto } from '../dto/request';
import type { SpaceDto } from '../dto/response';
import DualRangeSlider from '../components/DualRangeSlider.vue';
import SingleDatePicker from '../components/SingleDatePicker.vue';
import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue';
import FloatingBookingSummary from '../components/FloatingBookingSummary.vue';
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue';
import type { RouteLocationNormalizedLoaded, NavigationFailure, LocationQueryValue } from 'vue-router';

// Helper function to safely parse query parameters
const getQueryParam = (param: LocationQueryValue | LocationQueryValue[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0] || '';
  }
  return param || '';
};

// Class definitions
class SearchFilters {
  location: string;
  spaceType: string;
  dateRange: { startDate: string | null; endDate: string | null };
  startTime: string;
  endTime: string;
  capacity: number | null;

  constructor(
    location = '',
    spaceType = '',
    dateRange: { startDate: string | null; endDate: string | null } = { startDate: null, endDate: null },
    startTime = '',
    endTime = '',
    capacity: number | null = null
  ) {
    this.location = location;
    this.spaceType = spaceType;
    this.dateRange = dateRange;
    this.startTime = startTime;
    this.endTime = endTime;
    this.capacity = capacity;
  }
}

class PriceRange {
  min: number;
  max: number;

  constructor(min = 10, max = 1000) {
    this.min = min;
    this.max = max;
  }
}

class EditSearchForm {
  location: string;
  spaceType: string;
  date: string | null;
  dateRange: { startDate: string | null; endDate: string | null };
  startTime: string;
  endTime: string;
  timeRange: { start: string; end: string };
  capacity: number | null;

  constructor(
    location = '',
    spaceType = '',
    date: string | null = null,
    dateRange: { startDate: string | null; endDate: string | null } = { startDate: null, endDate: null },
    startTime = '',
    endTime = '',
    timeRange: { start: string; end: string } = { start: '', end: '' },
    capacity: number | null = null
  ) {
    this.location = location;
    this.spaceType = spaceType;
    this.date = date;
    this.dateRange = dateRange;
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeRange = timeRange;
    this.capacity = capacity;
  }
}

export default defineComponent({
  name: 'SearchResults',
  components: {
    DualRangeSlider,
    SingleDatePicker,
    CustomTimeRangePicker,
    FloatingBookingSummary,
    SpaceTypeDropdown
  },

  data() {
    const query: RouteLocationNormalizedLoaded['query'] = this.$route.query;
    const capacity = getQueryParam(query.capacity);

    return {
      isLoading: false,
      isSearching: false,
      isFilterOpen: false,
      showEditSearch: false,
      filters: new SearchFilters(
        getQueryParam(query.location),
        getQueryParam(query.spaceType),
        {
          startDate: getQueryParam(query.startDate) || null,
          endDate: getQueryParam(query.endDate) || null
        },
        getQueryParam(query.startTime),
        getQueryParam(query.endTime),
        capacity ? parseInt(capacity, 10) : null
      ),
      sortBy: 'price-low',
      priceRange: new PriceRange(
        query.minPrice ? parseInt(getQueryParam(query.minPrice), 10) : 10,
        query.maxPrice ? parseInt(getQueryParam(query.maxPrice), 10) : 1000
      ),
      selectedSpaceTypes: query.spaceType ? [getQueryParam(query.spaceType)] : [] as string[],
      selectedFacilities: query.facilities ? getQueryParam(query.facilities).split(',') : [] as string[],
      minRating: query.minRating ? getQueryParam(query.minRating) : '0',
      editSearchForm: new EditSearchForm(),
      allSpaces: [] as SpaceDto[],
      filteredSpaces: [] as SpaceDto[],
      sortedSpaces: [] as SpaceDto[],
      favoriteSpaceIds: [] as number[],
      spaceTypeOptions: [
        {
          value: '',
          label: 'All Types',
          icon: ''
        },
        {
          value: 'meeting-room',
          label: 'Meeting Room',
          icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
        },
        {
          value: 'hot-desk',
          label: 'Hot Desk',
          icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
        },
        {
          value: 'dedicated-desk',
          label: 'Dedicated Desk',
          icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
        }
      ],
     
    };
  },

  async mounted() {
    this.editSearchForm = {
      ...this.filters,
      date: this.filters.dateRange.startDate,
      timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' }
    };
    await this.loadSpaces();
    this.applyFiltersAndSorting();
  },

  computed: {
    activeFilters(): string[] {
      const filters: string[] = [];
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
        filters.push(`${this.priceRange.min} - ${this.priceRange.max}`);
      }
      if (this.filters.location) {
        filters.push(`Location: ${this.filters.location}`);
      }
      if (this.filters.dateRange.startDate) {
        let dateTag = `Date: ${this.filters.dateRange.startDate}`;
        if (this.filters.dateRange.endDate && this.filters.dateRange.startDate !== this.filters.dateRange.endDate) {
          dateTag += ` to ${this.filters.dateRange.endDate}`;
        }
        filters.push(dateTag);
      }
      if (this.filters.startTime && this.filters.endTime) {
        filters.push(`Time: ${this.filters.startTime} - ${this.filters.endTime}`);
      }
      if (this.filters.capacity) {
        filters.push(`Capacity: ${this.filters.capacity}`);
      }
      return filters;
    },
    searchResultTitle(): string {
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
    },
    isSearchFormValid(): boolean {
      // If time range is partially selected, both start and end time must be provided
      const hasStartTime = !!(this.editSearchForm.timeRange.start);
      const hasEndTime = !!(this.editSearchForm.timeRange.end);
      
      // If either time is selected, both must be selected
      if (hasStartTime || hasEndTime) {
        return hasStartTime && hasEndTime;
      }
      
      // If no time is selected, search is still valid
      return true;
    }
  },

  methods: {
    async loadSpaces(): Promise<void> {
      // Prevent multiple simultaneous calls
      if (this.isLoading) {
        return;
      }
      
      this.isLoading = true;
      try {
        const searchRequest = new SearchSpacesRequestDto({
          location: this.filters.location || undefined,
          spaceType: this.filters.spaceType || undefined
        });
        const response = await SpacesAPI.searchSpaces(searchRequest);
        if (response.success) {
          this.allSpaces = response.spaces || [];
        } else {
          console.error('Failed to load spaces:', response.message);
          this.allSpaces = [];
        }
      } catch (error) {
        console.error('Error loading spaces:', error);
        this.allSpaces = [];
      } finally {
        this.isLoading = false;
      }
    },

    applyFiltersAndSorting(): void {
      this.applyFilters();
      this.applySorting();
    },

    applyFilters(): void {
      // Don't apply filters if no spaces are loaded yet
      if (!this.allSpaces || this.allSpaces.length === 0) {
        this.filteredSpaces = [];
        return;
      }
      
      this.filteredSpaces = this.allSpaces.filter(space => {
        if (
          this.filters.location &&
          !space.location.toLowerCase().includes(this.filters.location.toLowerCase())
        ) {
          return false;
        }

        const adjustedPrice = this.getAdjustedPrice(space);
        if (adjustedPrice < this.priceRange.min || adjustedPrice > this.priceRange.max) {
          return false;
        }

        if (
          this.selectedSpaceTypes.length > 0 &&
          !this.selectedSpaceTypes.includes(space.productType)
        ) {
          return false;
        }

        if (this.minRating !== '0' && space.rating < parseFloat(this.minRating)) {
          return false;
        }

        if (
          this.selectedFacilities.length > 0 &&
          !this.selectedFacilities.every(facility => space.features.includes(facility))
        ) {
          return false;
        }

        if (this.filters.capacity) {
          const spaceCapacity = space.maxCapacity ?? space.capacity;
          if (!spaceCapacity || spaceCapacity < this.filters.capacity) {
            return false;
          }
        }

        if (this.filters.dateRange.startDate && this.filters.dateRange.endDate) {
          const startDate = new Date(this.filters.dateRange.startDate);
          const endDate = new Date(this.filters.dateRange.endDate);
          let isAvailable = true;
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            const dayAvailability = space.availability.find(a => a.date === dateString);
            if (!dayAvailability || !dayAvailability.timeSlots || dayAvailability.timeSlots.length === 0) {
              isAvailable = false;
              break;
            }
            // Check if there are any available time slots for this date
            const hasAvailableSlots = dayAvailability.timeSlots.some((slot: { time: string; available: boolean }) => slot.available);
            if (!hasAvailableSlots) {
              isAvailable = false;
              break;
            }
          }
          if (!isAvailable) return false;
        }

        if (
          this.filters.startTime &&
          this.filters.endTime &&
          this.filters.dateRange.startDate &&
          this.filters.dateRange.startDate === this.filters.dateRange.endDate
        ) {
          const selectedDate = this.filters.dateRange.startDate;
          const dayAvailability = space.availability.find(a => a.date === selectedDate);
          if (!dayAvailability || !dayAvailability.timeSlots || dayAvailability.timeSlots.length === 0) return false;

          const startMinutes =
            parseInt(this.filters.startTime.split(':')[0]) * 60 +
            parseInt(this.filters.startTime.split(':')[1]);
          const endMinutes =
            parseInt(this.filters.endTime.split(':')[0]) * 60 +
            parseInt(this.filters.endTime.split(':')[1]);

          const isTimeSlotAvailable = dayAvailability.timeSlots.some((slot: { time: string; available: boolean }) => {
            const slotMinutes =
              parseInt(slot.time.split(':')[0]) * 60 + parseInt(slot.time.split(':')[1]);
            return slot.available && slotMinutes >= startMinutes && slotMinutes < endMinutes;
          });

          if (!isTimeSlotAvailable) return false;
        }

        return true;
      });
      
      this.applySorting();
    },

    applySorting(): void {
      const spaces = [...this.filteredSpaces];
      switch (this.sortBy) {
        case 'price-low':
          this.sortedSpaces = spaces.sort(
            (a, b) => this.getAdjustedPrice(a) - this.getAdjustedPrice(b)
          );
          break;
        case 'price-high':
          this.sortedSpaces = spaces.sort(
            (a, b) => this.getAdjustedPrice(b) - this.getAdjustedPrice(a)
          );
          break;
        case 'rating':
          this.sortedSpaces = spaces.sort((a, b) => b.rating - a.rating);
          break;
        case 'availability':
          this.sortedSpaces = spaces.sort((a, b) => {
            const aAvailable = a.isAvailable ?? false;
            const bAvailable = b.isAvailable ?? false;
            if (aAvailable && !bAvailable) return -1;
            if (!aAvailable && bAvailable) return 1;
            return 0;
          });
          break;
        default:
          this.sortedSpaces = spaces;
      }
    },

    getAdjustedPrice(space: SpaceDto): number {
      if (space.productType === 'dedicated-desk' && space.pricing?.monthly) {
        return Math.round(space.pricing.monthly / 30);
      }
      if (space.productType === 'meeting-room' && space.pricing?.hourly) {
        return space.pricing.hourly * 8;
      }
      return space.pricing?.daily || 0;
    },

    getStartingPrice(space: SpaceDto): number {
      if (space.productType === 'meeting-room') {
        return space.pricing?.hourly || 0;
      }
      if (space.productType === 'hot-desk') {
        return space.pricing?.daily || 0;
      }
      if (space.productType === 'dedicated-desk') {
        return space.pricing?.monthly || 0;
      }
      return 0;
    },

    getPriceUnit(productType: string): string {
      switch (productType) {
        case 'meeting-room':
          return 'Per Hour';
        case 'hot-desk':
          return 'Per Day';
        case 'dedicated-desk':
          return 'Per Month';
        default:
          return 'Per Day';
      }
    },

    getSpaceImage(space: SpaceDto): string {
      return space.images && space.images.length > 0
        ? space.images[0]
        : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    },

    formatSpaceType(type: string): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'dedicated-desk': 'Dedicated Desk'
      };
      return types[type] || type;
    },

    async clearAllFilters(): Promise<void> {
      this.priceRange = new PriceRange(10, 1000);
      this.selectedSpaceTypes = [];
      this.selectedFacilities = [];
      this.minRating = '0';
      this.filters = new SearchFilters();
      this.editSearchForm = new EditSearchForm();
      this.sortBy = 'price-low';

      await this.updateQueryAndReload();
    },

    async updateQueryAndReload(): Promise<void> {
      const queryParams: Record<string, string | number | null | undefined> = {
        location: this.filters.location,
        spaceType: this.filters.spaceType,
        capacity: this.filters.capacity,
        startDate: this.filters.dateRange.startDate,
        endDate: this.filters.dateRange.endDate,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        minPrice: this.priceRange.min,
        maxPrice: this.priceRange.max,
        minRating: this.minRating,
        facilities: this.selectedFacilities.length > 0 ? this.selectedFacilities.join(',') : undefined
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      try {
        await this.$router.push({
          name: 'SearchResults',
          query: queryParams as Record<string, string>
        });
        // Don't call loadSpaces here - the route watcher will handle it
      } catch (error) {
        const navError = error as NavigationFailure;
        if (navError.name !== 'NavigationDuplicated') {
          console.error('Error updating route:', error);
        }
      }
    },

    removeFilter(filterToRemove: string): void {
      const spaceTypes: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'dedicated-desk': 'Dedicated Desk'
      };

      // Handle space type filters
      for (const key in spaceTypes) {
        if (spaceTypes[key] === filterToRemove) {
          this.selectedSpaceTypes = this.selectedSpaceTypes.filter(t => t !== key);
          this.filters.spaceType = this.selectedSpaceTypes.length > 0 ? this.selectedSpaceTypes[0] : '';
          this.editSearchForm.spaceType = this.filters.spaceType;
          this.updateQueryAndReload();
          return;
        }
      }

      // Handle facility filters
      if (this.selectedFacilities.includes(filterToRemove)) {
        this.selectedFacilities = this.selectedFacilities.filter(f => f !== filterToRemove);
        this.updateQueryAndReload();
        return;
      }

      // Handle rating filters
      if (filterToRemove.endsWith('+ stars')) {
        const rating = filterToRemove.split('+')[0].trim();
        if (this.minRating === rating) {
          this.minRating = '0';
          this.updateQueryAndReload();
          return;
        }
      }

      // Handle price range filters
      if (filterToRemove.includes(' - ')) {
        const [min, max] = filterToRemove.split(' - ').map(val => parseInt(val));
        if (this.priceRange.min === min && this.priceRange.max === max) {
          this.priceRange = new PriceRange(10, 1000);
          this.updateQueryAndReload();
          return;
        }
      }

      // Handle location filter
      if (filterToRemove.startsWith('Location: ')) {
        this.filters.location = '';
        this.editSearchForm.location = '';
        this.updateQueryAndReload();
        return;
      }

      // Handle date filter
      if (filterToRemove.startsWith('Date: ')) {
        this.filters.dateRange = { startDate: null, endDate: null };
        this.editSearchForm.date = null;
        this.editSearchForm.dateRange = { startDate: null, endDate: null };
        this.updateQueryAndReload();
        return;
      }

      // Handle time filter
      if (filterToRemove.startsWith('Time: ')) {
        this.filters.startTime = '';
        this.filters.endTime = '';
        this.editSearchForm.timeRange = { start: '', end: '' };
        this.updateQueryAndReload();
        return;
      }

      // Handle capacity filter
      if (filterToRemove.startsWith('Capacity: ')) {
        this.filters.capacity = null;
        this.editSearchForm.capacity = null;
        this.updateQueryAndReload();
        return;
      }
    },

    async updateSearch(): Promise<void> {
      // Validate form before proceeding
      if (!this.isSearchFormValid) {
        return;
      }
      
      this.isSearching = true;

      try {
        this.filters.location = this.editSearchForm.location;
        this.filters.spaceType = this.editSearchForm.spaceType;
        this.filters.capacity = this.editSearchForm.capacity;
        this.filters.dateRange = {
          startDate: this.editSearchForm.date,
          endDate: this.editSearchForm.date
        };
        this.filters.startTime = this.editSearchForm.timeRange.start;
        this.filters.endTime = this.editSearchForm.timeRange.end;

        this.selectedSpaceTypes = this.filters.spaceType ? [this.filters.spaceType] : [];

        await this.updateQueryAndReload();
        this.showEditSearch = false;
      } catch (error) {
        console.error('Error updating search:', error);
      } finally {
        this.isSearching = false;
      }
    },

    async viewSpace(id: number, type: string): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() },
          query: { type }
        });
      } catch (error) {
        console.error('Error navigating to space details:', error);
      }
    },

    toggleFavorite(id: number): void {
      const index = this.favoriteSpaceIds.indexOf(id);
      if (index > -1) {
        this.favoriteSpaceIds.splice(index, 1);
      } else {
        this.favoriteSpaceIds.push(id);
      }
    },

    isFavorite(id: number): boolean {
      return this.favoriteSpaceIds.includes(id);
    }
  },

  watch: {
    '$route.query': {
      async handler(newQuery: RouteLocationNormalizedLoaded['query'], oldQuery: RouteLocationNormalizedLoaded['query']) {
        // Skip if the query hasn't actually changed
        if (oldQuery && JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
          return;
        }
        
        const capacity = getQueryParam(newQuery.capacity);
        this.filters = new SearchFilters(
          getQueryParam(newQuery.location),
          getQueryParam(newQuery.spaceType),
          {
            startDate: getQueryParam(newQuery.startDate) || null,
            endDate: getQueryParam(newQuery.endDate) || null
          },
          getQueryParam(newQuery.startTime),
          getQueryParam(newQuery.endTime),
          capacity ? parseInt(capacity, 10) : null
        );
        this.editSearchForm = {
          ...this.filters,
          date: this.filters.dateRange.startDate,
          timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' }
        };
        this.selectedSpaceTypes = newQuery.spaceType ? [getQueryParam(newQuery.spaceType)] : [];
        this.selectedFacilities = newQuery.facilities ? getQueryParam(newQuery.facilities).split(',') : [];
        this.minRating = newQuery.minRating ? getQueryParam(newQuery.minRating) : '0';
        this.priceRange = new PriceRange(
          newQuery.minPrice ? parseInt(getQueryParam(newQuery.minPrice), 10) : 10,
          newQuery.maxPrice ? parseInt(getQueryParam(newQuery.maxPrice), 10) : 1000
        );
        
        try {
          await this.loadSpaces();
          this.applyFiltersAndSorting();
        } catch (error) {
          console.error('Error in route query handler:', error);
        }
      },
      deep: true
    },
    priceRange: {
      handler() {
        this.applyFilters();
      },
      deep: true
    },
    sortBy() {
      this.applySorting();
    }
  }
});
</script>