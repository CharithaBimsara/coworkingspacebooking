import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../views/SearchResults.vue'



import SpaceDetails from '../views/SpaceDetails.vue'
import BookingSummary from '../views/BookingSummary.vue'
import Payment from '../views/Payment.vue'
import ProfileSettings from '../views/ProfileSettings.vue'
import PaymentMethods from '../views/PaymentMethods.vue'
import { useThemeStore } from '../stores/theme'
import PaymentGateway from '../views/PaymentGateway.vue'
import Auth from '../views/Auth.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

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
      path: '/auth',
      component: Auth,
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'Login',
          component: Login
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
        },
        {
          path: '/reset-password',
          name: 'PasswordReset',
          component: () => import('../views/PasswordReset.vue')
        }
      ]
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
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
      path: '/booking-confirmation',
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
    },
    {
      path: '/payment-gateway',
      name: 'PaymentGateway',
      component: PaymentGateway
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
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
  } catch {
    // If Pinia is not ready, just continue
    console.log('Theme store not available during navigation');
  }
  
  // Check authentication for protected routes
  const protectedRoutes = ['/my-bookings', '/profile', '/payment-methods'];
  const isProtectedRoute = protectedRoutes.includes(to.path) || to.path.startsWith('/profile/');
  
  // Check if user is authenticated by checking localStorage
  const userStr = localStorage.getItem('workspace_user');
  const authToken = localStorage.getItem('auth_token');
  const isAuthenticated = !!userStr && !!authToken;
  
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to home page if trying to access protected route without being authenticated
    next('/');
  } else {
    next();
  }
});

export default router