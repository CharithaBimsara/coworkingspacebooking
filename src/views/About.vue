<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div class="max-w-8xl mx-auto container-padding section-padding">
        <div class="text-center">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-gray-900 mb-6">
            Revolutionizing the Way
            <span class="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              People Work
            </span>
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            WorkSpace is the premier platform connecting professionals with premium coworking spaces. 
            We believe the future of work is flexible, collaborative, and inspiring.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
              To democratize access to premium workspaces and create a global community of empowered professionals. 
              We're building the infrastructure for the future of work – one that's flexible, inspiring, and connected.
            </p>
            <p class="text-lg text-gray-600 leading-relaxed">
              Whether you're a freelancer, startup founder, or part of a distributed team, we believe everyone 
              deserves access to beautiful, productive workspaces that fuel creativity and collaboration.
            </p>
          </div>
          <div class="relative">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Modern workspace"
              class="w-full rounded-2xl shadow-lg"
            >
            <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div class="text-3xl font-bold text-primary mb-1">10,000+</div>
              <div class="text-gray-600">Happy Members</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="section-padding">
      <div class="max-w-4xl mx-auto container-padding text-center">
        <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-8">
          Our Story
        </h2>
        <div class="prose prose-lg mx-auto text-gray-600">
          <p class="text-xl leading-relaxed mb-8">
            Founded in 2020 by a team of remote work pioneers, WorkSpace was born from a simple frustration: 
            finding quality workspaces shouldn't be so hard.
          </p>
          <p class="text-lg leading-relaxed mb-6">
            As digital nomads and remote workers ourselves, we spent countless hours researching, calling, 
            and visiting coworking spaces around the world. Each city brought new challenges – different 
            booking systems, unclear pricing, limited availability information, and no way to compare options.
          </p>
          <p class="text-lg leading-relaxed mb-6">
            We knew there had to be a better way. So we built WorkSpace – a platform that brings transparency, 
            simplicity, and trust to the coworking industry. Today, we're proud to partner with over 500 
            premium spaces across 50 cities, serving a community of 10,000+ professionals worldwide.
          </p>
          <p class="text-lg leading-relaxed">
            But we're just getting started. Our vision extends far beyond booking platforms – we're building 
            the foundation for a more flexible, sustainable, and human-centered future of work.
          </p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do, from product development to customer support
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
            <p class="text-gray-600 leading-relaxed">
              Clear pricing, honest reviews, and open communication. No hidden fees, no surprises – just honest information to help you make the best decisions.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Community</h3>
            <p class="text-gray-600 leading-relaxed">
              Building connections between professionals, space operators, and local communities. Work is better when we're connected.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Quality</h3>
            <p class="text-gray-600 leading-relaxed">
              Every space in our network meets our high standards for design, amenities, and service. Your workspace should inspire your best work.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Flexibility</h3>
            <p class="text-gray-600 leading-relaxed">
              Work on your terms. Book by the hour, day, or week. Change plans when life changes. Flexibility isn't a feature – it's a fundamental right.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
            <p class="text-gray-600 leading-relaxed">
              Constantly improving through technology and user feedback. The future of work is being written today, and we're helping to author it.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-card text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
            <p class="text-gray-600 leading-relaxed">
              Supporting local businesses, reducing commutes, and promoting shared resources. Better for people, better for the planet.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Meet the Team
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate people building the future of flexible work
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center group">
            <div class="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" 
                alt="Alex Chen"
                class="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Alex Chen</h3>
            <p class="text-primary font-medium mb-3">CEO & Co-Founder</p>
            <p class="text-gray-600 text-sm leading-relaxed">
              Former product manager at Airbnb. Passionate about the intersection of technology and human connection.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" 
                alt="Sarah Rodriguez"
                class="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Sarah Rodriguez</h3>
            <p class="text-primary font-medium mb-3">CTO & Co-Founder</p>
            <p class="text-gray-600 text-sm leading-relaxed">
              Full-stack engineer and former architect at Stripe. Loves building scalable systems that delight users.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" 
                alt="Marcus Johnson"
                class="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Marcus Johnson</h3>
            <p class="text-primary font-medium mb-3">Head of Design</p>
            <p class="text-gray-600 text-sm leading-relaxed">
              Design leader with 10+ years at top startups. Believes great design should be invisible and intuitive.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" 
                alt="Emily Park"
                class="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
              >
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Emily Park</h3>
            <p class="text-primary font-medium mb-3">Head of Operations</p>
            <p class="text-gray-600 text-sm leading-relaxed">
              Operations expert who ensures our partner spaces deliver exceptional experiences to every member.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section-padding bg-primary text-white">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl lg:text-5xl font-bold mb-2">500+</div>
            <div class="text-primary-100">Partner Spaces</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold mb-2">50</div>
            <div class="text-primary-100">Cities Worldwide</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold mb-2">10K+</div>
            <div class="text-primary-100">Happy Members</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold mb-2">98%</div>
            <div class="text-primary-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Careers -->
    <section class="section-padding">
      <div class="max-w-4xl mx-auto container-padding text-center">
        <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
          Join Our Mission
        </h2>
        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          We're looking for passionate people who want to shape the future of work. 
          If you believe in flexibility, community, and making work more human, we'd love to hear from you.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="btn-primary">
            View Open Positions
          </button>
          <router-link to="/contact" class="btn-primary">
            Get in Touch
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-4xl mx-auto container-padding text-center">
        <h2 class="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
          Ready to Transform Your Workday?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Join thousands of professionals who've discovered the power of flexible, inspiring workspaces.
        </p>
        <router-link to="/search" class="btn-primary text-lg px-8 py-4">
          Find Your Perfect Space
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// About page with comprehensive company information
</script>
