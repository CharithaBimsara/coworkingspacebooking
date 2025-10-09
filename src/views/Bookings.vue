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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Bookings Card -->
        <div class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] active:translate-y-0" @click="() => showBookingsTab()">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-14 h-14 bg-primary/15 dark:bg-primary/20 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{{ stats.totalBookings }}</p>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Bookings</p>
                <div class="flex gap-3 mt-1">
                  <span class="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full cursor-pointer" @click.stop="() => showBookingsTab('upcoming')">{{ stats.upcomingBookings }} upcoming</span>
                  <span class="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full cursor-pointer" @click.stop="() => showBookingsTab('cancelled')">{{ stats.cancelledBookings }} cancelled</span>
                </div>
              </div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <!-- Subscription Card -->
        <div class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] active:translate-y-0" @click="() => showSubscriptionsTab()">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-14 h-14 bg-primary/12 dark:bg-primary/18 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 flex-1">
                <p class="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{{ stats.totalSubscriptions }}</p>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Subscriptions</p>
                <div class="flex gap-3 mt-1">
                  <span class="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full cursor-pointer" @click.stop="() => showSubscriptionsTab('active')">{{ stats.activeSubscriptions }} active</span>
                  <span class="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full cursor-pointer" @click.stop="() => showSubscriptionsTab('cancelled')">{{ stats.cancelledSubscriptions }} cancelled</span>
                </div>
                <p v-if="loadingSubscriptions" class="text-xs text-primary dark:text-primary mt-1 transition-colors duration-300">Loading...</p>
              </div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      <div v-if="!showSubscriptions" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-200 dark:border-gray-700 mb-8">
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
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="showSubscriptions">
        <!-- Subscriptions Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Subscriptions</h2>
              
              <!-- Subscription Tabs -->
              <div class="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button 
                  v-for="tab in subscriptionTabs" 
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
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loadingSubscriptions" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Loading subscriptions...</p>
          </div>

          <!-- Subscriptions List -->
          <div v-else-if="filteredSubscriptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div 
              v-for="subscription in filteredSubscriptions" 
              :key="subscription.booking_product_id"
              class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <!-- Card Header with Gradient -->
              <div class="bg-gradient-to-r from-primary/10 to-purple-50 dark:from-primary/20 dark:to-purple-900/20 p-5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ subscription.product_name }}</h3>
                      <div class="flex items-center gap-2">
                        <span :class="['inline-flex px-2 py-0.5 text-xs font-semibold rounded-full', getSubscriptionStatusClass(subscription.status)]">
                          {{ subscription.status }}
                        </span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ subscription.location_name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div class="text-2xl font-bold text-primary">{{ formatCurrency(subscription.total_price) }}</div>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Total amount</p>
                  </div>
                </div>
              </div>
              
              <!-- Subscription Period -->
              <div class="p-5 bg-white dark:bg-gray-800">
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex-1">
                    <!-- Date Timeline -->
                    <div class="relative pb-5">
                      <!-- Start Date -->
                      <div class="flex items-center mb-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Start Date</p>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(subscription.subscription_start_date) }}</p>
                        </div>
                      </div>
                      
                      <!-- Connecting Line -->
                      <div class="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-green-500 to-amber-500 transform -translate-x-1/2"></div>
                      
                      <!-- End Date -->
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mr-3">
                          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">End Date</p>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(subscription.subscription_end_date) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  
                    <!-- Package Info -->
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 ">
                      <div class="mb-1">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Package Type</p>
                        <p class="text-base font-semibold text-gray-900 dark:text-white capitalize flex items-center">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {{ subscription.package_type }}
                        </p>
                      </div>   
                    </div>
                
                </div>

               
                
                <!-- Payment Details -->
                <div class="mt-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Payment Information
                  </h4>
                  
                  <div class="space-y-2">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Monthly Rate</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(getMonthlyRate(subscription)) }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getDurationInMonths(subscription) }} month(s)</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2">
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">Total Amount</span>
                      <span class="text-sm font-bold text-primary">{{ formatCurrency(subscription.total_price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <svg class="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated: {{ new Date().toLocaleDateString() }}
                </div>
                
                <div class="flex gap-2">
                  <button 
                    @click="downloadSubscriptionReceipt(subscription)"
                    class="text-xs px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Receipt
                  </button>
                  
                  <button 
                    v-if="subscription.status === 'CONFIRMED'" 
                    @click="cancelSubscription(subscription)"
                    class="text-xs px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ activeTab === 'active' ? 'No Active Subscriptions' : 
                 activeTab === 'cancelled' ? 'No Cancelled Subscriptions' : 
                 'No Subscriptions Found' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ activeTab === 'active' ? 'You don\'t have any active subscriptions at the moment.' : 
                 activeTab === 'cancelled' ? 'You don\'t have any cancelled subscriptions.' : 
                 'No subscriptions match your current filters.' }}
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="viewMode === 'list'">
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
        <div v-if="filteredBookings.length > 0 && viewMode === 'list'" class="space-y-6">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking.id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <!-- Booking Header -->
            <div class="p-5 border-b border-gray-100 dark:border-gray-700">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <!-- Booking Info -->
                <div class="flex items-center gap-4">
                  <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-3">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Order Number {{ booking.paymentId }}</h3>
                      <span :class="['px-3 py-0.5 rounded-full text-xs font-medium', getStatusClass(booking.status)]">
                        {{ booking.status }}
                        <span v-if="booking.partialCancellation" class="ml-1">(Partially Cancelled)</span>
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDate(booking.date) }}
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                <!-- Price -->
                <div class="flex items-center gap-4 ml-auto">
                  <div class="text-right">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(booking.totalAmount) }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Total amount</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Products Section -->
            <div v-if="booking.apiData && booking.apiData.products && booking.apiData.products.length > 0" class="bg-gray-50 dark:bg-gray-800/60">
              <div v-for="(product, index) in booking.apiData.products" :key="product.product_id" 
                class="flex flex-col md:flex-row p-4 gap-4 border-b border-gray-100 dark:border-gray-700/50"><!-- @ts-ignore -->
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img 
                    :src="getProductImageUrl(product.product_image)" 
                    :alt="product.product_name"
                    class="w-16 h-16 rounded-lg object-cover shadow-sm"
                    @error="handleImageError"
                  >
                </div>
                
                <!-- Product Details -->
                <div class="flex-grow">
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ product.product_name }}</h4>
                      
                      <!-- Product Type Badge -->
                      <span 
                        v-if="(product as any).product_type" 
                        :class="[
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          {
                            'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400': (product as any).product_type === 'HotDesk',
                            'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400': (product as any).product_type === 'DedicatedDesk',
                            'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400': (product as any).product_type === 'MeetingRoom',
                            'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400': !['HotDesk', 'DedicatedDesk', 'MeetingRoom'].includes((product as any).product_type)
                          }
                        ]">
                        {{ formatProductType((product as any).product_type) }}
                      </span>
                      
                      <!-- Status Badge -->
                      <span 
                        :class="{
                          'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400': !isProductCancelled(product),
                          'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400': isProductCancelled(product)
                        }" 
                        class="px-2 py-0.5 rounded text-xs font-medium">
                        {{ isProductCancelled(product) ? 'Cancelled' : 'Confirmed' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ product.location_name }}
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatDate(product.booking_date) }}
                    </div>
                    <div v-if="product.start_time && product.end_time && product.start_time !== '00:00:00'" class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatTimeOnly(product.start_time) }} - {{ formatTimeOnly(product.end_time) }}
                    </div>
                    <div v-if="(product as Product)?.package_type" class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {{ ((product as any)?.package_type || '')?.charAt(0).toUpperCase() + ((product as any)?.package_type || '')?.slice(1) }} Package
                    </div>
                    <div v-if="(product as any)?.subscription_start_date && (product as any)?.subscription_end_date" class="flex items-center text-gray-600 dark:text-gray-400 md:col-span-2">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Subscription: {{ formatDate((product as any)?.subscription_start_date || '') }} - {{ formatDate((product as any)?.subscription_end_date || '') }}
                    </div>
                  </div>
                  
                  <!-- Price Breakdown -->
                  <div class="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Price Breakdown</h5>
                    
                    <div class="space-y-1.5 text-sm">
                      <!-- Base Price -->
                      <div class="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>Base Price:</span>
                        <span>{{ formatCurrency(product.price) }}</span>
                      </div>
                      
                      <!-- Facilities List -->
                      <div v-if="product.facilities && product.facilities.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-1.5 mt-1.5">
                        <div v-for="facility in product.facilities" :key="facility.facility_id" class="flex justify-between text-gray-600 dark:text-gray-400 text-xs">
                          <span>{{ facility.facility_name }}:</span>
                          <span>{{ formatCurrency(facility.price) }}</span>
                        </div>
                      </div>
                      
                      <!-- Product Total -->
                      <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1.5 font-medium flex justify-between text-gray-900 dark:text-white">
                        <span>Product Total:</span>
                        <span>{{ formatCurrency(calculateProductTotal(product)) }}</span>
                      </div>
                    </div>
                  </div>
                  
               
                  
                  <!-- Product Action Buttons (Change Date, Cancel, Rebook, and Review) -->
                  <div v-if="booking.status === 'Confirmed'" class="mt-3 flex gap-2 flex-wrap">
                    <!-- Change Date Button - Show only for MeetingRoom and HotDesk product types that are updatable -->
                    <button 
                      v-if="product.is_updatable && !product.is_onetime_changed && !isProductCancelled(product) && isReschedulableProductType(product)"
                      @click="changeDateModal(booking, product)"
                      class="text-xs px-2 py-1 border border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Date
                    </button>
                    
                    <!-- Rebook Button -->
                    <button 
                      @click="rebookProduct(booking, product)"
                      class="text-xs px-2 py-1 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Rebook
                    </button>
                    
                    <!-- Cancel Button -->
                    <button 
                      v-if="!isProductCancelled(product)"
                      @click="cancelProduct(booking, product)"
                      class="text-xs px-2 py-1 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    
                    <!-- Cancelled Status Message -->
                    <div v-if="isProductCancelled(product)" class="text-xs text-red-600 dark:text-red-400 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cancelled
                    </div>
                  </div>
                  
                  <!-- Product Actions for Completed/Past Bookings -->
                  <div v-else-if="booking.status === 'Completed' && !isProductCancelled(product)" class="mt-3 flex gap-2 flex-wrap">
                    <!-- Rate & Review Button -->
                    <button 
                      @click="rateAndReviewProduct(booking, product)"
                      class="text-xs px-2 py-1 border border-yellow-300 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Rate & Review
                    </button>
                    
                    <!-- Rebook Button -->
                    <button 
                      @click="rebookProduct(booking, product)"
                      class="text-xs px-2 py-1 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Rebook
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Booking Total Summary -->
              <div class="bg-gray-100 dark:bg-gray-700/60 p-4 rounded-b-lg">
                <div class="max-w-md ml-auto">
                  <div class="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>Products Subtotal ({{ booking.apiData.products.length }} item{{ booking.apiData.products.length > 1 ? 's' : '' }}):</span>
                    <span>{{ formatCurrency(calculateBookingProductsTotal(booking)) }}</span>
                  </div>
                  
                  <div class="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                    <span>Facilities Total:</span>
                    <span>{{ formatCurrency(calculateBookingFacilitiesTotal(booking)) }}</span>
                  </div>
                  
                  <div class="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 mt-2 pt-2">
                    <span>Order Total:</span>
                    <span>{{ formatCurrency(booking.apiData.total_price) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Fallback for old data structure -->
            <div v-else class="p-4 flex items-center gap-4">
              <div class="flex-shrink-0">
                <img 
                  :src="booking.space.image" 
                  :alt="booking.space.name"
                  class="w-16 h-16 rounded-lg object-cover"
                  @error="handleImageError"
                >
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ booking.space.name }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ booking.space.location }}
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ formatSpaceType(booking.spaceType) }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Booking Actions -->
            <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-end">
              <button
                @click="downloadReceipt(booking)"
                class="text-sm px-3 py-1 border border-primary/30 dark:border-primary/40 text-primary dark:text-primary/80 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
              >
                <svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Receipt
              </button>

              <button
                v-if="booking.status === 'Completed' && !booking.hasReview"
                @click="rateAndReview(booking)"
                class="text-sm px-3 py-1 border border-yellow-300 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
              >
                <svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rate & Review
              </button>
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
          <template v-if="isMeetingRoomProduct">
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
                <p v-if="dateError" class="text-xs text-red-500 mt-1 font-medium">{{ dateError }}</p>
              </div>
              
              <!-- Closed day warning for meeting rooms -->
              <div v-if="newDateRange && isSelectedDateClosed" class="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <div class="flex items-center text-amber-800 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="text-sm font-medium">Sorry, we're closed on this day</span>
                </div>
                <p class="text-xs text-amber-700 dark:text-amber-500 mt-1 ml-7">
                  Please select a different date when we're open.
                  <button @click="showWorkingHoursModal = true" class="text-amber-900 dark:text-amber-300 underline hover:text-amber-950 dark:hover:text-amber-200 font-medium ml-1">
                    See working days
                  </button>
                </p>
              </div>
              
              <div v-else-if="newDateRange" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time Range</label>
                <CustomTimeRangePicker
                  v-model="newTimeRange"
                  label=""
                  :disabled-start-times="disabledTimes.start"
                  :disabled-end-times="disabledTimes.end"
                  :loading="loadingAvailability"
                  :operating-start-time="operatingHours.start"
                  :operating-end-time="operatingHours.end"
                  @start-time-change="onStartTimeChange"
                  @end-time-change="validateDuration"
                  class="w-full"
                />
                <p v-if="timeError" class="text-xs text-red-500 mt-1 font-medium">{{ timeError }}</p>
                <p v-if="durationError" class="text-xs text-red-500 mt-1 font-medium">{{ durationError }}</p>
                <p v-if="currentBookingDuration > 0 && !durationError" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Your current booking duration: {{ currentBookingDuration / 60 }} hour(s). Please select the same duration.
                </p>
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
              <p v-if="dateError" class="text-xs text-red-500 mt-1 font-medium">{{ dateError }}</p>
              
              <!-- Closed day warning for hot desks -->
              <div v-if="newDateRange && isSelectedDateClosed" class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <div class="flex items-center text-amber-800 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="text-sm font-medium">Sorry, we're closed on this day</span>
                </div>
                <p class="text-xs text-amber-700 dark:text-amber-500 mt-1 ml-7">
                  Please select a different date when we're open.
                  <button @click="showWorkingHoursModal = true" class="text-amber-900 dark:text-amber-300 underline hover:text-amber-950 dark:hover:text-amber-200 font-medium ml-1">
                    See working days
                  </button>
                </p>
              </div>
              
              <div v-else-if="loadingAvailability" class="mt-2">
                <div class="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Checking availability...</p>
              </div>
              
              <!-- General error message is now handled by specific error fields -->
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
            :disabled="loadingAvailability || 
                      isSelectedDateClosed || 
                      !!durationError || 
                      !newDateRange || 
                      (isMeetingRoomProduct && (!newTimeRange.start || !newTimeRange.end)) ||
                      !!dateError || !!timeError"
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
              <div class="w-10 h-6 bg-gradient-to-r from-primary to-primary/80 rounded text-white flex items-center justify-center text-xs font-bold">
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
      :isSingleProduct="productIdToCancel !== null"
      @close="showCancelModal = false"
      @confirm="confirmCancelBooking"
    />

    <!-- Subscription Details Modal -->
    <div v-if="selectedSubscription" @click="closeSubscriptionModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <!-- Header with gradient background -->
        <div class="relative bg-gradient-to-br from-primary/10 via-primary/5 to-purple-50 dark:from-primary/20 dark:via-primary/10 dark:to-purple-900/20 p-8 pb-6">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Subscription Details</h1>
                <p class="text-primary font-medium">{{ selectedSubscription.location_name }}</p>
              </div>
            </div>
            <button @click="closeSubscriptionModal" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div v-if="selectedSubscription" class="space-y-8">
            <!-- Product Name Card -->
            <div class="bg-gradient-to-r from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-900/10 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedSubscription.product_name }}</h2>
                    <p class="text-gray-600 dark:text-gray-400">{{ selectedSubscription.location_name }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-primary mb-1">{{ formatCurrency(selectedSubscription.total_price) }}</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                </div>
              </div>
            </div>

            <!-- Key Information Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Package Type -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Package Type</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white capitalize">{{ selectedSubscription?.package_type }}</p>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <span :class="['inline-flex px-3 py-1 text-sm font-bold rounded-full', getSubscriptionStatusClass(selectedSubscription.status)]">
                      {{ selectedSubscription.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Duration -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ calculateDurationDays(selectedSubscription?.subscription_start_date || '', selectedSubscription?.subscription_end_date || '') }} days</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date Information -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Subscription Period
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(selectedSubscription?.subscription_start_date || '') }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(selectedSubscription?.subscription_end_date || '') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Price Breakdown
              </h3>
              
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Base Price Calculation -->
                <div class="space-y-4">
                  <!-- Monthly Rate -->
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rate</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Base price per month</p>
                    </div>
                    <div class="text-right">
                      <p class="text-base font-semibold text-gray-900 dark:text-white">{{ formatCurrency(getMonthlyRate(selectedSubscription)) }}</p>
                    </div>
                  </div>
                  
                  <!-- Subscription Duration -->
                  <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Period</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ getSubscriptionPeriod(selectedSubscription) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ getDurationInMonths(selectedSubscription) }} month(s)</p>
                    </div>
                  </div>
                  
                  <!-- Total Amount -->
                  <div class="flex justify-between items-center pt-2">
                    <div>
                      <p class="text-base font-bold text-gray-800 dark:text-gray-200">Total Amount</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">For the entire subscription period</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xl font-bold text-primary">{{ formatCurrency(selectedSubscription.total_price) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Subscription Benefits -->
              <div class="mt-6">
                <h4 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Subscription Benefits</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                    <div class="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Dedicated workspace</span>
                  </div>
                  <div class="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                    <div class="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">High-speed internet</span>
                  </div>
                  <div class="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                    <div class="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Meeting room credits</span>
                  </div>
                  <div class="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                    <div class="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">24/7 support</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button @click="closeSubscriptionModal" class="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Working Hours Modal -->
    <div v-if="showWorkingHoursModal" @click="showWorkingHoursModal = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300">
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Working Hours</h2>
                <p class="text-xs text-gray-600 dark:text-gray-400">Our weekly schedule</p>
              </div>
            </div>
            <button @click="showWorkingHoursModal = false" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <!-- Days Grid (Horizontal) -->
          <div class="grid grid-cols-7 gap-2 mb-4">
            <div 
              v-for="schedule in operationSchedule" 
              :key="schedule.day"
              class="flex flex-col items-center p-3 rounded-xl border transition-all duration-200 hover:shadow-md"
              :class="{
                'bg-gradient-to-b from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-700': schedule.is_enabled,
                'bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-600/20 border-gray-200 dark:border-gray-600': !schedule.is_enabled
              }"
            >
              <!-- Day Name -->
              <div class="text-center mb-2">
                <span 
                  class="text-sm font-bold block"
                  :class="{
                    'text-green-800 dark:text-green-300': schedule.is_enabled,
                    'text-gray-600 dark:text-gray-400': !schedule.is_enabled
                  }"
                >
                  {{ schedule.day.substring(0, 3) }}
                </span>
                <span 
                  v-if="isToday(schedule.day)" 
                  class="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded-full mt-1 inline-block"
                >
                  Today
                </span>
              </div>

              <!-- Status Icon -->
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                :class="{
                  'bg-green-500 dark:bg-green-600': schedule.is_enabled,
                  'bg-gray-400 dark:bg-gray-500': !schedule.is_enabled
                }"
              >
                <svg v-if="schedule.is_enabled" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <!-- Time or Closed -->
              <div class="text-center">
                <p 
                  v-if="schedule.is_enabled && schedule.start_time" 
                  class="text-[10px] text-green-700 dark:text-green-400 font-medium leading-tight"
                >
                  {{ formatTime12Hour(schedule.start_time) }}
                </p>
                <p 
                  v-if="schedule.is_enabled && schedule.end_time" 
                  class="text-[10px] text-green-700 dark:text-green-400 font-medium leading-tight"
                >
                  {{ formatTime12Hour(schedule.end_time) }}
                </p>
                <p 
                  v-else-if="!schedule.is_enabled" 
                  class="text-xs text-gray-500 dark:text-gray-500 font-medium"
                >
                  Closed
                </p>
              </div>
            </div>
          </div>

          <!-- Info Note -->
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg mb-4">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-blue-800 dark:text-blue-300">
                Please select a date when we're open to proceed with your booking change.
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <button 
            @click="showWorkingHoursModal = false" 
            class="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
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
import { generatePDFReceipt, generatePDFFromData } from '../utils/pdfReceipt'
import SuccessOverlay from '../components/SuccessOverlay.vue'
import CancelBooking from '../components/CancelBooking.vue'
import { apiManager, type BookingData } from '../api/apiManager'
import { useAuthStore } from '../stores/auth'
import CustomTimeRangePicker from '../components/CustomTimeRangePicker.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import SingleDatePicker from '../components/SingleDatePicker.vue'
import { getTodayLocal, formatDateLocal } from '../utils/dateUtils'
import { formatPrice, formatCurrency } from '../utils/formatUtils'

