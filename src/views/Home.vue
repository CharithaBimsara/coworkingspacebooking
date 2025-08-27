<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p class="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div class="max-w-7xl mx-auto container-padding section-padding">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 leading-tight">
              Find Your Perfect
              <span class="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                WorkSpace
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
                    placeholder="Where do you want to work?" :locations="locations" @change="onLocationChange" />
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

          <!-- Hero Image -->
          <div class="relative">
            <div class="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/10 rounded-2xl overflow-hidden">
              <img 
                :src="companyProfile.image || heroImages[0].src" 
                :alt="companyProfile.name" 
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
            Why Choose {{ companyProfile.name }}?
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
    <!-- About Section -->
    <section id="about" class="section-padding scroll-mt-20">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            About {{ companyProfile.name }}
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Your premium coworking solution for modern professionals
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div class="aspect-[4/3] rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern workspace" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <p class="font-bold text-primary">Est. 2020</p>
            </div>
          </div>
          
          <div class="space-y-6">
            <h3 class="text-2xl font-semibold text-gray-900">Creating Productive Work Environments</h3>
            <p class="text-gray-600 leading-relaxed">
              At {{ companyProfile.name }}, we believe in providing more than just a desk. Our mission is to create environments where 
              professionals thrive, connections are made, and productivity reaches new heights.
            </p>
            <p class="text-gray-600 leading-relaxed">
              Founded in 2020, we've expanded to over 25 locations across major cities, serving thousands of 
              entrepreneurs, freelancers, and businesses looking for flexible, high-quality workspace solutions.
            </p>
            <div class="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p class="text-3xl font-bold text-primary">25+</p>
                <p class="text-gray-600">Locations</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-primary">5,000+</p>
                <p class="text-gray-600">Happy Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Newsletter Section -->
    <section id="contact" class="section-padding bg-gray-50 scroll-mt-20">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team or subscribe for updates
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
              <p class="text-gray-600 mb-6">
                Have questions about our workspace solutions? Our team is ready to help you find
                the perfect space for your needs.
              </p>
            </div>
            
            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Email Us</h4>
                  <a :href="'mailto:' + companyProfile.email" class="text-gray-900 hover:underline">{{ companyProfile.email }}</a>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Call Us</h4>
                  <a :href="'tel:' + companyProfile.phone" class="text-gray-900 hover:underline">{{ companyProfile.phone }}</a>
                </div>
              </div>
              
              <!-- Location -->
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">Headquarters</h4>
                  <p class="text-gray-600">{{ companyProfile.address }}</p>
                  <!-- <p class="text-gray-600">123 Workspace Ave, Suite 400<br>San Francisco, CA 94107</p> -->
                </div>
              </div>
            </div>
            
            <!-- Social Media Links -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">Follow Us</h4>
              <div class="flex space-x-4">
                <a href="#" class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.75 21.5H2.25A2.25 2.25 0 010 19.25V4.75A2.25 2.25 0 012.25 2.5h19.5A2.25 2.25 0 0124 4.75v14.5a2.25 2.25 0 01-2.25 2.25zM2.25 3.5a1.25 1.25 0 00-1.25 1.25v14.5a1.25 1.25 0 001.25 1.25h19.5a1.25 1.25 0 001.25-1.25V4.75a1.25 1.25 0 00-1.25-1.25H2.25z"/>
                    <path d="M8 17.5a.5.5 0 01-.5-.5v-7a.5.5 0 011 0v7a.5.5 0 01-.5.5zM5 8.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4zM18.5 17.5a.5.5 0 01-.5-.5v-4c0-1.103-.897-2-2-2s-2 .897-2 2v4a.5.5 0 01-1 0v-4a3 3 0 016 0v4a.5.5 0 01-.5.5z"/>
                  </svg>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Newsletter Subscription -->
          <div class="bg-gradient-to-br from-primary to-green-800 rounded-2xl p-8 text-white shadow-xl">
            <h3 class="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p class="text-white/90 mb-6">
              Get the latest updates on new spaces, special offers, and workspace tips delivered to your inbox.
            </p>
            <div class="space-y-4">
              <div>
                <label for="newsletterName" class="block text-sm font-medium text-white/80 mb-1">Name</label>
                <input type="text" id="newsletterName" v-model="newsletterName" placeholder="Your name" 
                  class="w-full px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50">
              </div>
              <div>
                <label for="newsletterEmail" class="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                <input type="email" id="newsletterEmail" v-model="newsletterEmail" placeholder="Your email" 
                  class="w-full px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50">
              </div>
              <button 
                @click="subscribeNewsletter" 
                :disabled="isSubscribing || !newsletterEmail" 
                class="w-full px-4 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {{ isSubscribing ? 'Subscribing...' : 'Subscribe Now' }}
              </button>
              <div v-if="subscriptionMessage" class="mt-2 text-white/90 text-sm">
                {{ subscriptionMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand & Description -->
          <div class="space-y-4">
            <h3 class="text-2xl font-heading font-bold">{{ companyProfile.name }}</h3>
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
              <li><a :href="'mailto:' + companyProfile.email"
                  class="hover:text-white transition-colors">{{ companyProfile.email }}</a></li>
              <li><a :href="'tel:' + companyProfile.phone" class="hover:text-white transition-colors">{{ companyProfile.phone }}</a></li>
              <li>{{ companyProfile.address }}</li>
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
          <p>&copy; {{ currentYear }} {{ companyProfile.name }}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocationDropdown from '../components/LocationDropdown.vue';
import SpaceTypeDropdown from '../components/SpaceTypeDropdown.vue';
import type { SpaceDto, AdvertisementDto, TestimonialDto, CompanyProfileDto } from '../dto/response';

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
      isLoading: true, // New loading state for initial data fetching
      isSearching: false,
      isLoadingSpaces: false,
      isSubscribing: false,
      newsletterName: '',
      newsletterEmail: '',
      subscriptionMessage: '',
      footerNewsletterEmail: '',
      footerSubscriptionMessage: '',
      currentSlide: 0,
      slideInterval: null as number | null,
      advertisements: [] as AdvertisementDto[],
      featuredSpaces: [] as SpaceDto[],
      testimonials: [] as TestimonialDto[],
      locations: [] as string[], // Real locations from API
      companyProfile: {
        name: 'WorkSpace',
        email: 'support@workspace.com',
        phone: '+1 (234) 567-890',
        address: '123 Workspace Ave, New York, NY 10001',
        image: ''
      } as CompanyProfileDto,
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
          src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt: 'Modern dedicated desk'
        },
        {
          src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt: 'Professional meeting room'
        },
        {
          src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
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

  beforeMount() {
    // Use hardcoded values instead of loading from API
    this.setHardcodedValues();
    // Turn off loading state immediately
    this.isLoading = false;
  },
  
  mounted() {
    // Start slideshow after mounting
    this.startSlideshow();
  },

  beforeUnmount() {
    this.stopSlideshow();
  },

  methods: {
    /**
     * How to call backend APIs and map data for Home page:
     *
     * // 1. Get all locations for dropdown
     * // const locationsRes = await networkManager.getLocations();
     * // this.locationOptions = locationsRes; // string[]
     *
     * // 2. Get all space types for dropdown
     * // const spaceTypesRes = await networkManager.getSpaceTypes();
     * // this.spaceTypeOptions = spaceTypesRes; // Array<{ value, label, icon }>
     *
     * // 3. Get hero images for slideshow
     * // const heroImagesRes = await networkManager.getHeroImages();
     * // this.heroImages = heroImagesRes; // Array<{ src, alt }>
     *
     * // 4. Get advertisements for offers/partners
     * // const adsRes = await networkManager.getAdvertisements();
     * // this.advertisements = adsRes; // AdvertisementDto[]
     *
     * // 5. Get featured workspaces
     * // const featuredRes = await networkManager.getFeaturedSpaces();
     * // this.featuredSpaces = featuredRes; // SpaceDto[]
     *
     * // 6. Get testimonials
     * // const testimonialsRes = await networkManager.getTestimonials();
     * // this.testimonials = testimonialsRes; // TestimonialDto[]
     *
     * // 7. Subscribe to newsletter
     * // const subRes = await networkManager.subscribeNewsletter(email);
     * // if (subRes.success) { ... }
     *
     * // 8. Get branding (logo, website name)
     * // const brandingRes = await networkManager.getBranding();
     * // this.logoUrl = brandingRes.logoUrl;
     * // this.websiteName = brandingRes.websiteName;
     *
     * // 9. Get footer contact details
     * // const contactRes = await networkManager.getFooterContact();
     * // this.footerEmail = contactRes.email;
     * // this.footerPhone = contactRes.phone;
     * // this.footerAddress = contactRes.address;
     *
     * When backend is ready, uncomment the above and remove the mock/demo data.
     */
    // Removed loadHomePageData method - using hardcoded values instead
    
    // Instead of API calls, set hardcoded values
    setHardcodedValues(): void {
      // Set hardcoded company profile
      this.companyProfile = {
        name: 'Squarehub',
        email: 'contact@squarehub.com',
        phone: '+1 (123) 456-7890',
        address: '123 Workspace Avenue, Business District, Colombo',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      };
      
      // Set hardcoded featured spaces
      this.featuredSpaces = [
        {
          id: 1,
          name: 'Executive Meeting Room',
          description: 'Professional meeting space with modern amenities for your business needs',
          location: 'Kandy Lakeside',
          address: '123 Kandy Street, Kandy',
          productType: 'meeting-room',
          images: [
            'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          rating: 4.8,
          reviews: 124,
          pricing: {
            hourly: 25,
            daily: 180
          },
          capacity: 12,
          maxCapacity: 15,
          features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
          isAvailable: true,
          availability: [
            { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] }
          ]
        },
        {
          id: 2,
          name: 'Hot Desk Premium',
          description: 'Flexible workspace for professionals on the go',
          location: 'Colombo Central',
          address: '45 Main Street, Colombo',
          productType: 'hot-desk',
          images: [
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          rating: 4.5,
          reviews: 89,
          pricing: {
            daily: 35
          },
          capacity: 1,
          maxCapacity: 1,
          features: ['wifi', 'coffee', 'printing', 'locker'],
          isAvailable: true,
          availability: [
            { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] }
          ]
        },
        {
          id: 3,
          name: 'Dedicated Office Space',
          description: 'Private office space with 24/7 access',
          location: 'Galle Fort',
          address: '78 Fort Road, Galle',
          productType: 'dedicated-desk',
          images: [
            'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          rating: 4.9,
          reviews: 45,
          pricing: {
            monthly: 350
          },
          capacity: 1,
          maxCapacity: 1,
          features: ['wifi', 'coffee', 'printing', 'parking', '24-7-access', 'meeting-room-credits'],
          isAvailable: true,
          availability: [
            { date: '2025-08-27', slots: [{ startTime: '00:00', endTime: '23:59' }] }
          ]
        }
      ];
      
      // Set hardcoded testimonials
      this.testimonials = [
        {
          id: 1,
          name: 'Sarah Chen',
          role: 'Marketing Director',
          rating: 5,
          content: 'The workspace is amazing! Perfect for our team meetings and collaborative sessions.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 2,
          name: 'Michael Ross',
          role: 'Software Engineer',
          rating: 5,
          content: 'Great location and excellent technology setup. The high-speed internet is reliable.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          role: 'Graphic Designer',
          rating: 4,
          content: 'Love the natural light and creative atmosphere. Perfect for my design work.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        }
      ];
      
      // Set hardcoded locations
      this.locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna'];
      
      // Set hardcoded advertisements
      this.advertisements = [
        {
          id: 1,
          title: 'Summer Discount',
          description: 'Get 20% off on all workspace bookings this summer',
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          buttonText: 'Learn More',
          link: '/promotions/summer'
        },
        {
          id: 2,
          title: 'Corporate Packages',
          description: 'Special rates for businesses with 10+ employees',
          image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          buttonText: 'View Packages',
          link: '/corporate'
        }
      ];
    },

    searchSpaces(): void {
      this.isSearching = true;
      
      const query: Record<string, string> = {};
      if (this.searchForm.location) query.location = this.searchForm.location;
      if (this.searchForm.spaceType) query.spaceType = this.searchForm.spaceType;

      this.$router.push({ name: 'SearchResults', query })
        .catch(error => console.error('Error during search:', error))
        .finally(() => this.isSearching = false);
    },

    viewSpace(id: number): void {
      this.$router.push({
        name: 'SpaceDetails',
        params: { id: id.toString() }
      })
      .catch(error => console.error('Error navigating to space details:', error));
    },

    subscribeNewsletter(): void {
      if (!this.newsletterEmail) return;

      this.isSubscribing = true;
      this.subscriptionMessage = '';
      
      // Mock successful subscription without API call
      setTimeout(() => {
        this.subscriptionMessage = 'Successfully subscribed!';
        this.newsletterEmail = '';
        this.isSubscribing = false;
        
        // Clear message after delay
        setTimeout(() => {
          this.subscriptionMessage = '';
        }, 5000);
      }, 500); // Simulate network delay
    },

    subscribeFooterNewsletter(): void {
      if (!this.footerNewsletterEmail) return;

      this.isSubscribing = true;
      this.footerSubscriptionMessage = '';
      
      // Mock successful subscription without API call
      setTimeout(() => {
        this.footerSubscriptionMessage = 'Successfully subscribed!';
        this.footerNewsletterEmail = '';
        this.isSubscribing = false;
        
        // Clear message after delay
        setTimeout(() => {
          this.footerSubscriptionMessage = '';
        }, 5000);
      }, 500); // Simulate network delay
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

    // Hero slideshow methods removed - using single static hero image

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
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 640px) {
  .container-padding {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .container-padding {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.section-padding {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
@media (min-width: 1024px) {
  .section-padding {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition-property: all;
  transition-duration: 200ms;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition-property: background-color;
  transition-duration: 200ms;
}
.btn-primary:hover {
  background-color: rgba(var(--color-primary-rgb), 0.9);
}
.btn-primary:focus {
  outline: none;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--color-primary);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
</style>