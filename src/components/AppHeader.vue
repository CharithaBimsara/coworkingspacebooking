<template>
  <header id="appheader" class="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
    <div class="max-w-8xl mx-auto px-3 sm:px-4 md:px-5 container-padding">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="h-8 w-auto sm:h-10 md:h-10">
              <img
                :src="logoUrl"
                alt="Company Logo"
                class="h-full w-auto object-contain logo-responsive"
              />
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 ml-auto mr-2 sm:mr-4 md:mr-4 lg:mr-8">
          <router-link to="/" class="nav-link" :class="{ 'active': isHomeActive }" @click="handleHomeClick">
            Home
          </router-link>
          <router-link v-if="currentUser" :to="myBookingsLink" class="nav-link" :class="{ 'active': isMyBookingsActive }" @click.prevent="handleMyBookingsClick">
            My Bookings
          </router-link>
          <router-link to="/#about" class="nav-link" :class="{ 'active': isAboutActive }" @click="scrollToAbout">
            About
          </router-link>
          <router-link to="/#contact" class="nav-link" :class="{ 'active': isContactActive }" @click="scrollToContact">
            Contact
          </router-link>
          <!-- Sign In and Sign Up buttons, shown only when user is not logged in -->
          <template v-if="!currentUser">
            <router-link to="/login" class="nav-link hidden lg:block">
              Sign In
            </router-link>
            <router-link to="/register" class="bg-primary text-black px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium hover:bg-primary/90 transition-colors">
              Sign Up
            </router-link>
          </template>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <!-- Reward Points Display (only when logged in) -->
          <RewardPointsDisplay v-if="currentUser" />
          
          <!-- Theme Toggle -->
          <ThemeToggle />
          
          <!-- User Menu -->
          <div v-if="currentUser" class="relative">
            <button @click="toggleUserMenu"
              class="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50">
              <img :src="currentUser.avatar || defaultAvatar" :alt="currentUser.firstName" class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-primary">
              <span class="hidden lg:block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-20 sm:max-w-24">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </span>
              <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div v-if="showUserMenu"
              class="absolute right-0 mt-1 sm:mt-2 w-48 sm:w-52 bg-white dark:bg-black rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1 z-50 transform origin-top scale-100 transition-all duration-200">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary first:rounded-t-xl"
                @click="closeUserMenu">
                Profile Settings
              </router-link>
              <router-link to="/payment-methods" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                @click="closeUserMenu">
                Payment Methods
              </router-link>
              <hr class="my-1 border-gray-200 dark:border-gray-700">
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 last:rounded-b-xl">
                Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button @click="toggleMobileMenu" class="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800">
        <nav class="flex flex-col space-y-1 sm:space-y-2">
          <router-link to="/" class="mobile-nav-link" :class="{ 'active': isHomeActive }" @click="handleHomeClick">
            Home
          </router-link>
          <router-link v-if="currentUser" :to="myBookingsLink" class="mobile-nav-link" :class="{ 'active': isMyBookingsActive }" @click.prevent="handleMyBookingsClick">
            My Bookings
          </router-link>
          <router-link to="/#about" class="mobile-nav-link" :class="{ 'active': isAboutActive }" @click="scrollToAbout">
            About
          </router-link>
          <router-link to="/#contact" class="mobile-nav-link" :class="{ 'active': isContactActive }" @click="scrollToContact">
            Contact
          </router-link>

          <!-- Mobile Authentication Options -->
          <div v-if="!currentUser" class="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
            <router-link to="/login" class="mobile-nav-link text-left w-full" @click="closeMobileMenu">
              Sign In
            </router-link>
            <router-link to="/register" class="mobile-nav-link text-left w-full font-semibold text-primary" @click="closeMobileMenu">
              Sign Up
            </router-link>
          </div>

          <div v-if="currentUser" class="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
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

    <!-- Auth Modals are no longer needed here as we have separate pages -->
    <!-- <AuthModals :showSignIn="showSignInModal" :showSignUp="showSignUpModal" @close="closeAuthModals"
      @user-authenticated="handleUserAuthenticated" @switch-to-signup="switchToSignUp" @switch-to-signin="switchToSignIn"
      :contextMessage="authModalContextMessage" :redirectPath="redirectAfterAuth" /> -->

    <!-- Sign Out Success Overlay -->
    <SuccessOverlay
      :show="authStore.showSignOutMessage"
      title="Signed Out Successfully"
      message="You have been successfully signed out of your account."
      :primary-action="{
        text: 'Continue Browsing',
        action: () => {
          authStore.clearSignOutMessage();
          $router.push('/');
        }
      }"
      @close="authStore.clearSignOutMessage()"
    />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth';
