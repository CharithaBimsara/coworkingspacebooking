<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p class="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
    </div>
  </div>
  <div v-else class="min-h-screen bg-white dark:bg-black transition-colors duration-300">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto container-padding section-padding relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-black dark:text-white leading-tight">
              Your
              <span class="relative inline-block mx-4">
                <span class="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  Workspace
                </span>
                <svg class="absolute -bottom-2 left-0 w-full h-1" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3C50 -1 150 -1 200 3" stroke="url(#gradient)" stroke-width="4" stroke-linecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#00FE01"/>
                      <stop offset="100%" stop-color="#00FE01"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              Your Way
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              From hot desks to private offices — multiple Colombo locations across the country, made affordable for everyone.

            </p>

            <!-- Cute Search Widget -->
            <div class="bg-white dark:bg-black p-6 rounded-3xl shadow-xl border-2 border-primary animate-bounce-enter-active">
              <div class="grid sm:grid-cols-2 gap-4">
                <!-- Location -->
                <div class="space-y-2 mt-1">
                  <!-- LocationDropdown always visible -->
                  <LocationDropdown 
                    v-model="searchForm.location" 
                    label="Location"
                    placeholder="Where do you want to work?" 
                    :locations="locations"
                    :disabled="locationApiError"
                    @change="onLocationChange" 
                  />
                  
                  <!-- API Error Message -->
                  <p v-if="locationApiError" class="text-amber-600 dark:text-amber-400 text-xs mt-1">
                    Location service is temporarily unavailable
                  </p>
                </div>

                <!-- Space Type -->
                <div class="space-y-2 mt-1">
                  <SpaceTypeDropdown v-model="searchForm.spaceType" :options="spaceTypeOptions" label="Space Type" :isHomePage="true" />
                </div>
              </div>

              <button @click="searchSpaces" :disabled="isSearching"
                class="w-full mt-6 bg-primary text-black dark:text-black py-3 px-6 rounded-full font-semibold text-sm hover:bg-primary/90 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 shadow-lg">
                <span class="flex items-center justify-center">
                  <svg v-if="isSearching" class="animate-spin -ml-1 mr-2 h-4 w-4 text-black dark:text-black" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSearching ? 'Searching...' : 'Search Spaces' }}
                  <svg v-if="!isSearching" class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative animate-fade-in">
            <div class="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl overflow-hidden border-2 border-primary transform hover:scale-[1.02] transition-all duration-300">
              <img 
                src="/src/assets/images/app-images/hero.jpg" 
                :alt="companyProfile.name" 
                class="w-full h-full object-cover"
              >
            </div>
            <!-- Floating cards -->
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-black p-5 rounded-2xl shadow-lg border-2 border-primary transform hover:scale-110 hover:rotate-2 transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-black dark:text-white text-sm">Meeting Rooms</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Professional spaces</p>
                </div>
              </div>
            </div>
            <div class="absolute -top-6 -right-6 bg-white dark:bg-black p-5 rounded-2xl shadow-lg border-2 border-primary transform hover:scale-110 hover:rotate-2 transition-all duration-300">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-black dark:text-white text-sm">Hot Desks</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Flexible workspaces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Offers & Partners Section -->
    <section class="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300" v-if="advertisements.length > 0 || advertisementsApiError">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            Special Offers
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p v-if="advertisementsApiError" class="mt-3 text-red-500 text-sm">
            {{ advertisementErrorMessage }}
          </p>
        </div>

        <!-- Infinite Scrolling Cards Carousel -->
        <div class="relative overflow-hidden">
          <!-- Left arrow button -->
          <button @click="moveCarousel('left')"
                  class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black text-gray-600 dark:text-gray-300 hover:text-primary p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Right arrow button -->
          <button @click="moveCarousel('right')"
                  class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black text-gray-600 dark:text-gray-300 hover:text-primary p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Gradient fade edges for smooth transition -->
          <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>

          <!-- Create multiple duplicates for seamless infinite scroll -->
          <div class="flex carousel-container"
               :style="{ width: `${advertisements.length * 4 * 336}px`, transform: `translateX(${carouselPosition}px)` }"
               ref="carouselRef">
            <!-- Duplicate advertisements 4 times for smooth infinite loop -->
            <template v-for="n in 4" :key="`group-${n}`">
              <div v-for="(ad, index) in advertisements" :key="`ad-${n}-${index}`"
                   class="flex-shrink-0 w-80 mx-6 first:ml-0 last:mr-0">
                <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                     @click="openAdModal(ad)">
                  <!-- Advertisement Image -->
                  <div class="aspect-[4/3] overflow-hidden">
                    <img :src="ad.images"
                         :alt="'Advertisement'"
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  </div>

                  <!-- Overlay with button -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button @click.stop="openAdUrl(ad.url)"
                            class="bg-primary text-black px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-200 transform hover:scale-105 shadow-lg">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Visit
                    </button>
                  </div>

                  <!-- Subtle border animation -->
                  <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Links Section -->
    <section class="section-padding bg-white dark:bg-black transition-colors duration-300">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            Choose Your Workspace
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Find the perfect space for your work style and needs
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Meeting Rooms -->
          <router-link to="/search?spaceType=meeting-room"
            class="group cute-card flex flex-col items-center hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-primary">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-black dark:text-white mb-3">Meeting Rooms</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center text-sm">Professional, fully equipped spaces to host clients, workshops, or team sessions.</p>
            <div class="mt-4 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-xs font-medium text-black dark:text-white inline-flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Book Now
            </div>
          </router-link>

          <!-- Hot Desk -->
          <router-link to="/search?spaceType=hot-desk"
            class="group cute-card flex flex-col items-center hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-primary">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 122.88 73.12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M97.13,61.06c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,61.06,97.13,61.06L97.13,61.06z M25.08,14.73v56.31c0,0.58-0.24,1.1-0.61,1.48c-0.38,0.38-0.9,0.61-1.48,0.61h-9.92 c-0.57,0-1.09-0.23-1.47-0.61l0,0l0,0l0,0c-0.38-0.38-0.61-0.9-0.61-1.47V14.73H2.96c-0.82,0-1.56-0.33-2.09-0.87 C0.33,13.32,0,12.58,0,11.77V2.96C0,2.14,0.33,1.4,0.87,0.87S2.14,0,2.96,0h116.96c0.82,0,1.56,0.33,2.09,0.87s0.87,1.28,0.87,2.09 v8.81c0,0.82-0.33,1.56-0.87,2.09c-0.54,0.54-1.28,0.87-2.09,0.87h-0.19v56.31c0,0.57-0.24,1.09-0.61,1.47l-0.01,0.01 c-0.38,0.38-0.9,0.61-1.47,0.61H77.18c-0.58,0-1.1-0.23-1.48-0.61c-0.07-0.07-0.13-0.14-0.19-0.22c-0.27-0.35-0.43-0.79-0.43-1.26 V14.73H25.08L25.08,14.73z M78.54,30.64h37.74V14.73H78.54V30.64L78.54,30.64z M116.28,34.09H78.54V50.3h37.74V34.09L116.28,34.09z M116.28,53.75H78.54v15.93h37.74V53.75L116.28,53.75z M119.43,3.45H3.45v7.83h115.98V3.45L119.43,3.45z M21.63,14.73h-7.21v54.94 h7.21V14.73L21.63,14.73z M97.13,21.27c3.25,0,5.88,0.53,5.88,1.19s-2.63,1.19-5.88,1.19c-3.25,0-5.88-0.53-5.88-1.19 S93.88,21.27,97.13,21.27L97.13,21.27z M97.13,41.13c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,41.13,97.13,41.13L97.13,41.13z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-black dark:text-white mb-3">Hot Desk</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center text-sm">A flexible desk in our shared coworking area — just plug in and start working.</p>
            <div class="mt-4 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-xs font-medium text-black dark:text-white inline-flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Book Now
            </div>
          </router-link>

          <!-- Dedicated Desk -->
          <router-link to="/search?spaceType=dedicated-desk"
            class="group cute-card flex flex-col items-center hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-primary">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 122.88 107.29">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M28,18.22a1,1,0,0,0-.36.42,1.54,1.54,0,0,0-.12.67,5.83,5.83,0,0,0,1.2,2.91h0l2.51,4a21.61,21.61,0,0,0,3.37,4.45,6.91,6.91,0,0,0,4.82,1.94,7.12,7.12,0,0,0,5.1-2A22.16,22.16,0,0,0,48,25.85l2.83-4.66a10.13,10.13,0,0,0,.53-1.48c.45-1.8-.72-1.4-2.08-1.43a4.23,4.23,0,0,1-.5-.05l1-3.69c-7.2,1.14-12.58-4.21-20.18-1.07l.55,4.46c-.77,0-1.41-.21-2.13.29ZM74.68,10H114.3a3.25,3.25,0,0,1,3.23,3.23V39.48a3.25,3.25,0,0,1-3.23,3.23H99.54l2.52,6.35H118a4.89,4.89,0,0,1,4.88,4.88V65.08A4.91,4.91,0,0,1,118,70h-2.47V103.6a3.69,3.69,0,0,1-3.69,3.69H11.59a3.73,3.73,0,0,1-3.71-3.72V70h-3A4.9,4.9,0,0,1,0,65.07V53.93a4.88,4.88,0,0,1,4.88-4.87h7.59c0-1.35,0-2.11,0-3.46,0-8.5,14.26-7.89,19.18-11.1a27.65,27.65,0,0,0,1.29-3.38L33,31A26.54,26.54,0,0,1,30,27l-2.51-4a7.27,7.27,0,0,1-1.43-3.64,3,3,0,0,1,.25-1.32,2.42,2.42,0,0,1,.86-1,3.07,3.07,0,0,1,.6-.31,55.24,55.24,0,0,1-.12-6.59A10.62,10.62,0,0,1,28,8.52a10.53,10.53,0,0,1,7-6.76c1.57-.54,1-1.83,2.56-1.76,3.74.21,9.53,2.63,11.76,5.18C52.4,8.78,51.6,12.6,51.49,17h0a1.78,1.78,0,0,1,1.32,1.36,5.73,5.73,0,0,1-.68,3.43h0a.14.14,0,0,1-.05.08l-2.86,4.71a23,23,0,0,1-3.73,5l-.06.09.46.67c.5.73,1.06,1.56,1.59,2.21,3.94,2.45,17.81,3,18.05,9.13l.21,5.35H87l3-6.35H74.68a3.25,3.25,0,0,1-3.23-3.23V13.2A3.24,3.24,0,0,1,74.68,10Zm-70,43.76a.3.3,0,0,0-.08.2V65.07a.27.27,0,0,0,.27.29H118a.27.27,0,0,0,.28-.29V53.93a.27.27,0,0,0-.09-.2.29.29,0,0,0-.2-.09c-10.48,0-113-.14-113.28.09ZM12.47,70v32.73H111V70ZM34.92,39a3.1,3.1,0,0,1,0-4.55,10.66,10.66,0,0,1,3.78,2,2.21,2.21,0,0,1,1-.16,24.37,24.37,0,0,1,4.13-2.12c1.85,1.8,1.66,3.47-.16,5a8.27,8.27,0,0,1-2.32-1.07,3.27,3.27,0,0,1-.2.79l2,7.81c1.54-3.24,3.14-6.6,3.54-10.79a30.66,30.66,0,0,1-2-2.71c-.15-.21-.28-.4-.4-.59A8.33,8.33,0,0,1,39.44,34a8.08,8.08,0,0,1-5.29-1.9,16.7,16.7,0,0,1-1.53,3.59,1.07,1.07,0,0,1-.14.16A38.16,38.16,0,0,0,36.26,46.7l2-7.81a2.4,2.4,0,0,1-.4-1.29,8.88,8.88,0,0,1-3,1.36Z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-black dark:text-white mb-3">Dedicated Desk</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center text-sm">Your own personal desk in a shared space, with storage and consistent setup every day</p>
            <div class="mt-4 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-xs font-medium text-black dark:text-white inline-flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Book Now
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Spaces -->
    <section v-if="featuredSpaces.length > 0" class="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            Top-Rated Workspaces
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Join a vibrant community of professionals who rated Ceylinco-Works 5-stars for flexibility, comfort, and networking opportunities.
          </p>
        </div>

        <div v-if="isLoadingSpaces" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-opacity-30 border-t-primary"></div>
          <p class="mt-6 text-gray-600 dark:text-gray-300 text-sm">Loading top-rated spaces...</p>
        </div>

        <div v-else-if="featuredSpaces.length > 0"
             :class="[
               'grid gap-5',
               featuredSpaces.length === 1 ? 'grid-cols-1 justify-center' : '',
               featuredSpaces.length === 2 ? 'md:grid-cols-2 justify-center' : '',
               featuredSpaces.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : ''
             ]">
          <div v-for="space in featuredSpaces" :key="space.id" 
               class="card overflow-hidden group cursor-pointer hover:shadow-xl dark:hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl max-w-sm w-full mx-auto"
               @click="viewSpace(space.id)">
            <div class="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
              <img
                :src="space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                :alt="space.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <!-- Top Rated badge -->
              <div class="absolute top-2 left-2 bg-primary text-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Top Rated
              </div>
              <!-- Like button -->
              <button class="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black transition-colors shadow-md hover:scale-110 transform text-gray-400 dark:text-gray-500 hover:text-primary">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div class="p-3 flex flex-col flex-grow">
              <div class="flex-grow">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                    {{ space.name }}
                  </h3>
                  <div class="bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                    {{ formatCurrency(getStartingPrice(space)) }}
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">/day</span>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-1.5">
                  <div class="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                    <div class="p-0.5 bg-gray-100 dark:bg-gray-800 rounded-full mr-1.5 flex-shrink-0">
                      <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <span class="truncate max-w-[120px]">{{ space.location }}</span>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <svg v-for="star in 5" :key="star" :class="['w-3 h-3', star <= space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-1 text-xs text-gray-600 dark:text-gray-400">{{ space.rating }} ({{ space.reviews }})</span>
                  </div>
                </div>
              </div>

              <button class="btn-primary text-xs w-full mt-3 py-1.5 px-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-sm">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ spacesApiError ? spacesErrorMessage : 'No featured spaces available at the moment.' }}
          </p>
          <button @click="loadFeaturedSpaces" 
                  class="mt-4 bg-primary/20 dark:bg-primary/30 text-black dark:text-white px-5 py-1.5 rounded-full font-medium text-sm hover:bg-primary/30 transition-colors">
            {{ spacesApiError ? 'Try Again' : 'Check Back Later' }}
          </button>
        </div>

        <!-- See More Button -->
        <div class="text-center mt-12">
          <router-link to="/search"
            class="bg-primary text-black dark:text-white px-8 py-3 rounded-full font-semibold text-sm hover:scale-105 transform transition-all duration-300 shadow-lg inline-flex items-center">
            See More Spaces
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section-padding bg-white dark:bg-black transition-colors duration-300">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            Why Choose Us?
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            We make dedicated desk simple, flexible, and affordable for modern professionals
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <div class="text-center group cute-card hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary shadow-lg">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black dark:text-white mb-4">Unmatched Flexibility
</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Work on your terms. Whether you need a desk for a day, a meeting room for an hour, or a private office long-term, Ceylinco-Works adapts to you. Our flexible booking policies let you scale up or down without hassle, so your workspace always fits your lifestyle and business needs.
            </p>
          </div>

          <div class="text-center group cute-card hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary shadow-lg">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black dark:text-white mb-4">Prime Locations, Affordable Prices</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              We bring you coworking spaces in central, accessible areas  all around the country, all designed with modern interiors and essential amenities. Unlike traditional offices, you’ll enjoy premium locations without the premium price tag, making professional workspaces accessible for everyone.
            </p>
          </div>

          <div class="text-center group cute-card hover:-translate-y-2 transition-all duration-300">
            <div
              class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary shadow-lg">
              <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black dark:text-white mb-4">Backed by Trusted Brands</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ceylinco-Works is powered by Ceylinco Life and SquareHub, combining the trust and stability of  Sri Lanka’s most respected names with the innovation and community focus of a startup ecosystem builder. This means reliable infrastructure, thoughtfully designed spaces, and a supportive environment to help you thrive.

            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            What Our Members Say
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Join thousands of professionals who love working with us
          </p>
          
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="testimonial in displayTestimonials" :key="testimonial.id" 
               class="bg-white dark:bg-black p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-800 hover:border-primary transform hover:-translate-y-2">
            <div class="mb-4 flex justify-between items-center">
              <div class="flex text-primary items-center">
                <svg v-for="star in 5" :key="star" class="w-5 h-5 fill-current" 
                     :class="{ 'text-gray-300 dark:text-gray-600': star > Math.round(testimonial.rating) }"
                     viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-2 font-medium text-black dark:text-white text-sm">{{ testimonial.rating.toFixed(1) }}</span>
              </div>
              <div class="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base italic">
              "{{ testimonial.content }}"
            </p>
            <div class="flex items-center">
              <div class="relative">
                <img :src="testimonial.avatar" :alt="testimonial.name" 
                     class="w-14 h-14 rounded-full object-cover border-2 border-primary"
                     :onerror="`this.src='${getFallbackLogoUrl()}';this.onerror='';`">
                <div class="absolute -right-1 -bottom-1 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                  <svg class="w-3 h-3 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="font-bold text-black dark:text-white">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <!-- About Section -->
    <section id="about" class="section-padding scroll-mt-20 bg-white dark:bg-black transition-colors duration-300">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            About {{ companyProfile.name }}
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Your premium coworking solution for modern professionals
          </p>
         
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div class="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-primary shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <img src="/src/assets/images/app-images/hero.jpg" 
                alt="Modern workspace" class="w-full h-full object-cover">
            </div>
           
            
            <!-- Decorative element -->
            <div class="absolute -top-6 -left-6 w-16 h-16 bg-primary/20 rounded-full"></div>
          </div>
          
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-black dark:text-white">Creating Productive Work Environments</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base text-justify">
              At Ceylinco-Works, we believe that everyone deserves access to professional workspaces without the high costs and rigid contracts of traditional offices. Born from a collaboration between Ceylinco Life and SquareHub, our mission is to make coworking accessible for freelancers, entrepreneurs, startups, and established businesses alike. 
            </p>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base text-justify">
              From hot desks to private offices, we provide spaces that adapt to the way you work, helping you stay productive, connected, and inspired.
            </p>
             <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base text-justify">
              More than just a place to sit, Ceylinco-Works is about community and growth. Our locations are designed with modern interiors, reliable amenities, and flexible plans that support both individuals and teams. Whether you’re hosting clients in a meeting room, working late at night, or networking with like-minded professionals, you’ll find everything you need to thrive under one roof — all backed by the trust and stability of Ceylinco Life and the entrepreneurial spirit of SquareHub.

            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Newsletter Section -->
    <section id="contact" class="section-padding bg-gray-50 dark:bg-gray-900 transition-colors duration-300 scroll-mt-20">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-black dark:text-white mb-4 relative inline-block">
            Contact Us
            <svg class="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3C50 -1 150 -1 200 3" stroke="#00FE01" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Get in touch with our team or subscribe for updates
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div class="bg-white dark:bg-black p-8 rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-800 space-y-8">
            <div>
              <h3 class="text-xl font-bold text-black dark:text-white mb-4">Get In Touch</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6 text-base">
                Have questions about our workspace solutions? Our team is ready to help you find
                the perfect space for your needs.
              </p>
            </div>
            
            <div class="space-y-6">
              <!-- Email -->
              <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors duration-300">
                <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mr-5">
                  <svg class="w-7 h-7 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-base font-bold text-black dark:text-white">Email Us</h4>
                  <a :href="'mailto:' + companyProfile.email" class="text-gray-600 dark:text-gray-400 text-sm">{{ companyProfile.email }}</a>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors duration-300">
                <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mr-5">
                  <svg class="w-7 h-7 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-base font-bold text-black dark:text-white">Call Us</h4>
                  <a :href="'tel:' + companyProfile.phone" class="text-gray-600 dark:text-gray-400 text-sm">{{ companyProfile.phone }}</a>
                </div>
              </div>
              
              <!-- Location -->
              <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors duration-300">
                <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mr-5">
                  <svg class="w-7 h-7 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-base font-bold text-black dark:text-white">Address</h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ companyProfile.address }}</p>
                </div>
              </div>
            </div>
            
            <!-- Social Media Links -->
            <div>
              <h4 class="text-base font-bold text-black dark:text-white mb-5">Follow Us</h4>
              <div class="flex space-x-4">
                <!-- Facebook - Pending -->
                <a href="#" class="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform opacity-50 cursor-not-allowed">
                  <svg class="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <!-- Instagram - Pending -->
                <a href="#" class="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform opacity-50 cursor-not-allowed">
                  <svg class="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <!-- LinkedIn - Pending -->
                <a href="#" class="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform opacity-50 cursor-not-allowed">
                  <svg class="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
             
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="bg-white dark:bg-black rounded-3xl p-8 shadow-xl border-2 border-primary relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -translate-y-20 translate-x-20"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div class="relative z-10">
              <h3 class="text-xl font-bold mb-6 text-gray-800 dark:text-white">Send Us a Message</h3>
              <p class="text-gray-600 dark:text-white/90 mb-8 text-base">
                Have questions or need assistance? Send us a message and we'll get back to you as soon as possible.
              </p>
              <div class="space-y-5">
                <div>
                  <label for="contactName" class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Name</label>
                  <input type="text" id="contactName" v-model="newsletterName" placeholder="Your name" 
                    class="w-full px-5 py-4 rounded-full border-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner placeholder-gray-400 dark:placeholder-gray-400">
                </div>
                <div>
                  <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email Address</label>
                  <input type="email" id="contactEmail" v-model="newsletterEmail" placeholder="Your email" 
                    class="w-full px-5 py-4 rounded-full border-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner placeholder-gray-400 dark:placeholder-gray-400">
                </div>
                <div>
                  <label for="contactMessage" class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Message</label>
                  <textarea id="contactMessage" v-model="messageContent" placeholder="Your message" rows="4"
                    class="w-full px-5 py-4 rounded-2xl border-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner placeholder-gray-400 dark:placeholder-gray-400"></textarea>
                </div>
                <button 
                  @click="sendContactMessage" 
                  :disabled="isSubscribing || !newsletterEmail || !messageContent" 
                  class="w-full px-5 py-4 bg-primary text-black dark:text-white font-bold rounded-full hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-gray-800/30 dark:focus:ring-white/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  <span class="flex items-center justify-center">
                    <svg v-if="isSubscribing" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubscribing ? 'Sending...' : 'Send Message' }}
                  </span>
                </button>
                <div v-if="subscriptionMessage" class="mt-3 text-gray-700 dark:text-white/90 text-sm text-center bg-gray-100 dark:bg-primary/20 p-3 rounded-full">
                  {{ subscriptionMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>    <!-- Footer -->
    <footer class="bg-white dark:bg-black text-gray-800 dark:text-white py-16 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full"></div>
      <div class="absolute bottom-0 right-0 w-60 h-60 bg-primary/5 rounded-full"></div>
      
      <div class="max-w-7xl mx-auto container-padding relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Brand & Description -->
          <div class="space-y-6">
            <div class="flex items-center">
              <div class="h-10 w-auto mr-2">
                <img src="@/assets/images/app-images/logo.png" alt="Project Logo" class="h-full w-auto object-contain" />
              </div>
             
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Discover premium workspaces designed for productivity, flexibility, and collaboration. Book your perfect
              space today.
            </p>
          </div>

          <!-- Navigation -->
          <div class="space-y-6">
            <h4 class="text-lg font-bold text-primary">Explore</h4>
            <ul class="space-y-3">
              <li>
                <router-link to="/search" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  All Spaces
                </router-link>
              </li>
              <li>
                <router-link to="/search?spaceType=meeting-rooms" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Meeting Rooms
                </router-link>
              </li>
              <li>
                <router-link to="/search?spaceType=hot-desk" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Hot Desks
                </router-link>
              </li>
              <li>
                <router-link to="/search?spaceType=dedicated-desk" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Dedicated Desks
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-6">
            <h4 class="text-lg font-bold text-primary">Contact Us</h4>
            <ul class="space-y-3">
              <li class="flex items-start">
                <div class="bg-gray-100 dark:bg-primary/20 p-2 rounded-full mr-3 mt-1">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a :href="'mailto:' + companyProfile.email" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm">
                  {{ companyProfile.email }}
                </a>
              </li>
              <li class="flex items-start">
                <div class="bg-gray-100 dark:bg-primary/20 p-2 rounded-full mr-3 mt-1">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a :href="'tel:' + companyProfile.phone" class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm">
                  {{ companyProfile.phone }}
                </a>
              </li>
              <li class="flex items-start">
                <div class="bg-gray-100 dark:bg-primary/20 p-2 rounded-full mr-3 mt-1">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">{{ companyProfile.address }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
          <div class="flex flex-col md:flex-row items-center justify-center gap-4">
            <div class="flex items-center text-primary">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              &copy; {{ currentYear }} {{ companyProfile.name }}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Advertisement Modal -->
    <div v-if="showAdModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="closeAdModal">
      <div class="relative max-w-6xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform animate-modal-enter"
           @click.stop>
        <!-- Close button -->
        <button @click="closeAdModal"
                class="absolute top-4 right-4 z-10 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 p-2 rounded-full transition-all duration-200 shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Modal content -->
        <div v-if="selectedAd" class="relative">
          <!-- Responsive image container - maintains original aspect ratio -->
          <div class="relative w-full">
            <img :src="selectedAd.images"
                 :alt="'Advertisement'"
                 class="w-full h-auto max-h-[70vh] object-contain rounded-t-3xl">
          </div>

          <!-- Action buttons -->
          <div class="absolute bottom-6 left-6 right-6 flex justify-center">
            <button @click="openAdUrl(selectedAd.url)"
                    class="bg-primary text-black px-4 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 min-w-[200px] max-w-[300px]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Visit Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocationDropdown from '../components/LocationDropdown.vue';
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue';
import type { SpaceDto, AdvertisementDto, CompanyProfileDto } from '../dto/response';
import { TestimonialDto } from '../dto/response';
import { apiManager } from '../api/apiManager';
import { formatPrice, formatCurrency } from '../utils/formatUtils';
import logoImage from '@/assets/images/app-images/logo.png';

interface SearchForm {
  location: string;
  spaceType: string;
}

interface SpaceTypeOption {
  value: string;
  label: string;
  icon: string;
}

export default defineComponent({
  name: 'HomePage',

  components: {
    LocationDropdown,
    SpaceTypeDropdown
  },

  data() {
    return {
      searchForm: {
        location: '',
        spaceType: ''
      } as SearchForm,
      isLoading: true, // New loading state for initial data fetching
      isSearching: false,
      isLoadingSpaces: false,
      isLoadingCompanyProfile: false,
      isLoadingTestimonials: false,
      isSubscribing: false,
      newsletterName: '',
      newsletterEmail: '',
      messageContent: '',
      subscriptionMessage: '',
      currentSlide: 0,
      slideInterval: null as number | null,
      advertisements: [] as AdvertisementDto[],
      featuredSpaces: [] as SpaceDto[],
      // API state management
      locationApiError: false,
      advertisementsApiError: false,
      spacesApiError: false,
      companyProfileApiError: false,
      testimonialsApiError: false,
      advertisementErrorMessage: '',
      spacesErrorMessage: '',
      companyProfileErrorMessage: '',
      testimonialsErrorMessage: '',
      testimonials: [] as TestimonialDto[],
      locations: [] as { id: number; name: string; address: string; url: string }[],
      selectedLocationObject: null as { id: number; name: string; address: string; url: string } | null, // To store full location object
      selectedLocationId: null as number | null, // To store selected location ID for API calls
      companyProfile: {} as CompanyProfileDto,
      // Advertisement modal
      showAdModal: false,
      selectedAd: null as AdvertisementDto | null,
      // Touch handling for carousel
      touchStartX: 0,
      touchEndX: 0,
      // Carousel position for manual control
      carouselPosition: 0,
      carouselAnimationId: null as number | null,
      spaceTypeOptions: [
        {
          value: '',
          label: 'All Types',
          icon: ''
        },
        {
          value: 'meeting-room',
          label: 'Meeting Room',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
        },
        {
          value: 'hot-desk',
          label: 'Hot Desk',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
        },
        {
          value: 'dedicated-desk',
          label: 'Dedicated Desk',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
        }
      ] as SpaceTypeOption[]
    };
  },

  computed: {
    currentYear(): number {
      return new Date().getFullYear();
    },

    displayTestimonials(): TestimonialDto[] {
      // Always show fake testimonials for now
      return [
        new TestimonialDto({
          id: 1,
          name: 'Charitha Bimsara',
          role: 'Software Engineer',
          content: 'Ceylinco-Works has transformed how our team collaborates. The meeting rooms are professional, the hot desks are always available, and the community is incredibly supportive. Highly recommend!',
          avatar: '/src/assets/images/user-images/charitha.jpg',
          rating: 5.0
        }),
        new TestimonialDto({
          id: 2,
          name: 'Dulan Herath',
          role: 'Freelance Developer',
          content: 'As a freelancer, I need flexibility and reliability. Ceylinco-Works delivers on both. The dedicated desks give me a home base, and the high-speed WiFi never disappoints. Perfect for focused work.',
          avatar: '/src/assets/images/user-images/dulan.jpg',
          rating: 4.8
        }),
        new TestimonialDto({
          id: 3,
          name: 'Upeksha Delwala',
          role: 'Startup Founder',
          content: 'The facilities are top-notch and the location is perfect for client meetings. What really stands out is the community - I\'ve made valuable connections that have helped grow my business.',
          avatar: '/src/assets/images/user-images/upeksha.jpg',
          rating: 4.9
        })
      ];
    }
  },

  beforeMount() {
    // Start loading all required data
    this.loadAllData();
  },
  
  async mounted() {
    // Start slideshow after mounting
    this.startSlideshow();
    // Start carousel animation
    this.startCarouselAnimation();
  },

  beforeUnmount() {
    // Clean up animations
    this.stopSlideshow();
    this.stopCarouselAnimation();
  },

  methods: {
    /**
     * Get the fallback logo URL for images
     */
    getFallbackLogoUrl(): string {
      return logoImage;
    },

    /**
     * Load all data needed for the home page
     */
    async loadAllData() {
      try {
        // Start loading all required data in parallel
        const promises = [
          this.loadLocationsFromApi(),
          this.loadAdvertisementsFromApi(),
          this.loadFeaturedSpaces(),
          this.loadCompanyProfile(),
          this.loadTestimonials()
        ];
        
        // Wait for all promises to settle (complete or fail)
        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Turn off loading state after all data fetching attempts
        this.isLoading = false;
      }
    },
    /**
     * Load advertisements from API
     * Implements error handling with cache fallback
     */
    async loadAdvertisementsFromApi() {
      try {
        this.advertisementsApiError = false;
        this.advertisementErrorMessage = '';
        
        // Check for cached advertisements
        const cachedData = localStorage.getItem('cached_advertisements');
        
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            
            // Use cache if it's less than 6 hours old
            if (cacheAge < 6 * 60 * 60 * 1000) {
              this.advertisements = parsed.data;
              console.log('Using cached advertisements data');
              
              // Make API call in background to update cache
              this.refreshAdvertisementCache();
              return;
            }
          } catch (e) {
            console.error('Error parsing cached advertisements:', e);
            // Continue with API call if cache parsing fails
          }
        }
        
        console.log('Loading advertisements from API...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        try {
          const advertisements = await apiManager.getAdvertisements();
          
          // Clear the timeout since the request completed
          clearTimeout(timeoutId);
          
          if (advertisements && advertisements.length > 0) {
            this.advertisements = advertisements;
            
            // Cache the results
            localStorage.setItem('cached_advertisements', JSON.stringify({
              timestamp: Date.now(),
              data: advertisements
            }));
          } else {
            // No advertisements available
            this.advertisements = [];
          }
        } catch (error) {
          // If API call fails, check for cache regardless of age
          console.error('Error fetching advertisements:', error);
          
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              this.advertisements = parsed.data;
              this.advertisementsApiError = true;
              this.advertisementErrorMessage = 'Using previously cached special offers. Some information may not be up to date.';
            } catch (e) {
              console.error('Error parsing cached advertisements during error recovery:', e);
              this.advertisements = [];
              this.advertisementsApiError = true;
              this.advertisementErrorMessage = 'Unable to load special offers at this time.';
            }
          } else {
            this.advertisements = [];
            this.advertisementsApiError = true;
            this.advertisementErrorMessage = 'Unable to load special offers at this time.';
          }
        }
      } catch (error) {
        console.error('Error in loadAdvertisementsFromApi:', error);
        this.advertisements = [];
        this.advertisementsApiError = true;
        this.advertisementErrorMessage = 'An unexpected error occurred while loading special offers.';
      }
    },
    
    /**
     * Refresh advertisement cache in the background
     */
    async refreshAdvertisementCache() {
      try {
        const advertisements = await apiManager.getAdvertisements();
        
        if (advertisements && advertisements.length > 0) {
          // Update UI with new data
          this.advertisements = advertisements;
          
          // Update cache
          localStorage.setItem('cached_advertisements', JSON.stringify({
            timestamp: Date.now(),
            data: advertisements
          }));
        }
      } catch (error) {
        console.error('Error refreshing advertisement cache:', error);
        // Don't update UI on background refresh failure
      }
    },
    
    /**
     * Load locations from API for the location dropdown
     */
    async loadLocationsFromApi(): Promise<void> {
      try {
        console.log('Loading locations from API...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const locationsResponse = await apiManager.getLocations();
        clearTimeout(timeoutId);
        
        if (Array.isArray(locationsResponse) && locationsResponse.length > 0) {
          console.log('Loaded locations from API:', locationsResponse.length, 'locations');
          this.locations = locationsResponse;
        } else {
          console.warn('API returned empty locations array');
          this.handleLocationApiFailure('No locations available');
        }
      } catch (error) {
        console.error('Error loading locations from API:', error);
        this.handleLocationApiFailure(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    
    /**
     * Handle location API failure
     */
    handleLocationApiFailure(errorMessage: string): void {
      console.warn('Location API failure:', errorMessage);
      
      // Show error message and empty locations
      this.locations = [];
      this.locationApiError = true;
    },
    
    /**
     * Load company profile data from API
     */
    async loadCompanyProfile(): Promise<void> {
      try {
        this.isLoadingCompanyProfile = true;
        this.companyProfileApiError = false;
        this.companyProfileErrorMessage = '';

        console.log('Loading company profile...');

        // Since the API doesn't exist, we set the default profile directly
        // When API is available, replace this with the actual API call
        // const profileData = await NetworkManager.getCompanyProfile();

        // Set default company profile
        const defaultProfile = {
          name: 'WorkSpace',
          email: 'info@squarehub.com',
          phone: '+94771 118 254 / +94772 673 533',
          address: 'NO 210, Havelock Road Colombo 05',
          image: ''
        };

        this.companyProfile = defaultProfile;

        // Indicate that this is using default information
        this.companyProfileApiError = true;
        this.companyProfileErrorMessage = 'Using default company information. API not available.';
      } catch (error) {
        console.error('Error loading company profile:', error);
        this.companyProfileApiError = true;
        this.companyProfileErrorMessage = error instanceof Error ?
          `Unable to load company information: ${error.message}` :
          'Unable to load company information. Please try again later.';

        // Use a default company name at minimum
        this.companyProfile = {
          name: 'WorkSpace',
          email: 'info@workspace.com',
          phone: '',
          address: '',
          image: ''
        };
      } finally {
        this.isLoadingCompanyProfile = false;
      }
    },
    
    /**
     * Load testimonials from API
     */
    async loadTestimonials(): Promise<void> {
      try {
        this.isLoadingTestimonials = true;
        this.testimonialsApiError = false;
        this.testimonialsErrorMessage = '';
        
        // Check for cached testimonials
        const cachedData = localStorage.getItem('cached_testimonials');
        
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            
            // Use cache if it's less than 1 hour old - reduced from 3 hours to ensure more up-to-date reviews
            if (cacheAge < 1 * 60 * 60 * 1000) {
              this.testimonials = parsed.data;
              console.log('Using cached testimonials data');
              return;
            }
          } catch (e) {
            console.error('Error parsing cached testimonials:', e);
            // Continue with API call if cache parsing fails
          }
        }
        
        console.log('Loading testimonials from API...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        // Get all ratings directly from the API
        const response = await apiManager.getAllRatings();
        clearTimeout(timeoutId);
        
        if (response.success && response.ratings && response.ratings.length > 0) {
          // Sort ratings by value (highest first)
          const sortedRatings = [...response.ratings].sort((a, b) => b.value - a.value);
          
          // Only show real testimonials if they have 4.5+ star ratings
          const highRatedReviews = sortedRatings.filter(rating => rating.value >= 4.5);
          
          if (highRatedReviews.length > 0) {
            // Convert high-rated reviews to testimonials (take up to 3)
            const testimonials = highRatedReviews.slice(0, 3).map((rating, index) => {
              return new TestimonialDto({
                id: rating.product_id || rating.user_id || index + 1,
                name: rating.first_name || 'Happy Customer',
                role: 'Customer',
                content: rating.review_description || 'Great space with amazing amenities.',
                avatar: rating.user_avatar || logoImage,
                rating: rating.value
              });
            });
            
            this.testimonials = testimonials;
            
            // Cache the testimonials
            localStorage.setItem('cached_testimonials', JSON.stringify({
              timestamp: Date.now(),
              data: testimonials
            }));
            
            console.log(`Loaded ${testimonials.length} high-rated testimonials from API with ratings: ${testimonials.map(t => t.rating).join(', ')}`);
          } else {
            // No high-rated reviews (4.5+ stars) found, will show fake reviews
            console.log('No high-rated reviews found, will display fake testimonials');
            this.testimonials = [];
          }
        } else {
          // No ratings found or API error - will show fake reviews
          this.testimonialsApiError = true;
          this.testimonialsErrorMessage = response.message || 'Unable to load testimonials. No ratings found.';
          this.testimonials = [];
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
        this.testimonialsApiError = true;
        this.testimonialsErrorMessage = error instanceof Error ? 
          `Unable to load testimonials: ${error.message}` : 
          'Unable to load testimonials. Please try again later.';
        
        // Set empty testimonials array
        this.testimonials = [];
      } finally {
        this.isLoadingTestimonials = false;
      }
    },

    searchSpaces(): void {
      this.isSearching = true;
      
      const query: Record<string, string> = {};
      if (this.searchForm.location) query.location = this.searchForm.location;
      if (this.searchForm.spaceType) query.spaceType = this.searchForm.spaceType;
      if (this.selectedLocationId) query.location_id = this.selectedLocationId.toString();

      this.$router.push({ name: 'SearchResults', query })
        .catch(error => console.error('Error during search:', error))
        .finally(() => this.isSearching = false);
    },

    viewSpace(id: number): void {
      this.$router.push({
        name: 'SpaceDetails',
        params: { id: id.toString() }
      })
      .catch(error => console.error('Error navigating to space details:', error));
    },

    async sendContactMessage(): Promise<void> {
      if (!this.newsletterEmail || !this.messageContent) return;

      this.isSubscribing = true;
      this.subscriptionMessage = '';

      try {
        const result = await apiManager.sendContactMessage({
          name: this.newsletterName,
          email: this.newsletterEmail,
          message: this.messageContent
        });

        if (result.success) {
          this.subscriptionMessage = result.message || 'Message sent successfully! We\'ll get back to you soon.';
          // Clear form
          this.newsletterEmail = '';
          this.newsletterName = '';
          this.messageContent = '';
        } else {
          this.subscriptionMessage = result.message || 'Failed to send message. Please try again.';
        }
      } catch (error) {
        console.error('Error sending contact message:', error);
        this.subscriptionMessage = 'Network error. Please check your connection and try again.';
      } finally {
        this.isSubscribing = false;

        // Clear message after delay
        setTimeout(() => {
          this.subscriptionMessage = '';
        }, 5000);
      }
    },

    // Footer newsletter subscription removed

    nextSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.advertisements.length;
      }
    },

    previousSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = (this.currentSlide - 1 + this.advertisements.length) % this.advertisements.length;
      }
    },

    startSlideshow(): void {
      if (this.advertisements.length > 1) {
        this.slideInterval = window.setInterval(this.nextSlide, 5000);
      }
    },

    stopSlideshow(): void {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
        this.slideInterval = null;
      }
    },

    // Advertisement modal methods
    openAdModal(ad: AdvertisementDto): void {
      this.selectedAd = ad;
      this.showAdModal = true;
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    },

    closeAdModal(): void {
      this.showAdModal = false;
      this.selectedAd = null;
      // Restore body scroll
      document.body.style.overflow = 'auto';
    },

    openAdUrl(url: string): void {
      if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      this.closeAdModal();
    },

    // Carousel animation control methods
    startCarouselAnimation(): void {
      if (this.carouselAnimationId) return; // Already running

      const animate = () => {
        this.carouselPosition -= 0.5; // Slow continuous movement

        // Reset position when we've moved through one set
        const totalWidth = this.advertisements.length * 336;
        if (this.carouselPosition < -totalWidth * 3) {
          this.carouselPosition = 0;
        }

        this.carouselAnimationId = requestAnimationFrame(animate);
      };

      this.carouselAnimationId = requestAnimationFrame(animate);
    },

    stopCarouselAnimation(): void {
      if (this.carouselAnimationId) {
        cancelAnimationFrame(this.carouselAnimationId);
        this.carouselAnimationId = null;
      }
    },

    // Carousel manual control methods
    moveCarousel(direction: 'left' | 'right'): void {
      const cardWidth = 336; // w-80 = 320px + mx-6 = 336px total
      const totalWidth = this.advertisements.length * cardWidth; // Width of one set of unique ads

      if (direction === 'left') {
        this.carouselPosition += cardWidth;
      } else {
        this.carouselPosition -= cardWidth;
      }

      // Handle infinite loop bounds
      if (this.carouselPosition > 0) {
        this.carouselPosition = -totalWidth * 3; // Jump to equivalent position in previous set
      } else if (this.carouselPosition < -totalWidth * 3) {
        this.carouselPosition = 0; // Jump back to start
      }

      // Pause auto-scroll temporarily
      this.stopCarouselAnimation();
      setTimeout(() => {
        this.startCarouselAnimation();
      }, 2000);
    },

    // Touch handling methods for carousel
    handleTouchStart(event: TouchEvent): void {
      this.touchStartX = event.touches[0].clientX;
    },

    handleTouchMove(event: TouchEvent): void {
      if (!this.touchStartX) return;
      this.touchEndX = event.touches[0].clientX;
    },

    handleTouchEnd(): void {
      if (!this.touchStartX || !this.touchEndX) return;

      const distance = this.touchStartX - this.touchEndX;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        this.moveCarousel('right');
      } else if (isRightSwipe) {
        this.moveCarousel('left');
      }

      this.touchStartX = 0;
      this.touchEndX = 0;
    },

    // Hero slideshow methods removed - using single static hero image

    getStartingPrice(space: SpaceDto): number {
      if (space.pricing) {
        return space.pricing.daily || space.pricing.hourly || space.pricing.monthly || 0;
      }
      return 0;
    },
    
    formatPrice(price: any): string {
      return formatPrice(price);
    },
    
    formatCurrency(price: any): string {
      return formatCurrency(price);
    },

    onLocationChange(location: { id: number; name: string; address: string; url: string } | null): void {
      if (location) {
        console.log('Selected location:', location);
        
        // Store the location name as a string for v-model compatibility
        this.searchForm.location = location.name;
        
        // Store the full location object for future use if needed
        this.selectedLocationObject = location;
        
        // Store the location ID for API calls
        this.selectedLocationId = location.id;
        
        // We could filter spaces by location here if needed in the future:
        // this.filterSpacesByLocation(location.id);
        
        // Or load spaces specific to this location from the API:
        // this.loadSpacesForLocation(location.id);
      } else {
        // Location was cleared
        this.searchForm.location = '';
        this.selectedLocationObject = null;
        this.selectedLocationId = null;
      }
    },
    
    /**
     * Loads the top 3 highest-rated spaces from the API for the featured spaces section
     */
    async loadFeaturedSpaces(): Promise<void> {
      try {
        this.isLoadingSpaces = true;
        this.spacesApiError = false;
        this.spacesErrorMessage = '';
        
        // Call the API to get all spaces
        const response = await apiManager.getSpaces({});
        
        if (response.success && response.spaces && response.spaces.length > 0) {
          // Filter spaces by rating > 4.5 and sort by rating (highest first)
          const filteredSpaces = response.spaces.filter(space => space.rating > 4.5);
          const sortedSpaces = [...filteredSpaces].sort((a, b) => b.rating - a.rating);
          
          // Take only the top 3 spaces
          this.featuredSpaces = sortedSpaces.slice(0, 3);
          
          console.log('Loaded top-rated featured spaces (rating > 4.5):', this.featuredSpaces);
        } else {
          // Handle empty response
          console.warn('No spaces returned from API');
          this.featuredSpaces = [];
          this.spacesApiError = true;
          this.spacesErrorMessage = 'No featured spaces available at the moment.';
        }
      } catch (error) {
        console.error('Error loading featured spaces:', error);
        
        this.featuredSpaces = [];
        this.spacesApiError = true;
        this.spacesErrorMessage = 'Unable to load featured spaces at this time.';
      } finally {
        this.isLoadingSpaces = false;
      }
    },    
   
  }
});
</script>

<style scoped>
.container-padding {
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 640px) {
  .container-padding {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .container-padding {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.section-padding {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
@media (min-width: 1024px) {
  .section-padding {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition-property: all;
  transition-duration: 200ms;
}

.dark .card {
  background-color: rgb(31 41 55);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background-color: var(--color-primary, #00FE01);
  color: black;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition-property: background-color;
  transition-duration: 200ms;
}
.btn-primary:hover {
  background-color: rgba(var(--color-primary-rgb), 0.9);
}
.btn-primary:focus {
  outline: none;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--color-primary);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Carousel container styles */
.carousel-container {
  transition: transform 0.3s ease-out;
}

/* Modal entrance animation */
@keyframes modal-enter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-enter {
  animation: modal-enter 0.3s ease-out;
}
</style>