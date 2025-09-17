<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 relative">
    <!-- Full-screen Payment Gateway -->
    <div v-if="showPaymentGateway" class="fixed inset-0 top-14 sm:top-16 z-40 bg-white dark:bg-gray-950">
      <div class="relative w-full h-full">
        <iframe
          :src="gatewayUrl"
          class="w-full h-full border-0"
          @load="onGatewayLoad"
          ref="paymentIframe"
        ></iframe>

        <!-- Loading overlay -->
        <div v-if="gatewayLoading" class="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading payment gateway...</p>
          </div>
        </div>

        <!-- Cancel button -->
        <button
          @click="cancelPayment"
          class="absolute top-4 right-4 z-10 p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- reCAPTCHA Verification Modal -->
    <ReCaptchaModal 
      :show="showReCaptcha" 
      @verified="handleCaptchaVerified" 
      @cancel="handleCaptchaCancel"
    />
    
    <!-- IPG Return Processing Loading Overlay -->
    <div v-if="ipgProcessing" class="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Please wait while we confirm your payment...</p>
        <div class="flex items-center justify-center space-x-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

    <!-- Main Payment Page Content (hidden when gateway is active or IPG processing) -->
    <div v-else-if="!showPaymentGateway && !ipgProcessing">
      <div class="max-w-8xl mx-auto container-padding py-8 relative z-10">
        <!-- Progress indicator with labels -->
        <div class="flex flex-col items-center justify-center mb-8">
          <div class="flex items-center mb-2">
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full text-sm font-semibold shadow-lg transform transition-transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Details</span>
            </div>
            <div class="w-20 h-1 bg-green-500 mx-2"></div>
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-primary to-primary text-white rounded-full text-sm font-semibold shadow-lg">
                <span>2</span>
              </div>
              <span class="text-xs font-medium text-primary mt-2">Payment</span>
            </div>
            <div class="w-20 h-1 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold transition-all hover:bg-gray-200">
                <span>3</span>
              </div>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Confirmation</span>
            </div>
          </div>
        </div>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Secure Payment</h1>
          <p class="text-gray-600 dark:text-gray-400">Complete your booking with secure payment</p>
          <div class="flex items-center justify-center mt-3">
            <span class="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 py-1 px-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              Secure Transaction
            </span>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Payment Form -->
          <div class="lg:col-span-2 space-y-6">
          
          <!-- ...existing code... -->

          <!-- Payment Method Selection -->
        

          <!-- Compact Billing Address -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="flex-1 text-lg font-semibold text-gray-900 dark:text-white">Billing Address</span>
              <span class="flex items-center justify-end flex-1 text-xs text-gray-500 dark:text-gray-400">
                <input
                  id="autofill-user-details"
                  type="checkbox"
                  v-model="autofillUserDetails"
                  class="w-4 h-4 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 ml-2"
                  style="vertical-align: middle;"
                >
                <label for="autofill-user-details" class="ml-1 cursor-pointer whitespace-nowrap">Use my account details</label>
              </span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input 
                  v-model="billingAddress.firstName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                  placeholder="John"
                  :readonly="autofillUserDetails"
                  :disabled="autofillUserDetails"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input 
                  v-model="billingAddress.lastName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                  placeholder="Doe"
                  :readonly="autofillUserDetails"
                  :disabled="autofillUserDetails"
                >
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  v-model="billingAddress.email"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                  placeholder="john.doe@example.com"
                  :readonly="autofillUserDetails"
                  :disabled="autofillUserDetails"
                >
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input 
                  v-model="billingAddress.phone"
                  type="tel"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                  :readonly="autofillUserDetails"
                  :disabled="autofillUserDetails"
                >
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-semibold text-green-800 dark:text-green-400 mb-2">Secure Payment Guarantee</h4>
                <p class="text-sm text-green-700 dark:text-green-300">Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.</p>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-medium text-green-700 dark:text-green-300">SSL Secured</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-medium text-green-700 dark:text-green-300">PCI Compliant</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-medium text-green-700 dark:text-green-300">Bank Grade Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-50/50 to-transparent dark:from-green-900/20 rounded-bl-full"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-50/30 to-transparent dark:from-purple-900/10 rounded-tr-full"></div>
            
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Order Summary
            </h2>
            
            <!-- Booking details -->
            <div v-if="bookingDetails.length > 0" class="space-y-4 mb-6">
              <div v-for="(booking, index) in bookingDetails" :key="index" class="group bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-lg p-3.5 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ booking.space?.name || 'Space Booking' }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatBookingDate(booking) }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {{ (booking.productType === 'meeting-room' || booking.productType === 'hot-desk') ? (booking.space?.capacity || 'N/A') : (booking.subscription?.teamSize || 'N/A') }} people
                      </span>
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ getBookingTimeDisplay(booking) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900 dark:text-white">LKR {{ (booking.totalPrice || 0).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span class="text-lg font-bold text-primary">LKR {{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Price breakdown -->
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 mb-6">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price Breakdown</h4>
              <div class="space-y-3">
                <div v-for="(booking, index) in bookingDetails" :key="booking.uniqueKey || booking.spaceId" class="relative">
                  <!-- Product header -->
                  <div class="mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
                    <h5 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <svg class="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ booking.space?.name || 'Product' }} {{ index + 1 }}
                    </h5>
                  </div>

                  <!-- Base Price with calculation -->
                  <div class="mb-3">
                    <div class="flex justify-between items-center text-sm mb-1">
                      <span class="text-gray-700 dark:text-gray-300 font-medium">{{ getBasePriceLabel(booking) }}</span>
                      <span class="text-gray-900 dark:text-white font-medium">
                        <span class="text-xs text-gray-500 dark:text-gray-400">LKR {{ getBasePricePerUnit(booking) }} × {{ getMultiplierLabel(booking) }} = </span>
                        LKR {{ booking.pricing?.basePrice?.toFixed(2) || (0).toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Individual Facilities with calculations -->
                  <div v-if="booking.pricing?.facilitiesPrice && booking.pricing?.facilitiesPrice > 0 && booking.facilities && booking.facilities.length > 0" class="space-y-2 mb-3">
                    <div v-for="(facility, index) in booking.facilities" :key="facility" class="flex justify-between items-center text-sm">
                      <span class="text-gray-700 dark:text-gray-300">{{ facility }}</span>
                      <span class="text-gray-900 dark:text-white">
                        <span class="text-xs text-gray-500 dark:text-gray-400">LKR {{ getFacilityPricePerUnit(booking, index) }} × {{ getMultiplierLabel(booking) }} = </span>
                        LKR {{ Math.round(booking.pricing.facilitiesPrice / booking.facilities.length).toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Service Fee -->
                  <div v-if="booking.pricing?.serviceFee && booking.pricing?.serviceFee > 0" class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Service Fee</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.serviceFee?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>

                  <!-- Taxes -->
                  <div v-if="booking.pricing?.taxes && booking.pricing?.taxes > 0" class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Taxes</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.taxes?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>

                  <!-- Subtotal for this booking -->
                  <div class="pt-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 -mx-4 px-4 py-3 rounded-lg">
                    <div class="flex justify-between text-sm font-medium">
                      <span class="text-gray-900 dark:text-white">{{ booking.space?.name }} Total</span>
                      <span class="text-gray-900 dark:text-white font-semibold">LKR {{ (booking.totalPrice || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Overall Total -->
                <div class="pt-4 border-t-2 border-gray-300 dark:border-gray-500 mt-6">
                  <div class="flex justify-between font-medium text-lg">
                    <span class="text-gray-900 dark:text-white font-semibold">Total Amount</span>
                    <span class="text-primary font-bold">LKR {{ totalAmount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Complete Booking Button -->
            <button 
              @click="processPayment"
              :disabled="processing || !isPaymentFormValid"
              class="w-full flex items-center justify-center bg-primary to-primary text-black text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] focus:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg hover:shadow-xl font-semibold"
            >
              <span v-if="processing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete Booking
              </span>
            </button>
            
            <!-- Cancellation Policy -->
            <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">Cancellation Policy</h4>
                  <div class="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <p>• <strong>No refunds</strong> for cancellations once booking is confirmed</p>
                    <p>• Booking modifications allowed <strong>only once</strong> before the scheduled date</p>
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useBookingStore } from '../stores/booking';
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { NetworkManager } from '../api/networkManager';
import type { BookingDetails } from '../stores/booking';
import ReCaptchaModal from '../components/ReCaptchaModal.vue';

interface SavedCard {
  id: number;
  card_number: string;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
}

interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default defineComponent({
  name: 'PaymentPage',
  components: {
    ReCaptchaModal
  },
  
  setup() {
    const processing = ref(false);
    const selectedPaymentMethod = ref<string | number>('');
    const saveCardForFuture = ref(true);
    const showGatewayModal = ref(false);
    const gatewayUrl = ref('');
    const savedCards = ref<SavedCard[]>([]);
    const loading = ref(true);
    const showPaymentGateway = ref(false);
    const gatewayLoading = ref(false);
    const ipgProcessing = ref(false);
    
    // reCAPTCHA related state
    const showReCaptcha = ref(false);
    const recaptchaToken = ref('');
    const paymentPayloadCache = ref<any>(null); // Store payload while captcha is being verified
    
    const router = useRouter();
    const route = useRoute();
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    
    // Demo saved cards (will be replaced by API data)
    const demoCards: SavedCard[] = [
      {
        id: 1,
        card_number: "413541******3146",
        card_type: "VISA",
        expiry_month: "12",
        expiry_year: "25",
        is_default: true
      },
      {
        id: 2,
        card_number: "5555********4444",
        card_type: "MASTERCARD",
        expiry_month: "10",
        expiry_year: "26",
        is_default: false
      }
    ];
    
    // Billing address
    const billingAddress = ref<BillingAddress>({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });

    // Checkbox for autofill user details
    const autofillUserDetails = ref(true);

    // Watch autofillUserDetails and user state to update billingAddress
    watch([autofillUserDetails, () => authStore.user], ([autofill, user]) => {
      if (autofill) {
        if (user) {
          // Use logged-in user details
          billingAddress.value.firstName = user.firstName || '';
          billingAddress.value.lastName = user.lastName || '';
          billingAddress.value.email = user.email || '';
          billingAddress.value.phone = user.phone || '';
        } else {
          // Use guest details from summary page
          const guestInfo = bookingStore.currentBooking[0]?.guestInfo;
          if (guestInfo) {
            billingAddress.value.firstName = guestInfo.firstName || '';
            billingAddress.value.lastName = guestInfo.lastName || '';
            billingAddress.value.email = guestInfo.email || '';
            billingAddress.value.phone = guestInfo.phone || '';
          }
        }
      }
    }, { immediate: true });
    
    const bookingDetails = computed<BookingDetails[]>(() => {
      return bookingStore.currentBooking;
    });
    
    const totalAmount = computed<number>(() => {
      return bookingDetails.value.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
    });
    
    const isPaymentFormValid = computed<boolean>(() => {
      const isBillingValid = 
        billingAddress.value.firstName.trim() !== '' &&
        billingAddress.value.lastName.trim() !== '' &&
        billingAddress.value.email.trim() !== '' &&
        billingAddress.value.phone.trim() !== '';
      
      const isPaymentMethodSelected = selectedPaymentMethod.value !== '';
      
      return isBillingValid && isPaymentMethodSelected;
    });
    
    // Format booking date for display
    function formatBookingDate(booking: BookingDetails): string {
      const startDate = booking.booking?.startDate || booking.subscription?.startDate;
      const endDate = booking.booking?.endDate || booking.subscription?.endDate;
      
      // For meeting rooms and hot desks (single-day bookings), show only start date
      if ((booking.productType === 'meeting-room' || booking.productType === 'hot-desk') && startDate) {
        const start = new Date(startDate);
        const formatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return start.toLocaleDateString('en-US', formatOptions);
      }
      
      // For subscriptions (dedicated desks, coworking spaces), show date range
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const formatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
      }
      
      const legacyDate = booking.booking?.date;
      if (legacyDate) {
        return new Date(legacyDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }
      
      return 'Date not specified';
    }

    // Helper methods for price calculations (same as BookingSummary.vue)
    function getBasePriceLabel(booking: BookingDetails): string {
      const productType = booking.productType;
      const types: Record<string, string> = {
        'meeting-room': 'Meeting Room only price',
        'hot-desk': 'Hot Desk only price',
        'dedicated-desk': 'Dedicated Desk only price',
        'coworking-space': 'Co-working Space only price'
      };
      return types[productType] || 'Base Price';
    }

    function getBasePricePerUnit(booking: BookingDetails): number {
      if (!booking.pricing?.basePrice) return 0;
      
      const multiplier = getMultiplier(booking);
      return multiplier > 0 ? Math.round(booking.pricing.basePrice / multiplier) : booking.pricing.basePrice;
    }

    function getMultiplier(booking: BookingDetails): number {
      if (booking.productType === 'meeting-room' || booking.productType === 'hot-desk') {
        // For meeting rooms and hot desks, multiplier is duration in hours
        return parseInt(booking.booking?.duration || '1');
      } else if (booking.productType === 'dedicated-desk' || booking.productType === 'coworking-space') {
        // For subscriptions, calculate based on package type
        const packageType = booking.subscription?.packageType || 'monthly';
        if (packageType === 'daily') return 1;
        if (packageType === 'monthly') return 30; // Approximate days in month
        if (packageType === 'annual') return 365; // Days in year
      }
      return 1; // Default fallback
    }

    function getMultiplierLabel(booking: BookingDetails): string {
      if (booking.productType === 'hot-desk') {
        return 'Full day';
      } else if (booking.productType === 'meeting-room') {
        const duration = parseInt(booking.booking?.duration || '1');
        return `${duration} hour${duration > 1 ? 's' : ''}`;
      } else if (booking.productType === 'dedicated-desk' || booking.productType === 'coworking-space') {
        const packageType = booking.subscription?.packageType || 'monthly';
        if (packageType === 'daily') return '1 day';
        if (packageType === 'monthly') return '30 days';
        if (packageType === 'annual') return '365 days';
      }
      return '1 unit';
    }

    function getFacilityPricePerUnit(booking: BookingDetails, facilityIndex: number): number {
      if (!booking.pricing?.facilitiesPrice || !booking.facilities || booking.facilities.length === 0) return 0;
      
      const totalFacilityPrice = Math.round(booking.pricing.facilitiesPrice / booking.facilities.length);
      const multiplier = getMultiplier(booking);
      return multiplier > 0 ? Math.round(totalFacilityPrice / multiplier) : totalFacilityPrice;
    }

    // Get booking time display with start time, end time, and duration
    function getBookingTimeDisplay(booking: BookingDetails): string {
      // For hot desks, just show "Full day"
      if (booking.productType === 'hot-desk') {
        return 'Full day';
      }

      // For meeting rooms, calculate end time from duration
      if (!booking.booking?.startTime || !booking.booking?.duration) {
        return 'Time not specified';
      }

      const startTime = booking.booking.startTime;
      const duration = parseInt(booking.booking.duration);

      if (isNaN(duration)) {
        return startTime;
      }

      // Calculate end time
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDateTime = new Date();
      startDateTime.setHours(hours, minutes, 0, 0);
      startDateTime.setHours(startDateTime.getHours() + duration);
      const endTime = `${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`;

      return `${startTime} - ${endTime} (${duration}h)`;
    }
    
    // Load saved payment methods
    async function loadSavedCards(): Promise<void> {
      try {
        const user = authStore.user;
        if (!user?.id) {
          // Show demo cards if no user
          savedCards.value = demoCards;
          selectedPaymentMethod.value = demoCards[0]?.id || 'new-card';
          return;
        }
        
        const response = await NetworkManager.getPaymentMethods(user.id);
        if (response.success && response.paymentMethods.length > 0) {
          savedCards.value = response.paymentMethods;
          // Select the default card or first card
          const defaultCard = savedCards.value.find(card => card.is_default);
          selectedPaymentMethod.value = defaultCard?.id || savedCards.value[0].id;
        } else {
          // No saved cards, show add new card option
          savedCards.value = [];
          selectedPaymentMethod.value = 'new-card';
        }
      } catch (error) {
        console.error('Error loading saved cards:', error);
        // Fallback to demo cards
        savedCards.value = demoCards;
        selectedPaymentMethod.value = demoCards[0]?.id || 'new-card';
      } finally {
        loading.value = false;
      }
    }
    
    // Create new card session and process booking
    async function createNewCardSession(): Promise<void> {
      try {
        processing.value = true;
        
        // Add recaptcha token to all API requests for verification on backend
        NetworkManager.setAuthHeader('X-Recaptcha-Token', recaptchaToken.value);

        // Get the booking (single booking)
        const bookingDetail = bookingDetails.value[0];
        if (!bookingDetail) {
          alert('No booking details found');
          return;
        }

        // Extract booking information
        let bookingDate = '';
        let startTime = '';
        let endTime = '';
        let facilityIds: number[] = [];

        if (bookingDetail.productType === 'meeting-room' || bookingDetail.productType === 'hot-desk') {
          // For meeting rooms and hot desks
          bookingDate = bookingDetail.booking?.startDate || '';
          startTime = bookingDetail.booking?.startTime || '';

          // Calculate end time based on start time and duration
          if (startTime && bookingDetail.booking?.duration) {
            const durationHours = parseInt(bookingDetail.booking.duration);
            if (!isNaN(durationHours)) {
              const [hours, minutes] = startTime.split(':').map(Number);
              const startDateTime = new Date();
              startDateTime.setHours(hours, minutes, 0, 0);
              startDateTime.setHours(startDateTime.getHours() + durationHours);
              endTime = `${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`;
            } else {
              endTime = startTime; // Fallback if duration parsing fails
            }
          } else {
            endTime = startTime; // Fallback if no duration
          }

          // Map facility names to IDs using space facility data
          if (bookingDetail.facilities && bookingDetail.facilities.length > 0) {
            console.log('Facilities in booking:', bookingDetail.facilities);
            console.log('Space facility data:', {
              additional_facilities: bookingDetail.space.additional_facilities,
              default_facilities: bookingDetail.space.default_facilities,
              facilities: bookingDetail.space.facilities
            });

            const allFacilities = [
              ...(bookingDetail.space.additional_facilities || []),
              ...(bookingDetail.space.default_facilities || []),
              ...(bookingDetail.space.facilities || [])
            ];

            console.log('All facilities combined:', allFacilities);

            facilityIds = bookingDetail.facilities
              .map(facilityName => {
                console.log('Looking for facility:', facilityName);
                const facility = allFacilities.find(f =>
                  f.facility_name.toLowerCase() === facilityName.toLowerCase()
                );
                console.log('Found facility:', facility);
                return facility ? facility.facility_id : null;
              })
              .filter(id => id !== null) as number[];

            console.log('Mapped facility IDs:', facilityIds);
          }
        } else if (bookingDetail.productType === 'dedicated-desk') {
          // For dedicated desks, use subscription dates
          bookingDate = bookingDetail.subscription?.startDate || '';
          startTime = '09:00'; // Default start time for dedicated desks
          endTime = '18:00';   // Default end time for dedicated desks
          facilityIds = [];    // Dedicated desks might not have additional facilities
        }

        // Format booking date (assuming it's in YYYY-MM-DD format, convert to YYYY.MM.DD)
        const formattedBookingDate = bookingDate.replace(/-/g, '.');

        // Construct payload with single booking
        const paymentPayload = {
          first_name: billingAddress.value.firstName || '',
          last_name: billingAddress.value.lastName || '',
          email: billingAddress.value.email || '',
          phone: billingAddress.value.phone || '',
          user_id: authStore.user?.id,
          is_card_add: false, // As per user requirement
          amount: totalAmount.value,
          booking: {
            user_id: authStore.user?.id,
            product_id: bookingDetail.spaceId,
            booking_date: formattedBookingDate,
            start_time: startTime,
            end_time: endTime,
            facility_ids: facilityIds, // Correct facility IDs for this single product
            total_price: totalAmount.value
          }
        };

        console.log('Payment payload being sent:', paymentPayload);

        const response = await NetworkManager.processCardPayment(paymentPayload);

        if (response.success && response.gatewayData?.link) {
          // Store booking data for retry scenarios
          sessionStorage.setItem('retry_booking_data', JSON.stringify({
            bookingDetails: bookingDetails.value,
            billingAddress: billingAddress.value,
            selectedPaymentMethod: selectedPaymentMethod.value,
            saveCardForFuture: saveCardForFuture.value
          }));

          // Redirect to payment gateway in the same page (not iframe)
          window.location.href = response.gatewayData.link;
        } else {
          alert(response.message || 'Failed to create payment session');
        }
      } catch (error) {
        console.error('Error creating card session:', error);
        alert('Failed to create payment session. Please try again.');
      } finally {
        processing.value = false;
      }
    }
    
    // Process payment
    async function processPayment(): Promise<void> {
      if (!isPaymentFormValid.value) return;
      
      // Show reCAPTCHA before proceeding with payment
      showReCaptcha.value = true;
    }
    
    // Handle successful reCAPTCHA verification
    async function handleCaptchaVerified(token: string): Promise<void> {
      recaptchaToken.value = token;
      showReCaptcha.value = false;
      
      // Process payment after successful verification
      if (selectedPaymentMethod.value === 'new-card') {
        await createNewCardSession();
      } else {
        // Use existing card
        await processExistingCardPayment();
      }
    }
    
    // Handle reCAPTCHA cancellation
    function handleCaptchaCancel(): void {
      showReCaptcha.value = false;
      recaptchaToken.value = '';
      paymentPayloadCache.value = null;
    }
    
    // Process payment with existing card
    async function processExistingCardPayment(): Promise<void> {
      processing.value = true;

      try {
        // Add recaptcha token to all API requests for verification on backend
        NetworkManager.setAuthHeader('X-Recaptcha-Token', recaptchaToken.value);
        // Get the booking (single booking)
        const bookingDetail = bookingDetails.value[0];
        if (!bookingDetail) {
          alert('No booking details found');
          return;
        }

        // Extract booking information (same logic as new card)
        let bookingDate = '';
        let startTime = '';
        let endTime = '';
        let facilityIds: number[] = [];

        if (bookingDetail.productType === 'meeting-room' || bookingDetail.productType === 'hot-desk') {
          bookingDate = bookingDetail.booking?.startDate || '';
          startTime = bookingDetail.booking?.startTime || '';

          // Calculate end time based on start time and duration
          if (startTime && bookingDetail.booking?.duration) {
            const durationHours = parseInt(bookingDetail.booking.duration);
            if (!isNaN(durationHours)) {
              const [hours, minutes] = startTime.split(':').map(Number);
              const startDateTime = new Date();
              startDateTime.setHours(hours, minutes, 0, 0);
              startDateTime.setHours(startDateTime.getHours() + durationHours);
              endTime = `${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`;
            } else {
              endTime = startTime;
            }
          } else {
            endTime = startTime;
          }

          // Map facility names to IDs using space facility data
          if (bookingDetail.facilities && bookingDetail.facilities.length > 0) {
            console.log('Facilities in booking:', bookingDetail.facilities);
            console.log('Space facility data:', {
              additional_facilities: bookingDetail.space.additional_facilities,
              default_facilities: bookingDetail.space.default_facilities,
              facilities: bookingDetail.space.facilities
            });

            const allFacilities = [
              ...(bookingDetail.space.additional_facilities || []),
              ...(bookingDetail.space.default_facilities || []),
              ...(bookingDetail.space.facilities || [])
            ];

            console.log('All facilities combined:', allFacilities);

            facilityIds = bookingDetail.facilities
              .map(facilityName => {
                console.log('Looking for facility:', facilityName);
                const facility = allFacilities.find(f =>
                  f.facility_name.toLowerCase() === facilityName.toLowerCase()
                );
                console.log('Found facility:', facility);
                return facility ? facility.facility_id : null;
              })
              .filter(id => id !== null) as number[];

            console.log('Mapped facility IDs:', facilityIds);
          }
        } else if (bookingDetail.productType === 'dedicated-desk') {
          bookingDate = bookingDetail.subscription?.startDate || '';
          startTime = '09:00';
          endTime = '18:00';
          facilityIds = [];
        }

        // Format booking date
        const formattedBookingDate = bookingDate.replace(/-/g, '.');

        // Construct payload for existing card payment
        const paymentPayload = {
          first_name: billingAddress.value.firstName || '',
          last_name: billingAddress.value.lastName || '',
          email: billingAddress.value.email || '',
          phone: billingAddress.value.phone || '',
          user_id: authStore.user?.id,
          is_card_add: false,
          amount: totalAmount.value,
          booking: {
            user_id: authStore.user?.id,
            product_id: bookingDetail.spaceId,
            booking_date: formattedBookingDate,
            start_time: startTime,
            end_time: endTime,
            facility_ids: facilityIds, // Correct facility IDs for this single product
            total_price: totalAmount.value
          }
        };

        console.log('Payment payload being sent:', paymentPayload);

        const response = await NetworkManager.processCardPayment(paymentPayload);

        if (response.success && response.gatewayData?.link) {
          // Store booking data for retry scenarios
          sessionStorage.setItem('retry_booking_data', JSON.stringify({
            bookingDetails: bookingDetails.value,
            billingAddress: billingAddress.value,
            selectedPaymentMethod: selectedPaymentMethod.value,
            saveCardForFuture: saveCardForFuture.value
          }));

          // Show embedded payment gateway instead of redirecting
          gatewayUrl.value = response.gatewayData.link;
          showPaymentGateway.value = true;
          gatewayLoading.value = true;
        } else {
          alert(response.message || 'Failed to process payment');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        alert('Payment processing failed. Please try again.');
      } finally {
        processing.value = false;
      }
    }
    
    // Close gateway modal
    function closeGatewayModal(): void {
      showGatewayModal.value = false;
      gatewayUrl.value = '';
    }
    
    // Handle gateway load
    function onGatewayLoad(): void {
      console.log('Payment gateway loaded');
      gatewayLoading.value = false;
      
      // Listen for messages from the payment gateway iframe
      window.addEventListener('message', handlePaymentMessage);
    }
    
    // Handle messages from payment gateway
    function handlePaymentMessage(event: MessageEvent): void {
      // Verify origin for security (you should replace with your actual gateway domain)
      // if (event.origin !== 'https://your-gateway-domain.com') return;
      
      if (event.data && event.data.type === 'payment_complete') {
        // Payment completed successfully
        showPaymentGateway.value = false;
        gatewayUrl.value = '';
        processing.value = false;
        // Clear booking data so floating summary and summary page are reset
        if (bookingStore.clearBookingDetails) bookingStore.clearBookingDetails();
        // Navigate to confirmation page
        router.push('/booking-confirmation');
      } else if (event.data && event.data.type === 'payment_failed') {
        // Payment failed
        showPaymentGateway.value = false;
        gatewayUrl.value = '';
        processing.value = false;
        
        alert('Payment failed. Please try again.');
      }
    }
    
    // Cancel payment and go back
    function cancelPayment(): void {
      showPaymentGateway.value = false;
      gatewayUrl.value = '';
      gatewayLoading.value = false;
      processing.value = false;
      
      // Remove message listener
      window.removeEventListener('message', handlePaymentMessage);
    }
    
    // Initialize on component mount
    onMounted(async () => {
      // If no booking data, redirect to home
      if (bookingDetails.value.length === 0) {
        router.replace({ name: 'Home' });
        return;
      }
      bookingStore.initializeBooking();
      await loadSavedCards();

      // Check for IPG return query parameters
      const query = route.query;
      if (query.desc && query.status && query.orderId) {
        // Set IPG processing state to show loading overlay
        ipgProcessing.value = true;
        
        const isSuccess = query.desc === 'Approved' && query.status === 'SUCCESS';
        
        // Store payment result and data in sessionStorage
        sessionStorage.setItem('payment_result', JSON.stringify({
          success: isSuccess,
          orderId: query.orderId,
          desc: query.desc,
          status: query.status,
          // Store booking data for retry or confirmation
          bookingData: bookingDetails.value
        }));

        // Add a small delay to ensure loading overlay is visible
        setTimeout(async () => {
          if (isSuccess) {
            // Clear booking data on success
            if (bookingStore.clearBookingDetails) bookingStore.clearBookingDetails();
          }
          // Redirect directly to confirmation page (replace to avoid Payment in history)
          router.replace({ name: 'BookingConfirmation' });
        }, 1500); // 1.5 second delay to show loading effect
      } else {
        // Check for retry data
        const retryData = sessionStorage.getItem('restore_booking_data');
        if (retryData) {
          const parsed = JSON.parse(retryData);
          // Restore the data
          // Note: bookingDetails is from store, so need to restore store
          // For now, assume store is initialized
          // billingAddress.value = parsed.billingAddress;
          // selectedPaymentMethod.value = parsed.selectedPaymentMethod;
          // saveCardForFuture.value = parsed.saveCardForFuture;
          sessionStorage.removeItem('restore_booking_data');
        }
      }
    });
    
    return {
  processing,
  selectedPaymentMethod,
  saveCardForFuture,
  showGatewayModal,
  gatewayUrl,
  savedCards,
  loading,
  billingAddress,
  bookingStore,
  bookingDetails,
  totalAmount,
  isPaymentFormValid,
  formatBookingDate,
  getBasePriceLabel,
  getBasePricePerUnit,
  getMultiplier,
  getMultiplierLabel,
  getFacilityPricePerUnit,
  getBookingTimeDisplay,
  processPayment,
  closeGatewayModal,
  onGatewayLoad,
  router,
  autofillUserDetails,
  authStore,
  showPaymentGateway,
  gatewayLoading,
  ipgProcessing,
  cancelPayment,
  handlePaymentMessage,
  // reCAPTCHA related
  showReCaptcha,
  recaptchaToken,
  handleCaptchaVerified,
  handleCaptchaCancel
    };
  }
});
</script>

<style scoped>
.peer:checked ~ label .peer-checked\:border-primary {
  border-color: var(--color-primary);
}

.peer:checked ~ label .peer-checked\:bg-primary {
  background-color: var(--color-primary);
}

.peer:checked ~ label .peer-checked\:opacity-100 {
  opacity: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Payment Gateway Iframe Styles */
.payment-gateway-iframe {
  min-height: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .payment-gateway-iframe {
    min-height: 500px;
  }
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