// Define interfaces for type safety
interface Space {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
}

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  location_name: string;
  booking_date: string;
  start_time: string | null;
  end_time: string | null;
  product_image?: string;
  package_type?: string | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  is_cancelled?: boolean;
  is_onetime_changed?: boolean;
  is_updatable?: boolean;
  product_type?: 'HotDesk' | 'DedicatedDesk' | 'MeetingRoom' | string;
  facilities?: Array<{
    facility_id: number;
    facility_name: string | null;
    price: number;
  }>;
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
  hasReview: boolean;
  dateChanged: boolean;
  partialCancellation?: boolean; // Flag to indicate some products are cancelled but not all
  paymentId?: string;
  facilityIds?: number[];
  space: Space;
  start_time?: string;
  end_time?: string;
  productImages?: string[]; // Array of product images from API
  // Subscription-related properties
  package_type?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
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
const showDateChangeModal = ref(false)
const showProfileModal = ref(false)
const showCardsModal = ref(false)
const bookingToChange = ref<Booking | null>(null)
const productIdToChange = ref<number | null>(null)
const isMeetingRoomProduct = ref(false)
const newDate = ref('')
const newDateRange = ref<string | undefined>(undefined)
const newTimeRange = ref<{ start: string; end: string }>({ start: '', end: '' })
const bookedTimeSlots = ref<Array<{ startTime: string; endTime: string }>>([])
const disabledTimes = ref<{ start: string[]; end: string[] }>({ start: [], end: [] })
const operatingHours = ref<{ start: string; end: string }>({ start: '09:00', end: '18:00' })
const loadingAvailability = ref(false)
const dateError = ref('')
const timeError = ref('')
const availabilityError = ref('') // keep for backward compatibility
const operationSchedule = ref<Array<{
  day: string;
  is_enabled: boolean;
  start_time?: string;
  end_time?: string;
}>>([])
const isSelectedDateClosed = ref(false)
const showWorkingHoursModal = ref(false)
const currentBookingDuration = ref<number>(0) // Duration in minutes
const durationError = ref('')
const showSuccessOverlay = ref(false)
const successOverlayTitle = ref('')
const successOverlayMessage = ref('')
const showCancelModal = ref(false)
const bookingToCancel = ref<Booking | null>(null)
const productIdToCancel = ref<number | null>(null)
const isModalMaximized = ref(false)

