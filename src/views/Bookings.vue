<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
    <div class="max-w-7xl mx-auto container-padding py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your workspace reservations and booking history</p>
        </div>
        <router-link to="/search" class="btn-primary mt-4 sm:mt-0">
          Book New Space
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalBookings }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.upcomingBookings }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            </div>
          </div>
        </div>
        
        <!-- Subscription Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeSubscriptions || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
            </div>
          </div>
        </div>
        
        <!-- Commented out Favorite Spaces card
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.favoriteSpaces }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Favorite Spaces</p>
            </div>
          </div>
        </div>
        -->
        
        <!-- Commented out Total Spent card
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">LKR {{ stats.totalSpent }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
            </div>
          </div>
        </div>
        -->

      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Tabs -->
          <div class="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors', activeTab === tab.id ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white']"
            >
              {{ tab.name }}
              <span v-if="tab.count" :class="['ml-2 px-2 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-500 text-gray-600 dark:text-gray-300']">
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Controls -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search bookings..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              >
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Refresh Button -->
            <button 
              @click="fetchUpcomingBookings"
              :disabled="loading"
              :class="['p-2 rounded-lg transition-colors', loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600']"
              title="Refresh bookings"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <!-- View Toggle -->
            <div class="flex items-center space-x-2">
              <button 
                @click="viewMode = 'list'" 
                :class="['p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600']"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'calendar'" 
                :class="['p-2 rounded-lg transition-colors', viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600']"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <!-- Export
            <button @click="exportBookings" class="btn-primary mr-2">
              Export
            </button> -->

          </div>
        </div>
      </div>

      <!-- Upcoming Booking Reminder -->
      <div v-if="upcomingBooking && activeTab === 'upcoming'" class="bg-gradient-to-r from-primary to-primary rounded-xl p-6 text-white mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-1">Next Booking Tomorrow</h3>
            <p class="opacity-90">{{ upcomingBooking.space.name }} • {{ formatTime(upcomingBooking.date) }}</p>
          </div>
          <div class="flex space-x-3">
            <button @click="getDirections(upcomingBooking)" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Directions
            </button>
            <button @click="viewBookingDetails(upcomingBooking)" class="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="viewMode === 'list'">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700 animate-pulse">
            <div class="flex space-x-4">
              <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-red-200 dark:border-red-700 mb-6">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Error Loading Bookings</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
            </div>
          </div>
          <button @click="fetchUpcomingBookings" class="mt-4 btn-primary text-sm px-4 py-2">
            Try Again
          </button>
        </div>
        
        <!-- Bookings List -->
        <div v-else-if="filteredBookings.length > 0" class="space-y-6">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <!-- Space Image and Info -->
              <div class="flex space-x-4 flex-1">
                <!-- Product Images -->
                <div class="flex-shrink-0">
                  <div v-if="booking.productImages && booking.productImages.length > 1" 
                       class="grid grid-cols-2 gap-1 w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                       @click="viewSpaceDetails(booking.space.id)">
                    <img 
                      v-for="(image, index) in booking.productImages.slice(0, 4)" 
                      :key="index"
                      :src="image" 
                      :alt="`${booking.space.name} - Product ${index + 1}`"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <img 
                    v-else-if="booking.productImages && booking.productImages.length === 1"
                    :src="booking.productImages[0]" 
                    :alt="booking.space.name"
                    class="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    @click="viewSpaceDetails(booking.space.id)"
                  >
                  <img 
                    v-else
                    :src="booking.space.image" 
                    :alt="booking.space.name"
                    class="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    @click="viewSpaceDetails(booking.space.id)"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ booking.space.name }}</h3>
                    <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusClass(booking.status)]">
                      {{ booking.status }}
                    </span>
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ booking.space.location }}
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(booking.date) }} 
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ formatSpaceType(booking.spaceType) }}
                  </div>
                  <div class="mt-2 flex flex-col gap-1">
                    <!-- <span class="text-sm text-gray-500 dark:text-gray-400">Booking #{{ booking.id }}</span> -->
                    <span v-if="booking.dateChanged" class="inline-block text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded px-2 py-0.5 mt-1 font-medium">
                      Date already changed
                    </span>
                  </div>
                </div>
              </div>

              <!-- Price and Actions -->
              <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:gap-2">
                <div class="text-right">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">LKR {{ booking.totalAmount }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Total paid</div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="viewBookingDetails(booking)"
                    class="btn-primary text-sm px-3 py-1"
                  >
                    View Details
                  </button>
                  
                  <button
                    @click="downloadReceipt(booking)"
                    class="text-sm px-3 py-1 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Receipt
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed' && canChangeDate(booking)"
                    @click="changeDateModal(booking)"
                    class="text-sm px-3 py-1 border border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    Change Date
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed'"
                    @click="cancelBooking(booking)"
                    class="text-sm px-3 py-1 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed'"
                    @click="rebookSpace(booking)"
                    class="text-sm px-3 py-1 border border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    Rebook
                  </button>

                  <button
                    v-if="booking.status === 'Completed' && !booking.hasReview"
                    @click="rateAndReview(booking)"
                    class="text-sm px-3 py-1 border border-yellow-300 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  >
                    Rate & Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ getEmptyStateTitle() }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ getEmptyStateDescription() }}</p>
          <router-link to="/search" class="btn-primary">
            Book Your First Space
          </router-link>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-else-if="viewMode === 'calendar'">
        <BookingCalendar
          :bookings="filteredBookings"
          @booking-selected="viewBookingDetails"
        />
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" @click="handleBackdropClick" :class="[
      'fixed inset-0 z-50 flex transition-all duration-300',
      isModalMaximized 
        ? 'bg-black/80 backdrop-blur-sm items-start justify-start p-0' 
        : 'bg-black/60 backdrop-blur-sm items-center justify-center p-4'
    ]">
      <div @click.stop :class="[
        'bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300',
        isModalMaximized 
          ? 'w-full h-full rounded-none' 
          : 'w-full max-w-5xl max-h-[90vh] rounded-2xl'
      ]">
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-8 pb-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Booking Details</h1>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Order #{{ detailedBookingData?.order_id }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 mt-3">
                <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', getStatusClass(selectedBooking.status)]">
                  <div :class="['w-2 h-2 rounded-full mr-2', getStatusDotClass(selectedBooking.status)]"></div>
                  {{ selectedBooking.status }}
                </span>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  Booked by {{ detailedBookingData?.first_name }} {{ detailedBookingData?.last_name }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="toggleModalMaximize" class="p-2 hover:bg-white/10 rounded-xl transition-colors" :title="isModalMaximized ? 'Minimize' : 'Maximize'">
                <svg v-if="!isModalMaximized" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7m0 0v3m0-3V7" />
                </svg>
              </button>
              <button @click="closeModal" class="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div :class="[
          'overflow-y-auto transition-all duration-300',
          isModalMaximized 
            ? 'max-h-[calc(100vh-200px)]' 
            : 'max-h-[calc(90vh-200px)]'
        ]">
          <!-- Loading State -->
          <div v-if="loadingDetails" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="relative">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/40 animate-spin mx-auto" style="animation-duration: 0.75s;"></div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mt-4 font-medium">Loading booking details...</p>
            </div>
          </div>

          <!-- Booking Content -->
          <div v-else-if="detailedBookingData" class="p-8 space-y-8">
            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-4 border border-primary/20 dark:border-primary/30">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">LKR {{ detailedBookingData.total_price.toLocaleString() }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Total Amount</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/30">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(detailedBookingData.products[0]?.booking_date || selectedBooking.date) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Booking Date</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/30">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ detailedBookingData.products.length }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Products</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Section -->
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Booked Products</h2>
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {{ detailedBookingData.products.length }} item{{ detailedBookingData.products.length > 1 ? 's' : '' }}
                </span>
              </div>

              <div class="grid gap-6">
                <div v-for="(product, index) in detailedBookingData.products" :key="product.product_id"
                     class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden">
                  <div class="p-6">
                    <div class="flex flex-col lg:flex-row gap-6">
                      <!-- Product Image -->
                      <div class="flex-shrink-0">
                        <div class="relative">
                          <img
                            :src="product.product_image ? (product.product_image.startsWith('http') ? product.product_image : `http://localhost:9011${product.product_image}`) : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'"
                            :alt="product.product_name"
                            class="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                          >
                          <div class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Product Details -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-4">
                          <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ product.product_name }}</h3>
                            <div class="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {{ product.location_name }}
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="text-2xl font-bold text-primary">LKR {{ product.price.toLocaleString() }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Base Price</div>
                          </div>
                        </div>

                        <!-- Product Info Grid -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div class="flex items-center gap-2 mb-1">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Date</span>
                            </div>
                            <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(product.booking_date) }}</p>
                          </div>

                          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div class="flex items-center gap-2 mb-1">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Time</span>
                            </div>
                            <p class="font-semibold text-gray-900 dark:text-white">
                              {{ formatTimeOnly(product.start_time) }} - {{ formatTimeOnly(product.end_time) }}
                            </p>
                          </div>

                          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div class="flex items-center gap-2 mb-1">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Duration</span>
                            </div>
                            <p class="font-semibold text-gray-900 dark:text-white">{{ calculateDurationHours(product.start_time, product.end_time) }}h</p>
                          </div>

                          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <div class="flex items-center gap-2 mb-1">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Capacity</span>
                            </div>
                            <p class="font-semibold text-gray-900 dark:text-white">{{ product.spaceDetails?.capacity || 'N/A' }} people</p>
                          </div>
                        </div>

                      

                        <!-- Features & Facilities -->
                        <div class="space-y-3">                         

                          <!-- Included Facilities -->
                          <div v-if="product.spaceDetails?.default_facilities && product.spaceDetails.default_facilities.length > 0">
                            <div class="flex items-center gap-2 mb-2">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span class="text-sm font-medium text-gray-900 dark:text-white">Included Facilities</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                              <span v-for="facility in product.spaceDetails.default_facilities" :key="facility.facility_id"
                                    class="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                                {{ facility.facility_name }}
                              </span>
                            </div>
                          </div>

                          <!-- Additional Facilities -->
                          <div v-if="product.facilities && product.facilities.length > 0">
                            <div class="flex items-center gap-2 mb-2">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span class="text-sm font-medium text-gray-900 dark:text-white">Additional Facilities</span>
                            </div>
                            <div class="space-y-2">
                              <div v-for="facility in product.facilities" :key="facility.facility_id"
                                   class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ facility.facility_name || `Facility ${facility.facility_id}` }}</span>
                                <span class="text-sm font-bold text-primary">+ LKR {{ facility.price.toLocaleString() }}</span>
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

            <!-- Price Breakdown -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Price Breakdown</h3>
              </div>

              <div class="space-y-4">
                <!-- Products -->
                <div class="space-y-3">
                  <div v-for="product in detailedBookingData.products" :key="product.product_id"
                       class="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span class="text-xs font-bold text-primary">{{ detailedBookingData.products.indexOf(product) + 1 }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ product.product_name }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          {{ formatDate(product.booking_date) }} • {{ calculateDurationHours(product.start_time, product.end_time) }}h
                        </p>
                      </div>
                    </div>
                    <span class="font-bold text-gray-900 dark:text-white">LKR {{ product.price.toLocaleString() }}</span>
                  </div>
                </div>

                <!-- Additional Facilities -->
                <div v-if="detailedBookingData.products.some((p: any) => p.facilities && p.facilities.length > 0)" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Additional Facilities</h4>
                  <div class="space-y-2">
                    <div v-for="product in detailedBookingData.products" :key="`facilities-${product.product_id}`">
                      <div v-if="product.facilities && product.facilities.length > 0" class="space-y-2">
                        <div v-for="facility in product.facilities" :key="facility.facility_id"
                             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <span class="text-sm text-gray-700 dark:text-gray-300 ml-4">• {{ facility.facility_name || `Facility ${facility.facility_id}` }}</span>
                          <span class="text-sm font-medium text-primary">LKR {{ facility.price.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total -->
                <div class="border-t-2 border-primary/30 pt-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">Total Amount</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Including all facilities and taxes</p>
                    </div>
                    <div class="text-right">
                      <p class="text-3xl font-bold text-primary">LKR {{ detailedBookingData.total_price.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="downloadReceipt(selectedBooking)"
                class="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>

              <button
                v-if="selectedBooking.status === 'Confirmed' && detailedBookingData.is_updatable"
                @click="changeDateModal(selectedBooking)"
                class="inline-flex items-center px-6 py-3 bg-black hover:bg-black text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Change Date
              </button>

              <button
                v-if="selectedBooking.status === 'Confirmed'"
                @click="cancelBooking(selectedBooking)"
                class="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-black border border-black rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Booking
              </button>

              <button
                v-if="selectedBooking.status === 'Completed' && !selectedBooking.hasReview"
                @click="rateAndReview(selectedBooking)"
                class="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rate & Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Change Modal -->
    <div v-if="showDateChangeModal" @click="showDateChangeModal = false" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Change Booking Date</h2>
          <button @click="showDateChangeModal = false" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-gray-600 dark:text-gray-400 mb-2">Current date: {{ formatDate(bookingToChange?.date || '') }}</p>
          
          <!-- For meeting rooms: Date picker + Time range picker -->
          <template v-if="bookingToChange?.spaceType === 'meeting-room'">
            <div class="relative z-70">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                <SingleDatePicker
                  v-model="newDateRange"
                  label=""
                  placeholder="Select date"
                  :min-date="getTodayLocal()"
                  @change="onDateChange"
                  class="w-full"
                />
              </div>
              
              <div v-if="newDateRange" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time Range</label>
                <CustomTimeRangePicker
                  v-model="newTimeRange"
                  label=""
                  :disabled-start-times="disabledTimes.start"
                  :disabled-end-times="disabledTimes.end"
                  :loading="loadingAvailability"
                  @start-time-change="onStartTimeChange"
                  class="w-full"
                />
                <p v-if="availabilityError" class="text-xs text-red-500 mt-1">{{ availabilityError }}</p>
              </div>
            </div>
          </template>
          
          <!-- For hot desks: Date range picker -->
          <template v-else>
            <div class="relative z-70">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select New Date</label>
              <SingleDatePicker
                v-model="newDateRange"
                label=""
                placeholder="Select date"
                :min-date="getTodayLocal()"
                @change="onDateChange"
                class="w-full"
              />
              <div v-if="loadingAvailability" class="mt-2">
                <div class="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Checking availability...</p>
              </div>
              <p v-if="availabilityError" class="text-xs text-red-500 mt-1">{{ availabilityError }}</p>
            </div>
          </template>
          
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Note: Date changes are subject to availability and may incur additional fees.</p>
        </div>

        <div class="flex justify-end gap-3">
          <button @click="showDateChangeModal = false" class="bg-black/20 hover:bg-black/30 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-black/20 focus:ring-offset-2">
            Cancel
          </button>
          <button 
            @click="confirmDateChange" 
            :disabled="loadingAvailability || (!newDateRange || (bookingToChange?.spaceType === 'meeting-room' && (!newTimeRange.start || !newTimeRange.end)))"
            class="btn-primary disabled:opacity-50"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" @click="showProfileModal = false" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
          <button @click="showProfileModal = false" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input type="text" value="Demo" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input type="text" value="User" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value="demo@workspace.com" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" value="(555) 123-4567" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company (Optional)</label>
            <input type="text" placeholder="Your company name" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showProfileModal = false" class="btn-primary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Cards Management Modal -->
    <div v-if="showCardsModal" @click="showCardsModal = false" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Manage Payment Cards</h2>
          <button @click="showCardsModal = false" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Existing Cards -->
        <div class="space-y-4 mb-6">
          <h3 class="font-medium text-gray-900 dark:text-white">Saved Cards</h3>

          <!-- Sample Card -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">
                VISA
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Expires 12/25</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">Default</span>
              <button class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Card -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">Add New Card</h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry</label>
                <input type="text" placeholder="MM/YY" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                <input type="text" placeholder="123" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
              <input type="text" placeholder="Full name on card" class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
            </div>

            <div class="flex justify-end gap-3">
              <button type="button" @click="showCardsModal = false" class="btn-primary">
                Close
              </button>
              <button type="submit" class="btn-primary">
                Add Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <SuccessOverlay
      :show="showSuccessOverlay"
      :title="successOverlayTitle"
      :message="successOverlayMessage"
      @close="showSuccessOverlay = false"
    />

    <CancelBooking
      :show="showCancelModal"
      @close="showCancelModal = false"
      @confirm="confirmCancelBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

// Define component name to fix the multi-word component name lint error
defineComponent({
  name: 'BookingsPage'
});
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookingCalendar from '../components/BookingCalendar.vue'
import { generatePDFReceipt } from '../utils/pdfReceipt'
import SuccessOverlay from '../components/SuccessOverlay.vue'
import CancelBooking from '../components/CancelBooking.vue'
import { BookingManager, type BookingData } from '../api/bookingManager'
import { useAuthStore } from '../stores/auth'
import { NetworkManager } from '../api/networkManager'
import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import SingleDatePicker from '../components/SingleDatePicker.vue'
import { getTodayLocal, formatDateLocal } from '../utils/dateUtils'

// Define interfaces for type safety
interface Space {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
}

interface Booking {
  id: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  date: string;
  duration: 'hourly' | 'daily' | 'weekly' | 'monthly';
  spaceType: string;
  guests: number;
  totalAmount: number;
  basePrice: number;
  extraFees: number;
  serviceFee: number;
  taxes: number;
  hasReview: boolean;
  dateChanged: boolean;
  paymentId?: string;
  facilityIds?: number[];
  space: Space;
  start_time?: string;
  end_time?: string;
  productImages?: string[]; // Array of product images from API
  // Add full API data for detailed view
  apiData?: BookingData;
}

interface ReceiptData {
  bookings: Array<{
    spaceId: number;
    productType: string;
    space: {
      name: string;
      location: string;
    };
    totalPrice: number;
    booking?: {
      startDate: string;
      endDate: string;
      startTime: string;
      duration: string;
    };
    subscription?: {
      startDate: string;
      endDate: string;
      packageType: string;
    };
  }>;
  bookingId: string;
  paymentMethod: string;
  confirmedAt: string;
  totalAmount: number;
  guestInfo: { 
    firstName: string;
    lastName: string;
  };
}

const router = useRouter()

// Component state
const loading = ref(true)
const activeTab = ref('upcoming')
const viewMode = ref<'list' | 'calendar'>('list')
const searchQuery = ref('')
const selectedBooking = ref<Booking | null>(null)
const showDateChangeModal = ref(false)
const showProfileModal = ref(false)
const showCardsModal = ref(false)
const bookingToChange = ref<Booking | null>(null)
const newDate = ref('')
const newDateRange = ref<string | undefined>(undefined)
const newTimeRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const bookedTimeSlots = ref<Array<{ startTime: string; endTime: string }>>([])
const disabledTimes = ref<{ start: string[]; end: string[] }>({ start: [], end: [] })
const loadingAvailability = ref(false)
const availabilityError = ref('')
const showSuccessOverlay = ref(false)
const successOverlayTitle = ref('')
const successOverlayMessage = ref('')
const showCancelModal = ref(false)
const bookingToCancel = ref<Booking | null>(null)
const detailedBookingData = ref<any>(null)
const loadingDetails = ref(false)
const isModalMaximized = ref(false)

// Stats
const stats = ref({
  totalBookings: 12,
  upcomingBookings: 3,
  favoriteSpaces: 5,
  totalSpent: 1248,
  activeSubscriptions: 2
})

// Tabs
const tabs = ref([
  { id: 'upcoming', name: 'Upcoming', count: 3 },
  { id: 'past', name: 'Past', count: 8 },
  { id: 'cancelled', name: 'Cancelled', count: 1 }
])

// Bookings data
const allBookings = ref<Booking[]>([])
const errorMessage = ref('')

// Function to transform API booking data to UI format
const transformBookingData = (booking: BookingData, status: 'Confirmed' | 'Completed' | 'Cancelled'): Booking => {
  // Get the primary product from the products array
  const primaryProduct = booking.products && booking.products.length > 0 ? booking.products[0] : null;

  // Collect all product images from the API response
  const productImages = booking.products 
    ? booking.products
        .map(product => product.product_image)
        .filter((image): image is string => image !== undefined && image.trim() !== '')
        .map(image => image.startsWith('http') ? image : `http://localhost:9011${image}`)
    : [];

  // Use first product image as main space image, fallback to default
  const mainImage = productImages.length > 0 
    ? productImages[0] 
    : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  if (!primaryProduct) {
    console.warn('No product found in booking:', booking);
    return {
      id: `BK${booking.booking_id}`,
      status: status,
      date: getTodayLocal(), // Default to today if no product
      duration: 'daily',
      spaceType: 'hot-desk',
      guests: 1,
      totalAmount: booking.total_price,
      basePrice: booking.total_price * 0.8,
      extraFees: 0,
      serviceFee: booking.total_price * 0.1,
      taxes: booking.total_price * 0.1,
      hasReview: false,
      dateChanged: !!booking.is_onetime_changed,
      paymentId: booking.order_id,
      facilityIds: booking.facility_ids || [],
      productImages: productImages,
      space: {
        id: booking.product_id,
        name: `Booking ${booking.booking_id}`,
        location: 'Location not specified',
        rating: 4.5,
        image: mainImage
      }
    };
  }

  // Determine space type based on product name
  let spaceType = 'hot-desk'; // default
  const name = primaryProduct.product_name.toLowerCase();
  if (name.includes('meeting') || name.includes('conference')) {
    spaceType = 'meeting-room';
  } else if (name.includes('private') || name.includes('office')) {
    spaceType = 'private-office';
  } else if (name.includes('dedicated')) {
    spaceType = 'dedicated-desk';
  }

  // Format dates and calculate duration
  const duration = calculateDuration(primaryProduct.start_time, primaryProduct.end_time);

  return {
    id: `BK${booking.booking_id}`,
    status: status,
    date: primaryProduct.booking_date,
    duration: duration,
    spaceType: spaceType,
    guests: 1, // Default value, can be adjusted if API provides this information
    totalAmount: booking.total_price,
    basePrice: primaryProduct.price * 0.8, // Estimate if not provided
    extraFees: 0,
    serviceFee: primaryProduct.price * 0.1, // Estimate if not provided
    taxes: primaryProduct.price * 0.1, // Estimate if not provided
    hasReview: false,
    dateChanged: !!booking.is_onetime_changed,
    paymentId: booking.order_id,
    facilityIds: primaryProduct.facilities ? primaryProduct.facilities.map(f => f.facility_id) : [],
    start_time: primaryProduct.start_time,
    end_time: primaryProduct.end_time,
    productImages: productImages,
    space: {
      id: primaryProduct.product_id,
      name: primaryProduct.product_name,
      location: primaryProduct.location_name,
      rating: 4.5, // Default value
      image: mainImage
    },
    // Include full API data for detailed view
    apiData: booking
  };
}

// Function to fetch all bookings for the user
const fetchAllBookings = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const authStore = useAuthStore()
    const user = authStore.currentUser
    
    if (!user) {
      errorMessage.value = 'Please sign in to view your bookings'
      loading.value = false
      return
    }
    
    // Reset bookings
    allBookings.value = []
    
    // Fetch all three types of bookings in parallel
    const [upcomingResponse, pastResponse, canceledResponse] = await Promise.all([
      BookingManager.getUpcomingBookings(user.id),
      BookingManager.getPastBookings(user.id),
      BookingManager.getCanceledBookings(user.id)
    ])
    
    // Process upcoming bookings
    console.log('Upcoming bookings response:', upcomingResponse);
    if (upcomingResponse.success && upcomingResponse.bookings.length > 0) {
      const upcomingBookings = upcomingResponse.bookings.map(booking => 
        transformBookingData(booking, 'Confirmed')
      )
      console.log('Transformed upcoming bookings:', upcomingBookings);
      allBookings.value = [...allBookings.value, ...upcomingBookings]
    }
    
    // Process past bookings
    if (pastResponse.success && pastResponse.bookings.length > 0) {
      const pastBookings = pastResponse.bookings.map(booking => 
        transformBookingData(booking, 'Completed')
      )
      allBookings.value = [...allBookings.value, ...pastBookings]
    }
    
    // Process canceled bookings
    if (canceledResponse.success && canceledResponse.bookings.length > 0) {
      const canceledBookings = canceledResponse.bookings.map(booking => 
        transformBookingData(booking, 'Cancelled')
      )
      allBookings.value = [...allBookings.value, ...canceledBookings]
    }
    
    // If no bookings were found in any category
    if (allBookings.value.length === 0) {
      // Check if all API calls were successful but returned no data
      const allSuccessful = upcomingResponse.success && pastResponse.success && canceledResponse.success;
      
      if (allSuccessful) {
        console.log('All API calls successful but no bookings found');
        // No need to show sample data - user truly has no bookings
      } else {
        // At least one API call failed
        const errorMsg = [
          upcomingResponse.success ? '' : upcomingResponse.message,
          pastResponse.success ? '' : pastResponse.message,
          canceledResponse.success ? '' : canceledResponse.message
        ].filter(Boolean).join('; ')
        
        errorMessage.value = errorMsg || 'Failed to load your bookings'
        
        // Use sample data as fallback only if all API calls failed
        if (!upcomingResponse.success && !pastResponse.success && !canceledResponse.success) {
          console.log('All API calls failed, using sample data');
          useSampleBookingData();
        }
      }
    }
    
    // Update the tabs count
    updateTabCounts()
  } catch (error) {
    console.error('Error fetching bookings:', error)
    errorMessage.value = 'An error occurred while fetching your bookings'
    
    // Use sample data as fallback in case of API failure
    useSampleBookingData()
  } finally {
    loading.value = false
  }
}

// Function to fetch user's upcoming bookings from API (for backward compatibility)
const fetchUpcomingBookings = fetchAllBookings

// Helper function to calculate duration based on start and end times
const calculateDuration = (startTime?: string, endTime?: string): 'hourly' | 'daily' | 'weekly' | 'monthly' => {
  if (!startTime || !endTime) return 'daily'; // Default

  // Parse hours from time strings (handles both "HH:MM" and "HH:MM:SS" formats)
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);

  // Calculate hours difference
  const hoursDiff = endHour - startHour;

  if (hoursDiff <= 4) return 'hourly';
  return 'daily'; // For now, default to daily for longer bookings
}

// Update tab counts based on actual bookings
const updateTabCounts = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let upcomingCount = 0
  let pastCount = 0
  let cancelledCount = 0
  
  allBookings.value.forEach(booking => {
    const bookingDate = new Date(booking.date)
    bookingDate.setHours(0, 0, 0, 0)
    
    if (booking.status === 'Confirmed' && bookingDate >= today) {
      upcomingCount++
    } else if (booking.status === 'Completed' || (booking.status === 'Confirmed' && bookingDate < today)) {
      pastCount++
    } else if (booking.status === 'Cancelled') {
      cancelledCount++
    }
  })
  
  // Update tabs with accurate counts
  tabs.value = [
    { id: 'upcoming', name: 'Upcoming', count: upcomingCount },
    { id: 'past', name: 'Past', count: pastCount },
    { id: 'cancelled', name: 'Cancelled', count: cancelledCount }
  ]
  
  // Update stats
  stats.value = {
    ...stats.value,
    totalBookings: allBookings.value.length,
    upcomingBookings: upcomingCount,
    activeSubscriptions: allBookings.value.filter(b => b.spaceType === 'dedicated-desk' || b.spaceType === 'coworking-space').length
  }
}

