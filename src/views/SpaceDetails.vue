<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-8xl mx-auto px-2 sm:px-5 py-7">
      <div class="animate-pulse">
        <div class="h-96 bg-gray-200 rounded-xl mb-8"></div>
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-8xl mx-auto px-2 sm:px-5 py-7 text-center">
      <div class="bg-white rounded-xl p-8 shadow-card">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-gray-900 mb-2">Space Not Found</h2>
        <p class="text-xs text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/" class="btn-primary">
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Space Details Content -->
    <div v-else class="max-w-8xl mx-auto px-2 sm:px-5 py-7">
      <!-- Breadcrumb with improved navigation and visual feedback -->
      <nav class="flex items-center flex-wrap mb-4 py-2 px-3 bg-white rounded-lg shadow-sm">
        <router-link to="/" class="flex items-center hover:text-primary transition-colors text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </router-link>
        <div class="mx-2 text-gray-400 flex items-center">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <router-link :to="getCategoryRoute()" class="flex items-center hover:text-primary transition-colors text-xs font-medium" @click.prevent="goToSearchResults">
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
        <div class="mx-2 text-gray-400 flex items-center">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <span class="text-gray-900 text-xs font-semibold flex items-center">
          {{ space?.name || 'Loading...' }}
        </span>
      </nav>

      <!-- Main Content Grid Layout -->
      <div class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- Left Column: Images and Features -->
        <div class="lg:col-span-2 space-y-8 overflow-y-auto scrollbar-hide ">
          <!-- Image Gallery Section -->
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Main Image Display with visual enhancements -->
            <div class="flex-1">
              <div class="relative w-full h-[500px] rounded-xl overflow-hidden image-container shadow-lg group">
                <!-- Gradient overlay on hover for better visibility -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <img 
                  :src="getCurrentImage()" 
                  :alt="space?.name || 'Space'"
                  class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                >
                
                <!-- Interactive navigation controls with improved visibility and feedback -->
                <button 
                  v-if="getImageCount() > 1"
                  @click="previousImage"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Previous image"
                >
                  <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  v-if="getImageCount() > 1"
                  @click="nextImage"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Next image"
                >
                  <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <!-- Enhanced image counter with better visibility -->
                <div class="absolute bottom-4 right-4 bg-white/80 text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium shadow-md backdrop-blur-sm">
                  {{ currentImageIndex + 1 }} / {{ getImageCount() }}
                </div>
                
                <!-- Quick info badge for space type -->
                <div class="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
                  {{ getCategoryName() }}
                </div>
              </div>
            </div>
            
            <!-- Thumbnail Gallery with improved interaction -->
            <div v-if="getImageCount() > 1" class="flex sm:flex-col gap-2 w-full sm:w-24">
              <div class="flex sm:flex-col -ml-1 gap-2 pb-2 sm:pb-0">
                <button 
                  v-for="(image, index) in getImages().slice(0, 5)" 
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'w-20 h-20 sm:w-24 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0',
                    currentImageIndex === index 
                      ? 'ring-1 ring-primary ring-offset-1 scale-105 shadow-md' 
                      : 'opacity-80 hover:opacity-100 hover:scale-105 hover:shadow-md'
                  ]"
                >
                  <img 
                    :src="image" 
                    :alt="`${space?.name || 'Space'} image ${index + 1}`" 
                    class="w-full h-full object-cover"
                  >
                </button>
                
                <!-- More images indicator with improved visibility -->
                <div v-if="getImageCount() > 5" 
                  class="w-20 h-20 sm:w-24 sm:h-20 rounded-lg bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0 shadow-sm"
                  @click="currentImageIndex = 5">
                  <span class="text-base font-bold text-gray-700">+{{ getImageCount() - 5 }}</span>
                  <span class="text-xs text-gray-600">more</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Features/Amenities - Moved directly below the image gallery -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {{ productType === 'meeting-room' || productType === 'hot-desk' ? 'Room Features & Amenities' : 'Amenities & Features' }}
            </h3>
            
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(feature, index) in space?.features || []" 
                :key="feature" 
                class="flex items-center p-3.5 bg-white rounded-lg border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow transition-all duration-300 group"
                :class="{'bg-gray-50': index % 2 === 0}"
              >
                <div class="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors duration-200">{{ feature }}</span>
              </div>
              
              <!-- If there are no features, show this placeholder -->
              <div v-if="(space?.features || []).length === 0" class="col-span-full flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p class="text-gray-500 text-sm">Feature information will be available soon</p>
              </div>
            </div>
          </section>
          
          <!-- Enhanced Location & Access - Added below Room Features -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location & Access
            </h3>
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="flex flex-col md:flex-row md:items-start gap-5">
                <!-- Map Placeholder -->
                <div class="w-full md:w-1/2 h-48 md:h-56 bg-gray-200 rounded-lg overflow-hidden relative">
                  <!-- This would be replaced with an actual map component -->
                  <div class="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  
                  <!-- Map Pin -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="w-4 h-4 bg-primary absolute -bottom-3 left-2 transform rotate-45"></div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="absolute bottom-3 right-3 flex space-x-2">
                    <button class="bg-white rounded-md px-2.5 py-1 text-xs font-medium text-gray-700 shadow hover:bg-gray-50 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      View Full Map
                    </button>
                  </div>
                </div>
                
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ space?.location || 'Loading...' }}
                  </h4>
                  <p class="text-gray-600 mb-4 text-sm pl-5">{{ space?.address || 'Loading address...' }}</p>
                  
                  <div class="grid md:grid-cols-2 gap-5">
                    <div class="bg-gray-50 p-3 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Transportation
                      </h5>
                      <ul class="space-y-2 text-sm text-gray-700">
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Metro station: <span class="font-medium text-primary">2 min</span> walk
                        </li>
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Bus stops nearby
                        </li>
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Parking available on-site
                        </li>
                      </ul>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Nearby
                      </h5>
                      <ul class="space-y-2 text-sm text-gray-700">
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Coffee shops & restaurants
                        </li>
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Business district
                        </li>
                        <li class="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Shopping center
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Customer Reviews Section - Added below Location & Access -->
          <section>
            <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Customer Reviews
            </h3>
            
            <!-- Ratings Summary Card -->
            <div class="bg-white rounded-lg p-4 border border-gray-100 shadow-sm mb-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ space?.rating || 4.5 }}</div>
                  <div class="flex text-yellow-400 mt-1">
                    <svg v-for="star in 5" :key="star" :class="[
                      'w-4 h-4 transition-transform',
                      star <= (space?.rating || 4.5) ? 'fill-current' : 'text-gray-300',
                      star <= (space?.rating || 4.5) ? 'scale-105' : ''
                    ]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Based on {{ reviews.length || 0 }} reviews</div>
                </div>
                
                <button class="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-300">
                  Write a Review
                </button>
              </div>
            </div>
            
            <div class="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              <div v-for="(review, index) in reviews" :key="review.id" 
                   class="bg-white rounded-lg p-4 border border-gray-100 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md"
                   :class="{'bg-gradient-to-br from-white to-gray-50': index % 2 === 1}">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <img :src="review.avatar" :alt="review.name" 
                         class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shadow-sm">
                  </div>
                  <div class="ml-3 flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold text-gray-900">{{ review.name }}</h4>
                      <div class="flex items-center bg-gray-50 rounded-full px-2 py-0.5">
                        <div class="flex text-yellow-400">
                          <svg v-for="star in 5" :key="star" :class="[
                            'w-3 h-3',
                            star <= review.rating ? 'fill-current' : 'text-gray-300'
                          ]" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p class="mt-1 text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      2 weeks ago
                    </p>
                    <div class="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border-l-2 border-primary">
                      {{ review.comment }}
                    </div>
                    
                    <!-- Helpful buttons -->
                    <div class="mt-2 flex items-center space-x-3 text-xs">
                      <button class="flex items-center text-gray-500 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful
                      </button>
                      <button class="flex items-center text-gray-500 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Show if no reviews -->
              <div v-if="reviews.length === 0" class="bg-white rounded-lg p-6 border border-gray-100 shadow-sm text-center">
                <div class="w-14 h-14 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 class="text-base font-medium text-gray-900 mb-1">No Reviews Yet</h4>
                <p class="text-sm text-gray-500 mb-3">Be the first to share your experience</p>
                <button class="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-sm">
                  Write a Review
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Booking Widget -->
        <div class="lg:col-span-1 overflow-visible">
          <div class="bg-white rounded-xl p-5 shadow-lg border border-gray-50 booking-widget space-y-4 sticky top-4">
            <!-- Header with pricing badge -->
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-3">
                <h2 class="text-xl font-bold text-gray-900 leading-tight mb-2 flex items-center">
                  {{ space?.name || 'Loading...' }}
                  <span class="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
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
     
                <span class="text-black font-bold text-lg">{{ getDisplayPrice() }}</span>
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
              <span class="ml-2.5 font-bold text-gray-900 text-sm">{{ space?.rating || 0 }}</span>
              <span class="ml-1 text-gray-600 text-sm">({{ space?.reviews || 0 }} reviews)</span>
              
              <!-- Add quick-access review button -->
              <button class="ml-auto text-xs font-medium text-primary hover:underline flex items-center">
                See reviews
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Description with collapsible option -->
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-gray-700 leading-relaxed text-sm line-clamp-3">
                {{ space?.description || 'Loading description...' }}
              </p>
              <button class="mt-1 text-xs font-medium text-primary hover:underline">
                Read more
              </button>
            </div>

            <!-- Enhanced Meeting Room Booking Form with better UI/UX -->
            <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="space-y-4">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="font-semibold text-gray-900 text-base">Booking Details</h3>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <!-- Date and Time Selection with improved visual cues -->
                <div class="grid grid-cols-2 gap-3 mb-3">
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
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Time
                    </label>
                    <div class="grid grid-cols-2 gap-2 relative">
                      <!-- Start Time Custom Dropdown (Compact) -->
                      <div class="relative">
                        <div 
                          @click="toggleStartDropdown"
                          class="compact-select-field text-xs flex items-center justify-between px-2 py-1 border border-gray-200 bg-white rounded-md cursor-pointer hover:border-primary transition-colors duration-200 h-7"
                          :class="{ 
                            'ring-1 ring-primary/20': showStartTimeDropdown,
                            'text-gray-500': !bookingForm.timeRange.start
                          }"
                        >
                          <span v-if="bookingForm.timeRange.start" class="text-gray-900 whitespace-nowrap">
                            {{ formatTimeDisplay(bookingForm.timeRange.start) }}
                          </span>
                          <span v-else class="text-gray-500 whitespace-nowrap">Start</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <!-- Start Time Dropdown with compact styling -->
                        <div 
                          v-if="showStartTimeDropdown" 
                          class="absolute top-full left-0 w-[90px] bg-white border border-gray-200 rounded-sm shadow-xs z-1000 mt-0.5 overflow-hidden"
                        >
                          <div class="max-h-32 overflow-y-auto custom-scrollbar-time overflow-x-hidden">
                            <div
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
                              <span class="text-xs truncate max-w-[50px]" :class="{'text-gray-400': disabledTimes.start.includes(time), 'text-gray-700': !disabledTimes.start.includes(time)}">
                                {{ formatTimeDisplay(time) }}
                              </span>
                              <span v-if="disabledTimes.start.includes(time)" class="text-[7px] text-red-500 ml-0.5 whitespace-nowrap">
                                booked
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- End Time Custom Dropdown (Compact) -->
                      <div class="relative">
                        <div 
                          @click="toggleEndDropdown"
                          class="compact-select-field text-xs flex items-center justify-between px-2 py-1 border border-gray-200 bg-white rounded-md cursor-pointer hover:border-primary transition-colors duration-200 h-7"
                          :class="{ 
                            'ring-1 ring-primary/20': showEndTimeDropdown,
                            'text-gray-500': !bookingForm.timeRange.end,
                            'opacity-50 cursor-not-allowed': !bookingForm.timeRange.start 
                          }"
                        >
                          <span v-if="bookingForm.timeRange.end" class="text-gray-900 whitespace-nowrap">
                            {{ formatTimeDisplay(bookingForm.timeRange.end) }}
                          </span>
                          <span v-else class="text-gray-500 whitespace-nowrap">End</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <!-- End Time Dropdown with compact styling -->
                        <div 
                          v-if="showEndTimeDropdown && bookingForm.timeRange.start" 
                          class="absolute top-full left-0 w-[90px] bg-white border border-gray-200 rounded-sm shadow-xs z-1000 mt-0.5 overflow-hidden"
                        >
                          <div class="max-h-32 overflow-y-auto custom-scrollbar-time overflow-x-hidden">
                            <div
                              v-for="time in generateTimeSlots()" 
                              :key="time"
                              @click="selectEndTime(time)"
                              :class="[
                                'py-0.5 px-1.5 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center',
                                { 
                                  'opacity-50 cursor-not-allowed bg-gray-50': disabledTimes.end.includes(time)
                                }
                              ]"
                            >
                              <span class="text-xs truncate max-w-[50px]" :class="{'text-gray-400': disabledTimes.end.includes(time), 'text-gray-700': !disabledTimes.end.includes(time)}">
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

                <!-- Duration Display (Compact) -->
                <div v-if="bookingForm.timeRange.start && bookingForm.timeRange.end && calculateDurationInHours() > 0" 
                  class="text-center py-1 px-1.5 bg-blue-50 rounded-md border border-blue-100 mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-blue-600 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium text-blue-900">Duration: {{ calculateDurationInHours() }} hours</span>
                </div>

                <!-- Additional Facilities as Cards with visual enhancements -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 mt-5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Additional Amenities
                  </label>
                  
                  <div class="grid grid-cols-5 gap-2">
                    <label class="relative overflow-hidden bg-white rounded-lg cursor-pointer transition-all duration-300 group" 
                          :class="selectedFacilities.includes('tv') ? 'ring-2 ring-primary' : 'border border-gray-200 hover:border-gray-300'">
                      <input v-model="selectedFacilities" value="tv" type="checkbox" class="sr-only">
                      <div class="p-2 text-center">
                        <div class="mb-1 text-center bg-gray-50 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                          <svg class="w-4 h-4" :class="selectedFacilities.includes('tv') ? 'text-primary' : 'text-gray-500'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" />
                            <path d="M8 15v1.5a.5.5 0 001 0V15h2v1.5a.5.5 0 001 0V15h1a1 1 0 100-2H7a1 1 0 100 2h1z" />
                          </svg>
                        </div>
                        <span class="text-xs font-medium block" :class="selectedFacilities.includes('tv') ? 'text-primary' : 'text-gray-800'">TV</span>
                        <span class="text-xs font-medium text-green-600 block">+$25</span>
                      </div>
                      <div v-if="selectedFacilities.includes('tv')" class="absolute top-1 right-1">
                        <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    
                    <label class="relative overflow-hidden bg-white rounded-lg cursor-pointer transition-all duration-300 group" 
                          :class="selectedFacilities.includes('printer') ? 'ring-2 ring-primary' : 'border border-gray-200 hover:border-gray-300'">
                      <input v-model="selectedFacilities" value="printer" type="checkbox" class="sr-only">
                      <div class="p-2 text-center">
                        <div class="mb-1 text-center bg-gray-50 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                          <svg class="w-4 h-4" :class="selectedFacilities.includes('printer') ? 'text-primary' : 'text-gray-500'" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14a1 1 0 001 1h8a1 1 0 001-1v-3H5v3z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <span class="text-xs font-medium block" :class="selectedFacilities.includes('printer') ? 'text-primary' : 'text-gray-800'">Printer</span>
                        <span class="text-xs font-medium text-green-600 block">+$15</span>
                      </div>
                      <div v-if="selectedFacilities.includes('printer')" class="absolute top-1 right-1">
                        <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    
                    <label class="relative overflow-hidden bg-white rounded-lg cursor-pointer transition-all duration-300 group" 
                          :class="selectedFacilities.includes('catering') ? 'ring-2 ring-primary' : 'border border-gray-200 hover:border-gray-300'">
                      <input v-model="selectedFacilities" value="catering" type="checkbox" class="sr-only">
                      <div class="p-2 text-center">
                        <div class="mb-1 text-center bg-gray-50 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                          <svg class="w-4 h-4" :class="selectedFacilities.includes('catering') ? 'text-primary' : 'text-gray-500'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        <span class="text-xs font-medium block" :class="selectedFacilities.includes('catering') ? 'text-primary' : 'text-gray-800'">Catering</span>
                        <span class="text-xs font-medium text-green-600 block">+$50</span>
                      </div>
                      <div v-if="selectedFacilities.includes('catering')" class="absolute top-1 right-1">
                        <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    
                    <label class="relative overflow-hidden bg-white rounded-lg cursor-pointer transition-all duration-300 group" 
                          :class="selectedFacilities.includes('wifi') ? 'ring-2 ring-primary' : 'border border-gray-200 hover:border-gray-300'">
                      <input v-model="selectedFacilities" value="wifi" type="checkbox" class="sr-only">
                      <div class="p-2 text-center">
                        <div class="mb-1 text-center bg-gray-50 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                          <svg class="w-4 h-4" :class="selectedFacilities.includes('wifi') ? 'text-primary' : 'text-gray-500'" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <span class="text-xs font-medium block" :class="selectedFacilities.includes('wifi') ? 'text-primary' : 'text-gray-800'">WiFi</span>
                        <span class="text-xs font-medium text-green-600 block">+$10</span>
                      </div>
                      <div v-if="selectedFacilities.includes('wifi')" class="absolute top-1 right-1">
                        <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    
                    <label class="relative overflow-hidden bg-white rounded-lg cursor-pointer transition-all duration-300 group" 
                          :class="selectedFacilities.includes('coffee') ? 'ring-2 ring-primary' : 'border border-gray-200 hover:border-gray-300'">
                      <input v-model="selectedFacilities" value="coffee" type="checkbox" class="sr-only">
                      <div class="p-2 text-center">
                        <div class="mb-1 text-center bg-gray-50 rounded-full w-8 h-8 mx-auto flex items-center justify-center">
                          <svg class="w-4 h-4" :class="selectedFacilities.includes('coffee') ? 'text-primary' : 'text-gray-500'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 2a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V2z" />
                            <path fill-rule="evenodd" d="M3 5h14v8a3 3 0 01-3 3H6a3 3 0 01-3-3V5zm5 1a1 1 0 00-1 1v5a1 1 0 002 0V7a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <span class="text-xs font-medium block" :class="selectedFacilities.includes('coffee') ? 'text-primary' : 'text-gray-800'">Coffee</span>
                        <span class="text-xs font-medium text-green-600 block">+$5</span>
                      </div>
                      <div v-if="selectedFacilities.includes('coffee')" class="absolute top-1 right-1">
                        <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Dedicated Desk Booking Form -->
            <div v-else-if="productType === 'dedicated-desk'" class="space-y-4 dedicated-desk-form">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 class="font-semibold text-gray-900 text-base">Subscription Details</h3>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <!-- Date and Team Size in Same Row with improved visual organization -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div>
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
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Team Size
                    </label>
                    <TeamSizeDropdown
                      v-model="bookingForm.teamSize"
                      :max-capacity="space?.maxCapacity || space?.capacity || 50"
                      compact
                      height-class="h-10"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Package Selection with visual improvements -->
              <div class="subscription-plans mt-3">
                <label class="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                  Select Subscription Plan
                </label>
                
                <div class="grid grid-cols-2 gap-4">
                  <label class="relative overflow-hidden bg-white border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                         :class="selectedPackage === 'monthly' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 scale-105' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'">
                    <input v-model="selectedPackage" value="monthly" type="radio" class="sr-only">
                    <div class="p-4 text-center">
                      <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'monthly' ? 'text-primary' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="mb-2">
                        <div class="text-base font-semibold text-gray-900 mb-1">Monthly Plan</div>
                        <div class="text-xs text-gray-500">Flexible subscription</div>
                      </div>
                      <div class="text-xl font-bold text-primary mb-1">${{ space?.pricing?.monthly || 2500 }}</div>
                      <div class="text-xs text-gray-600">per month</div>
                      
                      <div class="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <ul class="space-y-1.5">
                          <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            No long-term commitment
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
                  
                  <label class="relative overflow-hidden bg-white border-2 rounded-xl cursor-pointer transition-all duration-300 group subscription-plan-tile" 
                         :class="selectedPackage === 'annual' ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 scale-105' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'">
                    <input v-model="selectedPackage" value="annual" type="radio" class="sr-only">
                    <div class="p-4 text-center relative">
                      <div class="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-0.5 rounded-bl-lg rounded-tr-xl font-medium shadow-sm transform rotate-3">
                        Best Value
                      </div>
                      
                      <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="selectedPackage === 'annual' ? 'text-primary' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      
                      <div class="mb-2 mt-1">
                        <div class="text-base font-semibold text-gray-900 mb-1">Annual Plan</div>
                        <div class="text-xs text-gray-500">Best savings</div>
                      </div>
                      <div class="text-xl font-bold text-primary mb-1">${{ space?.pricing?.annual || 27000 }}</div>
                      <div class="text-xs text-gray-600">per year</div>
                      
                      <div class="mt-2 bg-green-50 px-2 py-1 rounded-full inline-flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs font-medium text-green-800">Save ${{ getSavings() }}</span>
                      </div>
                      
                      <div class="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
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
            </div>

            <!-- Enhanced Price Calculation - Only for meeting-room and hot-desk -->
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
                      <span v-if="calculateDurationInHours() > 0" class="text-gray-600 font-normal">({{ calculateDurationInHours() }}h)</span>
                      <span v-else class="text-amber-600 font-normal">(Select time)</span>
                    </span>
                    <div v-if="calculateDurationInHours() > 0" class="text-xs text-gray-500 mt-0.5">
                      ${{ space?.pricing?.hourly || 85 }}/hour × {{ calculateDurationInHours() }} hours
                    </div>
                  </div>
                  <span class="font-semibold text-sm">${{ roomBasePrice }}</span>
                </div>
                
                <!-- Selected Facilities with enhanced styling -->
                <div v-if="selectedFacilities.length > 0" class="pt-1 pb-2">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Amenities</div>
                  <div v-for="facility in selectedFacilities" :key="facility" 
                       class="flex items-center justify-between text-sm text-gray-600 mb-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{{ facilityDisplayName(facility) }}</span>
                    </div>
                    <span class="font-medium text-primary">+${{ facilityPrice(facility) }}</span>
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
                    <span class="text-xl font-bold text-primary">${{ totalPrice }}</span>
                    <div class="text-xs text-gray-500">includes taxes & fees</div>
                  </div>
                </div>
                
                <!-- Payment info with enhanced visual cues -->
                <div class="flex items-start mt-2 bg-amber-50 border border-amber-100 rounded-md p-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-xs text-amber-800">
                    <span class="font-medium">Non-refundable booking.</span> Payment will be processed immediately upon confirmation.
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Action Buttons -->
            <div v-if="productType === 'meeting-room' || productType === 'hot-desk'" class="space-y-3">
              <button 
                @click="proceedToBooking"
                :disabled="!isBookingFormValid || isProcessing"
                class="w-full bg-primary text-white py-3.5 px-4 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-2px] active:translate-y-[1px] shadow-lg hover:shadow-xl flex items-center justify-center"
                :class="{'animate-pulse': isProcessing}"
              >
                <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isProcessing ? 'Processing...' : 'Book Now' }}
                <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
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
            
            <div v-else>
              <button
                @click="proceedToSubscription"
                :disabled="!isSubscriptionFormValid || isProcessing"
                class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                {{ isProcessing ? 'Processing...' : 'Subscribe Now' }}
              </button>
              <p v-if="productType === 'dedicated-desk'" class="text-xs text-gray-500 text-center mt-1">
                {{ currentUser ? 'Ready to book' : 'Login required for subscriptions' }}
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

        <!-- Placeholder div for layout -->
        
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModals 
      :showSignIn="showAuthModal"
      :showSignUp="showSignUpModal"
      @close="closeAuthModal"
      @user-authenticated="handleUserAuthenticated"
      @switch-to-signup="switchToSignUp"
      @switch-to-signin="switchToSignIn"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthModals from '../components/AuthModals.vue'