// Subscription state
const subscriptions = ref<Array<{
  booking_product_id: number;
  booking_id: number;
  product_id: number;
  product_name: string;
  location_name: string;
  subscription_start_date: string;
  subscription_end_date: string;
  package_type: string;
  total_price: number;
  status: string;
}>>([])
const selectedSubscription = ref<any>(null)
const showSubscriptions = ref(false)
const loadingSubscriptions = ref(false)

// Stats
const stats = computed(() => ({
  totalBookings: allBookings.value.length,
  upcomingBookings: allBookings.value.filter(b => b.status === 'Confirmed' && new Date(b.date) >= new Date()).length,
  cancelledBookings: allBookings.value.filter(b => b.status === 'Cancelled' || ((b as any).products && (b as any).products.every((p: any) => p.is_cancelled === true))).length,
  pastBookings: allBookings.value.filter(b => b.status === 'Confirmed' && new Date(b.date) < new Date()).length,
  favoriteSpaces: 5,
  totalSpent: allBookings.value.reduce((sum, b) => sum + b.totalAmount, 0),
  
  // Subscription stats
  totalSubscriptions: subscriptions.value.length,
  activeSubscriptions: subscriptions.value.filter(sub => sub.status === 'CONFIRMED').length,
  cancelledSubscriptions: subscriptions.value.filter(sub => sub.status === 'CANCELLED').length
}))