// Fallback function for sample data
const useSampleBookingData = () => {
  console.log('USING SAMPLE DATA - API DATA UNAVAILABLE');
  
  // Set a flag in session storage to indicate we're showing sample data
  sessionStorage.setItem('using_sample_booking_data', 'true');
  
  allBookings.value = [
    {
      id: 'SAMPLE123',
      status: 'Confirmed' as 'Confirmed' | 'Completed' | 'Cancelled',
      date: '2024-12-20',
      duration: 'daily',
      spaceType: 'hot-desk',
      guests: 1,
      totalAmount: 85,
      basePrice: 65,
      extraFees: 0,
      serviceFee: 8,
      taxes: 12,
      hasReview: false,
      dateChanged: false,
      space: {
        id: 1,
        name: '[SAMPLE] The Innovation Hub',
        location: 'Downtown, San Francisco',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      }
    }
  ]
  
  // Update counts for sample data
  updateTabCounts()
}

// Computed properties
const filteredBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let filtered = allBookings.value.filter(booking => {
    const bookingDate = new Date(booking.date)
    bookingDate.setHours(0, 0, 0, 0)
    
    switch (activeTab.value) {
      case 'upcoming':
        return booking.status === 'Confirmed' && bookingDate >= today
      case 'past':
        return booking.status === 'Completed' || (booking.status === 'Confirmed' && bookingDate < today)
      case 'cancelled':
        return booking.status === 'Cancelled'
      default:
        return true
    }
  })
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(booking => 
      booking.space.name.toLowerCase().includes(query) ||
      booking.space.location.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query)
    )
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const upcomingBooking = computed(() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return allBookings.value.find(booking => {
    const bookingDate = new Date(booking.date)
    return booking.status === 'Confirmed' && 
           bookingDate.toDateString() === tomorrow.toDateString()
  })
})

