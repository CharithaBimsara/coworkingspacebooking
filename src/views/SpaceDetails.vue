<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20 sm:pb-24 lg:pb-0">
    <!-- Review Dialog -->
    <ReviewDialog 
      v-if="showReviewDialog && space" 
      :spaceId="space.id" 
      :spaceName="space.name"
      @close="showReviewDialog = false"
      @show-signup="handleShowSignup"
      @review-submitted="handleReviewSubmitted"
    />
    <!-- Loading State -->
    <div v-if="loading" class="max-w-8xl mx-auto px-2 sm:px-5 py-7">
      <div class="animate-pulse">
        <div class="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8"></div>
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
          </div>
          <div class="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-8xl mx-auto px-2 sm:px-5 py-7 text-center">
      <div class="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-card dark:shadow-dark-card border border-gray-100 dark:border-gray-800">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Space Not Found</h2>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <router-link to="/" class="btn-primary">
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Space Details Content -->
    <div v-else class="max-w-8xl mx-auto px-2 sm:px-5 py-7">
      <!-- Breadcrumb with improved navigation and visual feedback -->
      <nav class="flex items-center flex-wrap mb-4 py-2 px-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-gray-800">
        <router-link to="/" class="flex items-center hover:text-primary transition-colors text-xs font-medium text-gray-700 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </router-link>
        <div class="mx-2 text-gray-400 dark:text-gray-600 flex items-center">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <router-link :to="getCategoryRoute()" class="flex items-center hover:text-primary transition-colors text-xs font-medium text-gray-700 dark:text-gray-300" @click.prevent="goToSearchResults">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-if="productType === 'meeting-room'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else-if="productType === 'hot-desk'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ getCategoryName() }}
        </router-link>
        <div class="mx-2 text-gray-400 dark:text-gray-600 flex items-center">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <span class="text-gray-900 dark:text-white text-xs font-semibold flex items-center">
          {{ space?.name || 'Loading...' }}
        </span>
      </nav>

      <!-- Main Content Grid Layout - Enhanced for better responsiveness -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
        <!-- Left Column: Images and Features -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6 overflow-y-auto scrollbar-hide">
          <!-- Image Gallery Section with Enhanced Design and Responsive Layout -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-lg dark:shadow-dark-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div class="flex flex-col sm:flex-row gap-1">
              <!-- Main Image Display with enhanced visual design -->
              <div class="flex-1">
                <div class="relative w-full h-[300px] sm:h-[400px] md:h-[480px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 group shadow-inner">
                  <!-- Beautiful gradient overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                  
                  <img 
                    :src="getCurrentImage()" 
                    :alt="space?.name || 'Space'"
                    class="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  >
                  
                  <!-- Enhanced navigation controls -->
                  <button 
                    v-if="getImageCount() > 1"
                    @click="previousImage"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 z-20 group/btn"
                    aria-label="Previous image"
                  >
                    <svg class="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover/btn:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button 
                    v-if="getImageCount() > 1"
                    @click="nextImage"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 z-20 group/btn"
                    aria-label="Next image"
                  >
                    <svg class="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover/btn:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <!-- Beautiful image counter -->
                  <div class="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/20 dark:border-gray-700/50 z-20">
                    <span class="text-primary">{{ currentImageIndex + 1 }}</span> / {{ getImageCount() }}
                  </div>
                  
                  <!-- Enhanced space type badge -->
                  <div class="absolute top-4 left-4 bg-gradient-to-r from-primary to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm z-20 border border-white/20">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      {{ getCategoryName() }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Responsive Thumbnail Gallery -->
              <div v-if="getImageCount() > 1" class="flex flex-row sm:flex-col gap-1 w-full sm:w-24 md:w-28 p-1 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden scrollbar-thin">
                <div class="flex sm:flex-col gap-1">
                  <button 
                    v-for="(image, index) in getImages().slice(0, 5)" 
                    :key="index"
                    @click="currentImageIndex = index"
                    :class="[
                      'w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-20 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 border-2',
                      currentImageIndex === index 
                        ? 'border-primary shadow-lg shadow-primary/25 scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600'
                    ]"
                  >
                    <img 
                      :src="image" 
                      :alt="`${space?.name || 'Space'} image ${index + 1}`" 
                      class="w-full h-full object-cover transition-transform duration-300"
                    >
                  </button>
                  
                  <!-- Enhanced more images indicator -->
                  <div v-if="getImageCount() > 5" 
                    class="w-20 h-20 sm:w-24 sm:h-20 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex flex-col items-center justify-center cursor-pointer hover:from-primary/10 hover:to-primary/20 dark:hover:from-primary/20 dark:hover:to-gray-700 transition-all duration-300 flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-600 hover:border-primary"
                    @click="currentImageIndex = 5">
                    <span class="text-lg font-bold text-primary">+{{ getImageCount() - 5 }}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Features/Amenities Section with Modern Card Design -->
          <div v-if="productType !== 'hot-desk'" class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-dark-xl transition-all duration-300">
            <div class="flex items-center mb-5">
              <div class="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ productType === 'meeting-room' || productType === 'hot-desk' ? 'Room Features & Amenities' : 'Amenities & Features' }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Everything you need for a productive experience</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              <!-- Use default_facilities directly if available -->
              <div 
                v-for="(facility, index) in (space as any)?.default_facilities || space?.features || []" 
                :key="(typeof facility === 'object' && facility !== null) ? facility.facility_id || index : String(facility)"
                class="group flex items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                :class="{'from-primary/5 to-primary/10 dark:from-primary/10 dark:to-gray-700': index % 3 === 0}"
              >
                <div class="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40 flex items-center justify-center mr-3 md:mr-4 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <!-- Display SVG with dynamic path from API -->
                  <svg v-if="typeof facility === 'object' && facility !== null && facility.icon" 
                      class="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary group-hover:rotate-12 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      :d="facility.icon" />
                  </svg>
                  <!-- Fallback icon if no icon is provided -->
                  <svg v-else class="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white text-xs xs:text-sm group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 line-clamp-1">
                  {{ getFeatureName(facility) }}
                </span>
              </div>
              
              <!-- Enhanced empty state - more responsive -->
              <div v-if="(!((space as any)?.default_facilities && (space as any).default_facilities.length) && !(space?.features && space.features.length))" class="col-span-full flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                <p class="text-gray-500 dark:text-gray-400 text-center">
                  <span class="block text-lg font-medium mb-2">No amenities available</span>
                  <span class="text-sm">This space has no listed features or amenities</span>
                </p>
              
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Features Coming Soon</h4>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs px-4">We're working on adding detailed feature information for this space</p>
              </div>
            </div>
          </div>
          
          <!-- Ultra Modern Operating Hours Schedule Section - Only for meeting rooms and hot desks -->
          <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-dark-xl transition-all duration-300 overflow-hidden">
            <!-- Decorative background element -->
            
            <div class="relative z-10">
              <!-- Header with dynamic status -->
              <div class="flex flex-wrap items-center mb-6 gap-4">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center mr-3 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">Operating Hours</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">When you can book this space</p>
                  </div>
                </div>
                
                <!-- Animated status pill -->
                <div class="ml-auto">
                  <div v-if="isTodayOpen() && isWithinOperatingHours()" 
                      class="status-badge group flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400/90 to-primary/90 shadow-md shadow-emerald-500/20 dark:shadow-emerald-400/10">
                    <span class="relative flex h-3 w-3 mr-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span class="text-xs font-medium text-white group-hover:font-semibold transition-all">
                      Available
                    </span>
                  </div>
                  <div v-else-if="isTodayOpen()" 
                      class="status-badge flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-400/90 to-amber-500/90 shadow-md shadow-amber-500/20 dark:shadow-amber-400/10">
                    <span class="relative flex h-3 w-3 mr-2">
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span class="text-xs font-medium text-white">
                      Opens at {{ formatTime(getTodayHours()?.start_time) }}
                    </span>
                  </div>
                  <div v-else class="status-badge flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-400/90 to-gray-500/90 shadow-md shadow-gray-500/20 dark:shadow-gray-400/10">
                    <span class="relative flex h-3 w-3 mr-2">
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span class="text-xs font-medium text-white">
                      Closed Today
                    </span>
                  </div>
                </div>
              </div>

              <!-- Interactive Circular Week Display -->
              <div class="mb-8 relative">
                <div class="flex flex-wrap items-center justify-between mb-4">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    Weekly Schedule
                  </h4>
                  <div v-if="isTodayOpen()" class="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-medium text-primary border border-gray-200 dark:border-gray-700 shadow-sm">
                    {{ getCurrentDay() }}: {{ formatTime(getTodayHours()?.start_time) }} - {{ formatTime(getTodayHours()?.end_time) }}
                  </div>
                </div>
                
                <!-- Cute Day Bubbles -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                  <div v-for="day in operationSchedule" :key="day.day" 
                      class="day-card group cursor-pointer relative"
                      :class="[
                        'transition-all duration-300 rounded-2xl overflow-hidden',
                        day.is_enabled 
                          ? 'shadow-sm hover:shadow-lg' 
                          : 'opacity-85'
                      ]">
                    <div class="bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-800 p-3 h-full flex flex-col items-center justify-center relative">
                      <!-- Decorative elements -->
                      <div v-if="day.is_enabled" class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-100/30 to-transparent dark:from-emerald-900/20 rounded-full -translate-y-6 translate-x-6 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                      
                      <!-- Day indicator with dynamic styling -->
                      <div :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300',
                        getCurrentDay() === day.day
                          ? 'bg-primary shadow-md shadow-primary/20' 
                          : day.is_enabled 
                            ? 'bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30' 
                            : 'bg-gray-100 dark:bg-gray-700'
                      ]">
                        <span :class="[
                          'text-sm font-bold',
                          getCurrentDay() === day.day
                            ? 'text-white' 
                            : day.is_enabled 
                              ? 'text-primary dark:text-primary' 
                              : 'text-gray-400 dark:text-gray-500'
                        ]">{{ day.day ? day.day.substring(0, 2) : '' }}</span>
                      </div>
                      
                      <!-- Day name with hover effect -->
                      <span :class="[
                        'text-xs font-medium mb-1 transition-all group-hover:font-semibold',
                        day.is_enabled 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      ]">{{ day.day }}</span>
                      
                      <!-- Hours or closed indicator -->
                      <div v-if="day.is_enabled" 
                          class="w-full mt-1 text-center px-2 py-1 bg-gradient-to-r from-emerald-50 to-primary/5 dark:from-emerald-900/20 dark:to-primary/10 rounded-md group-hover:shadow-sm transition-all">
                        <span class="text-xs font-medium text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                          {{ formatTime(day.start_time) }} - {{ formatTime(day.end_time) }}
                        </span>
                      </div>
                      <div v-else class="w-full mt-1 text-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Closed</span>
                      </div>
                      
                      <!-- Today indicator -->
                      <div v-if="getCurrentDay() === day.day" class="absolute -top-1 -right-1">
                        <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Today's Interactive Timeline -->
              
            </div>
          </div>
          
          <!-- Enhanced Location & Access Section with Modern Design -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-dark-xl transition-all duration-300">
            <div class="flex items-center mb-5">
              <div class="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Location & Access</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Easy to find and access</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Interactive Map Component with Enhanced Design -->
              <div class="group">
                <!-- Location notification -->
                <div v-if="showLocationNotification" 
                     class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 text-sm font-medium flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span>No location map available</span>
                </div>
                <div class="relative h-48 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-primary/20"
                     @click="openLocationMap">
                  <!-- Beautiful animated background -->
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800">
                    <!-- Animated grid pattern -->
                    <div class="absolute inset-0 opacity-30 dark:opacity-20">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" class="text-primary/40" />
                      </svg>
                    </div>
                    
                    <!-- Floating decorative elements -->
                    <div class="absolute top-6 left-6 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg"></div>
                    <div class="absolute top-8 right-10 w-2 h-2 bg-primary/70 rounded-full animate-bounce delay-100"></div>
                    <div class="absolute bottom-10 left-10 w-2 h-2 bg-primary/80 rounded-full animate-ping delay-200"></div>
                    <div class="absolute bottom-6 right-6 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-300"></div>
                  </div>
                  
                  <!-- Enhanced animated map pin -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-all duration-500">
                    <div class="relative">
                      <!-- Pin shadow with animation -->
                      <div class="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black opacity-20 rounded-full blur-sm group-hover:w-10 transition-all duration-300"></div>
                      
                      <!-- Main pin with enhanced design -->
                      <div class="relative">
                        <div class="w-12 h-12 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full flex items-center justify-center shadow-2xl animate-bounce border-4 border-white dark:border-gray-800">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <!-- Enhanced pin point -->
                        <div class="w-4 h-4 bg-gradient-to-r from-primary to-primary/80 absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 border-2 border-white dark:border-gray-800"></div>
                        
                        <!-- Pulsing rings -->
                        <div class="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-30"></div>
                        <div class="absolute inset-0 rounded-full border-2 border-primary/70 animate-pulse opacity-40 delay-100"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enhanced hover overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div class="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/50 dark:border-gray-600/50">
                        <p class="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in Maps
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Floating action button -->
                  <div class="absolute bottom-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button @click.stop="openLocationMap" 
                            class="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Location Details with Enhanced Design -->
              <div class="space-y-4">
                <div class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                  <h4 class="font-bold text-gray-900 dark:text-white mb-3 text-base flex items-center">
                    <div class="w-3 h-3 bg-gradient-to-r from-primary to-emerald-400 rounded-full mr-3 animate-pulse shadow-lg"></div>
                    {{ space?.address || 'Location not specified' }}
                  </h4>
                  
                  
                 
                  
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Customer Reviews Section with Modern Design - Responsive -->
          <div id="reviews" class="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md sm:shadow-lg dark:shadow-dark-lg border border-gray-100 dark:border-gray-800 hover:shadow-lg sm:hover:shadow-xl dark:hover:shadow-dark-xl transition-all duration-300">
            <div class="flex items-center mb-4 sm:mb-5 md:mb-6">
              <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-md sm:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center justify-between">
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                 
                </div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Real experiences from our community</p>
              </div>
            </div>
            
            <!-- Enhanced Ratings Summary Card - Responsive -->
            <div class="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-primary/20 dark:border-primary/30 mb-4 sm:mb-5 md:mb-6 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <div class="flex items-baseline space-x-1 sm:space-x-2">
                    <span class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ space?.rating || 4.5 }}</span>
                    <span class="text-base sm:text-lg text-gray-500 dark:text-gray-400">/ 5</span>
                  </div>
                  <div class="flex text-yellow-400 mt-1 sm:mt-2 space-x-0.5 sm:space-x-1">
                    <svg v-for="star in 5" :key="star" :class="[
                      'w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300',
                      star <= (space?.rating || 4.5) ? 'fill-current scale-110 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600'
                    ]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Based on {{ reviews.length || 0 }} reviews</div>
                </div>
                
                <button
                 @click="showReviewDialog = true"
                class="px-4 py-2.5 text-sm font-semibold text-primary bg-white dark:bg-gray-800 border-2 border-primary rounded-xl hover:bg-primary hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Write Review
                  </span>
                </button>
              </div>
            </div>
            
            <!-- Modernized Reviews List -->
            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="(review, index) in reviews" :key="review.id" 
                   class="group bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                   :class="{'from-primary/5 to-primary/10 dark:from-primary/5 dark:to-gray-800': index % 3 === 0}">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <img :src="review.avatar" :alt="review.name" 
                         class="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md group-hover:ring-primary/40 transition-all duration-200"
                         @error="handleAvatarError">
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">{{ review.name }}</h4>
                      <div class="flex items-center">
                        <div class="flex text-primary space-x-0.5">
                          <svg v-for="star in 5" :key="star" :class="[
                            'w-3.5 h-3.5 transition-transform duration-200',
                            star <= review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'
                          ]" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span class="ml-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">{{ review.rating }}</span>
                      </div>
                    </div>
                    <div class="mt-2 bg-white/50 dark:bg-gray-800/50 rounded-md p-3 border-l-3 border-primary/70 shadow-sm">
                      <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Modernized empty state -->
              <div v-if="reviews.length === 0" class="text-center py-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/20 rounded-full flex items-center justify-center shadow-md">
                  <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-xs mx-auto">Be the first to share your experience with this space</p>
                <button 
                  @click="showReviewDialog = true"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-200 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Booking Widget - More Responsive -->
        <div class="lg:col-span-1 overflow-visible">
          <!-- Desktop version (visible only on large screens) -->
          <div class="hidden lg:block bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg dark:shadow-dark-lg border border-gray-50 dark:border-gray-800 booking-widget space-y-3 sm:space-y-4 sticky top-2 sm:top-3 md:top-4">
            <!-- Header with pricing badge -->
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-3">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 flex items-center">
                  {{ space?.name || 'Loading...' }}
                  <!-- <span class="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span> -->
                </h2>
                
                <div class="flex items-center text-sm text-gray-800 mb-2.5">
                  <div class="p-1 rounded-full bg-gray-100 mr-2">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span class="font-medium">{{ space?.location || 'Loading...' }}</span>
                </div>
                
                <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="flex items-center text-sm text-gray-600">
                  <div class="p-1 rounded-full bg-gray-100 mr-2">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span>Capacity: <strong>{{ space?.capacity || 0 }} people</strong></span>
                </div>
                
                <div v-else-if="productType === 'dedicated-desk'" class="flex items-center text-sm text-gray-600">
                  <div class="p-1 rounded-full bg-gray-100 mr-2">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span>Max Capacity: <strong>{{ space?.maxCapacity || space?.capacity || 0 }} seats</strong></span>
                </div>
              </div>
              
              <!-- Price badge with enhanced styling -->
              <div class="px-4 py-1 mt-1 bg-primary bg-opacity-10 border border-primary rounded-lg flex flex-row items-center">
                <span class="text-black font-bold text-lg dark:text-white">{{ getDisplayPrice() }}</span>
              </div>
            </div>

            <!-- Rating with interactive visual elements -->
            <div class="flex items-center bg-gray-50 p-3 rounded-lg">
              <div class="flex text-yellow-400">
                <svg v-for="star in 5" :key="star" :class="[
                  'w-5 h-5 transition-all', 
                  star <= (space?.rating || 0) ? 'fill-current' : 'text-gray-300',
                  star <= (space?.rating || 0) ? 'scale-105' : ''
                ]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2.5 font-bold text-gray-900 dark:text-white text-sm">{{ space?.rating || 0 }}</span>
              <span class="ml-1 text-gray-600 text-sm">({{ space?.reviews || 0 }} reviews)</span>
              
              <!-- Add quick-access review button -->
              <button @click="scrollToReviews" class="ml-auto text-xs font-medium text-primary hover:underline flex items-center">
                See reviews
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Description with collapsible option -->
            <div class="bg-gray-50 p-3 rounded-lg">
              <div :class="['transition-all duration-300 ease-in-out', { 'max-h-20 overflow-hidden': !isDescriptionExpanded, 'max-h-none': isDescriptionExpanded }]">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {{ space?.description || 'Loading description...' }}
                </p>
              </div>
              <button @click="isDescriptionExpanded = !isDescriptionExpanded" 
                      class="mt-1 text-xs font-medium text-primary hover:underline transition-colors">
                {{ isDescriptionExpanded ? 'Read less' : 'Read more' }}
              </button>
            </div>

            <!-- Enhanced Meeting Room Booking Form with better UI/UX - Responsive -->
            <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="space-y-3 sm:space-y-4">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Booking Details</h3>
              </div>
              
              <div class="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <!-- Date and Time Selection with improved visual cues -->
                <!-- Date selection (both meeting rooms and hot desks) -->
                <div class="grid mb-3" :class="{'grid-cols-2 gap-3': productType === 'meeting-room', 'grid-cols-1': productType === 'hot-desk'}">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Date
                    </label>
                    <SingleDatePicker
                      v-model="bookingForm.date"
                      placeholder="Select date"
                      :min-date="today"
                      @change="onDateChange"
                      class="compact-date-picker ultra-compact"
                    />
                    <!-- Availability message for hot desks -->
                    <div v-if="productType === 'hot-desk' && bookingForm.date && isHotDeskBooked" class="mt-2 text-xs text-red-600 dark:text-red-400">
                      This date is already booked
                    </div>
                    <div v-else-if="productType === 'hot-desk' && bookingForm.date && !isHotDeskBooked" class="mt-5 ml-2 text-xs text-green-600 dark:text-green-400">
                      Available for booking
                    </div>
                   
                  </div>
                  
                  <!-- Time selection (meeting rooms only) -->
                  <div v-if="productType === 'meeting-room'">
                    <label class="block text-sm font-medium text-gray-700 mb-3.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Time
                      <span v-if="!bookingForm.date" class="ml-2 text-xs text-amber-600 dark:text-amber-400 font-normal">
                        (Select date first)
                      </span>
                      <span v-else-if="isSelectedDateClosed" class="ml-2 text-xs text-amber-600 dark:text-amber-400 font-normal">
                        (Day is closed)
                      </span>
                    </label>
                    <div class="grid grid-cols-2 gap-2 relative">
                      <!-- Start Time Custom Dropdown (Compact) -->
                      <div class="relative">
                        <div 
                          @click="bookingForm.date && !isSelectedDateClosed && toggleStartDropdown()"
                          class="compact-select-field text-xs flex items-center justify-between px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors duration-200 h-7"
                          :class="{ 
                            'ring-1 ring-primary/20': showStartTimeDropdown,
                            'text-gray-500 dark:text-gray-400': !bookingForm.timeRange.start,
                            'cursor-pointer hover:border-primary': bookingForm.date && !isSelectedDateClosed,
                            'cursor-not-allowed opacity-60 bg-gray-50 dark:bg-gray-900': !bookingForm.date || isSelectedDateClosed
                          }"
                        >
                          <span v-if="bookingForm.timeRange.start" class="text-gray-900 dark:text-white whitespace-nowrap">
                            {{ formatTimeDisplay(bookingForm.timeRange.start) }}
                          </span>
                          <span v-else class="text-gray-500 dark:text-gray-400 whitespace-nowrap">Start</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <!-- Start Time Dropdown with compact styling -->
                        <div 
                          v-if="showStartTimeDropdown" 
                          class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-xs dark:shadow-dark-xs z-1000 mt-0.5 overflow-hidden"
                        >
                          <div class="max-h-32 overflow-y-auto custom-scrollbar-time overflow-x-hidden">
                            <!-- Full Day Option -->
                            <div
                              v-if="productType === 'meeting-room' || productType === 'hot-desk'"
                              @click="isFullDayAvailable() && selectFullDay()"
                              class="py-0.5 px-1.5 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center border-b border-gray-100 dark:border-gray-600"
                              :class="{
                                'opacity-50 cursor-not-allowed': !isFullDayAvailable(),
                                'hover:bg-gray-50': isFullDayAvailable()
                              }"
                            >
                              <div class="flex flex-col">
                                <span class="text-xs font-semibold text-primary">
                                  Full Day
                                </span>
                                <span class="text-[9px] text-gray-500 dark:text-gray-400">
                                  {{ selectedDateHours.start_time && selectedDateHours.end_time ? `${formatTimeDisplay(selectedDateHours.start_time!)} - ${formatTimeDisplay(selectedDateHours.end_time!)}` : 'Closed' }}
                                </span>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                            <!-- Full Day Unavailable Message -->
                            <div v-if="!isFullDayAvailable() && bookingForm.date && (productType === 'meeting-room' || productType === 'hot-desk')" class="px-3 py-1 text-[7px] text-red-500 text-center">
                              {{ isDateToday(bookingForm.date) ? 'day started' : 'booked' }}
                            </div>
                            <!-- Regular Time Slots -->
                            <div v-if="!bookingForm.date" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                              Select a date first
                            </div>
                            <div v-else-if="isSelectedDateClosed" class="px-3 py-2 text-xs text-amber-600 dark:text-amber-400 text-center">
                              This day is closed
                            </div>
                            <div
                              v-else
                              v-for="time in generateTimeSlots()" 
                              :key="time"
                              @click="selectStartTime(time)"
                              :class="[
                                'py-0.5 px-1.5 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center',
                                { 
                                  'opacity-50 cursor-not-allowed bg-gray-50': disabledTimes.start.includes(time)
                                }
                              ]"
                            >
                              <span class="text-xs truncate max-w-[50px] sm:max-w-[70px] md:max-w-[90px]" :class="{'text-gray-400': disabledTimes.start.includes(time), 'text-gray-700': !disabledTimes.start.includes(time)}">
                                {{ formatTimeDisplay(time) }}
                              </span>
                              <span v-if="disabledTimes.start.includes(time)" class="text-[7px] text-red-500 ml-0.5 whitespace-nowrap">
                                {{ isTimeBeforeCurrentTimeForToday(time) ? 'past' : 'booked' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- End Time Custom Dropdown (Compact) -->
                      <div class="relative">
                        <div 
                          @click="bookingForm.date && !isSelectedDateClosed && toggleEndDropdown()"
                          class="compact-select-field text-xs flex items-center justify-between px-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors duration-200 h-7"
                          :class="{ 
                            'ring-1 ring-primary/20': showEndTimeDropdown,
                            'text-gray-500 dark:text-gray-400': !bookingForm.timeRange.end,
                            'opacity-50 cursor-not-allowed': !bookingForm.timeRange.start || isFullDayBooking,
                            'cursor-pointer hover:border-primary': bookingForm.date && bookingForm.timeRange.start && !isFullDayBooking && !isSelectedDateClosed,
                            'cursor-not-allowed opacity-60 bg-gray-50 dark:bg-gray-900': !bookingForm.date || isSelectedDateClosed
                          }"
                        >
                          <span v-if="bookingForm.timeRange.end" class="text-gray-900 dark:text-white whitespace-nowrap">
                            {{ formatTimeDisplay(bookingForm.timeRange.end) }}
                          </span>
                          <span v-else class="text-gray-500 dark:text-gray-400 whitespace-nowrap">End</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <!-- End Time Dropdown with compact styling -->
                        <div 
                          v-if="showEndTimeDropdown && bookingForm.timeRange.start" 
                          class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-xs dark:shadow-dark-xs z-1000 mt-0.5 overflow-hidden"
                        >
                          <div class="max-h-32 overflow-y-auto custom-scrollbar-time overflow-x-hidden">
                            <div v-if="!bookingForm.timeRange.start" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                              Select a start time first
                            </div>
                            <div v-else-if="isSelectedDateClosed" class="px-3 py-2 text-xs text-amber-600 dark:text-amber-400 text-center">
                              This day is closed
                            </div>
                            <div
                              v-else
                              v-for="time in generateTimeSlots()" 
                              :key="time"
                              @click="selectEndTime(time)"
                              :class="[
                                'py-0.5 px-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center',
                                { 
                                  'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700': disabledTimes.end.includes(time)
                                }
                              ]"
                            >
                              <span class="text-xs truncate max-w-[50px] sm:max-w-[70px] md:max-w-[90px]" :class="{'text-gray-400 dark:text-gray-500': disabledTimes.end.includes(time), 'text-gray-700 dark:text-gray-300': !disabledTimes.end.includes(time)}">
                                {{ formatTimeDisplay(time) }}
                              </span>
                              <span v-if="disabledTimes.end.includes(time)" class="text-[7px] text-red-500 ml-0.5 whitespace-nowrap">
                                booked
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                 <!-- Closed day message -->
                    <div v-if="isSelectedDateClosed" class="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                     Sorry, we’re closed on this day
                    </div>

                <!-- Duration Display (Compact) -->
                <div v-if="bookingForm.timeRange.start && bookingForm.timeRange.end && calculateDurationInHours() > 0" 
                  class="text-center py-1 px-1.5 bg-green-50 rounded-md border border-green-100 mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-green-600 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium text-green-900">Duration: {{ calculateDurationInHours() }} hours</span>
                </div>

                <!-- Additional Facilities as Cards with visual enhancements -->
                <div v-if="productType === 'meeting-room' && availableFacilities.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-2 mt-5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Additional Amenities
                    <span v-if="!areFacilitiesEnabled" class="ml-2 text-xs text-amber-600 dark:text-amber-400 font-normal">
                      (Select date & time first)
                    </span>
                  </label>
                  
                  <!-- Loading skeleton -->
                  <div v-if="facilitiesLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 auto-rows-fr">
                    <div v-for="i in 5" :key="i" class="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-20">
                      <div class="mb-2 bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 mx-auto"></div>
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-1"></div>
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                  
                  <!-- Dynamic facilities from API -->
                  <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 auto-rows-fr">
                    <template v-if="availableFacilities.length > 0">
                      <label 
                        v-for="facility in availableFacilities" 
                        :key="facility.facility_id"
                        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 group min-h-[80px]" 
                        :class="[
                          selectedFacilities.includes(String(facility.facility_id)) ? 'ring-2 ring-primary' : 'border border-gray-200 dark:border-gray-700',
                          areFacilitiesEnabled ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600' : 'cursor-not-allowed opacity-60'
                        ]"
                      >
                        <input 
                          v-model="selectedFacilities" 
                          :value="String(facility.facility_id)" 
                          type="checkbox" 
                          class="sr-only"
                          :disabled="!areFacilitiesEnabled"
                        >
                        <div class="p-2 text-center">
                          <div class="mb-1 text-center rounded-full w-8 h-8 mx-auto flex items-center justify-center"
                               :class="areFacilitiesEnabled ? 'bg-gray-50 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'">
                            <svg 
                              class="w-4 h-4" 
                              :class="selectedFacilities.includes(String(facility.facility_id)) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path :d="facility.icon" />
                            </svg>
                          </div>
                          <span 
                            class="text-xs font-medium block break-words leading-tight" 
                            :class="selectedFacilities.includes(String(facility.facility_id)) ? 'text-primary' : 'text-gray-800 dark:text-gray-300'"
                          >
                            {{ facility.facility_name }}
                          </span>
                          <span class="text-xs font-medium block break-words leading-tight"
                                :class="areFacilitiesEnabled ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'">
                            +LKR {{ facilityPrice(facility) }}/hr
                          </span>
                        </div>
                        <div v-if="selectedFacilities.includes(String(facility.facility_id)) && areFacilitiesEnabled" class="absolute top-1 right-1">
                          <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        
                        <!-- Disabled overlay -->
                        <div v-if="!areFacilitiesEnabled" class="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            
                          </div>
                        </div>
                      </label>
                    </template>
                    
                    <!-- Fallback for when no facilities are available -->
                    <template v-else>
                      <div class="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p class="text-sm text-gray-500 dark:text-gray-400">No facilities available</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Price Calculation and Booking Button - For Meeting Rooms and Hot Desks -->
            <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <h4 class="font-medium text-gray-900 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Price Summary
              </h4>

              <div class="space-y-3">
                <div class="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div>
                    <span class="text-gray-800 text-sm font-medium">
                      {{ getSpaceTypeName() }}
                      <span v-if="calculateDurationInHours() > 0" class="text-gray-600 font-normal">
                        ({{ calculateDurationInHours() }} hour{{ calculateDurationInHours() > 1 ? 's' : '' }})
                      </span>
                      <span v-else class="text-amber-600 font-normal">
                        (Select time duration)
                      </span>
                    </span>
                    <div v-if="calculateDurationInHours() > 0" class="text-xs text-gray-500 mt-0.5">
                      LKR {{ getBasePricePerHour() }}/hour × {{ calculateDurationInHours() }} hour{{ calculateDurationInHours() > 1 ? 's' : '' }}
                    </div>
                    <div v-else class="text-xs text-gray-500 mt-0.5">
                      LKR {{ getBasePricePerHour() }}/hour
                    </div>
                  </div>
                  <span class="font-semibold text-sm">LKR {{ roomBasePrice }}</span>
                </div>

                <!-- Selected Facilities with enhanced styling -->
                <div v-if="selectedFacilities.length > 0" class="pt-1 pb-2">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Amenities</div>
                  <div v-for="facility in selectedFacilities" :key="typeof facility === 'object' ? (facility as Facility).facility_id || String(facility) : String(facility)"
                       class="flex items-center justify-between text-sm text-gray-600 mb-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{{ getFeatureName(facility) }}</span>
                    </div>
                    <span class="font-medium text-primary">+LKR {{ facilityPrice(facility) }} × {{ calculateDurationInHours() }}h = LKR {{ facilityPrice(facility) * calculateDurationInHours() }}</span>
                  </div>
                </div>

                <!-- Divider with visual enhancement -->
                <div class="relative py-3">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="px-2 bg-white text-xs text-gray-500">ORDER SUMMARY</span>
                  </div>
                </div>

                <!-- Total with visual emphasis -->
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span class="text-base font-bold text-gray-900">Total Amount</span>
                  <div class="text-right">
                    <span class="text-xl font-bold text-primary">LKR {{ totalPrice }}</span>
                  </div>
                </div>

                <!-- Payment info with enhanced visual cues -->
                <div class="flex items-start mt-2 bg-amber-50 dark:bg-gray-800 dark:border border-gray-800 border border-amber-100 rounded-md p-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-xs text-amber-800 dark:text-gray-100">
                    <span class="font-medium">Non-refundable booking.</span> Payment will be processed immediately upon confirmation.
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Action Buttons for Meeting Rooms and Hot Desks -->
            <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="space-y-3">
              <button
                @click="proceedToBooking"
                :disabled="!isBookingFormValid || isProcessing"
                class="w-full py-2 px-4 bg-primary text-white font-medium text-sm rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <span v-if="isProcessing" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Book Now</span>
              </button>

              <div class="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure payment process</span>
                <span class="mx-1">•</span>
                <span>Instant confirmation</span>
              </div>
            </div>

            <!-- Enhanced Dedicated Desk Booking Form -->
            <div v-else-if="productType === 'dedicated-desk'" class="space-y-3 sm:space-y-4 dedicated-desk-form">
              <!-- Enhanced Package Selection with visual improvements - Moved above subscription details -->
              <div class="subscription-plans">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                  Select Subscription Plan
                </label>
                
                <div class="grid grid-cols-2 gap-4">
                  <label class="relative overflow-hidden bg-white dark:!bg-gray-800 border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                         :class="selectedPackage === 'monthly' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 dark:bg-primary/10 scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-dark-md'">
                    <input v-model="selectedPackage" value="monthly" type="radio" class="sr-only">
                    <div class="p-4 text-center">
                      <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'monthly' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="mb-2">
                        <div class="text-base font-semibold text-gray-900 dark:text-white mb-1">Monthly Plan</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Flexible subscription</div>
                      </div>
                      <div class="text-xl font-bold text-primary mb-1">LKR {{ space?.pricing?.monthly || 2500 }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">per month</div>                     
                    </div>
                    
                    <div v-if="selectedPackage === 'monthly'" class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </label>
                  
                  <label class="relative overflow-hidden bg-white dark:!bg-gray-800 border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                         :class="selectedPackage === 'annual' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 dark:bg-primary/10 scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-dark-md'">
                    <input v-model="selectedPackage" value="annual" type="radio" class="sr-only">
                    <div class="p-4 text-center relative">
                      <div class="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-0.5 rounded-bl-lg rounded-tr-xl font-medium shadow-sm transform rotate-3">
                        Best Value
                      </div>
                      
                      <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'annual' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      
                      <div class="mb-2 mt-1">
                        <div class="text-base font-semibold text-gray-900 dark:text-white mb-1">Annual Plan</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Best savings</div>
                      </div>
                      <div class="text-xl font-bold text-primary mb-1">LKR {{ space?.pricing?.annual || 27000 }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">per year</div>
                      
                      <div class="mt-2 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full inline-flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-600 dark:text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs font-medium text-green-800 dark:text-green-300">Save LKR {{ getSavings() }}</span>
                      </div>                     
                    </div>
                    
                    <div v-if="selectedPackage === 'annual'" class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Subscription Details</h3>
              </div>
              
              <div class="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <!-- Date selection for dedicated desk -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start Date
                  </label>
                  <SingleDatePicker
                    v-model="bookingForm.date"
                    placeholder="Select start date"
                    :min-date="today"
                    @change="onDateChange"
                    class="compact-date-picker"
                  />
                </div>
                
                <!-- Duration Selection based on selected package -->
                <div v-if="selectedPackage" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ selectedPackage === 'monthly' ? 'Subscription Duration (Months)' : 'Subscription Duration (Years)' }}
                  </label>
                  <select 
                    v-model="selectedDuration" 
                    class="compact-select-field w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors duration-200"
                    @change="onDurationChange"
                  >
                    <option value="">Select duration</option>
                    <option v-for="option in getDurationOptions()" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  
                  <!-- Eye-catching Subscription End Date Display -->
                  <div v-if="subscriptionEndDate" class="mt-3 p-3 bg-gradient-to-r from-green-50 to-indigo-50 dark:from-green-900/20 dark:to-indigo-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
                    <div class="flex items-center justify-center space-x-2">
                     
                      <div class="text-center">
                        <div class="text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wide">Subscription Ends</div>
                        <div class="text-sm font-bold text-green-900 dark:text-green-100">{{ subscriptionEndDate }}</div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

            <!-- Enhanced Price Calculation - Only for dedicated desk -->
            <div class="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <h4 class="font-medium text-gray-900 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Price Summary
              </h4>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div>
                    <span class="text-gray-800 text-sm font-medium">
                      {{ getSpaceTypeName() }}
                      <!-- For dedicated desk, show subscription duration -->
                      <span v-if="selectedDuration" class="text-gray-600 font-normal">
                        ({{ getDurationDisplayText() }})
                      </span>
                      <!-- Show warning if duration not selected -->
                      <span v-else class="text-amber-600 font-normal">
                        (Select duration)
                      </span>
                    </span>
                    <!-- Price calculation for dedicated desk -->
                    <div v-if="selectedDuration" class="text-xs text-gray-500 mt-0.5">
                      LKR {{ getPackagePrice() / parseInt(selectedDuration) }}/{{ selectedPackage === 'monthly' ? 'month' : 'year' }} × {{ selectedDuration }} {{ selectedPackage === 'monthly' ? 'month' + (parseInt(selectedDuration) > 1 ? 's' : '') : 'year' + (parseInt(selectedDuration) > 1 ? 's' : '') }}
                    </div>
                    <!-- Show base price if duration not selected -->
                    <div v-else class="text-xs text-gray-500 mt-0.5">
                      LKR {{ getPackagePrice() / (selectedDuration ? parseInt(selectedDuration) : 1) }}/{{ selectedPackage === 'monthly' ? 'month' : 'year' }}
                    </div>
                  </div>
                  <span class="font-semibold text-sm">LKR {{ roomBasePrice }}</span>
                </div>
                
                <!-- Selected Facilities with enhanced styling -->
                <div v-if="selectedFacilities.length > 0" class="pt-1 pb-2">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Amenities</div>
                  <div v-for="facility in selectedFacilities" :key="typeof facility === 'object' ? (facility as Facility).facility_id || String(facility) : String(facility)" 
                       class="flex items-center justify-between text-sm text-gray-600 mb-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{{ getFeatureName(facility) }}</span>
                    </div>
                    <span class="font-medium text-primary">+LKR {{ facilityPrice(facility) }} × {{ calculateDurationInHours() }}h = LKR {{ facilityPrice(facility) * calculateDurationInHours() }}</span>
                  </div>
                </div>
                
                <!-- Divider with visual enhancement -->
                <div class="relative py-3">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="px-2 bg-white text-xs text-gray-500">ORDER SUMMARY</span>
                  </div>
                </div>
                
                <!-- Total with visual emphasis -->
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span class="text-base font-bold text-gray-900">Total Amount</span>
                  <div class="text-right">
                    <span class="text-xl font-bold text-primary">LKR {{ totalPrice }}</span>
                  </div>
                </div>
                
                <!-- Payment info with enhanced visual cues -->
                <div class="flex items-start mt-2 bg-amber-50 dark:bg-gray-800 dark:border border-gray-800 border border-amber-100 rounded-md p-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-xs text-amber-800 dark:text-gray-100">
                    <span class="font-medium ">Non-refundable booking.</span> Payment will be processed immediately upon confirmation.
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Action Buttons -->
            <div class="space-y-3">
              <button
                @click="proceedToSubscription"
                :disabled="!isSubscriptionFormValid || isProcessing"
                class="w-full py-2 px-4 bg-primary text-white font-medium text-sm rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <span v-if="isProcessing" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Subscribe Now</span>
              </button>
              
              <div class="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure payment process</span>
                <span class="mx-1">•</span>
                <span>Instant confirmation</span>
              </div>
            </div>
            
              <p class="text-xs text-gray-500 text-center mt-1">
                {{ currentUser ? 'Ready to subscribe' : 'Login required for subscriptions' }}
              </p>

           
          </div>
        </div>
      </div>
      </div>
      
      <!-- Product Information Sections -->
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <!-- Other sections will go here -->
        </div>   
      </div>
    </div>

    <!-- Modern Mobile/Tablet Booking Button (fixed at bottom) -->
    <div class="lg:hidden fixed bottom-4 left-0 right-0 z-40 px-4">
      <div class="relative">
        <!-- Floating price indicator -->
        <div class="absolute -top-8 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-t-lg shadow-lg border border-gray-100 dark:border-gray-700 transform translate-y-1">
          <span class="font-bold text-primary text-sm">{{ getDisplayPrice() }}</span>
        </div>
        
        <!-- Modern button with glassmorphism effect -->
        <button 
          @click="showMobileBookingModal = true" 
          class="flex items-center justify-between w-full rounded-xl backdrop-blur-md 
            bg-gradient-to-r from-primary/90 to-primary/80 py-3.5 px-6 text-black dark:text-white 
            font-semibold shadow-lg border border-primary/30 transition-all duration-300
            transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div class="flex items-center space-x-2">
            <span class="bg-white dark:bg-gray-900 p-1.5 rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <div class="flex flex-col">
              <span class="font-bold text-base">Book Now</span>
              <span class="text-xs opacity-90">Instant confirmation</span>
            </div>
          </div>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Booking Modal -->
    <div
      v-if="showMobileBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end lg:hidden"
      @click.self="showMobileBookingModal = false"
    >
      <div 
        class="bg-white dark:bg-gray-900 rounded-t-xl p-5 shadow-lg dark:shadow-dark-lg border-t border-x border-gray-50 dark:border-gray-800 space-y-3 sm:space-y-4 max-h-[90vh] overflow-y-auto booking-modal-slide-up"
      >
        <!-- Minimalist Modal Header with only close button -->
        <div class="flex justify-end">
          <button 
            @click="showMobileBookingModal = false"
            class="rounded-full p-2 bg-white dark:bg-gray-800 text-primary hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-black focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700"
            aria-label="Close booking modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Header with pricing badge -->
          <div class="flex items-start justify-between">
            <div class="flex-1 pr-3">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ space?.name }}</h2>
              <div class="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">{{ space?.location }}</span>
              </div>
            </div>
            <div class="bg-primary/10 dark:bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-bold">
              {{ getDisplayPrice() }}
            </div>
          </div>        <!-- Meeting Room and Hot Desk Booking Form -->
        <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="space-y-3">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Booking Details</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <!-- Date and Time Selection -->
            <div class="grid grid-cols-1 gap-3 mb-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date
                </label>
                <SingleDatePicker
                  v-model="bookingForm.date"
                  placeholder="Select date"
                  :min-date="today"
                  @change="onDateChange"
                  class="compact-date-picker w-full"
                />
                <!-- Availability message for hot desks -->
                <div v-if="productType === 'hot-desk' && bookingForm.date && isHotDeskBooked" class="mt-2 text-xs text-red-600 dark:text-red-400">
                  This date is already booked
                </div>
                <div v-else-if="productType === 'hot-desk' && bookingForm.date && !isHotDeskBooked" class="mt-2 text-xs text-green-600 dark:text-green-400">
                  Available for booking
                </div>
              </div>
              
              <!-- Time selection (meeting rooms only) -->
              <div v-if="productType === 'meeting-room'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time
                </label>
                <!-- Use the same time picker as desktop for consistent behavior -->
                <div class="grid grid-cols-2 gap-2 relative">
                  <!-- Start Time Dropdown -->
                  <div class="relative">
                    <div 
                      @click="toggleStartDropdown"
                      class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 px-2.5 py-2 w-full cursor-pointer"
                      :class="{
                        'ring-2 ring-primary/20': showStartTimeDropdown,
                        'text-gray-500 dark:text-gray-400': !bookingForm.timeRange.start
                      }"
                    >
                      <span v-if="bookingForm.timeRange.start" class="text-xs text-gray-900 dark:text-white">
                        {{ formatTimeDisplay(bookingForm.timeRange.start) }}
                      </span>
                      <span v-else class="text-xs text-gray-500 dark:text-gray-400">Start Time</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" :class="{'text-primary transform rotate-180': showStartTimeDropdown}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    <!-- Start Time Dropdown with unified styling -->
                    <div 
                      v-if="showStartTimeDropdown" 
                      class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-dark-lg z-1000 mt-0.5 overflow-hidden"
                    >
                      <div class="max-h-48 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        <div v-if="!bookingForm.date" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                          Select a date first
                        </div>
                        <div v-else-if="generateTimeSlots().length === 0" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                          No available times
                        </div>
                        <!-- Full Day Option for Mobile -->
                        <div
                          v-else-if="productType === 'meeting-room' || productType === 'hot-desk'"
                          @click="isFullDayAvailable() && selectFullDay()"
                          class="py-2 px-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center border-b border-gray-100 dark:border-gray-600"
                          :class="{
                            'opacity-50 cursor-not-allowed': !isFullDayAvailable(),
                            'hover:bg-gray-50 dark:hover:bg-gray-700': isFullDayAvailable()
                          }"
                        >
                          <div class="flex flex-col">
                            <span class="text-sm font-semibold text-primary">
                              Full Day
                            </span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                              {{ getTodayHours().start_time && getTodayHours().end_time ? `${formatTimeDisplay(getTodayHours().start_time!)} - ${formatTimeDisplay(getTodayHours().end_time!)}` : 'Closed' }}
                            </span>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <!-- Full Day Unavailable Message for Mobile -->
                        <div v-if="!isFullDayAvailable() && bookingForm.date && (productType === 'meeting-room' || productType === 'hot-desk')" class="px-3 py-1 text-[8px] text-red-500 text-center">
                          {{ isDateToday(bookingForm.date) ? 'day started' : 'booked' }}
                        </div>
                        <div
                          v-for="time in generateTimeSlots()" 
                          :key="time"
                          @click="selectStartTime(time)"
                          :class="[
                            'py-1.5 px-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center',
                            bookingForm.timeRange.start === time ? 'bg-primary/10 text-primary' : '',
                            { 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700': disabledTimes.start.includes(time) }
                          ]"
                        >
                          <span class="text-xs" :class="{'text-gray-400 dark:text-gray-500': disabledTimes.start.includes(time), 'text-gray-700 dark:text-gray-300': !disabledTimes.start.includes(time)}">
                            {{ formatTimeDisplay(time) }}
                          </span>
                          <span v-if="disabledTimes.start.includes(time)" class="text-[7px] text-red-500 ml-0.5 whitespace-nowrap">
                            {{ isTimeBeforeCurrentTimeForToday(time) ? 'past' : 'booked' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- End Time Dropdown -->
                  <div class="relative">
                    <div 
                      @click="toggleEndDropdown"
                      class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 px-2.5 py-2 w-full cursor-pointer"
                      :class="{
                        'ring-2 ring-primary/20': showEndTimeDropdown,
                        'text-gray-500 dark:text-gray-400': !bookingForm.timeRange.end,
                        'opacity-50 cursor-not-allowed': !bookingForm.timeRange.start || isFullDayBooking
                      }"
                    >
                      <span v-if="bookingForm.timeRange.end" class="text-xs text-gray-900 dark:text-white">
                        {{ formatTimeDisplay(bookingForm.timeRange.end) }}
                      </span>
                      <span v-else class="text-xs text-gray-500 dark:text-gray-400">End Time</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" :class="{'text-primary transform rotate-180': showEndTimeDropdown}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    <!-- End Time Dropdown with unified styling -->
                    <div 
                      v-if="showEndTimeDropdown && bookingForm.timeRange.start && !isFullDayBooking" 
                      class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-dark-lg z-1000 mt-0.5 overflow-hidden"
                    >
                      <div class="max-h-48 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        <div v-if="!bookingForm.timeRange.start" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                          Select a start time first
                        </div>
                        <div
                          v-for="time in generateTimeSlots()" 
                          :key="time"
                          @click="selectEndTime(time)"
                          :class="[
                            'py-1.5 px-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center',
                            bookingForm.timeRange.end === time ? 'bg-primary/10 text-primary' : '',
                            { 
                              'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700': disabledTimes.end.includes(time) || shouldDisableEndTime(time)
                            }
                          ]"
                        >
                          <span class="text-xs" :class="{'text-gray-400 dark:text-gray-500': disabledTimes.end.includes(time) || shouldDisableEndTime(time), 'text-gray-700 dark:text-gray-300': !disabledTimes.end.includes(time) && !shouldDisableEndTime(time)}">
                            {{ formatTimeDisplay(time) }}
                          </span>
                          <span v-if="disabledTimes.end.includes(time)" class="text-[7px] text-red-500 ml-0.5 whitespace-nowrap">
                            booked
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Duration Display -->
            <div v-if="bookingForm.timeRange.start && bookingForm.timeRange.end && calculateDurationInHours() > 0" 
              class="text-center py-1 px-1.5 bg-green-50 dark:bg-green-900/30 rounded-md border border-green-100 dark:border-green-800 mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-green-600 dark:text-green-400 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs font-medium text-green-700 dark:text-green-300">Duration: {{ calculateDurationInHours() }} hour(s)</span>
            </div>

              <!-- Enhanced Facilities Selection - Using dynamic data -->
            <div v-if="productType === 'meeting-room'" class="space-y-2 mb-4">
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Additional Facilities
                </label>
              </div>
              
              <!-- Dynamic facility cards based on availableFacilities -->
              <div class="grid grid-cols-3 gap-2">
                <label v-for="facility in availableFacilities" :key="facility.facility_id"
                      class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg cursor-pointer transition-all duration-300 group" 
                      :class="selectedFacilities.includes(String(facility.facility_id)) ? 'ring-2 ring-primary' : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'">
                  <input v-model="selectedFacilities" :value="String(facility.facility_id)" type="checkbox" class="sr-only">
                  <div class="p-2 text-center">
                    <div class="mb-1 text-center bg-gray-50 dark:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                      <svg class="w-4 h-4" :class="selectedFacilities.includes(String(facility.facility_id)) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v10a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 14.5v-10z" />
                      </svg>
                    </div>
                    <span class="text-xs font-medium block" :class="selectedFacilities.includes(String(facility.facility_id)) ? 'text-primary' : 'text-gray-800 dark:text-gray-300'">{{ getFeatureName(facility) }}</span>
                    <span class="text-xs font-medium text-green-600 block">+LKR {{ facilityPrice(facility) }}</span>
                  </div>
                  <div v-if="selectedFacilities.includes(String(facility.facility_id))" class="absolute top-1 right-1">
                    <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </label>
                
                <!-- Fallback if no facilities available -->
                <div v-if="availableFacilities.length === 0" class="col-span-3 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No additional facilities available for this space
                </div>
              </div>
            </div>            <!-- Price Summary -->
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
              <div class="flex justify-between mb-1">
                <span class="text-xs text-gray-600 dark:text-gray-400">Base price</span>
                <span class="text-xs font-medium text-gray-800 dark:text-gray-200">LKR {{ roomBasePrice }}</span>
              </div>
              
              <!-- Selected Facilities with detailed breakdown -->
              <div v-if="selectedFacilities.length > 0">
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-2 mb-1">Selected Amenities:</div>
                <div v-for="facility in selectedFacilities" :key="typeof facility === 'object' ? (facility as Facility).facility_id || String(facility) : String(facility)" 
                     class="flex items-center justify-between mb-1 pl-2 text-xs">
                  <span class="text-gray-700 dark:text-gray-300">{{ getFeatureName(facility) }}</span>
                  <span class="font-medium text-gray-800 dark:text-gray-200">
                    +LKR {{ facilityPrice(facility) }} × {{ calculateDurationInHours() }}h
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between mb-1 mt-2" v-if="facilitiesPrice > 0">
                <span class="text-xs text-gray-600 dark:text-gray-400">Facilities Total</span>
                <span class="text-xs font-medium text-gray-800 dark:text-gray-200">+LKR {{ facilitiesPrice }}</span>
              </div>
              
              <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                <span class="text-lg font-bold text-primary">LKR {{ totalPrice }}</span>
              </div>
            </div>
            
            <!-- Book Now Button -->
            <button 
              @click="proceedToBooking"
              :disabled="!isBookingFormValid || isProcessing"
              class="w-full mt-3 py-2.5 px-4 bg-primary text-white font-medium text-sm rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Book Now</span>
            </button>
          </div>
        </div>
        
        <!-- Dedicated Desk Booking Form -->
        <div v-else-if="productType === 'dedicated-desk'" class="space-y-3">
          <!-- Enhanced Package Selection with visual improvements - Moved above subscription details -->
          <div class="subscription-plans">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              Select Subscription Plan
            </label>
            
            <div class="grid grid-cols-2 gap-4">
              <label class="relative overflow-hidden bg-white dark:!bg-gray-800 border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                     :class="selectedPackage === 'monthly' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 dark:bg-primary/10 scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-dark-md'">
                <input v-model="selectedPackage" value="monthly" type="radio" class="sr-only">
                <div class="p-4 text-center">
                  <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'monthly' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="mb-2">
                    <div class="text-base font-semibold text-gray-900 dark:text-white mb-1">Monthly Plan</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Flexible subscription</div>
                  </div>
                  <div class="text-xl font-bold text-primary mb-1">LKR {{ space?.pricing?.monthly || 2500 }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">per month</div>
                  
                  <div class="mt-3 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <ul class="space-y-1.5">
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        sample
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Cancel anytime
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div v-if="selectedPackage === 'monthly'" class="absolute top-3 right-3">
                  <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </label>
              
              <label class="relative overflow-hidden bg-white dark:!bg-gray-800 border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                     :class="selectedPackage === 'annual' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 dark:bg-primary/10 scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-dark-md'">
                <input v-model="selectedPackage" value="annual" type="radio" class="sr-only">
                <div class="p-4 text-center relative">
                  <div class="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-0.5 rounded-bl-lg rounded-tr-xl font-medium shadow-sm transform rotate-3">
                    Best Value
                  </div>
                  
                  <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'annual' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div class="mb-2 mt-1">
                    <div class="text-base font-semibold text-gray-900 dark:text-white mb-1">Annual Plan</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Best savings</div>
                  </div>
                  <div class="text-xl font-bold text-primary mb-1">LKR {{ space?.pricing?.annual || 27000 }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">per year</div>
                  
                  <div class="mt-2 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-600 dark:text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs font-medium text-green-800 dark:text-green-300">Save LKR {{ getSavings() }}</span>
                  </div>
                  
                  <div class="mt-3 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <ul class="space-y-1.5">
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        2 months free
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Priority access
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div v-if="selectedPackage === 'annual'" class="absolute top-3 right-3">
                  <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Subscription Details</h3>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <!-- Date selection for dedicated desk -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Start Date
              </label>
              <SingleDatePicker
                v-model="bookingForm.date"
                placeholder="Select start date"
                :min-date="today"
                @change="onDateChange"
                class="compact-date-picker w-full"
              />
            </div>
            
            <!-- Duration Selection based on selected package -->
            <div v-if="selectedPackage" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ selectedPackage === 'monthly' ? 'Subscription Duration (Months)' : 'Subscription Duration (Years)' }}
              </label>
              <select 
                v-model="selectedDuration" 
                class="compact-select-field w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors duration-200"
                @change="onDurationChange"
              >
                <option value="">Select duration</option>
                <option v-for="option in getDurationOptions()" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Eye-catching Subscription End Date Display for Mobile -->
              <div v-if="subscriptionEndDate" class="mt-3 p-3 bg-gradient-to-r from-green-50 to-indigo-50 dark:from-green-900/20 dark:to-indigo-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
                <div class="flex items-center justify-center space-x-2">
                 
                  <div class="text-center">
                    <div class="text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wide">Subscription Ends</div>
                    <div class="text-sm font-bold text-green-900 dark:text-green-100">{{ subscriptionEndDate }}</div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <!-- Total Price Display -->
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
              <!-- Base price -->
              <div class="flex justify-between mb-2">
                <div class="flex items-center">
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    {{ getSpaceTypeName() }}
                    <span v-if="calculateDurationInHours() > 0" class="text-gray-500">({{ calculateDurationInHours() }}h)</span>
                  </span>
                </div>
                <span class="text-xs font-medium text-gray-800 dark:text-gray-200">LKR {{ roomBasePrice }}</span>
              </div>
              
              <!-- Detail for base price calculation if applicable -->
              <div v-if="calculateDurationInHours() > 0" class="text-[10px] text-gray-500 mb-2 -mt-1 pl-2">
                LKR {{ space?.pricing?.hourly || 85 }}/hour × {{ calculateDurationInHours() }} hours
              </div>
              
              <!-- Selected Facilities with price breakdown -->
              <div v-if="selectedFacilities.length > 0" class="border-t border-gray-200 dark:border-gray-600 pt-2 mb-2">
                <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Selected Facilities</div>
                <div v-for="facility in selectedFacilities" :key="facility" 
                    class="flex justify-between items-center mb-1.5 pl-2">
                  <span class="text-xs text-gray-700 dark:text-gray-300">{{ getFeatureName(facility) }}</span>
                  <span class="text-xs font-medium text-gray-800 dark:text-gray-200">
                    +LKR {{ facilityPrice(facility) }} × {{ calculateDurationInHours() }}h = LKR {{ facilityPrice(facility) * calculateDurationInHours() }}
                  </span>
                </div>
              </div>
              
              <!-- Subscription duration -->
              <div class="flex justify-between mb-1">
                <span class="text-xs text-gray-600 dark:text-gray-400">Duration</span>
                <span class="text-xs font-medium text-gray-800 dark:text-gray-200">{{ getDurationDisplayText() }}</span>
              </div>
              
              <!-- Total price with highlighted display -->
              <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                <div class="text-right">
                  <span class="text-lg font-bold text-primary">LKR {{ totalPrice }}</span>
                </div>
              </div>
            </div>
            
            <!-- Subscribe Now Button -->
            <button 
              @click="proceedToSubscription"
              :disabled="!isSubscriptionFormValid || isProcessing"
              class="w-full py-2 px-4 bg-primary text-white font-medium text-sm rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Subscribe Now</span>
            </button>
          </div>
        </div>
      </div>
    </div> -->
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SingleDatePicker from '../components/SingleDatePicker.vue'
import TeamSizeDropdown from '../components/TeamSizeDropdown.vue'
import { useRouter } from 'vue-router'
import { apiManager, ApiManager } from '../api/apiManager'
import { logger } from '../utils/logger'
import type { SpaceDto, ReviewDto, UserDto, RawSpaceApiResponse } from '../dto/response'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import ReviewDialog from '../components/ReviewDialog.vue'

