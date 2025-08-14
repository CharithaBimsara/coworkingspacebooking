<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto container-padding py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">My Bookings</h1>
          <p class="text-gray-600">Manage your workspace reservations and booking history</p>
        </div>
        <router-link to="/search" class="btn-primary mt-4 sm:mt-0">
          <!-- <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg> -->
          Book New Space
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalBookings }}</p>
              <p class="text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ stats.upcomingBookings }}</p>
              <p class="text-sm text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ stats.favoriteSpaces }}</p>
              <p class="text-sm text-gray-600">Favorite Spaces</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">${{ stats.totalSpent }}</p>
              <p class="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs and Controls -->
      <div class="bg-white rounded-xl p-6 shadow-card mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Tabs -->
          <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors', activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
            >
              {{ tab.name }}
              <span v-if="tab.count" :class="['ml-2 px-2 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600']">
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
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- View Toggle -->
            <div class="flex items-center space-x-2">
              <button 
                @click="viewMode = 'list'" 
                :class="['p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'calendar'" 
                :class="['p-2 rounded-lg transition-colors', viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <!-- Export -->
            <button @click="exportBookings" class="btn-primary mr-2">
              <!-- <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg> -->
              Export
            </button>

            <!-- Settings -->
           
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
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 shadow-card animate-pulse">
            <div class="flex space-x-4">
              <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List -->
        <div v-else-if="filteredBookings.length > 0" class="space-y-6">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking.id"
            class="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow"
          >
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <!-- Space Image and Info -->
              <div class="flex space-x-4 flex-1">
                <img 
                  :src="booking.space.image" 
                  :alt="booking.space.name"
                  class="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  @click="viewSpaceDetails(booking.space.id)"
                >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ booking.space.name }}</h3>
                    <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusClass(booking.status)]">
                      {{ booking.status }}
                    </span>
                  </div>
                  <div class="flex items-center text-gray-600 mb-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ booking.space.location }}
                  </div>
                  <div class="flex items-center text-gray-600 mb-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(booking.date) }} • {{ formatDuration(booking.duration) }}
                  </div>
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ formatSpaceType(booking.spaceType) }} • {{ booking.guests }} guest{{ booking.guests > 1 ? 's' : '' }}
                  </div>
                  <div class="mt-2 flex flex-col gap-1">
                    <span class="text-sm text-gray-500">Booking #{{ booking.id }}</span>
                    <span v-if="booking.dateChanged" class="inline-block text-xs bg-purple-100 text-purple-700 rounded px-2 py-0.5 mt-1 font-medium">
                      Date already changed
                    </span>
                  </div>
                </div>
              </div>

              <!-- Price and Actions -->
              <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:gap-2">
                <div class="text-right">
                  <div class="text-xl font-bold text-gray-900">${{ booking.totalAmount }}</div>
                  <div class="text-sm text-gray-600">Total paid</div>
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
                    class="text-sm px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Receipt
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed' && canChangeDate(booking)"
                    @click="changeDateModal(booking)"
                    class="text-sm px-3 py-1 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Change Date
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed' && canCancel(booking)"
                    @click="cancelBooking(booking)"
                    class="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    v-if="booking.status === 'Confirmed'"
                    @click="rebookSpace(booking)"
                    class="text-sm px-3 py-1 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Rebook
                  </button>

                  <button
                    v-if="booking.status === 'Completed' && !booking.hasReview"
                    @click="rateAndReview(booking)"
                    class="text-sm px-3 py-1 border border-yellow-300 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
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
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ getEmptyStateTitle() }}</h3>
          <p class="text-gray-600 mb-4">{{ getEmptyStateDescription() }}</p>
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
      <div @click.stop class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Booking Details</h2>
          <button @click="selectedBooking = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Space Info -->
          <div class="flex space-x-4">
            <img :src="selectedBooking.space.image" :alt="selectedBooking.space.name" class="w-24 h-24 rounded-lg object-cover">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedBooking.space.name }}</h3>
              <p class="text-gray-600">{{ selectedBooking.space.location }}</p>
              <div class="flex items-center mt-2">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" :class="['w-4 h-4', star <= selectedBooking.space.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-sm text-gray-600">{{ selectedBooking.space.rating }}</span>
              </div>
            </div>
          </div>
          
          <!-- Booking Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Booking ID</label>
              <p class="text-gray-900">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p :class="['font-medium', getStatusColor(selectedBooking.status)]">{{ selectedBooking.status }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Date</label>
              <p class="text-gray-900">{{ formatDate(selectedBooking.date) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Duration</label>
              <p class="text-gray-900">{{ formatDuration(selectedBooking.duration) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Space Type</label>
              <p class="text-gray-900">{{ formatSpaceType(selectedBooking.spaceType) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Guests</label>
              <p class="text-gray-900">{{ selectedBooking.guests }}</p>
            </div>
          </div>
          
          <!-- Price Breakdown -->
          <div class="border-t pt-4">
            <h4 class="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Base Price</span>
                <span>${{ selectedBooking.basePrice }}</span>
              </div>
              <div v-if="selectedBooking.extraFees > 0" class="flex justify-between">
                <span class="text-gray-600">Extra Fees</span>
                <span>${{ selectedBooking.extraFees }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Service Fee</span>
                <span>${{ selectedBooking.serviceFee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Taxes</span>
                <span>${{ selectedBooking.taxes }}</span>
              </div>
              <hr class="my-2">
              <div class="flex justify-between font-semibold">
                <span>Total</span>
                <span>${{ selectedBooking.totalAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Change Modal -->
    <div v-if="showDateChangeModal" @click="showDateChangeModal = false" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white rounded-xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Change Booking Date</h2>
          <button @click="showDateChangeModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-gray-600 mb-2">Current date: {{ formatDate(bookingToChange?.date || '') }}</p>
          <label class="block text-sm font-medium text-gray-700 mb-2">New Date</label>
          <input
            v-model="newDate"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            class="input-field"
          >
          <p class="text-xs text-gray-500 mt-1">Note: Date changes are subject to availability and may incur additional fees.</p>
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
      <div @click.stop class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Profile Settings</h2>
          <button @click="showProfileModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" value="Demo" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" value="User" class="input-field">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value="demo@workspace.com" class="input-field">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" value="(555) 123-4567" class="input-field">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
            <input type="text" placeholder="Your company name" class="input-field">
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
      <div @click.stop class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Manage Payment Cards</h2>
          <button @click="showCardsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Existing Cards -->
        <div class="space-y-4 mb-6">
          <h3 class="font-medium text-gray-900">Saved Cards</h3>

          <!-- Sample Card -->
          <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">
                VISA
              </div>
              <div>
                <p class="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p class="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
              <button class="text-red-600 hover:text-red-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Card -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="font-medium text-gray-900 mb-4">Add New Card</h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" class="input-field">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                <input type="text" placeholder="MM/YY" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text" placeholder="123" class="input-field">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <input type="text" placeholder="Full name on card" class="input-field">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookingCalendar from '../components/BookingCalendar.vue'

const router = useRouter()

// Component state
const loading = ref(true)
const activeTab = ref('upcoming')
const viewMode = ref<'list' | 'calendar'>('list')
const searchQuery = ref('')
const selectedBooking = ref<any>(null)
const showProfileMenu = ref(false)
const showDateChangeModal = ref(false)
const showProfileModal = ref(false)
const showCardsModal = ref(false)
const bookingToChange = ref<any>(null)
const newDate = ref('')

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

// Sample bookings data
const allBookings = ref([
  {
    id: 'WS12345678',
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
      name: 'The Innovation Hub',
      location: 'Downtown, San Francisco',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'WS12345679',
    status: 'Confirmed' as 'Confirmed' | 'Completed' | 'Cancelled',
    date: '2024-12-22',
    duration: 'weekly',
    spaceType: 'private-office',
    guests: 4,
    totalAmount: 520,
    basePrice: 450,
    extraFees: 15,
    serviceFee: 47,
    taxes: 8,
    hasReview: false,
    dateChanged: false,
    space: {
      id: 2,
      name: 'Creative Commons',
      location: 'SOMA, San Francisco',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'WS12345680',
    status: 'Confirmed' as 'Confirmed' | 'Completed' | 'Cancelled',
    date: '2024-12-25',
    duration: 'daily',
    spaceType: 'meeting-room',
    guests: 8,
    totalAmount: 165,
    basePrice: 120,
    extraFees: 35,
    serviceFee: 16,
    taxes: 4,
    hasReview: false,
    dateChanged: false,
    space: {
      id: 3,
      name: 'Tech Valley Workspace',
      location: 'Palo Alto, CA',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'WS12345677',
    status: 'Completed' as 'Confirmed' | 'Completed' | 'Cancelled',
    date: '2024-12-15',
    duration: 'daily',
    spaceType: 'dedicated-desk',
    guests: 1,
    totalAmount: 95,
    basePrice: 75,
    extraFees: 0,
    serviceFee: 8,
    taxes: 12,
    hasReview: true,
    dateChanged: false,
    space: {
      id: 4,
      name: 'The Productivity Lab',
      location: 'Mission Bay, SF',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'WS12345676',
    status: 'Completed' as 'Confirmed' | 'Completed' | 'Cancelled',
    date: '2024-12-10',
    duration: 'daily',
    spaceType: 'hot-desk',
    guests: 1,
    totalAmount: 75,
    basePrice: 55,
    extraFees: 0,
    serviceFee: 6,
    taxes: 14,
    hasReview: false,
    dateChanged: false,
    space: {
      id: 5,
      name: 'Startup Central',
      location: 'South Beach, SF',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  },
  {
    id: 'WS12345675',
    status: 'Cancelled' as 'Confirmed' | 'Completed' | 'Cancelled',
    date: '2024-12-08',
    duration: 'daily',
    spaceType: 'private-office',
    guests: 2,
    totalAmount: 95,
    basePrice: 75,
    extraFees: 5,
    serviceFee: 8,
    taxes: 7,
    hasReview: false,
    dateChanged: false,
    space: {
      id: 6,
      name: 'Executive Suites',
      location: 'Financial District, SF',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  }
])

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

const canCancel = (booking: any) => {
  const bookingDate = new Date(booking.date)
  const now = new Date()
  const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursDiff > 24
}

const viewBookingDetails = (booking: any) => {
  selectedBooking.value = booking
}

const viewSpaceDetails = (spaceId: number) => {
  router.push(`/space/${spaceId}`)
}

const cancelBooking = (booking: any) => {
  if (confirm('Are you sure you want to cancel this booking? You may be eligible for a refund according to our cancellation policy.')) {
    booking.status = 'Cancelled'
    alert('Booking cancelled successfully.')
  }
}

const rebookSpace = (booking: any) => {
  router.push({
    name: 'SpaceDetails',
    params: { id: booking.space.id }
  })
}

const rateAndReview = (booking: any) => {
  alert('Rating and review functionality will be implemented in the next phase.')
  booking.hasReview = true
}

const getDirections = (booking: any) => {
  const address = encodeURIComponent(booking.space.location)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const exportBookings = () => {
  // Generate CSV data
  const csvData = filteredBookings.value.map(booking => ({
    'Booking ID': booking.id,
    'Space Name': booking.space.name,
    'Location': booking.space.location,
    'Date': booking.date,
    'Duration': formatDuration(booking.duration),
    'Space Type': formatSpaceType(booking.spaceType),
    'Status': booking.status,
    'Total Amount': `$${booking.totalAmount}`,
    'Guests': booking.guests
  }))

  // Convert to CSV string
  const headers = Object.keys(csvData[0] || {})
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
  ].join('\n')

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const downloadReceipt = async (booking: any) => {
  try {
    const { generatePDFReceipt } = await import('../utils/pdfReceipt')
    await generatePDFReceipt(booking)
  } catch (error) {
    console.error('Error generating PDF receipt:', error)
    // Fallback to text receipt
    const receiptContent = `
      RECEIPT
      -------
      Booking ID: ${booking.id}
      Space: ${booking.space.name}
      Location: ${booking.space.location}
      Date: ${formatDate(booking.date)}
      Duration: ${formatDuration(booking.duration)}
      Space Type: ${formatSpaceType(booking.spaceType)}
      Guests: ${booking.guests}

      PRICING:
      Base Price: $${booking.basePrice}
      Extra Fees: $${booking.extraFees}
      Service Fee: $${booking.serviceFee}
      Taxes: $${booking.taxes}
      --------
      Total: $${booking.totalAmount}

      Status: ${booking.status}
      Generated: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${booking.id}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

const canChangeDate = (booking: any) => {
  const bookingDate = new Date(booking.date)
  const now = new Date()
  const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  // Only allow if more than 48 hours away and date hasn't been changed yet
  return hoursDiff > 48 && !booking.dateChanged
}

const changeDateModal = (booking: any) => {
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

const openProfileModal = () => {
  showProfileMenu.value = false
  showProfileModal.value = true
}

const openCardsModal = () => {
  showProfileMenu.value = false
  showCardsModal.value = true
}

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('workspace_user')
    // Clear any session booking data
    sessionStorage.removeItem('bookingDetails')
    sessionStorage.removeItem('bookingConfirmation')
    router.push({ name: 'Home' })
  }
  showProfileMenu.value = false
}

// Add any new bookings from session storage
const addSessionBookings = () => {
  const confirmation = sessionStorage.getItem('bookingConfirmation')
  if (confirmation) {
    try {
      const confirmationData = JSON.parse(confirmation)
      const newBooking = {
        id: confirmationData.bookingId || 'WS' + Date.now().toString().slice(-8),
        status: 'Confirmed' as 'Confirmed' | 'Completed' | 'Cancelled',
        date: confirmationData.booking?.date || confirmationData.startDate || new Date().toISOString().split('T')[0],
        duration: confirmationData.productType === 'meeting-room' ? 'hourly' : 'monthly',
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
          image: confirmationData.space?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      }

      // Add to beginning of bookings if not already exists
      const exists = allBookings.value.find(b => b.id === newBooking.id)
      if (!exists) {
        allBookings.value.unshift(newBooking)
        stats.value.totalBookings = allBookings.value.length
        stats.value.upcomingBookings = allBookings.value.filter(b =>
          b.status === 'Confirmed' && new Date(b.date) >= new Date()).length
      }
    } catch (error) {
      console.log('Error parsing booking confirmation:', error)
    }
  }
}

// Initialize
onMounted(() => {
  // Add any session bookings first
  addSessionBookings()

  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>