// import AuthModals from './AuthModals.vue'; // No longer needed
import SuccessOverlay from './SuccessOverlay.vue';
import ThemeToggle from './ThemeToggle.vue';
import RewardPointsDisplay from './RewardPointsDisplay.vue';
import { UserDto, CompanyProfileDto } from '../dto/response';
import logoImage from '@/assets/images/app-images/logo.png';

export default defineComponent({
  name: 'AppHeader',
  components: {
    // AuthModals,
    SuccessOverlay, // Register SuccessOverlay
    ThemeToggle, // Register ThemeToggle
    RewardPointsDisplay // Register RewardPointsDisplay
  },

  data() {
    return {
      showUserMenu: false,
      showMobileMenu: false,
      // showSignInModal: false, // No longer needed
      // showSignUpModal: false, // No longer needed
      // authModalContextMessage: '', // No longer needed
      // redirectAfterAuth: '', // No longer needed
      authStore: useAuthStore(), // Initialize authStore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router: null as any, // Initialize router as null
      companyName: '', // Will be populated from hardcoded values
      companyProfile: null as CompanyProfileDto | null,
      logoUrl: logoImage, // Hardcoded logo URL (default)
      isHeaderLoading: true, // Loading state for header
    }
  },

  computed: {
    currentUser(): UserDto | null {
      return this.authStore?.currentUser || null
    },
    myBookingsLink(): string {
      return this.currentUser ? '/my-bookings' : '/'; // Navigate to home if not logged in
    },
    currentRoute(): { path: string; hash?: string } {
      // Get the route and log it for debugging
      const route = this.router?.currentRoute || { path: '/' };
      return route;
    },
    isHomeActive(): boolean {
      return this.currentRoute.path === '/' && 
             (!this.currentRoute.hash || this.currentRoute.hash === '')
    },
    isMyBookingsActive(): boolean {
      return this.currentRoute.path === '/my-bookings'
    },
    isAboutActive(): boolean {
      return this.currentRoute.path === '/' && 
             this.currentRoute.hash === '#about'
    },
    isContactActive(): boolean {
      return this.currentRoute.path === '/' && 
             this.currentRoute.hash === '#contact'
    },
    defaultAvatar(): string {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format'
    }
  },

  watch: {
    '$route'() {
      // Debug route changes
    }
  },

  created() {
    this.router = this.$router;
  },

  beforeMount() {
    // Load hardcoded company profile data before mounting
    this.loadCompanyProfile()
      .catch(error => {
        console.error("Error setting company profile in header:", error);
      });
  },

  mounted() {
    // Initialize auth store
    this.authStore?.initializeAuth()

    // Add click outside listener to close menus
    document.addEventListener('click', this.handleClickOutside)
    
    // Check current path on mount
  },

  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    handleMyBookingsClick() {
      if (this.currentUser) {
        this.router?.push('/my-bookings');
      } else {
        this.authStore?.setRedirectPath(this.$route.fullPath);
        this.router?.push('/login');
      }
      this.closeMobileMenu();
    },

    handleHomeClick() {
      this.closeMobileMenu();
    },

    handleUserAuthenticated(_user: UserDto) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // The auth store is already updated by the AuthModals component
    },

    handleLogout() {
      this.authStore?.clearUser()

      this.closeUserMenu()
      this.closeMobileMenu()

      // Redirect to home if on a protected route
      if (this.currentRoute.path === '/my-bookings' || 
          this.currentRoute.path === '/profile' ||
          this.currentRoute.path.startsWith('/profile/') ||
          this.currentRoute.path === '/payment-methods') {
        this.router?.push('/')
      }
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
    },

    scrollToAbout() {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      this.closeMobileMenu();
    },

    scrollToContact() {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      this.closeMobileMenu();
    },
    
    loadCompanyProfile() {
      // Use hardcoded values instead of API call
      try {
        const profileData = {
          name: 'Squarehub',
          email: 'contact@squarehub.com',
          phone: '+1 (123) 456-7890',
          address: '123 Workspace Avenue, Business District, Colombo',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          logoUrl: logoImage
        };
        
        this.companyProfile = profileData;
        this.companyName = profileData.name;
        this.logoUrl = profileData.logoUrl;
        // Using hardcoded data until API is ready
        
        // Turn off loading immediately
        this.isHeaderLoading = false;
        
        return Promise.resolve(profileData);
      } catch (error) {
        console.error('Error setting company profile:', error);
        this.companyName = 'Squarehub';
        this.isHeaderLoading = false;
        return Promise.reject(error);
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
  transition-property: color, border-color;
  transition-duration: 200ms;
  position: relative;
  padding-bottom: 0.5rem;
  /* Ensure we account for the absolute positioning of the underline */
  margin-bottom: -1px;
}

.nav-link.active {
  color: #00FE01;
  /* text-primary */
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #00FE01;
  /* primary color */
  border-radius: 1px;
  /* Ensure the indicator is visible */
  z-index: 2;
}

.dark .nav-link {
  color: #D1D5DB;
  /* text-gray-400 */
}

.dark .nav-link:hover {
  color: #00FE01;
  /* text-gray-50 */
}

.dark .nav-link.active {
  color: #00FE01;
}

.nav-link:hover {
  color: #111827;
  /* text-gray-900 */
}

/* Logo responsive sizing */
.logo-responsive {
  max-width: 120px;
}

@media (min-width: 640px) {
  .logo-responsive {
    max-width: 150px;
  }
}

@media (min-width: 768px) {
  .logo-responsive {
    max-width: 180px;
  }
}

/* Mobile specific styles */
@media (max-width: 767px) {
  .container-padding {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  /* Adjust header for mobile */
  header {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Tablet specific styles */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Special handling for tablet navigation */
  .nav-link {
    padding-bottom: 0.4rem;
    font-size: 13px;
  }
  
  /* Adjust spacing between nav items */
  nav.space-x-4 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.75rem; /* 12px */
  }
  
  nav.space-x-6 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1rem; /* 16px */
  }
  
  nav.space-x-8 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1.25rem; /* 20px */
  }
}

/* Large tablet and small desktop */
@media (min-width: 1024px) and (max-width: 1279px) {
  .nav-link {
    font-size: 14px;
  }
}

.mobile-nav-link {
  display: block;
  padding-left: 0.75rem;
  /* px-3 */
  padding-right: 0.75rem;
  /* px-3 */
  padding-top: 0.625rem;
  /* py-2.5 */
  padding-bottom: 0.625rem;
  /* py-2.5 */
  color: #4B5563;
  /* text-gray-600 */
  font-weight: 500;
  /* font-medium */
  border-radius: 0.5rem; /* rounded-lg */
  transition-property: color, background-color;
  transition-duration: 200ms;
  position: relative;
}

@media (min-width: 640px) {
  .mobile-nav-link {
    padding-left: 1rem;
    /* px-4 */
    padding-right: 1rem;
    padding-top: 0.75rem;
    /* py-3 */
    padding-bottom: 0.75rem;
  }
}

.mobile-nav-link.active {
  color: #00FE01;
  background-color: rgba(0, 254, 1, 0.1);
}

.mobile-nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background-color: #00FE01;
  border-radius: 2px;
}

.mobile-nav-link:hover {
  color: #111827;
  /* text-gray-900 */
  background-color: #F9FAFB;
  /* bg-gray-50 */
}

.dark .mobile-nav-link {
  color: #D1D5DB;
}

.dark .mobile-nav-link:hover {
  color: #00FE01;
  background-color: rgba(0, 254, 1, 0.1);
}

.dark .mobile-nav-link.active {
  color: #00FE01;
  background-color: rgba(0, 254, 1, 0.1);
}

/* Responsive user dropdown */
@media (max-width: 640px) {
  .user-dropdown {
    right: -0.5rem;
    width: 180px;
  }
}
</style>