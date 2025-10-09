<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
    <!-- Advanced Search Bar - Responsive Design -->
    <div class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 fixed top-16 left-0 right-0 z-40 shadow-lg">
      <!-- Desktop Search Bar -->
      <div class="max-w-9xl py-4 px-3 hidden lg:block">
        <div class="flex flex-row items-center justify-start gap-3 w-full relative">
          <div class="relative min-w-[220px] max-w-[260px] flex flex-col justify-end">
            <label class="block text-xs font-medium text-black dark:text-white mb-2 ml-0.5">Space Type</label>
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
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-0.5">Date</label>
            <SingleDatePicker :modelValue="editSearchForm.date === null ? undefined : editSearchForm.date"
              @update:modelValue="editSearchForm.date = $event" placeholder="Date" class="text-xs py-0 px-0 w-full h-9" />
          </div>

          <div class="flex flex-col justify-end min-w-[280px]">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-0.5">Time Range</label>
            <div class="flex items-center">
              <CustomTimeRangePicker v-model="editSearchForm.timeRange" label="" class="w-full sm:w-auto" />
            </div>
          </div>

          <div class="flex-none mr-1 flex flex-col justify-end min-w-[100px]">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-0.5">Capacity</label>
            <input v-model="editSearchForm.capacity"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Capacity"
              class="input-field text-xs py-1.5 px-2 w-full h-9 bg-white dark:bg-gray-900 dark:text-white"
              @input="editSearchForm.capacity = ((($event.target as HTMLInputElement)?.value || '').replace(/[^0-9]/g, '') || '') === '' ? null : parseInt((($event.target as HTMLInputElement)?.value || '').replace(/[^0-9]/g, ''), 10)"
            >
          </div>

          <div class="flex-shrink-0 flex flex-col justify-end min-w-[110px]">
            <label class="block text-xs font-medium text-transparent mb-0.5 select-none">Search</label>
            <button @click="updateSearch" class="btn-primary py-2 px-3 text-xs w-32" :disabled="isSearching || !isSearchFormValid">
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile/Tablet Unified Search and Filter Bar -->
      <div class="lg:hidden py-4 px-4 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-3.5">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <span class="text-primary">Search</span> 
            <span>Workspace</span>
          </h3>
          <div class="flex items-center gap-2">
            <!-- Filter Button -->
            <button @click="isFilterOpen = !isFilterOpen" 
              class="text-black dark:text-white p-3 rounded-full bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-200 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span v-if="activeFilters.length > 0" 
                class="absolute -top-1 -right-1 bg-primary text-xs text-black w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {{ activeFilters.length }}
              </span>
            </button>
            <!-- Sort Button -->
            <button @click="showSortOptions = !showSortOptions"
              class="text-black dark:text-white p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative"
              :class="{'ring-2 ring-primary': showSortOptions}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
            <!-- View Toggle Button -->
            <button @click="toggleCompactView"
              class="text-black dark:text-white p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <svg v-if="isCompactView" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 3h-7m0 0v7m0-7L20 10M4 21h7m0 0v-7m0 7L4 14" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile sort dropdown absolute positioned from its parent -->
        <!-- Mobile Sort Dropdown -->
        <div v-if="showSortOptions" 
          class="absolute z-50 right-3 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 min-w-[220px] animate-fadeIn"
          style="top: 48px;">
          <div class="py-1">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSortOption(option.value)"
              class="flex items-center px-4 py-2.5 text-sm w-full text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-150"
              :class="{'bg-primary/10 dark:bg-primary/20 text-primary font-medium': sortBy === option.value}"
            >
              <span class="mr-2">
                <svg v-if="sortBy === option.value" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ option.label }}
            </button>
          </div>
        </div>
        
        <div class="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-hide snap-x relative">
          <!-- Quick Space Type Selection -->
          <button 
            v-for="option in spaceTypeOptions" 
            :key="option.value" 
            @click="editSearchForm.spaceType = option.value; updateSearch()"
            :class="[
              'px-3.5 py-2.5 rounded-full text-sm leading-tight whitespace-nowrap border transition-all duration-300 snap-start flex-shrink-0',
              editSearchForm.spaceType === option.value 
                ? 'bg-primary text-white dark:text-black border-primary shadow-sm font-medium' 
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            <div class="flex items-center gap-2">
              <span v-html="sanitizeIcon(option.icon)" v-if="option.icon" class="text-[1.1em]"></span>
              <span class="truncate max-w-[100px]">{{ option.label }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="w-full max-w-screen-8xl mx-auto px-4 sm:px-6 lg:px-6 py-8 mt-24">
      <div class="flex flex-col lg:flex-row gap-1 relative">
        <!-- Filters Sidebar -->
        <div class="lg:w-1/3 xl:w-1/4 w-full mb-4 lg:mb-0 self-start flex-shrink-0">
          <!-- Combined Mobile Filter & Search Overlay -->
          <div v-if="isFilterOpen" 
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex lg:hidden items-end transition-opacity duration-300 backdrop-blur-sm combined-filter-search-overlay"
            @click.self="isFilterOpen = false">
            <div 
              class="bg-white dark:bg-gray-900 w-full h-[80vh] max-h-[85vh] rounded-t-3xl pt-6 pb-8 overflow-y-auto p-4 sm:p-5 shadow-xl transform transition-transform duration-300 animate-slide-in-bottom">
              <!-- Handle at the top for better UX -->
              <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              
              <div class="flex items-center justify-between mb-6 mt-6 sm:mt-6 px-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters & Search
                  <span class="ml-1 bg-primary/20 text-primary text-sm px-2 py-0.5 rounded-full">
                    {{ activeFilters.length }}
                  </span>
                </h3>
                <button @click="isFilterOpen = false" 
                  class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Search Section for Mobile -->
              <div class="space-y-5 mb-8 px-4">
                <h4 class="font-medium text-gray-900 dark:text-white text-base mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </h4>

                <!-- Date Picker -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-0.5">Date</label>
                  <SingleDatePicker :modelValue="editSearchForm.date === null ? undefined : editSearchForm.date"
                    @update:modelValue="editSearchForm.date = $event" placeholder="Select date" class="text-sm py-0 px-0 w-full h-10" />
                </div>

                <!-- Time Range -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-0.5">Time Range</label>
                  <div class="flex items-center justify-start">
                    <CustomTimeRangePicker v-model="editSearchForm.timeRange" label="" class="w-full sm:w-auto" />
                  </div>
                </div>

                <!-- Capacity -->
                <div class="mb-5">
                  <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2.5 ml-0.5">Capacity</label>
                  <input v-model="editSearchForm.capacity"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter capacity"
                    class="input-field text-base py-3 px-4 w-full h-12 bg-white dark:bg-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700"
                    @input="editSearchForm.capacity = ((($event.target as HTMLInputElement)?.value || '').replace(/[^0-9]/g, '') || '') === '' ? null : parseInt((($event.target as HTMLInputElement)?.value || '').replace(/[^0-9]/g, ''), 10)"
                  >
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              </div>
              
              <!-- Filter Content for Mobile -->
              <div class="space-y-5 px-2">
                <!-- Location Filter -->
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-2 flex items-center">
                    <svg class="w-4 h-4 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Location
                  </h4>
                  <LocationDropdown
                    v-model="editSearchForm.location"
                    :locations="locations"
                    :disabled="loadingLocations"
                    placeholder="Select location"
                    class="w-full"
                    @change="onLocationChange"
                  />
                </div>
                
                <!-- Space Type Filter (Mobile) -->
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Space Type
                  </h4>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="option in spaceTypeOptions" 
                      :key="option.value" 
                      @click="editSearchForm.spaceType = option.value"
                      :class="[
                        'px-3 py-2.5 rounded-lg text-sm leading-tight flex items-center gap-2 border transition-all duration-300',
                        editSearchForm.spaceType === option.value 
                          ? 'bg-primary/10 border-primary text-gray-900 dark:text-white font-medium' 
                          : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      ]"
                    >
                      <span v-html="sanitizeIcon(option.icon)" v-if="option.icon" class="text-primary flex-shrink-0"></span>
                      <span class="truncate">{{ option.label }}</span>
                    </button>
                  </div>
                </div>
                
                <!-- Price Range for Mobile -->
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Price Range (per day)
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 font-medium">
                      <span>{{ formatCurrencyValue(priceRange.min) }}</span>
                      <span>{{ formatCurrencyValue(priceRange.max) }}</span>
                    </div>
                    <DualRangeSlider v-model:min="priceRange.min" v-model:max="priceRange.max" :minVal="0" :maxVal="10000"
                      @change="updateQueryAndReload" class="w-full" />
                  </div>
                </div>
                
                <!-- Facilities for Mobile -->
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Facilities
                  </h4>
                  <!-- Loading state for facilities -->
                  <div v-if="loadingFacilities" class="flex justify-center py-2.5">
                    <div class="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
                  </div>
                  
                  <!-- Facilities list -->
                  <div v-else class="flex flex-wrap gap-2">
                    <!-- Show API facilities if available -->
                    <template v-if="facilities.length > 0">
                      <label 
                        v-for="facility in facilities" 
                        :key="facility.facility_id"
                        :class="[
                          'px-3 py-2 rounded-lg text-sm leading-tight cursor-pointer flex items-center gap-2 border transition-all duration-200',
                          selectedFacilities.includes(facility.facility_name) 
                            ? 'bg-primary/10 border-primary text-primary font-medium' 
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        ]"
                      >
                        <input 
                          v-model="selectedFacilities" 
                          :value="facility.facility_name" 
                          type="checkbox"
                          class="hidden" 
                          @change="updateQueryAndReload"
                        >
                        <svg v-if="selectedFacilities.includes(facility.facility_name)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ facility.facility_name }}</span>
                      </label>
                    </template>
                    
                    <!-- Show error message if API fails -->
                    <template v-else>
                      <div class="w-full text-center py-3 px-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div class="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span>Unable to load facilities</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                
                <!-- Rating for Mobile -->
                <div class="mb-3">
                  <h4 class="font-medium text-gray-900 dark:text-white text-xs mb-2 flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Rating
                  </h4>
                  <div class="space-y-2">
                    <label :class="[
                        'flex items-center justify-between w-full px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200',
                        minRating === '4' 
                          ? 'bg-primary/10 border border-primary' 
                          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                      ]">
                      <div class="flex items-center">
                        <input v-model="minRating" value="4" type="radio" name="rating"
                          class="hidden" @change="updateQueryAndReload">
                        <span class="text-gray-700 dark:text-gray-300 text-xs font-medium">
                          4+ stars
                        </span>
                      </div>
                      <div class="flex text-yellow-400">
                        <svg v-for="star in 4" :key="star" class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </label>
                    <label :class="[
                        'flex items-center justify-between w-full px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200',
                        minRating === '0' 
                          ? 'bg-primary/10 border border-primary' 
                          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                      ]">
                      <div class="flex items-center">
                        <input v-model="minRating" value="0" type="radio" name="rating"
                          class="hidden" @change="updateQueryAndReload">
                        <span class="text-gray-700 dark:text-gray-300 text-xs font-medium">Any rating</span>
                      </div>
                      <div class="flex text-gray-300 dark:text-gray-600">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Apply & Reset Buttons for Mobile -->
                <div class="sticky bottom-0 left-0 right-0 pt-5 pb-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-6 px-4">
                  <div class="flex gap-4">
                    <button @click="clearAllFilters(); isFilterOpen = false" 
                      class="flex-1 py-3.5 px-5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Reset All
                    </button>
                    <button @click="updateSearch(); isFilterOpen = false" 
                      class="flex-1 py-3.5 px-5 bg-primary text-black rounded-lg text-base font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2.5"
                      :disabled="isSearching || !isSearchFormValid">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {{ isSearching ? 'Searching...' : 'Apply & Search' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Filters Sidebar -->
          <div
            class="filters-sidebar bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-dark-card hidden lg:block border border-gray-200 dark:border-gray-800 overflow-y-auto scrollbar-hide p-4 text-[15px] max-h-[70vh]">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-[17px] font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                <span v-if="activeFilters.length > 0" class="ml-1 bg-primary/20 text-primary text-sm px-2.5 py-0.5 rounded-full">
                  {{ activeFilters.length }}
                </span>
              </h3>
              <button @click="clearAllFilters" 
                class="text-sm flex items-center gap-1.5 text-primary hover:bg-primary/10 py-2 px-3 rounded-full transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>

            <!-- Location Filter -->
              <div class="mb-5">
                <h4 class="font-medium text-gray-900 dark:text-white text-[15px] mb-2.5 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Location
              </h4>
              <LocationDropdown
                v-model="filters.location"
                :locations="locations"
                :disabled="loadingLocations"
                placeholder="Select location"
                class="w-full"
                @update:modelValue="updateQueryAndReload"
                @change="onLocationChange"
              />
            </div>

            <!-- Price Range -->
              <div class="mb-5">
                <h4 class="font-medium text-gray-900 dark:text-white text-[15px] mb-2.5 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price Range (per day)
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 font-medium">
                  <span>{{ formatCurrencyValue(priceRange.min) }}</span>
                  <span>{{ formatCurrencyValue(priceRange.max) }}</span>
                </div>
                <DualRangeSlider v-model:min="priceRange.min" v-model:max="priceRange.max" :minVal="0" :maxVal="10000"
                  @change="updateQueryAndReload" class="w-full" />
              </div>
            </div>

            <!-- Facilities -->
              <div class="mb-5">
                <h4 class="font-medium text-gray-900 dark:text-white text-[15px] mb-2.5 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Facilities
              </h4>
              
              <!-- Loading state for facilities -->
                <div v-if="loadingFacilities" class="flex justify-center py-2">
                <div class="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
              
              <!-- Facilities list -->
                <div v-else class="flex flex-wrap gap-2">
                <!-- Show API facilities if available -->
                <template v-if="facilities.length > 0">
                    <label 
                      v-for="facility in facilities" 
                      :key="facility.facility_id"
                      :class="[
                        'px-2.5 py-1.5 rounded-lg text-sm cursor-pointer flex items-center gap-1.5 border transition-all duration-200',
                        selectedFacilities.includes(facility.facility_name) 
                          ? 'bg-primary/10 border-primary text-primary font-medium' 
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      ]"
                    >
                      <input 
                        v-model="selectedFacilities" 
                        :value="facility.facility_name" 
                        type="checkbox"
                        class="hidden" 
                        @change="updateQueryAndReload"
                      >
                      <svg v-if="selectedFacilities.includes(facility.facility_name)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{{ facility.facility_name }}</span>
                    </label>
                </template>
                
                <!-- Show error message if API fails -->
                <template v-else>
                    <div class="w-full text-center py-3 px-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div class="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Unable to load facilities</span>
                      </div>
                    </div>
                </template>
              </div>
            </div>

            <!-- Rating -->
              <div class="mb-5">
                <h4 class="font-medium text-gray-900 dark:text-white text-[15px] mb-2.5 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rating
              </h4>
              <div class="space-y-3.5">
                <label :class="[
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
                    minRating === '4' 
                      ? 'bg-primary/10 border border-primary' 
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                  ]">
                  <div class="flex items-center">
                    <input v-model="minRating" value="4" type="radio" name="rating"
                      class="hidden" @change="updateQueryAndReload">
                    <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      4+ stars
                    </span>
                  </div>
                  <div class="flex text-yellow-400">
                    <svg v-for="star in 4" :key="star" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </label>
                <label :class="[
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
                    minRating === '0' 
                      ? 'bg-primary/10 border border-primary' 
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                  ]">
                  <div class="flex items-center">
                    <input v-model="minRating" value="0" type="radio" name="rating"
                      class="hidden" @change="updateQueryAndReload">
                    <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">Any rating</span>
                  </div>
                  <div class="flex text-gray-300 dark:text-gray-600">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Area -->
        <div class="lg:w-2/3 xl:w-3/4 relative w-full lg:pl-0">
          <!-- Title and Sort -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 w-full">
            <div>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  {{ searchResultTitle }}
                  <div class="ml-2 bg-primary/20 text-primary text-sm px-2.5 py-1 rounded-full">
                    {{ filteredSpaces.length }} spaces
                  </div>
                </h2>
                <!-- Mobile Sort & View Toggle Buttons -->
                <div class="sm:hidden flex gap-3">
                  <!-- Mobile Sort Button -->
                  <button @click="showSortOptions = !showSortOptions"
                    class="flex items-center gap-2 bg-white dark:bg-gray-900 py-2.5 px-4 rounded-full text-sm shadow-sm border border-gray-100 dark:border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort
                  </button>
                  
                  <!-- Mobile View Toggle Button (Icon Only) -->
                  <button @click="toggleCompactView"
                    class="flex items-center justify-center bg-white dark:bg-gray-900 p-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800"
                    :class="isCompactView ? 'text-primary border-primary' : 'text-gray-600 dark:text-gray-400'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <!-- Minimize icon when in compact view -->
                      <path v-if="isCompactView" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 3h-7m0 0v7m0-7L20 10M4 21h7m0 0v-7m0 7L4 14" />
                      <!-- Maximize icon when in default view -->
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                  
                  <!-- Mobile Sort Dropdown -->
                  <div v-if="showSortOptions" 
                    class="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 min-w-[220px] animate-fadeIn">
                    <div 
                      v-for="option in [
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'rating', label: 'Highest Rated' },
                        { value: 'availability', label: 'Availability' }
                      ]" 
                      :key="option.value" 
                      @click="sortBy = option.value; applySorting(); showSortOptions = false"
                      class="px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      :class="{ 'text-primary font-medium': sortBy === option.value }"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Active Filters Display -->
              <div v-if="activeFilters.length > 0" class="flex items-center gap-1.5 flex-wrap mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
                <span v-for="filter in activeFilters" :key="filter"
                  class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center">
                  {{ filter }}
                  <button @click="removeFilter(filter)" class="ml-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-4 h-4 inline-flex items-center justify-center transition-colors">
                    &times;
                  </button>
                </span>
              </div>
            </div>

            <!-- Desktop Sort Controls and View Toggle - Both Moved to Right Edge -->
            <div class="hidden sm:flex items-center gap-2 ml-auto">
              <!-- Custom Desktop Sort Controls - Only visible on lg screens (never on tablet/mobile) -->
              <div class="hidden lg:flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                <label class="text-xs text-gray-600 dark:text-gray-300 ml-1 font-medium whitespace-nowrap">Sort:</label>
                
                <!-- Custom Dropdown -->
                <div class="relative" ref="sortDropdown">
                  <!-- Dropdown trigger button -->
                  <button 
                    @click="showSortOptions = !showSortOptions" 
                    class="flex items-center justify-between text-xs py-1 px-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-primary rounded-full border-0 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 min-w-[100px]"
                    :class="{'ring-2 ring-primary': showSortOptions}"
                  >
                    <span>{{ getSortLabel(sortBy) }}</span>
                    <svg 
                      class="h-3 w-3 text-primary ml-1 transition-transform duration-200" 
                      :class="{'transform rotate-180': showSortOptions}"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- Dropdown options -->
                  <div 
                    v-if="showSortOptions"
                    class="absolute right-0 mt-1 py-1 w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 animate-fadeIn"
                  >
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      @click="selectSortOption(option.value)"
                      class="flex items-center px-4 py-2 text-xs w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                      :class="{'bg-primary/10 dark:bg-primary/20 text-primary font-medium': sortBy === option.value}"
                    >
                      <span class="mr-2">
                        <svg v-if="sortBy === option.value" class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span v-else class="h-3.5 w-3.5 inline-block"></span>
                      </span>
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- View Toggle Button (Icon Only) -->
              <button @click="toggleCompactView" 
                class="flex items-center justify-center p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                :class="isCompactView ? 'text-primary border-primary' : 'text-gray-600 dark:text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <!-- Minimize icon when in compact view -->
                  <path v-if="isCompactView" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 3h-7m0 0v7m0-7L20 10M4 21h7m0 0v-7m0 7L4 14" />
                  <!-- Maximize icon when in default view -->
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 text-base">Searching for the perfect spaces...</p>
            <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">This will just take a moment</p>
          </div>

          <!-- Space Cards Grid -->
          <div v-else-if="displaySpaces.length > 0" 
            :class="[
              'grid w-full', 
              isCompactView 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3' 
                : 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5'
            ]">
            <!-- Space Cards with Responsive Design -->
            <div v-for="space in displaySpaces" :key="space.id"
              class="card overflow-hidden group cursor-pointer hover:shadow-xl dark:hover:shadow-dark-md transition-all duration-300 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl animate-fadeIn h-full"
              @click="viewSpace(space.id, space.productType)">
              
              <!-- Card Header with Image -->
              <div class="relative" 
                :class="[isCompactView ? 'h-[130px]' : 'h-[160px] sm:aspect-[16/9] sm:h-auto', 'overflow-hidden rounded-t-xl']">
                <img :src="getSpaceImage(space)" :alt="space.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                
                <!-- Favorite Button -->
                <!-- <button @click.stop="toggleFavorite(space.id)"
                  :class="['absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-110 transform', 
                  isFavorite(space.id) ? 'text-red-500' : 'text-gray-400 dark:text-gray-500']">
                  <svg :class="['w-3.5 h-3.5', isCompactView ? 'w-3 h-3' : '']" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd" />
                  </svg>
                </button> -->
                
                <!-- Space Type Badge -->
                <div class="absolute bottom-2 left-2">
                  <span :class="[
                    'bg-primary text-black px-2 rounded-full font-medium shadow-md backdrop-blur-sm',
                    isCompactView ? 'text-[9px] py-0' : 'text-xs py-0.5'
                  ]">
                    {{ isCompactView 
                      ? formatSpaceTypeShort(space.displayProductType || space.productType) 
                      : formatSpaceType(space.displayProductType || space.productType) }}
                  </span>
                </div>
                
                <!-- Quick Price Display -->
                <div :class="[
                  'absolute bottom-2 right-2', 
                  {'sm:hidden': !isCompactView}
                ]">
                  <span class="bg-white/90 dark:bg-black/90 backdrop-blur-sm text-gray-900 dark:text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                    LKR {{ getStartingPrice(space).toFixed(0) }}
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div :class="[
                'flex flex-col flex-grow',
                isCompactView ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
              ]">
                <div class="flex-grow">
                  <!-- Title & Price Row -->
                  <div class="flex items-start justify-between">
                    <h3 :class="[
                      'font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight',
                      isCompactView ? 'text-xs' : 'text-sm sm:text-base'
                    ]">
                      {{ isCompactView ? truncateText(space.name, 20) : space.name }}
                    </h3>
                    <div :class="[
                      'hidden sm:flex bg-primary/10 dark:bg-primary/20 rounded-full font-bold text-gray-900 dark:text-white flex-shrink-0',
                      isCompactView ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
                    ]">
                      {{ formatCurrencyValue(getStartingPrice(space)) }}
                      <span :class="[isCompactView ? 'text-[9px]' : 'text-xs', 'font-medium text-gray-700 dark:text-gray-300']">/{{ getPriceUnit(space.displayProductType || space.productType) }}</span>
                    </div>
                  </div>

                  <!-- Location & Rating Row -->
                  <div :class="[
                    'flex items-center justify-between',
                    isCompactView ? 'mt-1' : 'mt-1.5'
                  ]">
                    <div class="flex items-center text-gray-600 dark:text-gray-400" :class="isCompactView ? 'text-[10px]' : 'text-xs'">
                      <div class="p-0.5 bg-gray-100 dark:bg-gray-800 rounded-full mr-1.5 flex-shrink-0" v-if="!isCompactView">
                        <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <span class="truncate" :class="isCompactView ? 'max-w-[80px]' : 'max-w-[120px]'">{{ isCompactView ? truncateText(space.location, 15) : space.location }}</span>
                    </div>
                    
                    <div class="flex items-center">
                      <div class="flex text-yellow-400">
                        <svg v-for="star in (isCompactView ? 1 : 5)" :key="star" 
                          :class="[star <= space.rating ? 'fill-current' : 'stroke-current fill-none', isCompactView ? 'w-2.5 h-2.5' : 'w-3 h-3']" 
                          viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span :class="['ml-1 text-gray-600 dark:text-gray-400', isCompactView ? 'text-[10px]' : 'text-xs']">
                        {{ space.rating }}{{ !isCompactView ? ' (' + space.reviews + ')' : '' }}
                      </span>
                    </div>
                  </div>

                  <!-- Features/Facilities Row (Always shown) -->
                  <div :class="[
                    'border-t border-gray-200 dark:border-gray-700',
                    isCompactView ? 'mt-1 pt-1' : 'mt-2 pt-2'
                  ]">
                    <div class="flex flex-wrap gap-1">
                      <!-- Use default_facilities if available, then facilities, then features as fallbacks -->
                      <template v-if="space.default_facilities && space.default_facilities.length">
                        <span v-for="facility in space.default_facilities.slice(0, isCompactView ? 1 : 2)" :key="getFeatureKey(facility)"
                          :class="[
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          {{ getFeatureName(facility) }}
                        </span>
                        <span v-if="space.default_facilities.length > (isCompactView ? 1 : 2)"
                          :class="[
                            'bg-primary/10 dark:bg-primary/20 text-primary rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          +{{ space.default_facilities.length - (isCompactView ? 1 : 2) }}
                        </span>
                      </template>
                      <template v-else-if="space.facilities && space.facilities.length">
                        <span v-for="facility in space.facilities.slice(0, isCompactView ? 1 : 2)" :key="getFeatureKey(facility)"
                          :class="[
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          {{ getFeatureName(facility) }}
                        </span>
                        <span v-if="space.facilities.length > (isCompactView ? 1 : 2)"
                          :class="[
                            'bg-primary/10 dark:bg-primary/20 text-primary rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          +{{ space.facilities.length - (isCompactView ? 1 : 2) }}
                        </span>
                      </template>
                      
                      <!-- Fallback to features if no facilities available -->
                      <template v-else-if="space.features && space.features.length">
                        <span v-for="feature in space.features.slice(0, isCompactView ? 1 : 2)" :key="getFeatureKey(feature)"
                          :class="[
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          {{ getFeatureName(feature) }}
                        </span>
                        <span v-if="space.features.length > (isCompactView ? 1 : 2)"
                          :class="[
                            'bg-primary/10 dark:bg-primary/20 text-primary rounded-full font-medium',
                            isCompactView ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                          ]">
                          +{{ space.features.length - (isCompactView ? 1 : 2) }}
                        </span>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div :class="isCompactView ? 'mt-1.5' : 'mt-3'" class="relative z-10">
                  <!-- Desktop/Tablet Button -->
                  <button :class="[
                    'btn-primary w-full transition-transform duration-300 shadow-sm flex items-center justify-center gap-1.5',
                    isCompactView ? 'text-[10px] py-1 px-2 rounded-md' : 'text-xs py-2 px-3 rounded-lg hover:scale-105'
                  ]">
                    <svg :class="isCompactView ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ isCompactView ? 'Details' : 'View Details' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12 max-w-md mx-auto">
            <div class="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  :d="apiError ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' : 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {{ apiError ? 'Unable to load spaces' : 'No spaces found' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 text-base">
              {{ apiError 
                ? 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.' 
                : 'We couldn\'t find any spaces matching your criteria. Try adjusting your filters or search for something different.' 
              }}
            </p>
            <button @click="apiError ? loadSpaces() : clearAllFilters()" 
              class="btn-primary text-sm py-2.5 px-6 shadow-lg hover:scale-105 transition-all duration-300 flex items-center mx-auto gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  :d="apiError ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' : 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'" />
              </svg>
              {{ apiError ? 'Try Again' : 'Reset All Filters' }}
            </button>

            <!-- Suggestions from other locations -->
            <div v-if="filters.location && allSpaces.length > 0" class="mt-12">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 py-4 px-5 rounded-xl">
                <div class="bg-primary/20 dark:bg-primary/30 p-2 rounded-full sm:mr-3 mx-auto sm:mx-0">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div class="text-center sm:text-left">
                  <h4 class="text-base font-bold text-gray-900 dark:text-white">
                    Alternative Suggestions
                  </h4>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    We found some spaces in other locations that might interest you
                  </p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="space in allSpaces.filter(s => !filters.location || !s.location.toLowerCase().includes(filters.location.toLowerCase())).slice(0, 4)"
                  :key="space.id"
                  class="card overflow-hidden group cursor-pointer hover:shadow-xl dark:hover:shadow-dark-md transform hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-row animate-fadeIn"
                  @click="viewSpace(space.id, space.productType)">
                  
                  <!-- Image Section -->
                  <div class="relative w-1/3 overflow-hidden">
                    <img :src="getSpaceImage(space)" :alt="space.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div class="absolute top-2 left-2">
                      <span class="bg-primary text-black px-1.5 py-0.5 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm">
                        {{ formatSpaceType(space.productType) }}
                      </span>
                    </div>
                  </div>

                  <!-- Content Section -->
                  <div class="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                          {{ space.name }}
                        </h3>
                        <button @click.stop="toggleFavorite(space.id)"
                          :class="['ml-1 p-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm', isFavorite(space.id) ? 'text-red-500' : 'text-gray-400 dark:text-gray-500']">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <!-- Location -->
                      <div class="flex items-center text-gray-600 dark:text-gray-400 text-xs mt-1.5">
                        <svg class="w-3 h-3 mr-1 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span class="truncate max-w-[130px]">{{ space.location }}</span>
                      </div>

                      <!-- Rating and Price -->
                      <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-2 py-0.5">
                          <div class="flex text-yellow-400">
                            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span class="ml-1 text-xs text-gray-600 dark:text-gray-400 font-medium">{{ space.rating }}</span>
                        </div>
                        
                        <div class="bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white">
                          {{ formatCurrencyValue(getStartingPrice(space)) }}
                          <span class="text-[10px] font-normal">/{{ getPriceUnit(space.displayProductType || space.productType) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- View Details Button -->
                    <button class="mt-3 text-primary text-xs font-medium hover:underline flex items-center">
                      View details
                      <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Show More Button -->
              <div class="flex justify-center mt-6">
                <button @click="viewMoreSuggestions" 
                  class="bg-white dark:bg-gray-900 border border-primary text-primary px-5 py-2 rounded-full text-xs font-medium hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow">
                  <span>Show more suggestions</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
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
            <LocationDropdown
              v-model="editSearchForm.location"
              :locations="locations"
              :disabled="loadingLocations"
              placeholder="Select location"
              class="w-full"
            />
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
import type { SpaceDto } from '../dto/response';
import { apiManager } from '../api/apiManager'; // Import apiManager directly
import { sanitizeHtml } from '../utils/sanitizer';
import { formatPrice, formatCurrency } from '../utils/formatUtils';
import DualRangeSlider from '../components/DualRangeSlider.vue';
import SingleDatePicker from '../components/SingleDatePicker.vue';
import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue';
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue';
import logoImage from '@/assets/images/app-images/logo.png';
import LocationDropdown from '../components/LocationDropdown.vue';
import type { RouteLocationNormalizedLoaded, NavigationFailure, LocationQueryValue } from 'vue-router';

// Helper function to safely parse query parameters
const getQueryParam = (param: LocationQueryValue | LocationQueryValue[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0] || '';
  }
  return param || '';
};

// Class definitions
// Interface for the new facility features structure
// Define interfaces for better type safety
interface FeatureType {
  facility_id?: number;
  facility_name?: string;
  [key: string]: unknown;
}

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

  constructor(min = 0, max = 10000) {
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
    SpaceTypeDropdown,
    LocationDropdown
  },

  data() {
    const query: RouteLocationNormalizedLoaded['query'] = this.$route.query;
    const capacity = getQueryParam(query.capacity);
    const locationIdParam = getQueryParam(query.location_id);

    return {
      isLoading: false,
      isSearching: false,
      isFilterOpen: false,
      showEditSearch: false,
      isCompactView: false,
      // Keep isMobileSearchExpanded for backwards compatibility, but it's no longer used
      isMobileSearchExpanded: false, 
      showSortOptions: false,
      facilities: [] as Array<{ facility_id: number; facility_name: string; description?: string }>, // Available facilities from API
      loadingFacilities: false, // Track loading state for facilities
      locations: [] as Array<{ id: number; name: string; address: string; url: string }>, // Available locations from API
      loadingLocations: false, // Track loading state for locations
      sortOptions: [
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'availability', label: 'Availability' }
      ],
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
        query.minPrice ? parseInt(getQueryParam(query.minPrice), 10) : 0,
        query.maxPrice ? parseInt(getQueryParam(query.maxPrice), 10) : 10000
      ),
      selectedSpaceTypes: query.spaceType ? [getQueryParam(query.spaceType)] : [] as string[],
      selectedFacilities: query.facilities ? decodeURIComponent(getQueryParam(query.facilities)).split(',') : [] as string[],
      minRating: query.minRating ? getQueryParam(query.minRating) : '0',
      editSearchForm: new EditSearchForm(),
      allSpaces: [] as SpaceDto[],
      filteredSpaces: [] as SpaceDto[],
      sortedSpaces: [] as SpaceDto[],
      favoriteSpaceIds: [] as number[],
      apiError: false, // Track if API failed
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
      selectedLocationId: locationIdParam ? parseInt(locationIdParam, 10) : null,
     
    };
  },

  async mounted() {
    this.editSearchForm = {
      ...this.filters,
      date: this.filters.dateRange.startDate,
      timeRange: { start: this.filters.startTime || '', end: this.filters.endTime || '' }
    };
    
    // Load spaces, facilities, and locations in parallel
    await Promise.all([
      this.loadSpaces(),
      this.loadFacilities(),
      this.loadLocations()
    ]);
    
    this.applyFiltersAndSorting();
    
    // Add click outside listener for sort dropdown
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Clean up event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  },

  computed: {
    // Display spaces - just return sorted spaces without sample data
    displaySpaces(): SpaceDto[] {
      return [...this.sortedSpaces];
    },
    
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
      if (this.priceRange.min !== 0 || this.priceRange.max !== 10000) {
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
    sanitizeIcon(icon: string): string {
      return sanitizeHtml(icon);
    },
    
    formatCurrencyValue(price: any): string {
      // Use the imported function from formatUtils
      return formatCurrency(price);
    },
    
    formatPrice(price: any): string {
      return formatPrice(price);
    },
    async loadFacilities(): Promise<void> {
      try {
        this.loadingFacilities = true;
        // Call apiManager to get facilities from API
        const facilities = await apiManager.getFacilities();
        this.facilities = facilities;
        console.log('Loaded facilities:', facilities);
      } catch (error) {
        console.error('Error loading facilities:', error);
        this.facilities = [];
      } finally {
        this.loadingFacilities = false;
      }
    },

    async loadLocations(): Promise<void> {
      try {
        this.loadingLocations = true;
        // Call apiManager to get locations from API
        const locations = await apiManager.getLocations();
        this.locations = locations;
        console.log('Loaded locations:', locations);
      } catch (error) {
        console.error('Error loading locations:', error);
        this.locations = [];
      } finally {
        this.loadingLocations = false;
      }
    },
    
    toggleMobileSearch(): void {
      // For backward compatibility, open the combined filter sidebar
      this.isFilterOpen = true;
    },
    
    getFeatureKey(feature: FeatureType | string): string | number {
      if (typeof feature === 'object' && feature !== null && 'facility_id' in feature) {
        return feature.facility_id as number;
      }
      return typeof feature === 'string' ? feature : JSON.stringify(feature);
    },
    
    getFeatureName(feature: FeatureType | string): string {
      if (typeof feature === 'object' && feature !== null && 'facility_name' in feature) {
        return feature.facility_name as string;
      }
      return String(feature);
    },
    
    async loadSpaces(): Promise<void> {
      // Prevent multiple simultaneous calls
      if (this.isLoading) {
        return;
      }
      
      this.isLoading = true;
      try {
        // Create search parameters object directly for NetworkManager
        const searchParams: Record<string, unknown> = {};
        
        // Map location to location_id if needed
        if (this.selectedLocationId !== null) {
          searchParams.location_id = this.selectedLocationId;
        }
        
        // Map space type to the format expected by NetworkManager
        if (this.filters.spaceType) {
          searchParams.type = this.filters.spaceType;
        }
        
        // Send single date instead of start/end date range
        if (this.filters.dateRange.startDate) {
          searchParams.date = this.filters.dateRange.startDate;
        }
        
        // Send start and end times as separate fields
        if (this.filters.startTime) {
          searchParams.start_time = this.filters.startTime;
        }
        
        if (this.filters.endTime) {
          searchParams.end_time = this.filters.endTime;
        }
        
        // Add capacity filter
        if (this.filters.capacity) {
          searchParams.capacity = this.filters.capacity;
        }
        
        // Add price range filters
        if (this.priceRange.min !== 0 || this.priceRange.max !== 10000) {
          searchParams.min_daily_rate = this.priceRange.min;
          searchParams.max_daily_rate = this.priceRange.max;
        }
        
        // Add facilities filter
        if (this.selectedFacilities.length > 0) {
          // Make sure we send just the facility names, not objects
          searchParams.facilities = this.selectedFacilities.map((facility: FeatureType | string) => {
            // If it's already a string, use it directly
            if (typeof facility === 'string') {
              return facility;
            }
            // If it's an object with facility_name, extract the name
            if (typeof facility === 'object' && facility && 'facility_name' in facility) {
              return facility.facility_name;
            }
            // Fallback: convert to string
            return String(facility);
          });
          console.log('Selected facilities:', this.selectedFacilities);
        }
        
        // Add minimum rating filter
        if (this.minRating !== '0') {
          searchParams.min_rating = parseFloat(this.minRating);
        }
        
        console.log('Searching spaces with params:', searchParams);
        if (this.selectedFacilities.length > 0) {
          console.log('Selected facilities:', this.selectedFacilities);
        }
        
        // Call apiManager with the recommended getSpaces() method
        const response = await apiManager.getSpaces(searchParams);
        
        if (response.success) {
          this.allSpaces = response.spaces || [];
          this.apiError = false;
          console.log(`Loaded ${this.allSpaces.length} spaces:`, this.allSpaces);
        } else {
          console.error('Failed to load spaces:', response.message);
          this.allSpaces = [];
          this.apiError = true;
        }
      } catch (error) {
        console.error('Error loading spaces:', error);
        this.allSpaces = [];
        this.apiError = true;
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
      
      // Show all spaces from API without filtering
      this.filteredSpaces = [...this.allSpaces];
      
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
      const typeLower = (space.displayProductType || space.productType || '').toLowerCase();
      
      // Check if it's a meeting room (any format)
      if (typeLower.includes('meeting') || typeLower === 'meetingroom' || typeLower === 'meetingrooms') {
        // For meeting rooms, show hourly rate
        if (space.pricing?.hourly) return space.pricing.hourly;
        if (space.pricing?.daily) return Math.round(space.pricing.daily / 8);
        return 10; // Default price
      }
      
      // Check if it's a hot desk (any format)
      if (typeLower.includes('hot') || (typeLower.includes('desk') && !typeLower.includes('dedicated'))) {
        // For hot desks, show daily rate
        if (space.pricing?.daily) return space.pricing.daily;
        if (space.pricing?.hourly) return Math.round(space.pricing.hourly * 8);
        return 20; // Default price
      }
      
      // Check if it's a dedicated desk (any format)
      if (typeLower.includes('dedicated')) {
        // For dedicated desks, show monthly rate
        if (space.pricing?.monthly) return space.pricing.monthly;
        if (space.pricing?.daily) return Math.round(space.pricing.daily * 20);
        return 400; // Default price
      }
      
      // For any other type, try to get a meaningful price or use a placeholder
      if (space.pricing?.daily) return space.pricing.daily;
      if (space.pricing?.hourly) return Math.round(space.pricing.hourly * 8);
      if (space.pricing?.monthly) return Math.round(space.pricing.monthly / 20);
      return 25; // Default placeholder price
    },

    getPriceUnit(productType: string): string {
      if (!productType) return 'Per Day';
      
      const typeLower = productType.toLowerCase();
      
      // Check if it's a meeting room (any format)
      if (typeLower.includes('meeting') || typeLower === 'meetingroom' || typeLower === 'meetingrooms') {
        return 'Per Hour';
      }
      
      // Check if it's a dedicated desk (any format)
      if (typeLower.includes('dedicated')) {
        return 'Per Month';
      }
      
      // Check if it's a hot desk (any format)
      if (typeLower.includes('hot') || typeLower === 'hotdesk' || typeLower === 'hotdesks') {
        return 'Per Day';
      }
      
      // Default to Per Day for unknown types
      return 'Per Day';
    },

    getSpaceImage(space: SpaceDto): string {
      return space.images && space.images.length > 0
        ? space.images[0]
        : logoImage; // Use site logo as fallback instead of hardcoded image
    },

    formatSpaceType(type: string): string {
      // First, check if we have displayProductType available
      if (!type) return 'Space';
      
      const typeLower = type.toLowerCase();
      
      // Handle both kebab-case and raw API formats
      if (typeLower.includes('meeting') || typeLower === 'meetingroom' || typeLower === 'meetingrooms') {
        return 'Meeting Room';
      } else if (typeLower.includes('hot') || (typeLower.includes('desk') && !typeLower.includes('dedicated'))) {
        return 'Hot Desk';
      } else if (typeLower.includes('dedicated')) {
        return 'Dedicated Desk';
      }
      
      // Format any kebab-case string to Title Case
      return type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },

    formatSpaceTypeShort(type: string): string {
      if (!type) return 'Space';
      
      const typeLower = type.toLowerCase();
      
      // Handle both kebab-case and raw API formats
      if (typeLower.includes('meeting') || typeLower === 'meetingroom' || typeLower === 'meetingrooms') {
        return 'Meeting';
      } else if (typeLower.includes('hot') || (typeLower.includes('desk') && !typeLower.includes('dedicated'))) {
        return 'Hot Desk';
      } else if (typeLower.includes('dedicated')) {
        return 'Dedicated';
      }
      
      // Format any kebab-case string to Title Case (first word only)
      return type.split('-')[0].charAt(0).toUpperCase() + type.split('-')[0].slice(1);
    },
    
    truncateText(text: string, maxLength: number): string {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    toggleCompactView(): void {
      this.isCompactView = !this.isCompactView;
    },

    async clearAllFilters(): Promise<void> {
      this.priceRange = new PriceRange(0, 10000);
      this.selectedSpaceTypes = [];
      this.selectedFacilities = [];
      this.minRating = '0';
      this.selectedLocationId = null;
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
        facilities: this.selectedFacilities.length > 0 ? encodeURIComponent(this.selectedFacilities.join(',')) : undefined
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      try {
        await this.$router.replace({
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

    onLocationChange(location: any): void {
      if (location && location.id !== undefined) {
        this.selectedLocationId = location.id;
      } else {
        this.selectedLocationId = null;
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
          this.priceRange = new PriceRange(0, 10000);
          this.updateQueryAndReload();
          return;
        }
      }

      // Handle location filter
      if (filterToRemove.startsWith('Location: ')) {
        this.filters.location = '';
        this.editSearchForm.location = '';
        // Also clear location in the query if present
        if (this.$route.query.location) {
          this.$router.replace({
            query: { ...this.$route.query, location: undefined }
          });
        }
        this.applyFiltersAndSorting();
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
        this.isMobileSearchExpanded = false;
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
    
    viewMoreSuggestions(): void {
      // Navigate to search results with broader parameters
      const newFilters = new SearchFilters(
        '', // clear location
        this.filters.spaceType,
        this.filters.dateRange,
        this.filters.startTime,
        this.filters.endTime,
        this.filters.capacity
      );
      
      const queryParams: Record<string, string | number | null | undefined> = {
        spaceType: newFilters.spaceType,
        capacity: newFilters.capacity,
        startDate: newFilters.dateRange.startDate,
        endDate: newFilters.dateRange.endDate,
        startTime: newFilters.startTime,
        endTime: newFilters.endTime
      };
      
      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });
      
      this.$router.push({
        name: 'SearchResults',
        query: queryParams
      });
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
    },

    // Custom sort dropdown methods
    getSortLabel(sortValue: string): string {
      const option = this.sortOptions.find(opt => opt.value === sortValue);
      return option ? option.label : 'Price: Low to High';
    },
    
    selectSortOption(value: string): void {
      this.sortBy = value;
      this.showSortOptions = false;
      this.applySorting();
    },
    
    handleClickOutside(event: MouseEvent): void {
      // Close dropdowns when clicking outside
      const sortDropdown = this.$refs.sortDropdown as HTMLElement;
      const sortButton = event.target as HTMLElement;
      
      // Check if the click is outside both the dropdown and any sort buttons
      const isSortButtonClick = 
        sortButton.closest('button') && 
        sortButton.closest('button')?.getAttribute('class')?.includes('showSortOptions');
      
      if (!isSortButtonClick && (!sortDropdown || !sortDropdown.contains(event.target as Node))) {
        this.showSortOptions = false;
      }
    }
  },

  watch: {
    isFilterOpen(newVal) {
      // When the filter sidebar opens, sync the current filter values with the edit form
      if (newVal) {
        this.editSearchForm = {
          ...this.filters,
          date: this.filters.dateRange.startDate,
          timeRange: { 
            start: this.filters.startTime || '', 
            end: this.filters.endTime || '' 
          }
        };
      }
    },
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
        this.selectedFacilities = newQuery.facilities ? decodeURIComponent(getQueryParam(newQuery.facilities)).split(',') : [];
        this.minRating = newQuery.minRating ? getQueryParam(newQuery.minRating) : '0';
        this.priceRange = new PriceRange(
          newQuery.minPrice ? parseInt(getQueryParam(newQuery.minPrice), 10) : 0,
          newQuery.maxPrice ? parseInt(getQueryParam(newQuery.maxPrice), 10) : 10000
        );
        
        // Set selectedLocationId based on location_id from query or location name
        const locationIdParam = getQueryParam(newQuery.location_id);
        if (locationIdParam) {
          this.selectedLocationId = parseInt(locationIdParam, 10);
        } else {
          const locationName = getQueryParam(newQuery.location);
          if (locationName && this.locations.length > 0) {
            const location = this.locations.find(loc => loc.name === locationName);
            this.selectedLocationId = location ? location.id : null;
          } else {
            this.selectedLocationId = null;
          }
        }
        
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
        // If price range is back to default (0-10000), reload without price filter
        if (this.priceRange.min === 0 && this.priceRange.max === 10000) {
          this.updateQueryAndReload();
        } else {
          this.applyFilters();
        }
      },
      deep: true
    },
    selectedFacilities: {
      handler() {
        this.updateQueryAndReload();
      },
      deep: true
    },
    minRating: {
      handler() {
        this.updateQueryAndReload();
      }
    },
    selectedSpaceTypes: {
      handler() {
        this.updateQueryAndReload();
      },
      deep: true
    },
    sortBy() {
      this.applySorting();
    }
  }
});
</script>

<style scoped>
.card {
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.card:nth-child(3n) {
  margin-right: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Animation classes */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

/* Ensure mobile filter overlay appears correctly */
.combined-filter-search-overlay > div {
  transform: none !important;
  animation: slideInRight 0.3s ease-in-out;
  max-height: 100vh;
  overflow-y: auto;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.shadow-card {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.07), 0 2px 5px rgba(0, 0, 0, 0.06);
}

.dark .shadow-dark-card {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.3);
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
  border-color: var(--color-primary, #00FE01);
}

.dark .card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border-color: var(--color-primary, #00FE01);
}

.btn-primary {
  background-color: var(--color-primary, #00FE01);
  color: black;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Apply staggered animation to cards */
.grid > .card {
  animation-duration: 0.6s;
}

.grid > .card:nth-child(1) { animation-delay: 0.1s; }
.grid > .card:nth-child(2) { animation-delay: 0.2s; }
.grid > .card:nth-child(3) { animation-delay: 0.3s; }
.grid > .card:nth-child(4) { animation-delay: 0.4s; }
.grid > .card:nth-child(5) { animation-delay: 0.5s; }
.grid > .card:nth-child(6) { animation-delay: 0.6s; }

/* Custom styling for inputs */
.input-field {
  border-radius: 0.5rem;
  border: 1px solid #D1D5DB;
  transition: all 0.2s ease;
}

.dark .input-field {
  border-color: #374151 ;

}


.input-field:focus {

  box-shadow: none;
  outline: none;
}

.dark .input-field:focus {

  box-shadow: none;
  outline: none;
}

/* SpaceTypeDropdown select focus border (only for SearchResults page) */
select.input-field:focus {
  border-color: #111827;
  box-shadow: none;
  outline: none;
}
.dark select.input-field:focus {
  border-color: #fff;
  box-shadow: none;
  outline: none;
}

/* Sort dropdown styling */
.sort-select {
  color: #111827 !important; /* Black text in light mode */
}
.dark .sort-select {
  color: #00FE01 !important; /* Primary color in dark mode */
}
.sort-select option {
  color: #111827 !important;
  background-color: white !important;
}
.dark .sort-select option {
  color: #00FE01 !important;
  background-color: #1f2937 !important;
}

/* Custom dropdown animation and styling */
@keyframes fadeInDropdown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeInDropdown 0.2s ease-in-out forwards;
}

/* Compact view transitions */
.card {
  transition: all 0.3s ease-in-out;
}

/* Filter sidebar positioning (desktop) */
@media (min-width: 1024px) {
  /* Ensure proper flex layout for sidebar container */
  .lg\:w-1\/3 {
    position: relative;
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  
  .lg\:w-2\/3 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  
  .xl\:w-1\/4 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  
  .xl\:w-3\/4 {
    flex: 0 0 75%;
    max-width: 75%;
  }

  /* Media query for tablet/mobile view */
  @media (max-width: 1023px) {
    /* Only apply these styles to tablet and mobile */
    .combined-filter-search-overlay {
      padding-top: 16px !important;
    }
  }
  
  /* Adjust the sidebar max-width at different breakpoints */
  @media (min-width: 1024px) {
    .filters-sidebar {
      max-width: calc(33.333333% - 1.5rem);
    }
  }
  
  @media (min-width: 1280px) {
    .filters-sidebar {
      max-width: calc(25% - 1.5rem);
    }
  }

  .filters-sidebar {
   
    position: fixed;
    top: 12rem; /* Positioned below the search bar */
    width: inherit; /* Take the width from parent */
    max-width: calc(25% - 1.5rem); /* Match the parent width */
    height: calc(100vh - 8rem); /* Full viewport minus top position */
    min-height: 500px; /* Ensure minimum height for content */
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overscroll-behavior: contain;
    will-change: transform; /* Better performance */
    transform: translateZ(0); /* Hardware acceleration */
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    scrollbar-width: none;
    z-index: 30;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1rem; /* Reduced padding */
    font-size: 0.875rem; /* Smaller font size */
  }
  .filters-sidebar::-webkit-scrollbar { display: none; }
  
  .filters-sidebar h4 {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .filters-sidebar .mb-5 {
    margin-bottom: 1rem;
  }
}
</style>

