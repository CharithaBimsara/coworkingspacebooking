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
              Book desks, meeting rooms, and private offices in premium dedicated desks.
              Flexible booking, premium locations, and 24/7 access to boost your productivity.
            </p>

            <!-- Simplified Search Widget -->
            <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div class="grid sm:grid-cols-2 gap-4">
                <!-- Location -->
                <div class="space-y-2 mt-1">
                  <LocationDropdown v-model="searchForm.location" label="Location"
                    placeholder="Where do you want to work?" @change="onLocationChange" />
                </div>

                <!-- Space Type -->
                <div class="space-y-2 mt-1">
                  <SpaceTypeDropdown v-model="searchForm.spaceType" :options="spaceTypeOptions" label="Space Type" />
                </div>
              </div>

              <button @click="searchSpaces" :disabled="isSearching"
                class="w-full mt-6 bg-primary text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50">
                {{ isSearching ? 'Searching...' : 'Search Spaces' }}
              </button>
            </div>
          </div>

          <!-- Hero Image Slideshow -->
          <div class="relative">
            <div class="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/10 rounded-2xl overflow-hidden">
              <div class="flex w-full h-full transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(-${currentHeroSlide * 100}%)` }">
                <div v-for="(image, index) in heroImages" :key="index" class="w-full flex-shrink-0">
                  <img :src="image.src" :alt="image.alt" class="w-full h-full object-cover absolute top-0 left-0">
                </div>
              </div>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
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
        <div class="relative">
          <div class="overflow-hidden rounded-2xl">
            <div class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(ad, index) in advertisements" :key="index" class="w-full flex-shrink-0 relative">
                <div class="aspect-[3/1] bg-gradient-to-r from-primary to-primary relative overflow-hidden">
                  <img :src="ad.image" :alt="ad.title" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div class="max-w-2xl px-6">
                      <h3 class="text-3xl lg:text-4xl font-bold mb-4">{{ ad.title }}</h3>
                      <p class="text-xl mb-6 opacity-90">{{ ad.description }}</p>
                      <button
                        class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        {{ ad.buttonText }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation arrows -->
          <button @click="previousSlide"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click="nextSlide"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Slide indicators -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(ad, index) in advertisements" :key="index" @click="currentSlide = index"
              :class="['w-3 h-3 rounded-full transition-colors', currentSlide === index ? 'bg-white' : 'bg-white/50']"></button>
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

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Meeting Rooms -->
          <router-link to="/meeting-rooms"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center">
            <div
              class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Meeting Rooms</h3>
            <p class="text-gray-600 text-sm">Professional meeting spaces</p>
          </router-link>

          <!-- Hot Desk -->
          <router-link to="/hot-desk"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center">
            <div
              class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Hot Desk</h3>
            <p class="text-gray-600 text-sm">Flexible workspace solutions</p>
          </router-link>

          <!-- Dedicated Desk -->
          <router-link to="/dedicated-desk"
            class="group bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-200 text-center">
            <div
              class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Dedicated Desk</h3>
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
            Discover premium dedicated desks in prime locations with all the amenities you need
          </p>
        </div>

        <div v-if="isLoadingSpaces" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Loading featured spaces...</p>
        </div>

        <div v-else-if="featuredSpaces.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="space in featuredSpaces" :key="space.id" class="card overflow-hidden group cursor-pointer"
            @click="viewSpace(space.id)">
            <div class="aspect-[4/3] overflow-hidden">
              <img
                :src="space.images && space.images.length > 0 ? space.images[0] : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                :alt="space.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900">{{ space.name }}</h3>
                <button class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div class="flex items-center text-gray-600 mb-3">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {{ space.location }}
              </div>
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

        <!-- See More Button -->
        <div class="text-center mt-8">
          <router-link to="/search"
            class="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            See More
          </router-link>
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
            We make dedicated desk simple, flexible, and affordable for modern professionals
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Flexible Booking</h3>
            <p class="text-gray-600">
              Book by the hour, day, or week. Change or cancel your reservation anytime with our flexible policies.
            </p>
          </div>

          <div class="text-center group">
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Premium Locations</h3>
            <p class="text-gray-600">
              Work from the best locations in the city. All our spaces are in prime business districts with easy access.
            </p>
          </div>

          <div class="text-center group">
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="bg-white p-6 rounded-xl shadow-card">
            <div class="flex text-yellow-400 mb-4">
              <svg v-for="star in testimonial.rating" :key="star" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-gray-600 mb-6 leading-relaxed">
              "{{ testimonial.content }}"
            </p>
            <div class="flex items-center">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full object-cover mr-4">
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
        <div class="bg-gradient-to-br from-primary to-green-800 rounded-2xl p-8 lg:p-12 text-white">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Stay Updated
          </h2>
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new spaces, special offers, and workspace tips delivered to your inbox.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input v-model="newsletterEmail" type="email" placeholder="Enter your email"
              class="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50">
            <button @click="subscribeNewsletter" :disabled="isSubscribing || !newsletterEmail"
              class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50">
              {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
          <div v-if="subscriptionMessage" class="mt-4 text-white/90">
            {{ subscriptionMessage }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand & Description -->
          <div class="space-y-4">
            <h3 class="text-2xl font-heading font-bold">WorkSpace</h3>
            <p class="text-gray-400 text-sm">
              Discover premium workspaces designed for productivity, flexibility, and collaboration. Book your perfect
              space today.
            </p>
            <div class="flex space-x-4">
              <a href="https://twitter.com/workspace" target="_blank"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://facebook.com/workspace" target="_blank"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/workspace" target="_blank"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="https://instagram.com/workspace" target="_blank"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Explore</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><router-link to="/search-results" class="hover:text-white transition-colors">All Spaces</router-link>
              </li>
              <li><router-link to="/meeting-rooms" class="hover:text-white transition-colors">Meeting
                  Rooms</router-link></li>
              <li><router-link to="/hot-desk" class="hover:text-white transition-colors">Hot Desks</router-link></li>
              <li><router-link to="/dedicated-desk" class="hover:text-white transition-colors">Dedicated
                  Desks</router-link></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Contact Us</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="mailto:support@workspace.com"
                  class="hover:text-white transition-colors">support@workspace.com</a></li>
              <li><a href="tel:+1234567890" class="hover:text-white transition-colors">+1 (234) 567-890</a></li>
              <li>123 Workspace Ave, New York, NY 10001</li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Stay Connected</h4>
            <p class="text-gray-400 text-sm">Subscribe to our newsletter for the latest updates.</p>
            <div class="flex flex-col gap-2">
              <input v-model="footerNewsletterEmail" type="email" placeholder="Enter your email"
                class="px-4 py-2 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary">
              <button @click="subscribeFooterNewsletter" :disabled="isSubscribing || !footerNewsletterEmail"
                class="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
                Subscribe
              </button>
            </div>
            <div v-if="footerSubscriptionMessage" class="text-sm text-gray-400">
              {{ footerSubscriptionMessage }}
            </div>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {{ currentYear }} WorkSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocationDropdown from '../components/LocationDropdown.vue';
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue';
import { HomeAPI } from '../api';
import { NewsletterSubscriptionRequestDto } from '../dto/request';
import type { SpaceDto, AdvertisementDto, TestimonialDto } from '../dto/response';

interface SearchForm {
  location: string;
  spaceType: string;
}

interface SpaceTypeOption {
  value: string;
  label: string;
  icon: string;
}

interface HeroImage {
  src: string;
  alt: string;
}

export default defineComponent({
  name: 'HomePage',

  components: {
    LocationDropdown,
    SpaceTypeDropdown
  },

  data() {
    return {
      searchForm: {
        location: '',
        spaceType: ''
      } as SearchForm,
      isSearching: false,
      isLoadingSpaces: false,
      isSubscribing: false,
      newsletterEmail: '',
      subscriptionMessage: '',
      footerNewsletterEmail: '',
      footerSubscriptionMessage: '',
      currentSlide: 0,
      currentHeroSlide: 0,
      slideInterval: null as number | null,
      heroSlideInterval: null as number | null,
      advertisements: [] as AdvertisementDto[],
      featuredSpaces: [] as SpaceDto[],
      testimonials: [] as TestimonialDto[],
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
          value: 'dedicated-desk',
          label: 'Dedicated Desk',
          icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
        }
      ] as SpaceTypeOption[],
      heroImages: [
        {
          src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt: 'Modern dedicated desk'
        },
        {
          src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt: 'Professional meeting room'
        },
        {
          src: 'https://images.unsplash.com/photo-1503428593583-5675fc6fd47f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt: 'Flexible hot desk'
        }
      ] as HeroImage[]
    };
  },

  computed: {
    currentYear(): number {
      return new Date().getFullYear();
    }
  },

  async mounted() {
    await this.loadHomePageData();
    this.startSlideshow();
    this.startHeroSlideshow();
  },

  beforeUnmount() {
    this.stopSlideshow();
    this.stopHeroSlideshow();
  },

  methods: {
    async loadHomePageData(): Promise<void> {
      this.isLoadingSpaces = true;
      try {
        const response = await HomeAPI.getHomePageData();
        if (response.success) {
          this.featuredSpaces = response.featuredSpaces || [];
          this.advertisements = response.advertisements || [];
          this.testimonials = response.testimonials || [];
        } else {
          console.error('Failed to load home page data:', response.message);
        }
      } catch (error) {
        console.error('Error loading home page data:', error);
      } finally {
        this.isLoadingSpaces = false;
      }
    },

    async searchSpaces(): Promise<void> {
      this.isSearching = true;
      try {
        const query: Record<string, string> = {};
        if (this.searchForm.location) query.location = this.searchForm.location;
        if (this.searchForm.spaceType) query.spaceType = this.searchForm.spaceType;

        await this.$router.push({ name: 'SearchResults', query });
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        this.isSearching = false;
      }
    },

    async viewSpace(id: number): Promise<void> {
      try {
        await this.$router.push({
          name: 'SpaceDetails',
          params: { id: id.toString() }
        });
      } catch (error) {
        console.error('Error navigating to space details:', error);
      }
    },

    async subscribeNewsletter(): Promise<void> {
      if (!this.newsletterEmail) return;

      this.isSubscribing = true;
      this.subscriptionMessage = '';
      try {
        const request = new NewsletterSubscriptionRequestDto(this.newsletterEmail);
        const response = await HomeAPI.subscribeNewsletter(request);
        if (response.success) {
          this.subscriptionMessage = response.message || 'Successfully subscribed!';
          this.newsletterEmail = '';
        } else {
          this.subscriptionMessage = response.message || 'Failed to subscribe. Please try again.';
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        this.subscriptionMessage = 'An error occurred. Please try again.';
      } finally {
        this.isSubscribing = false;
        setTimeout(() => {
          this.subscriptionMessage = '';
        }, 5000);
      }
    },

    async subscribeFooterNewsletter(): Promise<void> {
      if (!this.footerNewsletterEmail) return;

      this.isSubscribing = true;
      this.footerSubscriptionMessage = '';
      try {
        const request = new NewsletterSubscriptionRequestDto(this.footerNewsletterEmail);
        const response = await HomeAPI.subscribeNewsletter(request);
        if (response.success) {
          this.footerSubscriptionMessage = response.message || 'Successfully subscribed!';
          this.footerNewsletterEmail = '';
        } else {
          this.footerSubscriptionMessage = response.message || 'Failed to subscribe. Please try again.';
        }
      } catch (error) {
        console.error('Footer newsletter subscription error:', error);
        this.footerSubscriptionMessage = 'An error occurred. Please try again.';
      } finally {
        this.isSubscribing = false;
        setTimeout(() => {
          this.footerSubscriptionMessage = '';
        }, 5000);
      }
    },

    nextSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.advertisements.length;
      }
    },

    previousSlide(): void {
      if (this.advertisements.length > 0) {
        this.currentSlide = (this.currentSlide - 1 + this.advertisements.length) % this.advertisements.length;
      }
    },

    startSlideshow(): void {
      if (this.advertisements.length > 1) {
        this.slideInterval = window.setInterval(this.nextSlide, 5000);
      }
    },

    stopSlideshow(): void {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
        this.slideInterval = null;
      }
    },

    nextHeroSlide(): void {
      if (this.heroImages.length > 0) {
        this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroImages.length;
      }
    },

    startHeroSlideshow(): void {
      if (this.heroImages.length > 1) {
        this.heroSlideInterval = window.setInterval(this.nextHeroSlide, 5000);
      }
    },

    stopHeroSlideshow(): void {
      if (this.heroSlideInterval) {
        clearInterval(this.heroSlideInterval);
        this.heroSlideInterval = null;
      }
    },

    getStartingPrice(space: SpaceDto): number {
      if (space.pricing) {
        return space.pricing.daily || space.pricing.hourly || space.pricing.monthly || 0;
      }
      return 0;
    },

    onLocationChange(location: string): void {
      if (location) {
        console.log('Selected location:', location);
      }
    }
  }
});
</script>

<style scoped>
.container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

.section-padding {
  @apply py-12 lg:py-16;
}

.card {
  @apply bg-white rounded-xl shadow-md transition-all duration-200;
}

.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}
</style>