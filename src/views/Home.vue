<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div class="max-w-7xl mx-auto container-padding section-padding">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 leading-tight">
              Find Your Perfect
              <span class="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Workspace
              </span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              Book desks, meeting rooms, and private offices in premium coworking spaces. 
              Flexible booking, premium locations, and 24/7 access to boost your productivity.
            </p>
            
            <!-- Simplified Search Widget -->
            <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div class="grid sm:grid-cols-2 gap-4">
                <!-- Location -->
                <div class="space-y-2 mt-1">
                  <LocationDropdown
                    v-model="searchForm.location"
                    label="Location"
                    placeholder="Where do you want to work?"
                    @change="onLocationChange"
                  />
                </div>

                <!-- Space Type -->
                <div class="space-y-2">
                  <SpaceTypeDropdown
                    v-model="searchForm.spaceType"
                    :options="spaceTypeOptions"
                    label="Space Type"
                  />
                </div>
              </div>
              
              <button 
                @click="searchSpaces"
                :disabled="isSearching"
                class="w-full mt-6 bg-primary text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {{ isSearching ? 'Searching...' : 'Search Spaces' }}
              </button>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative">
            <div class="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/10 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern coworking space"
                class="w-full h-full object-cover"
              >
            </div>
            <!-- Floating cards -->
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">24/7 Access</p>
                  <p class="text-sm text-gray-600">Available anytime</p>
                </div>
              </div>
            </div>
            <div class="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">High-Speed WiFi</p>
                  <p class="text-sm text-gray-600">1GB+ connection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Offers & Partners Section -->
    <section class="section-padding bg-gray-50" v-if="advertisements.length > 0">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Special Offers & Partners
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exclusive deals and our trusted partners
          </p>
        </div>
        <div class="relative">
          <div class="overflow-hidden rounded-2xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div 
                v-for="(ad, index) in advertisements" 
                :key="index"
                class="w-full flex-shrink-0 relative"
              >
                <div class="aspect-[3/1] bg-gradient-to-r from-primary to-primary relative overflow-hidden">
                  <img 
                    :src="ad.image" 
                    :alt="ad.title"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div class="max-w-2xl px-6">
                      <h3 class="text-3xl lg:text-4xl font-bold mb-4">{{ ad.title }}</h3>
                      <p class="text-xl mb-6 opacity-90">{{ ad.description }}</p>
                      <button class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        {{ ad.buttonText }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation arrows -->
          <button 
            @click="previousSlide"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click="nextSlide"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Slide indicators -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button 
              v-for="(ad, index) in advertisements" 
              :key="index"
              @click="currentSlide = index"
              :class="['w-3 h-3 rounded-full transition-colors', currentSlide === index ? 'bg-white' : 'bg-white/50']"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Links Section -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Choose Your Workspace
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect space for your work style and needs
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- My Bookings -->
          <router-link 
            to="/my-bookings"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center"
          >
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p class="text-gray-600 text-sm">Manage your reservations</p>
          </router-link>

          <!-- Meeting Rooms -->
          <router-link 
            to="/meeting-rooms"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center"
          >
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Meeting Rooms</h3>
            <p class="text-gray-600 text-sm">Professional meeting spaces</p>
          </router-link>

          <!-- Hot Desk -->
          <router-link 
            to="/hot-desk"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center"
          >
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Hot Desk</h3>
            <p class="text-gray-600 text-sm">Flexible workspace solutions</p>
          </router-link>

          <!-- Co-working Space -->
          <router-link 
            to="/coworking-space"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center"
          >
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Co-working Space</h3>
            <p class="text-gray-600 text-sm">Collaborative workspaces</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Spaces -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Featured Workspaces
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium coworking spaces in prime locations with all the amenities you need
          </p>
        </div>

        <div v-if="isLoadingSpaces" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Loading featured spaces...</p>
        </div>

        <div v-else-if="featuredSpaces.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="space in featuredSpaces" 
            :key="space.id"
            class="card overflow-hidden group cursor-pointer"
            @click="viewSpace(space.id)"
          >
            <div class="aspect-[4/3] overflow-hidden">
              <img 
                :src="space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" 
                :alt="space.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900">{{ space.name }}</h3>
                <button class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div class="flex items-center text-gray-600 mb-3">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {{ space.location }}
              </div>
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-sm text-gray-600">{{ space.rating }} ({{ space.reviews }} reviews)</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-gray-900">
                  ${{ getStartingPrice(space) }}
                  <span class="text-sm font-normal text-gray-600">/day</span>
                </div>
                <button class="btn-primary text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600">No featured spaces available at the moment.</p>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Why Choose WorkSpace?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            We make coworking simple, flexible, and affordable for modern professionals
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Flexible Booking</h3>
            <p class="text-gray-600">
              Book by the hour, day, or week. Change or cancel your reservation anytime with our flexible policies.
            </p>
          </div>

          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Premium Locations</h3>
            <p class="text-gray-600">
              Work from the best locations in the city. All our spaces are in prime business districts with easy access.
            </p>
          </div>

          <div class="text-center group">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">24/7 Access</h3>
            <p class="text-gray-600">
              Access your workspace anytime with secure keycard entry. Perfect for early birds and night owls.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section-padding" v-if="testimonials.length > 0">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            What Our Members Say
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who love working with us
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id"
            class="bg-white p-6 rounded-xl shadow-card"
          >
            <div class="flex text-yellow-400 mb-4">
              <svg v-for="star in testimonial.rating" :key="star" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-gray-600 mb-6 leading-relaxed">
              "{{ testimonial.content }}"
            </p>
            <div class="flex items-center">
              <img 
                :src="testimonial.avatar" 
                :alt="testimonial.name"
                class="w-12 h-12 rounded-full object-cover mr-4"
              >
              <div>
                <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-600">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-4xl mx-auto container-padding text-center">
        <div class="bg-gradient-to-br from-primary to-primary rounded-2xl p-8 lg:p-12 text-white">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Stay Updated
          </h2>
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new spaces, special offers, and workspace tips delivered to your inbox.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              v-model="newsletterEmail"
              type="email" 
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
            <button 
              @click="subscribeNewsletter"
              :disabled="isSubscribing || !newsletterEmail"
              class="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            >
              {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
          <div v-if="subscriptionMessage" class="mt-4 text-white/90">
            {{ subscriptionMessage }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Router } from 'vue-router'
import LocationDropdown from '../components/LocationDropdown.vue'
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue'
import { HomeAPI } from '../api'
import { NewsletterSubscriptionRequestDto } from '../dto/request'
import type { SpaceDto, AdvertisementDto, TestimonialDto } from '../dto/response'

interface SearchForm {
  location: string
  spaceType: string
}

export default defineComponent({
  name: 'Home',
  
  components: {
    LocationDropdown,
    SpaceTypeDropdown
  },
  
  data() {
    return {
      // Search form data
      searchForm: {
        location: '',
        spaceType: ''
      } as SearchForm,
      // Loading states
      isSearching: false,
      isLoadingSpaces: false,
      isSubscribing: false,
      // Newsletter
      newsletterEmail: '',
      subscriptionMessage: '',
      // Slideshow state
      currentSlide: 0,
      slideInterval: null as number | null,
      // Data from API
      advertisements: [] as AdvertisementDto[],
      featuredSpaces: [] as SpaceDto[],
      testimonials: [] as TestimonialDto[],
      // Space type dropdown options
      spaceTypeOptions: [
        {
          value: '',
          label: 'All Types',
          icon: ''
        },
        {
          value: 'meeting-room',
          label: 'Meeting Room',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
        },
        {
          value: 'hot-desk',
          label: 'Hot Desk',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
        },
        {
          value: 'coworking-space',
          label: 'Co-working Space',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
        }
      ]
    }
  },
  
  async mounted() {
    await this.loadHomePageData()
    this.startSlideshow()
  },
  
  beforeUnmount() {
    this.stopSlideshow()
  },
  
  methods: {
    async loadHomePageData(): Promise<void> {
      try {
        this.isLoadingSpaces = true
        const response = await HomeAPI.getHomePageData()
        
        if (response.success) {
          this.featuredSpaces = response.featuredSpaces || []
          this.advertisements = response.advertisements || []
          this.testimonials = response.testimonials || []
        } else {
          console.error('Failed to load home page data:', response.message)
        }
      } catch (error) {
        console.error('Error loading home page data:', error)
      } finally {
        this.isLoadingSpaces = false
      }
    },
    
    async searchSpaces(): Promise<void> {
      try {
        this.isSearching = true
        
        // Always navigate to SearchResults with provided query params
        const query: Record<string, string> = {}
        if (this.searchForm.location) query.location = this.searchForm.location
        if (this.searchForm.spaceType) query.spaceType = this.searchForm.spaceType
        
        await this.$router.push({ name: 'SearchResults', query })
      } catch (error) {
        console.error('Error during search:', error)
      } finally {
        this.isSearching = false
      }
    },
    
    async viewSpace(id: number): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() }
        })
      } catch (error) {
        console.error('Error navigating to space details:', error)
      }
    },
    
    async subscribeNewsletter(): Promise<void> {
      if (!this.newsletterEmail) return
      
      try {
        this.isSubscribing = true
        this.subscriptionMessage = ''
        
        const request = new NewsletterSubscriptionRequestDto(this.newsletterEmail)
        
        const response = await HomeAPI.subscribeNewsletter(request)
        
        if (response.success) {
          this.subscriptionMessage = response.message || 'Successfully subscribed!'
          this.newsletterEmail = ''
        } else {
          this.subscriptionMessage = response.message || 'Failed to subscribe. Please try again.'
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error)
        this.subscriptionMessage = 'An error occurred. Please try again.'
      } finally {
        this.isSubscribing = false
        
        // Clear message after 5 seconds
        setTimeout(() => {
          this.subscriptionMessage = ''
        }, 5000)
      }
    },
    
    nextSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.advertisements.length
      }
    },
    
    previousSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = this.currentSlide === 0
          ? this.advertisements.length - 1
          : this.currentSlide - 1
      }
    },
    
    startSlideshow(): void {
      if (this.advertisements.length > 1) {
        this.slideInterval = Number(setInterval(this.nextSlide, 5000)) // Change slide every 5 seconds
      }
    },
    
    stopSlideshow(): void {
      if (this.slideInterval) {
        clearInterval(this.slideInterval)
        this.slideInterval = null
      }
    },
    
    getStartingPrice(space: SpaceDto): number {
      if (space.pricing) {
        return space.pricing.daily || space.pricing.hourly || space.pricing.monthly || 0
      }
      return 0
    },
    
    onLocationChange(location: any): void {
      // Handle location selection if needed
      if (location) {
        console.log('Selected location:', location)
      }
    }
  }
})
</script>
