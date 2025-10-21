<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20 lg:pb-0">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 md:container-padding py-6 md:py-8">
      <!-- Progress indicator -->
      <div class="flex items-center justify-between mb-6 md:mb-8">
        <!-- Back Arrow -->
        <button @click="$router.go(-1)"
          class="flex items-center justify-center w-12 h-12 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>

        </button>

        <!-- Progress Bar Container -->
        <div class="flex flex-col items-center justify-center flex-1">
          <!-- Mobile progress indicator (visible only on small screens) -->
          <div class="flex items-center justify-center md:hidden w-full max-w-xs mb-2">
            <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full w-full relative">
              <div class="absolute top-0 left-0 h-full bg-primary rounded-full" style="width: 33.3%;"></div>
            </div>
          </div>
          <div class="text-xs font-medium text-primary md:hidden mb-3">Step 1 of 3: Summary</div>

          <!-- Desktop progress indicator (hidden on mobile) -->
          <div class="hidden md:flex items-center">
            <div class="flex flex-col items-center">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-transform hover:scale-105">
                1
              </div>
              <span class="text-xs font-medium text-primary mt-1">Summary</span>
            </div>
            <div class="w-10 sm:w-16 h-1 bg-primary mx-1 sm:mx-2 transition-all duration-500"></div>
            <div class="flex flex-col items-center">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 text-gray-600 rounded-full text-xs sm:text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-all">
                2
              </div>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Payment</span>
            </div>
            <div class="w-10 sm:w-16 h-1 bg-gray-300 dark:bg-gray-600 mx-1 sm:mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 text-gray-600 rounded-full text-xs sm:text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-all">
                3
              </div>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Confirmation</span>
            </div>
          </div>
        </div>

        <!-- Spacer for balance -->
        <div class="w-10"></div>
      </div>

      <div class="text-center mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Booking
          Summary</h1>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">Review your booking details
          before proceeding to payment</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <!-- Booking Details -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          <!-- Guest Information -->
          <div
            class="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-card border border-gray-50 dark:border-gray-800 transition-shadow hover:shadow-lg">
            <div v-if="!isAuthenticated">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your Information</h2>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 border-l-4 border-primary">
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Log in or register to track bookings. Guest bookings cannot be tracked.
                </p>
                <button @click="goToLogin"
                  class="btn-secondary text-xs py-2 px-4 mt-2 rounded-full transition-all hover:shadow-md">
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login or Register
                  </span>
                </button>
              </div>

              <div v-if="allowGuestCheckout">
                <h3 class="text-base font-semibold dark:text-white text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-1.5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Guest Details
                </h3>
                <form @submit.prevent="proceedToPayment" class="space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name
                        *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input v-model="guestInfo.firstName" type="text" required
                          class="input-field text-xs sm:text-sm py-2 sm:py-2.5 pl-8 sm:pl-10 w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter your first name">
                      </div>
                    </div>
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input v-model="guestInfo.lastName" type="text" required
                          class="input-field text-xs sm:text-sm py-2 sm:py-2.5 pl-8 sm:pl-10 w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter your last name">
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address
                        *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input v-model="guestInfo.email" type="email" required
                          class="input-field text-xs sm:text-sm py-2 sm:py-2.5 pl-8 sm:pl-10 w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter your email address">
                      </div>
                    </div>
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number
                        *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input v-model="guestInfo.phone" type="tel" required
                          class="input-field text-xs sm:text-sm py-2 sm:py-2.5 pl-8 sm:pl-10 w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter your phone number">
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div v-else>
                <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 mt-3">
                  <p class="text-red-600 dark:text-red-400 text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Guest checkout is only available for meeting room bookings. Please log in or register to proceed.
                  </p>
                </div>
              </div>
            </div>
            <div v-if="isAuthenticated">
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your Information</h2>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-green-500 flex items-center"
                v-if="currentUser">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Logged in as <span
                      class="text-primary">{{ currentUser.email }}</span></p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">We will use the information from your
                    profile for this booking</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add another service -->
          <div class="text-center mt-4 sm:mt-6">
            <button @click="addAnotherService"
              class="btn-secondary text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 rounded-full hover:shadow-md transition-all flex items-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-1.5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Service
            </button>
          </div>

          <!-- Loop through each booking -->
          <div v-for="(booking, index) in bookingData" :key="index" :class="[
            'bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 mb-3 sm:mb-4 overflow-hidden hover:shadow-lg group',
            deleteAnimationKey === booking.uniqueKey ? 'border-red-300 dark:border-red-700 shake-animation bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-800'
          ]">

            <!-- Top Section with Image and Main Info -->
            <div class="flex flex-col sm:flex-row">
              <!-- Image with overlay effect -->
              <div class="relative cursor-pointer overflow-hidden w-full sm:w-36"
                @click="goToSpaceDetails(booking.space?.id)">
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                <img v-if="booking.space && booking.space.images && booking.space.images.length > 0"
                  :src="booking.space.images[0]" :alt="booking.space.name || 'Space Image'"
                  class="w-full h-28 xs:h-32 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <img v-else
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Default Space Image"
                  class="w-full h-28 xs:h-32 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105">

                <!-- Type Badge -->
                <div
                  class="absolute top-2 left-2 bg-primary/90 text-white text-xxs xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full font-medium">
                  {{ formatProductType(booking.productType) }}
                </div>
              </div>

              <!-- Main Content -->
              <div class="flex-1 p-3 sm:p-4">
                <!-- Header Row -->
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="flex-1">
                    <h3
                      class="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      @click="goToSpaceDetails(booking.space?.id)">
                      {{ booking.space?.name || 'Unknown Space' }}
                    </h3>
                    <p class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 xs:h-3.5 xs:w-3.5 mr-1" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="line-clamp-1">{{ booking.space?.location || 'Unknown Location' }}</span>
                    </p>
                  </div>

                  <!-- Delete button -->
                  <button @click.stop="booking.uniqueKey && confirmDelete(booking.uniqueKey)"
                    class="ml-2 sm:ml-3 text-gray-400 hover:text-red-500 transition-colors p-0.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    :class="{ 'animate-pulse text-red-500': deleteAnimationKey === booking.uniqueKey }">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                      </path>
                    </svg>
                  </button>
                </div>

                <!-- Info Cards -->
                <div :class="[
                  'grid gap-2 sm:gap-3 mt-2',
                  booking.productType === 'dedicated-desk' ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'
                ]">
                  <!-- Type -->
                  <div class="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 block">Type</span>
                    <div
                      class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm flex items-center mt-0.5 sm:mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-primary"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <div class="line-clamp-1">{{ formatProductType(booking.productType) }}</div>
                        <div v-if="booking.productType === 'meeting-room'" class="text-xxs xs:text-xs text-gray-500">{{
                          booking.space?.capacity || 'N/A' }} people</div>
                        <div v-else-if="booking.productType === 'coworking-space'"
                          class="text-xxs xs:text-xs text-gray-500">Team: {{ booking.subscription?.teamSize || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Date -->
                  <div class="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 block">
                      {{ booking.productType === 'dedicated-desk' ? 'Subscription Start Date' : 'Date' }}
                    </span>
                    <div
                      class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm flex items-center mt-0.5 sm:mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-primary"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="line-clamp-1">
                        {{ booking.productType === 'dedicated-desk'
                          ? formatDate(booking.subscription?.startDate || booking.booking?.startDate || '')
                          : booking.productType === 'hot-desk' || booking.productType === 'meeting-room'
                            ? formatDate(booking.booking?.startDate || '')
                            : formatDateRange(booking) }}
                      </span>
                    </div>
                  </div>

                  <!-- Subscription End Date (only for dedicated desk) -->
                  <div v-if="booking.productType === 'dedicated-desk'"
                    class="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 block">Subscription End
                      Date</span>
                    <div
                      class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm flex items-center mt-0.5 sm:mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-red-600"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="line-clamp-1">
                        {{ formatDate(booking.subscription?.endDate || '') }}
                      </span>
                    </div>
                  </div>

                  <!-- Time/Package -->
                  <div class="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 block">
                      {{ booking.productType === 'meeting-room' ? 'Time' : booking.productType === 'hot-desk' ?
                        'Duration' : booking.productType === 'dedicated-desk' ? 'Subscription Duration' : 'Package' }}
                    </span>
                    <div
                      class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm flex items-center mt-0.5 sm:mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-primary"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="booking.productType === 'meeting-room'" stroke-linecap="round"
                          stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span v-if="booking.productType === 'meeting-room'" class="line-clamp-1">{{
                        booking.booking?.startTime }} - {{ getEndTime(booking) }}</span>
                      <span v-else-if="booking.productType === 'hot-desk'" class="line-clamp-1">Full Day</span>
                      <span v-else-if="booking.productType === 'dedicated-desk'" class="line-clamp-1">
                        {{ getDedicatedDeskDuration(booking) }}
                      </span>
                      <span v-else class="line-clamp-1">{{ getPackageDisplayName(booking) }}</span>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-xxs xs:text-xs text-gray-500 dark:text-gray-400 block">Total Price</span>
                    <div
                      class="font-bold text-gray-900 dark:text-white text-sm sm:text-base flex items-center mt-0.5 sm:mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-primary"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatCurrency(booking.totalPrice || 0) }}
                    </div>
                  </div>
                </div>

                <!-- Features (if any) -->
                <div v-if="booking.facilities && booking.facilities.length > 0"
                  class="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-3 sm:h-4 w-3 sm:w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span
                        class="text-xxs xs:text-xs font-medium text-gray-600 dark:text-gray-300 ml-1">Amenities:</span>
                    </div>
                    <div class="flex flex-wrap gap-1 sm:gap-1.5 ml-1">
                      <span v-for="feature in booking.facilities" :key="feature"
                        class="text-xxs xs:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {{ feature.toUpperCase() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>




        </div>

        <!-- Price Summary Sidebar -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-card sticky top-20 sm:top-24 border border-gray-50 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-primary"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Price Summary
            </h2>

            <!-- Price breakdown -->
            <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div v-for="(booking, index) in bookingData" :key="index"
                class="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:mb-0 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 sm:p-2 rounded-lg transition-colors">
                <div class="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span class="text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm line-clamp-1"
                    :title="booking.space?.name || 'Unknown Product'">
                    {{ booking.space?.name || 'Unknown Product' }}
                  </span>
                  <span class="font-semibold text-xs sm:text-sm">{{ formatCurrency(booking.pricing?.total || booking.totalPrice || 0) }}</span>
                </div>

                <div v-if="booking.pricing"
                  class="text-xxs xs:text-xs text-gray-600 dark:text-gray-400 space-y-0.5 sm:space-y-1 pl-1.5 sm:pl-2 bg-white dark:bg-gray-800 rounded-md p-1.5 sm:p-2 border border-gray-100 dark:border-gray-700">
                  <div class="flex justify-between items-center">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      {{ getBasePriceLabel(booking) }}:
                    </span>
                    <span class="text-xs font-medium">{{ formatCurrency(getBasePricePerUnit(booking)) }} × {{
                      getMultiplierLabel(booking) }} = {{ formatCurrency(booking.pricing.basePrice || 0) }}</span>
                  </div>
                  <div v-if="booking.pricing.facilitiesPrice > 0 && booking.facilities && booking.facilities.length > 0"
                    class="space-y-0.5">
                    <div v-for="(facility, index) in booking.facilities" :key="facility"
                      class="flex justify-between items-center">
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1 text-gray-400"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ facility }}:
                      </span>
                      <span class="text-xs font-medium">{{ formatCurrency(getFacilityPricePerUnit(booking, index)) }} × 
                        {{ getMultiplierLabel(booking) }} = {{ formatCurrency(Math.round(booking.pricing.facilitiesPrice / booking.facilities.length)) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
                </div>
                <div class="relative flex justify-center">
                  <span
                    class="bg-white dark:bg-gray-900 px-2 text-xxs xs:text-xs text-gray-500 dark:text-gray-400">SUMMARY</span>
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2 sm:mt-3">
                <span class="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-1.5 text-primary"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Total
                </span>
                <span class="text-lg sm:text-xl font-bold text-primary">{{ formatCurrency(totalAmount) }}</span>
              </div>
            </div>

            <!-- Promo code (uncommented and enhanced) -->
            <!-- <div class="mb-4 sm:mb-6 mt-3 sm:mt-4">
              <label class="text-xxs xs:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Have a promo code?</label>
              <div class="flex gap-1.5 sm:gap-2">
                <div class="relative flex-1">
                  <div class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input v-model="promoCode" type="text" placeholder="Enter code" 
                    class="input-field text-xs sm:text-sm py-1.5 sm:py-2 pl-7 sm:pl-10 w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary">
                </div>
                <button @click="applyPromoCode" class="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap hover:shadow-md transition-all">
                  Apply
                </button>
              </div>
              <div v-if="promoCodeMessage"
                :class="['mt-1.5 sm:mt-2 text-xs sm:text-sm flex items-center', promoCodeApplied ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
                <svg v-if="promoCodeApplied" xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ promoCodeMessage }}
              </div>
            </div> -->

            <!-- Promo code -->
            <!-- <div class="mb-6">
              <div class="flex gap-2">
                <input v-model="promoCode" type="text" placeholder="Promo code" class="input-field text-sm">
                <button @click="applyPromoCode" class="btn-primary text-sm px-4 py-2">
                  Apply
                </button>
              </div>
              <div v-if="promoCodeMessage"
                :class="['mt-2 text-sm', promoCodeApplied ? 'text-green-600' : 'text-red-600']">
                {{ promoCodeMessage }}
              </div>
            </div> -->

            <!-- Payment methods preview -->
            <!-- <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Payment Methods</h3>
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-6 bg-gradient-to-r from-primary to-primary/80 rounded text-white flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div
                  class="w-8 h-6 bg-gradient-to-r from-red-600 to-red-700 rounded text-white flex items-center justify-center text-xs font-bold">
                  MC
                </div>
                <div
                  class="w-8 h-6 bg-gradient-to-r from-primary/90 to-primary/70 rounded text-white flex items-center justify-center text-xs font-bold">
                  AX
                </div>
                <svg class="w-8 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z"
                    fill="#253B80" />
                  <path
                    d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z"
                    fill="#179BD7" />
                  <path
                    d="M9.928 16.762h-2.15a1.321 1.321 0 0 0-1.321 1.132l-1.207 7.007c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637l2.725-19.785c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637.374.177.708.384 1.011.622.26.204.492.43.698.677.513.617.848 1.334.952 2.08a3.579 3.579 0 0 1-.288 2.019c-.742 1.92-2.104 3.145-4.113 3.729a8.875 8.875 0 0 1-2.659.408z"
                    fill="#222D65" />
                </svg>
              </div>
            </div> -->

            <!-- Payment method preview (uncommented and enhanced) -->
            <!-- <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Methods
              </h3>
              <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <div
                  class="w-12 h-8 bg-gradient-to-r from-primary to-primary/80 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  VISA
                </div>
                <div
                  class="w-12 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  MC
                </div>
                <div
                  class="w-12 h-8 bg-gradient-to-r from-primary/90 to-primary/70 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  AMEX
                </div>
                <div class="w-12 h-8 bg-gradient-to-r from-primary/90 to-gray-700 rounded flex items-center justify-center text-xs font-bold shadow-sm">
                  <svg class="w-8 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z"
                      fill="#253B80" />
                    <path
                      d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z"
                      fill="#179BD7" />
                    <path
                      d="M9.928 16.762h-2.15a1.321 1.321 0 0 0-1.321 1.132l-1.207 7.007c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637l2.725-19.785c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637.374.177.708.384 1.011.622.26.204.492.43.698.677.513.617.848 1.334.952 2.08a3.579 3.579 0 0 1-.288 2.019c-.742 1.92-2.104 3.145-4.113 3.729a8.875 8.875 0 0 1-2.659.408z"
                      fill="#222D65" />
                  </svg>
                </div>
              </div>
            </div> -->

            <!-- Proceed to Payment Button -->
            <button @click="proceedToPayment" :disabled="!isFormValid || bookingData.length === 0 || totalAmount === 0"
              class="w-full btn-primary text-sm sm:text-base py-3 sm:py-3.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center">
              <span>Proceed to Payment</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 sm:h-5 w-4 sm:w-5 ml-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Cancellation policy -->
            <div
              class="mt-4 sm:mt-5 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400 dark:border-red-700">
              <h4
                class="font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 text-xs sm:text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1 sm:mr-1.5 text-red-500 dark:text-red-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cancellation Policy
              </h4>
              <ul class="text-xxs xs:text-xs text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mt-1">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1.5 text-red-500 mt-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  All bookings are non-refundable
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1.5 text-blue-500 mt-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Rescheduling may be available if requested at least 24 hours before booking time
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1.5 text-red-500 mt-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No-shows will be charged the full amount
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      @click.self="cancelDelete">
      <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity"></div>
      <div
        class="relative bg-white dark:bg-gray-900 rounded-lg max-w-md w-11/12 mx-auto shadow-xl border border-gray-200 dark:border-gray-700 transform transition-all overflow-hidden">
        <div class="px-4 pt-5 pb-4 sm:p-6 text-center sm:mt-0">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Remove Booking Item?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Are you sure you want to remove this item from your booking? This action cannot be undone.
          </p>
          <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button type="button" @click="cancelDelete"
              class="btn-secondary text-xs sm:text-sm py-2.5 px-4 rounded-md transition-all hover:bg-gray-100">
              Cancel
            </button>
            <button type="button" @click="itemToDelete && removeBookingItem(itemToDelete)"
              class="btn-danger text-xs sm:text-sm py-2.5 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center">
              <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Item
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Floating Action Button (visible on small screens) -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40">
    <div class="bg-gradient-to-t from-gray-900/80 to-transparent h-16 absolute inset-x-0 bottom-0 pointer-events-none">
    </div>
    <div
      class="bg-white dark:bg-gray-900 rounded-t-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
      <div class="flex justify-between items-center">
        <div class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
          Total: <span class="text-base sm:text-lg text-primary font-bold">{{ formatCurrency(totalAmount) }}</span>
        </div>
        <button @click="proceedToPayment" :disabled="!isFormValid"
          class="btn-primary text-xs py-2 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
          <span class="hidden xs:inline">Proceed to Payment</span>
          <span class="xs:hidden">Payment</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Add custom responsive text sizes */