// Methods
const formatDate = (dateString: string) => {
  // Ensure we handle the date string consistently
  // If it's already in YYYY-MM-DD format, create date at local midnight
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTimeOnly = (timeString: string) => {
  if (!timeString) return 'N/A';
  // Handle both "HH:MM:SS" and "HH:MM" formats
  const time = timeString.split(':').slice(0, 2).join(':');
  return time;
}

const calculateDurationHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;

  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
}

const formatDuration = (duration: string) => {
  switch (duration) {
    case 'hourly':
      return 'Hourly'
    case 'daily':
      return 'Full Day'
    case 'weekly':
      return 'Weekly'
    default:
      return 'Full Day'
  }
}

const formatSpaceType = (spaceType: string) => {
  const types: { [key: string]: string } = {
    'hot-desk': 'Hot Desk',
    'dedicated-desk': 'Dedicated Desk',
    'private-office': 'Private Office',
    'meeting-room': 'Meeting Room'
  }
  return types[spaceType] || spaceType
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'Completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-500'
    case 'Completed':
      return 'bg-blue-500'
    case 'Cancelled':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'text-green-600'
    case 'Completed':
      return 'text-blue-600'
    case 'Cancelled':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getEmptyStateTitle = () => {
  switch (activeTab.value) {
    case 'upcoming':
      return 'No upcoming bookings'
    case 'past':
      return 'No past bookings'
    case 'cancelled':
      return 'No cancelled bookings'
    default:
      return 'No bookings found'
  }
}

const getEmptyStateDescription = () => {
  switch (activeTab.value) {
    case 'upcoming':
      return 'Book your first workspace to get started'
    case 'past':
      return 'Your completed bookings will appear here'
    case 'cancelled':
      return 'Any cancelled bookings will show up here'
    default:
      return 'Start by booking a workspace'
  }
}

const viewBookingDetails = async (booking: Booking) => {
  selectedBooking.value = booking
  isModalMaximized.value = false // Reset maximize state when opening modal
  loadingDetails.value = true
  detailedBookingData.value = null

  try {
    // If we have the full API data, use it directly
    if (booking.apiData) {
      detailedBookingData.value = booking.apiData

      // Fetch additional details for each product if needed
      if (booking.apiData.products && booking.apiData.products.length > 0) {
        const enhancedProducts = await Promise.all(
          booking.apiData.products.map(async (product) => {
            try {
              // Fetch additional space details
              const spaceResponse = await NetworkManager.getSpaces({ id: product.product_id })
              if (spaceResponse.success && spaceResponse.space) {
                return {
                  ...product,
                  spaceDetails: spaceResponse.space,
                  images: spaceResponse.space.images || [],
                  description: spaceResponse.space.description || '',
                  capacity: spaceResponse.space.capacity || 1,
                  features: spaceResponse.space.features || [],
                  default_facilities: spaceResponse.space.default_facilities || [],
                  additional_facilities: spaceResponse.space.additional_facilities || []
                }
              }
              return product
            } catch (error) {
              console.warn(`Failed to fetch details for product ${product.product_id}:`, error)
              return product
            }
          })
        )

        detailedBookingData.value = {
          ...booking.apiData,
          products: enhancedProducts
        }
      }
    }
  } catch (error) {
    console.error('Error fetching booking details:', error)
  } finally {
    loadingDetails.value = false
  }
}

const viewSpaceDetails = (spaceId: number) => {
  router.push(`/space/${spaceId}`)
}

const toggleModalMaximize = () => {
  isModalMaximized.value = !isModalMaximized.value
}

const closeModal = () => {
  selectedBooking.value = null
  isModalMaximized.value = false
}

const handleBackdropClick = () => {
  if (!isModalMaximized.value) {
    closeModal()
  }
}

const cancelBooking = (booking: Booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const confirmCancelBooking = async () => {
  if (!bookingToCancel.value) return

  try {
    const bookingId = parseInt(bookingToCancel.value.id.replace('BK', ''))
    const response = await BookingManager.cancelBooking(bookingId)
    
    if (response.success) {
      // Update the booking status in the UI
      bookingToCancel.value.status = 'Cancelled'
      showCancelModal.value = false
      
      // Show success message
      successOverlayTitle.value = 'Booking Cancelled'
      successOverlayMessage.value = 'Your booking has been successfully cancelled.'
      showSuccessOverlay.value = true
      
      // Update the tabs count after cancellation
      updateTabCounts()
      
      // Reset
      bookingToCancel.value = null
    } else {
      alert(`Error: ${response.message}`)
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert('Failed to cancel booking. Please try again.')
  }
}

const rebookSpace = (booking: Booking) => {
  router.push({
    name: 'SpaceDetails',
    params: { id: booking.space.id }
  })
}

const rateAndReview = (booking: Booking) => {
  alert('Rating and review functionality will be implemented in the next phase.')
  booking.hasReview = true
}

const getDirections = (booking: Booking) => {
  const address = encodeURIComponent(booking.space.location)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const downloadReceipt = async (booking: Booking) => {
  try {
    // Get user data from auth store for receipt
    const authStore = useAuthStore()
    const user = authStore.currentUser
    let userDetails: { firstName?: string; lastName?: string; email?: string } | null = null
    try {
      userDetails = JSON.parse(localStorage.getItem('user_details') || '{}')
    } catch {
      userDetails = {}
    }
    
    // Map booking data to the format expected by the PDF generator
    const mappedBooking: ReceiptData['bookings'][0] = {
      spaceId: booking.space.id,
      productType: booking.spaceType,
      space: {
        name: booking.space.name,
        location: booking.space.location,
      },
      totalPrice: booking.totalAmount,
    };

    // Add booking details based on the space type
    if (booking.spaceType === 'meeting-room') {
      mappedBooking.booking = {
        startDate: booking.date,
        endDate: booking.date,
        startTime: booking.start_time || '09:00', // Use actual start time if available
        duration: booking.duration,
      };
    } else {
      mappedBooking.subscription = {
        startDate: booking.date,
        endDate: booking.date,
        packageType: booking.duration,
      };
    }

    // Build receipt data with real user information and comprehensive details
    const receiptData = {
      bookings: [mappedBooking],
      bookingId: booking.id,
      orderId: detailedBookingData.value?.order_id || booking.id,
      paymentMethod: booking.paymentId ? `Payment #${booking.paymentId}` : 'Credit Card',
      confirmedAt: new Date().toISOString(),
      totalAmount: booking.totalAmount,
      guestInfo: { 
        firstName: userDetails?.firstName || user?.firstName || 'Guest', 
        lastName: userDetails?.lastName || user?.lastName || ''
      },
      products: detailedBookingData.value?.products || []
    }
    
    await generatePDFReceipt(receiptData)
  } catch (error) {
    console.error('Failed to generate PDF receipt:', error)
    alert('Could not generate PDF receipt. Please try again later.')
  }
}

const canChangeDate = (booking: Booking) => {
  const bookingDate = new Date(booking.date)
  const now = new Date()
  const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  // Only allow if more than 48 hours away and date hasn't been changed yet
  return hoursDiff > 48 && !booking.dateChanged
}

const changeDateModal = (booking: Booking) => {
  bookingToChange.value = booking
  console.log('Opening change date modal for booking:', booking)
  console.log('Booking date:', booking.date)
  
  // Ensure consistent date handling - treat as local date
  const bookingDate = new Date(booking.date + 'T12:00:00') // Use noon to avoid timezone issues
  const normalizedDate = formatDateLocal(bookingDate)
  
  console.log('Normalized date:', normalizedDate)
  
  // Initialize based on space type
  if (booking.spaceType === 'meeting-room') {
    // For meeting rooms, use time range picker
    newTimeRange.value = { start: '', end: '' }
    newDateRange.value = normalizedDate
  } else {
    // For hot desks, use date range picker
    newDateRange.value = normalizedDate
    newTimeRange.value = { start: '', end: '' }
  }
  
  // Reset availability data
  bookedTimeSlots.value = []
  disabledTimes.value = { start: [], end: [] }
  loadingAvailability.value = false
  availabilityError.value = ''
  
  showDateChangeModal.value = true
}

const fetchBookedTimeSlots = async (spaceId: number, date: string) => {
  loadingAvailability.value = true
  availabilityError.value = ''
  console.log('Fetching booked time slots for space:', spaceId, 'date:', date)
  try {
    bookedTimeSlots.value = await NetworkManager.getBookedTimeSlots(spaceId, date)
    console.log('Received booked time slots:', bookedTimeSlots.value)
    calculateDisabledTimes()
  } catch (error) {
    console.error('Error fetching booked time slots:', error)
    availabilityError.value = 'Failed to check availability. Please try again.'
    bookedTimeSlots.value = []
  } finally {
    loadingAvailability.value = false
  }
}

const calculateDisabledTimes = () => {
  if (!bookingToChange.value) return
  
  const allTimeSlots = generateTimeSlots()
  const disabledStartTimes: string[] = []
  const disabledEndTimes: string[] = []

  // Disable start times that conflict with existing bookings
  for (const slot of allTimeSlots) {
    if (isTimeSlotBooked(slot, 'start')) {
      disabledStartTimes.push(slot)
    }
  }

  // Calculate disabled end times based on selected start time
  if (newTimeRange.value.start) {
    for (const slot of allTimeSlots) {
      if (shouldDisableEndTime(slot)) {
        disabledEndTimes.push(slot)
      }
    }
  }

  disabledTimes.value = {
    start: disabledStartTimes,
    end: disabledEndTimes
  }
}

const generateTimeSlots = (): string[] => {
  // For simplicity, generate standard business hours (9 AM to 6 PM) in 30-minute intervals
  const slots: string[] = []
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break // Stop at 6:00 PM
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }
  return slots
}

const isTimeSlotBooked = (timeSlot: string, type: 'start' | 'end'): boolean => {
  const slotTime = timeToMinutes(timeSlot)
  
  for (const booking of bookedTimeSlots.value) {
    const bookingStart = timeToMinutes(booking.startTime)
    const bookingEnd = timeToMinutes(booking.endTime)
    
    if (type === 'start') {
      // For start times, check if the slot conflicts with any existing booking
      if (slotTime >= bookingStart && slotTime < bookingEnd) {
        return true
      }
    }
  }
  return false
}

const shouldDisableEndTime = (endTimeSlot: string): boolean => {
  const startTime = newTimeRange.value.start
  if (!startTime) return false

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTimeSlot)

  // End time must be after start time
  if (endMinutes <= startMinutes) {
    return true
  }

  // Check if there's a booking between start time and this end time
  for (const booking of bookedTimeSlots.value) {
    const bookingStart = timeToMinutes(booking.startTime)
    const bookingEnd = timeToMinutes(booking.endTime)

    // If there's any booking that starts before or at our proposed end time
    // and after our start time, then this end time is invalid
    if (bookingStart >= startMinutes && bookingStart < endMinutes) {
      return true
    }
    
    // If there's any booking that overlaps with our time range
    if (bookingStart < endMinutes && bookingEnd > startMinutes) {
      return true
    }
  }

  return false
}

const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

const onDateChange = async (date: string | null) => {
  if (date && bookingToChange.value) {
    // Ensure date is handled consistently as local date
    const selectedDate = date // Already in YYYY-MM-DD format from SingleDatePicker
    console.log('Date changed to:', selectedDate)
    await fetchBookedTimeSlots(bookingToChange.value.space.id, selectedDate)
  }
}

const onStartTimeChange = (startTime: string) => {
  // Recalculate disabled end times when start time changes
  calculateDisabledTimes()
}

const confirmDateChange = async () => {
  if (!bookingToChange.value) return

  let selectedDate = ''
  let startTime = ''
  let endTime = ''
  let isValid = false

  if (bookingToChange.value.spaceType === 'meeting-room') {
    // For meeting rooms, validate time range
    if (newDateRange.value && newTimeRange.value.start && newTimeRange.value.end) {
      selectedDate = newDateRange.value
      startTime = newTimeRange.value.start
      endTime = newTimeRange.value.end

      // Check if the selected time slot is available
      const hasConflict = bookedTimeSlots.value.some(booking => {
        const bookingStart = timeToMinutes(booking.startTime)
        const bookingEnd = timeToMinutes(booking.endTime)
        const selectedStart = timeToMinutes(startTime)
        const selectedEnd = timeToMinutes(endTime)

        // Check for overlap
        return !(selectedEnd <= bookingStart || selectedStart >= bookingEnd)
      })

      if (hasConflict) {
        alert('The selected time slot is not available. Please choose a different time.')
        return
      }

      isValid = true
    }
  } else {
    // For hot desks, validate date
    if (newDateRange.value) {
      selectedDate = newDateRange.value

      // For hot desks, check if the date is fully booked
      const isDateBooked = bookedTimeSlots.value.length > 0
      if (isDateBooked) {
        alert('This date is not available for hot desk booking. Please choose a different date.')
        return
      }

      isValid = true
    }
  }

  if (isValid && selectedDate) {
    try {
      // Extract booking ID (remove 'BK' prefix)
      const bookingIdStr = bookingToChange.value.id.replace('BK', '')
      const bookingId = parseInt(bookingIdStr, 10)

      if (isNaN(bookingId)) {
        alert('Invalid booking ID. Please try again.')
        return
      }

      // Prepare API request data
      const updateData: {
        BookingId: number;
        ProductId: number;
        BookingDate: string;
        StartTime?: string;
        EndTime?: string;
      } = {
        BookingId: bookingId,
        ProductId: bookingToChange.value.space.id,
        BookingDate: selectedDate
      }

      // Add time fields only for meeting rooms
      if (bookingToChange.value.spaceType === 'meeting-room') {
        updateData.StartTime = startTime
        updateData.EndTime = endTime
      }

      console.log('Updating booking with data:', updateData)

      // Call the API
      const response = await NetworkManager.updateBooking(updateData)

      if (response.success) {
        // Update local data on success
        bookingToChange.value.date = selectedDate
        if (bookingToChange.value.spaceType === 'meeting-room') {
          bookingToChange.value.start_time = startTime
          bookingToChange.value.end_time = endTime
        }
        bookingToChange.value.dateChanged = true

        showDateChangeModal.value = false
        alert('Date changed successfully! You will receive a confirmation email. You can only change the date once.')
        bookingToChange.value = null

        // Reset form data
        newDateRange.value = undefined
        newTimeRange.value = { start: '', end: '' }
        bookedTimeSlots.value = []
        disabledTimes.value = { start: [], end: [] }
      } else {
        alert(`Failed to update booking: ${response.message}`)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('An error occurred while updating the booking. Please try again.')
    }
  } else {
    alert('Please select a valid date and time.')
  }
}

// Add any new bookings from session storage only if we don't have API data
const addSessionBookings = () => {
  const confirmation = sessionStorage.getItem('bookingConfirmation');
  if (confirmation) {
    try {
      const confirmationData = JSON.parse(confirmation);
      
      // Check if this booking already exists in our API data
      // First check if we have a booking ID in the confirmation
      if (confirmationData.bookingId) {
        const bookingIdExists = allBookings.value.some(b => 
          b.id === `BK${confirmationData.bookingId}` || b.id === confirmationData.bookingId);
        
        if (bookingIdExists) {
          console.log('Booking from session storage already exists in API data');
          return; // Skip if already exists
        }
      }
      
      // If no booking ID or not found, proceed to add as new booking
      const images = confirmationData.space?.images || ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'];
      const newBooking = {
        id: confirmationData.bookingId ? `BK${confirmationData.bookingId}` : 'WS' + Date.now().toString().slice(-8),
        status: 'Confirmed' as 'Confirmed' | 'Completed' | 'Cancelled',
        date: confirmationData.booking?.date || confirmationData.startDate || getTodayLocal(),
        duration: (confirmationData.productType === 'meeting-room' ? 'hourly' : 'monthly') as 'hourly' | 'daily' | 'weekly' | 'monthly',
        spaceType: confirmationData.productType === 'meeting-room' ? 'meeting-room' :
                   confirmationData.productType === 'hot-desk' ? 'hot-desk' : 'coworking-space',
        guests: 1,
        totalAmount: confirmationData.pricing?.total || 170,
        basePrice: confirmationData.pricing?.basePrice || 170,
        extraFees: confirmationData.pricing?.facilitiesPrice || 0,
        serviceFee: confirmationData.pricing?.serviceFee || 17,
        taxes: confirmationData.pricing?.taxes || 15,
        hasReview: false,
        dateChanged: false,
        space: {
          id: confirmationData.spaceId || 1,
          name: confirmationData.space?.name || 'Workspace',
          location: confirmationData.space?.location || 'San Francisco',
          rating: confirmationData.space?.rating || 4.8,
          image: images[0]
        }
      };

      console.log('Adding session booking to list:', newBooking);
      allBookings.value.unshift(newBooking);
      updateTabCounts();
    } catch (error) {
      console.log('Error parsing booking confirmation:', error);
    }
  }
};

// Initialize
onMounted(() => {
  // Fetch all bookings from APIs first
  fetchAllBookings().then(() => {
    // Only add session bookings if we don't have any API bookings
    if (allBookings.value.length === 0) {
      addSessionBookings()
    }
  })
})
</script>