// Tabs
const tabs = ref([
  { id: 'upcoming', name: 'Upcoming', count: 3 },
  { id: 'past', name: 'Past', count: 8 },
  { id: 'cancelled', name: 'Cancelled', count: 1 }
])

// Subscription Tabs
const subscriptionTabs = ref([
  { id: 'active', name: 'Active', count: 0 },
  { id: 'cancelled', name: 'Cancelled', count: 0 }
])

// Bookings data
const allBookings = ref<Booking[]>([])
const errorMessage = ref('')

// Function to transform API booking data to UI format
const transformBookingData = (booking: BookingData, status: 'Confirmed' | 'Completed' | 'Cancelled'): Booking => {
  // Check if all products in this booking are cancelled
  const areAllCancelled = booking.products && 
    booking.products.length > 0 && 
    booking.products.every(p => (p as any).is_cancelled === true);
  
  // If all products are cancelled, override the status to be 'Cancelled'
  const finalStatus = areAllCancelled ? 'Cancelled' : status;
  
  // Get the primary product from the products array
  const primaryProduct = booking.products && booking.products.length > 0 ? booking.products[0] : null;

  // Collect all product images from the API response
  const apiHost = getApiHost();
  const productImages = booking.products 
    ? booking.products
        .map(product => product.product_image)
        .filter((image): image is string => image !== undefined && image.trim() !== '')
        .map(image => {
          if (image.startsWith('http')) return image;
          return `${apiHost}${image}`;
        })
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
  const duration = calculateDuration(primaryProduct.start_time || undefined, primaryProduct.end_time || undefined);

  // We already checked if products are cancelled at the beginning
  // and stored the result in finalStatus
  
  // Check if some but not all products are cancelled
  const hasAnyCancelled = booking.products && 
    booking.products.some(p => (p as any).is_cancelled === true) && 
    !areAllCancelled;

  return {
    id: `BK${booking.booking_id}`,
    status: finalStatus,
    partialCancellation: hasAnyCancelled,
    date: primaryProduct.booking_date,
    duration: duration,
    spaceType: spaceType,
    guests: 1, // Default value, can be adjusted if API provides this information
    totalAmount: booking.total_price,
    basePrice: primaryProduct.price * 0.8, // Estimate if not provided
    extraFees: 0,
    hasReview: false,
    dateChanged: !!booking.is_onetime_changed,
    paymentId: booking.order_id,
    facilityIds: primaryProduct.facilities ? primaryProduct.facilities.map(f => f.facility_id) : [],
    start_time: primaryProduct.start_time || undefined,
    end_time: primaryProduct.end_time || undefined,
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
      apiManager.getUpcomingBookings(user.id),
      apiManager.getPastBookings(user.id),
      apiManager.getCanceledBookings(user.id)
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

// Update tab counts based on actual bookings and subscriptions
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
  
  // Update booking tabs with accurate counts
  tabs.value = [
    { id: 'upcoming', name: 'Upcoming', count: upcomingCount },
    { id: 'past', name: 'Past', count: pastCount },
    { id: 'cancelled', name: 'Cancelled', count: cancelledCount }
  ]
  
  // Update subscription tabs with accurate counts
  const activeSubscriptionsCount = subscriptions.value.filter(sub => 
    sub.status?.toLowerCase() === 'confirmed' || sub.status?.toLowerCase() === 'active'
  ).length;
  
  const cancelledSubscriptionsCount = subscriptions.value.filter(sub => 
    sub.status?.toLowerCase() === 'cancelled'
  ).length;
  
  subscriptionTabs.value = [
    { id: 'active', name: 'Active', count: activeSubscriptionsCount },
    { id: 'cancelled', name: 'Cancelled', count: cancelledSubscriptionsCount }
  ]
  
  // Stats are now computed automatically from reactive data
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
        return booking.status === 'Cancelled' || 
               ((booking as any).products && (booking as any).products.every((p: any) => p.is_cancelled === true))
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

// Filtered subscriptions based on active tab
const filteredSubscriptions = computed(() => {
  let filtered = subscriptions.value;
  
  // Filter based on active tab
  switch (activeTab.value) {
    case 'active':
      filtered = filtered.filter(sub => 
        sub.status?.toLowerCase() === 'confirmed' || 
        sub.status?.toLowerCase() === 'active'
      );
      break;
    case 'cancelled':
      filtered = filtered.filter(sub => 
        sub.status?.toLowerCase() === 'cancelled'
      );
      break;
    // Default case: show all subscriptions
  }
  
  // Apply search query if any
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(sub => 
      sub.product_name?.toLowerCase().includes(query) ||
      sub.location_name?.toLowerCase().includes(query) ||
      sub.package_type?.toLowerCase().includes(query)
    );
  }
  
  // Sort by start date (most recent first)
  return filtered.sort((a, b) => 
    new Date(b.subscription_start_date).getTime() - new Date(a.subscription_start_date).getTime()
  );
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
  
  try {
    // Create a date object using the time string (adding a dummy date)
    const date = new Date(`2000-01-01T${timeString}`);
    
    // Format the time in 12-hour format
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    // Fallback to simple formatting
    const time = timeString.split(':').slice(0, 2).join(':');
    return time;
  }
}

// Helper function to check if any product in the booking is a dedicated desk type
const hasDedicatedDeskProduct = (products: any[]): boolean => {
  if (!products || products.length === 0) return false;
  
  // Check if any product is a dedicated desk (typically full day booking or marked as dedicated)
  return products.some(product => {
    // Full day booking (00:00:00 start time) or dedicated desk type
    return product.start_time === '00:00:00' || 
           (product.space_type === 1 && product.is_full_day === true) || 
           product.is_dedicated_desk === true;
  });
};

// Helper function to check if all products in a booking are cancelled
const areAllProductsCancelled = (products: any[]): boolean => {
  if (!products || products.length === 0) return false;
  return products.every(product => (product as any).is_cancelled === true);
};

// Helper function to check if any products in a booking are cancelled
const hasAnyCancelledProducts = (products: any[]): boolean => {
  if (!products || products.length === 0) return false;
  return products.some(product => (product as any).is_cancelled === true);
};

// Helper function to check if a product is cancelled
const isProductCancelled = (product: any): boolean => {
  return product && (product.is_cancelled === true || product.status === 'cancelled');
};

// Format product type for display
const formatProductType = (type: string): string => {
  if (!type) return '';
  
  const typeMap: Record<string, string> = {
    'HotDesk': 'Hot Desk',
    'DedicatedDesk': 'Dedicated Desk',
    'MeetingRoom': 'Meeting Room'
  };
  
  return typeMap[type] || type.replace(/([A-Z])/g, ' $1').trim();
};

// Helper to identify if a product is MeetingRoom or HotDesk based on API response structure
const isReschedulableProductType = (product: any): boolean => {
  // MeetingRoom products have both start_time and end_time on the same day
  if (product.start_time && product.end_time) {
    return true; // This is a MeetingRoom
  }
  
  // HotDesk products have booking_date but no subscription dates
  if (product.booking_date && !product.subscription_start_date) {
    return true; // This is a HotDesk
  }
  
  // If it has subscription dates, it's a DedicatedDesk or another subscription product
  if (product.subscription_start_date) {
    return false;
  }
  
  // For explicit check if product_type field is available
  if (product.product_type) {
    return product.product_type === 'MeetingRoom' || product.product_type === 'HotDesk';
  }
  
  return false;
};

// Calculate total price for a product including all facilities
const calculateProductTotal = (product: any): number => {
  if (!product) return 0;
  
  // Start with the base price
  let total = parseFloat(product.price) || 0;
  
  // Add all facility prices
  if (product.facilities && product.facilities.length > 0) {
    product.facilities.forEach((facility: any) => {
      if (facility.price) {
        total += parseFloat(facility.price) || 0;
      }
    });
  }
  
  return total;
};

// Calculate subtotal of just product base prices in a booking (excluding facilities)
const calculateBookingProductsTotal = (booking: any): number => {
  if (!booking?.apiData?.products) return 0;
  
  return booking.apiData.products.reduce((sum: number, product: any) => {
    return sum + (parseFloat(product.price) || 0);
  }, 0);
};

// Calculate total of just facilities in a booking
const calculateBookingFacilitiesTotal = (booking: any): number => {
  if (!booking?.apiData?.products) return 0;
  
  return booking.apiData.products.reduce((sum: number, product: any) => {
    if (!product.facilities || product.facilities.length === 0) return sum;
    
    const facilitiesSum = product.facilities.reduce((fSum: number, facility: any) => {
      return fSum + (parseFloat(facility.price) || 0);
    }, 0);
    
    return sum + facilitiesSum;
  }, 0);
};


const calculateDurationHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;

  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
}

const calculateDurationDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0); // Reset time to start of day

  const diffMs = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays); // Return 0 if subscription has ended
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
      return 'bg-primary/10 text-primary/90 dark:bg-primary/20 dark:text-primary/80'
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
      return 'bg-primary'
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
      return 'text-primary'
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



