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
  const currentBooking = ref<BookingDetails[]>([])
  const bookingHistory = ref<BookingDto[]>([])
  const isProcessing = ref(false)
  const isFloating = ref(false)
  const isMinimized = ref(false)

  // Actions
  const setBookingDetails = (details: BookingDetails) => {
    const existingIndex = currentBooking.value.findIndex(i => i.spaceId === details.spaceId);

    if (existingIndex !== -1) {
      // If an item with the same spaceId exists, replace it
      currentBooking.value[existingIndex] = details;
    } else {
      // Otherwise, add the new item
      currentBooking.value.push(details);
    }
    
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value));
  }

  const removeBookingItem = (spaceId: number) => {
    currentBooking.value = currentBooking.value.filter(item => item.spaceId !== spaceId);
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value));
  }

  const updateBookingDetails = (bookings: BookingDetails[]) => {
    currentBooking.value = bookings;
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value))
  }

  const clearBookingDetails = () => {
    currentBooking.value = []
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

  const setFloating = (floating: boolean) => {
    isFloating.value = floating;
  };

  const setMinimized = (minimized: boolean) => {
    isMinimized.value = minimized;
  };

  const toggleMinimized = () => {
    isMinimized.value = !isMinimized.value;
  };

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
    isFloating,
    isMinimized,
    
    // Actions
    setBookingDetails,
    removeBookingItem,
    updateBookingDetails,
    clearBookingDetails,
    initializeBooking,
    setProcessing,
    setFloating,
    setMinimized,
    toggleMinimized,
    addToBookingHistory,
    loadBookingHistory,
    clearBookingHistory
  }
})