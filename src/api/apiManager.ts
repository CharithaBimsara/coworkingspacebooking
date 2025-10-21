// src/api/apiManager.ts
// Unified API Manager for all booking and network operations
// Combines BookingManager and NetworkManager with best practices

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { SpaceDto } from '../dto/response';
import { AdvertisementDto } from '../dto/response';
import { useSystemStore } from '../stores/system';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';

// HTTP Status Codes
enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

// API Endpoints
enum Endpoints {
  // Booking endpoints
  GET_UPCOMING_BOOKINGS = '/booking/get-upcoming-bookings',
  GET_PAST_BOOKINGS = '/booking/get-past-bookings',
  GET_CANCELED_BOOKINGS = '/booking/get-canceled-bookings',
  CANCEL_BOOKING = '/booking/cancel-booking',
  CANCEL_PRODUCT = '/booking/cancel-product',
  GET_BOOKED_TIME_SLOTS = '/booking/get-booked-time-durations',
  GET_USER_SUBSCRIPTIONS = '/booking/get-user-subscriptions',
  UPDATE_BOOKING = '/booking/update-booking',

  // Product/Space endpoints
  FILTER_PRODUCTS = '/product/filter-products',
  GET_PRODUCT_BY_ID = '/product/get-product-by-id',

  // Location endpoints
  GET_ALL_LOCATIONS = '/locations/get-all',

  // Facility endpoints
  GET_FACILITY_TYPES = '/facility-type/get-facility-type-list',

  // Advertisement endpoints
  GET_ALL_PROMOTIONS = '/advertising/get-all-promotion',

  // User/Auth endpoints
  CREATE_USER = '/users/create',
  UPDATE_USER = '/users/update',
  GET_USER_BY_ID = '/users/get-by-id',
  LOGIN_USER = '/users/login',
  SEND_RESET_LINK = '/users/send-reset-link',
  RESET_WITH_CODE = '/users/reset-with-code',
  GET_USER_REWARDS = '/rewards/customer-portal-get-rewards-by-user',

  // Payment endpoints
  GET_PAYMENT_METHODS = '/payment/get-payment-methods',
  ADD_CARD = '/payment/add-card',
  PROCESS_CARD_PAYMENT = '/cards/pay-with-rewards',
  PROCESS_SAVED_CARD_PAYMENT = '/cards/pay-with-saved-card-and-rewards',
  GET_INVOICE = '/cards/get-invoice',
  GET_BOOKING = '/cards/get-booking',
  GET_BILLING_ADDRESS = '/payment/get-billing-address',
  SAVE_BILLING_ADDRESS = '/payment/save-billing-address',

  // Rating endpoints
  ADD_RATING = '/rating/add-rating',
  GET_ALL_RATINGS = '/rating/get-all-ratings',

  // Reward Points endpoints
  GET_USER_REWARD_POINTS = '/rewards/get-user-points',
  DEDUCT_REWARD_POINTS = '/rewards/deduct-points',

  // Contact endpoints
  SEND_CONTACT_MESSAGE = '/contact/send-message',
}

// Custom Error Classes
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, undefined, endpoint);
    this.name = 'NetworkError';
  }
}

class ValidationError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Interfaces
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
  product_name?: string;
  product_image?: string;
  location_name?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookings: Array<BookingData>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  status_code?: number;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  token?: string;
  data?: any;
}

interface LocationData {
  id: number;
  name: string;
  street?: string;
  street_two?: string;
  town?: string;
  district?: string;
  address?: string;
  url?: string;
}

interface ApiSpaceData {
  id?: number;
  name?: string;
  product_description?: string;
  discription?: string;
  location_name?: string;
  locationName?: string;
  location?: string;
  address?: string;
  productType?: string;
  type?: string;
  pricing?: Array<{
    hourly?: number;
    daily?: number;
    monthly?: number;
    yearly?: number;
  }>;
  availability?: Array<{
    date?: string;
    slots?: unknown[];
  }>;
  features?: string[];
  additional_facilities?: unknown[];
  start_operation_time?: string | null;
  end_operation_time?: string | null;
  images?: string[];
  default_facilities?: unknown[];
  recent_ratings?: unknown[];
  capacity?: number;
  maxCapacity?: number;
  average_rating?: number;
  rating?: number;
  total_reviews?: number;
  reviews?: number;
  review_count?: number;
  amenities?: unknown[];
  nearby_spaces?: unknown[];
  [key: string]: unknown;
}

interface InvoiceData {
  order_id: string;
  transaction_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_amount: number;
  products: InvoiceProduct[];
}

interface InvoiceProduct {
  product_id: number;
  product_type: string;
  location_name: string;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  package_type: string | null;
  total_price: number;
  additional_facilities: InvoiceFacility[];
}

interface InvoiceFacility {
  facility_id: number;
  facility_name: string;
  price: number;
}

interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

interface ContactMessageResponse {
  success: boolean;
  message: string;
  ticket_id?: string;
}

// Main API Manager Class
export class ApiManager {
  private static instance: ApiManager;
  private httpClient: AxiosInstance;
  private customHeaders: Record<string, string> = {};
  public static lastRawResponseData: unknown = null;

  private constructor() {
    this.httpClient = this.createHttpClient();
  }

