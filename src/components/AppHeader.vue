<template>
  <header class="bg-white  border-b border-gray-100 sticky top-0  z-50"> 
    <div class="max-w-8xl mx-auto px-5 container-padding">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">W</span>
            </div>
            <span class="text-xl font-heading font-bold text-gray-900">WorkSpace</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8 ml-auto mr-8">
          <router-link to="/" class="nav-link" :class="{ 'text-primary': $route.path === '/' }">
            Home
          </router-link>
          <router-link :to="myBookingsLink" class="nav-link" :class="{ 'text-primary': $route.path === '/my-bookings' }" @click.prevent="handleMyBookingsClick">
            My Bookings
          </router-link>
          <router-link to="/about" class="nav-link" :class="{ 'text-primary': $route.path === '/about' }">
            About
          </router-link>
          <router-link to="/contact" class="nav-link" :class="{ 'text-primary': $route.path === '/contact' }">
            Contact
          </router-link>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- User Menu -->
          <div v-if="currentUser" class="relative">
            <button @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors z-50">
              <img :src="currentUser.avatar" :alt="currentUser.firstName" class="w-8 h-8 rounded-full object-cover">
              <span class="hidden sm:block text-sm font-medium text-gray-700">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </span>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu">
                Profile Settings
              </router-link>
              <router-link to="/payment-methods" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu">
                Payment Methods
              </router-link>
              <hr class="my-1">
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <nav class="flex flex-col space-y-2">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
            Home
          </router-link>
          <router-link :to="myBookingsLink" class="mobile-nav-link" @click.prevent="handleMyBookingsClick">
            My Bookings
          </router-link>
          <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
            About
          </router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">
            Contact
          </router-link>

          <div v-if="currentUser" class="pt-4 border-t border-gray-200">
            <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
              Profile Settings
            </router-link>
            <router-link to="/payment-methods" class="mobile-nav-link" @click="closeMobileMenu">
              Payment Methods
            </router-link>
            <button @click="handleLogout" class="mobile-nav-link text-left w-full text-red-600">
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Auth Modals -->
    <AuthModals :showSignIn="showSignInModal" :showSignUp="showSignUpModal" @close="closeAuthModals"
      @user-authenticated="handleUserAuthenticated" :contextMessage="authModalContextMessage" />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthModals from './AuthModals.vue'
import type { UserDto } from '../dto/response'
import { useAuthStore } from '../stores/auth'

export default defineComponent({
  name: 'AppHeader',
  components: {
    AuthModals
  },

  data() {
    return {
      showUserMenu: false,
      showMobileMenu: false,
      showSignInModal: false,
      showSignUpModal: false,
      authModalContextMessage: '' // New data property
    }
  },

  computed: {
    currentUser(): UserDto | null {
      const authStore = useAuthStore()
      return authStore.currentUser
    },
    myBookingsLink(): string {
      return this.currentUser ? '/my-bookings' : '/'; // Navigate to home if not logged in
    }
  },

  mounted() {
    // Initialize auth store
    const authStore = useAuthStore()
    authStore.initializeAuth()

    // Add click outside listener to close menus
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {

    openLogin(message: string = '') { // Modified to accept message
      console.log('Opening login modal')
      this.showSignInModal = true
      this.authModalContextMessage = message; // Set the message
      this.closeMobileMenu()
    },

    handleMyBookingsClick() {
      if (this.currentUser) {
        this.$router.push('/my-bookings');
      } else {
        this.openLogin('To view your bookings, please log in or register.'); // Pass the message
      }
      this.closeMobileMenu();
    },

    closeAuthModals() {
      this.showSignInModal = false
      this.showSignUpModal = false
      this.authModalContextMessage = ''; // Clear the message
    },

    handleUserAuthenticated(user: UserDto) {
      console.log('User authenticated:', user)
      const authStore = useAuthStore()
      // The auth store is already updated by the AuthModals component
      this.closeAuthModals()
    },

    handleLogout() {
      console.log('User logging out')
      const authStore = useAuthStore()
      authStore.clearUser()

      this.closeUserMenu()
      this.closeMobileMenu()

      // Redirect to home if on protected route
      if (this.$route.path === '/my-bookings') {
        this.$router.push('/')
      }

      alert('Successfully signed out!')
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    closeUserMenu() {
      this.showUserMenu = false
    },

    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },

    closeMobileMenu() {
      this.showMobileMenu = false
    },

    handleClickOutside(event: Event) {
      const target = event.target as Element
      // Close user menu if clicking outside
      if (this.showUserMenu && !target.closest('.relative')) {
        this.closeUserMenu()
      }

      // Close mobile menu if clicking outside
      if (this.showMobileMenu && !target.closest('header')) {
        this.closeMobileMenu()
      }
    }
  }
})
</script>

<style scoped>
.nav-link {
  color: #4B5563;
  /* text-gray-600 */
  font-weight: 500;
  /* font-medium */
  transition-property: color;
  transition-duration: 200ms;
}

.nav-link:hover {
  color: #111827;
  /* text-gray-900 */
}

.mobile-nav-link {
  display: block;
  padding-left: 1rem;
  /* px-4 */
  padding-right: 1rem;
  padding-top: 0.75rem;
  /* py-3 */
  padding-bottom: 0.75rem;
  color: #4B5563;
  /* text-gray-600 */
  font-weight: 500;
  /* font-medium */
  border-radius: 0.5rem; /* rounded-lg */
  transition-property: color, background-color;
  transition-duration: 200ms;
}

.mobile-nav-link:hover {
  color: #111827;
  /* text-gray-900 */
  background-color: #F9FAFB;
  /* bg-gray-50 */
}
</style>