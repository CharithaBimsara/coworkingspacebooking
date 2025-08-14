<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto container-padding py-8">
      <div class="animate-pulse">
        <div class="h-96 bg-gray-200 rounded-xl mb-8"></div>
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto container-padding py-8 text-center">
      <div class="bg-white rounded-xl p-8 shadow-card">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Space Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/" class="btn-primary">
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Space Details Content -->
    <div v-else class="max-w-7xl mx-auto container-padding py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <router-link :to="getCategoryRoute()" class="hover:text-primary transition-colors">{{ getCategoryName() }}</router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-900">{{ space?.name || 'Loading...' }}</span>
      </nav>

      <!-- Image Gallery -->
      <div class="grid lg:grid-cols-3 gap-8 mb-8 items-start">
        <div class="lg:col-span-2">
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
            <img 
              :src="getCurrentImage()" 
              :alt="space?.name || 'Space'"
              class="w-full h-full object-cover"
            >
            <!-- Navigation arrows -->
            <button 
              v-if="getImageCount() > 1"
              @click="previousImage"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="getImageCount() > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Image counter -->
            <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {{ currentImageIndex + 1 }}/{{ getImageCount() }}
            </div>
          </div>
          
          <!-- Thumbnail carousel -->
          <div v-if="getImageCount() > 1" class="grid grid-cols-4 gap-2">
            <button 
              v-for="(image, index) in getImages().slice(0, 4)" 
              :key="index"
              @click="currentImageIndex = index"
              :class="['aspect-square rounded-lg overflow-hidden transition-opacity', currentImageIndex === index ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100']"
            >
              <img :src="image" :alt="`${space?.name || 'Space'} image ${index + 1}`" class="w-full h-full object-cover">
            </button>
          </div>
        </div>

        <!-- Booking Widget -->
        <div class="lg:col-span-1 overflow-visible">
          <div  class="bg-white rounded-xl p-6 shadow-card sticky top-24 lg:sticky lg:top-24">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ space?.name || 'Loading...' }}</h2>
                <div class="flex items-center text-gray-600 mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ space?.location || 'Loading...' }}
                </div>
                <div v-if="productType === 'meeting-room'" class="text-sm text-gray-600 mt-1">
                  Capacity: {{ space?.capacity || 0 }} people
                </div>
                <div v-else-if="productType === 'coworking-space'" class="text-sm text-gray-600 mt-1">
                  Max Capacity: {{ space?.maxCapacity || space?.capacity || 0 }} seats
                </div>
              </div>
              <button 
                @click="toggleFavorite"
                :class="['p-2 rounded-full transition-colors', isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50 hover:bg-gray-100']"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Rating -->
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg v-for="star in 5" :key="star" :class="['w-5 h-5', star <= (space?.rating || 0) ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 font-semibold text-gray-900">{{ space?.rating || 0 }}</span>
              <span class="ml-1 text-gray-600">({{ space?.reviews || 0 }} reviews)</span>
            </div>

            <!-- Description -->
            <p class="text-gray-600 mb-6 leading-relaxed">{{ space?.description || 'Loading description...' }}</p>

            <!-- Meeting Room Booking Form -->
            <div v-if="productType === 'meeting-room'" class="space-y-4 mb-6">
              <h3 class="font-semibold text-gray-900">Booking Details</h3>
              <DateRangePicker
                v-model="bookingForm.dateRange"
                label="Date Range"
                placeholder="Select booking dates"
                :min-date="today"
                @change="onDateRangeChange"
              />
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <select v-model="bookingForm.startTime" class="input-field">
                    <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <select v-model="bookingForm.duration" class="input-field">
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="8">Full day</option>
                  </select>
                </div>
              </div>

              <!-- Additional Facilities -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Facilities</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="selectedFacilities" value="tv" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="ml-2 text-sm text-gray-700">TV/Display (+$25)</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="selectedFacilities" value="printer" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="ml-2 text-sm text-gray-700">Printer Access (+$15)</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="selectedFacilities" value="catering" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="ml-2 text-sm text-gray-700">Catering Service (+$50)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Hot Desk Booking Form -->
            <div v-else-if="productType === 'hot-desk'" class="space-y-4 mb-6">
              <h3 class="font-semibold text-gray-900">Subscription Plans</h3>
              <DateRangePicker
                v-model="bookingForm.dateRange"
                label="Subscription Period"
                placeholder="Select subscription dates"
                :min-date="today"
                @change="onDateRangeChange"
              />
              
              <!-- Package Selection -->
              <div class="space-y-3">
                <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" 
                       :class="selectedPackage === 'daily' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                  <input v-model="selectedPackage" value="daily" type="radio" class="sr-only">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Daily Pass</div>
                    <div class="text-sm text-gray-600">Perfect for occasional use</div>
                    <div class="text-lg font-bold text-primary">${{ space?.pricing?.daily || 35 }}/day</div>
                  </div>
                </label>
                
                <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" 
                       :class="selectedPackage === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                  <input v-model="selectedPackage" value="monthly" type="radio" class="sr-only">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Monthly Subscription</div>
                    <div class="text-sm text-gray-600">Unlimited access for a month</div>
                    <div class="text-lg font-bold text-primary">${{ space?.pricing?.monthly || 450 }}/month</div>
                  </div>
                </label>
                
                <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" 
                       :class="selectedPackage === 'annual' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                  <input v-model="selectedPackage" value="annual" type="radio" class="sr-only">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Annual Subscription</div>
                    <div class="text-sm text-gray-600">Best value - save 20%</div>
                    <div class="text-lg font-bold text-primary">${{ space?.pricing?.annual || 4500 }}/year</div>
                    <div class="text-xs text-green-600 font-medium">Save ${{ getSavings() }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Co-working Space Booking Form -->
            <div v-else-if="productType === 'coworking-space'" class="space-y-4 mb-6">
              <h3 class="font-semibold text-gray-900">Team Workspace</h3>
              <DateRangePicker
                v-model="bookingForm.dateRange"
                label="Workspace Period"
                placeholder="Select workspace dates"
                :min-date="today"
                @change="onDateRangeChange"
              />
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <select v-model="bookingForm.teamSize" class="input-field">
                  <option value="1-5">1-5 people</option>
                  <option value="6-15">6-15 people</option>
                  <option value="16-30">16-30 people</option>
                  <option value="31+">31+ people</option>
                </select>
              </div>
              
              <!-- Package Selection -->
              <div class="space-y-3">
                <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" 
                       :class="selectedPackage === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                  <input v-model="selectedPackage" value="monthly" type="radio" class="sr-only">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Monthly Plan</div>
                    <div class="text-sm text-gray-600">Flexible month-to-month</div>
                    <div class="text-lg font-bold text-primary">${{ space?.pricing?.monthly || 2500 }}/month</div>
                  </div>
                </label>
                
                <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors" 
                       :class="selectedPackage === 'annual' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                  <input v-model="selectedPackage" value="annual" type="radio" class="sr-only">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Annual Plan</div>
                    <div class="text-sm text-gray-600">Best value - 2 months free</div>
                    <div class="text-lg font-bold text-primary">${{ space?.pricing?.annual || 27000 }}/year</div>
                    <div class="text-xs text-green-600 font-medium">Save ${{ getSavings() }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Price Calculation -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div v-if="productType === 'meeting-room'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-600">Room ({{ bookingForm.duration }}h)</span>
                  <span class="font-semibold">${{ roomBasePrice }}</span>
                </div>
                <div v-if="facilitiesPrice > 0" class="flex items-center justify-between mb-2">
                  <span class="text-gray-600">Additional Facilities</span>
                  <span class="font-semibold">${{ facilitiesPrice }}</span>
                </div>
                <hr class="my-3">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-gray-900">Total</span>
                  <span class="text-2xl font-bold text-primary">${{ totalPrice }}</span>
                </div>
                <div class="text-xs text-gray-600 mt-1">Non-refundable booking</div>
              </div>
              
              <div v-else>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-gray-900">{{ getPackageDisplayName() }}</span>
                  <span class="text-2xl font-bold text-primary">${{ getPackagePrice() }}</span>
                </div>
                <div class="text-xs text-gray-600 mt-1">{{ getPackageDescription() }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="productType === 'meeting-room'">
              <button 
                @click="proceedToBooking"
                :disabled="!isBookingFormValid || isProcessing"
                class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isProcessing ? 'Processing...' : 'Book Now' }}
              </button>
            </div>
            
            <div v-else>
              <button
                @click="proceedToSubscription"
                :disabled="!isSubscriptionFormValid || isProcessing"
                class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isProcessing ? 'Processing...' : 'Subscribe Now' }}
              </button>
              <p v-if="productType === 'hot-desk' || productType === 'coworking-space'" class="text-xs text-gray-500 text-center mt-2">
                {{ currentUser ? 'Ready to book' : 'Login required for subscriptions' }}
              </p>
            </div>

            <!-- Trust signals -->
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">
                <svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ productType === 'meeting-room' ? 'Secure booking process' : 'Cancel anytime with 30 days notice' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information Sections -->
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <!-- Features/Amenities -->
          <section>
            <h3 class="text-2xl font-heading font-semibold text-gray-900 mb-6">
              {{ productType === 'meeting-room' ? 'Room Features' : 'Amenities & Features' }}
            </h3>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="feature in space?.features || []" :key="feature" class="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-card">
                <div class="w-8 h-8 text-primary">
                  <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="font-medium text-gray-900">{{ feature }}</span>
              </div>
            </div>
          </section>

          <!-- Location & Access -->
          <section>
            <h3 class="text-2xl font-heading font-semibold text-gray-900 mb-6">Location & Access</h3>
            <div class="bg-white rounded-xl p-6 shadow-card">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 text-primary mt-1">
                  <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-2">{{ space?.location || 'Loading...' }}</h4>
                  <p class="text-gray-600 mb-4">{{ space?.address || 'Loading address...' }}</p>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-gray-900 mb-2">Transportation</h5>
                      <ul class="space-y-1 text-sm text-gray-600">
                        <li>• Metro station: 2 min walk</li>
                        <li>• Bus stops nearby</li>
                        <li>• Parking available</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 mb-2">Nearby</h5>
                      <ul class="space-y-1 text-sm text-gray-600">
                        <li>• Coffee shops & restaurants</li>
                        <li>• Business district</li>
                        <li>• Shopping center</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Reviews Section -->
        <div class="lg:col-span-1">
          <section>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div class="space-y-4">
              <div v-for="review in reviews" :key="review.id" class="bg-white rounded-lg p-4 shadow-card">
                <div class="flex items-center space-x-3 mb-2">
                  <img :src="review.avatar" :alt="review.name" class="w-8 h-8 rounded-full object-cover">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 text-sm">{{ review.name }}</h4>
                    <div class="flex text-yellow-400">
                      <svg v-for="star in 5" :key="star" :class="['w-3 h-3', star <= review.rating ? 'fill-current' : 'stroke-current fill-none']" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-600">{{ review.comment }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModals 
      :showSignIn="showAuthModal"
      :showSignUp="false"
      @close="closeAuthModal"
      @user-authenticated="handleUserAuthenticated"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthModals from '../components/AuthModals.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import { SpacesAPI } from '../api'