.text-xxs {
  font-size: 0.65rem;
  line-height: 1rem;
}

/* Delete animation styles */
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-5px);
  }

  40% {
    transform: translateX(5px);
  }

  60% {
    transform: translateX(-3px);
  }

  80% {
    transform: translateX(3px);
  }

  100% {
    transform: translateX(0);
  }
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

/* Button styles */
.btn-danger {
  background-color: #ef4444;
  color: white;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06);
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

// Add responsive styles
import '../assets/base.css'
import { formatPrice, formatCurrency } from '../utils/formatUtils'

interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
  emergencyContactName: string
  emergencyContactPhone: string
}

interface BookingItem {
  productType: string
  startDate?: string
  endDate?: string
  date?: string
  booking?: {
    startDate?: string | null
    endDate?: string | null
    startTime?: string
    duration?: string
    date?: string
  }
  subscription?: {
    startDate?: string | null
    endDate?: string | null
    packageType?: string
  }
}

export default defineComponent({
  name: 'BookingSummary',

  components: {
  },

  data() {
    return {
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      } as GuestInfo,
      promoCode: '',
      promoCodeApplied: false,
      promoCodeMessage: '',
      guestCheckout: true,
      showDeleteConfirmation: false,
      itemToDelete: null as string | null,
      deleteAnimationKey: null as string | null,
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
    bookingStore() {
      return useBookingStore()
    },
    bookingData() {
      return this.bookingStore.currentBooking
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    currentUser() {
      return this.authStore.currentUser
    },
    allowGuestCheckout() {
      return this.bookingData.every(item => item.productType === 'meeting-room' || item.productType === 'hot-desk')
    },
    totalAmount() {
      return this.bookingData.reduce((total, booking) => total + (booking.totalPrice || 0), 0)
    },
    isFormValid() {
      if (this.isAuthenticated) {
        return true
      }
      if (this.guestCheckout) {
        return this.guestInfo.firstName &&
          this.guestInfo.lastName &&
          this.guestInfo.email &&
          this.guestInfo.phone
      }
      return false
    }
  },

  watch: {
    isAuthenticated(isAuth) {
      if (isAuth && this.currentUser) {
        this.guestInfo.firstName = this.currentUser.firstName || ''
        this.guestInfo.lastName = this.currentUser.lastName || ''
        this.guestInfo.email = this.currentUser.email || ''
        this.guestInfo.phone = this.currentUser.phone || ''
      }
    }
  },

  mounted() {
    this.bookingStore.initializeBooking()
    this.authStore.initializeAuth()

    // If no booking data, redirect to home
    if (this.bookingData.length === 0) {
      this.$router.replace({ name: 'Home' });
      return;
    }

    if (this.isAuthenticated && this.currentUser) {
      this.guestInfo.firstName = this.currentUser.firstName || ''
      this.guestInfo.lastName = this.currentUser.lastName || ''
      this.guestInfo.email = this.currentUser.email || ''
      this.guestInfo.phone = this.currentUser.phone || ''
    }
  },

  methods: {
    formatDate(dateString: string): string {
      if (!dateString) return 'Not specified'
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    
    formatCurrency(price: any): string {
      return formatCurrency(price)
    },
    
    formatPrice(price: any): string {
      return formatPrice(price)
    },

    formatDateRange(booking: BookingItem): string {
      const startDate = booking.booking?.startDate || booking.subscription?.startDate || booking.startDate
      const endDate = booking.booking?.endDate || booking.subscription?.endDate || booking.endDate

      if (!startDate || !endDate) {
        const legacyDate = booking.booking?.date || booking.date
        return legacyDate ? this.formatDate(legacyDate) : 'Date not specified'
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric'
      }

      if (start.getFullYear() !== end.getFullYear()) {
        formatOptions.year = 'numeric'
      }

      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
    },

    formatProductType(type: string): string {
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room',
        'hot-desk': 'Hot Desk',
        'dedicated-desk': 'Dedicated Desk',
        'coworking-space': 'Co-working Space'
      }
      return types[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')
    },

    getServiceDisplayName(booking: BookingItem) {
      if (booking.productType === 'meeting-room') {
        const duration = booking.booking?.duration || '2'
        return `Meeting Room (${duration}h)`
      } else if (booking.productType === 'hot-desk') {
        return this.getPackageDisplayName(booking)
      } else {
        return this.getPackageDisplayName(booking)
      }
    },

    getPackageDisplayName(booking: BookingItem): string {
      const packageType = booking.subscription?.packageType || 'monthly'
      const names: Record<string, string> = {
        daily: 'Daily Pass',
        monthly: 'Monthly Subscription',
        annual: 'Annual Subscription'
      }
      return names[packageType] || 'Subscription'
    },

    getEndTime(booking: BookingItem) {
      if (booking.productType !== 'meeting-room') return ''
      const startTime = booking.booking?.startTime || '09:00'
      const duration = parseFloat(booking.booking?.duration || '2')
      const [hours, minutes] = startTime.split(':').map(Number)

      // Convert everything to minutes for accurate calculation
      const totalStartMinutes = hours * 60 + minutes
      const durationMinutes = duration * 60
      const totalEndMinutes = totalStartMinutes + durationMinutes

      const endHours = Math.floor(totalEndMinutes / 60)
      const endMinutes = totalEndMinutes % 60

      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
    },

    getDedicatedDeskDuration(booking: BookingItem): string {
      if (booking.productType !== 'dedicated-desk') return ''

      const packageType = booking.subscription?.packageType || 'monthly'

      // Try to get duration from various possible sources
      let duration = 1

      // Check if duration is stored in subscription
      if ((booking.subscription as any)?.duration) {
        duration = (booking.subscription as any).duration
      }
      // Check if duration is stored in booking
      else if ((booking.booking as any)?.duration) {
        duration = (booking.booking as any).duration
      }
      // Check if selectedDuration is stored anywhere
      else if ((booking as any).selectedDuration) {
        duration = (booking as any).selectedDuration
      }
      // Check if duration is stored in the booking data
      else if ((booking as any).duration) {
        duration = (booking as any).duration
      }

      // If duration is still 0 or invalid, try to calculate from dates
      if (!duration || duration <= 0) {
        if (booking.subscription?.startDate && booking.subscription?.endDate) {
          const start = new Date(booking.subscription.startDate)
          const end = new Date(booking.subscription.endDate)

          if (packageType === 'monthly') {
            duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
          } else {
            duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365))
          }
        }
      }

      // Ensure we have a valid duration
      if (!duration || duration <= 0) {
        duration = 1
      }

      const unit = packageType === 'monthly' ? 'month' : 'year'
      const plural = duration > 1 ? 's' : ''

      return `${duration} ${unit}${plural}`
    },

    addAnotherService() {
      // Set localStorage flag to show the floating booking summary
      localStorage.setItem('addAnotherServiceClicked', 'true');
      this.$router.push({ name: 'SearchResults' });
      this.bookingStore.setAddingMoreServices(true);
    },

    confirmDelete(uniqueKey: string) {
      this.itemToDelete = uniqueKey;
      this.deleteAnimationKey = uniqueKey;
      this.showDeleteConfirmation = true;
    },

    removeBookingItem(uniqueKey: string) {
      // First animate the item
      setTimeout(() => {
        // Then actually remove it from store
        this.bookingStore.removeBookingItem(uniqueKey);
        this.showDeleteConfirmation = false;
        this.itemToDelete = null;
      }, 300);
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.itemToDelete = null;
      this.deleteAnimationKey = null;
    },

    openAuthModal(type: 'login' | 'register') {
      if (type === 'login') {
        this.$router.push('/login');
      } else {
        this.$router.push('/register');
      }
    },

    goToLogin() {
      // Store current path for redirect after login
      const authStore = useAuthStore();
      authStore.setRedirectPath(this.$route.fullPath);
      this.$router.push('/login');
    },

    applyPromoCode() {
      if (this.promoCode.toLowerCase() === 'welcome10') {
        this.promoCodeApplied = true
        this.promoCodeMessage = 'Promo code applied! 10% discount'
      } else {
        this.promoCodeApplied = false
        this.promoCodeMessage = 'Invalid promo code'
      }
    },

    proceedToPayment(): void {
      if (!this.isFormValid) {
        return;
      }

      const finalGuestInfo = this.isAuthenticated && this.currentUser ? {
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || ''
      } : this.guestInfo;

      const updatedBookings = this.bookingData.map(booking => ({
        ...booking,
        guestInfo: finalGuestInfo,
        promoCode: this.promoCodeApplied ? this.promoCode : null
      }));

      this.bookingStore.updateBookingDetails(updatedBookings);
      this.bookingStore.setAddingMoreServices(false);

      // Clear the localStorage flag when proceeding to payment
      localStorage.removeItem('addAnotherServiceClicked');

      this.$router.push({ name: 'Payment' });
    },

    goToSpaceDetails(spaceId: number) {
      if (spaceId) {
        this.$router.push({ name: 'SpaceDetails', params: { id: spaceId.toString() } });
      }
    },

    getBasePriceLabel(booking: any): string {
      const productType = booking.productType;

      if (productType === 'dedicated-desk' || productType === 'coworking-space') {
        // For subscriptions, show the package type
        const packageType = booking.subscription?.packageType || 'monthly';
        const capitalizedPackage = packageType.charAt(0).toUpperCase() + packageType.slice(1);
        return `${capitalizedPackage} Rate`;
      }

      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room only price',
        'hot-desk': 'Hot Desk only price'
      };
      return types[productType] || 'Base Price';
    },

    getBasePricePerUnit(booking: any): number {
      if (!booking.pricing?.basePrice) return 0;

      if (booking.productType === 'dedicated-desk') {
        // For dedicated desk, base price is the package rate (monthly/annual)
        // We need to get the per-unit rate by dividing by the package duration
        const packageType = booking.subscription?.packageType || 'monthly';
        const packageMultiplier = packageType === 'annual' ? 12 : 1; // Annual = 12 months, Monthly = 1 month
        return Math.round(booking.pricing.basePrice / packageMultiplier);
      }

      const multiplier = this.getMultiplier(booking);
      return multiplier > 0 ? Math.round(booking.pricing.basePrice / multiplier) : booking.pricing.basePrice;
    },

    getMultiplier(booking: any): number {
      if (booking.productType === 'meeting-room' || booking.productType === 'hot-desk') {
        // For meeting rooms and hot desks, multiplier is duration in hours
        return parseFloat(booking.booking?.duration || '1');
      } else if (booking.productType === 'dedicated-desk' || booking.productType === 'coworking-space') {
        // For dedicated desk subscriptions, multiplier is the selected duration
        const duration = booking.subscription?.duration || 1;
        return duration;
      }
      return 1; // Default fallback
    },

    getMultiplierLabel(booking: any): string {
      if (booking.productType === 'meeting-room') {
        const duration = parseFloat(booking.booking?.duration || '1');
        return `${duration} hour${duration > 1 ? 's' : ''}`;
      } else if (booking.productType === 'hot-desk') {
        return '1 day';
      } else if (booking.productType === 'dedicated-desk' || booking.productType === 'coworking-space') {
        const packageType = booking.subscription?.packageType || 'monthly';
        const duration = booking.subscription?.duration || 1;

        if (packageType === 'monthly') {
          return `${duration} month${duration > 1 ? 's' : ''}`;
        } else if (packageType === 'annual') {
          return `${duration} year${duration > 1 ? 's' : ''}`;
        }
        return `${duration} unit${duration > 1 ? 's' : ''}`;
      }
      return '1 unit';
    },

    getFacilityPricePerUnit(booking: any, facilityIndex: number): number {
      if (!booking.pricing?.facilitiesPrice || !booking.facilities || booking.facilities.length === 0) return 0;

      const totalFacilityPrice = Math.round(booking.pricing.facilitiesPrice / booking.facilities.length);
      const multiplier = this.getMultiplier(booking);
      return multiplier > 0 ? Math.round(totalFacilityPrice / multiplier) : totalFacilityPrice;
    }
  }
})
</script>