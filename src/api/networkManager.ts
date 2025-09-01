// src/api/networkManager.ts
// NetworkManager for essential APIs only
// Handles: product listing/searching/filtering, space details, locations, and booked time slots

import type { SpaceDto } from '../dto/response';

export class NetworkManager {
  private static readonly BASE_URL = 'http://192.168.2.30:9011/api';
  private static lastRawResponseData: any = null;

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

      if (data.status_code === 200 && Array.isArray(data.data)) {
        // Return full location objects with id, name, address, and url
        return data.data.map((location: any) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          url: location.url
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
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
    recentReviews?: any[];
    amenities?: any[];
    nearbySpaces?: any[];
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
          // Transform the API response to match our SpaceDto interface
          const transformedSpaces = this.transformApiSpacesToSpaceDto([data.data]);
          const transformedSpace = transformedSpaces[0];

          // Add recent ratings if available
          if (data.data.recent_ratings && Array.isArray(data.data.recent_ratings)) {
            transformedSpace.recent_ratings = data.data.recent_ratings;
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
        const requestBody: any = {};

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
          requestBody.locationId = params.location_id;
        }

        if (params.date) {
          // Ensure date is in the correct format (YYYY-MM-DD)
          const dateStr = params.date.includes('T') ? params.date.split('T')[0] : params.date;
          requestBody.date = dateStr;
        }

        // Add start and end time as separate fields (not operation times)
        if (params.start_time) {
          requestBody.startTime = params.start_time;
        }

        if (params.end_time) {
          requestBody.endTime = params.end_time;
        }

        if (params.capacity !== undefined && params.capacity !== null) {
          requestBody.capacity = params.capacity;
        }

        if (params.min_daily_rate !== undefined) {
          requestBody.minPrice = params.min_daily_rate; // Changed to match new API format
        }

        if (params.max_daily_rate !== undefined) {
          requestBody.maxPrice = params.max_daily_rate; // Changed to match new API format
        }

        if (params.min_rating !== undefined) {
          requestBody.minRating = params.min_rating; // Changed to match new API format
        }

        if (params.facilities && params.facilities.length > 0) {
          requestBody.facilities = params.facilities;
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status_code === 200) {
          // Transform API response to match our SpaceDto format
          const transformedSpaces = this.transformApiSpacesToSpaceDto(data.data || []);

          return {
            success: true,
            message: data.message || 'Spaces retrieved successfully',
            spaces: transformedSpaces,
            totalCount: data.data?.length || 0
          };
        } else {
          return {
            success: false,
            message: data.message || 'Failed to retrieve spaces',
            spaces: [],
            totalCount: 0
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch spaces data',
        spaces: [],
        totalCount: 0
      };
    }
  }

  /**
   * Transform API response format to our internal SpaceDto format
   */
  private static transformApiSpacesToSpaceDto(apiSpaces: any[]): SpaceDto[] {
    return apiSpaces.map((apiSpace, index) => {
      // Transform pricing from array format to object format
      let pricing: any = {};
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
      let availability: any[] = [];
      if (apiSpace.availability && Array.isArray(apiSpace.availability)) {
        availability = apiSpace.availability.map((avail: any) => ({
          date: avail.date ? avail.date.split('T')[0] : '', // Extract date part
          slots: avail.slots || []
        }));
      }

      // Map product type to our internal format and get display name
      let productType = '';
      let displayProductType = '';
      const apiProductType = (apiSpace.productType || '').toLowerCase();
      
      switch (apiSpace.productType) {
        case 'MeetingRoom':
        case 'MeetingRooms':
        case 'meeting':
        case 'meetingroom':
          productType = 'meeting-room';
          displayProductType = 'Meeting Room';
          break;
        case 'HotDesk':
        case 'HotDesk':
          productType = 'hot-desk';
          displayProductType = 'Hot Desk';
          break;
        case 'DedicatedDesk':
        case 'DedicatedDesks':
          productType = 'dedicated-desk';
          displayProductType = 'Dedicated Desk';
          break;
        default:
          // Fallback mapping for unknown types
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
            productType = apiProductType.replace(/\s+/g, '-');
            displayProductType = apiSpace.productType || '';
          }
      }

      // Handle features and additional_facilities separately (DO NOT mix them!)
      let features: string[] = [];
      
      // ONLY use the features field for features - DO NOT add facilities to features
      if (Array.isArray(apiSpace.features)) {
        features = [...apiSpace.features];
      }
      
      // Handle additional facilities - keep them separate from features
      let additional_facilities: string[] = [];
      if (Array.isArray(apiSpace.additional_facilities)) {
        additional_facilities = [...apiSpace.additional_facilities];
      }
      
      // Remove duplicates
      features = [...new Set(features)];
      additional_facilities = [...new Set(additional_facilities)];
      
      // Extract operation times if available
      let start_operation_time = apiSpace.start_operation_time || null;
      let end_operation_time = apiSpace.end_operation_time || null;
      
      // Process images - add base URL to relative paths
      const processedImages = NetworkManager.processImageUrls(apiSpace.images || []);

      const transformedSpace: SpaceDto = {
        id: apiSpace.id,
        name: apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`,
        description: apiSpace.discription || apiSpace.product_description || '',
        location: apiSpace.locationName || apiSpace.location || apiSpace.address || '', // Use locationName first, then fallbacks
        address: apiSpace.address || '',
        productType: productType,
        displayProductType: displayProductType, // Add display name for product type
        images: processedImages,
        rating: Number(apiSpace.rating) || 0, // Ensure rating is a number
        reviews: Number(apiSpace.reviews) || Number(apiSpace.review_count) || 0, // Handle different review field names
        pricing: pricing,
        capacity: Number(apiSpace.capacity) || 0,
        maxCapacity: Number(apiSpace.maxCapacity) || Number(apiSpace.capacity) || 0,
        features: features, // Use ONLY the features array from response.features
        additional_facilities: additional_facilities, // Use ONLY additional_facilities array from response.additional_facilities
        isAvailable: true, // Assume available if returned by search
        availability: availability,
        start_operation_time: start_operation_time,
        end_operation_time: end_operation_time
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
}