import type { SpaceDto, ReviewDto, UserDto } from '../dto/response'
import { getSpaceTypeEnum } from '../types/enums'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useSpacesStore } from '../stores/spaces'

interface DateRange {
  startDate: string | null
  endDate: string | null
}

interface BookingForm {
  dateRange: DateRange
  startTime: string
  duration: string
  teamSize: string
}

export default defineComponent({
  name: 'SpaceDetails',
  
  components: {
    AuthModals,
    DateRangePicker
  },
  
  data() {
    return {
      loading: true,
      error: '',
      isProcessing: false,
      currentImageIndex: 0,
      showGallery: false,
      showAuthModal: false,
      isFavorite: false,
      currentUser: null as UserDto | null,
      productType: 'meeting-room',
      
      // Form data
      bookingForm: {
        dateRange: {
          startDate: null,
          endDate: null
        },
        startTime: '09:00',
        duration: '2',
        teamSize: '1-5'
      } as BookingForm,
      selectedFacilities: [] as string[],
      selectedPackage: 'monthly',
      
      // Space data from API
      space: null as SpaceDto | null,
      reviews: [] as ReviewDto[],
      
      // Time slots for meeting rooms
      timeSlots: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
      ]
    }
  },
  
  computed: {
    today(): string {
      return new Date().toISOString().split('T')[0]
    },
    
    roomBasePrice(): number {
      const hourlyRate = this.space?.pricing?.hourly || 85
      const duration = parseInt(this.bookingForm.duration || '2')
      return hourlyRate * duration
    },
    
    facilitiesPrice(): number {
      const prices: Record<string, number> = { tv: 25, printer: 15, catering: 50 }
      return this.selectedFacilities.reduce((total, facility) => {
        return total + (prices[facility] || 0)
      }, 0)
    },
    
    totalPrice(): number {
      return this.roomBasePrice + this.facilitiesPrice
    },
    
    isBookingFormValid(): boolean {
      return !!(this.bookingForm.dateRange.startDate &&
               this.bookingForm.dateRange.endDate &&
               this.bookingForm.startTime &&
               this.bookingForm.duration)
    },
    
    isSubscriptionFormValid(): boolean {
      return !!(this.bookingForm.dateRange.startDate &&
               this.bookingForm.dateRange.endDate &&
               this.selectedPackage &&
               (this.productType !== 'coworking-space' || this.bookingForm.teamSize))
    }
  },
  
  async mounted() {
    // Initialize stores
    const authStore = useAuthStore()
    const spacesStore = useSpacesStore()
    
    // Initialize auth from localStorage
    authStore.initializeAuth()
    this.currentUser = authStore.currentUser

    // Get product type from route query
    this.productType = (this.$route.query.type as string) || 'meeting-room'
    
    // Set default values for booking form
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)
    
    this.bookingForm.dateRange = {
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfterTomorrow.toISOString().split('T')[0]
    }
    this.bookingForm.startTime = '09:00'
    this.bookingForm.duration = '2'
    this.bookingForm.teamSize = '1-5'

    // Set default package selection
    this.selectedPackage = 'monthly'

    // Load space details
    await this.loadSpaceDetails()
    
    // Check if space is in favorites
    const spaceId = parseInt(this.$route.params.id as string)
    if (spaceId) {
      this.isFavorite = spacesStore.isFavorite(spaceId)
    }
  },
  
  methods: {
    async loadSpaceDetails(): Promise<void> {
      try {
        this.loading = true
        this.error = ''
        
        const spaceId = parseInt(this.$route.params.id as string)
        if (!spaceId) {
          this.error = 'Invalid space ID'
          return
        }
        
        const response = await SpacesAPI.getSpaceDetails(spaceId, getSpaceTypeEnum(this.productType))
        
        if (response.success && response.space) {
          this.space = response.space
          this.reviews = response.recentReviews || []
          this.isFavorite = false // Could be loaded from user preferences
        } else {
          this.error = response.message || 'Space not found'
        }
      } catch (error) {
        console.error('Error loading space details:', error)
        this.error = 'Failed to load space details'
      } finally {
        this.loading = false
      }
    },
    
    getCategoryRoute(): string {
      switch (this.productType) {
        case 'meeting-room':
          return '/meeting-rooms'
        case 'hot-desk':
          return '/hot-desk'
        case 'coworking-space':
          return '/coworking-space'
        default:
          return '/'
      }
    },
    
    getCategoryName(): string {
      switch (this.productType) {
        case 'meeting-room':
          return 'Meeting Rooms'
        case 'hot-desk':
          return 'Hot Desk'
        case 'coworking-space':
          return 'Co-working Space'
        default:
          return 'Spaces'
      }
    },
    
    getCurrentImage(): string {
      const images = this.getImages()
      return images[this.currentImageIndex] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    
    getImages(): string[] {
      return this.space?.images || ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    
    getImageCount(): number {
      return this.getImages().length
    },
    
    getPackageDisplayName(): string {
      const names: Record<string, string> = {
        daily: 'Daily Pass',
        monthly: 'Monthly Plan',
        annual: 'Annual Plan'
      }
      return names[this.selectedPackage] || 'Selected Plan'
    },
    
    getPackagePrice(): number {
      if (!this.space?.pricing) return 0
      
      switch (this.selectedPackage) {
        case 'daily':
          return this.space.pricing.daily || 0
        case 'monthly':
          return this.space.pricing.monthly || 0
        case 'annual':
          return this.space.pricing.annual || 0
        default:
          return 0
      }
    },
    
    getPackageDescription(): string {
      switch (this.selectedPackage) {
        case 'daily':
          return 'Perfect for occasional use'
        case 'monthly':
          return 'Unlimited access for one month'
        case 'annual':
          return 'Best value - includes all benefits'
        default:
          return ''
      }
    },
    
    getSavings(): number {
      if (this.space?.pricing?.monthly && this.space?.pricing?.annual) {
        return Math.round((this.space.pricing.monthly * 12) - this.space.pricing.annual)
      }
      return 0
    },
    
    previousImage(): void {
      const imageCount = this.getImageCount()
      this.currentImageIndex = this.currentImageIndex === 0
        ? imageCount - 1
        : this.currentImageIndex - 1
    },
    
    nextImage(): void {
      const imageCount = this.getImageCount()
      this.currentImageIndex = this.currentImageIndex === imageCount - 1
        ? 0
        : this.currentImageIndex + 1
    },
    
    toggleFavorite(): void {
      const spacesStore = useSpacesStore()
      const spaceId = parseInt(this.$route.params.id as string)
      
      if (spaceId) {
        spacesStore.toggleFavorite(spaceId)
        this.isFavorite = spacesStore.isFavorite(spaceId)
      }
    },
    
    handleUserAuthenticated(user: UserDto): void {
      this.currentUser = user
      this.showAuthModal = false

      // After authentication, proceed with the booking
      if (this.productType === 'hot-desk' || this.productType === 'coworking-space') {
        setTimeout(() => {
          this.proceedToSubscription()
        }, 100)
      }
    },
    
    closeAuthModal(): void {
      this.showAuthModal = false
    },
    
    onDateRangeChange(dateRange: DateRange): void {
      this.bookingForm.dateRange = dateRange
      console.log('Date range changed:', dateRange)
    },
    
    async proceedToBooking(): Promise<void> {
      if (!this.isBookingFormValid || this.isProcessing) return
      
      try {
        this.isProcessing = true
        const bookingStore = useBookingStore()
        
        // Ensure space has required fields
        if (!this.space?.id) {
          console.error('Space ID is required for booking')
          return
        }
        
        // Ensure date range is selected
        if (!this.bookingForm.dateRange.startDate || !this.bookingForm.dateRange.endDate) {
          console.error('Date range is required for booking')
          return
        }
        
        // Store booking data in Pinia store
        const bookingDetails = {
          spaceId: this.space.id,
          productType: this.productType,
          space: {
            ...this.space,
            id: this.space.id, // Ensure id is present
            image: this.getCurrentImage()
          },
          booking: {
            startDate: this.bookingForm.dateRange.startDate,
            endDate: this.bookingForm.dateRange.endDate,
            startTime: this.bookingForm.startTime,
            duration: this.bookingForm.duration,
            // Add legacy date field for backward compatibility
            date: this.bookingForm.dateRange.startDate
          },
          facilities: this.selectedFacilities,
          totalPrice: this.totalPrice,
          pricing: {
            basePrice: this.roomBasePrice,
            facilitiesPrice: this.facilitiesPrice,
            total: this.totalPrice
          }
        }

        bookingStore.setBookingDetails(bookingDetails)
        await this.$router.push({ name: 'BookingSummary' })
      } catch (error) {
        console.error('Error proceeding to booking:', error)
      } finally {
        this.isProcessing = false
      }
    },
    
    async proceedToSubscription(): Promise<void> {
      if (!this.isSubscriptionFormValid || this.isProcessing) return
      
      // For hot desk and coworking space, authentication is required
      if (!this.currentUser) {
        this.showAuthModal = true
        return
      }

      try {
        this.isProcessing = true
        const bookingStore = useBookingStore()
        
        // Ensure space has required fields
        if (!this.space?.id) {
          console.error('Space ID is required for subscription')
          return
        }
        
        // Ensure date range is selected
        if (!this.bookingForm.dateRange.startDate || !this.bookingForm.dateRange.endDate) {
          console.error('Date range is required for subscription')
          return
        }
        
        // Store subscription data in Pinia store
        const subscriptionDetails = {
          spaceId: this.space.id,
          productType: this.productType,
          space: {
            ...this.space,
            id: this.space.id, // Ensure id is present
            image: this.getCurrentImage()
          },
          subscription: {
            startDate: this.bookingForm.dateRange.startDate,
            endDate: this.bookingForm.dateRange.endDate,
            packageType: this.selectedPackage,
            teamSize: this.bookingForm.teamSize
          },
          totalPrice: this.getPackagePrice(),
          pricing: {
            basePrice: this.getPackagePrice(),
            facilitiesPrice: 0,
            serviceFee: Math.round(this.getPackagePrice() * 0.1),
            taxes: Math.round(this.getPackagePrice() * 0.0875),
            total: this.getPackagePrice()
          }
        }

        bookingStore.setBookingDetails(subscriptionDetails)
        await this.$router.push({ name: 'BookingSummary' })
      } catch (error) {
        console.error('Error proceeding to subscription:', error)
      } finally {
        this.isProcessing = false
      }
    }
  }
})
</script>