import SingleDatePicker from '../components/SingleDatePicker.vue'
import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue'
import TeamSizeDropdown from '../components/TeamSizeDropdown.vue'
import { NetworkManager } from '../api/networkManager'

import { SpacesAPI } from '../api'
import type { SpaceDto, ReviewDto, UserDto } from '../dto/response'
import { getSpaceTypeEnum } from '../types/enums'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useSpacesStore } from '../stores/spaces'

interface BookingForm {
  date: string | undefined
  timeRange: { start: string; end: string }
  teamSize: string
}

export default defineComponent({
  name: 'SpaceDetails',
  
  components: {
    AuthModals,
    SingleDatePicker,
    CustomTimeRangePicker,
    TeamSizeDropdown
  },
  
  data() {
    return {
      loading: true,
      error: '',
      isProcessing: false,
      currentImageIndex: 0,
      showGallery: false,
      showAuthModal: false,
      showSignUpModal: false,
      currentUser: null as UserDto | null,
      productType: 'meeting-room',
      isLoadingAvailability: false,
      isLoadingBookedSlots: false,
      bookedTimeSlots: [] as Array<{ startTime: string; endTime: string }>,
      disabledTimes: {
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
      selectedFacilities: [] as string[],
      selectedPackage: 'monthly',
      
      // Space data from API
      space: null as SpaceDto | null,
      reviews: [] as ReviewDto[],
      
      // timeSlots removed
    }
  },
  
  watch: {
    '$route': 'loadSpaceDetails'
  },

  computed: {
    today(): string {
      return new Date().toISOString().split('T')[0]
    },
    
    roomBasePrice(): number {
      if (!this.space?.pricing) return 0
      
      // For meeting-room and hot-desk, use hourly pricing
      if (this.productType === 'meeting-room' || this.productType === 'hot-desk') {
        const hourlyRate = this.space.pricing.hourly || 85
        const duration = this.calculateDurationInHours()
        return hourlyRate * duration
      }
      
      // For dedicated-desk, use the selected package pricing
      if (this.productType === 'dedicated-desk') {
        return this.getPackagePrice()
      }
      
      return 0
    },
    
    facilitiesPrice(): number {
      const prices: Record<string, number> = { tv: 25, printer: 15, catering: 50 }
      return this.selectedFacilities.reduce((total, facility) => {
        return total + (prices[facility] || 0)
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
      return !!(this.bookingForm.date &&
               this.bookingForm.timeRange.start &&
               this.bookingForm.timeRange.end)
    },
    
    isSubscriptionFormValid(): boolean {
      return !!(this.bookingForm.date &&
               this.selectedPackage &&
               (this.productType !== 'dedicated-desk' || this.bookingForm.teamSize))
    }
  },
  
  async mounted() {
    // Initialize stores
    const authStore = useAuthStore()
    const spacesStore = useSpacesStore()
    
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

    // Load space details
    await this.loadSpaceDetails()
    
    // Add click outside listener for dropdowns
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  
  methods: {
    async fetchBookedTimeSlots() {
      if (!this.bookingForm.date) return;

      this.isLoadingBookedSlots = true;
      try {
        const spaceId = parseInt(this.$route.params.id as string);
        this.bookedTimeSlots = await NetworkManager.getBookedTimeSlots(spaceId, this.bookingForm.date);
        this.calculateDisabledTimes();
      } catch (error) {
        console.error('Error fetching booked time slots:', error);
        this.bookedTimeSlots = [];
      } finally {
        this.isLoadingBookedSlots = false;
      }
    },

    calculateDisabledTimes() {
      const allTimeSlots = this.generateTimeSlots();
      const disabledStartTimes: string[] = [];
      const disabledEndTimes: string[] = [];

      // Disable start times that conflict with existing bookings
      for (const slot of allTimeSlots) {
        if (this.isTimeSlotBooked(slot, 'start')) {
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

    generateTimeSlots(): string[] {
      const slots: string[] = [];
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(timeString);
        }
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
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
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
          return `$${this.space.pricing.hourly || 0}/hr`
        case 'hot-desk':
          return `$${this.space.pricing.daily || 0}/day`
        case 'dedicated-desk':
          // Show monthly price for dedicated desk
          return `$${this.space.pricing.monthly || 0}/month`
        default:
          return 'Price not available'
      }
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
        
        const response = await SpacesAPI.getSpaceDetails(spaceId, getSpaceTypeEnum(this.productType))
        
        if (response.success && response.space) {
          this.space = response.space
          this.reviews = response.recentReviews || []
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
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      
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
      // this.$emit('update:startDate', formattedToday);
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
      
      switch (this.selectedPackage) {
        case 'daily':
          return this.space.pricing.daily || 0
        case 'monthly':
          return this.space.pricing.monthly || 0
        case 'annual':
          return this.space.pricing.annual || 0
        default:
          return 0
      }
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
      this.showAuthModal = false

      // After authentication, proceed with the booking
      if (this.productType === 'dedicated-desk') {
        setTimeout(() => {
          this.proceedToSubscription()
        }, 100)
      }
    },
    
    closeAuthModal(): void {
      this.showAuthModal = false
      this.showSignUpModal = false
    },
    
    switchToSignUp(): void {
      this.showAuthModal = false
      this.showSignUpModal = true
    },
    
    switchToSignIn(): void {
      this.showSignUpModal = false
      this.showAuthModal = true
    },
    
    onDateChange(date: string): void {
      this.bookingForm.date = date;
      // Reset time selection when date changes
      this.bookingForm.timeRange = { start: '', end: '' };
      // Fetch booked time slots for the new date
      this.fetchBookedTimeSlots();
    },
    
    // Custom dropdown methods
    toggleStartDropdown(): void {
      if (this.isLoadingBookedSlots) return;
      this.showStartTimeDropdown = !this.showStartTimeDropdown;
      this.showEndTimeDropdown = false; // Close end dropdown
    },
    
    toggleEndDropdown(): void {
      if (!this.bookingForm.timeRange.start || this.isLoadingBookedSlots) return;
      this.showEndTimeDropdown = !this.showEndTimeDropdown;
      this.showStartTimeDropdown = false; // Close start dropdown
    },
    
    selectStartTime(time: string): void {
      if (this.disabledTimes.start.includes(time)) return;
      this.bookingForm.timeRange.start = time;
      this.bookingForm.timeRange.end = ''; // Reset end time
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
    
    facilityDisplayName(facility: string): string {
      const names: Record<string, string> = {
        tv: 'TV/Display',
        printer: 'Printer Access',
        catering: 'Catering Service'
      }
      return names[facility] || facility
    },
    facilityPrice(facility: string): number {
      const prices: Record<string, number> = { tv: 25, printer: 15, catering: 50 }
      return prices[facility] || 0
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
            startTime: this.bookingForm.timeRange.start,
            endTime: this.bookingForm.timeRange.end, // Pass endTime
            duration: this.calculateDurationInHours().toString(), // Calculate duration
            // Add legacy date field for backward compatibility
            date: this.bookingForm.date
          },
          facilities: this.selectedFacilities,
          totalPrice: this.totalPrice,
          pricing: {
            basePrice: this.roomBasePrice,
            facilitiesPrice: this.facilitiesPrice,
            total: this.totalPrice
          }
        }

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
        this.showAuthModal = true
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
            endDate: this.bookingForm.date,
            packageType: this.selectedPackage,
            teamSize: this.bookingForm.teamSize
          },
          totalPrice: this.getPackagePrice(),
          pricing: {
            basePrice: this.getPackagePrice(),
            facilitiesPrice: 0,
            serviceFee: Math.round(this.getPackagePrice() * 0.1),
            taxes: Math.round(this.getPackagePrice() * 0.0875),
            total: this.getPackagePrice()
          }
        }

        bookingStore.setBookingDetails(subscriptionDetails)
        await this.$router.push({ name: 'BookingSummary' })
      } catch (error) {
        console.error('Error proceeding to subscription:', error)
      } finally {
        this.isProcessing = false
      }
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
  border-color: #3b82f6;
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
  border-color: #818cf8;
}

.modern-time-select:focus {
  border-color: #4f46e5;
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
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.custom-scrollbar-time::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #3730a3 0%, #6b21a8 100%);
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
  border-color: #4f46e5 !important;
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
  border-color: #6366F1;
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

</style>