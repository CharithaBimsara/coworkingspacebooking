<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-8xl mx-auto container-padding py-8">
      <!-- Progress indicator with labels -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center mb-2">
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full text-sm font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 mt-2">Details</span>
          </div>
          <div class="w-20 h-1 bg-green-500 mx-2"></div>
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full text-sm font-semibold shadow-md">
              <span>2</span>
            </div>
            <span class="text-xs font-medium text-primary mt-2">Payment</span>
          </div>
          <div class="w-20 h-1 bg-gray-300 mx-2"></div>
          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full text-sm font-semibold">
              <span>3</span>
            </div>
            <span class="text-xs font-medium text-gray-500 mt-2">Confirmation</span>
          </div>
        </div>
      </div>
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">Payment</h1>
        <p class="text-gray-600">Secure payment to complete your booking</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Payment Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Payment Gateway Placeholder (for future IPG integration) -->
          <div id="payment-gateway-container" class="hidden">
            <!-- This container will be used for third-party IPG integration -->
            <div id="ipg-mount-point"></div>
          </div>

          <!-- Custom Payment Form (will be replaced by IPG when implemented) -->
          <div id="custom-payment-form">
            <!-- Payment Method Selection -->
            <div class="bg-white rounded-xl p-6 shadow-card">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div class="space-y-4 mb-6">
                <div 
                  @click="paymentMethod = 'card'"
                  class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'"
                  role="radio"
                  :aria-checked="paymentMethod === 'card'"
                  tabindex="0"
                  @keydown.space.prevent="paymentMethod = 'card'"
                >
                  <input v-model="paymentMethod" value="card" type="radio" class="sr-only">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <span class="font-medium text-gray-900">Credit or Debit Card</span>
                        <p class="text-xs text-gray-500 mt-1">Secure and fast payment</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <div class="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        VISA
                      </div>
                      <div class="w-10 h-7 bg-gradient-to-r from-red-600 to-red-700 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        MC
                      </div>
                      <div class="w-10 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        AX
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  @click="paymentMethod = 'paypal'"
                  class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'"
                  role="radio"
                  :aria-checked="paymentMethod === 'paypal'"
                  tabindex="0"
                  @keydown.space.prevent="paymentMethod = 'paypal'"
                >
                  <input v-model="paymentMethod" value="paypal" type="radio" class="sr-only">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z" fill="#253B80"/>
                          <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z" fill="#179BD7"/>
                        </svg>
                      </div>
                      <div>
                        <span class="font-medium text-gray-900">PayPal</span>
                        <p class="text-xs text-gray-500 mt-1">Fast checkout with your PayPal account</p>
                      </div>
                    </div>
                    <div class="bg-blue-50 px-2 py-1 rounded text-xs text-blue-800 font-medium">
                      Recommended
                    </div>
                  </div>
                </div>

                <!-- Space for additional payment methods -->
                <div class="opacity-50 cursor-not-allowed">
                  <div class="flex items-center p-4 border-2 border-gray-200 rounded-lg">
                    <div class="flex items-center justify-between w-full">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <span class="font-medium text-gray-900">More payment options</span>
                          <p class="text-xs text-gray-500 mt-1">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

          <!-- Credit Card Form -->
          <div v-if="paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
            
            <form @submit.prevent="processPayment" class="space-y-5">
              <div>
                <label for="card-number" class="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                <div class="relative" :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'number'}">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    id="card-number"
                    v-model="cardInfo.number" 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    @input="formatCardNumber"
                    @focus="cardFocus = 'number'"
                    @blur="cardFocus = null"
                    class="input-field pl-10 pr-12 transition-all"
                    :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'number'}"
                    required
                    autocomplete="cc-number"
                  >
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all">
                    <div v-if="cardType" class="w-10 h-7 bg-gradient-to-r rounded text-white flex items-center justify-center text-xs font-bold shadow-sm" :class="cardTypeClass">
                      {{ cardType }}
                    </div>
                    <div v-else class="w-8 h-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p v-if="cardNumberError" class="mt-1 text-xs text-red-500">{{ cardNumberError }}</p>
                <div class="mt-1 flex gap-1">
                  <div class="w-12 h-1 bg-gray-200 rounded-full" :class="{'bg-green-500': cardInfo.number.length > 4}"></div>
                  <div class="w-12 h-1 bg-gray-200 rounded-full" :class="{'bg-green-500': cardInfo.number.length > 9}"></div>
                  <div class="w-12 h-1 bg-gray-200 rounded-full" :class="{'bg-green-500': cardInfo.number.length > 14}"></div>
                  <div class="w-12 h-1 bg-gray-200 rounded-full" :class="{'bg-green-500': cardInfo.number.length >= 19}"></div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="expiry-date" class="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <div class="relative" :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'expiry'}">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      id="expiry-date"
                      v-model="cardInfo.expiry" 
                      type="text" 
                      placeholder="MM/YY"
                      maxlength="5"
                      @input="formatExpiry"
                      @focus="cardFocus = 'expiry'"
                      @blur="validateExpiry"
                      class="input-field pl-10 transition-all"
                      :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'expiry'}"
                      required
                      autocomplete="cc-exp"
                    >
                  </div>
                  <p v-if="expiryError" class="mt-1 text-xs text-red-500">{{ expiryError }}</p>
                </div>
                <div>
                  <label for="cvv" class="block text-sm font-medium text-gray-700 mb-2">
                    <span>CVV *</span>
                    <span 
                      class="ml-1 inline-block" 
                      @mouseenter="showCvvTooltip = true"
                      @mouseleave="showCvvTooltip = false"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 inline cursor-help" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </label>
                  <div class="relative" :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'cvv'}">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      id="cvv"
                      v-model="cardInfo.cvv" 
                      type="text" 
                      placeholder="123"
                      maxlength="4"
                      @focus="cardFocus = 'cvv'"
                      @blur="cardFocus = null"
                      class="input-field pl-10 transition-all"
                      :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'cvv'}"
                      required
                      autocomplete="cc-csc"
                    >
                    <div v-if="showCvvTooltip" class="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-48 z-10">
                      3-4 digit security code found on the back of your card (or front for American Express)
                      <div class="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="cardholder-name" class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                <div class="relative" :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'name'}">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    id="cardholder-name"
                    v-model="cardInfo.name" 
                    type="text" 
                    placeholder="Full name on card"
                    @focus="cardFocus = 'name'"
                    @blur="cardFocus = null"
                    class="input-field pl-10 transition-all"
                    :class="{'border-primary ring-2 ring-primary/20': cardFocus === 'name'}"
                    required
                    autocomplete="cc-name"
                  >
                </div>
              </div>

              <!-- Card Preview -->
              <div class="relative w-full h-44 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden p-5 shadow-lg">
                <div class="absolute top-3 right-3">
                  <div v-if="cardType" class="w-10 h-7 bg-white rounded text-gray-800 flex items-center justify-center text-xs font-bold">
                    {{ cardType }}
                  </div>
                </div>
                <div class="h-10 flex items-center">
                  <div class="w-12 h-8">
                    <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M44 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H44C46.2091 28 48 26.2091 48 24V4C48 1.79086 46.2091 0 44 0Z" fill="#F9FAFB"/>
                      <rect x="8" y="12" width="6" height="4" rx="1" fill="#D1D5DB"/>
                    </svg>
                  </div>
                </div>
                <div class="mt-6 font-mono text-white text-lg tracking-wider">
                  {{ formattedCardNumberPreview }}
                </div>
                <div class="mt-4 flex justify-between">
                  <div class="text-xs text-gray-300">
                    <div class="uppercase tracking-wide">Card holder</div>
                    <div class="text-white">{{ cardInfo.name || 'YOUR NAME' }}</div>
                  </div>
                  <div class="text-xs text-gray-300">
                    <div class="uppercase tracking-wide">Expires</div>
                    <div class="text-white">{{ cardInfo.expiry || 'MM/YY' }}</div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Billing Address -->
          <div v-if="paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Billing Address</h3>
              <label class="flex items-center cursor-pointer">
                <input v-model="sameAsGuest" type="checkbox" class="form-checkbox h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary mr-2 transition-all">
                <span class="text-sm text-gray-600">Same as guest information</span>
              </label>
            </div>
            
            <div class="space-y-4" :class="{ 'opacity-50 pointer-events-none': sameAsGuest }">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <select 
                      id="country" 
                      v-model="billingAddress.country" 
                      class="input-field pl-10 appearance-none"
                      :disabled="sameAsGuest"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label for="zip-code" class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      id="zip-code"
                      v-model="billingAddress.zipCode" 
                      type="text" 
                      placeholder="12345"
                      class="input-field pl-10"
                      :disabled="sameAsGuest"
                      required
                    >
                  </div>
                </div>
              </div>
              
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    id="address"
                    v-model="billingAddress.address" 
                    type="text" 
                    placeholder="Street address"
                    class="input-field pl-10"
                    :disabled="sameAsGuest"
                    required
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    <input 
                      id="city"
                      v-model="billingAddress.city" 
                      type="text" 
                      placeholder="City"
                      class="input-field pl-10"
                      :disabled="sameAsGuest"
                      required
                    >
                  </div>
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <select 
                      id="state" 
                      v-model="billingAddress.state" 
                      class="input-field pl-10 appearance-none"
                      :disabled="sameAsGuest"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PayPal Container -->
          <div v-if="paymentMethod === 'paypal'" class="bg-white rounded-xl p-6 shadow-card">
            <div class="flex flex-col items-center justify-center py-8">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-.548 3.508-.024.078a.641.641 0 0 1-.633.54z" fill="#253B80"/>
                  <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.928c-.661 0-1.218.48-1.321 1.132L7.4 25.901c-.021.106-.1.21-.207.21H1.86c-.306 0-.545-.29-.472-.637L4.113 5.689c.08-.314.491-.689.926-.689h8.926c1.89 0 3.175.194 4.113.637 2.557 1.207 3.858 3.408 3.858 3.408s.264-1.656-1.888-1.378z" fill="#179BD7"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">PayPal</h3>
              <p class="text-gray-600 text-center mb-6">You'll be redirected to PayPal to complete your payment securely.</p>
              <!-- This div would be replaced by the PayPal SDK button in a real implementation -->
              <div class="w-full max-w-xs h-12 bg-blue-500 text-white font-medium rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                Continue to PayPal
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="bg-white rounded-xl p-6 shadow-card">
            <div class="flex items-center border-l-4 border-green-500 bg-green-50 p-4 rounded-r">
              <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-green-800">Your payment is secured with SSL encryption</p>
                <p class="text-xs text-green-700 mt-1">We never store your complete payment information</p>
              </div>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span class="text-xs text-gray-500">Secure payment</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="text-xs text-gray-500">Trusted platform</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span class="text-xs text-gray-500">Multiple payment methods</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <!-- Booking details -->
            <div v-if="bookingDetails.length > 0" class="space-y-5 mb-6">
              <div v-for="(booking, index) in bookingDetails" :key="index" class="group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div class="flex space-x-3">
                  <img 
                    v-if="booking.space && booking.space.images && booking.space.images.length > 0" 
                    :src="booking.space.images[0]" 
                    :alt="booking.space.name || 'Space Image'" 
                    class="w-20 h-20 rounded-lg object-cover shadow-sm group-hover:shadow transition-shadow"
                  >
                  <img 
                    v-else 
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Default Space Image" 
                    class="w-20 h-20 rounded-lg object-cover shadow-sm group-hover:shadow transition-shadow"
                  >
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">{{ booking.space?.name || 'Unknown Space' }}</h3>
                    <div class="flex items-center text-sm text-gray-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="truncate">{{ booking.space?.location || 'Unknown Location' }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ formatBookingDate(booking) }}</span>
                    </div>
                    <div class="text-sm font-medium text-primary mt-1">
                      ${{ booking.totalPrice || 0 }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center text-sm text-gray-700 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="font-medium">{{ primaryGuestName }}</span>
                </div>
              </div>
            </div>
            
            <!-- Price breakdown -->
            <div class="rounded-lg bg-gray-50 p-4 mb-6">
              <div class="space-y-3">
                <div v-for="(booking, index) in bookingDetails" :key="index" class="flex items-center justify-between text-sm">
                  <span class="text-gray-700">{{ booking.space.name }}</span>
                  <span class="font-medium">${{ booking.totalPrice || 0 }}</span>
                </div>
                
                <!-- Could add any additional fees here in the future -->
                <!--
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-700">Booking fee</span>
                  <span class="font-medium">$0.00</span>
                </div>
                -->
                
                <div class="border-t border-gray-200 pt-3 mt-3">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-900 font-medium">Total</span>
                    <span class="text-xl font-bold text-primary">${{ totalAmount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Complete Booking Button -->
            <button 
              @click="processPayment"
              :disabled="processing || !isPaymentFormValid"
              class="w-full flex items-center justify-center btn-primary text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] focus:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span v-if="processing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else class="flex items-center">
                <span>Complete Booking</span>
                <span class="ml-1">${{ totalAmount }}</span>
              </span>
            </button>

            <!-- Security features -->
            <div class="mt-6 space-y-3">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Money-back guarantee</p>
                  <p class="text-xs text-gray-500">Full refund if canceled within 24 hours</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Secure transaction</p>
                  <p class="text-xs text-gray-500">Your payment is protected by industry-standard encryption</p>
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
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useBookingStore } from '../stores/booking';
import { useRouter } from 'vue-router';
import type { BookingDetails } from '../stores/booking';

interface CardInfo {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface BillingAddress {
  country: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
}

export default defineComponent({
  name: 'PaymentPage',
  
  setup() {
    const processing = ref(false);
    const paymentMethod = ref('card');
    const sameAsGuest = ref(true);
    const cardFocus = ref<string | null>(null);
    const showCvvTooltip = ref(false);
    const cardNumberError = ref('');
    const expiryError = ref('');
    const router = useRouter();
    
    // Card information with demo values
    const cardInfo = ref<CardInfo>({
      number: '4242 4242 4242 4242',
      expiry: '12/25',
      cvv: '123',
      name: 'John Doe'
    });
    
    // Billing address with demo values
    const billingAddress = ref<BillingAddress>({
      country: 'US',
      zipCode: '94105',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA'
    });
    
    const bookingStore = useBookingStore();
    
    const bookingDetails = computed<BookingDetails[]>(() => {
      return bookingStore.currentBooking;
    });
    
    const totalAmount = computed<number>(() => {
      return bookingDetails.value.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
    });
    
    const primaryGuestName = computed<string>(() => {
      const guestInfo = bookingDetails.value[0]?.guestInfo;
      return guestInfo ? `${guestInfo.firstName} ${guestInfo.lastName}` : 'Demo User';
    });
    
    const cardType = computed<string | null>(() => {
      const number = cardInfo.value.number.replace(/\s/g, '');
      if (number.startsWith('4')) return 'VISA';
      if (/^5[1-5]/.test(number)) return 'MC';
      if (/^3[47]/.test(number)) return 'AX';
      return null;
    });
    
    const cardTypeClass = computed<string>(() => {
      switch (cardType.value) {
        case 'VISA': return 'from-blue-600 to-blue-700';
        case 'MC': return 'from-red-600 to-red-700';
        case 'AX': return 'from-blue-500 to-blue-600';
        default: return 'from-gray-400 to-gray-500';
      }
    });
    
    const formattedCardNumberPreview = computed<string>(() => {
      if (!cardInfo.value.number) {
        return '•••• •••• •••• ••••';
      }
      const masked = cardInfo.value.number.replace(/[^\s]/g, '•');
      const lastFour = cardInfo.value.number.slice(-5);
      return masked.slice(0, -5) + lastFour;
    });

    const isPaymentFormValid = computed<boolean>(() => {
      if (paymentMethod.value === 'paypal') return true;
      
      if (paymentMethod.value === 'card') {
        const isCardInfoValid = 
          cardInfo.value.number.length >= 19 &&
          cardInfo.value.expiry.length === 5 &&
          cardInfo.value.cvv.length >= 3 &&
          cardInfo.value.name.trim() !== '';
          
        if (sameAsGuest.value) return isCardInfoValid;
          
        return isCardInfoValid &&
          billingAddress.value.zipCode.trim() !== '' &&
          billingAddress.value.address.trim() !== '' &&
          billingAddress.value.city.trim() !== '' &&
          billingAddress.value.state.trim() !== '';
      }
      
      return false;
    });
    
    // Format card number input (add spaces)
    function formatCardNumber(event: Event): void {
      cardNumberError.value = '';
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 16) {
        value = value.slice(0, 16);
      }
      const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
      cardInfo.value.number = formattedValue;
    }
    
    // Format expiry date input (add /)
    function formatExpiry(event: Event): void {
      expiryError.value = '';
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      cardInfo.value.expiry = value;
    }
    
    // Validate expiry date
    function validateExpiry(): void {
      const expiryValue = cardInfo.value.expiry;
      if (expiryValue.length < 5) {
        expiryError.value = 'Please enter a valid expiry date';
        return;
      }
      
      const [monthStr, yearStr] = expiryValue.split('/');
      const month = parseInt(monthStr, 10);
      const year = 2000 + parseInt(yearStr, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      if (month < 1 || month > 12) {
        expiryError.value = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        expiryError.value = 'Card has expired';
      } else {
        expiryError.value = '';
      }
    }
    
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
    
    // Initialize integration with payment gateway
    function initializePaymentGateway(): void {
      // This would be where you'd initialize a third-party payment gateway
      // For example:
      // if (window.PaymentGatewaySDK) {
      //   window.PaymentGatewaySDK.initialize({
      //     apiKey: 'your-api-key',
      //     containerId: 'payment-gateway-container',
      //     onSuccess: handlePaymentSuccess,
      //     onError: handlePaymentError
      //   });
      // }
      
      console.log('Payment gateway initialization would happen here');
    }
    
    // Process payment
    async function processPayment(): Promise<void> {
      if (!isPaymentFormValid.value) return;
      
      processing.value = true;
      
      try {
        // This is where you would integrate with the payment gateway
        // For demonstration purposes, we'll simulate a successful payment
        // In a real implementation, you'd use the payment gateway's SDK/API
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (paymentMethod.value === 'card') {
          // In a real implementation, this would be handled by the payment gateway
          validateCardDetails();
        }
        
        // Create a booking ID and store confirmation data
        const bookingId = 'WS' + Date.now().toString().slice(-8);
        const confirmationData = {
          bookings: bookingDetails.value,
          bookingId,
          paymentMethod: paymentMethod.value,
          cardInfo: paymentMethod.value === 'card' ? {
            number: '**** ' + cardInfo.value.number.slice(-4),
            name: cardInfo.value.name,
            expiry: cardInfo.value.expiry
          } : null,
          confirmedAt: new Date().toISOString(),
          totalAmount: totalAmount.value
        };
        
        sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
        bookingStore.clearBookingDetails();
        
        // Navigate to the confirmation page using Vue Router
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
    
    // Validate card details - would be handled by payment gateway in production
    function validateCardDetails(): void {
      // This function simulates validation that would normally be handled by a payment gateway
      const cardNum = cardInfo.value.number.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNum)) {
        cardNumberError.value = 'Please enter a valid 16-digit card number';
        processing.value = false;
        throw new Error('Invalid card number');
      }
      
      validateExpiry();
      if (expiryError.value) {
        processing.value = false;
        throw new Error(expiryError.value);
      }
      
      if (!/^\d{3,4}$/.test(cardInfo.value.cvv)) {
        processing.value = false;
        throw new Error('Invalid CVV');
      }
    }
    
    // Initialize on component mount
    onMounted(() => {
      bookingStore.initializeBooking();
      initializePaymentGateway();
    });
    
    return {
      processing,
      paymentMethod,
      sameAsGuest,
      cardInfo,
      billingAddress,
      bookingStore,
      bookingDetails,
      totalAmount,
      primaryGuestName,
      cardType,
      cardTypeClass,
      isPaymentFormValid,
      formatCardNumber,
      formatExpiry,
      formatBookingDate,
      processPayment,
      cardFocus,
      showCvvTooltip,
      cardNumberError,
      expiryError,
      validateExpiry,
      formattedCardNumberPreview,
      router
    };
  }
});
</script>