const viewSpaceDetails = (spaceId: number) => {
  router.push(`/space/${spaceId}`)
}



const cancelBooking = (booking: Booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const cancelSubscription = (subscription: any) => {
  // Create a booking-like object that works with existing cancel flow
  bookingToCancel.value = {
    id: `BK${subscription.booking_id}`,
    apiData: {
      products: [{
        product_id: subscription.product_id,
        product_name: subscription.product_name
      }]
    }
  } as unknown as Booking
  
  // Set the product ID to cancel
  productIdToCancel.value = subscription.product_id
  
  // Show the cancel modal
  showCancelModal.value = true
}

// Function to prepare for cancelling an individual product
const cancelProduct = (booking: Booking, product: any) => {
  // Store booking and product info for the confirmation
  bookingToCancel.value = booking
  productIdToCancel.value = product.product_id
  
  // Show cancel confirmation modal
  showCancelModal.value = true
}

const confirmCancelBooking = async () => {
  if (!bookingToCancel.value) return
  
  try {
    const bookingId = parseInt(bookingToCancel.value.id.replace('BK', ''))
    
    // Check if we're cancelling a single product or the whole booking
    if (productIdToCancel.value !== null) {
      // Cancel a single product
      const response = await apiManager.cancelBookingProduct(bookingId, productIdToCancel.value)
      
      if (response.success) {
        // Close the modal first
        showCancelModal.value = false
        
        // Find and update the cancelled product in the UI
        let productName = 'Selected product'
        
        // Update in apiData if available
        if (bookingToCancel.value.apiData && bookingToCancel.value.apiData.products) {
          const product = bookingToCancel.value.apiData.products.find((p: any) => p.product_id === productIdToCancel.value)
          if (product) {
            (product as any).is_cancelled = true
            productName = product.product_name
          }
        }
        

        
        // Show success message
        successOverlayTitle.value = 'Product Cancelled'
        successOverlayMessage.value = `${productName} has been successfully cancelled.`
        showSuccessOverlay.value = true
        
        // Check if all products are cancelled, then mark the entire booking as cancelled
        if (bookingToCancel.value.apiData && bookingToCancel.value.apiData.products) {
          const allCancelled = bookingToCancel.value.apiData.products.every((p: any) => isProductCancelled(p))
          if (allCancelled) {
            bookingToCancel.value.status = 'Cancelled'
          }
        }
      } else {
        alert(`Error: ${response.message || 'Failed to cancel product'}`)
      }
    } else {
      // Cancel the entire booking
      const response = await apiManager.cancelBooking(bookingId)
      
      if (response.success) {
        // Update the booking status in the UI
        bookingToCancel.value.status = 'Cancelled'
        showCancelModal.value = false
        
        // Show success message
        successOverlayTitle.value = 'Booking Cancelled'
        successOverlayMessage.value = 'Your booking has been successfully cancelled.'
        showSuccessOverlay.value = true
        
        // If we have apiData with products, update all products as cancelled
        if (bookingToCancel.value.apiData && bookingToCancel.value.apiData.products) {
          bookingToCancel.value.apiData.products.forEach((p: any) => {
            p.is_cancelled = true
          })
        }
        

      } else {
        alert(`Error: ${response.message}`)
      }
    }
    
    // Update the tabs count after cancellation in either case
    updateTabCounts()
    
    // Reset
    bookingToCancel.value = null
    productIdToCancel.value = null
  } catch (error) {
    console.error('Error during cancellation:', error)
    alert('An unexpected error occurred. Please try again.')
  }
}

// Rebook the entire booking
const rebookSpace = (booking: Booking) => {
  router.push({
    name: 'SpaceDetails',
    params: { id: booking.space.id }
  })
}

// Rebook a specific product
const rebookProduct = (booking: Booking, product: any) => {
  // If the product has a space_id, use that; otherwise use the booking's space id
  const spaceId = (product as any).space_id || (product as any).product_space_id || booking.space.id;
  
  // Navigate to the space details page with the product information
  router.push({
    name: 'SpaceDetails',
    params: { id: spaceId },
    query: {
      productId: product.product_id,
      productName: product.product_name,
      rebooking: 'true'
    }
  })
}

const rateAndReview = (booking: Booking) => {
  // Navigate to space details page with review dialog open
  router.push({
    name: 'SpaceDetails',
    params: { id: booking.space.id },
    query: {
      openReview: 'true',
      bookingId: booking.id
    }
  })
}

// Rate and review a specific product
const rateAndReviewProduct = (booking: Booking, product: any) => {
  // Navigate to space details page with review dialog open for specific product
  router.push({
    name: 'SpaceDetails',
    params: { id: product.product_id },
    query: {
      openReview: 'true',
      bookingId: booking.id,
      productId: product.product_id.toString(),
      productName: product.product_name
    }
  })
}

const getDirections = (booking: Booking) => {
  const address = encodeURIComponent(booking.space.location)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(mapsUrl, '_blank')
}

const downloadReceipt = async (booking: Booking) => {
  try {
    console.log('Generating receipt for booking:', booking.id, 'with payment ID:', booking.paymentId)
    
    // Always use API to get complete invoice with order_id
    if (booking.paymentId) {
      // Convert to string if it's a number
      const orderId = String(booking.paymentId)
      console.log('Calling generatePDFReceipt with order ID:', orderId)
      
      await generatePDFReceipt(orderId)
      return
    }

    // Fallback: if paymentId is not available, show error
    console.error('No order_id available for booking:', booking.id)
    alert('Could not generate PDF receipt. Order ID is missing.')
  } catch (error) {
    console.error('Failed to generate PDF receipt:', error)
    alert('Could not generate PDF receipt. Please try again later.')
  }
}

const downloadSubscriptionReceipt = async (subscription: any) => {
  try {
    console.log('Generating receipt for subscription:', subscription)
    
    // Generate receipt based on order_id from subscription
    if (subscription.order_id) {
      // Use the actual order_id provided in the subscription data
      const orderIdStr = subscription.order_id
      console.log('Calling generatePDFReceipt with order ID:', orderIdStr)
      
      await generatePDFReceipt(orderIdStr)
      return
    }

    // Fallback: if order_id is not available, show error
    console.error('No order_id available for subscription:', subscription)
    alert('Could not generate PDF receipt. Order ID is missing.')
  } catch (error) {
    console.error('Failed to generate subscription PDF receipt:', error)
    alert(`Could not generate PDF receipt: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

const canChangeDate = (booking: Booking) => {
  const bookingDate = new Date(booking.date)
  const now = new Date()
  const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  // Only allow if more than 48 hours away and date hasn't been changed yet
  return hoursDiff > 48 && !booking.dateChanged
}

const changeDateModal = async (booking: Booking, product?: any) => {
  bookingToChange.value = booking
  console.log('Opening change date modal for booking:', booking)
  console.log('Product to change:', product)
  console.log('Product details:', {
    product_id: product?.product_id,
    product_name: product?.product_name,
    booking_date: product?.booking_date,
    start_time: product?.start_time,
    end_time: product?.end_time
  })
  
  // Store the product ID if a specific product is being changed
  if (product) {
    // Store the product ID to use when saving changes
    productIdToChange.value = product.product_id
    console.log(`Setting product ID to change: ${product.product_id}`)
  } else {
    // If no specific product, we're changing the date for the entire booking
    productIdToChange.value = null
  }
  
  // Get the booking date from the product (more accurate than booking.date)
  const productDate = product?.booking_date || booking.date
  const bookingDate = new Date(productDate + 'T12:00:00') // Use noon to avoid timezone issues
  const normalizedDate = formatDateLocal(bookingDate)
  
  console.log('Normalized date:', normalizedDate)
  
  // Determine if this is a meeting room by explicitly checking product_type
  // Only show time pickers for MeetingRoom type, not for HotDesk or any other type
  const isMeetingRoom = product?.product_type === 'MeetingRoom'
  
  console.log('Is meeting room:', isMeetingRoom)
  
  // Set the isMeetingRoomProduct ref for use in the template
  isMeetingRoomProduct.value = isMeetingRoom
  
  // Calculate current booking duration for meeting rooms
  if (isMeetingRoom && product?.start_time && product?.end_time) {
    const startMinutes = timeToMinutes(product.start_time)
    const endMinutes = timeToMinutes(product.end_time)
    currentBookingDuration.value = endMinutes - startMinutes
    console.log(`Current booking duration: ${currentBookingDuration.value} minutes (${currentBookingDuration.value / 60} hours)`)
  } else {
    currentBookingDuration.value = 0
  }
  
  // Initialize based on product type
  if (isMeetingRoom) {
    // For meeting rooms (only product_type === 'MeetingRoom'), use time range picker
    newTimeRange.value = { start: '', end: '' }
    newDateRange.value = normalizedDate
    console.log('Initializing date change modal for MeetingRoom with time pickers')
  } else {
    // For hot desks and dedicated desks, only use date picker
    // (we'll still track the operational hours for these products in the background)
    newDateRange.value = normalizedDate
    newTimeRange.value = { start: '', end: '' }
    
    // Store the product type for later reference
    const productType = product?.product_type || 'unknown';
    console.log(`Initializing date change modal without time pickers for product type: ${productType}`);
    
    // For HotDesks, we'll use the operational schedule times when submitting
    if (productType === 'HotDesk') {
      console.log('This is a HotDesk product - operational schedule times will be used when submitting');
    }
  }
  
  // Reset availability data
  bookedTimeSlots.value = []
  disabledTimes.value = { start: [], end: [] }
  loadingAvailability.value = false
  dateError.value = ''
  timeError.value = ''
  availabilityError.value = ''
  durationError.value = ''
  isSelectedDateClosed.value = false
  
  // Fetch operation schedule for the product
  if (product?.product_id) {
    await fetchOperationSchedule(product.product_id)
    
    // Automatically check operating hours for the current date
    const operationalHours = getOperationalHoursForDate(normalizedDate)
    isSelectedDateClosed.value = !operationalHours.is_enabled
    
    if (operationalHours.start_time && operationalHours.end_time) {
      console.log(`Setting initial operating hours for ${normalizedDate} to ${operationalHours.start_time}-${operationalHours.end_time}`)
      operatingHours.value = {
        start: operationalHours.start_time.substring(0, 5), // Format to HH:MM
        end: operationalHours.end_time.substring(0, 5)      // Format to HH:MM
      }
    } else {
      console.log('No specific operating hours found for initial date, using defaults')
      operatingHours.value = { start: '09:00', end: '18:00' }
    }
    
    // Fetch booked time slots for the current date for all product types
    console.log('Automatically fetching booked time slots for the current date:', normalizedDate)
    await fetchBookedTimeSlots(product.product_id, normalizedDate)
  }
  
  showDateChangeModal.value = true
}

const fetchBookedTimeSlots = async (spaceId: number, date: string) => {
  loadingAvailability.value = true
  timeError.value = ''
  dateError.value = ''
  console.log('Fetching booked time slots for space:', spaceId, 'date:', date)
  try {
    bookedTimeSlots.value = await apiManager.getBookedTimeSlots(spaceId, date)
    console.log('Received booked time slots:', bookedTimeSlots.value)
    
    if (isMeetingRoomProduct.value) {
      // For meeting rooms: Calculate disabled times
      calculateDisabledTimes()
      
      // Check if all slots are booked for the day
      if (bookedTimeSlots.value.length > 0) {
        const startSlots = generateTimeSlots().filter(slot => !isTimeSlotBooked(slot, 'start'))
        if (startSlots.length === 0) {
          dateError.value = 'No available time slots on this date. Please select another date.'
        }
      }
    } else {
      // For hot desks: Check if date is fully booked
      // If there are ANY bookings, the hot desk is considered unavailable for that date
      if (bookedTimeSlots.value.length > 0) {
        dateError.value = 'This date is already booked. Please select another date.'
      } else {
        dateError.value = ''
      }
    }
  } catch (error) {
    console.error('Error fetching booked time slots:', error)
    if (isMeetingRoomProduct.value) {
      timeError.value = 'Failed to check availability. Please try again.'
    } else {
      dateError.value = 'Failed to check availability. Please try again.'
    }
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
  // Get operational hours for the selected date
  const operationalHours = newDateRange.value ? getOperationalHoursForDate(newDateRange.value) : { is_enabled: false }
  
  // If no date selected or day is not enabled, return empty array
  if (!newDateRange.value || !operationalHours.is_enabled || !operationalHours.start_time || !operationalHours.end_time) {
    return []
  }
  
  const slots: string[] = []
  
  // Convert operational times to 24-hour format
  const startTime = convertTo24HourFormat(operationalHours.start_time)
  const endTime = convertTo24HourFormat(operationalHours.end_time)
  
  // Parse start and end hours
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  // Convert to total minutes for easier iteration
  const startTotalMinutes = startHour * 60 + startMinute
  const endTotalMinutes = endHour * 60 + endMinute
  
  // Generate time slots in 30-minute intervals
  for (let totalMinutes = startTotalMinutes; totalMinutes <= endTotalMinutes; totalMinutes += 30) {
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    slots.push(timeString)
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
  if (date && bookingToChange.value && productIdToChange.value) {
    // Ensure date is handled consistently as local date
    const selectedDate = date // Already in YYYY-MM-DD format from SingleDatePicker
    console.log('Date changed to:', selectedDate)
    
    // Check if selected date is closed
    const operationalHours = getOperationalHoursForDate(selectedDate)
    isSelectedDateClosed.value = !operationalHours.is_enabled
    
    if (isSelectedDateClosed.value) {
      console.log('Selected date is closed')
      dateError.value = 'Sorry, we are closed on this day'
      bookedTimeSlots.value = []
      disabledTimes.value = { start: [], end: [] }
      return
    } else {
      dateError.value = ''
    }
    
    // Set operating hours for the selected day
    if (operationalHours.start_time && operationalHours.end_time) {
      console.log(`Setting operating hours for ${selectedDate} to ${operationalHours.start_time}-${operationalHours.end_time}`)
      operatingHours.value = {
        start: operationalHours.start_time.substring(0, 5), // Format to HH:MM
        end: operationalHours.end_time.substring(0, 5)    // Format to HH:MM
      }
    } else {
      console.log('No specific operating hours found, using defaults')
      operatingHours.value = { start: '09:00', end: '18:00' }
    }
    
    // Clear error if date is open
    dateError.value = ''
    timeError.value = ''
    availabilityError.value = ''
    
    // Only fetch time slots for meeting rooms (products with start_time and end_time)
    // Hot desks and dedicated desks are full-day bookings, so no need to check time slots
    const product = bookingToChange.value.apiData?.products.find(
      (p: any) => p.product_id === productIdToChange.value
    )
    
    const isMeetingRoom = product?.start_time && product?.end_time && 
                          product.start_time !== '00:00:00' && product.start_time !== null
    
    // Always fetch booked time slots, regardless of product type
    console.log('Fetching time slots for product:', productIdToChange.value)
    await fetchBookedTimeSlots(productIdToChange.value, selectedDate)
  }
}

const onStartTimeChange = (startTime: string) => {
  // Recalculate disabled end times when start time changes
  calculateDisabledTimes()
  
  // Clear errors when start time changes
  durationError.value = ''
  timeError.value = ''
  
  // Validate duration if end time is already selected
  if (newTimeRange.value.end && currentBookingDuration.value > 0) {
    validateDuration()
  }
}

const validateDuration = () => {
  if (!newTimeRange.value.start || !newTimeRange.value.end) {
    durationError.value = ''
    return false
  }
  
  const startMinutes = timeToMinutes(newTimeRange.value.start)
  const endMinutes = timeToMinutes(newTimeRange.value.end)
  const selectedDuration = endMinutes - startMinutes
  
  console.log(`Validating duration - Current: ${currentBookingDuration.value} min, Selected: ${selectedDuration} min`)
  
  if (selectedDuration < currentBookingDuration.value) {
    const currentHours = currentBookingDuration.value / 60
    const selectedHours = selectedDuration / 60
    durationError.value = `You cannot select a shorter duration. Your current booking is ${currentHours} hour(s), but you selected ${selectedHours} hour(s). Please select the same duration to avoid additional charges.`
    return false
  } else if (selectedDuration > currentBookingDuration.value) {
    const currentHours = currentBookingDuration.value / 60
    const selectedHours = selectedDuration / 60
    durationError.value = `You cannot select a longer duration. Your current booking is ${currentHours} hour(s), but you selected ${selectedHours} hour(s). This would require additional payment. Please select the same duration.`
    return false
  } else {
    durationError.value = ''
    return true
  }
}

const fetchOperationSchedule = async (productId: number) => {
  try {
    console.log('Fetching operation schedule for product:', productId)
    const response = await apiManager.getSpaces({ id: productId })
    
    if (response.success && response.space) {
      // Get operation schedule from the raw API data
      const rawSchedule = (apiManager as any).lastRawResponseData?.operation_schedule || []
      console.log('Raw operation_schedule from API:', rawSchedule)
      
      operationSchedule.value = rawSchedule.map((day: any) => ({
        day: day.day,
        is_enabled: day.is_enabled,
        start_time: day.start_time,
        end_time: day.end_time
      }))
      
      console.log('Processed operation schedule:', operationSchedule.value)
    }
  } catch (error) {
    console.error('Error fetching operation schedule:', error)
    // Set default schedule if fetch fails (all days open 9-6)
    operationSchedule.value = [
      { day: 'Monday', is_enabled: true, start_time: '09:00', end_time: '18:00' },
      { day: 'Tuesday', is_enabled: true, start_time: '09:00', end_time: '18:00' },
      { day: 'Wednesday', is_enabled: true, start_time: '09:00', end_time: '18:00' },
      { day: 'Thursday', is_enabled: true, start_time: '09:00', end_time: '18:00' },
      { day: 'Friday', is_enabled: true, start_time: '09:00', end_time: '18:00' },
      { day: 'Saturday', is_enabled: false },
      { day: 'Sunday', is_enabled: false }
    ]
  }
}

const getOperationalHoursForDate = (dateString: string): { day?: string; is_enabled: boolean; start_time?: string; end_time?: string } => {
  if (!dateString) {
    return { is_enabled: false }
  }
  
  if (!operationSchedule.value || operationSchedule.value.length === 0) {
    return { is_enabled: false }
  }
  
  try {
    // Convert date string to day of week
    const selectedDate = new Date(dateString)
    const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    
    console.log('Selected date:', dateString, 'maps to day:', selectedDay)
    console.log('Available schedule days:', operationSchedule.value.map(d => d.day))
    
    // Find the selected day in the schedule (case-insensitive match)
    const daySchedule = operationSchedule.value.find((day: any) => {
      if (!day || !day.day) return false
      // Try exact match first
      if (day.day === selectedDay) return true
      // Try case-insensitive match
      if (day.day.toLowerCase() === selectedDay.toLowerCase()) return true
      return false
    })
    
    console.log('Found schedule for day:', selectedDay, daySchedule)
    
    return daySchedule || { is_enabled: false }
  } catch (error) {
    console.error('Error getting operational hours for date:', error)
    return { is_enabled: false }
  }
}

const convertTo24HourFormat = (timeStr: string): string => {
  if (!timeStr) return ''
  
  // If already in HH:MM format, return as is
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  
  // If in HH:MM:SS format, remove seconds
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').slice(0, 2).map(Number)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  
  // If in 12-hour format with AM/PM
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match) {
    const [, hours, minutes, period] = match
    let hour24 = parseInt(hours, 10)
    
    if (period.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12
    } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }
  
  // Fallback: try to extract HH:MM
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    const [, hours, minutes] = timeMatch
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }
  
  // If nothing matches, return the original string
  console.warn('Unable to parse time format:', timeStr)
  return timeStr
}

const formatTime12Hour = (timeStr: string): string => {
  if (!timeStr) return ''
  
  // Convert to 24-hour format first
  const time24 = convertTo24HourFormat(timeStr)
  const [hours, minutes] = time24.split(':').map(Number)
  
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const isToday = (dayName: string): boolean => {
  const today = new Date()
  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  return dayName.toLowerCase() === todayName.toLowerCase()
}

const confirmDateChange = async () => {
  if (!bookingToChange.value) return

  let selectedDate = ''
  let startTime = ''
  let endTime = ''
  let isValid = false

  // Check if this is a meeting room booking - either by spaceType or by isMeetingRoomProduct flag
  if (bookingToChange.value.spaceType === 'meeting-room' || isMeetingRoomProduct.value) {
    // For meeting rooms, validate time range
    if (newDateRange.value && newTimeRange.value.start && newTimeRange.value.end) {
      selectedDate = newDateRange.value
      startTime = newTimeRange.value.start
      endTime = newTimeRange.value.end
      console.log('Using selected time range for meeting room:', { startTime, endTime })

      // Validate duration matches current booking
      if (currentBookingDuration.value > 0) {
        const isDurationValid = validateDuration()
        if (!isDurationValid) {
          // Error message is already set by validateDuration()
          return
        }
      }

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
        timeError.value = 'This time slot is not available. Please choose a different time.'
        return
      } else {
        timeError.value = ''
      }

      isValid = true
    }
  } else {
    // For hot desks, validate date
    if (newDateRange.value) {
      selectedDate = newDateRange.value

      // For hot desks, rely on the dateError that's set by fetchBookedTimeSlots
      // If there's a dateError, we already know it's invalid
      if (dateError.value) {
        return
      }

      // For hot desks, get operational schedule for the selected date
      if (operationSchedule.value.length > 0) {
        // Convert selected date to day of week
        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Find operational hours for this day
        const daySchedule = operationSchedule.value.find(
          schedule => schedule.day.toLowerCase() === dayOfWeek.toLowerCase()
        );
        
        if (daySchedule && daySchedule.is_enabled) {
          // Use the day's operational hours for start/end times
          startTime = daySchedule.start_time || '';
          endTime = daySchedule.end_time || '';
          console.log(`Using operational schedule times for ${dayOfWeek}: ${startTime} - ${endTime}`);
        } else {
          console.log(`No operational hours found for ${dayOfWeek} or day is disabled`);
        }
      }

      isValid = true
    }
  }

  if (isValid && selectedDate) {
    try {
      // Get booking ID directly from API data
      const bookingId = bookingToChange.value.apiData?.booking_id

      if (!bookingId) {
        alert('Invalid booking ID. Please try again.')
        console.error('No booking_id found in apiData:', bookingToChange.value)
        return
      }
      
      // Get the actual product ID from the product being changed
      let productId = productIdToChange.value
      
      if (!productId && bookingToChange.value.apiData?.products?.[0]) {
        // Fallback to first product if no specific product selected
        productId = bookingToChange.value.apiData.products[0].product_id
      }
      
      if (!productId) {
        alert('Invalid product ID. Please try again.')
        console.error('No product_id found')
        return
      }

      // Prepare API request data
      const updateData: {
        BookingId: number;
        ProductId: number;
        BookingDate: string;
        StartTime?: string;
        EndTime?: string;
        SingleProductId?: number;  // For individual product updates
      } = {
        BookingId: bookingId,
        ProductId: productId,
        BookingDate: selectedDate
      }
      
      // If changing a specific product's date
      if (productIdToChange.value !== null) {
        updateData.SingleProductId = productIdToChange.value
        console.log(`Updating specific product ID: ${productIdToChange.value}`)
      }

      // Determine if we have valid times to send
      const hasTimes = startTime && endTime && startTime !== '' && endTime !== '';
      
      // Add time fields for both meeting rooms AND hot desks
      if (hasTimes) {
        // Use the direct time values that were set
        updateData.StartTime = startTime;
        updateData.EndTime = endTime;
        console.log('Adding time fields from available times:', { 
          StartTime: updateData.StartTime, 
          EndTime: updateData.EndTime 
        });
      } else if (newTimeRange.value && newTimeRange.value.start && newTimeRange.value.end) {
        // Backup: use values from newTimeRange if direct values aren't set (for meeting rooms)
        updateData.StartTime = newTimeRange.value.start;
        updateData.EndTime = newTimeRange.value.end;
        console.log('Adding time fields from time range picker:', { 
          StartTime: updateData.StartTime, 
          EndTime: updateData.EndTime 
        });
      } else if (isMeetingRoomProduct.value) {
        // Warning for meeting rooms that should have times but don't
        console.warn('Meeting room product has no valid time values to send');
      } else {
        // Only log if we don't have any times
        console.log('No time fields available to add to the request');
      }

      console.log('Updating booking with data:', updateData)

      // Call the API
      const response = await apiManager.updateBooking(updateData)
      console.log('API response for date change:', response)

      // Cast to any type to handle different response formats
      const typedResponse = response as any
      console.log('API response type:', typeof response)
      console.log('TypedResponse:', JSON.stringify(typedResponse))
      console.log('Status code check:', typedResponse.status_code)
      
      // CRITICAL: Check all possible success indicators:
      // 1. If status_code is 200
      // 2. If success is true
      // 3. Special case: If message contains "Booking updated" - this indicates a successful update despite success:false
      const messageIndicatesSuccess = typedResponse.message && 
        typedResponse.message.toLowerCase().includes('booking updated');
      
      const isSuccess = typedResponse.status_code === 200 || 
                        response.success === true || 
                        messageIndicatesSuccess;
                        
      console.log('Is success?', isSuccess, 'Message indicates success?', messageIndicatesSuccess)
      
      if (isSuccess) {
        // Update local data on success
        bookingToChange.value.date = selectedDate
        if (bookingToChange.value.spaceType === 'meeting-room') {
          bookingToChange.value.start_time = startTime
          bookingToChange.value.end_time = endTime
        }
        bookingToChange.value.dateChanged = true

        // Close modal
        showDateChangeModal.value = false
        
        // Always show Date Changed Successfully when any success indicator is true
        successOverlayTitle.value = 'Date Changed Successfully'
        
        // Use appropriate message from response
        // Order of preference: data field, success message, or default message
        let successMsg = 'Booking updated successfully';
        if (typedResponse.data) {
          successMsg = typedResponse.data;
        } else if (messageIndicatesSuccess) {
          // Extract just the success part from the message if it contains both success and limitation info
          successMsg = 'Your booking date has been updated.';
        }
        
        successOverlayMessage.value = successMsg;
        showSuccessOverlay.value = true;
        
        // Clear temporary values
        bookingToChange.value = null
        productIdToChange.value = null

        // Reset form data
        newDateRange.value = undefined
        newTimeRange.value = { start: '', end: '' }
        bookedTimeSlots.value = []
        disabledTimes.value = { start: [], end: [] }
        
        // Refresh bookings list to show updated data
        fetchUpcomingBookings()
      } else {
        console.error('Failed to update booking:', response)
        // Use success overlay instead of alert for better UX
        successOverlayTitle.value = 'Unable to Update Booking'
        successOverlayMessage.value = response.message || 'Unable to change booking date. Please try again later.'
        showSuccessOverlay.value = true
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      successOverlayTitle.value = 'Error'
      successOverlayMessage.value = 'An error occurred while updating the booking. Please try again.'
      showSuccessOverlay.value = true
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
onMounted(async () => {
  // Fetch all bookings from APIs first
  await fetchAllBookings()
  
  // Fetch subscriptions to update stats
  await fetchSubscriptions()
  
  // Only add session bookings if we don't have any API bookings
  if (allBookings.value.length === 0) {
    addSessionBookings()
  }
})

// Subscription Methods
const toggleSubscriptions = async () => {
  showSubscriptions.value = !showSubscriptions.value
  
  if (showSubscriptions.value && subscriptions.value.length === 0) {
    await fetchSubscriptions()
  }
  
  // Ensure we're on the upcoming tab when showing subscriptions
  if (showSubscriptions.value) {
    activeTab.value = 'upcoming' // Always show subscriptions in upcoming tab
  }
}

const fetchSubscriptions = async () => {
  loadingSubscriptions.value = true
  try {
    const authStore = useAuthStore()
    const user = authStore.currentUser
    
    if (!user) {
      console.error('No user found for fetching subscriptions')
      return
    }
    
    const response = await apiManager.getUserSubscriptions(user.id)
    
    if (response.success) {
      subscriptions.value = response.subscriptions
      console.log('Fetched subscriptions:', subscriptions.value)
    } else {
      console.error('Failed to fetch subscriptions:', response.message)
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  } finally {
    loadingSubscriptions.value = false
  }
}

const viewSubscriptionDetails = (subscription: any) => {
  selectedSubscription.value = subscription
}

const closeSubscriptionModal = () => {
  selectedSubscription.value = null
}

// Stats Card Click Handlers
const showBookingsTab = (filterType = 'upcoming') => {
  // Hide subscriptions
  showSubscriptions.value = false
  // Switch to list view
  viewMode.value = 'list'
  // Default to requested tab or upcoming tab
  activeTab.value = filterType
}

const showUpcomingBookings = () => {
  showBookingsTab('upcoming')
}

const showPastBookings = () => {
  showBookingsTab('past')
}

const showCancelledBookings = () => {
  showBookingsTab('cancelled')
}

// Subscription Tab Handlers
const showSubscriptionsTab = (filterType = 'active') => {
  // Make sure we're showing subscriptions
  showSubscriptions.value = true
  
  // If we don't have subscriptions loaded yet, load them
  if (subscriptions.value.length === 0) {
    fetchSubscriptions()
  }
  
  // Set the active tab for filtering
  activeTab.value = filterType
}

const showActiveSubscriptions = () => {
  showSubscriptionsTab('active')
}

const showCancelledSubscriptions = () => {
  showSubscriptionsTab('cancelled')
}

// Helper functions for subscription display
const getMonthlyRate = (subscription: any): number => {
  if (!subscription) return 0;
  
  // Calculate monthly rate based on total price and duration
  const durationMonths = getDurationInMonths(subscription);
  if (durationMonths <= 0) return 0;
  
  return subscription.total_price / durationMonths;
};

const getDurationInMonths = (subscription: any): number => {
  if (!subscription?.subscription_start_date || !subscription?.subscription_end_date) return 0;
  
  const startDate = new Date(subscription.subscription_start_date);
  const endDate = new Date(subscription.subscription_end_date);
  
  // Calculate months between dates
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                 (endDate.getMonth() - startDate.getMonth());
  
  // If start date is after the end of the month, round up
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
  
  // Add partial month if significant portion of month is covered
  if (startDay <= 15 && endDay >= 15) {
    return months + 1;
  }
  
  return Math.max(1, months);
};

const getSubscriptionPeriod = (subscription: any): string => {
  if (!subscription?.subscription_start_date || !subscription?.subscription_end_date) return '';
  
  return `${formatDate(subscription.subscription_start_date)} to ${formatDate(subscription.subscription_end_date)}`;
};

// Extract the API host from the environment variable
const getApiHost = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';
  // Extract host from API base URL (remove '/api' suffix)
  return apiBaseUrl.replace(/\/api$/, '');
};

const getProductImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }
  
  // If it's already a complete URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, prepend the API host from environment
  const apiHost = getApiHost();
  return `${apiHost}${imagePath}`;
}

const handleImageError = (event: Event) => {
  // Replace broken images with a default image
  const target = event.target as HTMLImageElement;
  target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  target.onerror = null; // Prevent infinite loop if default image also fails
}

const getSubscriptionStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'active':
      return 'bg-primary/10 text-primary/90 dark:bg-primary/20 dark:text-primary/80'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    case 'expired':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
}
</script>
