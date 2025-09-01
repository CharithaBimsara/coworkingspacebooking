// src/api/networkManager.ts
// NetworkManager for Home Page APIs (do not import or use in Home.vue yet)
// Each method simulates a real API call and includes backend response format as comments.

import type { SpaceDto, AdvertisementDto, TestimonialDto, CompanyProfileDto } from '../dto/response';
import { SearchSpacesRequestDto } from '../dto/request';

export class NetworkManager {
  private static readonly BASE_URL = 'http://192.168.2.30:9011/api';

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
   * Get company profile information including name, contact details, and hero image.
   * Backend expects:
   *   { "id": 1 }
   * Backend returns:
   *   { 
   *     "status_code": 200, 
   *     "message": "Company retrieved successfully", 
   *     "data": {
   *       "name": "Squarehub",
   *       "email": "stri@gmail.con",
   *       "phone": "0111234567",
   *       "address": "stringghgiu",
   *       "image": "/uploads/Company/9064f3f4-f8d8-4938-b69d-e2d1b928dfa0.jpeg"
   *     }
   *   }
   * Frontend maps: response.data (CompanyProfileDto)
   */
  static async getCompanyProfile(): Promise<CompanyProfileDto | null> {
    try {
      const response = await fetch(`http://192.168.2.10:9011/api/company-profile/get-company-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 1 })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status_code === 200 && data.data) {
        // Extract company profile data from the response
        return {
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          image: data.data.image || ''
        };
      } else {
        throw new Error(data.message || 'Failed to fetch company profile');
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return null;
    }
  }

  /**
   * Get all space types for the space type dropdown.
   * Backend returns:
   *   { "spaceTypes": [ { "value": "meeting-room", "label": "Meeting Room", "icon": "<svg..." }, ... ] }
   * Frontend maps: response.spaceTypes (Array<{ value, label, icon }>)
   */
  static async getSpaceTypes(): Promise<Array<{ value: string; label: string; icon: string }>> {
    // return fetch('/api/space-types').then(res => res.json()).then(data => data.spaceTypes);
    return [];
  }

  /**
   * Get hero images for the homepage slideshow.
   * Backend returns:
   *   { "heroImages": [ { "src": "url", "alt": "desc" }, ... ] }
   * Frontend maps: response.heroImages (Array<{ src, alt }>)
   */
  static async getHeroImages(): Promise<Array<{ src: string; alt: string }>> {
    // return fetch('/api/hero-images').then(res => res.json()).then(data => data.heroImages);
    return [];
  }

  /**
   * Get advertisements and their details for the homepage.
   * Backend returns:
   *   { "advertisements": [ { ...AdvertisementDto }, ... ] }
   * Frontend maps: response.advertisements (AdvertisementDto[])
   */
  static async getAdvertisements(): Promise<AdvertisementDto[]> {
    // return fetch('/api/advertisements').then(res => res.json()).then(data => data.advertisements);
    return [];
  }

  /**
   * Get featured workspace details for the homepage.
   * Backend returns:
   *   { "featuredSpaces": [ { ...SpaceDto }, ... ] }
   * Frontend maps: response.featuredSpaces (SpaceDto[])
   */
  static async getFeaturedSpaces(): Promise<SpaceDto[]> {
    // return fetch('/api/featured-spaces').then(res => res.json()).then(data => data.featuredSpaces);
    return [];
  }

  /**
   * Get testimonials for the "What Our Members Say" section.
   * Backend returns:
   *   { "testimonials": [ { ...TestimonialDto }, ... ] }
   * Frontend maps: response.testimonials (TestimonialDto[])
   */
  static async getTestimonials(): Promise<TestimonialDto[]> {
    // return fetch('/api/testimonials').then(res => res.json()).then(data => data.testimonials);
    return [];
  }

  /**
   * Subscribe to the newsletter (Stay Updated section).
   * Backend expects:
   *   { "email": "user@email.com" }
   * Backend returns:
   *   { "success": true, "message": "Subscribed!" }
   * Frontend maps: response.success (boolean), response.message (string)
   */
  static async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    // return fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
    //   .then(res => res.json());
    return { success: true, message: 'Subscribed (mock)' };
  }

  /**
   * Get logo URL and website name for branding (header/footer).
   * Backend returns:
   *   { "logoUrl": "url", "websiteName": "WorkSpace" }
   * Frontend maps: response.logoUrl (string), response.websiteName (string)
   */
  static async getBranding(): Promise<{ logoUrl: string; websiteName: string }> {
    // return fetch('/api/branding').then(res => res.json());
    return { logoUrl: '', websiteName: '' };
  }

  /**
   * Get contact details for the footer.
   * Backend returns:
   *   { "email": "support@workspace.com", "phone": "+1234567890", "address": "123 Workspace Ave..." }
   * Frontend maps: response.email, response.phone, response.address (all string)
   */
  static async getFooterContact(): Promise<{ email: string; phone: string; address: string }> {
    // return fetch('/api/footer-contact').then(res => res.json());
    return { email: '', phone: '', address: '' };
  }

  /**
   * Get booked time slots for a specific space and date.
   * Backend expects:
   *   { "spaceId": 123, "date": "2024-12-25" }
   * Backend returns:
   *   { "status_code": 200, "data": { "bookedSlots": [{ "startTime": "09:00", "endTime": "11:00" }, ...] } }
   * Frontend maps: response.data.bookedSlots (Array<{ startTime, endTime }>)
   */
    /**
   * Unified API for working with spaces
   * Supports both searching for spaces and fetching individual space details
   * 
   * Search API:
   *   POST /product/filter-products
   *   Body: { type: "HotDesks", location_id: 1, ... }
   * 
   * Details API: (TODO - implement when available)
   *   GET /product/{id}
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
      console.log('🔍 NetworkManager.getSpaces called with params:', params);

      // If id is provided, we're fetching details for a specific space
      if (params.id) {
        console.log('📄 Fetching space details for ID:', params.id);
        
        // TODO: Implement real space details API when available
        // For now, return mock data for space details
        console.warn('⚠️ Space details API not implemented yet, using mock data');
        
        return {
          success: false,
          message: 'Space details API not implemented yet',
          space: {} as SpaceDto
        };
      } 
      // Otherwise, we're searching for spaces based on criteria
      else {
        console.log('🔎 Searching for spaces with filters');
        
        // Prepare the request body
        const requestBody: any = {};

        // Map space type to backend format if provided
        if (params.type) {
          const spaceTypeMapping: Record<string, string> = {
            'meeting-room': 'MeetingRoom',
            'hot-desk': 'HotDesks', 
            'dedicated-desk': 'DedicatedDesk'
          };
          requestBody.type = spaceTypeMapping[params.type] || params.type;
          console.log(`Space type mapped: ${params.type} -> ${requestBody.type}`);
        }

        // Add other parameters conditionally
        if (params.location_id !== undefined) {
          requestBody.location_id = params.location_id;
          console.log('Location ID:', requestBody.location_id);
        }

        if (params.start_time) {
          requestBody.start_time = params.start_time;
          console.log('Start time:', requestBody.start_time);
        }

        if (params.end_time) {
          requestBody.end_time = params.end_time;
          console.log('End time:', requestBody.end_time);
        }

        if (params.date) {
          // Ensure date is in the correct format (YYYY-MM-DD)
          const dateStr = params.date.includes('T') ? params.date.split('T')[0] : params.date;
          requestBody.date = dateStr;
          console.log('Date:', requestBody.date);
        }

        if (params.capacity !== undefined && params.capacity !== null) {
          requestBody.capacity = params.capacity;
          console.log('Capacity:', requestBody.capacity);
        }

        if (params.min_daily_rate !== undefined) {
          requestBody.min_daily_rate = params.min_daily_rate;
          console.log('Min daily rate:', requestBody.min_daily_rate);
        }

        if (params.max_daily_rate !== undefined) {
          requestBody.max_daily_rate = params.max_daily_rate;
          console.log('Max daily rate:', requestBody.max_daily_rate);
        }

        if (params.min_rating !== undefined) {
          requestBody.min_rating = params.min_rating;
          console.log('Min rating:', requestBody.min_rating);
        }

        if (params.facilities && params.facilities.length > 0) {
          requestBody.facilities = params.facilities;
          console.log('🏗️ Facilities:', requestBody.facilities);
        }

        console.log('Final request body for API:', requestBody);
        
        // Real API implementation
        const apiUrl = `${this.BASE_URL}/product/filter-products`;
        console.log('Making API call to:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log('📥 API Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        if (data.status_code === 200) {
          console.log(`API Success: ${data.message}`);
          console.log(`Found ${data.data?.length || 0} spaces`);

          // Transform API response to match our SpaceDto format
          const transformedSpaces = this.transformApiSpacesToSpaceDto(data.data || []);
          console.log('Transformed spaces:', transformedSpaces);

          return {
            success: true,
            message: data.message || 'Spaces retrieved successfully',
            spaces: transformedSpaces,
            totalCount: data.data?.length || 0
          };
        } else {
          console.error('API Error:', data.message);
          return {
            success: false,
            message: data.message || 'Failed to retrieve spaces',
            spaces: [],
            totalCount: 0
          };
        }
      }
    } catch (error) {
      console.error('💥 Error in getSpaces:', error);
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
    console.log('🔄 Transforming API spaces to SpaceDto format');
    
    return apiSpaces.map((apiSpace, index) => {
      console.log(`🏢 Transforming space ${index + 1}:`, apiSpace.name || `Space ${apiSpace.id}`);
      
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
          console.log(`💰 Calculated daily price for meeting room: ${pricing.daily} (${pricing.hourly} * 8 hours)`);
        }
        
        console.log(`💰 Transformed pricing for ${apiSpace.name}:`, pricing);
      }

      // Transform availability format
      let availability: any[] = [];
      if (apiSpace.availability && Array.isArray(apiSpace.availability)) {
        availability = apiSpace.availability.map((avail: any) => ({
          date: avail.date ? avail.date.split('T')[0] : '', // Extract date part
          slots: avail.slots || []
        }));
        console.log(`📅 Transformed availability for ${apiSpace.name}:`, availability);
      }

      // Map product type to our internal format and get display name
      let productType = '';
      let displayProductType = '';
      switch (apiSpace.productType) {
        case 'MeetingRoom':
        case 'MeetingRooms': // Handle both singular and plural
          productType = 'meeting-room';
          displayProductType = 'Meeting Room';
          break;
        case 'HotDesk':
        case 'HotDesks': // Handle both singular and plural
          productType = 'hot-desk';
          displayProductType = 'Hot Desk';
          break;
        case 'DedicatedDesk':
        case 'DedicatedDesks': // Handle both singular and plural
          productType = 'dedicated-desk';
          displayProductType = 'Dedicated Desk';
          break;
        default:
          // Fallback mapping for unknown types
          const lowerType = (apiSpace.productType || '').toLowerCase();
          if (lowerType.includes('meeting')) {
            productType = 'meeting-room';
            displayProductType = 'Meeting Room';
          } else if (lowerType.includes('hot') || lowerType.includes('desk')) {
            productType = 'hot-desk';
            displayProductType = 'Hot Desk';
          } else if (lowerType.includes('dedicated')) {
            productType = 'dedicated-desk';
            displayProductType = 'Dedicated Desk';
          } else {
            productType = lowerType.replace(/\s+/g, '-');
            displayProductType = apiSpace.productType || '';
          }
      }
      console.log(`🏷️ Mapped product type: ${apiSpace.productType} -> ${productType} (Display: ${displayProductType})`);

      // Handle features and additional_facilities separately (DO NOT mix them!)
      let features: string[] = [];
      
      // ONLY use the features field for features - DO NOT add facilities to features
      if (Array.isArray(apiSpace.features)) {
        features = [...apiSpace.features];
      }
      
      // Remove duplicates
      features = [...new Set(features)];
      
      console.log(`🏗️ Features for ${apiSpace.name}:`, features);
      console.log(`🏗️ Additional facilities for ${apiSpace.name}:`, apiSpace.additional_facilities || []);

      const transformedSpace: SpaceDto = {
        id: apiSpace.id,
        name: apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`,
        description: apiSpace.discription || apiSpace.product_description || '',
        location: apiSpace.locationName || apiSpace.location || apiSpace.address || '', // Use locationName first, then fallbacks
        address: apiSpace.address || '',
        productType: productType,
        displayProductType: displayProductType, // Add display name for product type
        images: Array.isArray(apiSpace.images) ? apiSpace.images : [],
        rating: Number(apiSpace.rating) || 0, // Ensure rating is a number
        reviews: Number(apiSpace.reviews) || Number(apiSpace.review_count) || 0, // Handle different review field names
        pricing: pricing,
        capacity: Number(apiSpace.capacity) || 0,
        maxCapacity: Number(apiSpace.maxCapacity) || Number(apiSpace.capacity) || 0,
        features: features, // Use ONLY the features array from response.features
        additional_facilities: Array.isArray(apiSpace.additional_facilities) ? apiSpace.additional_facilities : [], // Use ONLY additional_facilities array from response.additional_facilities
        isAvailable: true, // Assume available if returned by search
        availability: availability
      };

      console.log(`✅ Successfully transformed space: ${transformedSpace.name}`);
      return transformedSpace;
    });
  }
  // static async getSpaces(params: {
  //   id?: number;
  //   location_id?: number; // Changed from locationId to location_id
  //   type?: string; // Changed from spaceType to type (will be mapped)
  //   date?: string;
  //   start_time?: string; // Changed from startTime to start_time
  //   end_time?: string; // Changed from endTime to end_time
  //   capacity?: number | null;
  //   min_daily_rate?: number; // Changed from minPrice to min_daily_rate
  //   max_daily_rate?: number; // Changed from maxPrice to max_daily_rate
  //   facilities?: string[];
  //   min_rating?: number; // Changed from minRating to min_rating
  // }): Promise<{
  //   success: boolean;
  //   message: string;
  //   spaces?: SpaceDto[];
  //   space?: SpaceDto;
  //   totalCount?: number;
  //   recentReviews?: any[];
  //   amenities?: any[];
  //   nearbySpaces?: any[];
  // }> {
  //   try {
  //     // If id is provided, we're fetching details for a specific space
  //     if (params.id) {
  //       // Real API implementation
  //       // const response = await fetch(`${this.BASE_URL}/spaces/${params.id}`, {
  //       //   method: 'GET',
  //       //   headers: {
  //       //     'Content-Type': 'application/json',
  //       //   },
  //       // });
  //       // 
  //       // if (!response.ok) {
  //       //   throw new Error(`HTTP error! status: ${response.status}`);
  //       // }
  //       // 
  //       // const data = await response.json();
  //       // 
  //       // return {
  //       //   success: data.success || data.status_code === 200,
  //       //   message: data.message || '',
  //       //   space: data.space,
  //       //   recentReviews: data.recentReviews || [],
  //       //   amenities: data.amenities || [],
  //       //   nearbySpaces: data.nearbySpaces || []
  //       // };

  //       // Mock implementation until backend is ready
  //       await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

  //       // Use the same mock spaces from the search function
  //       const mockSpaces: SpaceDto[] = [
  //         {
  //           id: 1,
  //           name: 'Executive Meeting Room',
  //           description: 'Professional meeting space with modern amenities for your business needs',
  //           location: 'Kandy Lakeside',
  //           address: '123 Kandy Street, Kandy',
  //           productType: 'meeting-room',
  //           images: [
  //             'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  //             'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  //             'https://images.unsplash.com/photo-1596723404722-23619249fa69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.8,
  //           reviews: 124,
  //           pricing: {
  //             hourly: 25,
  //             daily: 180,
  //             monthly: 3500,
  //             annual: 36000
  //           },
  //           capacity: 12,
  //           maxCapacity: 15,
  //           features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
  //           ]
  //         },
  //         {
  //           id: 2,
  //           name: 'Hot Desk Premium',
  //           description: 'Flexible workspace for professionals on the go',
  //           location: 'Colombo Central',
  //           address: '45 Main Street, Colombo',
  //           productType: 'hot-desk',
  //           images: [
  //             'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.5,
  //           reviews: 89,
  //           pricing: {
  //             daily: 35,
  //             monthly: 600,
  //             annual: 6000
  //           },
  //           capacity: 1,
  //           maxCapacity: 1,
  //           features: ['wifi', 'coffee', 'printing', 'locker'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
  //           ]
  //         },
  //         {
  //           id: 3,
  //           name: 'Dedicated Office Space',
  //           description: 'Private office space with 24/7 access',
  //           location: 'Galle Fort',
  //           address: '78 Fort Road, Galle',
  //           productType: 'dedicated-desk',
  //           images: [
  //             'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.9,
  //           reviews: 45,
  //           pricing: {
  //             monthly: 350,
  //             annual: 3800
  //           },
  //           capacity: 1,
  //           maxCapacity: 1,
  //           features: ['wifi', 'coffee', 'printing', 'parking', '24-7-access', 'meeting-room-credits'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '00:00', endTime: '23:59' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '00:00', endTime: '23:59' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '00:00', endTime: '23:59' }] }
  //           ]
  //         }
  //       ];

  //       const spaceData = mockSpaces.find(space => space.id === params.id);

  //       if (!spaceData) {
  //         return {
  //           success: false,
  //           message: 'Space not found',
  //           space: {} as SpaceDto
  //         };
  //       }

  //       // If type is provided, override the productType
  //       if (params.type) {
  //         spaceData.productType = params.type;
  //       }

  //       // Generate reviews based on space ID for variety
  //       const reviewsDatabase: Record<number, any[]> = {
  //         1: [
  //           {
  //             id: 1,
  //             name: 'Sarah Chen',
  //             rating: 5,
  //             comment: 'Perfect for our team meetings. The Innovation Hub has everything we need for productive sessions.',
  //             avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           },
  //           {
  //             id: 2,
  //             name: 'Michael Ross',
  //             rating: 5,
  //             comment: 'Great location and excellent technology setup. The 4K display made our presentation shine.',
  //             avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           }
  //         ],
  //         2: [
  //           {
  //             id: 3,
  //             name: 'Emma Wilson',
  //             rating: 5,
  //             comment: 'Love the natural light and creative atmosphere. Perfect for my design work.',
  //             avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           },
  //           {
  //             id: 4,
  //             name: 'David Kim',
  //             rating: 4,
  //             comment: 'Great community vibe and the standing desks are a nice touch.',
  //             avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           }
  //         ],
  //         3: [
  //           {
  //             id: 5,
  //             name: 'Jennifer Martinez',
  //             rating: 5,
  //             comment: 'Impressive boardroom that made a great impression on our clients. Professional setup.',
  //             avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           },
  //           {
  //             id: 6,
  //             name: 'Robert Taylor',
  //             rating: 5,
  //             comment: 'Executive-level quality with excellent video conferencing capabilities.',
  //             avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  //           }
  //         ]
  //       };

  //       const amenities = [
  //         { id: 1, name: 'High-Speed WiFi', icon: 'wifi', price: 0 },
  //         { id: 2, name: '4K Display', icon: 'display', price: 10 },
  //         { id: 3, name: 'Video Conferencing', icon: 'video', price: 15 },
  //         { id: 4, name: 'Coffee Service', icon: 'coffee', price: 5 },
  //         { id: 5, name: 'Whiteboard', icon: 'whiteboard', price: 0 },
  //         { id: 6, name: 'Printing Services', icon: 'print', price: 5 }
  //       ];

  //       // Generate a few nearby spaces (excluding the current one)
  //       const nearbySpaces = mockSpaces
  //         .filter(space => space.id !== params.id)
  //         .map(space => ({
  //           id: space.id,
  //           name: space.name,
  //           location: space.location,
  //           productType: space.productType,
  //           images: [space.images[0]],
  //           pricing: space.pricing
  //         }));

  //       const reviews = reviewsDatabase[params.id] || reviewsDatabase[1];

  //       return {
  //         success: true,
  //         message: 'Space details retrieved successfully',
  //         space: spaceData,
  //         recentReviews: reviews,
  //         amenities: amenities,
  //         nearbySpaces: nearbySpaces
  //       };
  //     } 
  //     // Otherwise, we're searching for spaces based on criteria
  //     else {
  //       // Prepare the request body by cleaning the parameters
  //       const cleanParams = { ...params };

  //       // Map space type to backend format if provided
  //       if (cleanParams.type) {
  //         const spaceTypeMapping: Record<string, string> = {
  //           'meeting-room': 'MeetingRoom',
  //           'hot-desk': 'HotDesk',
  //           'dedicated-desk': 'DedicatedDesk'
  //         };
  //         // If it's already in the correct format, keep it; otherwise map it
  //         if (!['MeetingRoom', 'HotDesk', 'DedicatedDesk'].includes(cleanParams.type as string)) {
  //           cleanParams.type = spaceTypeMapping[cleanParams.type as string] || cleanParams.type;
  //         }
  //       }
        
  //       // Remove null, undefined and empty values
  //       Object.keys(cleanParams).forEach(key => {
  //         const value = cleanParams[key as keyof typeof cleanParams];
  //         if (
  //           value === null || 
  //           value === undefined || 
  //           (typeof value === 'string' && value === '') ||
  //           (Array.isArray(value) && value.length === 0)
  //         ) {
  //           delete cleanParams[key as keyof typeof cleanParams];
  //         }
  //       });
        
  //       console.log('Searching spaces with params:', cleanParams);
        
  //       // Real API implementation using POST with JSON body
  //       // const response = await fetch(`${this.BASE_URL}/spaces/search`, {
  //       //   method: 'POST',
  //       //   headers: {
  //       //     'Content-Type': 'application/json',
  //       //   },
  //       //   body: JSON.stringify(cleanParams)
  //       // });
  //       //
  //       // if (!response.ok) {
  //       //   throw new Error(`HTTP error! status: ${response.status}`);
  //       // }
  //       //
  //       // const data = await response.json();
  //       //
  //       // return {
  //       //   success: data.success || data.status_code === 200,
  //       //   message: data.message || '',
  //       //   spaces: data.spaces || [],
  //       //   totalCount: data.totalCount || (data.spaces ? data.spaces.length : 0)
  //       // };
        
  //       // Mock implementation until backend is ready
  //       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
  //       // Use the existing mock implementation from searchSpaces
  //       // Generate mock spaces based on the search parameters
  //       const mockSpaces: SpaceDto[] = [
  //         {
  //           id: 1,
  //           name: 'Executive Meeting Room',
  //           description: 'Professional meeting space with modern amenities for your business needs',
  //           location: 'Kandy Lakeside',
  //           address: '123 Kandy Street, Kandy',
  //           productType: 'meeting-room',
  //           images: [
  //             'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.8,
  //           reviews: 124,
  //           pricing: {
  //             hourly: 25,
  //             daily: 180
  //           },
  //           capacity: 12,
  //           maxCapacity: 15,
  //           features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
  //           ]
  //         },
  //         {
  //           id: 2,
  //           name: 'Hot Desk Premium',
  //           description: 'Flexible workspace for professionals on the go',
  //           location: 'Colombo Central',
  //           address: '45 Main Street, Colombo',
  //           productType: 'hot-desk',
  //           images: [
  //             'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.5,
  //           reviews: 89,
  //           pricing: {
  //             daily: 35
  //           },
  //           capacity: 1,
  //           maxCapacity: 1,
  //           features: ['wifi', 'coffee', 'printing', 'locker'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
  //           ]
  //         },
  //         {
  //           id: 4,
  //           name: 'Dedicated Office Space',
  //           description: 'Private office space with 24/7 access',
  //           location: 'Galle Fort',
  //           address: '78 Fort Road, Galle',
  //           productType: 'dedicated-desk',
  //           images: [
  //             'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.9,
  //           reviews: 45,
  //           pricing: {
  //             monthly: 350
  //           },
  //           capacity: 1,
  //           maxCapacity: 1,
  //           features: ['wifi', 'coffee', 'printing', 'parking', '24-7-access', 'meeting-room-credits'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '00:00', endTime: '23:59' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '00:00', endTime: '23:59' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '00:00', endTime: '23:59' }] }
  //           ]
  //         },
  //         {
  //           id: 1,
  //           name: 'Executive Meeting Room',
  //           description: 'Professional meeting space with modern amenities for your business needs',
  //           location: 'Kandy Lakeside',
  //           address: '123 Kandy Street, Kandy',
  //           productType: 'meeting-room',
  //           images: [
  //             'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //           ],
  //           rating: 4.8,
  //           reviews: 124,
  //           pricing: {
  //             hourly: 25,
  //             daily: 180
  //           },
  //           capacity: 12,
  //           maxCapacity: 15,
  //           features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
  //           isAvailable: true,
  //           availability: [
  //             { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
  //             { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
  //           ]
  //         }
  //       ];
        
  //       // Apply filters similar to the original searchSpaces method
  //       let filteredSpaces = this.applyFilters(mockSpaces, params);
        
  //       return {
  //         success: true,
  //         message: `Found ${filteredSpaces.length} spaces matching your criteria`,
  //         spaces: filteredSpaces,
  //         totalCount: filteredSpaces.length
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error with spaces API:', error);
  //     return {
  //       success: false,
  //       message: error instanceof Error ? error.message : 'Failed to fetch spaces data',
  //       spaces: [],
  //       totalCount: 0
  //     };
  //   }
  // }
  
  // Helper method to filter spaces based on search parameters (for mock implementation)
  private static applyFilters(spaces: SpaceDto[], params: any): SpaceDto[] {
    let filteredSpaces = [...spaces];
    
    // Filter by location
    if (params.location) {
      const locationLower = String(params.location).toLowerCase();
      filteredSpaces = filteredSpaces.filter(space => 
        space.location.toLowerCase().includes(locationLower)
      );
    }
    
    // Filter by space type
    if (params.spaceType) {
      const spaceType = String(params.spaceType);
      filteredSpaces = filteredSpaces.filter(space => 
        space.productType === spaceType
      );
    }
    
    // Filter by capacity
    if (params.capacity) {
      const capacity = Number(params.capacity);
      filteredSpaces = filteredSpaces.filter(space => 
        space.capacity !== undefined && space.capacity >= capacity
      );
    }
    
    // Filter by minimum rating
    if (params.minRating) {
      const minRating = Number(params.minRating);
      filteredSpaces = filteredSpaces.filter(space => 
        space.rating >= minRating
      );
    }
    
    // Filter by date and time availability
    if (params.startDate && (params.startTime || params.endTime)) {
      const requestDate = String(params.startDate);
      const requestStartTime = params.startTime ? String(params.startTime) : '00:00';
      const requestEndTime = params.endTime ? String(params.endTime) : '23:59';
      
      filteredSpaces = filteredSpaces.filter(space => {
        // Find if space is available on the requested date
        const dateAvailability = space.availability?.find(avail => avail.date === requestDate);
        if (!dateAvailability) {
          return false;
        }
        
        // Check if any of the slots cover the requested time range
        const timeAvailable = dateAvailability.slots.some((slot: { startTime: string; endTime: string }) => {
          // Time comparison - the space's available time window must contain the requested time window
          // Convert times to comparable values (minutes since midnight)
          const getMinutes = (timeStr: string): number => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
          };
          
          const slotStart = getMinutes(slot.startTime);
          const slotEnd = getMinutes(slot.endTime);
          const reqStart = getMinutes(requestStartTime);
          const reqEnd = getMinutes(requestEndTime);
          
          // The slot is valid if it starts at or before the requested start time
          // AND ends at or after the requested end time
          return slotStart <= reqStart && slotEnd >= reqEnd;
        });
        
        return timeAvailable;
      });
    }
    
    // Filter by facilities/features
    if (params.facilities && Array.isArray(params.facilities) && params.facilities.length > 0) {
      const facilities = params.facilities as string[];
      filteredSpaces = filteredSpaces.filter(space => 
        facilities.every((facility: string) => {
          // Case-insensitive matching and partial matching for features
          const facilityLower = facility.toLowerCase();
          return space.features.some(feat => 
            feat.toLowerCase().includes(facilityLower) || 
            facilityLower.includes(feat.toLowerCase())
          );
        })
      );
    }
    
    // Filter by price range
    if (params.minPrice || params.maxPrice) {
      const minPrice = params.minPrice ? Number(params.minPrice) : 0;
      const maxPrice = params.maxPrice ? Number(params.maxPrice) : Infinity;
      filteredSpaces = filteredSpaces.filter(space => {
        // Get relevant price based on product type
        let price = 0;
        if (space.productType === 'meeting-room' && space.pricing.hourly) {
          price = space.pricing.hourly;
        } else if (space.productType === 'hot-desk' && space.pricing.daily) {
          price = space.pricing.daily;
        } else if (space.productType === 'dedicated-desk' && space.pricing.monthly) {
          price = space.pricing.monthly / 30; // Approximate daily rate
        }

        return price >= minPrice && price <= maxPrice;
      });
    }
    
    return filteredSpaces;
  }
  
  // Keep these methods for backward compatibility, they now use the unified getSpaces method
  static async getSpaceDetails(spaceId: number, spaceType?: string): Promise<{
    success: boolean;
    message: string;
    space: SpaceDto;
    recentReviews?: any[];
    amenities?: any[];
    nearbySpaces?: any[];
  }> {
    const result = await this.getSpaces({ id: spaceId, type: spaceType });
    return {
      success: result.success,
      message: result.message,
      space: result.space || {} as SpaceDto,
      recentReviews: result.recentReviews || [],
      amenities: result.amenities || [],
      nearbySpaces: result.nearbySpaces || []
    };
  }

  /**
   * Get detailed information for a specific product/space by ID
   * Backend expects:
   *   { "id": 2 }
   * Backend returns:
   *   { 
   *     "status_code": 200, 
   *     "message": "Product retrieved successfully", 
   *     "data": { ...product details... }
   *   }
   * Frontend maps: Transforms to SpaceDto with additional details
   */
  static async getProductById(productId: number): Promise<{
    success: boolean;
    message: string;
    space?: SpaceDto;
    recentReviews?: any[];
    amenities?: any[];
    nearbySpaces?: any[];
  }> {
    try {
      console.log(`🔍 Getting product details for ID: ${productId}`);
      
      const response = await fetch(`${this.BASE_URL}/product/get-product-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Product details API response:', data);

      if (data.status_code === 200 && data.data) {
        // Transform the single product using our existing transformation method
        const transformedSpace = this.transformApiSpaceToSpaceDto(data.data);
        
        // Transform recent_ratings to reviews format
        const recentReviews = (data.data.recent_ratings || []).map((rating: any, index: number) => ({
          id: index + 1,
          name: rating.user_name || 'Anonymous User',
          rating: Number(rating.value) || 0,
          comment: rating.review_description || '',
          avatar: rating.user_avatar || `https://images.unsplash.com/photo-${1494790108755 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
        }));

        // Generate mock amenities (since not provided in API response)
        const amenities = [
          { id: 1, name: 'High-Speed WiFi', icon: 'wifi', price: 0 },
          { id: 2, name: '4K Display', icon: 'display', price: 10 },
          { id: 3, name: 'Video Conferencing', icon: 'video', price: 15 },
          { id: 4, name: 'Coffee Service', icon: 'coffee', price: 5 },
          { id: 5, name: 'Whiteboard', icon: 'whiteboard', price: 0 },
          { id: 6, name: 'Printing Services', icon: 'print', price: 5 }
        ];

        return {
          success: true,
          message: data.message || 'Product details retrieved successfully',
          space: transformedSpace,
          recentReviews: recentReviews,
          amenities: amenities,
          nearbySpaces: [] // Can be populated later if needed
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to retrieve product details',
        };
      }
    } catch (error) {
      console.error('💥 Error getting product details:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch product details',
      };
    }
  }

  /**
   * Transform a single API space object to SpaceDto format
   * This is a helper method extracted from transformApiSpacesToSpaceDto for single space transformation
   */
  private static transformApiSpaceToSpaceDto(apiSpace: any): SpaceDto {
    console.log('🔄 Transforming single API space to SpaceDto format');
    console.log(`🏢 Transforming space:`, apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`);
    
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
        console.log(`💰 Calculated daily price for meeting room: ${pricing.daily} (${pricing.hourly} * 8 hours)`);
      }
      
      console.log(`💰 Transformed pricing for ${apiSpace.name}:`, pricing);
    }

    // Transform availability format
    let availability: any[] = [];
    if (apiSpace.availability && Array.isArray(apiSpace.availability)) {
      availability = apiSpace.availability.map((avail: any) => ({
        date: avail.date ? avail.date.split('T')[0] : '', // Extract date part
        slots: avail.slots || []
      }));
      console.log(`📅 Transformed availability for ${apiSpace.name}:`, availability);
    }

    // Map product type to our internal format and get display name
    let productType = '';
    let displayProductType = '';
    switch (apiSpace.productType) {
      case 'MeetingRoom':
      case 'MeetingRooms': // Handle both singular and plural
        productType = 'meeting-room';
        displayProductType = 'Meeting Room';
        break;
      case 'HotDesk':
      case 'HotDesks': // Handle both singular and plural
        productType = 'hot-desk';
        displayProductType = 'Hot Desk';
        break;
      case 'DedicatedDesk':
      case 'DedicatedDesks': // Handle both singular and plural
        productType = 'dedicated-desk';
        displayProductType = 'Dedicated Desk';
        break;
      default:
        // Fallback mapping for unknown types
        const lowerType = (apiSpace.productType || '').toLowerCase();
        if (lowerType.includes('meeting')) {
          productType = 'meeting-room';
          displayProductType = 'Meeting Room';
        } else if (lowerType.includes('hot') || lowerType.includes('desk')) {
          productType = 'hot-desk';
          displayProductType = 'Hot Desk';
        } else if (lowerType.includes('dedicated')) {
          productType = 'dedicated-desk';
          displayProductType = 'Dedicated Desk';
        } else {
          productType = lowerType.replace(/\s+/g, '-');
          displayProductType = apiSpace.productType || '';
        }
    }
    console.log(`🏷️ Mapped product type: ${apiSpace.productType} -> ${productType} (Display: ${displayProductType})`);

    // Handle features and additional_facilities separately (DO NOT mix them!)
    let features: string[] = [];
    let additional_facilities: string[] = [];
    
    // ONLY use the features field for features - DO NOT add facilities to features
    if (Array.isArray(apiSpace.features)) {
      features = [...apiSpace.features];
    }
    
    // ONLY use the additional_facilities field for additional facilities
    if (Array.isArray(apiSpace.additional_facilities)) {
      additional_facilities = [...apiSpace.additional_facilities];
    }
    
    // Remove duplicates in each array
    features = [...new Set(features)];
    additional_facilities = [...new Set(additional_facilities)];
    
    console.log(`🏗️ Features for ${apiSpace.name}:`, features);
    console.log(`🏗️ Additional facilities for ${apiSpace.name}:`, additional_facilities);

    const transformedSpace: SpaceDto = {
      id: apiSpace.id,
      name: apiSpace.name || apiSpace.product_description || `Space ${apiSpace.id}`,
      description: apiSpace.discription || apiSpace.product_description || '',
      location: apiSpace.locationName || apiSpace.location || apiSpace.address || '', // Use locationName first, then fallbacks
      address: apiSpace.address || '',
      productType: productType,
      displayProductType: displayProductType, // Add display name for product type
      images: Array.isArray(apiSpace.images) ? apiSpace.images : [],
      rating: Number(apiSpace.rating) || 0, // Ensure rating is a number
      reviews: Number(apiSpace.reviews) || Number(apiSpace.review_count) || 0, // Handle different review field names
      pricing: pricing,
      capacity: Number(apiSpace.capacity) || 0,
      maxCapacity: Number(apiSpace.maxCapacity) || Number(apiSpace.capacity) || 0,
      features: features, // Use the processed features array (only from response.features)
      additional_facilities: additional_facilities, // Use the processed additional_facilities array (only from response.additional_facilities)
      isAvailable: true, // Assume available if returned by search
      availability: availability,
      locationUrl: apiSpace.locationUrl || apiSpace.location_url || '', // Add location URL for map integration
      recentReviews: Array.isArray(apiSpace.recentReviews) ? apiSpace.recentReviews : [], // Add recent reviews
      recent_ratings: Array.isArray(apiSpace.recent_ratings) ? apiSpace.recent_ratings : [] // Add recent ratings (backend format)
    };

    console.log(`✅ Successfully transformed space: ${transformedSpace.name}`);
    return transformedSpace;
  }
  static async getBookedTimeSlots(productId: number, bookingDate: string): Promise<Array<{ startTime: string; endTime: string }>> {
    try {
      const response = await fetch(`http://192.168.2.10:9011/api/booking/get-booked-time-durations`, {
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
   * Search for spaces with various filter criteria.
   * This method is deprecated and will be removed in the future.
   * Use the unified getSpaces method instead.
   * 
   * @deprecated Use getSpaces() instead which supports both search and details retrieval
   */
  static async searchSpaces(searchParams: {
    location_id?: number; // Changed from locationId to location_id
    type?: string; // Changed from spaceType to type
    date?: string;
    start_time?: string; // Changed from startTime to start_time
    end_time?: string; // Changed from endTime to end_time
    capacity?: number | null;
    min_daily_rate?: number; // Changed from minPrice to min_daily_rate
    max_daily_rate?: number; // Changed from maxPrice to max_daily_rate
    facilities?: string[];
    min_rating?: number; // Changed from minRating to min_rating
  }): Promise<{
    success: boolean;
    message: string;
    spaces: SpaceDto[];
    totalCount?: number;
  }> {
    console.warn('The searchSpaces method is deprecated. Please use getSpaces() instead.');
    
    try {
      // Simply forward to the unified getSpaces method
      const result = await this.getSpaces(searchParams);
      
      return {
        success: result.success,
        message: result.message,
        spaces: result.spaces || [],
        totalCount: result.totalCount
      };
    } catch (error) {
      console.error('Error searching spaces:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while searching spaces',
        spaces: []
      };
    }
  }
  
  /**
   * Get product details by ID.
   * Backend API: POST /product/get-product-by-id
   * Request: {"id": productId}
   * Response: {
   *   "status_code": 200,
   *   "message": "Product retrieved successfully",
   *   "data": {
   *     "id": 1,
   *     "name": "Premium Meeting Room",
   *     "productType": "MeetingRoom",
   *     "description": "A modern meeting room...",
   *     "location": "Kandy Lakeside",
   *     "address": "123 Kandy Street, Kandy",
   *     "capacity": 12,
   *     "pricing": {
   *       "hourly": 85,
   *       "daily": 650,
   *       "weekly": 4200,
   *       "monthly": 16000
   *     },
   *     "rating": 4.5,
   *     "reviews": 45,
   *     "images": ["url1", "url2"],
   *     "features": ["WiFi", "Projector", "Air Conditioning"],
   *     "recent_ratings": [...],
   *     "availability": {...},
   *     "operation_hours": {...}
   *   }
   * }
   */
  async getSpaceDetailsById(productId: number): Promise<{
    success: boolean;
    message: string;
    data?: SpaceDto;
  }> {
    try {
      const response = await fetch(`${NetworkManager.BASE_URL}/product/get-product-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status_code === 200 && data.data) {
        // Transform the API response to match our SpaceDto interface
        // Use the existing transformation method for consistency
        const transformedSpaces = NetworkManager.transformApiSpacesToSpaceDto([data.data]);
        const transformedSpace = transformedSpaces[0];
        
        return {
          success: true,
          message: data.message || 'Product retrieved successfully',
          data: transformedSpace
        };
      } else {
        return {
          success: false,
          message: data.message || 'Product not found'
        };
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while fetching product details'
      };
    }
  }
}

