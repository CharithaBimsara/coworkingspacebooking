<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 relative">
    <!-- Full-screen Payment Gateway -->
    <div v-if="showPaymentGateway" class="fixed inset-0 top-14 sm:top-16 z-40 bg-white dark:bg-gray-950">
      <div class="relative w-full h-full">
        <iframe :src="gatewayUrl" class="w-full h-full border-0" @load="onGatewayLoad" ref="paymentIframe"></iframe>

        <!-- Loading overlay -->
        <div v-if="gatewayLoading"
          class="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading payment gateway...</p>
          </div>
        </div>

        <!-- Cancel button -->
        <button @click="cancelPayment"
          class="absolute top-4 right-4 z-10 p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ✕
        </button>
      </div>
    </div>

    <!-- reCAPTCHA Verification Modal -->
    <ReCaptchaModal :show="showReCaptcha" @verified="handleCaptchaVerified" @cancel="handleCaptchaCancel" />

    <!-- IPG Return Processing Loading Overlay -->
    <div v-if="ipgProcessing" class="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ processingStep === 'payment' ? 'Please wait while we confirm your payment...' : 
             processingStep === 'invoice' ? 'Generating invoice for your booking...' : 
             'Preparing your confirmation page...' }}
        </p>
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
        <div class="flex items-center justify-between mb-8">
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
            <div class="flex items-center mb-2">
              <div class="flex flex-col items-center">
                <div
                  class="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full text-sm font-semibold shadow-lg transform transition-transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Details</span>
              </div>
              <div class="w-20 h-1 bg-green-500 mx-2"></div>
              <div class="flex flex-col items-center">
                <div
                  class="flex items-center justify-center w-10 h-10 bg-primary to-primary text-white rounded-full text-sm font-semibold shadow-lg">
                  <span>2</span>
                </div>
                <span class="text-xs font-medium text-primary mt-2">Payment</span>
              </div>
              <div class="w-20 h-1 bg-gray-300 dark:bg-gray-600 mx-2"></div>
              <div class="flex flex-col items-center">
                <div
                  class="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold transition-all hover:bg-gray-200">
                  <span>3</span>
                </div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Confirmation</span>
              </div>
            </div>
          </div>

          <!-- Spacer for balance -->
          <div class="w-10"></div>
        </div>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Secure Payment</h1>
          <p class="text-gray-600 dark:text-gray-400">Complete your booking with secure payment</p>
          <div class="flex items-center justify-center mt-3">
            <span
              class="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 py-1 px-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd" />
              </svg>
              Secure Transaction
            </span>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Payment Form -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Payment Method Selection -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <SavedCardSelector 
                :cards="savedCards" 
                v-model="selectedPaymentMethod" 
                v-model:saveCard="saveCardForFuture" 
                :saveCardOption="isAuthenticated"
              />
            </div>

            <!-- Compact Billing Address -->
            <div
              class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="flex-1 text-lg font-semibold text-gray-900 dark:text-white">Billing Address</span>
                <span class="flex items-center justify-end flex-1 text-xs text-gray-500 dark:text-gray-400">
                  <input id="autofill-user-details" type="checkbox" v-model="autofillUserDetails"
                    class="w-4 h-4 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 ml-2"
                    style="vertical-align: middle;">
                  <label for="autofill-user-details" class="ml-1 cursor-pointer whitespace-nowrap">Use my account
                    details</label>
                </span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input v-model="billingAddress.firstName" type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="John" :readonly="autofillUserDetails" :disabled="autofillUserDetails">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input v-model="billingAddress.lastName" type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="Doe" :readonly="autofillUserDetails" :disabled="autofillUserDetails">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input v-model="billingAddress.email" type="email"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="john.doe@example.com" :readonly="autofillUserDetails" :disabled="autofillUserDetails">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input v-model="billingAddress.phone" type="tel"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="+1 (555) 123-4567" :readonly="autofillUserDetails" :disabled="autofillUserDetails">
                </div>
              </div>
            </div>

            <!-- Security Notice -->
            <div
              class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-semibold text-green-800 dark:text-green-400 mb-2">Secure Payment Guarantee
                  </h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Your payment information is encrypted and
                    secure. We use industry-standard SSL encryption to protect your data.</p>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center space-x-6">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-medium text-green-700 dark:text-green-300">SSL Secured</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-medium text-green-700 dark:text-green-300">PCI Compliant</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-medium text-green-700 dark:text-green-300">Bank Grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="lg:col-span-1">
            <div
              class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <!-- Decorative elements -->
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-50/50 to-transparent dark:from-green-900/20 rounded-bl-full">
              </div>
              <div
                class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-50/30 to-transparent dark:from-purple-900/10 rounded-tr-full">
              </div>

              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h2>

              <!-- Booking details -->
              <div v-if="bookingDetails.length > 0" class="space-y-4 mb-6">
                <div v-for="(booking, index) in bookingDetails" :key="index"
                  class="group bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-lg p-3.5 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 dark:text-white text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-primary" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {{ booking.space?.name || 'Space Booking' }}
                      </h4>
                      <p v-if="booking.productType !== 'dedicated-desk'"
                        class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatBookingDate(booking) }}
                      </p>
                      <div class="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {{ booking.productType === 'dedicated-desk' ? (booking.space?.capacity || 'N/A') :
                            (booking.productType === 'meeting-room' || booking.productType === 'hot-desk') ?
                              (booking.space?.capacity || 'N/A') : (booking.subscription?.teamSize || 'N/A') }} people
                        </span>
                        <!-- Time display (hidden for dedicated desk) -->
                        <span v-if="booking.productType !== 'dedicated-desk'" class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ getBookingTimeDisplay(booking) }}
                        </span>
                        <!-- Subscription dates for dedicated desk -->
                        <span v-if="booking.productType === 'dedicated-desk'" class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ formatSubscriptionDates(booking) }}
                        </span>
                      </div>
                      
                      <!-- Facilities - show only if available -->
                      <div v-if="booking.facilities && booking.facilities.length > 0" class="mt-2">
                        <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Additional Facilities:</p>
                        <div class="flex flex-wrap gap-1.5">
                          <span v-for="facility in booking.facilities" :key="facility"
                            class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ facility }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">LKR {{ (booking.totalPrice || 0).toFixed(2)
                        }}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-base font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
                    <span class="text-base font-semibold text-gray-900 dark:text-white price-value">LKR {{ totalAmount.toFixed(2) }}</span>
                  </div>

                  <!-- Pay with Points Component -->
                  <div v-if="currentUser" class="mb-4">
                    <PayWithPoints 
                      :available-points="userRewardPoints" 
                      :total-amount="totalAmount"
                      v-model="pointsToUse"
                      @points-changed="handlePointsChange"
                    />
                  </div>

                  <!-- Final Total -->
                  <div class="flex justify-between items-center pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                    <span class="text-lg font-semibold text-gray-900 dark:text-white">Total to Pay</span>
                    <span class="text-lg font-bold text-primary price-value">LKR {{ finalAmount.toFixed(2) }}</span>
                  </div>

                  <!-- Points Applied Info -->
                  <div v-if="pointsToUse > 0" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-green-700 dark:text-green-400 font-medium">Points Applied:</span>
                      <span class="text-green-700 dark:text-green-400 font-semibold">{{ pointsToUse.toLocaleString() }} Points (- LKR {{ pointsDiscount.toFixed(2) }})</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Complete Booking Button -->
              <button @click="processPayment" :disabled="processing || !isPaymentFormValid"
                class="w-full flex items-center justify-center bg-primary to-primary text-black text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] focus:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg hover:shadow-xl font-semibold">
                <span v-if="processing" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Processing...
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Complete Booking
                </span>
              </button>

              <!-- Cancellation Policy -->
              <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-800/80 dark:to-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
                  <div class="flex items-center mb-3">
                    <svg class="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Cancellation Policy</h4>
                  </div>
                  <div class="space-y-2.5 pl-7">
                    <div class="flex items-start">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-primary text-xs mr-2 flex-shrink-0 mt-0.5">1</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300">No refunds for cancellations once booking is confirmed</p>
                    </div>
                    <div class="flex items-start">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-primary text-xs mr-2 flex-shrink-0 mt-0.5">2</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300">Booking modifications allowed only once before the scheduled date</p>
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
import { apiManager, ApiManager } from '../api/apiManager'
import { formatPrice, formatCurrency } from '../utils/formatUtils';
import type { BookingDetails } from '../stores/booking';
import ReCaptchaModal from '../components/ReCaptchaModal.vue';
import SavedCardSelector from '../components/payment/SavedCardSelector.vue';
import PayWithPoints from '../components/PayWithPoints.vue';

