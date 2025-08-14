import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SpaceDto, BookingDto } from '../dto/response'

interface BookingDetails {
  spaceId: number
  productType: string
  space: SpaceDto
  booking?: {
    startDate: string | null
    endDate: string | null
    startTime: string
    duration: string
    // Keep legacy date field for backward compatibility
    date?: string
  }
  subscription?: {
    startDate: string | null
    endDate: string | null
    packageType: string
    teamSize?: string
  }
  facilities?: string[]
  totalPrice: number
  pricing: {
    basePrice: number
    facilitiesPrice: number
    serviceFee?: number
    taxes?: number
    total: number
  }
  guestInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
    emergencyContactName?: string
    emergencyContactPhone?: string
  }
  promoCode?: string | null
}

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentBooking = ref<BookingDetails | null>(null)
  const bookingHistory = ref<BookingDto[]>([])
  const isProcessing = ref(false)

  // Actions
  const setBookingDetails = (details: BookingDetails) => {
    currentBooking.value = details
    
    // Persist to sessionStorage for booking flow
    sessionStorage.setItem('bookingDetails', JSON.stringify(details))
  }

  const updateBookingDetails = (updates: Partial<BookingDetails>) => {
    if (currentBooking.value) {
      currentBooking.value = { ...currentBooking.value, ...updates }
      sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value))
    }
  }

  const clearBookingDetails = () => {
    currentBooking.value = null
    sessionStorage.removeItem('bookingDetails')
  }

  const initializeBooking = () => {
    try {
      const storedBooking = sessionStorage.getItem('bookingDetails')
      if (storedBooking) {
        currentBooking.value = JSON.parse(storedBooking)
      }
    } catch (error) {
      console.error('Error initializing booking:', error)
      clearBookingDetails()
    }
  }

  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing
  }

  const addToBookingHistory = (booking: BookingDto) => {
    bookingHistory.value.unshift(booking)
    
    // Persist booking history to localStorage
    localStorage.setItem('booking_history', JSON.stringify(bookingHistory.value))
  }

  const loadBookingHistory = () => {
    try {
      const storedHistory = localStorage.getItem('booking_history')
      if (storedHistory) {
        bookingHistory.value = JSON.parse(storedHistory)
      }
    } catch (error) {
      console.error('Error loading booking history:', error)
      bookingHistory.value = []
    }
  }

  const clearBookingHistory = () => {
    bookingHistory.value = []
    localStorage.removeItem('booking_history')
  }

  return {
    // State
    currentBooking,
    bookingHistory,
    isProcessing,
    
    // Actions
    setBookingDetails,
    updateBookingDetails,
    clearBookingDetails,
    initializeBooking,
    setProcessing,
    addToBookingHistory,
    loadBookingHistory,
    clearBookingHistory
  }
})