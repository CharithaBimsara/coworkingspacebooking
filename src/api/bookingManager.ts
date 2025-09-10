// src/api/bookingManager.ts
// Manages booking-related API calls

import { NetworkManager } from './networkManager';

// Interface for booking data returned by the API
export interface BookingData {
  booking_id: number;
  user_id: number;
  first_name?: string | null;
  product_id: number;
  payment_id: number;
  total_price: number;
  facility_ids: number[];
  booking_date: string;
  start_time: string;
  end_time: string;
  is_onetime_changed: boolean;
  product_name?: string;
  product_image?: string;
  location_name?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookings: Array<BookingData>;
}

export class BookingManager {
  private static readonly BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';

  /**
   * Helper method to process bookings with product details
   */
  private static async processBookingsWithDetails(bookings: BookingData[]): Promise<BookingData[]> {
    return await Promise.all(
      bookings.map(async (booking: BookingData) => {
        try {
          // Get product details using NetworkManager
          const productResponse = await NetworkManager.getSpaces({ id: booking.product_id });
          
          if (productResponse.success && productResponse.space) {
            return {
              ...booking,
              product_name: productResponse.space.name || 'Unknown Space',
              product_image: productResponse.space.images && productResponse.space.images.length > 0 
                ? productResponse.space.images[0] 
                : '',
              location_name: productResponse.space.location || ''
            };
          }
          
          return booking;
        } catch (error) {
          console.warn(`Error fetching details for booking ${booking.booking_id}:`, error);
          return booking;
        }
      })
    );
  }

  /**
   * Helper method to handle booking API requests
   */
  private static async fetchBookings(endpoint: string, userId: number): Promise<BookingResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage = `Failed to fetch bookings from ${endpoint}`;
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your user ID.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please sign in again.';
            break;
          case 404:
            errorMessage = 'No bookings found.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
        
        return {
          success: false,
          message: errorMessage,
          bookings: []
        };
      }

      const data = await response.json();

      if (data.status_code === 200 && Array.isArray(data.data)) {
        const bookings = data.data;
        const bookingsWithDetails = await this.processBookingsWithDetails(bookings);
        
        return {
          success: true,
          message: data.message || 'Bookings retrieved successfully',
          bookings: bookingsWithDetails
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve bookings',
          bookings: []
        };
      }
    } catch (error) {
      console.error(`Error fetching bookings from ${endpoint}:`, error);
      
      // Provide more user-friendly error messages
      let errorMessage = `Failed to retrieve bookings`;
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      return {
        success: false,
        message: errorMessage,
        bookings: []
      };
    }
  }

  /**
   * Get upcoming bookings for a user
   * Endpoint: /booking/get-upcoming-bookings
   */
  static async getUpcomingBookings(userId: number): Promise<BookingResponse> {
    return this.fetchBookings('/booking/get-upcoming-bookings', userId);
  }

  /**
   * Get past bookings for a user
   * Endpoint: /booking/get-past-bookings
   */
  static async getPastBookings(userId: number): Promise<BookingResponse> {
    return this.fetchBookings('/booking/get-past-bookings', userId);
  }

  /**
   * Get canceled bookings for a user
   * Endpoint: /booking/get-canceled-bookings
   */
  static async getCanceledBookings(userId: number): Promise<BookingResponse> {
    return this.fetchBookings('/booking/get-canceled-bookings', userId);
  }

  /**
   * Cancel a booking
   * Endpoint: /booking/cancel-booking
   * Method: POST
   * Request:
   * {
   *   "booking_id": 1
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Booking canceled successfully"
   * }
   */
  static async cancelBooking(bookingId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/booking/cancel-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId
        })
      });

      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage = 'Failed to cancel booking.';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid booking ID.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please sign in again.';
            break;
          case 404:
            errorMessage = 'Booking not found.';
            break;
          case 409:
            errorMessage = 'Cannot cancel booking at this time.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }

      const data = await response.json();

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Booking canceled successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to cancel booking'
        };
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to cancel booking';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}
