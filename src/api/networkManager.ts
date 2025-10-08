// src/api/networkManager.ts
// NetworkManager for essential APIs only
// Handles: authentication, product listing/searching/filtering, space details, locations, and booked time slots

import type { SpaceDto } from '../dto/response';
import { AdvertisementDto } from '../dto/response';
import { useSystemStore } from '../stores/system';

// Define AuthResponse interface
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  token?: string;
}

// Interface for location data from API
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

// Interface for search request body
interface SearchRequestBody {
  type?: string;
  location_id?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
  min_daily_rate?: number;
  max_daily_rate?: number;
  min_rating?: number;
  facilities?: (string | { facility_name: string })[];
}

// Interface for API space data
interface ApiSpaceData {
  id?: number;
  name?: string;
  product_description?: string;
  discription?: string; // typo in API
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
  [key: string]: unknown;
}

// Interface for advertisement data from API
interface AdvertisementData {
  company_name?: string;
  description?: string;
  button_text?: string;
  image_path?: string;
  images?: string;
  link?: string;
  [key: string]: unknown;
}

// Interface for rating data from API
interface RatingData {
  user_avatar?: string;
  [key: string]: unknown;
}

// Interface for booking data returned by the API
interface BookingData {
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

// Interface for invoice data from API
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

// Interface for contact message request
interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

// Interface for contact message response
interface ContactMessageResponse {
  success: boolean;
  message: string;
  ticket_id?: string;
}

export class NetworkManager {
  private static readonly BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011/api';
  public static lastRawResponseData: unknown = null;
  private static customHeaders: Record<string, string> = {};
  
  private static notifyError(message: string, endpoint?: string, statusCode?: number) {
    try {
      const systemStore = useSystemStore();
      systemStore.reportApiError({
        message,
        endpoint,
        statusCode,
        timestamp: Date.now(),
      });
    } catch (storeError) {
      console.warn('Unable to report API error via system store:', storeError);
    }
  }

  private static formatErrorMessage(error: unknown, fallback: string): string {
    if (!navigator.onLine) {
      return 'No internet connection detected. Please reconnect and try again.';
    }

    if (error instanceof Error) {
      return error.message || fallback;
    }

    if (typeof error === 'string') {
      return error;
    }

    return fallback;
  }
  
  /**
   * Set a custom header for API requests. Useful for adding tokens like reCAPTCHA.
   * @param key The header key
   * @param value The header value
   */
  public static setAuthHeader(key: string, value: string): void {
    this.customHeaders[key] = value;
  }

  /**
   * Validate if a token is a properly formatted JWT
   * @param token The token to validate
   * @returns true if valid JWT format
   */
  private static isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }
  
  /**
   * Remove a custom header
   * @param key The header key to remove
   */
  public static removeAuthHeader(key: string): void {
    delete this.customHeaders[key];
  }
  
