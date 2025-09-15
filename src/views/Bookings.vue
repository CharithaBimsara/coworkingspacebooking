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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
      </div>

      <!-- Filter Tabs and Controls -->
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
                <img 
                  v-if="booking.space.image" 
                  :src="booking.space.image" 
                  :alt="booking.space.name"
                  class="w-20 h-30 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  @click="viewSpaceDetails(booking.space.id)"
                >
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
    <div v-if="selectedBooking" @click="selectedBooking = null" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Booking Details</h2>
          <button @click="selectedBooking = null" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Space Info -->
          <div class="flex space-x-4">
            <img v-if="selectedBooking.space.image" :src="selectedBooking.space.image" :alt="selectedBooking.space.name" class="w-24 h-24 rounded-lg object-cover">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedBooking.space.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ selectedBooking.space.location }}</p>
              <div class="flex items-center mt-2">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" :class="['w-4 h-4', star <= selectedBooking.space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ selectedBooking.space.rating }}</span>
              </div>
            </div>
          </div>
          
          <!-- Booking Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Booking ID</label>
              <p class="text-gray-900 dark:text-white">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <p :class="['font-medium', getStatusColor(selectedBooking.status)]">{{ selectedBooking.status }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(selectedBooking.date) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
              <p class="text-gray-900 dark:text-white">{{ formatDuration(selectedBooking.duration) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Space Type</label>
              <p class="text-gray-900 dark:text-white">{{ formatSpaceType(selectedBooking.spaceType) }}</p>
            </div>
            
          </div>
          
          <!-- Price Breakdown -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Price Breakdown</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Base Price</span>
                <span class="text-gray-900 dark:text-white">LKR {{ selectedBooking.basePrice }}</span>
              </div>
              <div v-if="selectedBooking.extraFees > 0" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Extra Fees</span>
                <span class="text-gray-900 dark:text-white">${{ selectedBooking.extraFees }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Service Fee</span>
                <span class="text-gray-900 dark:text-white">${{ selectedBooking.serviceFee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Taxes</span>
                <span class="text-gray-900 dark:text-white">LKR {{ selectedBooking.taxes }}</span>
              </div>
              <hr class="my-2 border-gray-200 dark:border-gray-700">
              <div class="flex justify-between font-semibold">
                <span class="text-gray-900 dark:text-white">Total</span>
                <span class="text-gray-900 dark:text-white">LKR {{ selectedBooking.totalAmount }}</span>
              </div>
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date</label>
          <input
            v-model="newDate"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            class="input-field bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Note: Date changes are subject to availability and may incur additional fees.</p>
        </div>

        <div class="flex justify-end gap-3">
          <button @click="showDateChangeModal = false" class="btn-primary">
            Cancel
          </button>
          <button @click="confirmDateChange" :disabled="!newDate" class="btn-primary disabled:opacity-50">
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
const showSuccessOverlay = ref(false)
const successOverlayTitle = ref('')
const successOverlayMessage = ref('')
const showCancelModal = ref(false)
const bookingToCancel = ref<Booking | null>(null)

// Stats
const stats = ref({
  totalBookings: 12,
  upcomingBookings: 3,
  favoriteSpaces: 5,
  totalSpent: 1248
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
  // Determine space type based on product data if available
  let spaceType = 'hot-desk' // default
  if (booking.product_name) {
    const name = booking.product_name.toLowerCase()
    if (name.includes('meeting') || name.includes('conference')) {
      spaceType = 'meeting-room'
    } else if (name.includes('private') || name.includes('office')) {
      spaceType = 'private-office'
    } else if (name.includes('dedicated')) {
      spaceType = 'dedicated-desk'
    }
  }
  
  // Format dates and calculate duration
  const duration = calculateDuration(booking.start_time, booking.end_time)
  
  return {
    id: `BK${booking.booking_id}`,
    status: status,
    date: booking.booking_date,
    duration: duration,
    spaceType: spaceType,
    guests: 1, // Default value, can be adjusted if API provides this information
    totalAmount: booking.total_price,
    basePrice: booking.total_price * 0.8, // Estimate if not provided
    extraFees: 0,
    serviceFee: booking.total_price * 0.1, // Estimate if not provided
    taxes: booking.total_price * 0.1, // Estimate if not provided
    hasReview: false,
    dateChanged: !!booking.is_onetime_changed,
    paymentId: booking.payment_id ? String(booking.payment_id) : undefined,
    facilityIds: booking.facility_ids || [],
    start_time: booking.start_time,
    end_time: booking.end_time,
    space: {
      id: booking.product_id,
      name: booking.product_name || `Space ${booking.product_id}`,
      location: booking.location_name || 'Location not specified',
      rating: 4.5, // Default value
      image: booking.product_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  }
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
  if (!startTime || !endTime) return 'daily' // Default
  
  // Parse hours
  const startHour = parseInt(startTime.split(':')[0])
  const endHour = parseInt(endTime.split(':')[0])
  
  // Calculate hours difference
  const hoursDiff = endHour - startHour
  
  if (hoursDiff <= 4) return 'hourly'
  return 'daily' // For now, default to daily for longer bookings
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
    upcomingBookings: upcomingCount
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
  return new Date(dateString).toLocaleDateString('en-US', { 
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
      return 'bg-green-100 text-green-800'
    case 'Completed':
      return 'bg-blue-100 text-blue-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
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

const viewBookingDetails = (booking: Booking) => {
  selectedBooking.value = booking
}

const viewSpaceDetails = (spaceId: number) => {
  router.push(`/space/${spaceId}`)
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

    // Build receipt data with real user information
    const receiptData = {
      bookings: [mappedBooking],
      bookingId: booking.id,
      paymentMethod: booking.paymentId ? `Payment #${booking.paymentId}` : 'Credit Card',
      confirmedAt: new Date().toISOString(),
      totalAmount: booking.totalAmount,
      guestInfo: { 
        firstName: userDetails?.firstName || user?.firstName || 'Guest', 
        lastName: userDetails?.lastName || user?.lastName || ''
      }
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
  newDate.value = booking.date
  showDateChangeModal.value = true
}

const confirmDateChange = () => {
  if (bookingToChange.value && newDate.value) {
    bookingToChange.value.date = newDate.value
    bookingToChange.value.dateChanged = true
    showDateChangeModal.value = false
    alert('Date changed successfully! You will receive a confirmation email. You can only change the date once.')
    bookingToChange.value = null
    newDate.value = ''
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
        date: confirmationData.booking?.date || confirmationData.startDate || new Date().toISOString().split('T')[0],
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