// Facility interface for the new API response format
interface Facility {
  facility_id: number;
  facility_name: string;
  hourly_price?: number;
  icon?: string;
}

interface ApiRating {
  first_name?: string;
  user_id?: number;
  user_avatar?: string;
  value?: number;
  review_description?: string;
  rating?: number;
  comment?: string;
  user?: string;
}

interface SubmittedReview {
  first_name: string;
  value: number;
  review_description: string;
  user_avatar?: string;
}

interface OperationDay {
  day: string;
  is_enabled: boolean;
  start_time?: string;
  end_time?: string;
}

interface BookingForm {
  date: string | undefined
  timeRange: { start: string; end: string }
  teamSize: string
}

export default defineComponent({
  name: 'SpaceDetails',
  
  components: {
    SingleDatePicker,
    TeamSizeDropdown,
    ReviewDialog
  },
  
  data() {
    return {
      loading: true,
      error: '',
      isProcessing: false,
      currentImageIndex: 0,
      showGallery: false,
      showMobileBookingModal: false,
      showReviewDialog: false,
      showLocationNotification: false,
      operationSchedule: [] as OperationDay[],
      currentUser: null as UserDto | null,
      productType: 'meeting-room',
      isLoadingAvailability: false,
      isLoadingBookedSlots: false,
      isHotDeskBooked: false, // Flag to track if a hot desk is already booked for the selected date
      isDescriptionExpanded: false, // Track if description is expanded
      featureNameCache: new Map(), // Cache for feature names to ensure consistency
      bookedTimeSlots: [] as Array<{ startTime: string; endTime: string }>,
      disabledTimes: {
        start: [] as string[],
        end: [] as string[]
      },
      
      // Available time slots
      availableTimes: {
        start: [] as string[],
        end: [] as string[]
      },
      
      // Custom dropdown states
      showStartTimeDropdown: false,
      showEndTimeDropdown: false,
      
      // Form data
      bookingForm: {
        date: undefined,
        timeRange: { start: '09:00', end: '10:00' },
        teamSize: '1-5'
      } as BookingForm,
      selectedFacilities: [] as (string | number)[],
      selectedPackage: 'monthly',
      selectedDuration: '',
      isFullDayBooking: false, // Track if current booking is full day
      
      // Space data from API
      space: null as SpaceDto | null,
      reviews: [] as ReviewDto[],
      
      // Facilities data from API
      availableFacilities: [] as Array<{ facility_id: number; facility_name: string; hourly_price?: number; icon?: string }>,
      facilitiesLoading: false,     
      
    }
  },  
  watch: {
    '$route': 'loadSpaceDetails',
    
    // Clear selected facilities when date/time becomes incomplete
    'bookingForm.date': function() {
      if (!this.isBookingFormValid && this.selectedFacilities.length > 0) {
        this.selectedFacilities = []
      }
    },
    
    'bookingForm.timeRange.start': function() {
      if (!this.isBookingFormValid && this.selectedFacilities.length > 0) {
        this.selectedFacilities = []
      }
    },
    
    'bookingForm.timeRange.end': function() {
      if (!this.isBookingFormValid && this.selectedFacilities.length > 0) {
        this.selectedFacilities = []
      }
    }
  },

  computed: {
    today(): string {
      return new Date().toISOString().split('T')[0]
    },

    selectedDateHours(): { day?: string, is_enabled: boolean, start_time?: string, end_time?: string } {
      return this.bookingForm.date ? this.getOperationalHoursForDate(this.bookingForm.date) : { is_enabled: false };
    },

    isSelectedDateClosed(): boolean {
      return this.bookingForm.date ? !this.selectedDateHours.is_enabled : false;
    },
    
    roomBasePrice(): number {
      if (!this.space?.pricing) return 0
      
      // For meeting-room, use hourly pricing
      if (this.productType === 'meeting-room') {
        const hourlyRate = this.space.pricing.hourly || 85
        const duration = this.calculateDurationInHours()
        return hourlyRate * duration
      }
      
      // For hot-desk, use daily pricing regardless of time selected
      if (this.productType === 'hot-desk') {
        // Use daily rate for hot desks, regardless of duration
        const dailyRate = this.space.pricing.daily || 500
        return dailyRate
      }
      
      // For dedicated-desk, use the selected package pricing
      if (this.productType === 'dedicated-desk') {
        return this.getPackagePrice()
      }
      
      return 0
    },
    
    facilitiesPrice(): number {
      // Get the booking duration
      const duration = this.calculateDurationInHours();
      
      // If duration is 0, don't calculate facilities price
      if (duration <= 0) {
        return 0;
      }
      
      return this.selectedFacilities.reduce((total: number, selectedFacility) => {
        // Find the matching facility in availableFacilities
        this.availableFacilities.find(
          f => {
            if (typeof selectedFacility === 'string') {
              return f.facility_name.toLowerCase() === selectedFacility.toLowerCase() || 
                     String(f.facility_id) === selectedFacility;
            } else {
              return f.facility_id === selectedFacility;
            }
          }
        );
        
        // Get the hourly price for this facility
        const facilityHourlyPrice = this.facilityPrice(selectedFacility);
        
        // Multiply by duration to get total price for this facility
        const facilityTotalPrice = facilityHourlyPrice * duration;
        
        return total + facilityTotalPrice;
      }, 0)
    },
    
    totalPrice(): number {
      // For dedicated desk, just return the base price (no facilities)
      if (this.productType === 'dedicated-desk') {
        return this.roomBasePrice
      }
      
      // For meeting-room and hot-desk, add facilities
      return this.roomBasePrice + this.facilitiesPrice
    },
    
    isBookingFormValid(): boolean {
      // For hot desks, only date selection is required
      if (this.productType === 'hot-desk') {
        // Additionally, check that the date is not already booked
        return !!(this.bookingForm.date && !this.isHotDeskBooked)
      }
      
      // For meeting rooms, require complete date and time selection
      return !!(this.bookingForm.date &&
               this.bookingForm.timeRange.start &&
               this.bookingForm.timeRange.end)
    },
    
    areFacilitiesEnabled(): boolean {
      // For dedicated desk, facilities are always enabled (no date/time required)
      if (this.productType === 'dedicated-desk') {
        return true
      }
      
      // For hot desks, facilities are not available
      if (this.productType === 'hot-desk') {
        return false
      }
      
      // For meeting rooms, require complete date and time selection
      return this.isBookingFormValid
    },
    
    isSubscriptionFormValid(): boolean {
      return !!(this.bookingForm.date &&
               this.selectedPackage &&
               (this.productType !== 'dedicated-desk' || this.selectedDuration))
    },

    subscriptionEndDate(): string | null {
      if (!this.bookingForm.date || !this.selectedDuration || !this.selectedPackage) {
        return null
      }

      const startDate = new Date(this.bookingForm.date)
      const duration = parseInt(this.selectedDuration)

      if (this.selectedPackage === 'monthly') {
        // Add months to the start date
        const endDate = new Date(startDate)
        endDate.setMonth(startDate.getMonth() + duration)
        // Subtract one day to get the last day of the subscription period
        endDate.setDate(endDate.getDate() - 1)
        return endDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } else if (this.selectedPackage === 'annual') {
        // Add years to the start date
        const endDate = new Date(startDate)
        endDate.setFullYear(startDate.getFullYear() + duration)
        // Subtract one day to get the last day of the subscription period
        endDate.setDate(endDate.getDate() - 1)
        return endDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }

      return null
    }
  },

  async mounted() {
    // Initialize stores
    const authStore = useAuthStore()
    
    // Initialize auth from localStorage
    authStore.initializeAuth()
    this.currentUser = authStore.currentUser

    // Get product type from route query
    this.productType = (this.$route.query.type as string) || 'meeting-room'
    
    // Reset form fields
    this.bookingForm.date = undefined;
    this.bookingForm.timeRange = { start: '', end: '' };
    this.bookingForm.teamSize = '1-5'

    // Set default package selection
    this.selectedPackage = 'monthly'

    // Load space details (which will also load facilities)
    await this.loadSpaceDetails()   
    
    // Check if we should auto-open the review dialog
    if (this.$route.query.openReview === 'true') {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        this.showReviewDialog = true
        
        // Remove the query parameters from URL to prevent reopening on reload
        const newQuery = { ...this.$route.query }
        delete newQuery.openReview
        delete newQuery.bookingId
        delete newQuery.productId
        delete newQuery.productName
        
        // Replace the current route without the review-related query params
        this.$router.replace({ 
          name: this.$route.name || undefined,
          params: this.$route.params,
          query: newQuery
        })
      }, 300)
    }
       
    // Add click outside listener for dropdowns
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  
  methods: {
    calculateSubscriptionEndDate(): string | null {
      if (!this.bookingForm.date || !this.selectedDuration || !this.selectedPackage) {
        return null
      }

      const startDate = new Date(this.bookingForm.date)
      const duration = parseInt(this.selectedDuration)

      if (this.selectedPackage === 'monthly') {
        // Add months to the start date
        const endDate = new Date(startDate)
        endDate.setMonth(startDate.getMonth() + duration)
        // Subtract one day to get the last day of the subscription period
        endDate.setDate(endDate.getDate() - 1)
        return endDate.toISOString().split('T')[0] // Return YYYY-MM-DD format
      } else if (this.selectedPackage === 'annual') {
        // Add years to the start date
        const endDate = new Date(startDate)
        endDate.setFullYear(startDate.getFullYear() + duration)
        // Subtract one day to get the last day of the subscription period
        endDate.setDate(endDate.getDate() - 1)
        return endDate.toISOString().split('T')[0] // Return YYYY-MM-DD format
      }

      return null
    },

    scrollToReviews() {
      const reviewsElement = document.getElementById('reviews');
      if (reviewsElement) {
        reviewsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    
    getFullAvatarUrl(avatarPath: string | null | undefined): string {
      if (!avatarPath) return '';
      
      // If it's already a full URL, return it as is
      if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
      }
      
      // Otherwise, prepend the base URL
      // Get the API base URL from environment variables
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';
      // Extract the domain part without the '/api' suffix
      const domain = baseUrl.replace(/\/api$/, '');
      return `${domain}${avatarPath}`;
    },
    
    handleAvatarError(event: Event): void {
      // Replace broken image with a generated avatar
      const target = event.target as HTMLImageElement;
      const name = target.getAttribute('alt') || 'User';
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
    },
    
    getFeatureName(feature: string | number | { facility_id?: number; name?: string }): string {
      // Cache feature names for consistency across screen sizes
      if (!this.featureNameCache) {
        this.featureNameCache = new Map();
      }
      
      // Generate a cache key based on the feature data
      const cacheKey = typeof feature === 'object' ? 
        (feature?.facility_id || feature?.name || JSON.stringify(feature)) : 
        String(feature);
      
      // Return cached value if it exists
      if (this.featureNameCache.has(cacheKey)) {
        return this.featureNameCache.get(cacheKey);
      }
      
      let result = '';
      
      // Standard lookup table for common facilities
      const standardNames: Record<string, string> = {
        tv: 'TV/Display',
        printer: 'Printer Access',
        catering: 'Catering Service',
        wifi: 'High-Speed WiFi',
        projector: 'Projector',
        whiteboard: 'Whiteboard'
      };
      
      // First check if it's a string that matches our standard names
      if (typeof feature === 'string' && standardNames[feature]) {
        result = standardNames[feature];
      }
      // Make sure we're handling facility objects correctly
      else if (typeof feature === 'object' && feature !== null) {
        // Check if it has a facility_name property (API format)
        if ('facility_name' in feature && feature.facility_name) {
          result = String(feature.facility_name);
        }
        // Check for name property (alternate format)
        else if ('name' in feature && feature.name) {
          result = String(feature.name);
        }
        // If we have an ID but no name, create a readable name
        else if ('facility_id' in feature && feature.facility_id) {
          const facilityId = String(feature.facility_id);
          // Check if it's in our standard names first
          if (standardNames[facilityId]) {
            result = standardNames[facilityId];
          } else {
            result = facilityId
              .replace(/_/g, ' ')
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
        }
        // Handle any other object type (for backward compatibility)
        else {
          result = JSON.stringify(feature);
        }
      }
      // Handle string values with nice formatting
      else if (typeof feature === 'string') {
        // Check if it's a facility ID that we can look up in availableFacilities
        const facilityById = this.availableFacilities.find(f => String(f.facility_id) === feature);
        if (facilityById && facilityById.facility_name) {
          result = facilityById.facility_name;
        }
        // Check if it's a facility name that matches availableFacilities
        else if (this.availableFacilities.some(f => f.facility_name.toLowerCase() === feature.toLowerCase())) {
          const facilityByName = this.availableFacilities.find(f => f.facility_name.toLowerCase() === feature.toLowerCase());
          result = facilityByName!.facility_name;
        }
        // Already checked standardNames at the beginning, so now format it nicely
        else if (!standardNames[feature]) {
          result = feature
            .replace(/_/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }
      // Handle any other primitive values (including numbers)
      else {
        const stringValue = String(feature);
        // Check if it's a facility ID that we can look up in availableFacilities
        const facilityById = this.availableFacilities.find(f => String(f.facility_id) === stringValue);
        if (facilityById && facilityById.facility_name) {
          result = facilityById.facility_name;
        } else {
          result = stringValue;
        }
      }
      
      // Store in cache for consistent retrieval
      this.featureNameCache.set(cacheKey, result);
      return result;
    },
    async fetchBookedTimeSlots() {
      if (!this.bookingForm.date) return;

      this.isLoadingBookedSlots = true;
      try {
        const spaceId = parseInt(this.$route.params.id as string);
        this.bookedTimeSlots = await apiManager.getBookedTimeSlots(spaceId, this.bookingForm.date);
        
        // For hot desks, check if the date is already booked
        if (this.productType === 'hot-desk') {
          this.checkHotDeskAvailability();
        }
        
        this.calculateDisabledTimes();
      } catch (error) {
        logger.error('Error fetching booked time slots:', error);
        this.bookedTimeSlots = [];
      } finally {
        this.isLoadingBookedSlots = false;
      }
    },
    
    /**
     * Check if a hot desk is already booked for the selected date
     * For hot desks, any booking on the selected date means the entire day is unavailable
     */
    checkHotDeskAvailability() {
      // For hot desks, any booking on the selected date makes the date unavailable
      this.isHotDeskBooked = this.bookedTimeSlots.length > 0;
      
      // If the hot desk is available, set the full day operating hours
      if (!this.isHotDeskBooked) {
        const operatingHours = this.getTodayHours();
        if (operatingHours.start_time && operatingHours.end_time) {
          this.bookingForm.timeRange = {
            start: operatingHours.start_time,
            end: operatingHours.end_time
          };
        }
      }
    },

    calculateDisabledTimes() {
      const allTimeSlots = this.generateTimeSlots();
      const disabledStartTimes: string[] = [];
      const disabledEndTimes: string[] = [];

      // Check if selected date is today
      const isToday = this.bookingForm.date ? this.isDateToday(this.bookingForm.date) : false;
      const currentTime = new Date();

      // Disable start times that conflict with existing bookings or are before current time (for today)
      for (const slot of allTimeSlots) {
        if (this.isTimeSlotBooked(slot, 'start')) {
          disabledStartTimes.push(slot);
        } else if (isToday && this.isTimeBeforeCurrentTime(slot, currentTime)) {
          disabledStartTimes.push(slot);
        }
      }

      // Calculate disabled end times based on selected start time
      if (this.bookingForm.timeRange.start) {
        for (const slot of allTimeSlots) {
          if (this.shouldDisableEndTime(slot)) {
            disabledEndTimes.push(slot);
          }
        }
      }

      this.disabledTimes = {
        start: disabledStartTimes,
        end: disabledEndTimes
      };
    },

    /**
     * Check if the given date is today
     */
    isDateToday(dateString: string): boolean {
      const today = new Date();
      const selectedDate = new Date(dateString);
      
      return selectedDate.getDate() === today.getDate() &&
             selectedDate.getMonth() === today.getMonth() &&
             selectedDate.getFullYear() === today.getFullYear();
    },

    /**
     * Check if a time slot is before the current time
     */
    isTimeBeforeCurrentTime(timeSlot: string, currentTime: Date): boolean {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotTime = new Date(currentTime);
      slotTime.setHours(hours, minutes, 0, 0);
      
      return slotTime < currentTime;
    },

    /**
     * Check if a time slot is before current time for today's date
     */
    isTimeBeforeCurrentTimeForToday(timeSlot: string): boolean {
      if (!this.bookingForm.date || !this.isDateToday(this.bookingForm.date)) {
        return false;
      }
      
      const currentTime = new Date();
      return this.isTimeBeforeCurrentTime(timeSlot, currentTime);
    },

    generateTimeSlots(): string[] {
      // Get operational hours for the selected date
      const operationalHours = this.bookingForm.date ? this.getOperationalHoursForDate(this.bookingForm.date) : { is_enabled: false };
      
      // If no date selected or day is not enabled, return empty array
      if (!this.bookingForm.date || !operationalHours.is_enabled || !operationalHours.start_time || !operationalHours.end_time) {
        return [];
      }
      
      const slots: string[] = [];
      
      // Convert operational times to 24-hour format
      const startTime = this.convertTo24HourFormat(operationalHours.start_time);
      const endTime = this.convertTo24HourFormat(operationalHours.end_time);
      
      // Parse start and end hours
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Convert to total minutes for easier iteration
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      // Generate time slots in 30-minute intervals
      for (let totalMinutes = startTotalMinutes; totalMinutes <= endTotalMinutes; totalMinutes += 30) {
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
      
      return slots;
    },

    isTimeSlotBooked(timeSlot: string, type: 'start' | 'end'): boolean {
      const slotTime = this.timeToMinutes(timeSlot);
      
      for (const booking of this.bookedTimeSlots) {
        const bookingStart = this.timeToMinutes(booking.startTime);
        const bookingEnd = this.timeToMinutes(booking.endTime);
        
        if (type === 'start') {
          // For start times, check if the slot conflicts with any existing booking
          // A start time is disabled if it falls within an existing booking
          if (slotTime >= bookingStart && slotTime < bookingEnd) {
            return true;
          }
        }
      }
      return false;
    },

    isFullDayAvailable(): boolean {
      const selectedDateHours = this.bookingForm.date ? this.getOperationalHoursForDate(this.bookingForm.date) : { is_enabled: false };

      // If no operational hours, full day is not available
      if (!selectedDateHours.is_enabled || !selectedDateHours.start_time || !selectedDateHours.end_time) {
        return false;
      }

      // Check if selected date is today and current time has passed operational start time
      if (this.bookingForm.date && this.isDateToday(this.bookingForm.date)) {
        const currentTime = new Date();
        const operationalStartTime = this.convertTo24HourFormat(selectedDateHours.start_time);
        if (this.isTimeBeforeCurrentTime(operationalStartTime, currentTime)) {
          return false; // Full day not available if operational hours have already started today
        }
      }

      // Convert operational times to minutes for comparison
      const operationalStart = this.timeToMinutes(this.convertTo24HourFormat(selectedDateHours.start_time));
      const operationalEnd = this.timeToMinutes(this.convertTo24HourFormat(selectedDateHours.end_time));

      // If no bookings at all, full day is available
      if (this.bookedTimeSlots.length === 0) {
        return true;
      }

      // If there are any bookings (partial or full), full day is not available
      return false;
    },

    shouldDisableEndTime(endTimeSlot: string): boolean {
      const startTime = this.bookingForm.timeRange.start;
      if (!startTime) return false;

      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTimeSlot);

      // End time must be after start time
      if (endMinutes <= startMinutes) {
        return true;
      }

      // Check if there's a booking between start time and this end time
      for (const booking of this.bookedTimeSlots) {
        const bookingStart = this.timeToMinutes(booking.startTime);
        const bookingEnd = this.timeToMinutes(booking.endTime);

        // If there's any booking that starts before or at our proposed end time
        // and after our start time, then this end time is invalid
        if (bookingStart >= startMinutes && bookingStart < endMinutes) {
          return true;
        }
        
        // If there's any booking that overlaps with our time range
        if (bookingStart < endMinutes && bookingEnd > startMinutes) {
          return true;
        }
      }

      return false;
    },

    timeToMinutes(timeString: string): number {
      // If timeString is in ISO format like '2025-08-27T08:32:42.465'
      if (timeString.includes('T')) {
        const timeComponent = timeString.split('T')[1]; // Extract the time part
        const [hours, minutes] = timeComponent.split(':').map(Number);
        return hours * 60 + minutes;
      } else {
        // Handle regular time format like '08:30'
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
      }
    },

    onTimeRangeStartChange() {
      // Recalculate disabled end times when start time changes
      this.calculateDisabledTimes();
    },

    formatTimeDisplay(time: string): string {
      // Convert 24h format to compact 12h format for better display in small containers
      const [hours, minutes] = time.split(':').map(Number)
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      // Return compact format without space between time and period
      return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
    },

    async fetchUnavailableTimes() {
      // This method is kept for backward compatibility but now calls our new logic
      await this.fetchBookedTimeSlots();
    },
    calculateDurationInHours(): number {
      // Return 0 if time range is not properly set
      if (!this.bookingForm.timeRange.start || !this.bookingForm.timeRange.end) {
        return 0
      }
      
      const start = new Date(`2000-01-01T${this.bookingForm.timeRange.start}:00`)
      const end = new Date(`2000-01-01T${this.bookingForm.timeRange.end}:00`)
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0
      }
      
      let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      if (duration < 0) {
        duration += 24 // Handle overnight bookings
      }
      return duration
    },
    
    getDisplayPrice(): string {
      if (!this.space?.pricing) return 'Price not available'
      
      switch (this.productType) {
        case 'meeting-room':
          return `LKR ${this.space.pricing.hourly || 0}/hr`
        case 'hot-desk':
          // Ensure we show daily rate for hot desks
          return `LKR ${this.space.pricing.daily || 0}/day`
        case 'dedicated-desk':
          // Show monthly price for dedicated desk
          return `LKR ${this.space.pricing.monthly || 0}/month`
        default:
          return 'Price not available'
      }
    },

    formatPrice(price?: number): string {
      if (price === undefined) return 'LKR 0'
      return `LKR ${price}`
    },
    
    // This is a simplification - in your real app, you should return the actual booking component
    bookingComponent() {
      // Simply returning a div since we don't have access to the real booking components
      return 'div'
    },
    
    async loadSpaceDetails(): Promise<void> {
      try {
        this.loading = true
        this.error = ''
        
        const spaceId = parseInt(this.$route.params.id as string)
        if (!spaceId) {
          this.error = 'Invalid space ID'
          return
        }
        
        // Use apiManager directly to get space details
        const response = await apiManager.getSpaces({ id: spaceId })
        logger.log('Raw API response for space:', response);
        
        if (response.success && response.space) {
          // API response data is stored in apiManager.lastRawResponseData
          logger.log('Raw API data stored in apiManager:', ApiManager.lastRawResponseData);
          
          // Load operation schedule from raw API data
          const rawSchedule = (ApiManager.lastRawResponseData as RawSpaceApiResponse)?.operation_schedule || [];
          logger.log('Raw operation_schedule from API:', rawSchedule);
          this.operationSchedule = rawSchedule.map(day => ({
            day: day.day,
            is_enabled: day.is_enabled,
            start_time: day.start_time,
            end_time: day.end_time
          }));
          logger.log('Processed operation schedule:', this.operationSchedule);
          
          this.space = response.space
          logger.log('Space object after assignment:', this.space);
          
          // Map recent_ratings from API response to reviews format
          if (this.space.recent_ratings && this.space.recent_ratings.length > 0) {
            this.reviews = this.space.recent_ratings.map((rating: ApiRating, index: number) => ({
              id: index + 1,
              name: rating.first_name || rating.user || `User ${rating.user_id || index + 1}`,
              avatar: rating.user_avatar ? this.getFullAvatarUrl(rating.user_avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.first_name || rating.user || 'User')}&background=6366f1&color=fff`,
              rating: rating.value || rating.rating || 5,
              comment: rating.review_description || rating.comment || 'Great space!',
              date: new Date().toISOString() // Could be enhanced with actual review dates
            }))
          } else {
            // Fallback to recentReviews if recent_ratings is not available
            this.reviews = (response.recentReviews as ReviewDto[]) || []
          }
          
          // Load facilities from the space response if available
          logger.log("Checking for facilities in space:", this.space);
          
          if (this.space?.default_facilities && Array.isArray(this.space.default_facilities) && this.space.default_facilities.length > 0) {
            // Keep default_facilities directly accessible on the space object
            // Make sure all facilities have icons
            this.space.default_facilities = this.space.default_facilities.map((facility: Facility) => ({
              facility_id: facility.facility_id,
              facility_name: facility.facility_name,
              hourly_price: facility.hourly_price || 0,
              icon: facility.icon || this.getFacilityIcon((facility.facility_name || '').toLowerCase())
            }));
            
            // Also map to features for backward compatibility
            if (!this.space.features) {
              this.space.features = [];
            }
            
            // Create a deep copy for features to avoid reference issues
            this.space.features = JSON.parse(JSON.stringify(this.space.default_facilities.map(f => f.facility_name)));
          } else if (this.space?.facilities && Array.isArray(this.space.facilities) && this.space.facilities.length > 0) {
            // Fallback to old facilities property if default_facilities is not available
            if (!this.space.features) {
              this.space.features = [];
            }
            
            this.space.features = this.space.facilities.map((facility: Facility) => facility.facility_name);
          }
          
          // Process additional_facilities for Additional Amenities section
          if (this.space?.additional_facilities && Array.isArray(this.space.additional_facilities) && this.space.additional_facilities.length > 0) {
            this.availableFacilities = this.space.additional_facilities.map((facility: Facility) => ({
              facility_id: facility.facility_id,
              facility_name: facility.facility_name,
              hourly_price: facility.hourly_price || 0,
              icon: facility.icon || this.getFacilityIcon(facility.facility_name.toLowerCase())
            }));
          } else {
            this.availableFacilities = [];
          }
          
          this.facilitiesLoading = false;
        } else {
          this.error = response.message || 'Space not found'
        }
      } catch (error) {
        console.error('Error loading space details:', error)
        this.error = 'Failed to load space details'
      } finally {
        this.loading = false
      }
    },
    
    // loadFacilities method removed as we now get facilities directly from space details
    
    // Helper method to get icon for a facility
    getFacilityIcon(facilityName: string): string {
      const icons: Record<string, string> = {
        'tv': 'M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z M8 15v1.5a.5.5 0 001 0V15h2v1.5a.5.5 0 001 0V15h1a1 1 0 100-2H7a1 1 0 100 2h1z',
        'wifi': 'M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z',
        'printer': 'M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14a1 1 0 001 1h8a1 1 0 001-1v-3H5v3z',
        'coffee': 'M3 2a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V2z M3 5h14v8a3 3 0 01-3 3H6a3 3 0 01-3-3V5zm5 1a1 1 0 00-1 1v5a1 1 0 002 0V7a1 1 0 00-1-1z',
        'catering': 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
      }
      
      // Normalize the facility name for matching
      const normalizedName = facilityName.toLowerCase()
      
      // Check for partial matches (e.g., "wifi premium" should match "wifi")
      for (const [key, icon] of Object.entries(icons)) {
        if (normalizedName.includes(key)) {
          return icon
        }
      }
      
      // Default icon if no match found
      return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    },
    
    getCategoryRoute(): string {
      return `/search?spaceType=${this.productType}`;
    },
    
    getCategoryName(): string {
      switch (this.productType) {
        case 'meeting-room':
          return 'Meeting Rooms'
        case 'hot-desk':
          return 'Hot Desks'
        case 'dedicated-desk':
          return 'Dedicated Desk'
        default:
          return 'Spaces'
      }
    },

    getSpaceTypeName(): string {
      switch (this.productType) {
        case 'meeting-room':
          return 'Meeting Room'
        case 'hot-desk':
          return 'Hot Desk'
        case 'dedicated-desk':
          return 'Dedicated Desk'
        default:
          return 'Space'
      }
    },

    goToSearchResults() {
      this.$router.push(this.getCategoryRoute());
    },
    
    setDateRange(period: string) {
      // For hot desk, we'd need to enhance the form structure to support date ranges
      // This is a placeholder showing how it would work if the form structure supported it
      
      // Notification to user about the selection
      const periodNames = {
        'day': 'Day Pass',
        'week': 'Week Pass',
        'month': 'Month Pass'
      };
      
      alert(`${periodNames[period as keyof typeof periodNames]} selected. In a real implementation, this would set date range accordingly.`);
      
      // The actual implementation would be something like:
      // this.$emit('update:startDate', today.toISOString().split('T')[0]);
      // 
      // let endDate = new Date(today);
      // if (period === 'week') endDate.setDate(today.getDate() + 4);
      // if (period === 'month') endDate.setDate(today.getDate() + 29);
      // this.$emit('update:endDate', endDate.toISOString().split('T')[0]);
    },
    
    getCurrentImage(): string {
      const images = this.getImages()
      return images[this.currentImageIndex] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    
    getImages(): string[] {
      return this.space?.images || ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    
    getImageCount(): number {
      return this.getImages().length
    },
    
    getPackageDisplayName(): string {
      const names: Record<string, string> = {
        daily: 'Daily Pass',
        monthly: 'Monthly Plan',
        annual: 'Annual Plan'
      }
      return names[this.selectedPackage] || 'Selected Plan'
    },
    
    getPackagePrice(): number {
      if (!this.space?.pricing) return 0
      
      let basePrice = 0
      switch (this.selectedPackage) {
        case 'daily':
          basePrice = this.space.pricing.daily || 0
          break
        case 'monthly':
          basePrice = this.space.pricing.monthly || 0
          break
        case 'annual':
          basePrice = this.space.pricing.annual || 0
          break
        default:
          return 0
      }
      
      // For dedicated desk, multiply by selected duration
      if (this.productType === 'dedicated-desk' && this.selectedDuration) {
        const duration = parseInt(this.selectedDuration)
        return basePrice * duration
      }
      
      return basePrice
    },
    
    getPackageDescription(): string {
      switch (this.selectedPackage) {
        case 'daily':
          return 'Perfect for occasional use'
        case 'monthly':
          return 'Unlimited access for one month'
        case 'annual':
          return 'Best value - includes all benefits'
        default:
          return ''
      }
    },
    
    getSavings(): number {
      if (this.space?.pricing?.monthly && this.space?.pricing?.annual) {
        return Math.round((this.space.pricing.monthly * 12) - this.space.pricing.annual)
      }
      return 0
    },

    getBasePricePerHour(): number {
      if (!this.space?.pricing) return 0

      // For meeting-room, return hourly pricing
      if (this.productType === 'meeting-room') {
        return this.space.pricing.hourly || 85
      }

      // For hot-desk, return daily pricing (since hot desks are priced per day)
      if (this.productType === 'hot-desk') {
        return this.space.pricing.daily || 500
      }

      // For dedicated-desk, return the selected package pricing per unit
      if (this.productType === 'dedicated-desk') {
        return this.getPackagePrice() / (this.selectedDuration ? parseInt(this.selectedDuration) : 1)
      }

      return 0
    },
    
    getDurationOptions(): Array<{ value: string; label: string }> {
      if (!this.bookingForm.date || !this.selectedPackage) {
        return []
      }
      
      const startDate = new Date(this.bookingForm.date)
      const options: Array<{ value: string; label: string }> = []
      
      if (this.selectedPackage === 'monthly') {
        // Generate next 12 months starting from the selected date
        for (let i = 1; i <= 12; i++) {
          const date = new Date(startDate)
          date.setMonth(startDate.getMonth() + i)
          const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          options.push({
            value: `${i}`,
            label: `${monthName} (${i} ${i === 1 ? 'month' : 'months'})`
          })
        }
      } else if (this.selectedPackage === 'annual') {
        // Generate next 5 years starting from the selected date
        const startYear = startDate.getFullYear()
        for (let i = 1; i <= 5; i++) {
          const year = startYear + i
          options.push({
            value: `${i}`,
            label: `${year} (${i} ${i === 1 ? 'year' : 'years'})`
          })
        }
      }
      
      return options
    },
    
    onDurationChange(): void {
      // Recalculate price when duration changes
      this.$forceUpdate()
    },
    
    getDurationDisplayText(): string {
      if (!this.selectedDuration) {
        return this.selectedPackage === 'monthly' ? '1 Month' : '1 Year'
      }
      
      const duration = parseInt(this.selectedDuration)
      if (this.selectedPackage === 'monthly') {
        return `${duration} ${duration === 1 ? 'Month' : 'Months'}`
      } else if (this.selectedPackage === 'annual') {
        return `${duration} ${duration === 1 ? 'Year' : 'Years'}`
      }
      
      return '1 Month'
    },
    
    previousImage(): void {
      const imageCount = this.getImageCount()
      this.currentImageIndex = this.currentImageIndex === 0
        ? imageCount - 1
        : this.currentImageIndex + 1
    },
    
    nextImage(): void {
      const imageCount = this.getImageCount()
      this.currentImageIndex = this.currentImageIndex === imageCount - 1
        ? 0
        : this.currentImageIndex + 1
    },
    
    handleUserAuthenticated(user: UserDto): void {
      this.currentUser = user

      // After authentication, proceed with the booking
      if (this.productType === 'dedicated-desk') {
        setTimeout(() => {
          this.proceedToSubscription()
        }, 100)
      }
    },

    handleShowSignup(): void {
      const router = useRouter();
      this.showReviewDialog = false;
      router.push('/register');
    },
    
    onDateChange(date: string): void {
      this.bookingForm.date = date;
      
      // For meeting rooms, reset time selection when date changes
      if (this.productType === 'meeting-room') {
        this.bookingForm.timeRange = { start: '', end: '' };
        this.isFullDayBooking = false; // Reset full day flag when date changes
      }
      
      // For hot desks, automatically set to full day operating hours
      if (this.productType === 'hot-desk') {
        const operatingHours = this.selectedDateHours;
        if (operatingHours.start_time && operatingHours.end_time) {
          this.bookingForm.timeRange = {
            start: operatingHours.start_time,
            end: operatingHours.end_time
          };
          this.isFullDayBooking = true;
        }
      }
      
      // Fetch booked time slots for the new date
      this.fetchBookedTimeSlots();
    },
    
    // Custom dropdown methods
    toggleStartDropdown(): void {
      if (this.isLoadingBookedSlots || !this.bookingForm.date) return;
      this.showStartTimeDropdown = !this.showStartTimeDropdown;
      this.showEndTimeDropdown = false; // Close end dropdown
    },
    
    toggleEndDropdown(): void {
      if (!this.bookingForm.timeRange.start || this.isLoadingBookedSlots || this.isFullDayBooking || !this.bookingForm.date) return;
      this.showEndTimeDropdown = !this.showEndTimeDropdown;
      this.showStartTimeDropdown = false; // Close start dropdown
    },
    
    selectStartTime(time: string): void {
      if (this.disabledTimes.start.includes(time)) return;
      this.bookingForm.timeRange.start = time;
      this.bookingForm.timeRange.end = ''; // Reset end time
      this.isFullDayBooking = false; // Reset full day flag when manually selecting time
      this.showStartTimeDropdown = false;
      this.onTimeRangeStartChange();
    },
    
    selectFullDay(): void {
      // Only allow full day selection for meeting-room and hot-desk
      if (this.productType !== 'meeting-room' && this.productType !== 'hot-desk') {
        return;
      }
      
      // Check if full day is available (no conflicts with existing bookings)
      if (!this.isFullDayAvailable()) {
        return;
      }
      
      const selectedDateHours = this.selectedDateHours;
      
      // Check if the space is open on selected date and has valid times
      if (!selectedDateHours.is_enabled || !selectedDateHours.start_time || !selectedDateHours.end_time) {
        return;
      }
      
      // Convert times to 24-hour HH:MM format
      const startTime = this.convertTo24HourFormat(selectedDateHours.start_time);
      const endTime = this.convertTo24HourFormat(selectedDateHours.end_time);
      
      // Set start and end times to operational hours and mark as full day booking
      this.bookingForm.timeRange.start = startTime;
      this.bookingForm.timeRange.end = endTime;
      this.isFullDayBooking = true;
      this.showStartTimeDropdown = false;
      this.onTimeRangeStartChange();
    },
    
    selectEndTime(time: string): void {
      if (this.disabledTimes.end.includes(time)) return;
      this.bookingForm.timeRange.end = time;
      this.showEndTimeDropdown = false;
    },
    
    handleClickOutside(event: Event): void {
      const target = event.target as Element;
      if (!this.$el.contains(target)) {
        this.showStartTimeDropdown = false;
        this.showEndTimeDropdown = false;
      }
    },
    
    facilityDisplayName(facility: string | number | { facility_id?: number; name?: string }): string {
      // Use the consistent getFeatureName method that implements caching
      return this.getFeatureName(facility);
    },
    facilityPrice(facility: string | number | Facility): number {
      // Get the facility key for pricing lookup
      let facilityKey: string;
      let facilityId: string | number;
      let facilityObject: Facility | undefined;
      
      if (typeof facility === 'object' && facility !== null) {
        if ('facility_id' in facility) {
          // If facility is a facility object with ID
          facilityId = facility.facility_id;
          facilityKey = (facility as Facility).facility_name?.toLowerCase() || '';
          facilityObject = facility as Facility;
        } else if ('name' in facility && typeof (facility as { name?: unknown }).name === 'string') {
          // Legacy format with name
          facilityKey = (facility as { name: string }).name.toLowerCase();
          facilityId = facilityKey;
          facilityObject = this.availableFacilities.find(
            f => f.facility_name.toLowerCase() === facilityKey || f.facility_id === facilityId
          );
        } else {
          // Unknown object format
          return 0;
        }
      } else {
        // If facility is a string or any other value, convert to string
        facilityKey = String(facility).toLowerCase();
        facilityId = facilityKey;
        
        // Look for matching facility by ID or name
        facilityObject = this.availableFacilities.find(
          f => 
            String(f.facility_id).toLowerCase() === facilityKey ||
            f.facility_name.toLowerCase() === facilityKey ||
            facilityKey === f.facility_name.toLowerCase().replace(/\s+/g, '_')
        );
      }
      
      // Default prices for common facilities if not found in availableFacilities
      const defaultPrices: Record<string, number> = {
        'tv': 15,
        'printer': 10,
        'catering': 25,
        'wifi': 5,
        'projector': 20,
        'whiteboard': 5
      };
      
      // Get the price from the facility object if available
      let price = 0;
      if (facilityObject && 'hourly_price' in facilityObject && facilityObject.hourly_price !== undefined) {
        price = Math.round(facilityObject.hourly_price);
      } else if (typeof facilityId === 'string' && defaultPrices[facilityId]) {
        // Use default price if available
        price = defaultPrices[facilityId];
      }
      
      // If no price found, return 0
      return price || 0
    },
    
    async proceedToBooking(): Promise<void> {
      if (!this.isBookingFormValid || this.isProcessing) return
      
      try {
        this.isProcessing = true
        const bookingStore = useBookingStore()
        
        // Ensure space has required fields
        if (!this.space?.id) {
          console.error('Space ID is required for booking')
          return
        }
        
        // Ensure date is selected
        if (!this.bookingForm.date) {
          console.error('Date is required for booking')
          return
        }
        
        // For hot desks, automatically set the time range to the full operating hours
        let startTime = this.bookingForm.timeRange.start
        let endTime = this.bookingForm.timeRange.end
        
        if (this.productType === 'hot-desk') {
          // Get the operating hours for the selected date
          const selectedDay = new Date(this.bookingForm.date).toLocaleDateString('en-US', { weekday: 'long' });
          const schedule = this.operationSchedule.find((day: any) => day.day === selectedDay);
          
          if (schedule && schedule.is_enabled && schedule.start_time && schedule.end_time) {
            startTime = schedule.start_time;
            endTime = schedule.end_time;
          } else {
            // Fallback to standard business hours if schedule isn't available
            startTime = '09:00';
            endTime = '17:00';
          }
        }
        
        // Store booking data in Pinia store
        const bookingDetails = {
          spaceId: this.space.id,
          productType: this.productType,
          space: {
            ...this.space,
            id: this.space.id, // Ensure id is present
            image: this.getCurrentImage()
          },
          booking: {
            startDate: this.bookingForm.date,
            endDate: this.bookingForm.date,
            startTime: startTime,
            endTime: endTime,
            duration: this.productType === 'hot-desk' ? '1 day' : this.calculateDurationInHours().toString(),
            // Add legacy date field for backward compatibility
            date: this.bookingForm.date
          },
          facilities: this.selectedFacilities.map(facility => {
            // Convert facility IDs (as strings) to names for display purposes
            const facilityId = typeof facility === 'string' ? parseInt(facility) : facility;
            const foundFacility = this.availableFacilities.find(f => f.facility_id === facilityId);
            return foundFacility ? foundFacility.facility_name : String(facility);
          }),
          totalPrice: this.totalPrice,
          pricing: {
            basePrice: this.roomBasePrice,
            facilitiesPrice: this.facilitiesPrice,
            total: this.totalPrice
          }
        }

        // Close the mobile booking modal if open
        this.showMobileBookingModal = false
        
        bookingStore.setBookingDetails(bookingDetails)
        await this.$router.push({ name: 'BookingSummary' })
      } catch (error) {
        console.error('Error proceeding to booking:', error)
      } finally {
        this.isProcessing = false
      }
    },
    
    async proceedToSubscription(): Promise<void> {
      if (!this.isSubscriptionFormValid || this.isProcessing) return
      
      // For hot desk and dedicated desk, authentication is required
      if (!this.currentUser) {
        const authStore = useAuthStore();
        authStore.setRedirectPath(this.$route.fullPath);
        this.$router.push('/login');
        return
      }

      try {
        this.isProcessing = true
        const bookingStore = useBookingStore()
        
        // Ensure space has required fields
        if (!this.space?.id) {
          console.error('Space ID is required for subscription')
          return
        }
        
        // Ensure date range is selected
        if (!this.bookingForm.date) {
          console.error('Date is required for subscription')
          return
        }
        
        // Store subscription data in Pinia store
        const subscriptionDetails = {
          spaceId: this.space.id,
          productType: this.productType,
          space: {
            ...this.space,
            id: this.space.id, // Ensure id is present
            image: this.getCurrentImage()
          },
          subscription: {
            startDate: this.bookingForm.date,
            endDate: this.calculateSubscriptionEndDate(),
            packageType: this.selectedPackage,
            teamSize: this.bookingForm.teamSize,
            ...(this.productType === 'dedicated-desk' && this.selectedDuration && {
              duration: parseInt(this.selectedDuration)
            })
          },
          totalPrice: this.getPackagePrice(),
          pricing: {
            basePrice: this.getPackagePrice(),
            facilitiesPrice: 0,
            total: this.getPackagePrice()
          }
        }

        // Close the mobile booking modal if open
        this.showMobileBookingModal = false
        
        bookingStore.setBookingDetails(subscriptionDetails)
        await this.$router.push({ name: 'BookingSummary' })
      } catch (error) {
        console.error('Error proceeding to subscription:', error)
      } finally {
        this.isProcessing = false
      }
    },

    openLocationMap(): void {
      // Get the raw data directly from apiManager
      const rawApiData = ApiManager.lastRawResponseData;
      logger.log('Raw API data:', rawApiData);
      
      // Get location_url directly from raw API response
      const locationUrl = (rawApiData as RawSpaceApiResponse)?.location_url;
      logger.log('Location URL from API:', locationUrl);
      
      if (locationUrl) {
        // Open location URL in a new tab
        logger.log('Opening location URL:', locationUrl);
        window.open(locationUrl, '_blank');
      } else {
        // Show notification that no map is available
        console.log('No location URL available, showing notification');
        this.showLocationNotification = true;
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          this.showLocationNotification = false;
        }, 3000);
      }
    },
    
    // ===== Operating Schedule Methods =====
    
    getOperationSchedule(): OperationDay[] {
      // Get schedule from the raw API data if it exists
      return this.operationSchedule || [];
    },
    
    formatTime(time: string | undefined): string {
      if (!time) return '';
      
      try {
        // Convert 24h time to 12h format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        
        return `${formattedHour}:${minutes} ${ampm}`;
      } catch (error) {
        console.error('Error formatting time:', error);
        return '';
      }
    },
    
    convertTo24HourFormat(timeStr: string): string {
      if (!timeStr) return '';
      
      // If already in HH:MM format, return as is
      if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      // If in HH:MM:SS format, remove seconds
      if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeStr)) {
        const [hours, minutes] = timeStr.split(':').slice(0, 2).map(Number);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      // If in 12-hour format with AM/PM
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        const [, hours, minutes, period] = match;
        let hour24 = parseInt(hours, 10);
        
        if (period.toUpperCase() === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
          hour24 = 0;
        }
        
        return `${hour24.toString().padStart(2, '0')}:${minutes}`;
      }
      
      // Fallback: try to extract HH:MM
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const [, hours, minutes] = timeMatch;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      
      // If nothing matches, return the original string (might cause issues but better than crashing)
      console.warn('Unable to parse time format:', timeStr);
      return timeStr;
    },
    
    getCurrentDay(): string {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysOfWeek[new Date().getDay()];
    },
    
    getCurrentDayShort(): string {
      return this.getCurrentDay().substring(0, 2);
    },
    
    getTodayHours(): { day?: string, is_enabled: boolean, start_time?: string, end_time?: string } {
      const today = this.getCurrentDay();
      const schedule = this.getOperationSchedule();
      
      if (!schedule || !Array.isArray(schedule)) {
        return { is_enabled: false };
      }
      
      try {
        // Find today in the schedule
        const todaySchedule = schedule.find((day: OperationDay) => day && day.day === today);
        return todaySchedule || { is_enabled: false };
      } catch (error) {
        console.error('Error getting today hours:', error);
        return { is_enabled: false };
      }
    },

    getOperationalHoursForDate(dateString: string): { day?: string, is_enabled: boolean, start_time?: string, end_time?: string } {
      if (!dateString) {
        return { is_enabled: false };
      }

      const schedule = this.getOperationSchedule();
      
      if (!schedule || !Array.isArray(schedule)) {
        return { is_enabled: false };
      }
      
      try {
        // Convert date string to day of week
        const selectedDate = new Date(dateString);
        const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        console.log('Selected date:', dateString, 'maps to day:', selectedDay);
        console.log('Available schedule days:', schedule.map(d => d.day));
        
        // Find the selected day in the schedule (case-insensitive match)
        const daySchedule = schedule.find((day: OperationDay) => {
          if (!day || !day.day) return false;
          // Try exact match first
          if (day.day === selectedDay) return true;
          // Try case-insensitive match
          if (day.day.toLowerCase() === selectedDay.toLowerCase()) return true;
          // Try abbreviated match (Mon, Tue, etc.)
          const abbreviatedDay = selectedDay.substring(0, 3);
          if (day.day === abbreviatedDay) return true;
          return false;
        });
        
        console.log('Found schedule for day:', selectedDay, daySchedule);
        
        return daySchedule || { is_enabled: false };
      } catch (error) {
        console.error('Error getting operational hours for date:', error);
        return { is_enabled: false };
      }
    },
    
    isTodayOpen(): boolean {
      const todayHours = this.getTodayHours();
      return todayHours && todayHours.is_enabled === true;
    },
    
    getTimelineStyle(): { left: string, width: string } {
      const todayHours = this.getTodayHours();
      if (!todayHours || !todayHours.is_enabled) return { left: '0%', width: '0%' };
      
      // Calculate position based on 24-hour day (6am to 6pm visible in timeline)
      const start = this.timeToDecimalHours(todayHours.start_time);
      const end = this.timeToDecimalHours(todayHours.end_time);
      
      // Timeline shows hours 6 to 18 (6am to 6pm)
      // Calculate percentage positions (start and width)
      const timelineStart = 6; // 6am
      const timelineEnd = 18; // 6pm
      const timelineRange = timelineEnd - timelineStart;
      
      const left = Math.max(0, ((start - timelineStart) / timelineRange) * 100);
      const width = Math.min(100 - left, ((end - Math.max(timelineStart, start)) / timelineRange) * 100);
      
      return {
        left: `${left}%`,
        width: `${width}%`
      };
    },
    
    getCurrentTimePosition(): { left: string } {
      const now = new Date();
      const currentHour = now.getHours() + (now.getMinutes() / 60);
      
      // Timeline shows hours 6 to 18 (6am to 6pm)
      const timelineStart = 6; // 6am
      const timelineEnd = 18; // 6pm
      const timelineRange = timelineEnd - timelineStart;
      
      const position = Math.max(0, Math.min(100, ((currentHour - timelineStart) / timelineRange) * 100));
      
      return {
        left: `${position}%`
      };
    },
    
    isWithinOperatingHours(): boolean {
      if (!this.isTodayOpen()) return false;
      
      const now = new Date();
      const currentHour = now.getHours() + (now.getMinutes() / 60);
      
      const todayHours = this.getTodayHours();
      const startHour = this.timeToDecimalHours(todayHours.start_time);
      const endHour = this.timeToDecimalHours(todayHours.end_time);
      
      return currentHour >= startHour && currentHour <= endHour;
    },
    
    timeToDecimalHours(timeString: string | undefined): number {
      if (!timeString) return 0;
      
      try {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours + (minutes / 60);
      } catch (error) {
        console.error('Error converting time to decimal hours:', error);
        return 0;
      }
    },
    
    getDayProgressPercentage(): number {
      if (!this.isTodayOpen()) return 0;
      
      const todayHours = this.getTodayHours();
      const startHour = this.timeToDecimalHours(todayHours.start_time);
      const endHour = this.timeToDecimalHours(todayHours.end_time);
      const totalHours = endHour - startHour;
      
      if (totalHours <= 0) return 0;
      
      const now = new Date();
      const currentHour = now.getHours() + (now.getMinutes() / 60);
      
      if (currentHour < startHour) return 0;
      if (currentHour > endHour) return 100;
      
      const hoursElapsed = currentHour - startHour;
      const percentage = Math.round((hoursElapsed / totalHours) * 100);
      
      return Math.min(100, Math.max(0, percentage));
    },
    
    handleReviewSubmitted(review: SubmittedReview): void {
      // Close the review dialog first
      this.showReviewDialog = false
      
      // Clear any review-related query parameters before reload
      const newQuery = { ...this.$route.query }
      delete newQuery.openReview
      delete newQuery.bookingId
      delete newQuery.productId
      delete newQuery.productName
      
      // Update URL without review params, then reload
      this.$router.replace({ 
        name: this.$route.name || undefined,
        params: this.$route.params,
        query: newQuery
      }).then(() => {
        // Reload the page to get updated reviews
        window.location.reload()
      })
      
      // The code below is kept for reference but won't execute due to page reload
      const newReview = {
        id: Date.now(), // Generate a temporary ID
        name: review.first_name,
        rating: review.value,
        comment: review.review_description,
        date: new Date().toISOString().split('T')[0],
        avatar: this.getFullAvatarUrl(review.user_avatar) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.first_name || 'User')
      };
      
      // Add the new review to the reviews array
      this.reviews = [newReview, ...this.reviews];
      
      // Update the space rating if needed
      if (this.space) {
        const totalReviews = this.reviews.length;
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.space.rating = parseFloat((totalRating / totalReviews).toFixed(1));
        
        // Update the number of reviews
        this.space.reviews = totalReviews;
      }
    },
    
    // Method to handle package selection
    selectPackage(duration: string): void {
      this.selectedPackage = duration;
    }
  }
})
</script>

<style scoped>
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: rgba(59, 130, 246, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Image display improvements */
.image-container {
  height: 500px;
  min-height: 500px;
}

.image-container img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

/* Compact Date Picker Styling */
.compact-date-picker {
  position: relative;
  z-index: 1000;
}

/* Ensure date picker calendar appears above everything */
.compact-date-picker :deep(.calendar-dropdown) {
  z-index: 15000 !important; /* Higher than time dropdowns */
}

.compact-date-picker :deep(.absolute) {
  z-index: 15000 !important; /* Higher than time dropdowns */
}

/* Compact Select Field Styling */
.compact-select-field {
  width: 100%;
  padding: 0.5rem 0.75rem; /* Match date picker default padding */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  transition: all 0.2s ease-in-out;
  background-color: white;
  cursor: pointer;
  min-height: 2.35rem; /* Match date picker height */
  line-height: 1.25; /* Add consistent line height */
  display: flex;
  align-items: center; /* Vertically center content */
}

.compact-select-field:focus {
  outline: none;
  border-color: black;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.compact-select-field:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Placeholder styling for select options */
.compact-select-field option[value=""] {
  color: #9ca3af;
}

/* When no value is selected, show placeholder color */
.compact-select-field.placeholder-shown {
  color: #9ca3af;
}

/* When value is selected, show normal color */
.compact-select-field:not(.placeholder-shown) {
  color: #374151;
}

/* Disabled options styling */
.compact-select-field option:disabled {
  color: #9ca3af !important;
  background-color: #f3f4f6 !important;
}

/* Modern Time Select Styling */
.modern-time-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234f46e5' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
  padding-right: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 2rem !important; /* Ensure same height as date picker */
  height: auto !important; /* Allow content to determine height but respect min-height */
}

.modern-time-select:hover {
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
  border-color: black;
}

.modern-time-select:focus {
  border-color: black;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234f46e5' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 12 4-4 4 4'/%3e%3c/svg%3e");
}

.modern-time-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f3f4f6;
}



/* Custom Time Dropdown Styling */
.custom-time-dropdown {
  margin-top: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.15);
  z-index: 1500; /* Higher than booking widget but lower than calendar */
}

.custom-scrollbar-time {
  /* Show compact items in the time dropdown */
  max-height: 10rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-scrollbar-time::-webkit-scrollbar {
  width: 3px; /* Even thinner scrollbar */
  background: rgba(248, 250, 252, 0.8);
  border-radius: 1px;
}

.custom-scrollbar-time::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, black 0%, black 100%);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.custom-scrollbar-time::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, black 0%, black 100%);
}

.time-dropdown-option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem; /* Fixed height for consistent spacing */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-dropdown-option:hover:not(.disabled) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #1e293b;
}

.time-dropdown-option:last-child {
  border-bottom: none;
}

.time-dropdown-option.disabled {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%);
  color: #dc2626;
  cursor: not-allowed;
  opacity: 0.8;
}

.time-dropdown-option.disabled:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.08) 100%);
}

.booked-badge {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  margin-left:0.09rem ;
  padding: 0.05rem 0.1875rem; /* Reduced padding: was 0.125rem 0.25rem */
  border-radius: 0.1875rem; /* Reduced border radius: was 0.25rem */
  font-size: 0.4375rem; /* Much smaller font: was 0.5rem */
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.3);
  flex-shrink: 0; /* Don't shrink the badge */
  line-height: 1.2; /* Tighter line height */
}

.dropdown-open {
  border-color: black !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
}

.modern-time-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.z-1000 {
  z-index: 1500; /* Updated to match custom-time-dropdown */
}

/* Ultra compact styling for minimal space */
.ultra-compact .compact-select-field,
.compact-select-field.ultra-compact {
  padding: 0.375rem 0.5rem !important; /* Match date picker exactly */
  font-size: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  height: auto !important;
  min-height: 2rem !important; /* Ensure same height as date picker */
  background-color: white;
  color: #374151;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
  padding-right: 2rem;
  line-height: 1.25; /* Add consistent line height */
  display: flex;
  align-items: center; /* Vertically center content */
}

.ultra-compact .compact-select-field:focus,
.compact-select-field.ultra-compact:focus {
  outline: none;
  border-color: black;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

/* Removed remaining invalid deep selectors that target non-existent classes */

/* Booking widget sticky positioning */
.booking-widget {
  position: sticky;
  top: 2rem;
  padding: 1rem;
  z-index: 10; /* Lower z-index than calendar */
}

@media (max-width: 1023px) {
  .booking-widget {
    position: static;
    top: auto;
    padding: 1.25rem;
    z-index: 10; /* Maintain lower z-index on mobile */
  }
}

/* Dedicated Desk Specific Improvements */
.booking-widget:has([data-product-type="dedicated-desk"]) {
  min-height: auto;
}

/* New elegant subscription plan tiles */
.subscription-plan-tile {
  min-height: 100px;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.dark .subscription-plan-tile {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.subscription-plan-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.subscription-plan-tile.border-primary {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%);
  transform: translateY(-1px);
}

.subscription-plan-tile.border-primary:hover {
  transform: translateY(-3px);
}

/* Legacy subscription plan option styling - keeping for backwards compatibility */
.booking-widget .subscription-plan-option {
  padding: 0.375rem 0.5rem !important;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.booking-widget .subscription-plan-option:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transform: translateY(-0.5px);
}

.booking-widget .subscription-plan-option:active {
  transform: translateY(0);
}

/* Selected state styling for tiles */
.subscription-plan-option.border-primary {
  border-width: 1.5px;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

/* Improve spacing for dedicated desk forms */
.dedicated-desk-form {
  padding-top: 0.1rem;
}

.dedicated-desk-form .space-y-3 > * + * {
  margin-top: 0.5rem !important;
}

.dedicated-desk-form .subscription-plans {
  margin-top: 0.25rem !important;
}

.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Dark mode support classes */
.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6, 
.dark .text-gray-900 {
  color: #fff;
}

.dark .text-gray-800 {
  color: #e5e7eb;
}

.dark .text-gray-700:not([class*="dark:"]), 
.dark .text-gray-600 {
  color: #d1d5db;
}

.dark .text-gray-500 {
  color: #9ca3af;
}

/* Card and container styling for dark mode */
.dark .bg-white {
  background-color: #111827;
}

.dark .bg-gray-50,
.dark .bg-gray-100 {
  background-color: #1f2937;
}

.dark .bg-gray-200 {
  background-color: #374151;
}

/* Border colors for dark mode */
.dark .border-gray-50,
.dark .border-gray-100,
.dark .border-gray-200 {
  border-color: #1f2937;
}

/* Shadow utilities for dark mode */
.dark .shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.dark .shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
}
.dark .shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3);
}
.dark .shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Fix for remaining text elements in dark mode */
.dark label:not([class*="dark:"]) {
  color: #d1d5db;
}

.dark ul:not([class*="dark:"]) {
  color: #d1d5db;
}

.dark .compact-select-field span:not([class*="dark:"]) {
  color: #d1d5db;
}

/* Fixes for dropdowns and form elements */
.dark .bg-gray-50:not([class*="dark:"]) {
  background-color: #1f2937;
}

.dark .border-gray-200:not([class*="dark:"]) {
  border-color: #374151;
}

/* Enhanced beautiful styling with website colors */
.text-primary {
  color: var(--primary) !important;
}

.border-primary {
  border-color: var(--primary) !important;
}

.bg-primary {
  background-color: var(--primary) !important;
}

/* Enhanced location section styling */
.location-map-container {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.05) 0%, rgba(0, 254, 1, 0.1) 100%);
  transition: all 0.3s ease;
}

.location-map-container:hover {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.1) 0%, rgba(0, 254, 1, 0.15) 100%);
  transform: translateY(-1px);
}

.dark .location-map-container {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.1) 0%, rgba(0, 254, 1, 0.15) 100%);
}

.dark .location-map-container:hover {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.15) 0%, rgba(0, 254, 1, 0.2) 100%);
}

/* Enhanced reviews section styling */
.reviews-gradient-bg {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.dark .reviews-gradient-bg {
  background: linear-gradient(135deg, rgba(0, 254, 1, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%);
}

/* Enhanced star ratings with glow effect */
.star-glow {
  filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.6));
}

/* Custom scrollbar for reviews */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
  opacity: 0.7;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

/* Enhanced button styles */
.btn-primary-outline {
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary);
  color: var(--primary);
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  outline: none;
}

.btn-primary-outline:hover {
  background-color: var(--primary);
  color: black;
}

.btn-primary-outline:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary), 0 0 0 4px rgba(0, 254, 1, 0.2);
}

.dark .btn-primary-outline:hover {
  color: #111827;
}

/* Enhanced card styles */
.card-primary {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

.dark .card-primary {
  background: #111827;
  border-color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dark .card-primary:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  border-color: #4b5563;
}

/* Enhanced gradient overlays */
.gradient-overlay-green {
  background: linear-gradient(135deg, 
    rgba(0, 254, 1, 0.1) 0%, 
    rgba(0, 254, 1, 0.05) 50%, 
    rgba(255, 255, 255, 0.1) 100%);
}

.dark .gradient-overlay-green {
  background: linear-gradient(135deg, 
    rgba(0, 254, 1, 0.15) 0%, 
    rgba(0, 254, 1, 0.08) 50%, 
    rgba(0, 0, 0, 0.1) 100%);
}

/* Mobile booking modal animation */
.booking-modal-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0.8;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Enhanced mobile form styles */
.compact-date-picker {
  width: 100%;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .booking-modal-slide-up {
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>