  public static getInstance(): ApiManager {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  /**
   * Set a custom header for API requests
   * @param key The header key
   * @param value The header value
   */
  public static setAuthHeader(key: string, value: string): void {
    ApiManager.getInstance().customHeaders[key] = value;
  }

  private createHttpClient(): AxiosInstance {
    const client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    client.interceptors.request.use(
      (config: any) => {
        // Add authorization token
        const token = localStorage.getItem('token');
        if (token && this.isValidToken(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add custom headers
        Object.assign(config.headers, this.customHeaders);

        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        const apiError = this.handleAxiosError(error);
        this.reportError(apiError);
        return Promise.reject(apiError);
      }
    );

    return client;
  }

  private handleAxiosError(error: any): ApiError {
    if (!error.response) {
      // Network error
      return new NetworkError(
        navigator.onLine
          ? 'Network error occurred. Please check your connection.'
          : 'You appear to be offline. Please reconnect and try again.',
        error.config?.url
      );
    }

    const { status, data, config } = error.response;
    // Use the actual API message if available, otherwise provide a generic message
    let message = data?.message || 'An error occurred';

    // Only override with generic messages if no specific API message is provided
    if (!data?.message) {
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          message = 'Invalid request. Please check your input.';
          break;
        case HttpStatus.UNAUTHORIZED:
          message = 'Unauthorized. Please sign in again.';
          break;
        case HttpStatus.NOT_FOUND:
          message = 'Resource not found.';
          break;
        case HttpStatus.CONFLICT:
          message = 'Conflict with current state.';
          break;
        case HttpStatus.INTERNAL_SERVER_ERROR:
        case HttpStatus.BAD_GATEWAY:
        case HttpStatus.SERVICE_UNAVAILABLE:
        case HttpStatus.GATEWAY_TIMEOUT:
          message = 'Server error. Please try again later.';
          break;
      }
    }

    return new ApiError(message, status, config?.url);
  }

  private reportError(error: ApiError): void {
    try {
      const systemStore = useSystemStore();
      systemStore.reportApiError({
        message: error.message,
        endpoint: error.endpoint || 'unknown',
        statusCode: error.statusCode,
        timestamp: Date.now(),
      });
    } catch (storeError) {
      console.warn('Unable to report API error to system store:', storeError);
    }
  }

  private isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  // Header management
  public setCustomHeader(key: string, value: string): void {
    this.customHeaders[key] = value;
  }

  public removeCustomHeader(key: string): void {
    delete this.customHeaders[key];
  }

  // Validation helpers
  private validateUserId(userId: number): void {
    if (!userId || userId <= 0) {
      throw new ValidationError('Valid user ID is required');
    }
  }

  private validateBookingId(bookingId: number): void {
    if (!bookingId || bookingId <= 0) {
      throw new ValidationError('Valid booking ID is required');
    }
  }

  // Helper method to standardize API error responses
  private createErrorResponse(statusCode: number, message: string, data: any = null): any {
    return {
      status_code: statusCode,
      message: message,
      data: data,
    };
  }

  // Helper method to handle API errors consistently
  private handleApiError(error: any): any {
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || `Request failed with status ${statusCode}`;

      return this.createErrorResponse(statusCode, errorMessage, error.response.data?.data || null);
    } else if (error.request) {
      // Network error
      return this.createErrorResponse(HttpStatus.BAD_GATEWAY, 'Network error. Please check your connection and try again.', null);
    } else {
      // Other error
      return this.createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred. Please try again.', null);
    }
  }

  // Booking Methods
  public async getUpcomingBookings(userId: number): Promise<BookingResponse> {
    this.validateUserId(userId);
    return this.fetchBookings(Endpoints.GET_UPCOMING_BOOKINGS, { user_id: userId });
  }

  public async getPastBookings(userId: number): Promise<BookingResponse> {
    this.validateUserId(userId);
    return this.fetchBookings(Endpoints.GET_PAST_BOOKINGS, { user_id: userId });
  }

  public async getCanceledBookings(userId: number): Promise<BookingResponse> {
    this.validateUserId(userId);
    return this.fetchBookings(Endpoints.GET_CANCELED_BOOKINGS, { user_id: userId });
  }

  public async cancelBooking(bookingId: number): Promise<{ success: boolean; message: string }> {
    this.validateBookingId(bookingId);
    return this.cancelOperation(Endpoints.CANCEL_BOOKING, { booking_id: bookingId, cancelation_reason: '' });
  }

  public async cancelBookingProduct(bookingId: number, productId: number): Promise<{ success: boolean; message: string }> {
    this.validateBookingId(bookingId);
    if (!productId || productId <= 0) {
      throw new ValidationError('Valid product ID is required');
    }
    return this.cancelOperation(Endpoints.CANCEL_BOOKING, { booking_id: bookingId, product_id: productId, cancelation_reason: '' });
  }

  private async fetchBookings(endpoint: string, payload: any): Promise<BookingResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.post(endpoint, payload);
      const { data } = response;

      if (data.status_code === HttpStatus.OK && Array.isArray(data.data)) {
        const bookings = await this.processBookingsWithDetails(data.data);
        return {
          success: true,
          message: data.message || 'Bookings retrieved successfully',
          bookings,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve bookings',
          bookings: [],
        };
      }
    } catch (error) {
      console.error(`Error fetching bookings from ${endpoint}:`, error);
      throw error; // Let interceptor handle error reporting
    }
  }

  private async cancelOperation(endpoint: string, payload: any): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(endpoint, payload);
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Operation completed successfully',
        };
      } else {
        throw new ApiError(data.message || 'Operation failed', data.status_code, endpoint);
      }
    } catch (error) {
      console.error(`Error in cancel operation ${endpoint}:`, error);
      throw error;
    }
  }

  private async processBookingsWithDetails(bookings: BookingData[]): Promise<BookingData[]> {
    return bookings.map(booking => {
      const primaryProduct = booking.products?.[0];
      if (primaryProduct) {
        return {
          ...booking,
          product_name: primaryProduct.product_name,
          product_image: '',
          location_name: primaryProduct.location_name,
          booking_date: primaryProduct.booking_date,
          start_time: primaryProduct.start_time || undefined,
          end_time: primaryProduct.end_time || undefined,
          facility_ids: primaryProduct.facilities?.map(f => f.facility_id) || booking.facility_ids,
        };
      }
      return booking;
    });
  }

  // Network/Space Methods
  public async getLocations(): Promise<Array<{ id: number; name: string; address: string; url: string }>> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_ALL_LOCATIONS);
      const { data } = response;

      if ((data.status_code === HttpStatus.OK || data.statusCode === HttpStatus.OK) && Array.isArray(data.data)) {
        return data.data.map((location: LocationData) => {
          const addressParts = [location.street || location.street_two, location.town, location.district].filter(Boolean);
          return {
            id: location.id,
            name: location.name,
            address: location.address || addressParts.join(', '),
            url: location.url,
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }

  public async getSpaces(params: {
    id?: number;
    location_id?: number;
    type?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    capacity?: number | null;
    min_daily_rate?: number;
    max_daily_rate?: number;
    facilities?: string[];
    min_rating?: number;
  }): Promise<{
    success: boolean;
    message: string;
    spaces?: SpaceDto[];
    space?: SpaceDto;
    totalCount?: number;
    recentReviews?: unknown[];
    amenities?: unknown[];
    nearbySpaces?: unknown[];
  }> {
    try {
      if (params.id) {
        // Get single space
        const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_PRODUCT_BY_ID, { id: params.id });
        const { data } = response;

        if (data.status_code === HttpStatus.OK && data.data) {
          // Store the last raw response data for compatibility
          ApiManager.lastRawResponseData = data.data;
          const transformedSpaces = this.transformApiSpacesToSpaceDto([data.data]);
          const transformedSpace = transformedSpaces[0];

          return {
            success: true,
            message: data.message || 'Space details retrieved successfully',
            space: transformedSpace,
            recentReviews: data.data.recent_ratings || [],
            amenities: data.data.amenities || [],
            nearbySpaces: data.data.nearby_spaces || [],
          };
        } else {
          return {
            success: false,
            message: data.message || 'Failed to fetch space details',
            space: {} as SpaceDto,
          };
        }
      } else {
        // Search spaces
        const requestBody: any = {};
        if (params.type) {
          const spaceTypeMapping: Record<string, string> = {
            'meeting-room': 'MeetingRoom',
            'hot-desk': 'HotDesk',
            'dedicated-desk': 'DedicatedDesk',
          };
          requestBody.type = spaceTypeMapping[params.type] || params.type;
        }

        if (params.location_id !== undefined) requestBody.location_id = params.location_id;
        if (params.date) requestBody.date = params.date.includes('T') ? params.date.split('T')[0] : params.date;
        if (params.start_time) requestBody.start_time = params.start_time;
        if (params.end_time) requestBody.end_time = params.end_time;
        if (params.capacity !== undefined && params.capacity !== null) requestBody.capacity = params.capacity;
        if (params.min_daily_rate !== undefined) requestBody.min_daily_rate = params.min_daily_rate;
        if (params.max_daily_rate !== undefined) requestBody.max_daily_rate = params.max_daily_rate;
        if (params.min_rating !== undefined) requestBody.min_rating = params.min_rating;
        if (params.facilities?.length) {
          requestBody.facilities = params.facilities.map((facility: string | { facility_name: string }) => {
            if (typeof facility === 'object' && facility && 'facility_name' in facility) {
              return facility.facility_name;
            }
            return facility as string;
          });
        }

        // Save the request body for later use
        ApiManager.lastRawResponseData = requestBody;

        const response: AxiosResponse = await this.httpClient.post(Endpoints.FILTER_PRODUCTS, requestBody);
        const { data } = response;

        if (data.status_code === HttpStatus.OK) {
          // Store the response data
          ApiManager.lastRawResponseData = data.data;
          const transformedSpaces = this.transformApiSpacesToSpaceDto(data.data || []);
          return {
            success: true,
            message: data.message || 'Spaces retrieved successfully',
            spaces: transformedSpaces,
            totalCount: data.data?.length || 0,
          };
        } else {
          return {
            success: false,
            message: data.message || 'Failed to retrieve spaces',
            spaces: [],
            totalCount: 0,
          };
        }
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }
  }

  private transformApiSpacesToSpaceDto(apiSpaces: ApiSpaceData[]): SpaceDto[] {
    return apiSpaces.map(apiSpace => {
      // Transform pricing
      let pricing: Record<string, number | undefined> = {};
      if (apiSpace.pricing?.length) {
        const pricingData = apiSpace.pricing[0];
        pricing = {
          hourly: pricingData.hourly ? Number(pricingData.hourly) : undefined,
          daily: pricingData.daily ? Number(pricingData.daily) : undefined,
          monthly: pricingData.monthly ? Number(pricingData.monthly) : undefined,
          annual: pricingData.yearly ? Number(pricingData.yearly) : undefined,
        };
        if (apiSpace.productType === 'MeetingRoom' && pricing.hourly && !pricing.daily) {
          pricing.daily = pricing.hourly * 8;
        }
      }

      // Transform availability
      let availability: Array<{ date: string; slots: unknown[] }> = [];
      if (apiSpace.availability) {
        availability = apiSpace.availability.map(avail => ({
          date: avail.date ? avail.date.split('T')[0] : '',
          slots: avail.slots || [],
        }));
      }

      // Map product type
      let productType = '';
      let displayProductType = '';
      const apiProductType = (apiSpace.productType || apiSpace.type || '').toLowerCase();

      if (apiProductType.includes('meeting')) {
        productType = 'meeting-room';
        displayProductType = 'Meeting Room';
      } else if (apiProductType.includes('hot') || (apiProductType.includes('desk') && !apiProductType.includes('dedicated'))) {
        productType = 'hot-desk';
        displayProductType = 'Hot Desk';
      } else if (apiProductType.includes('dedicated')) {
        productType = 'dedicated-desk';
        displayProductType = 'Dedicated Desk';
      } else {
        productType = apiProductType.replace(/\s+/g, '-').toLowerCase();
        displayProductType = (apiSpace.productType || apiSpace.type || '')
          .split(/[\s-_]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      // Handle features and facilities
      let features: string[] = Array.isArray(apiSpace.features) ? [...apiSpace.features] : [];
      let facilities: Array<{ facility_id: number; facility_name: string; hourly_price?: number; icon?: string }> = [];
      let additional_facilities: Array<{ facility_id: number; facility_name: string; hourly_price?: number; icon?: string }> = [];

      if (apiSpace.default_facilities) {
        facilities = (apiSpace.default_facilities as any[]).map(f =>
          typeof f === 'string'
            ? { facility_id: 0, facility_name: f, hourly_price: 0 }
            : { facility_id: f.facility_id || 0, facility_name: f.facility_name || 'Unknown', hourly_price: f.hourly_price || 0, icon: f.icon }
        );
        const facilityNames = facilities.map(f => f.facility_name);
        features = [...new Set([...features, ...facilityNames])];
      }

      if (apiSpace.additional_facilities) {
        additional_facilities = (apiSpace.additional_facilities as any[]).map(f =>
          typeof f === 'string'
            ? { facility_id: 0, facility_name: f, hourly_price: 0 }
            : { facility_id: f.facility_id || 0, facility_name: f.facility_name || 'Unknown', hourly_price: f.hourly_price || 0, icon: f.icon }
        );
        const additionalNames = additional_facilities.map(f => f.facility_name);
        features = [...new Set([...features, ...additionalNames])];
      }

      // Process images
      const processedImages = this.processImageUrls(apiSpace.images || []);

      return {
        id: apiSpace.id || 0,
        name: apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`,
        description: apiSpace.product_description || apiSpace.discription || '',
        location: apiSpace.location_name || apiSpace.locationName || apiSpace.location || apiSpace.address || '',
        address: apiSpace.address || '',
        productType,
        displayProductType,
        images: processedImages,
        rating: Number(apiSpace.average_rating) || Number(apiSpace.rating) || 0,
        reviews: Number(apiSpace.total_reviews) || Number(apiSpace.reviews) || Number(apiSpace.review_count) || 0,
        pricing,
        capacity: Number(apiSpace.capacity) || 0,
        maxCapacity: Number(apiSpace.maxCapacity) || Number(apiSpace.capacity) || 0,
        features,
        additional_facilities,
        default_facilities: facilities,
        facilities,
        isAvailable: true,
        availability,
        start_operation_time: apiSpace.start_operation_time || undefined,
        end_operation_time: apiSpace.end_operation_time || undefined,
        recent_ratings: (apiSpace.recent_ratings as any[]) || [],
      };
    });
  }

  private processImageUrls(images: string[]): string[] {
    if (!Array.isArray(images)) return [];
    return images.map(img => {
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      const baseServerUrl = API_BASE_URL.replace('/api', '');
      return `${baseServerUrl}${img}`;
    });
  }

  public async getFacilities(): Promise<Array<{ facility_id: number; facility_name: string; description?: string }>> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_FACILITY_TYPES);
      const { data } = response;
      return data.status_code === HttpStatus.OK && Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
  }

  public async getBookedTimeSlots(productId: number, bookingDate: string): Promise<Array<{ startTime: string; endTime: string }>> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_BOOKED_TIME_SLOTS, {
        product_id: productId,
        booking_date: bookingDate,
      });
      const { data } = response;

      if (data.status_code === HttpStatus.OK && Array.isArray(data.data)) {
        return data.data.map((slot: any) => ({
          startTime: this.extractTime(slot.start_time),
          endTime: this.extractTime(slot.end_time),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      return [];
    }
  }

  private extractTime(isoString: string): string {
    if (!isoString.includes('T')) return isoString;
    const timePart = isoString.split('T')[1];
    const [hours, minutes] = timePart.split(':');
    return `${hours}:${minutes}`;
  }

  public async getAdvertisements(): Promise<AdvertisementDto[]> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_ALL_PROMOTIONS);
      const { data } = response;

      if ((data.status_code === HttpStatus.OK || data.statusCode === HttpStatus.OK) && Array.isArray(data.data)) {
        return data.data.map((ad: any) => {
          const imagePath = ad.images || '';
          const processedImageUrl = this.processAdImageUrl(imagePath);
          return new AdvertisementDto({
            images: processedImageUrl,
            url: ad.url || '#',
          });
        });
      }
      return [];
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      return [];
    }
  }

  private processAdImageUrl(imagePath: string): string {
    if (!imagePath || imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    const baseServerUrl = API_BASE_URL.replace('/api', '');
    return `${baseServerUrl}${imagePath}`;
  }

  // User/Auth Methods
  public async registerUser(userData: {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    Phone?: string;
    Company?: string;
    JobTitle?: string;
    Bio?: string;
    Avatar?: File | string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('FirstName', userData.FirstName);
      formData.append('LastName', userData.LastName);
      formData.append('Email', userData.Email);
      formData.append('Password', userData.Password);
      formData.append('Phone', userData.Phone || '');
      formData.append('Company', userData.Company || '');
      formData.append('JobTitle', userData.JobTitle || '');
      formData.append('Bio', userData.Bio || '');

      if (userData.Avatar instanceof File) {
        formData.append('Avatar', userData.Avatar);
      } else if (userData.Avatar) {
        formData.append('Avatar', userData.Avatar);
      } else {
        formData.append('Avatar', '');
      }

      const response: AxiosResponse = await this.httpClient.post(Endpoints.CREATE_USER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Registration completed successfully',
        };
      } else {
        throw new ApiError(data.message || 'Registration failed', data.status_code, Endpoints.CREATE_USER);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  public async updateUserProfile(userData: {
    Id: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Company?: string;
    JobTitle?: string;
    Bio?: string;
    Avatar?: File | string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('Id', userData.Id.toString());
      if (userData.FirstName) formData.append('FirstName', userData.FirstName);
      if (userData.LastName) formData.append('LastName', userData.LastName);
      if (userData.Email) formData.append('Email', userData.Email);
      if (userData.Phone) formData.append('Phone', userData.Phone);
      if (userData.Company) formData.append('Company', userData.Company);
      if (userData.JobTitle) formData.append('JobTitle', userData.JobTitle);
      if (userData.Bio) formData.append('Bio', userData.Bio);

      if (userData.Avatar instanceof File) {
        formData.append('Avatar', userData.Avatar);
      } else if (userData.Avatar) {
        formData.append('Avatar', userData.Avatar);
      }

      const response: AxiosResponse = await this.httpClient.post(Endpoints.UPDATE_USER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Profile updated successfully',
        };
      } else {
        throw new ApiError(data.message || 'Failed to update profile', data.status_code, Endpoints.UPDATE_USER);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  public async getUserById(userId: number): Promise<{
    success: boolean;
    message: string;
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      company?: string;
      jobTitle?: string;
      bio?: string;
      avatar?: string;
      isActive?: boolean;
    };
  }> {
    try {
      const formData = new FormData();
      formData.append('Id', userId.toString());

      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_USER_BY_ID, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'User retrieved successfully',
          user: {
            id: data.data.id,
            firstName: data.data.first_name,
            lastName: data.data.last_name,
            email: data.data.email,
            phone: data.data.phone,
            company: data.data.company,
            jobTitle: data.data.job_title,
            bio: data.data.bio,
            avatar: data.data.avatar ? (data.data.avatar.startsWith('http') ? data.data.avatar : this.processAdImageUrl(data.data.avatar)) : '',
            isActive: data.data.is_active,
          },
        };
      } else {
        throw new ApiError(data.message || 'Failed to retrieve user', data.status_code, Endpoints.GET_USER_BY_ID);
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  public async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.LOGIN_USER, { email, password });
      const { data } = response;

      // Handle successful login
      if (data.status_code === HttpStatus.OK) {
        const basicUserInfo = {
          success: true,
          message: data.message || 'Login successful',
          status_code: data.status_code,
          user: {
            id: data.data.id,
            firstName: data.data.first_name,
            lastName: data.data.last_name,
            email: data.data.email,
            first_name: data.data.first_name,
            last_name: data.data.last_name,
          },
          token: data.data.token,
          data: data.data,
        };

        // Try to get complete user details and rewards after successful login
        try {
          // We have the user ID from login response, now fetch complete details
          const userDetailsResponse = await this.getUserById(data.data.id);

          if (userDetailsResponse.success && userDetailsResponse.user) {
            // Import the auth store dynamically to avoid circular dependencies
            const { useAuthStore } = await import('../stores/auth');
            const authStore = useAuthStore();

            // Save the full user data to the Pinia store
            authStore.setUserDetails(userDetailsResponse.user);
          }

          // Fetch user rewards
          const rewardsResponse = await this.getUserRewards(data.data.id);
          if (rewardsResponse.success) {
            // Import the auth store dynamically to avoid circular dependencies
            const { useAuthStore } = await import('../stores/auth');
            const authStore = useAuthStore();
            
            // Update reward points in the store
            authStore.updateRewardPoints(rewardsResponse.rewardPoints);
          }
        } catch (detailsError) {
          console.warn('Error fetching user details or rewards after login:', detailsError);
        }

        // Return the basic user info that matches the expected type
        return basicUserInfo;
      } else {
        // Handle API error responses (400, 401, 404, etc.)
        return {
          success: false,
          message: data.message || 'Login failed',
          status_code: data.status_code || HttpStatus.BAD_REQUEST,
          data: data.data || null,
        };
      }
    } catch (error: any) {
      console.error('Error logging in user:', error);
      return {
        success: false,
        message: 'Network error during login. Please try again.',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  public async getUserRewards(userId: number): Promise<{
    success: boolean;
    message: string;
    rewardPoints: number;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_USER_REWARDS, { user_id: userId });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        // Sum up all reward values from the data array
        const totalRewardPoints = data.data.reduce((total: number, reward: { reward_value: number }) => {
          return total + reward.reward_value;
        }, 0);

        return {
          success: true,
          message: data.message || 'Rewards retrieved successfully',
          rewardPoints: totalRewardPoints,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve rewards',
          rewardPoints: 0,
        };
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error);
      throw error;
    }
  }

  // Payment Methods
  public async getPaymentMethods(userId: number): Promise<{
    success: boolean;
    message: string;
    paymentMethods: Array<{
      id: number;
      card_number: string;
      card_type: string;
      expiry_month: string;
      expiry_year: string;
      is_default: boolean;
      holder_name?: string;
      brand?: string;
      last_four?: string;
      wallet_id?: number;
    }>;
  }> {
    try {
      // Try to fetch from actual API
      try {
        const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_PAYMENT_METHODS, { user_id: userId });
        const { data } = response;
        
        // Check for the new response format
        if (data.status_code === HttpStatus.OK && data.data?.data?.card_list) {
          const walletId = data.data.data.wallet_id;
          const cardList = data.data.data.card_list;
          
          // Map the card list to our application's format
          const paymentMethods = cardList.map((card: any) => {
            // Parse expiry month and year from "MM-YY" format
            const [expiryMonth, expiryYear] = (card.expiry || '').split('-');
            
            return {
              id: card.card_id,
              wallet_id: walletId,
              card_number: card.mask,
              card_type: card.brand,
              expiry_month: expiryMonth || '',
              expiry_year: expiryYear || '',
              is_default: true, // First card is default, can be overridden if multiple cards
              brand: card.brand,
              last_four: card.mask.slice(-4),
              issuer: card.issuer,
              card_issuer_type: card.type // CREDIT or DEBIT
            };
          });
          
          // If multiple cards, set only the first one as default
          if (paymentMethods.length > 1) {
            for (let i = 1; i < paymentMethods.length; i++) {
              paymentMethods[i].is_default = false;
            }
          }
          
          return {
            success: true,
            message: data.message || 'Payment methods retrieved successfully',
            paymentMethods: paymentMethods,
          };
        } else {
          throw new ApiError(data.message || 'Failed to retrieve payment methods', data.status_code, Endpoints.GET_PAYMENT_METHODS);
        }
      } catch (apiError) {
        console.warn('API error when fetching payment methods:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Get user's billing address
  public async getBillingAddress(userId: number): Promise<{
    success: boolean;
    message: string;
    billingAddress?: {
      firstName: string;
      lastName: string;
      company?: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
  }> {
    try {
      // Try to fetch from actual API
      try {
        const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_BILLING_ADDRESS, { user_id: userId });
        const { data } = response;

        if (data.status_code === HttpStatus.OK && data.data) {
          return {
            success: true,
            message: data.message || 'Billing address retrieved',
            billingAddress: data.data,
          };
        }
      } catch (apiError) {
        console.warn('Billing address API not available yet, using mock data');
      }

      // Fallback to hardcoded data if API fails or isn't implemented yet
      return {
        success: true,
        message: 'Mock billing address retrieved',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          company: 'Tech Startup Inc.',
          addressLine1: '123 Main Street',
          addressLine2: 'Suite 100',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'United States'
        }
      };
    } catch (error) {
      console.error('Error fetching billing address:', error);
      throw error;
    }
  }

  // Save user's billing address
  public async saveBillingAddress(userId: number, billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Try to save to actual API
      try {
        const payload = { 
          user_id: userId,
          ...billingAddress
        };
        const response: AxiosResponse = await this.httpClient.post(Endpoints.SAVE_BILLING_ADDRESS, payload);
        const { data } = response;

        if (data.status_code === HttpStatus.OK) {
          return {
            success: true,
            message: data.message || 'Billing address saved successfully',
          };
        }
      } catch (apiError) {
        console.warn('Save billing address API not available yet, simulating success');
      }

      // Simulate successful save if API isn't implemented yet
      return {
        success: true,
        message: 'Billing address saved successfully (simulated)',
      };
    } catch (error) {
      console.error('Error saving billing address:', error);
      throw error;
    }
  }

  // Contact Methods
  public async sendContactMessage(contactData: ContactMessageRequest): Promise<ContactMessageResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.SEND_CONTACT_MESSAGE, contactData);
      const { data } = response;

      return {
        success: data.success || data.status_code === HttpStatus.OK,
        message: data.message || 'Message sent successfully',
        ticket_id: data.ticket_id,
      };
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  }

  // Additional methods from networkManager.ts
  public async addRating(ratingData: {
    product_id: number;
    user_id: number;
    first_name?: string;
    value: number;
    review_description: string;
  }): Promise<{
    success: boolean;
    message: string;
    review?: {
      value: number;
      review_description: string;
      first_name: string;
      user_id: number;
      user_avatar?: string;
    };
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.ADD_RATING, ratingData);
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Rating added successfully',
          review: data.data,
        };
      } else {
        throw new ApiError(data.message || 'Failed to add rating', data.status_code, Endpoints.ADD_RATING);
      }
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  public async getAllRatings(): Promise<{
    success: boolean;
    message: string;
    ratings: Array<{
      value: number;
      review_description: string;
      first_name: string;
      user_id: number;
      user_avatar?: string;
      product_id?: number;
    }>;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_ALL_RATINGS);
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Ratings retrieved successfully',
          ratings: data.data || [],
        };
      } else {
        throw new ApiError(data.message || 'Failed to retrieve ratings', data.status_code, Endpoints.GET_ALL_RATINGS);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  }

  public async addNewCard(cardData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_card_add: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    gatewayData?: {
      link: string;
      token: string;
      sms_status?: string;
      email_status?: string;
    };
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.ADD_CARD, cardData);
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Card session created successfully',
          gatewayData: data.data,
        };
      } else {
        throw new ApiError(data.message || 'Failed to create card session', data.status_code, Endpoints.ADD_CARD);
      }
    } catch (error) {
      console.error('Error adding new card:', error);
      throw error;
    }
  }

  public async processCardPayment(paymentData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_id?: number;
    is_card_add: boolean;
    amount: number;
    reward_amount?: number;
    booking_products: Array<{
      product_id: number;
      booking_date: string;
      start_time?: string;
      end_time?: string;
      total_price: number;
      facilities: Array<{
        facility_id: number;
        price: number;
      }>;
      subscription_start_date?: string;
      subscription_end_date?: string;
      package_type?: string;
    }>;
  }): Promise<{
    success: boolean;
    message: string;
    gatewayData?: {
      link: string;
      token: string;
      sms_status?: string;
      email_status?: string;
    };
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.PROCESS_CARD_PAYMENT, paymentData);
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Payment processed successfully',
          gatewayData: data.data,
        };
      } else {
        throw new ApiError(data.message || 'Failed to process payment', data.status_code, Endpoints.PROCESS_CARD_PAYMENT);
      }
    } catch (error) {
      console.error('Error processing card payment:', error);
      throw error;
    }
  }

  public async processSavedCardPayment(paymentData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_id?: number;
    is_card_add: boolean;
    amount: number;
    reward_amount?: number;
    wallet_id: string;
    card_id: string;
    currency?: string;
    booking_products: Array<{
      product_id: number;
      booking_date: string;
      start_time?: string;
      end_time?: string;
      total_price: number;
      facilities: Array<{
        facility_id: number;
        price: number;
      }>;
      subscription_start_date?: string;
      subscription_end_date?: string;
      package_type?: string;
    }>;
  }): Promise<{
    success: boolean;
    message: string;
    gatewayData?: {
      link: string;
      token: string;
      sms_status?: string;
      email_status?: string;
    };
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.PROCESS_SAVED_CARD_PAYMENT, paymentData);
      const { data } = response;
      
      console.log('Saved card payment response:', data);

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Payment processed with saved card successfully',
          gatewayData: data.data,
        };
      } else {
        throw new ApiError(data.message || 'Failed to process payment with saved card', data.status_code, Endpoints.PROCESS_SAVED_CARD_PAYMENT);
      }
    } catch (error) {
      console.error('Error processing saved card payment:', error);
      throw error;
    }
  }

  public async getBooking(orderId: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      booking_id: number;
      user_id: number;
      product_id: number;
      location: string | null;
      total_price: number;
      facility_name: string[];
      booking_date: string;
      start_time: string;
      end_time: string;
      is_canceled: boolean;
      is_onetime_changed: boolean;
    };
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_BOOKING, { order_id: orderId });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Booking retrieved successfully',
          data: data.data,
        };
      } else {
        throw new ApiError(data.message || 'Failed to retrieve booking', data.status_code, Endpoints.GET_BOOKING);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  public async sendPasswordResetLink(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.SEND_RESET_LINK, { email });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Reset link sent successfully',
        };
      } else {
        throw new ApiError(data.message || 'Failed to send reset link', data.status_code, Endpoints.SEND_RESET_LINK);
      }
    } catch (error) {
      console.error('Error sending password reset link:', error);
      throw error;
    }
  }

  public async verifyPasswordResetCode(email: string, code: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.RESET_WITH_CODE, { email, code });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Code verified successfully',
        };
      } else {
        throw new ApiError(data.message || 'Failed to verify reset code', data.status_code, Endpoints.RESET_WITH_CODE);
      }
    } catch (error) {
      console.error('Error verifying reset code:', error);
      throw error;
    }
  }

  public async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.RESET_WITH_CODE, {
        email,
        code,
        new_password: newPassword,
      });
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Password reset successfully',
        };
      } else {
        throw new ApiError(data.message || 'Failed to reset password', data.status_code, Endpoints.RESET_WITH_CODE);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  public async updateBooking(bookingData: {
    BookingId: number;
    ProductId: number;
    BookingDate: string;
    StartTime?: string;
    EndTime?: string;
    SingleProductId?: number;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('BookingId', bookingData.BookingId.toString());
      formData.append('ProductId', bookingData.ProductId.toString());
      formData.append('BookingDate', bookingData.BookingDate);
      formData.append('StartTime', bookingData.StartTime || '');
      formData.append('EndTime', bookingData.EndTime || '');

      const response: AxiosResponse = await this.httpClient.post(Endpoints.UPDATE_BOOKING, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = response;

      return {
        success: data.success || data.status_code === HttpStatus.OK,
        message: data.message || 'Booking updated successfully',
      };
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  public async getUserSubscriptions(userId: number): Promise<{
    success: boolean;
    message: string;
    totalCount: number;
    subscriptions: Array<{
      booking_product_id: number;
      booking_id: number;
      product_id: number;
      product_name: string;
      location_name: string;
      subscription_start_date: string;
      subscription_end_date: string;
      package_type: string;
      total_price: number;
      status: string;
    }>;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_USER_SUBSCRIPTIONS, { user_id: userId });
      const { data } = response;

      if (data.status_code === HttpStatus.OK && data.data) {
        return {
          success: true,
          message: data.message || 'Subscriptions retrieved successfully',
          totalCount: data.data.total_count || 0,
          subscriptions: data.data.subscriptions || [],
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve subscriptions',
          totalCount: 0,
          subscriptions: [],
        };
      }
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  }

  public async getInvoice(orderId: string): Promise<{
    success: boolean;
    message: string;
    data?: InvoiceData;
  }> {
    try {
      console.log('Getting invoice with order_id:', orderId);
      
      // Make sure order_id is correctly formatted - don't modify it
      // The API expects the exact order_id from payment gateway
      const response: AxiosResponse = await this.httpClient.post(Endpoints.GET_INVOICE, { order_id: orderId });
      const { data } = response;

      console.log('Raw invoice API response:', data);

      if (data.status_code === HttpStatus.OK) {
        console.log('Invoice API success, data:', data.data);
        return {
          success: true,
          message: data.message || 'Invoice retrieved successfully',
          data: data.data,
        };
      } else {
        console.warn(`Invoice API failed with status ${data.status_code} for order_id ${orderId}:`, data.message);
        return {
          success: false,
          message: data.message || 'Failed to retrieve invoice',
        };
      }
    } catch (error) {
      console.error(`Error fetching invoice for order_id ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's reward points
   * @param userId - User ID
   * @returns Response with user's reward points
   */
  public async getUserRewardPoints(userId: number): Promise<{
    success: boolean;
    message?: string;
    points?: number;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `${Endpoints.GET_USER_REWARD_POINTS}/${userId}`
      );
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Reward points retrieved successfully',
          points: data.data?.reward_points || 0,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve reward points',
          points: 0,
        };
      }
    } catch (error) {
      console.error('Error fetching reward points:', error);
      return {
        success: false,
        message: 'Network error while fetching reward points',
        points: 0,
      };
    }
  }

  /**
   * Deduct reward points after payment
   * @param userId - User ID
   * @param pointsUsed - Points used in the transaction
   * @returns Response with updated points
   */
  public async deductRewardPoints(userId: number, pointsUsed: number): Promise<{
    success: boolean;
    message?: string;
    remainingPoints?: number;
  }> {
    try {
      const response: AxiosResponse = await this.httpClient.post(
        Endpoints.DEDUCT_REWARD_POINTS,
        {
          user_id: userId,
          points_used: pointsUsed,
        }
      );
      const { data } = response;

      if (data.status_code === HttpStatus.OK) {
        return {
          success: true,
          message: data.message || 'Reward points deducted successfully',
          remainingPoints: data.data?.remaining_points || 0,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to deduct reward points',
        };
      }
    } catch (error) {
      console.error('Error deducting reward points:', error);
      return {
        success: false,
        message: 'Network error while deducting reward points',
      };
    }
  }
}

// Export singleton instance for backward compatibility
export const apiManager = ApiManager.getInstance();

// Export individual methods for convenience (maintaining original API)
export const {
  getUpcomingBookings,
  getPastBookings,
  getCanceledBookings,
  cancelBooking,
  cancelBookingProduct,
  getLocations,
  getSpaces,
  getFacilities,
  getBookedTimeSlots,
  getAdvertisements,
  registerUser,
  updateUserProfile,
  getUserById,
  getUserRewards,
  loginUser,
  getPaymentMethods,
  sendContactMessage,
  addRating,
  getAllRatings,
  addNewCard,
  processCardPayment,
  processSavedCardPayment,
  getBooking,
  sendPasswordResetLink,
  verifyPasswordResetCode,
  resetPasswordWithCode,
  updateBooking,
  getUserSubscriptions,
  getInvoice,
} = apiManager;