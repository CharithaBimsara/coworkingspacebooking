import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../views/SearchResults.vue'
import MeetingRooms from '../views/MeetingRooms.vue'
import HotDesk from '../views/HotDesk.vue'
import CoworkingSpace from '../views/CoworkingSpace.vue'
import SpaceDetails from '../views/SpaceDetails.vue'
import BookingSummary from '../views/BookingSummary.vue'
import Payment from '../views/Payment.vue'
import ProfileSettings from '../views/ProfileSettings.vue'
import PaymentMethods from '../views/PaymentMethods.vue'

// Lazy load components that might not exist yet
const BookingConfirmation = () => import('../views/BookingConfirmation.vue').catch(() => import('../views/Home.vue'))
const Bookings = () => import('../views/Bookings.vue').catch(() => import('../views/Home.vue'))
const About = () => import('../views/About.vue').catch(() => import('../views/Home.vue'))
const Contact = () => import('../views/Contact.vue').catch(() => import('../views/Home.vue'))


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
      path: '/coworking-space',
      name: 'CoworkingSpace',
      component: CoworkingSpace
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
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
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
  routes
})

export default router