interface SavedCard {
  id: number;
  wallet_id?: number;
  card_number: string;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
  holder_name?: string;
  brand?: string;
  last_four?: string;
  issuer?: string;
  card_issuer_type?: string; // CREDIT or DEBIT
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
    ReCaptchaModal,
    SavedCardSelector,
    PayWithPoints
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
    const processingStep = ref<'payment' | 'invoice' | 'finalizing'>('payment');

    // reCAPTCHA related state
    const showReCaptcha = ref(false);
    const recaptchaToken = ref('');
    const paymentPayloadCache = ref<any>(null); // Store payload while captcha is being verified

    const router = useRouter();
    const route = useRoute();
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();

    // Reward Points State
    const pointsToUse = ref(0);
    const pointsDiscount = ref(0);

    // Get current user
    const currentUser = computed(() => authStore.currentUser);

    // Get user's reward points
    const userRewardPoints = computed(() => {
      return currentUser.value?.rewardPoints || authStore.currentUserDetails?.rewardPoints || 0;
    });

    // Handle points change from PayWithPoints component
    const handlePointsChange = (data: { pointsUsed: number; discountAmount: number; newTotal: number }) => {
      pointsToUse.value = data.pointsUsed;
      pointsDiscount.value = data.discountAmount;
    };

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