  /**
   * Get all custom headers as an object
   * @returns Object with all custom headers
   */
  private static getCustomHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.customHeaders
    };
    
    // Add authorization token if available and valid
    const token = localStorage.getItem('token');
    if (token && this.isValidToken(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Get all locations for the location dropdown.
   * Backend returns:
   *   {
   *     "status_code": 200,
   *     "message": "Locations retrieved successfully",
   *     "data": [
   *       { "id": 1, "name": "Kandy Lakeside", "address": "123 Kandy Street, Kandy", "url": "/locations/kandy-lakeside" },
   *       ...
   *     ]
   *   }
   * Frontend maps: Returns full location objects with id, name, address, and url
   */
  static async getLocations(): Promise<Array<{ id: number; name: string; address: string; url: string }>> {
    try {
      const response = await fetch(`${this.BASE_URL}/locations/get-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if ((data.status_code === 200 || data.statusCode === 200) && Array.isArray(data.data)) {
        // Return full location objects with id, name, address, and url
        return data.data.map((location: LocationData) => {
          // Create address from street, town, district components
          const addressParts = [
            location.street || location.street_two,
            location.town,
            location.district
          ].filter(Boolean);
          
          return {
            id: location.id,
            name: location.name,
            // Create address by joining components, or use address if it exists
            address: location.address || addressParts.join(', '),
            url: location.url,
            description: `${location.town || ''}, ${location.district || ''}`.trim()
          };
        });
      } else {
        throw new Error(data.message || data.statusCode || this.getErrorMessageForStatus(response.status, 'Failed to fetch locations'));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      const message = this.formatErrorMessage(error, 'Unable to load locations right now. Please try again soon.');
      this.notifyError(message, '/locations/get-all');
      // Return empty array instead of throwing error to prevent app crash
      return [];
    }
  }

  /**
   * Unified API for working with spaces
   * Supports both searching for spaces and fetching individual space details
   * 
   * Search API:
   *   POST /product/filter-products
   *   Body: { 
   *     "type": "HotDesks", 
   *     "locationId": 1, 
   *     "date": "2024-12-25",
   *     "startTime": "09:00",
   *     "endTime": "17:00",
   *     "capacity": 10,
   *     "minPrice": 10,
   *     "maxPrice": 100,
   *     "minRating": 4,
   *     "facilities": ["WiFi", "AC"]
   *   }
   * 
   * Details API:
   *   POST /product/get-product-by-id
   *   Body: { id: 123 }
   */
  static async getSpaces(params: {
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
      // If id is provided, we're fetching details for a specific space
      if (params.id) {
        // Real API implementation for space details using the correct endpoint
        const response = await fetch(`${this.BASE_URL}/product/get-product-by-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: params.id })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status_code === 200 && data.data) {
          // Store the last raw response data
          this.lastRawResponseData = data.data;
          
          // Transform the API response to match our SpaceDto interface
          const transformedSpaces = this.transformApiSpacesToSpaceDto([data.data]);
          const transformedSpace = transformedSpaces[0];

          // Add recent ratings if available
          if (data.data.recent_ratings && Array.isArray(data.data.recent_ratings)) {
            transformedSpace.recent_ratings = data.data.recent_ratings;
          }
          
          // Make sure facilities are properly assigned from the API response
          if (data.data.facilities && Array.isArray(data.data.facilities)) {
            transformedSpace.facilities = data.data.facilities;
            console.log("Added facilities to transformed space:", transformedSpace.facilities);
          }

          return {
            success: true,
            message: data.message || 'Space details retrieved successfully',
            space: transformedSpace,
            recentReviews: data.data.recent_ratings || [],
            amenities: data.data.amenities || [],
            nearbySpaces: data.data.nearby_spaces || []
          };
        } else {
          return {
            success: false,
            message: data.message || 'Failed to fetch space details',
            space: {} as SpaceDto
          };
        }
      } 
      // Otherwise, we're searching for spaces based on criteria
      else {
        // Prepare the request body
        const requestBody: SearchRequestBody = {};

        // Map space type to backend format if provided
        if (params.type) {
          const spaceTypeMapping: Record<string, string> = {
            'meeting-room': 'MeetingRoom',
            'hot-desk': 'HotDesk', 
            'dedicated-desk': 'DedicatedDesk'
          };
          requestBody.type = spaceTypeMapping[params.type] || params.type;
        }

        // Add other parameters conditionally
        if (params.location_id !== undefined) {
          requestBody.location_id = params.location_id;  // Changed to match API format
        }

        if (params.date) {
          // Ensure date is in the correct format (YYYY-MM-DD)
          const dateStr = params.date.includes('T') ? params.date.split('T')[0] : params.date;
          requestBody.date = dateStr;
        }

        // Add start and end time as separate fields (not operation times)
        if (params.start_time) {
          requestBody.start_time = params.start_time;  // Changed to match API format
        }

        if (params.end_time) {
          requestBody.end_time = params.end_time;  // Changed to match API format
        }

        if (params.capacity !== undefined && params.capacity !== null) {
          requestBody.capacity = params.capacity;
        }

        if (params.min_daily_rate !== undefined) {
          requestBody.min_daily_rate = params.min_daily_rate;  // Changed to match API format
        }

        if (params.max_daily_rate !== undefined) {
          requestBody.max_daily_rate = params.max_daily_rate;  // Changed to match API format
        }

        if (params.min_rating !== undefined) {
          requestBody.min_rating = params.min_rating;  // Changed to match API format
        }

        if (params.facilities && params.facilities.length > 0) {
          // When facilities come in as strings (facility names), use them directly
          // When they come as objects with facility_name, extract just the names
          requestBody.facilities = params.facilities.map((facility: string | { facility_name: string }) => {
            if (typeof facility === 'object' && facility !== null && facility.facility_name) {
              return facility.facility_name;
            }
            return facility;
          });
          console.log('Sending facilities to API:', requestBody.facilities);
        }
        
        // Real API implementation
        const apiUrl = `${this.BASE_URL}/product/filter-products`;

        // For empty or minimal filter requests, ensure we send an empty object
        // This ensures we get ALL products when no substantial filters are applied
        // If only date is present and it's today's date, we consider it as "no filter"
        const today = new Date().toISOString().split('T')[0];
        const hasOnlyTodayDateFilter = 
          Object.keys(requestBody).length === 1 && 
          requestBody.date === today;
          
        const finalRequestBody = Object.keys(requestBody).length === 0 || hasOnlyTodayDateFilter ? {} : requestBody;
        
        // Save the request body for later use in transformApiSpaceToSpaceDto
        NetworkManager.lastRawResponseData = finalRequestBody;
        
        console.log('🔍 API Search params:', finalRequestBody);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalRequestBody)
        });

        if (!response.ok) {
          // Handle 404 as "no products found" instead of error
          if (response.status === 404) {
            console.log('No products found (404 response)');
            return {
              success: true,
              message: 'No spaces found matching your criteria',
              spaces: [],
              totalCount: 0
            };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status_code === 200) {
          // Transform API response to match our SpaceDto format
          const transformedSpaces = this.transformApiSpacesToSpaceDto(data.data || []);
          
          console.log('Transformed spaces with facilities:', transformedSpaces.map(s => ({
            id: s.id,
            name: s.name,
            facilities: s.facilities
          })));

          return {
            success: true,
            message: data.message || 'Spaces retrieved successfully',
            spaces: transformedSpaces,
            totalCount: data.data?.length || 0
          };
        } else {
          return {
            success: false,
            message: data.message || this.getErrorMessageForStatus(response.status, 'Failed to retrieve spaces'),
            spaces: [],
            totalCount: 0
          };
        }
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      const errorMessage = this.formatErrorMessage(error, 'We could not load spaces right now. Please try again soon.');
      const endpoint = params.id ? '/product/get-product-by-id' : '/product/filter-products';
      this.notifyError(errorMessage, endpoint);

      return {
        success: false,
        message: errorMessage,
        spaces: [],
        totalCount: 0
      };
    }
  }

  /**
   * Transform API response format to our internal SpaceDto format
   */
  private static transformApiSpacesToSpaceDto(apiSpaces: ApiSpaceData[]): SpaceDto[] {
    return apiSpaces.map((apiSpace) => {
      // Transform pricing from array format to object format
      let pricing: Record<string, number | undefined> = {};
      if (apiSpace.pricing && Array.isArray(apiSpace.pricing) && apiSpace.pricing.length > 0) {
        const pricingData = apiSpace.pricing[0];
        pricing = {
          hourly: pricingData.hourly ? Number(pricingData.hourly) : undefined,
          daily: pricingData.daily ? Number(pricingData.daily) : undefined,
          monthly: pricingData.monthly ? Number(pricingData.monthly) : undefined,
          annual: pricingData.yearly ? Number(pricingData.yearly) : undefined
        };
        
        // For meeting rooms, calculate daily price from hourly if daily is not available
        if (apiSpace.productType === 'MeetingRoom' && pricing.hourly && !pricing.daily) {
          pricing.daily = pricing.hourly * 8; // Assume 8 hours per day
        }
      }

      // Transform availability format
      let availability: Array<{ date: string; slots: unknown[] }> = [];
      if (apiSpace.availability && Array.isArray(apiSpace.availability)) {
        availability = apiSpace.availability.map((avail: { date?: string; slots?: unknown[] }) => ({
          date: avail.date ? avail.date.split('T')[0] : '', // Extract date part
          slots: avail.slots || []
        }));
      }

      // Map product type to our internal format and get display name
      let productType = '';
      let displayProductType = '';
      const apiProductType = (apiSpace.productType || apiSpace.type || '').toLowerCase();
      
      // First check for type field in case productType isn't available
      if (!apiSpace.productType && apiSpace.type) {
        apiSpace.productType = apiSpace.type;
      }
      
      // Comprehensive type detection with common variations and typos
      if (apiProductType.includes('meeting') || apiProductType === 'meetingroom' || apiProductType === 'meetingrooms') {
        productType = 'meeting-room';
        displayProductType = 'Meeting Room';
      } 
      else if (apiProductType.includes('hot') || 
        (apiProductType.includes('desk') && !apiProductType.includes('dedicated'))) {
        productType = 'hot-desk';
        displayProductType = 'Hot Desk';
      } 
      else if (apiProductType.includes('dedicated')) {
        productType = 'dedicated-desk';
        displayProductType = 'Dedicated Desk';
      } 
      else {
        // Default case for unknown types - convert to kebab case and title case
        productType = apiProductType.replace(/\s+/g, '-').toLowerCase();
        
        // Make display product type Title Case
        displayProductType = apiSpace.productType || apiSpace.type || '';
        displayProductType = displayProductType
          .split(/[\s-_]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      // Handle features and additional_facilities separately (DO NOT mix them!)
      let features: string[] = [];
      
      // ONLY use the features field for features - DO NOT add facilities to features
      if (Array.isArray(apiSpace.features)) {
        features = [...apiSpace.features];
      }
      
      // Handle additional facilities - keep them separate from features
      let additional_facilities: Array<{
        facility_id: number;
        facility_name: string;
        hourly_price?: number;
        icon?: string;
      }> = [];
      if (Array.isArray(apiSpace.additional_facilities)) {
        additional_facilities = apiSpace.additional_facilities as Array<{
          facility_id: number;
          facility_name: string;
          hourly_price?: number;
          icon?: string;
        }>;
      }
      
      // Remove duplicates from features (additional_facilities are now objects, not strings)
      features = [...new Set(features)];
      
      // Extract operation times if available
      const start_operation_time = apiSpace.start_operation_time || null;
      const end_operation_time = apiSpace.end_operation_time || null;
      
      // Process images - add base URL to relative paths
      const processedImages = NetworkManager.processImageUrls(apiSpace.images || []);

      // Handle default_facilities from the API response
      let facilities: Array<{
        facility_id: number;
        facility_name: string;
        hourly_price?: number;
        icon?: string;
      }> = [];
      if (apiSpace.default_facilities && Array.isArray(apiSpace.default_facilities)) {
        // Map default facilities to the proper format if they're not already in the correct format
        facilities = apiSpace.default_facilities.map((f: unknown) => {
          const facility = f as { facility_id?: number; facility_name?: string; hourly_price?: number; icon?: string };
          if (typeof facility === 'string') {
            return {
              facility_id: 0, // Default ID
              facility_name: facility,
              hourly_price: 0,
              icon: undefined
            };
          } else {
            return {
              facility_id: facility.facility_id || 0,
              facility_name: facility.facility_name || 'Unknown',
              hourly_price: facility.hourly_price || 0,
              icon: facility.icon || undefined
            };
          }
        });
        
        // Extract facility names from default_facilities and add to features for backwards compatibility
        const facilityNames = facilities.map((f) => f.facility_name);
        if (facilityNames.length > 0) {
          features = [...new Set([...features, ...facilityNames])];
        }
      }

      // Add additional_facilities if available
      if (apiSpace.additional_facilities && Array.isArray(apiSpace.additional_facilities)) {
        // Map additional facilities to the proper format if they're not already in the correct format
        additional_facilities = apiSpace.additional_facilities.map((f: unknown) => {
          const facility = f as { facility_id?: number; facility_name?: string; hourly_price?: number; icon?: string };
          if (typeof facility === 'string') {
            return {
              facility_id: 0, // Default ID
              facility_name: facility,
              hourly_price: 0,
              icon: undefined
            };
          } else {
            return {
              facility_id: facility.facility_id || 0,
              facility_name: facility.facility_name || 'Unknown',
              hourly_price: facility.hourly_price || 0,
              icon: facility.icon || undefined
            };
          }
        });
        
        // Also extract names from additional_facilities for features array (backward compatibility)
        const additionalFacilityNames = additional_facilities
          .filter((f) => f && f.facility_name)
          .map((f) => f.facility_name);
        
        if (additionalFacilityNames.length > 0) {
          features = [...new Set([...features, ...additionalFacilityNames])];
        }
      }

      const transformedSpace: SpaceDto = {
        id: apiSpace.id || 0,
        name: apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`,
        description: apiSpace.product_description || apiSpace.discription || '',  // Changed priority to match API
        location: apiSpace.location_name || apiSpace.locationName || apiSpace.location || apiSpace.address || '', // Added location_name from API
        address: apiSpace.address || '',
        productType: productType || apiSpace.type?.toLowerCase() || '', // Use API's type field if productType is not set
        displayProductType: displayProductType, // Add display name for product type
        images: processedImages,
        rating: Number(apiSpace.average_rating) || Number(apiSpace.rating) || 0, // Use average_rating from API first
        reviews: Number(apiSpace.total_reviews) || Number(apiSpace.reviews) || Number(apiSpace.review_count) || 0, // Use total_reviews from API first
        pricing: pricing,
        capacity: Number(apiSpace.capacity) || 0,
        maxCapacity: Number(apiSpace.maxCapacity) || Number(apiSpace.capacity) || 0,
        features: features, // Use features array from response.features
        additional_facilities: additional_facilities, // Use additional_facilities array from API
        default_facilities: facilities, // Use default_facilities from API response
        facilities: facilities, // Keep facilities for backward compatibility
        isAvailable: true, // Assume available if returned by search
        availability: availability,
        start_operation_time: start_operation_time || undefined,
        end_operation_time: end_operation_time || undefined,
        recent_ratings: (apiSpace.recent_ratings as Array<{ rating: number; comment?: string; user?: string }>) || [] // Include recent ratings from API response
      };
      return transformedSpace;
    });
  }

  /**
   * Helper method to process image URLs by adding the base URL to relative paths
   */
  private static processImageUrls(images: string[]): string[] {
    if (!Array.isArray(images)) return [];
    
    return images.map(img => {
      // If it's already an absolute URL, return as is
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      
      // Otherwise, prefix with base URL (without the /api part)
      // Extract the server base URL by removing '/api' from BASE_URL
      const baseServerUrl = NetworkManager.BASE_URL.replace('/api', '');
      return `${baseServerUrl}${img}`;
    });
  }
  
  /**
   * Helper method to process a single image URL for advertisements
   */
  private static processAdImageUrl(imagePath: string): string {
    // If it's already an absolute URL or empty, return as is
    if (!imagePath || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Otherwise, prefix with base URL (without the /api part)
    const baseServerUrl = NetworkManager.BASE_URL.replace('/api', '');
    return `${baseServerUrl}${imagePath}`;
  }
  
  /**
   * Get all facilities for filtering
   * Endpoint: /facility-type/get-facility-type-list
   * Method: POST
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Facilities retrieved successfully",
   *   "data": [
   *     {
   *       "facility_id": 1,
   *       "facility_name": "TV",
   *       "description": null
   *     },
   *     ...
   *   ]
   * }
   */
  static async getFacilities(): Promise<Array<{ facility_id: number; facility_name: string; description?: string }>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facility-type/get-facility-type-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status_code === 200 && Array.isArray(data.data)) {
        // Return facilities list from API
        return data.data;
      } else {
        console.warn('Failed to fetch facilities:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
  }

  /**
   * Get booked time slots for a specific space and date.
   * Backend expects:
   *   { "product_id": 123, "booking_date": "2024-12-25" }
   * Backend returns:
   *   { "status_code": 200, "data": [{ "start_time": "2025-08-27T08:32:42.465", "end_time": "2025-08-27T10:32:42.465" }] }
   * Frontend maps: Extracts time from ISO strings and returns { startTime, endTime }
   */
  static async getBookedTimeSlots(productId: number, bookingDate: string): Promise<Array<{ startTime: string; endTime: string }>> {
    try {
      const response = await fetch(`${this.BASE_URL}/booking/get-booked-time-durations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product_id: productId,
          booking_date: bookingDate
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status_code === 200 && Array.isArray(data.data)) {
        // Transform the API response to the expected format
        return data.data.map((slot: { start_time: string; end_time: string }) => {
          // Extract time from ISO date string (e.g., "2025-08-27T08:32:42.465" -> "08:32")
          const extractTime = (isoString: string): string => {
            if (!isoString.includes('T')) return isoString;
            const timePart = isoString.split('T')[1];
            const [hours, minutes] = timePart.split(':');
            return `${hours}:${minutes}`;
          };
          
          return {
            startTime: extractTime(slot.start_time),
            endTime: extractTime(slot.end_time)
          };
        });
      } else {
        throw new Error(data.message || 'Failed to fetch booked time slots');
      }
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      return [];
    }
  }
  
  /**
   * Get advertisements for home page
   * Backend returns:
   *   {
   *     "status_code": 200,
   *     "message": "Advertising retrieved successfully",
   *     "data": [
   *       {
   *         "company_name": "Paymedia",
   *         "image_path": "/uploads/products/26e5ed95-47cc-40e6-b4a1-8ead852ddd7c.png",
   *         "description": "This is the test ads"
   *       },
   *       ...
   *     ]
   *   }
   * Returns: Array of AdvertisementDto objects
   */
  static async getAdvertisements(): Promise<AdvertisementDto[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/advertising/get-all-promotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn(`Advertisement API returned status ${response.status}`);
        throw new Error(`Failed to fetch advertisements: Server returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if ((data.status_code === 200 || data.statusCode === 200) && Array.isArray(data.data)) {
        // Convert API response to AdvertisementDto objects
        return data.data.map((ad: any) => {
          // Process the image path to make it an absolute URL
          const imagePath = ad.images || '';
          const processedImageUrl = this.processAdImageUrl(imagePath);

          return new AdvertisementDto({
            images: processedImageUrl, // Use the processed absolute URL
            url: ad.url || '#' // Use API url field
          });
        });
      } else {
        console.warn('Invalid advertisement data format from API');
        throw new Error('Failed to fetch advertisements: Invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      // Return empty array instead of fallback data
      // This allows the UI layer to handle the error appropriately
      return [];
    }
  }
  
  /**
   * Register a new user
   * Endpoint: /users/create
   * Method: POST
   * Request:
   * {
   *   "FirstName": "charitha",
   *   "LastName": "bimsara",
   *   "Email": "charithabimsara@gmail.com",
   *   "Password": "[SECURE_PASSWORD]",
   *   "Phone": "",  // Optional
   *   "Company": "", // Optional
   *   "JobTitle": "", // Optional
   *   "Bio": "", // Optional
   *   "Avatar": "" // Optional
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": "User created successfully"
   * }
   */
  static async registerUser(userData: {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    Phone?: string;
    Company?: string;
    JobTitle?: string;
    Bio?: string;
    Avatar?: File | string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('Registration data:', userData);
      
      // Always use FormData for this API endpoint
      const formData = new FormData();
      
      // Add required fields
      formData.append('FirstName', userData.FirstName);
      formData.append('LastName', userData.LastName);
      formData.append('Email', userData.Email);
      formData.append('Password', userData.Password);
      
      // Add optional fields (empty strings if not provided)
      formData.append('Phone', userData.Phone || '');
      formData.append('Company', userData.Company || '');
      formData.append('JobTitle', userData.JobTitle || '');
      formData.append('Bio', userData.Bio || '');
      
      // Handle Avatar if it exists
      if (userData.Avatar instanceof File) {
        formData.append('Avatar', userData.Avatar);
      } else if (userData.Avatar) {
        formData.append('Avatar', userData.Avatar);
      } else {
        formData.append('Avatar', '');
      }
      
      // Let the browser set the correct Content-Type with boundary
      const headers = {};

      // Log the form data entries for debugging
      console.log('FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'Password' ? '******' : pair[1]));
      }
      
      const response = await fetch(`${this.BASE_URL}/users/create`, {
        method: 'POST',
        headers,
        body: formData
      });      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage: string;
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid registration data. Please check your information.';
            break;
          case 409:
            errorMessage = 'Email already registered. Please use a different email address.';
            break;
          case 422:
            errorMessage = 'Validation error. Please check all required fields.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = this.getErrorMessageForStatus(response.status, 'Registration failed. Please try again.');
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
          message: data.message || 'Registration successful!'
        };
      } else {
        // Handle API-specific error messages
        let errorMessage = data.message || 'Registration failed. Please try again.';
        
        // Check for common registration errors in the message
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('exists') || 
             errorMessage.toLowerCase().includes('taken') || 
             errorMessage.toLowerCase().includes('already'))) {
          errorMessage = 'This email is already registered. Please use a different email address.';
        } else if (errorMessage.toLowerCase().includes('password')) {
          errorMessage = 'Password does not meet requirements. Please choose a stronger password.';
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to register';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error instanceof Error) {
        if (error.message.toLowerCase().includes('timeout')) {
          errorMessage = 'Registration request timed out. Please try again.';
        }
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  
  /**
   * Update user profile
   * Endpoint: /users/update
   * Method: POST
   * Request: FormData with fields:
   * {
   *   "Id": 1,
   *   "FirstName": "Updated First",
   *   "LastName": "Updated Last",
   *   "Email": "updated@example.com",
   *   "Phone": "1234567890",
   *   "Company": "Updated Company",
   *   "JobTitle": "Updated Job",
   *   "Bio": "Updated Bio",
   *   "Avatar": File or string
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Profile updated successfully"
   * }
   */
  static async updateUserProfile(userData: {
    Id: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Company?: string;
    JobTitle?: string;
    Bio?: string;
    Avatar?: File | string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('Profile update data:', userData);
      
      // Always use FormData for this API endpoint
      const formData = new FormData();
      
      // Add required user ID
      formData.append('Id', userData.Id.toString());
      
      // Add optional fields if they exist
      if (userData.FirstName !== undefined) formData.append('FirstName', userData.FirstName);
      if (userData.LastName !== undefined) formData.append('LastName', userData.LastName);
      if (userData.Email !== undefined) formData.append('Email', userData.Email);
      if (userData.Phone !== undefined) formData.append('Phone', userData.Phone || '');
      if (userData.Company !== undefined) formData.append('Company', userData.Company || '');
      if (userData.JobTitle !== undefined) formData.append('JobTitle', userData.JobTitle || '');
      if (userData.Bio !== undefined) formData.append('Bio', userData.Bio || '');
      
      // Handle Avatar if it exists
      if (userData.Avatar instanceof File) {
        formData.append('Avatar', userData.Avatar);
      } else if (userData.Avatar) {
        try {
          // If it's a base64 string from a FileReader, we need to convert it to a file
          if (typeof userData.Avatar === 'string' && userData.Avatar.startsWith('data:image')) {
            const response = await fetch(userData.Avatar);
            const blob = await response.blob();
            const file = new File([blob], 'profile-image.jpg', { type: blob.type });
            formData.append('Avatar', file);
          } else {
            formData.append('Avatar', userData.Avatar);
          }
        } catch (error) {
          console.error('Error processing avatar:', error);
          // If there's an error processing the avatar, skip it rather than failing the whole update
          console.log('Skipping avatar upload due to processing error');
        }
      }
      
      // Let the browser set the correct Content-Type with boundary
      const headers = {};

      // Log the form data entries for debugging
      console.log('FormData entries for profile update:');
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'Password' ? '******' : pair[1]));
      }
      
      const response = await fetch(`${this.BASE_URL}/users/update`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage: string;
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid profile data. Please check your information.';
            break;
          case 404:
            errorMessage = 'User not found. Please login again.';
            break;
          case 409:
            errorMessage = 'Email already in use. Please use a different email address.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = this.getErrorMessageForStatus(response.status, 'Profile update failed. Please try again.');
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
          message: data.message || 'Profile updated successfully!'
        };
      } else {
        // Handle API-specific error messages
        let errorMessage = data.message || 'Profile update failed. Please try again.';
        
        // Check for common profile update errors in the message
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('exists') || 
             errorMessage.toLowerCase().includes('taken') || 
             errorMessage.toLowerCase().includes('already'))) {
          errorMessage = 'This email is already in use. Please use a different email address.';
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to update profile';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get user details by ID
   * Endpoint: /users/get-by-id
   * Method: POST
   * Request: FormData with field:
   * {
   *   "Id": 1
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "message": "success",
   *   "user": {
   *     "id": 1,
   *     "first_name": "charitha",
   *     "last_name": "bimsara",
   *     "email": "charithabimsara@gmail.com",
   *     "phone": "+94785366196",
   *     "company": "Paymedia",
   *     "job_title": null,
   *     "bio": null,
   *     "avatar": "/uploads/users/37d8c636-7b5f-4b8d-b861-fb73744fc78e.png",
   *     "is_active": true
   *   }
   * }
   */
  static async getUserById(userId: number): Promise<{
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
      // Always use FormData for this API endpoint
      const formData = new FormData();
      
      // Add user ID
      formData.append('Id', userId.toString());
      
      const response = await fetch(`${this.BASE_URL}/users/get-by-id`, {
        method: 'POST',
        body: formData
      });
      
      // Handle HTTP errors with our standardized error handling method
      if (!response.ok) {
        const errorMessage = this.getErrorMessageForStatus(
          response.status, 
          'Failed to fetch user details.'
        );
        
        return {
          success: false,
          message: errorMessage
        };
      }
      
      const data = await response.json();
      
      if (data.success && data.user) {
        // Transform snake_case to camelCase
        const userData = data.user;
        
        return {
          success: true,
          message: data.message || 'User details retrieved successfully',
          user: {
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            company: userData.company,
            jobTitle: userData.job_title,
            bio: userData.bio,
            avatar: userData.avatar ? (userData.avatar.startsWith('http') ? userData.avatar : this.processAdImageUrl(userData.avatar)) : '',
            isActive: userData.is_active
          }
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve user details'
        };
      }
    } catch (error) {
      console.error('Get user by ID error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to retrieve user details';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Login user with email and password
   * Endpoint: /users/login
   * Method: POST
   * Request:
   * {
   *   "email": "charithabimsara@gmail.com",
   *   "password": "[SECURE_PASSWORD]"
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Login successful",
   *   "data": {
   *     "id": 2,
   *     "email": "charithabimsara@gmail.com",
   *     "first_name": "charitha",
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *   }
   * }
   */
  static async loginUser(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: {
      id: number;
      email: string;
      first_name: string;
      last_name?: string;
      firstName?: string;
      lastName?: string;
    };
    token?: string;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage: string;
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid login request. Please check your email format.';
            break;
          case 401:
            errorMessage = 'Incorrect email or password. Please try again.';
            break;
          case 403:
            errorMessage = 'Your account is locked. Please contact support.';
            break;
          case 404:
            errorMessage = 'Account not found. Please check your email address.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = this.getErrorMessageForStatus(response.status, 'Login failed. Please try again.');
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }

      const data = await response.json();

      // Check if the API returned a successful response
      if (data.status_code === 200 && data.data) {
        // Store the basic user info
        const basicUserInfo = {
          id: data.data.id,
          email: data.data.email,
          first_name: data.data.first_name,
          last_name: data.data.last_name
        };

        // Try to get complete user details - but this is just to save in Pinia store
        // for other parts of the app that might need it later
        try {
          // We have the user ID from login response, now fetch complete details
          const userDetailsResponse = await this.getUserById(data.data.id);
          
          if (userDetailsResponse.success && userDetailsResponse.user) {
            // Import the auth store dynamically to avoid circular dependencies
            const { useAuthStore } = await import('../stores/auth');
            const authStore = useAuthStore();
            
            // Save the full user data to the Pinia store (which persists to localStorage internally)
            authStore.setUserDetails(userDetailsResponse.user);
          }
        } catch (detailsError) {
          console.warn('Error fetching user details after login:', detailsError);
        }
        
        // Return the basic user info that matches the expected type
        return {
          success: true,
          message: data.message || 'Login successful',
          user: basicUserInfo,
          token: data.data.token
        };
      } else {
        // Handle API-specific error messages
        let errorMessage = 'Login failed';
        
        // Use the API's error message if available
        if (data.message) {
          errorMessage = data.message;
        } 
        // Handle specific error codes that might come from the backend
        else if (data.status_code) {
          switch (data.status_code) {
            case 401:
              errorMessage = 'Incorrect email or password. Please try again.';
              break;
            case 403:
              errorMessage = 'Your account is locked or not activated.';
              break;
            case 422:
              errorMessage = 'Invalid login information provided.';
              break;
            default:
              errorMessage = 'Login failed. Please check your credentials.';
          }
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more user-friendly error messages based on the error type
      let errorMessage = 'Failed to login';
      
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else if (error instanceof Error) {
        // For other types of errors, use the error message but make it user-friendly
        if (error.message.toLowerCase().includes('timeout')) {
          errorMessage = 'Login request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  
  // Helper method to process bookings with product details
  private static async processBookingsWithDetails(bookings: BookingData[]): Promise<BookingData[]> {
    return await Promise.all(
      bookings.map(async (booking: BookingData) => {
        try {
          // Get product details
          const productResponse = await this.getSpaces({ id: booking.product_id });
          
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
   * Get upcoming bookings for a user
   * Endpoint: /booking/get-upcoming-bookings
   * Method: POST
   * Request:
   * {
   *   "user_id": 3
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": [
   *     {
   *       "booking_id": 1,
   *       "user_id": 3,
   *       "first_name": null,
   *       "product_id": 1,
   *       "payment_id": 0,
   *       "total_price": 150,
   *       "facility_ids": [1],
   *       "booking_date": "2025-09-25",
   *       "start_time": "09:00:00",
   *       "end_time": "11:00:00",
   *       "is_onetime_changed": false
   *     }
   *   ]
   * }
   */
  static async getUpcomingBookings(userId: number): Promise<{
    success: boolean;
    message: string;
    bookings: Array<BookingData>;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/booking/get-upcoming-bookings`, {
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
        let errorMessage: string;
        
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
          default:
            errorMessage = this.getErrorMessageForStatus(response.status, 'Failed to fetch upcoming bookings.');
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
        
        // Fetch additional product details for each booking to display in the UI
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking: BookingData) => {
            try {
              // Get product details
              const productResponse = await this.getSpaces({ id: booking.product_id });
              
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
        
        return {
          success: true,
          message: data.message || 'Upcoming bookings retrieved successfully',
          bookings: bookingsWithDetails
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve upcoming bookings',
          bookings: []
        };
      }
    } catch (error) {
      console.error('Get upcoming bookings error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to retrieve upcoming bookings';
      
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
   * Get past bookings for a user
   * Endpoint: /booking/get-past-bookings
   * Method: POST
   * Request:
   * {
   *   "user_id": 3
   * }
   * 
   * Response structure is the same as get-upcoming-bookings
   */
  static async getPastBookings(userId: number): Promise<{
    success: boolean;
    message: string;
    bookings: Array<BookingData>;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/booking/get-past-bookings`, {
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
        const errorMessage = this.getErrorMessageForStatus(
          response.status, 
          'Failed to fetch past bookings'
        );
        
        return {
          success: false,
          message: errorMessage,
          bookings: []
        };
      }

      const data = await response.json();

      if (data.status_code === 200 && Array.isArray(data.data)) {
        const bookings = data.data;
        
        // Fetch additional product details for each booking to display in the UI
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking: BookingData) => {
            try {
              // Get product details
              const productResponse = await this.getSpaces({ id: booking.product_id });
              
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
        
        return {
          success: true,
          message: data.message || 'Past bookings retrieved successfully',
          bookings: bookingsWithDetails
        };
      } else {
        return {
          success: false,
          message: data.message || this.getErrorMessageForStatus(response.status, 'Failed to retrieve past bookings'),
          bookings: []
        };
      }
    } catch (error) {
      console.error('Get past bookings error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = this.getErrorMessageForStatus(0, 'Failed to retrieve past bookings');
      
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
   * Get canceled bookings for a user
   * Endpoint: /booking/get-canceled-bookings
   * Method: POST
   * Request:
   * {
   *   "user_id": 3
   * }
   * 
   * Response structure is the same as get-upcoming-bookings
   */
  static async getCanceledBookings(userId: number): Promise<{
    success: boolean;
    message: string;
    bookings: Array<BookingData>;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/booking/get-canceled-bookings`, {
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
        const errorMessage = this.getErrorMessageForStatus(
          response.status, 
          'Failed to fetch canceled bookings'
        );
        
        return {
          success: false,
          message: errorMessage,
          bookings: []
        };
      }

      const data = await response.json();

      if (data.status_code === 200 && Array.isArray(data.data)) {
        const bookings = data.data;
        
        // Fetch additional product details for each booking to display in the UI
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking: BookingData) => {
            try {
              // Get product details
              const productResponse = await this.getSpaces({ id: booking.product_id });
              
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
        
        return {
          success: true,
          message: data.message || 'Canceled bookings retrieved successfully',
          bookings: bookingsWithDetails
        };
      } else {
        return {
          success: false,
          message: data.message || this.getErrorMessageForStatus(response.status, 'Failed to retrieve canceled bookings'),
          bookings: []
        };
      }
    } catch (error) {
      console.error('Get canceled bookings error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = this.getErrorMessageForStatus(0, 'Failed to retrieve canceled bookings');
      
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
   * Add a rating/review for a product
   * Endpoint: /rating/add-rating
   * Method: POST
   * Request:
   * {
   *   "product_id": 1,
   *   "user_id": 3,
   *   "first_name": "John", // Optional, used if user is not logged in
   *   "value": 5,
   *   "review_description": "Great space!"
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Rating added successfully",
   *   "data": {
   *     "value": 5,
   *     "review_description": "Great space!",
   *     "first_name": "John",
   *     "user_id": 3,
   *     "user_avatar": "/uploads/users/abc123.jpeg"
   *   }
   * }
   */
  static async addRating(ratingData: {
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
      const token = localStorage.getItem('auth_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this.BASE_URL}/rating/add-rating`, {
        method: 'POST',
        headers,
        body: JSON.stringify(ratingData)
      });
      
      // Handle specific HTTP error status codes with user-friendly messages
      if (!response.ok) {
        let errorMessage = this.getErrorMessageForStatus(
          response.status,
          'Failed to submit review'
        );
        
        // Override with more specific messages for certain cases
        if (response.status === 409) {
          errorMessage = 'You have already reviewed this space.';
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }
      
      const data = await response.json();
      
      if (data.status_code === 200 && data.data) {
        return {
          success: true,
          message: data.message || 'Review submitted successfully!',
          review: {
            value: data.data.value,
            review_description: data.data.review_description,
            first_name: data.data.first_name,
            user_id: data.data.user_id,
            user_avatar: data.data.user_avatar
          }
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to submit review'
        };
      }
    } catch (error) {
      console.error('Add rating error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to submit review';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  
  /**
   * Standardized method for handling HTTP response errors
   * @param status HTTP status code
   * @param defaultMessage Default message to show if no specific message for the status code
   * @returns Error message appropriate for the status code
   */
  private static getErrorMessageForStatus(status: number, defaultMessage: string = 'An error occurred. Please try again.'): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Conflict with existing data. Please try again with different information.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      default:
        return defaultMessage;
    }
  }
  
  /**
   * Get all ratings/reviews
   * Endpoint: /rating/get-all-ratings (or similar endpoint based on your API)
   * Method: POST
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": [
   *     {
   *       "value": 5,
   *       "review_description": "This is Good",
   *       "first_name": "Charitha",
   *       "user_id": 1,
   *       "user_avatar": ""
   *     },
   *     ...
   *   ]
   * }
   */
  static async getAllRatings(): Promise<{
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
      const response = await fetch(`${this.BASE_URL}/rating/view-all-ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorMessage = this.getErrorMessageForStatus(
          response.status, 
          'Failed to fetch ratings'
        );
        
        return {
          success: false,
          message: errorMessage,
          ratings: []
        };
      }
      
      const data = await response.json();
      
      if ((data.status_code === 200 || data.statusCode === 200) && Array.isArray(data.data)) {
        // Process avatar paths if they exist
        const processedRatings = data.data.map((rating: RatingData) => {
          if (rating.user_avatar && !rating.user_avatar.startsWith('http')) {
            const baseServerUrl = NetworkManager.BASE_URL.replace('/api', '');
            rating.user_avatar = `${baseServerUrl}${rating.user_avatar}`;
          }
          return rating;
        });
        
        return {
          success: true,
          message: data.message || 'Ratings retrieved successfully',
          ratings: processedRatings
        };
      } else {
        return {
          success: false,
          message: data.message || this.getErrorMessageForStatus(response.status, 'Failed to retrieve ratings'),
          ratings: []
        };
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      
      // Provide standardized error message
      let errorMessage = this.getErrorMessageForStatus(0, 'Failed to fetch ratings data');
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      return {
        success: false,
        message: errorMessage,
        ratings: []
      };
    }
  }

  /**
   * Get user's saved payment methods
   * Endpoint: /payment/get-payment-methods
   * Method: POST
   * Request:
   * {
   *   "user_id": 123
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Payment methods retrieved successfully",
   *   "data": [
   *     {
   *       "id": 1,
   *       "card_number": "413541******3146",
   *       "card_type": "VISA",
   *       "expiry_month": "12",
   *       "expiry_year": "25",
   *       "is_default": true
   *     }
   *   ]
   * }
   */
  static async getPaymentMethods(userId: number): Promise<{
    success: boolean;
    message: string;
    paymentMethods: Array<{
      id: number;
      card_number: string;
      card_type: string;
      expiry_month: string;
      expiry_year: string;
      is_default: boolean;
    }>;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/payment/get-payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to retrieve payment methods'),
          paymentMethods: []
        };
      }

      const data = await response.json();

      if (data.status_code === 200 && Array.isArray(data.data)) {
        return {
          success: true,
          message: data.message || 'Payment methods retrieved successfully',
          paymentMethods: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve payment methods',
          paymentMethods: []
        };
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return {
        success: false,
        message: 'Network error while fetching payment methods',
        paymentMethods: []
      };
    }
  }

  /**
   * Add new card - creates a payment gateway session
   * Endpoint: /payment/add-card
   * Method: POST
   * Request: FormData with fields:
   * {
   *   "first_name": "string",
   *   "last_name": "string", 
   *   "email": "string",
   *   "phone": "string",
   *   "is_card_add": true
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Card add session created successfully",
   *   "data": {
   *     "link": "https://test-gateway.directpay.lk/5567aea63897d14a",
   *     "token": "5567aea63897d14a",
   *     "sms_status": null,
   *     "email_status": null
   *   }
   * }
   */
  static async addNewCard(cardData: {
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
      // Build JSON payload as per new API spec
      const payload = {
        amount: 0,
        first_name: cardData.first_name,
        last_name: cardData.last_name,
        email: cardData.email,
        phone: cardData.phone
      };

      const response = await fetch(`${this.BASE_URL}/payment/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to create card session')
        };
      }

      const data = await response.json();
      // Debug log: show full response for troubleshooting
      console.log('addNewCard API response:', data);

      // Parse gateway link from response.data.data.link
      let gatewayData = undefined;
      if (data && data.data && data.data.data) {
        gatewayData = data.data.data;
      }
      if (data.status_code === 200 && gatewayData && gatewayData.link) {
        return {
          success: true,
          message: data.message || 'Card add session created successfully',
          gatewayData: gatewayData
        };
      } else {
        // Log specific error if link is missing
        console.error('addNewCard: Missing gateway link in response:', data);
        return {
          success: false,
          message: data.message || 'Failed to create card session'
        };
      }
    } catch (error) {
      console.error('Error creating card session:', error);
      return {
        success: false,
        message: 'Network error while creating card session'
      };
    }
  }

  /**
   * Process card payment and create booking
   * Endpoint: /api/cards/card-add
   *
   * @param paymentData - Payment and booking data
   * @returns Promise with success status and gateway link
   *
   * Expected response:
   * {
   *   "status_code": 200,
   *   "message": "Card add session & booking created successfully. Awaiting callback.",
     *   "data": {
   *     "link": "https://test-gateway.directpay.lk/35907b5584cf4a92",
   *     "token": "35907b5584cf4a92",
   *     "sms_status": null,
   *     "email_status": null
   *     *   }
   * }
   */
  static async processCardPayment(paymentData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_id?: number;
    is_card_add: boolean;
    amount: number;
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
      // Subscription properties (for dedicated desk)
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
      const response = await fetch(`${this.BASE_URL}/cards/card-add`, {
        method: 'POST',
        headers: this.getCustomHeaders(),
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to process payment')
        };
      }

      const data = await response.json();
      console.log('processCardPayment API response:', data);

      if (data.status_code === 200 && data.data && data.data.link) {
        return {
          success: true,
          message: data.message || 'Payment session created successfully',
          gatewayData: {
            link: data.data.link,
            token: data.data.token,
            sms_status: data.data.sms_status,
            email_status: data.data.email_status
          }
        };
      } else {
        console.error('processCardPayment: Invalid response structure:', data);
        return {
          success: false,
          message: data.message || 'Failed to process payment'
        };
      }
    } catch (error) {
      console.error('Error processing card payment:', error);
      return {
        success: false,
        message: 'Network error while processing payment'
      };
    }
  }

  static async getBooking(orderId: string): Promise<{
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
      const token = localStorage.getItem('auth_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/booking/get-booking?orderId=${encodeURIComponent(orderId)}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();

      if (response.ok && data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Booking retrieved successfully',
          data: data.data
        };
      } else {
        console.error('getBooking: API error:', data);
        return {
          success: false,
          message: data.message || 'Failed to retrieve booking'
        };
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: 'Network error while fetching booking'
      };
    }
  }

  /**
   * Send password reset link to user's email
   * Endpoint: /users/send-reset-link
   * Method: POST
   * Request:
   * {
   *   "email": "bimsaraadikari99@gmail.com"
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": "Password reset instructions sent to your email"
   * }
   */
  static async sendPasswordResetLink(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/send-reset-link`, {
        method: 'POST',
        headers: this.getCustomHeaders(),
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to send reset link')
        };
      }

      const data = await response.json();
      console.log('sendPasswordResetLink API response:', data);

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Password reset instructions sent to your email'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to send reset link'
        };
      }
    } catch (error) {
      console.error('Error sending password reset link:', error);
      return {
        success: false,
        message: 'Network error while sending reset link'
      };
    }
  }

  /**
   * Verify password reset code
   * Endpoint: /users/reset-with-code
   * Method: POST
   * Request:
   * {
   *   "email": "bimsaraadikari99@gmail.com",
   *   "code": "775576"
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": "Code verified successfully"
   * }
   */
  static async verifyPasswordResetCode(email: string, code: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/reset-with-code`, {
        method: 'POST',
        headers: this.getCustomHeaders(),
        body: JSON.stringify({
          email,
          code
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        
        // Handle specific error codes for OTP verification
        if (response.status === 400) {
          return {
            success: false,
            message: 'OTP invalid or expired'
          };
        }
        
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to verify code')
        };
      }

      const data = await response.json();
      console.log('verifyPasswordResetCode API response:', data);

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Code verified successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Invalid code'
        };
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Network error while verifying code'
      };
    }
  }

  /**
   * Reset password with verification code
   * Endpoint: /users/reset-with-code
   * Method: POST
   * Request:
   * {
   *   "email": "bimsaraadikari99@gmail.com",
   *   "code": "695170",
   *   "new_password": "charitha99"
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": "Password reset successfully"
   * }
   */
  static async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/reset-with-code`, {
        method: 'POST',
        headers: this.getCustomHeaders(),
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        
        // Handle specific error codes for password reset
        if (response.status === 400) {
          return {
            success: false,
            message: 'Invalid code or password requirements not met'
          };
        }
        
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to reset password')
        };
      }

      const data = await response.json();
      console.log('resetPasswordWithCode API response:', data);

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Password reset successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to reset password'
        };
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: 'Network error while resetting password'
      };
    }
  }

  /**
   * Update booking date and time
   * @param bookingData The booking update data
   * @returns Promise with success status and message
   */
  public static async updateBooking(bookingData: {
    BookingId: number;
    ProductId: number;
    BookingDate: string;
    StartTime?: string;
    EndTime?: string;
    SingleProductId?: number;  // Added for individual product date changes
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('Updating booking with data:', bookingData);
      
      // Log specific product ID if it's being updated
      if (bookingData.SingleProductId) {
        console.log(`Updating individual product with ID: ${bookingData.SingleProductId}`);
      } else {
        console.log('Updating entire booking (no specific product)');
      }

      // Always use FormData for this API endpoint
      const formData = new FormData();

      // Add required fields
      formData.append('BookingId', bookingData.BookingId.toString());
      formData.append('ProductId', bookingData.ProductId.toString());
      formData.append('BookingDate', bookingData.BookingDate);

      // Add time fields - send as empty values if not provided (for hot desks)
      formData.append('StartTime', bookingData.StartTime || '');
      formData.append('EndTime', bookingData.EndTime || '');

      // Let the browser set the correct Content-Type with boundary
      const headers = {};

      // Log the form data entries for debugging
      console.log('Update booking FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch(`${this.BASE_URL}/booking/update-boooking`, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();
      this.lastRawResponseData = data;

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Booking updated successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update booking'
        };
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        message: 'Network error while updating booking'
      };
    }
  }

  /**
   * Get user subscriptions
   * Endpoint: /booking/get-user-subscriptions
   * Method: POST
   * Request:
   * {
   *   "user_id": 3
   * }
   * 
   * Response:
   * {
   *   "status_code": 200,
   *   "message": "Request processed successfully",
   *   "data": {
   *     "total_count": 1,
   *     "subscriptions": [
   *       {
   *         "booking_product_id": 1,
   *         "booking_id": 1,
   *         "product_id": 1,
   *         "product_name": "Paymeida",
   *         "location_name": "Colombo 5",
   *         "subscription_start_date": "2025-09-25",
   *         "subscription_end_date": "2026-03-24",
   *         "package_type": "monthly",
   *         "total_price": 480,
   *         "status": "CONFIRMED"
   *       }
   *     ]
   *   }
   * }
   */
  static async getUserSubscriptions(userId: number): Promise<{
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
      const response = await fetch(`${this.BASE_URL}/booking/get-user-subscriptions`, {
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
        let errorMessage: string;
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your user ID.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please sign in again.';
            break;
          case 404:
            errorMessage = 'No subscriptions found.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = this.getErrorMessageForStatus(response.status, 'Failed to fetch subscriptions.');
        }
        
        return {
          success: false,
          message: errorMessage,
          totalCount: 0,
          subscriptions: []
        };
      }

      const data = await response.json();

      if (data.status_code === 200 && data.data) {
        return {
          success: true,
          message: data.message || 'Subscriptions retrieved successfully',
          totalCount: data.data.total_count || 0,
          subscriptions: data.data.subscriptions || []
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve subscriptions',
          totalCount: 0,
          subscriptions: []
        };
      }
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to retrieve subscriptions';
      
      if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      return {
        success: false,
        message: errorMessage,
        totalCount: 0,
        subscriptions: []
      };
    }
  }

  /**
   * Get invoice details by order ID
   * Endpoint: /cards/get-invoice
   * Method: POST
   * Request:
   * {
   *   "order_id": "ee06f667b6f7451291afa2e51c2d63cf"
   * }
   * 
   * Response for normal booking:
   * {
   *   "status_code": 200,
   *   "message": "Invoice retrieved successfully",
   *   "data": {
   *     "order_id": "ee06f667b6f7451291afa2e51c2d63cf",
   *     "transaction_id": "232270",
   *     "first_name": "bimsara",
   *     "last_name": "adikari",
   *     "email": "bimsaraadikari99@gmail.com",
   *     "phone": "0719934597",
   *     "total_amount": 800,
   *     "products": [
   *       {
   *         "product_id": 2,
   *         "product_type": "MeetingRoom",
   *         "location_name": "Colombo 5",
   *         "booking_date": "2025-09-23",
   *         "start_time": "09:00:00",
   *         "end_time": "17:00:00",
   *         "subscription_start_date": null,
   *         "subscription_end_date": null,
   *         "package_type": null,
   *         "total_price": 800,
   *         "additional_facilities": [
   *           {
   *             "facility_id": 1,
   *             "facility_name": "TV",
   *             "price": 440
   *           }
   *         ]
   *       }
   *     ]
   *   }
   * }
   * 
   * Response for subscription booking:
   * {
   *   "status_code": 200,
   *   "message": "Invoice retrieved successfully",
   *   "data": {
   *     "order_id": "39610e449df640ea83bec9e145c3f292",
   *     "transaction_id": "232271",
   *     "first_name": "bimsara",
   *     "last_name": "adikari",
   *     "email": "bimsaraadikari99@gmail.com",
   *     "phone": "0719934597",
   *     "total_amount": 2709,
   *     "products": [
   *       {
   *         "product_id": 1,
   *         "product_type": "DedicatedDesk",
   *         "location_name": "Colombo 5",
   *         "booking_date": null,
   *         "start_time": null,
   *         "end_time": null,
   *         "subscription_start_date": "2025-09-23",
   *         "subscription_end_date": "2028-09-22",
   *         "package_type": "annual",
   *         "total_price": 2709,
   *         "additional_facilities": []
   *       }
   *     ]
   *   }
   * }
   */
  static async getInvoice(orderId: string): Promise<{
    success: boolean;
    message: string;
    data?: InvoiceData;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards/get-invoice`, {
        method: 'POST',
        headers: this.getCustomHeaders(),
        body: JSON.stringify({ order_id: orderId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to retrieve invoice')
        };
      }

      const data = await response.json();
      this.lastRawResponseData = data;

      if (data.status_code === 200) {
        return {
          success: true,
          message: data.message || 'Invoice retrieved successfully',
          data: data.data
        };
      } else {
        console.error('getInvoice: API error:', data);
        return {
          success: false,
          message: data.message || 'Failed to retrieve invoice'
        };
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return {
        success: false,
        message: 'Network error while fetching invoice'
      };
    }
  }

  /**
   * Send contact message
   * API: POST /contact/send-message
   * Body: { name: string, email: string, message: string }
   */
  static async sendContactMessage(contactData: ContactMessageRequest): Promise<ContactMessageResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/contact/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        return {
          success: false,
          message: this.getErrorMessageForStatus(response.status, 'Failed to send contact message')
        };
      }

      const data = await response.json();
      this.lastRawResponseData = data;

      if (data.status_code === 200 || data.success) {
        return {
          success: true,
          message: data.message || 'Message sent successfully',
          ticket_id: data.ticket_id || data.data?.ticket_id
        };
      } else {
        console.error('sendContactMessage: API error:', data);
        return {
          success: false,
          message: data.message || 'Failed to send contact message'
        };
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      return {
        success: false,
        message: 'Network error while sending contact message'
      };
    }
  }
}