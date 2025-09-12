<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 relative">

    
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
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </h2>
            <div class="space-y-4">
              <template v-if="authStore.user">
                <!-- Saved Cards -->
                <div v-for="card in savedCards" :key="card.id" class="relative">
                  <input 
                    :id="`card-${card.id}`"
                    v-model="selectedPaymentMethod" 
                    :value="card.id"
                    type="radio" 
                    name="payment-method"
                    class="sr-only peer"
                  >
                  <label 
                    :for="`card-${card.id}`"
                    class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl border-2 border-transparent cursor-pointer transition-all duration-300 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-650 peer-checked:border-primary peer-checked:from-blue-50 peer-checked:to-indigo-50 dark:peer-checked:from-blue-900/20 dark:peer-checked:to-indigo-900/20"
                  >
                    <div class="flex items-center space-x-4 w-full">
                      <!-- Card Icon -->
                      <div class="flex-shrink-0">
                        <div :class="[
                          'w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold',
                          card.card_type === 'VISA' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                          card.card_type === 'MASTERCARD' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                          card.card_type === 'AMEX' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          'bg-gradient-to-r from-gray-600 to-gray-700'
                        ]">
                          {{ card.card_type }}
                        </div>
                      </div>
                      <!-- Card Details -->
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ card.card_number }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Expires {{ card.expiry_month }}/{{ card.expiry_year }}</p>
                          </div>
                          <div v-if="card.is_default" class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                            Default
                          </div>
                        </div>
                      </div>
                      <!-- Radio Circle -->
                      <div class="flex-shrink-0">
                        <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-primary peer-checked:bg-primary relative">
                          <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"></div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                <!-- Add New Card Option -->
                <div class="relative">
                  <input 
                    id="add-new-card"
                    v-model="selectedPaymentMethod" 
                    value="new-card"
                    type="radio" 
                    name="payment-method"
                    class="sr-only peer"
                  >
                  <label 
                    for="add-new-card"
                    class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:border-primary hover:from-primary/10 hover:to-primary/20 dark:hover:from-primary/20 dark:hover:to-primary/30 peer-checked:border-primary peer-checked:from-primary/10 peer-checked:to-primary/20 dark:peer-checked:from-primary/20 dark:peer-checked:to-primary/30"
                  >
                    <div class="flex items-center space-x-4 w-full">
                      <!-- Plus Icon -->
                      <div class="flex-shrink-0">
                        <div class="w-12 h-8 rounded-lg bg-primary to-blue-600 flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                      <!-- Add Card Text -->
                      <div class="flex-1">
                        <p class="font-medium text-gray-900 dark:text-white">Add new card</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Securely add a new payment method</p>
                      </div>
                      <!-- Radio Circle -->
                      <div class="flex-shrink-0">
                        <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-primary peer-checked:bg-primary relative">
                          <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"></div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                <!-- Save Card for Future Checkbox (only for new card) -->
                <div v-if="selectedPaymentMethod === 'new-card'" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-black dark:border-white">
                  <label class="flex items-center cursor-pointer">
                    <input 
                      v-model="saveCardForFuture" 
                      type="checkbox" 
                      class="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    >
                    <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Save this card for future payments
                    </span>
                  </label>
                  <p class="ml-8 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your card details will be securely stored for faster checkout
                  </p>
                </div>
              </template>
              <template v-else>
                <!-- Guest: Only show pay with card, no save, no cards -->
                <div class="relative">
                  <label class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-300">
                    <div class="flex items-center space-x-4 w-full">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-8 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-900 dark:text-white">Pay with Card</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Enter your card details to pay securely</p>
                      </div>
                    </div>
                  </label>
                </div>
              </template>
            </div>
          </div>

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
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50/50 to-transparent dark:from-blue-900/20 rounded-bl-full"></div>
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
                        {{ booking.subscription?.teamSize || 'N/A' }} people
                      </span>
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ booking.booking?.startTime && booking.booking?.duration ? `${booking.booking.startTime} (${booking.booking.duration})` : 'Full day' }}
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
                <div v-for="booking in bookingDetails" :key="booking.uniqueKey || booking.spaceId" class="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:mb-0 last:pb-0 last:border-0">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">{{ booking.space?.name }} (Base)</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.basePrice?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>
                  <div v-if="booking.pricing?.facilitiesPrice && booking.pricing?.facilitiesPrice > 0" class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Add-on Services</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.facilitiesPrice?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>
                  <div v-if="booking.pricing?.serviceFee && booking.pricing?.serviceFee > 0" class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Service Fee</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.serviceFee?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>
                  <div v-if="booking.pricing?.taxes && booking.pricing?.taxes > 0" class="flex justify-between text-sm mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Taxes</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ booking.pricing?.taxes?.toFixed(2) || (0).toFixed(2) }}</span>
                  </div>
                </div>
                <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between font-medium">
                    <span class="text-gray-900 dark:text-white">Total</span>
                    <span class="text-gray-900 dark:text-white">LKR {{ totalAmount.toFixed(2) }}</span>
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
            
            <!-- Payment security badges -->
            <div class="mt-6 flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6">
              <div class="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">SSL Secured</span>
              </div>
              <div class="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">PCI Compliant</span>
              </div>
            </div>

            <!-- Security features -->
            <div class="mt-6 space-y-3">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs text-gray-600 dark:text-gray-400">Instant confirmation</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs text-gray-600 dark:text-gray-400">Secure payment processing</span>
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
import { useRouter } from 'vue-router';
import { NetworkManager } from '../api/networkManager';
import type { BookingDetails } from '../stores/booking';

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
  
  setup() {
    const processing = ref(false);
    const selectedPaymentMethod = ref<string | number>('');
    const saveCardForFuture = ref(true);
    const showGatewayModal = ref(false);
    const gatewayUrl = ref('');
    const savedCards = ref<SavedCard[]>([]);
    const loading = ref(true);
    
    const router = useRouter();
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
    
    // Create new card session
    async function createNewCardSession(): Promise<void> {
      try {
        processing.value = true;
        const response = await NetworkManager.addNewCard({
          first_name: billingAddress.value.firstName,
          last_name: billingAddress.value.lastName,
          email: billingAddress.value.email,
          phone: billingAddress.value.phone,
          is_card_add: saveCardForFuture.value
        });
        if (response.success && response.gatewayData?.link) {
          // Redirect to full-page payment gateway
          router.push({
            name: 'PaymentGateway',
            query: { link: response.gatewayData.link }
          });
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
      
      if (selectedPaymentMethod.value === 'new-card') {
        await createNewCardSession();
      } else {
        // Use existing card
        await processExistingCardPayment();
      }
    }
    
    // Process payment with existing card
    async function processExistingCardPayment(): Promise<void> {
      processing.value = true;
      
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create booking confirmation
        const bookingId = 'WS' + Date.now().toString().slice(-8);
        const confirmationData = {
          bookings: bookingDetails.value,
          bookingId,
          paymentMethod: 'card',
          cardInfo: {
            number: savedCards.value.find(card => card.id === selectedPaymentMethod.value)?.card_number || '',
            type: savedCards.value.find(card => card.id === selectedPaymentMethod.value)?.card_type || ''
          },
          confirmedAt: new Date().toISOString(),
          totalAmount: totalAmount.value
        };
        
        sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
        bookingStore.clearBookingDetails();
        
        router.push({
          name: 'BookingConfirmation',
          params: { bookingId }
        });
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
      // Here you could listen for messages from the iframe
      // to handle payment completion
    }
    
    // Initialize on component mount
    onMounted(async () => {
      bookingStore.initializeBooking();
      await loadSavedCards();
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
  processPayment,
  closeGatewayModal,
  onGatewayLoad,
  router,
  autofillUserDetails,
  authStore
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
</style>
