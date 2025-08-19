import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SpaceDto, BookingDto } from '../dto/response'

export interface BookingDetails {
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
  // Add a unique key for each booking item
  uniqueKey?: string
}

function generateBookingKey(details: BookingDetails): string {
  let key = `${details.spaceId}-${details.productType}`;
  if (details.productType === 'meeting-room' && details.booking) {
    key += `-${details.booking.startDate}-${details.booking.startTime}-${details.booking.duration}`;
  } else if (details.subscription) {
    key += `-${details.subscription.startDate}-${details.subscription.packageType}`;
  }
  // Add facilities to the key if they are relevant for uniqueness
  if (details.facilities && details.facilities.length > 0) {
    key += `-${details.facilities.sort().join('-')}`;
  }
  return key;
}

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentBooking = ref<BookingDetails[]>([])
  const bookingHistory = ref<BookingDto[]>([])
  const isProcessing = ref(false)
  const isMinimized = ref(false)
  const isAddingMoreServices = ref(false)

  // Actions
  const setBookingDetails = (details: BookingDetails) => {
    const newUniqueKey = generateBookingKey(details);
    const existingIndex = currentBooking.value.findIndex(item => item.uniqueKey === newUniqueKey);

    if (existingIndex !== -1) {
      // If an item with the same unique key exists, replace it (update)
      currentBooking.value[existingIndex] = { ...details, uniqueKey: newUniqueKey };
    } else {
      // Otherwise, add the new item
      currentBooking.value.push({ ...details, uniqueKey: newUniqueKey });
    }
    
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value));
  }

  const removeBookingItem = (uniqueKeyToRemove: string) => {
    currentBooking.value = currentBooking.value.filter(item => item.uniqueKey !== uniqueKeyToRemove);
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value));
    if (currentBooking.value.length === 0) {
      isAddingMoreServices.value = false;
    }
  }

  const updateBookingDetails = (bookings: BookingDetails[]) => {
    currentBooking.value = bookings.map(booking => ({ ...booking, uniqueKey: generateBookingKey(booking) }));
    sessionStorage.setItem('bookingDetails', JSON.stringify(currentBooking.value))
  }

  const clearBookingDetails = () => {
    currentBooking.value = []
    sessionStorage.removeItem('bookingDetails')
    isAddingMoreServices.value = false;
  }

  const initializeBooking = () => {
    try {
      const storedBooking = sessionStorage.getItem('bookingDetails')
      if (storedBooking) {
        // When loading, ensure uniqueKey is regenerated for consistency
        currentBooking.value = JSON.parse(storedBooking).map((item: BookingDetails) => ({
          ...item,
          uniqueKey: generateBookingKey(item)
        }));
      }
    } catch (error) {
      console.error('Error initializing booking:', error)
      clearBookingDetails()
    }
    // Ensure isAddingMoreServices is false on initialization
    isAddingMoreServices.value = false;
  }

  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing
  }

  const setMinimized = (minimized: boolean) => {
    isMinimized.value = minimized;
  };

  const toggleMinimized = () => {
    isMinimized.value = !isMinimized.value;
  };

  const setAddingMoreServices = (value: boolean) => {
    isAddingMoreServices.value = value;
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
    isMinimized,
    isAddingMoreServices,
    
    // Actions
    setBookingDetails,
    removeBookingItem,
    updateBookingDetails,
    clearBookingDetails,
    initializeBooking,
    setProcessing,
    setMinimized,
    toggleMinimized,
    setAddingMoreServices,
    addToBookingHistory,
    loadBookingHistory,
    clearBookingHistory
  }
})