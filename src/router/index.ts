import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../views/SearchResults.vue'
import MeetingRooms from '../views/MeetingRooms.vue'
import HotDesk from '../views/HotDesk.vue'
import DedicatedDesk from '../views/DedicatedDesk.vue'
import SpaceDetails from '../views/SpaceDetails.vue'
import BookingSummary from '../views/BookingSummary.vue'
import Payment from '../views/Payment.vue'
import ProfileSettings from '../views/ProfileSettings.vue'
import PaymentMethods from '../views/PaymentMethods.vue'
import { useThemeStore } from '../stores/theme'

// Lazy load components that might not exist yet
const BookingConfirmation = () => import('../views/BookingConfirmation.vue').catch(() => import('../views/Home.vue'))
const Bookings = () => import('../views/Bookings.vue').catch(() => import('../views/Home.vue'))
// Contact is now integrated in the Home page


const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '/meeting-rooms',
      name: 'MeetingRooms',
      component: MeetingRooms
    },
    {
      path: '/hot-desk',
      name: 'HotDesk',
      component: HotDesk
    },
    {
      path: '/dedicated-desk',
      name: 'DedicatedDesk',
      component: DedicatedDesk
    },
    {
      path: '/space/:id',
      name: 'SpaceDetails',
      component: SpaceDetails
    },
    {
      path: '/booking/summary',
      name: 'BookingSummary',
      component: BookingSummary
    },
    {
      path: '/booking/payment',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/booking/confirmation/:bookingId',
      name: 'BookingConfirmation',
      component: BookingConfirmation
    },
    {
      path: '/my-bookings',
      name: 'Bookings',
      component: Bookings
    },
    // Contact section is now integrated in Home page
    {
      path: '/profile',
      name: 'ProfileSettings',
      component: ProfileSettings
    },
    {
      path: '/payment-methods',
      name: 'PaymentMethods',
      component: PaymentMethods
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If there's a hash in the URL, scroll to it
    if (to.hash) {
      // Return a promise to allow for a delay (ensures element exists)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 15 // Add a small offset to account for fixed header
          });
        }, 500); // Small delay to ensure the page is fully rendered
      });
    }
    // Otherwise scroll to top
    return { top: 0 };
  },
})

// Add navigation guard to ensure theme consistency across route changes
router.beforeEach((to, from, next) => {
  // This ensures Pinia is ready when used in navigation guards
  try {
    // Try to ensure theme is consistent across navigation
    const themeStore = useThemeStore();
    if (themeStore.isInitialized) {
      // Reapply theme to ensure consistency
      themeStore.applyTheme();
    } else {
      // Initialize if not already initialized
      themeStore.initTheme();
    }
  } catch (e) {
    // If Pinia is not ready, just continue
    console.log('Theme store not available during navigation');
  }
  
  next();
});

export default router