    // Check if the user is authenticated (not a guest)
    const isAuthenticated = computed<boolean>(() => {
      return !!authStore.user;
    });
    
    // Watch for authentication status changes to update saveCardForFuture
    watch(isAuthenticated, (isAuth) => {
      // If user is not authenticated (guest), then disable saving card
      if (!isAuth) {
        saveCardForFuture.value = false;
      }
    }, { immediate: true });
    
    const bookingDetails = computed<BookingDetails[]>(() => {
      return bookingStore.currentBooking;
    });

    const totalAmount = computed<number>(() => {
      return bookingDetails.value.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
    });

    // Final amount after points discount
    const finalAmount = computed<number>(() => {
      return Math.max(0, totalAmount.value - pointsDiscount.value);
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
        return parseFloat(booking.booking?.duration || '1');
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
        const duration = parseFloat(booking.booking?.duration || '1');
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

    // Format subscription dates for dedicated desk display
    function formatSubscriptionDates(booking: BookingDetails): string {
      const startDate = booking.subscription?.startDate;
      const endDate = booking.subscription?.endDate;

      if (!startDate || !endDate) {
        return 'Dates not specified';
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };

      const startFormatted = start.toLocaleDateString('en-US', formatOptions);
      const endFormatted = end.toLocaleDateString('en-US', formatOptions);

      return `${startFormatted} - ${endFormatted}`;
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
      const duration = parseFloat(booking.booking.duration);

      if (isNaN(duration)) {
        return startTime;
      }

      // Calculate end time using minutes for accurate fractional hour handling
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalStartMinutes = hours * 60 + minutes;
      const durationMinutes = duration * 60;
      const totalEndMinutes = totalStartMinutes + durationMinutes;

      const endHours = Math.floor(totalEndMinutes / 60);
      const endMinutes = totalEndMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

      return `${startTime} - ${endTime} (${duration}h)`;
    }

    // Load saved payment methods
    async function loadSavedCards(): Promise<void> {
      try {
        const user = authStore.user;
        if (!user?.id) {
          // User not logged in, only show add new card option
          savedCards.value = [];
          selectedPaymentMethod.value = 'new-card';
          return;
        }

        const response = await apiManager.getPaymentMethods(user.id);
        console.log('Payment methods response:', response);
        
        if (response.success && response.paymentMethods.length > 0) {
          savedCards.value = response.paymentMethods;
          
          // Debug: Log each card's details to verify wallet_id is present
          savedCards.value.forEach(card => {
            console.log(`Card ID: ${card.id}, Wallet ID: ${card.wallet_id}, Type: ${card.card_type}, Brand: ${card.brand}`);
          });
          
          // Select the default card or first card
          const defaultCard = savedCards.value.find(card => card.is_default);
          selectedPaymentMethod.value = defaultCard?.id || savedCards.value[0].id;
          
          // Log the selected card
          console.log('Selected card ID:', selectedPaymentMethod.value);
        } else {
          // No saved cards, show add new card option
          savedCards.value = [];
          selectedPaymentMethod.value = 'new-card';
        }
      } catch (error) {
        console.error('Error loading saved cards:', error);
        // No fallback to demo cards, just show add new card option
        savedCards.value = [];
        selectedPaymentMethod.value = 'new-card';
      } finally {
        loading.value = false;
      }
    }

    // Load user's billing address from API
    // Load billing address from user details
    async function loadBillingAddress(): Promise<void> {
      const user = authStore.user;
      if (user) {
        // Use the user details directly
        billingAddress.value = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || ''
        };
      } else {
        // Try to populate from guest info if available in booking store
        // Guest info is stored in each booking item
        if (bookingStore.currentBooking.length > 0) {
          // Get the first booking with guest info
          const bookingWithGuestInfo = bookingStore.currentBooking.find(booking => booking.guestInfo);
          if (bookingWithGuestInfo?.guestInfo) {
            billingAddress.value = {
              firstName: bookingWithGuestInfo.guestInfo.firstName || '',
              lastName: bookingWithGuestInfo.guestInfo.lastName || '',
              email: bookingWithGuestInfo.guestInfo.email || '',
              phone: bookingWithGuestInfo.guestInfo.phone || ''
            };
          }
        }
      }
    }

    // Create new card session and process booking
    async function createNewCardSession(): Promise<void> {
      try {
        processing.value = true;

        // Add recaptcha token to all API requests for verification on backend
        ApiManager.setAuthHeader('X-Recaptcha-Token', recaptchaToken.value);

        // Get all bookings
        const allBookings = bookingDetails.value;
        if (!allBookings || allBookings.length === 0) {
          alert('No booking details found');
          return;
        }

        // Build booking_products array
        const bookingProducts = allBookings.map(bookingDetail => {
          let bookingDate = '';
          let startTime = '';
          let endTime = '';
          let facilities: Array<{ facility_id: number; price: number }> = [];

          if (bookingDetail.productType === 'meeting-room' || bookingDetail.productType === 'hot-desk') {
            // For meeting rooms and hot desks
            bookingDate = bookingDetail.booking?.startDate || '';
            startTime = bookingDetail.booking?.startTime || '';

            // For hot desks, use the end time directly from booking details
            if (bookingDetail.productType === 'hot-desk') {
              endTime = bookingDetail.booking?.endTime || '';
            } else {
              // For meeting rooms, calculate end time based on start time and duration
              if (startTime && bookingDetail.booking?.duration) {
                const durationHours = parseFloat(bookingDetail.booking.duration);
                if (!isNaN(durationHours)) {
                  const [hours, minutes] = startTime.split(':').map(Number);
                  const totalStartMinutes = hours * 60 + minutes;
                  const durationMinutes = durationHours * 60;
                  const totalEndMinutes = totalStartMinutes + durationMinutes;

                  const endHours = Math.floor(totalEndMinutes / 60);
                  const endMinutes = totalEndMinutes % 60;
                  endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                } else {
                  endTime = startTime; // Fallback if duration parsing fails
                }
              } else {
                endTime = startTime; // Fallback if no duration
              }
            }

            // Map facility names to IDs and prices using space facility data
            if (bookingDetail.facilities && bookingDetail.facilities.length > 0) {
              const allFacilities = [
                ...(bookingDetail.space.additional_facilities || []),
                ...(bookingDetail.space.default_facilities || []),
                ...(bookingDetail.space.facilities || [])
              ];

              // Calculate price per facility
              const totalFacilitiesPrice = bookingDetail.pricing?.facilitiesPrice || 0;
              const pricePerFacility = bookingDetail.facilities.length > 0 ?
                Math.round(totalFacilitiesPrice / bookingDetail.facilities.length) : 0;

              facilities = bookingDetail.facilities
                .map(facilityName => {
                  const facility = allFacilities.find(f =>
                    f.facility_name.toLowerCase() === facilityName.toLowerCase()
                  );
                  return facility ? {
                    facility_id: facility.facility_id,
                    price: pricePerFacility
                  } : null;
                })
                .filter(f => f !== null) as Array<{ facility_id: number; price: number }>;
            }
          } else if (bookingDetail.productType === 'dedicated-desk') {
            // For dedicated desks - subscription-based
            return {
              product_id: bookingDetail.spaceId,
              subscription_start_date: bookingDetail.subscription?.startDate || '',
              subscription_end_date: bookingDetail.subscription?.endDate || '',
              package_type: bookingDetail.subscription?.packageType || 'monthly',
              booking_date: bookingDetail.subscription?.startDate || '', // Keep for backward compatibility
              total_price: bookingDetail.pricing?.basePrice || 0,
              facilities: []
            };
          }

          // Return for meeting-room and hot-desk
          return {
            product_id: bookingDetail.spaceId,
            booking_date: bookingDate,
            start_time: startTime,
            end_time: endTime,
            total_price: bookingDetail.pricing?.basePrice || 0,
            facilities: facilities
          };
        });

        // Construct payload with multiple products
        const paymentPayload = {
          first_name: billingAddress.value.firstName || '',
          last_name: billingAddress.value.lastName || '',
          email: billingAddress.value.email || '',
          phone: billingAddress.value.phone || '',
          user_id: authStore.user?.id,

          is_card_add: saveCardForFuture.value, // True if user wants to save the card
          amount: totalAmount.value, // Send full amount before points deduction
          reward_amount: pointsToUse.value, // Send points used as reward_amount

          booking_products: bookingProducts
        };

        console.log('Payment payload being sent:', paymentPayload);

        const response = await apiManager.processCardPayment(paymentPayload);

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
      if (!isPaymentFormValid.value) {
        console.log('Payment form is not valid');
        return;
      }

      console.log('Processing payment with selected method:', selectedPaymentMethod.value);
      
      // If using an existing card, proceed directly without reCAPTCHA
      if (selectedPaymentMethod.value !== 'new-card') {
        console.log('Using existing card:', selectedPaymentMethod.value);
        const selectedCard = savedCards.value.find(card => card.id === selectedPaymentMethod.value);
        console.log('Selected card details:', selectedCard);
        
        await processExistingCardPayment();
      } else {
        // Only show reCAPTCHA for new card addition
        console.log('Adding new card, showing reCAPTCHA');
        showReCaptcha.value = true;
      }
    }

    // Handle successful reCAPTCHA verification
    async function handleCaptchaVerified(token: string): Promise<void> {
      recaptchaToken.value = token;
      showReCaptcha.value = false;

      // Process payment after successful verification - only for new card
      await createNewCardSession();
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
      // Show payment processing overlay
      ipgProcessing.value = true;
      processingStep.value = 'payment';

      try {
        // For saved cards, we don't need reCAPTCHA token
        // We're using the card that's already been verified previously

        // Get all bookings
        const allBookings = bookingDetails.value;
        if (!allBookings || allBookings.length === 0) {
          alert('No booking details found');
          return;
        }

        // Build booking_products array
        const bookingProducts = allBookings.map(bookingDetail => {
          let bookingDate = '';
          let startTime = '';
          let endTime = '';
          let facilities: Array<{ facility_id: number; price: number }> = [];

          if (bookingDetail.productType === 'meeting-room' || bookingDetail.productType === 'hot-desk') {
            bookingDate = bookingDetail.booking?.startDate || '';
            startTime = bookingDetail.booking?.startTime || '';

            // For hot desks, use the end time directly from booking details
            if (bookingDetail.productType === 'hot-desk') {
              endTime = bookingDetail.booking?.endTime || '';
            } else {
              // For meeting rooms, calculate end time based on start time and duration
              if (startTime && bookingDetail.booking?.duration) {
                const durationHours = parseFloat(bookingDetail.booking.duration);
                if (!isNaN(durationHours)) {
                  const [hours, minutes] = startTime.split(':').map(Number);
                  const totalStartMinutes = hours * 60 + minutes;
                  const durationMinutes = durationHours * 60;
                  const totalEndMinutes = totalStartMinutes + durationMinutes;

                  const endHours = Math.floor(totalEndMinutes / 60);
                  const endMinutes = totalEndMinutes % 60;
                  endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                } else {
                  endTime = startTime;
                }
              } else {
                endTime = startTime;
              }
            }

            // Map facility names to IDs and prices using space facility data
            if (bookingDetail.facilities && bookingDetail.facilities.length > 0) {
              const allFacilities = [
                ...(bookingDetail.space.additional_facilities || []),
                ...(bookingDetail.space.default_facilities || []),
                ...(bookingDetail.space.facilities || [])
              ];

              // Calculate price per facility
              const totalFacilitiesPrice = bookingDetail.pricing?.facilitiesPrice || 0;
              const pricePerFacility = bookingDetail.facilities.length > 0 ?
                Math.round(totalFacilitiesPrice / bookingDetail.facilities.length) : 0;

              facilities = bookingDetail.facilities
                .map(facilityName => {
                  const facility = allFacilities.find(f =>
                    f.facility_name.toLowerCase() === facilityName.toLowerCase()
                  );
                  return facility ? {
                    facility_id: facility.facility_id,
                    price: pricePerFacility
                  } : null;
                })
                .filter(f => f !== null) as Array<{ facility_id: number; price: number }>;
            }
          } else if (bookingDetail.productType === 'dedicated-desk') {
            bookingDate = bookingDetail.subscription?.startDate || '';
            startTime = '09:00';
            endTime = '18:00';
            facilities = [];
          }

          return {
            product_id: bookingDetail.spaceId,
            booking_date: bookingDate, // Send ISO date format: "2025-09-23" (yyyy-MM-dd)
            start_time: startTime,
            end_time: endTime,
            total_price: bookingDetail.pricing?.basePrice || 0,
            facilities: facilities,
            // Add subscription properties for dedicated desk
            ...(bookingDetail.productType === 'dedicated-desk' && {
              subscription_start_date: bookingDetail.subscription?.startDate || '',
              subscription_end_date: bookingDetail.subscription?.endDate || '',
              package_type: bookingDetail.subscription?.packageType || 'monthly'
            })
          };
        });

        // Find the selected card from the savedCards array
        const selectedCard = savedCards.value.find(card => card.id === selectedPaymentMethod.value);
        
        if (!selectedCard || !selectedCard.wallet_id) {
          alert('Selected card information is incomplete. Please try again or select a different card.');
          return;
        }
        
        // Construct payload for existing card payment
        const paymentPayload = {
          first_name: billingAddress.value.firstName || '',
          last_name: billingAddress.value.lastName || '',
          email: billingAddress.value.email || '',
          phone: billingAddress.value.phone || '',
          user_id: authStore.user?.id,
          is_card_add: false,
          amount: totalAmount.value, // Send full amount before points deduction
          reward_amount: pointsToUse.value, // Send points used as reward_amount
          booking_products: bookingProducts,
          // Add wallet_id and card_id for saved card payment
          wallet_id: String(selectedCard.wallet_id),
          card_id: String(selectedCard.id),
          currency: 'LKR' // Default currency or get from configuration
        };

        console.log('Payment payload being sent:', paymentPayload);

        console.log('Calling processSavedCardPayment with payload:', paymentPayload);
        const response = await apiManager.processSavedCardPayment(paymentPayload);
        console.log('Saved card payment API response:', response);
        
        // CRITICAL FIX: Handle different response structure for saved card payments
        // Debug log the exact structure to diagnose issues
        console.log('Raw payment response structure:', JSON.stringify(response));

        if (response.success) {
          // For saved card payment, there's no redirect link but transaction might still be successful
          
          // Store payment and booking data for confirmation page
          const paymentResultData = {
            success: true,
            message: response.message,
            bookingDetails: bookingDetails.value,
            paymentInfo: {
              status: 'SUCCESS',
              message: 'Approved',
              id: Date.now(), // Generate a temporary ID if not available
              amount: totalAmount.value
            },
            paymentDate: new Date().toISOString(),
            cardInfo: {
              cardNumber: selectedCard.card_number,
              cardType: selectedCard.card_type,
              brand: selectedCard.brand
            },
            isGuest: !authStore.user,
            isCardSaved: false, // Existing card, not newly saved
            savedNewCard: false,
            orderId: '', // We'll set this from the API response
            invoiceData: null as any // Using any type to avoid TypeScript errors
          };
          
          // Extract order_id and other details from the response
          let orderId = '';
          
          // CRITICAL FIX: Check both in response.gatewayData and response.data for the order_id
          console.log('Extracting order_id from response, full response:', response);
          
          try {
            // Use type assertion to bypass TypeScript checks
            const responseAny = response as any;
            
            // First check the structure from your specific API response format
            if (responseAny.data && responseAny.data.order_id) {
              orderId = responseAny.data.order_id;
              paymentResultData.orderId = responseAny.data.order_id;
              console.log('Found order_id directly in response.data.order_id:', orderId);
            }
            // Then try with gatewayData if that exists
            else if (response.gatewayData) {
              const responseData = response.gatewayData as any;
              console.log('Full gateway response data:', responseData);
              
              // Check various possible paths for order_id
              if (responseData.data && responseData.data.order_id) {
                orderId = responseData.data.order_id;
                paymentResultData.orderId = responseData.data.order_id;
                console.log('Found order_id in response.gatewayData.data.order_id:', orderId);
              } 
              else if (responseData.data && responseData.data.transaction && responseData.data.transaction.order_id) {
                orderId = responseData.data.transaction.order_id;
                paymentResultData.orderId = responseData.data.transaction.order_id;
                console.log('Found order_id in transaction.order_id:', orderId);
              }
            }
            
            // If still no order_id, try to find it in any property
            if (!orderId) {
              console.log('No direct order_id found, searching all properties recursively');
              
              // Helper function to search for order_id recursively in an object
              const findOrderId = (obj: any, path = ''): string | null => {
                if (!obj || typeof obj !== 'object') return null;
                
                for (const key in obj) {
                  const currentPath = path ? `${path}.${key}` : key;
                  
                  // Check if this key is order_id
                  if (key === 'order_id' && obj[key]) {
                    console.log(`Found order_id at path: ${currentPath}:`, obj[key]);
                    return obj[key];
                  }
                  
                  // Recursively check nested objects
                  if (obj[key] && typeof obj[key] === 'object') {
                    const result = findOrderId(obj[key], currentPath);
                    if (result) return result;
                  }
                }
                
                return null;
              };
              
              // Search for order_id in the entire response
              const foundOrderId = findOrderId(response);
              if (foundOrderId) {
                orderId = foundOrderId;
                paymentResultData.orderId = foundOrderId;
                console.log('Found order_id through recursive search:', orderId);
              }
            }
            
            // Also extract transaction details if available
            if (responseAny.data && responseAny.data.transaction) {
              paymentResultData.paymentInfo = responseAny.data.transaction;
              console.log('Updated payment info from transaction data:', responseAny.data.transaction);
            }
            
            // Extract card info if available
            if (responseAny.data && responseAny.data.card && responseAny.data.card.number) {
              paymentResultData.cardInfo.cardNumber = responseAny.data.card.number;
              console.log('Updated card number from response:', responseAny.data.card.number);
            }
            
            // Debug log to make sure we're getting the order ID
            console.log('Final extracted orderId:', orderId);
            console.log('Payment result data orderId:', paymentResultData.orderId);
          } catch (e) {
            console.error('Could not parse transaction details from response:', e);
            console.error('Error details:', e);
          }
          
          // Wait for 1 second to simulate initial payment processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update processing step to invoice fetching
          processingStep.value = 'invoice';
          
          // CRITICAL FIX: Check for order_id in the response first, even before checking orderId variable
          // Use type assertion to bypass TypeScript checks
          const responseAny = response as any;
          
          // First try to get order_id from the API response format you provided
          if (responseAny.data && responseAny.data.order_id) {
            console.log('Found order_id directly in API response format:', responseAny.data.order_id);
            orderId = responseAny.data.order_id;
            paymentResultData.orderId = responseAny.data.order_id;
          }
          
          // If we have a valid order_id (either from earlier extraction or direct API response)
          if (orderId) {
            try {
              console.log('Fetching invoice for order ID:', orderId);
              
              // DEBUG: Log the actual response structure
              console.log('Response object structure:', JSON.stringify(response));
              
              // Ensure we're sending the exact order_id format from the API without any modifications
              console.log('Final order_id being sent to invoice API:', orderId);
              const invoiceResponse = await apiManager.getInvoice(orderId);
              
              console.log('Invoice API response:', invoiceResponse);
              
              if (invoiceResponse.success && invoiceResponse.data) {
                console.log('Invoice data retrieved successfully:', invoiceResponse.data);
                // Add invoice data to payment result
                paymentResultData.invoiceData = invoiceResponse.data;
              } else {
                console.warn('Failed to retrieve invoice:', invoiceResponse.message);
                // Log more details about why the invoice API call failed
                console.warn('Invoice API call parameters:', { orderId });
                // TypeScript error fix - statusCode might not exist on the response
                console.warn('Response details:', invoiceResponse);
              }
            } catch (error) {
              console.error('Error fetching invoice:', error);
              console.error('Error details:', error);
            }
          } else {
            console.warn('No order ID available to fetch invoice - the payment response did not contain an order_id');
            
            // Try to construct a placeholder order ID if we must
            if (paymentResultData.paymentInfo && paymentResultData.paymentInfo.id) {
              const fallbackOrderId = `ORDER-${paymentResultData.paymentInfo.id}`;
              console.warn('Creating fallback order ID:', fallbackOrderId);
              // Set the fallback order ID in the payment result data
              paymentResultData.orderId = fallbackOrderId;
              
              console.warn('Not attempting API call with fallback ID to avoid errors');
            }
          }
          
          // Update processing step to finalizing
          processingStep.value = 'finalizing';
          
          // Store payment result in session storage
          sessionStorage.setItem('payment_result', JSON.stringify(paymentResultData));
          
          // Clear booking data to prevent double-payment if user navigates back
          if (bookingStore.clearBookingDetails) {
            console.log('Clearing booking details after successful payment');
            bookingStore.clearBookingDetails();
          }
          
          // Wait for 1 more second before redirecting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Redirect to booking confirmation page
          router.push('/booking-confirmation');
          
        } else {
          console.error('Failed to process payment with saved card:', response);
          alert(response.message || 'Failed to process payment');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        alert('Payment processing failed. Please try again.');
        // Hide processing overlay on error
        ipgProcessing.value = false;
        // Reset processing step
        processingStep.value = 'payment';
      } finally {
        processing.value = false;
        // Note: We don't hide ipgProcessing here on success because 
        // we want to keep showing it until redirect or it will flash
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
      // Debug log to see what data is coming from the payment gateway
      console.log('Payment gateway message received:', event.data);
      
      // Verify origin for security (you should replace with your actual gateway domain)
      // if (event.origin !== 'https://your-gateway-domain.com') return;

      if (event.data && event.data.type === 'payment_complete') {
        // Payment completed successfully
        showPaymentGateway.value = false;
        gatewayUrl.value = '';
        processing.value = false;
        
        console.log('Payment completed successfully. Response:', event.data);
        
        // Store payment result data in sessionStorage
        const paymentResultData = {
          success: true,
          orderId: event.data.orderId || event.data.order_id || '',
          desc: 'Payment processed successfully',
          status: 'SUCCESS',
          isCardAddition: false,
          isGuest: !isAuthenticated.value, // Add flag to identify guest users
          trnId: event.data.trnId || event.data.transactionId || null,
          bookingData: bookingDetails.value
        };
        
        console.log('Storing payment result:', paymentResultData);
        sessionStorage.setItem('payment_result', JSON.stringify(paymentResultData));
        
        // Clear booking data so floating summary and summary page are reset
        if (bookingStore.clearBookingDetails) bookingStore.clearBookingDetails();
        
        // Navigate to confirmation page
        router.push('/booking-confirmation');
      } else if (event.data && event.data.type === 'payment_failed') {
        // Payment failed
        console.log('Payment failed. Response:', event.data);
        
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
      await Promise.all([
        loadSavedCards(),
        loadBillingAddress()
      ]);

      // Check for IPG return query parameters
      const query = route.query;
      console.log('IPG Return Query Parameters:', query);
      
      if (query.desc && query.status && query.orderId) {
        // Set IPG processing state to show loading overlay
        ipgProcessing.value = true;

        // Handle both regular payment success and card addition success
        // Regular payment: desc = "Approved", status = "SUCCESS"
        // Card addition: desc = "Card Adding Successful", status = "SUCCESS"
        
        // Debug: Log raw values first
        console.log('Query desc:', query.desc, 'type:', typeof query.desc);
        console.log('Query status:', query.status, 'type:', typeof query.status);
        
        // Fix: Normalize string comparisons to handle potential case or whitespace issues
        const normalizedDesc = String(query.desc || '').trim();
        const normalizedStatus = String(query.status || '').trim().toUpperCase();
        
        // CRITICAL FIX: Force success to true when status is SUCCESS regardless of description
        // This is the key fix based on the session storage showing success: false with status: SUCCESS
        const isSuccess = normalizedStatus === 'SUCCESS';
        const isCardAdditionSuccess = normalizedDesc.includes('Card Adding Successful') && normalizedStatus === 'SUCCESS';
        
        console.log('Payment processing - Success:', isSuccess);
        console.log('Payment processing - Card Addition:', isCardAdditionSuccess);

        // Store payment result and data in sessionStorage
        const paymentResultData = {
          success: isSuccess, // Ensure this is a boolean
          orderId: query.orderId,
          desc: query.desc,
          status: query.status,
          isCardAddition: isCardAdditionSuccess,
          isGuest: !isAuthenticated.value, // Add flag to identify guest users
          trnId: query.trnId || null,
          // Store booking data for retry or confirmation
          bookingData: bookingDetails.value
        };
        
        console.log('Storing payment result:', paymentResultData);
        
        // Force clear and reset to ensure clean data
        sessionStorage.removeItem('payment_result');
        
        try {
          sessionStorage.setItem('payment_result', JSON.stringify(paymentResultData));
          
          // Verify it was set correctly
          const checkData = sessionStorage.getItem('payment_result');
          if (checkData) {
            const parsed = JSON.parse(checkData);
            console.log('Verified storage success value:', parsed.success);
            
            // CRITICAL FIX: If the success value doesn't match what we expect, try again
            if (parsed.success !== isSuccess) {
              console.warn('Storage verification failed - recreating with correct boolean');
              // Create a new object to avoid type issues
              const fixedPaymentResult = {
                ...paymentResultData,
                success: isSuccess  // Keep as boolean
              };
              sessionStorage.setItem('payment_result', JSON.stringify(fixedPaymentResult));
            }
          }
        } catch (error) {
          console.error('Error setting session storage:', error);
        }

        // Add a small delay to ensure loading overlay is visible
        setTimeout(async () => {
          if (isSuccess) {
            // Clear booking data on success
            if (bookingStore.clearBookingDetails) {
              bookingStore.clearBookingDetails();
              console.log('Booking data cleared successfully');
            } else {
              console.warn('bookingStore.clearBookingDetails is not available');
            }
            
            // Double check what's stored in session storage
            try {
              const checkStorage = sessionStorage.getItem('payment_result');
              console.log('Verified payment_result in sessionStorage:', checkStorage ? 'Present' : 'Missing');
              console.log('Session storage data type:', typeof checkStorage);
              // Parse and validate the data
              if (checkStorage) {
                const parsed = JSON.parse(checkStorage);
                console.log('Storage success value after parsing:', parsed.success);
              }
            } catch (e) {
              console.error('Error checking session storage:', e);
            }
            
            console.log('Redirecting to confirmation page with success:', isSuccess);
          } else {
            console.log('Payment was not successful, redirecting to confirmation page to show failure');
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
      finalAmount,
      pointsToUse,
      pointsDiscount,
      currentUser,
      userRewardPoints,
      handlePointsChange,
      isPaymentFormValid,
      formatBookingDate,
      getBasePriceLabel,
      getBasePricePerUnit,
      getMultiplier,
      getMultiplierLabel,
      getFacilityPricePerUnit,
      formatSubscriptionDates,
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
      isAuthenticated, // Add the isAuthenticated computed property
      processingStep, // Add processingStep for the loading overlay
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
.peer:checked~label .peer-checked\:border-primary {
  border-color: var(--color-primary);
}

.peer:checked~label .peer-checked\:bg-primary {
  background-color: var(--color-primary);
}

.peer:checked~label .peer-checked\:opacity-100 {
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

/* Price alignment styles */
.price-value {
  min-width: 110px;
  text-align: right;
  white-space: nowrap;
}
</style>
