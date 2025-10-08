// src/api/bookingManager.ts
// Manages booking-related API calls

import { useSystemStore } from '../stores/system'

// Interface for booking data returned by the API
export interface BookingData {
  booking_id: number;
  user_id: number;
  first_name?: string | null;
  last_name?: string | null;
  order_id?: string;
  product_id: number;
  is_onetime_changed: boolean;
  is_updatable: boolean;
  wallet_id?: number;
  facility_ids: number[];
  products: Array<{
    product_id: number;
    product_name: string;
    price: number;
    location_name: string;
    booking_date: string;
    start_time: string | null;
    end_time: string | null;
    product_image?: string;
    is_cancelled: boolean;
    is_onetime_changed: boolean;
    is_updatable: boolean;
    subscription_start_date: string | null;
    subscription_end_date: string | null;
    package_type: string | null;
    facilities: Array<{
      facility_id: number;
      facility_name: string | null;
      price: number;
    }>;
  }>;
  total_price: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookings: Array<BookingData>;
}

export class BookingManager {
  private static readonly BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';

  private static reportError(message: string, endpoint: string, statusCode?: number) {
    try {
      const systemStore = useSystemStore();
      systemStore.reportApiError({
        message,
        endpoint,
        statusCode,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.warn('Unable to record booking API error:', error);
    }
  }

  /**
   * Helper method to process bookings with product details
   */
  private static async processBookingsWithDetails(bookings: BookingData[]): Promise<BookingData[]> {
    // Since product details are now embedded in the products array,
    // we don't need to fetch additional details from the API
    return bookings.map(booking => {
      // Flatten the products array - for now, take the first product
      // In the future, you might want to handle multiple products per booking differently
      const primaryProduct = booking.products && booking.products.length > 0 ? booking.products[0] : null;

      if (primaryProduct) {
        return {
          ...booking,
          product_name: primaryProduct.product_name,
          product_image: '', // You can set a default image or fetch it separately if needed
          location_name: primaryProduct.location_name,
          booking_date: primaryProduct.booking_date,
          start_time: primaryProduct.start_time,
          end_time: primaryProduct.end_time,
          facility_ids: primaryProduct.facilities ? primaryProduct.facilities.map(f => f.facility_id) : booking.facility_ids
        };
      }

      return booking;
    });
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
        
        this.reportError(errorMessage, endpoint, response.status);

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
      let errorMessage = 'We could not load your bookings right now. Please try again later.';

      if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Reconnect to load your bookings.';
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      this.reportError(errorMessage, endpoint);

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
   *   "booking_id": 1,
   *   "cancelation_reason": ""
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
          booking_id: bookingId,
          cancelation_reason: ""
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
        this.reportError(errorMessage, '/booking/cancel-booking', response.status);
        
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
        const errorMessage = data.message || 'Failed to cancel booking';
        this.reportError(errorMessage, '/booking/cancel-booking');
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to cancel booking. Please try again shortly.';

      if (!navigator.onLine) {
        errorMessage = 'You are offline. Reconnect before cancelling the booking.';
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      this.reportError(errorMessage, '/booking/cancel-booking');
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  
  /**
   * Cancel a specific product in a booking
   * Endpoint: /booking/cancel-product
   * Method: POST
   * Request:
   * {
   *   "booking_id": 1,
   *   "product_id": 5,
   *   "cancelation_reason": ""
   * }
   */
  static async cancelBookingProduct(bookingId: number, productId: number): Promise<{
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
          booking_id: bookingId,
          product_id: productId,
          cancelation_reason: ""
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to cancel product.';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid booking or product ID.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please sign in again.';
            break;
          case 404:
            errorMessage = 'Product or booking not found.';
            break;
          case 409:
            errorMessage = 'Cannot cancel product at this time.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
        this.reportError(errorMessage, '/booking/cancel-product', response.status);
        
        return {
          success: false,
          message: errorMessage
        };
      }

      const data = await response.json();

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Product canceled successfully'
        };
      } else {
        const errorMessage = data.message || 'Failed to cancel product';
        this.reportError(errorMessage, '/booking/cancel-product');
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Cancel product error:', error);
      
      let errorMessage = 'Failed to cancel product. Please try again.';

      if (!navigator.onLine) {
        errorMessage = 'You are offline. Reconnect before cancelling this product.';
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      this.reportError(errorMessage, '/booking/cancel-product');
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}
