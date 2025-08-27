// src/api/networkManager.ts
// NetworkManager for Home Page APIs (do not import or use in Home.vue yet)
// Each method simulates a real API call and includes backend response format as comments.

import type { SpaceDto, AdvertisementDto, TestimonialDto } from '../dto/response';
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
   * Frontend maps: Extracts location names from response.data
   */
  static async getLocations(): Promise<string[]> {
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
        // Extract just the location names from the response
        return data.data.map((location: { name: string }) => location.name);
      } else {
        throw new Error(data.message || 'Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
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
   * Can be used for both search results and space details:
   * 
   * For search results:
   *   POST /spaces/search
   *   Body: { location: "Kandy", spaceType: "meeting-room", ... }
   * 
   * For space details:
   *   GET /spaces/{id}
   * 
   * Backend returns for search:
   *   { 
   *     "success": true, 
   *     "status_code": 200,
   *     "message": "Found X spaces matching your criteria",
   *     "spaces": [ ...SpaceDto ],
   *     "totalCount": 10
   *   }
   * 
   * Backend returns for details:
   *   { 
   *     "success": true, 
   *     "status_code": 200,
   *     "message": "Space details retrieved successfully",
   *     "space": { ...SpaceDto },
   *     "recentReviews": [ ...ReviewDto ],
   *     "amenities": [ { id, name, icon, price } ],
   *     "nearbySpaces": [ ...SpaceDto ]
   *   }
   * 
   * Frontend maps appropriately based on which method is called
   */
  static async getSpaces(params: {
    id?: number;
    location?: string;
    spaceType?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    capacity?: number | null;
    priceRange?: { min: number; max: number };
    facilities?: string[];
    minRating?: string | number;
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
        // Real API implementation
        // const response = await fetch(`${this.BASE_URL}/spaces/${params.id}`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        // 
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // 
        // const data = await response.json();
        // 
        // return {
        //   success: data.success || data.status_code === 200,
        //   message: data.message || '',
        //   space: data.space,
        //   recentReviews: data.recentReviews || [],
        //   amenities: data.amenities || [],
        //   nearbySpaces: data.nearbySpaces || []
        // };

        // Mock implementation until backend is ready
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

        // Use the same mock spaces from the search function
        const mockSpaces: SpaceDto[] = [
          {
            id: 1,
            name: 'Executive Meeting Room',
            description: 'Professional meeting space with modern amenities for your business needs',
            location: 'Kandy Lakeside',
            address: '123 Kandy Street, Kandy',
            productType: 'meeting-room',
            images: [
              'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1596723404722-23619249fa69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            reviews: 124,
            pricing: {
              hourly: 25,
              daily: 180,
              monthly: 3500,
              annual: 36000
            },
            capacity: 12,
            maxCapacity: 15,
            features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
            ]
          },
          {
            id: 2,
            name: 'Hot Desk Premium',
            description: 'Flexible workspace for professionals on the go',
            location: 'Colombo Central',
            address: '45 Main Street, Colombo',
            productType: 'hot-desk',
            images: [
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.5,
            reviews: 89,
            pricing: {
              daily: 35,
              monthly: 600,
              annual: 6000
            },
            capacity: 1,
            maxCapacity: 1,
            features: ['wifi', 'coffee', 'printing', 'locker'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
            ]
          },
          {
            id: 3,
            name: 'Dedicated Office Space',
            description: 'Private office space with 24/7 access',
            location: 'Galle Fort',
            address: '78 Fort Road, Galle',
            productType: 'dedicated-desk',
            images: [
              'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            reviews: 45,
            pricing: {
              monthly: 350,
              annual: 3800
            },
            capacity: 1,
            maxCapacity: 1,
            features: ['wifi', 'coffee', 'printing', 'parking', '24-7-access', 'meeting-room-credits'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '00:00', endTime: '23:59' }] },
              { date: '2025-08-28', slots: [{ startTime: '00:00', endTime: '23:59' }] },
              { date: '2025-08-29', slots: [{ startTime: '00:00', endTime: '23:59' }] }
            ]
          }
        ];

        const spaceData = mockSpaces.find(space => space.id === params.id);

        if (!spaceData) {
          return {
            success: false,
            message: 'Space not found',
            space: {} as SpaceDto
          };
        }

        // If spaceType is provided, override the productType
        if (params.spaceType) {
          spaceData.productType = params.spaceType;
        }

        // Generate reviews based on space ID for variety
        const reviewsDatabase: Record<number, any[]> = {
          1: [
            {
              id: 1,
              name: 'Sarah Chen',
              rating: 5,
              comment: 'Perfect for our team meetings. The Innovation Hub has everything we need for productive sessions.',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            },
            {
              id: 2,
              name: 'Michael Ross',
              rating: 5,
              comment: 'Great location and excellent technology setup. The 4K display made our presentation shine.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            }
          ],
          2: [
            {
              id: 3,
              name: 'Emma Wilson',
              rating: 5,
              comment: 'Love the natural light and creative atmosphere. Perfect for my design work.',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            },
            {
              id: 4,
              name: 'David Kim',
              rating: 4,
              comment: 'Great community vibe and the standing desks are a nice touch.',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            }
          ],
          3: [
            {
              id: 5,
              name: 'Jennifer Martinez',
              rating: 5,
              comment: 'Impressive boardroom that made a great impression on our clients. Professional setup.',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            },
            {
              id: 6,
              name: 'Robert Taylor',
              rating: 5,
              comment: 'Executive-level quality with excellent video conferencing capabilities.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
            }
          ]
        };

        const amenities = [
          { id: 1, name: 'High-Speed WiFi', icon: 'wifi', price: 0 },
          { id: 2, name: '4K Display', icon: 'display', price: 10 },
          { id: 3, name: 'Video Conferencing', icon: 'video', price: 15 },
          { id: 4, name: 'Coffee Service', icon: 'coffee', price: 5 },
          { id: 5, name: 'Whiteboard', icon: 'whiteboard', price: 0 },
          { id: 6, name: 'Printing Services', icon: 'print', price: 5 }
        ];

        // Generate a few nearby spaces (excluding the current one)
        const nearbySpaces = mockSpaces
          .filter(space => space.id !== params.id)
          .map(space => ({
            id: space.id,
            name: space.name,
            location: space.location,
            productType: space.productType,
            images: [space.images[0]],
            pricing: space.pricing
          }));

        const reviews = reviewsDatabase[params.id] || reviewsDatabase[1];

        return {
          success: true,
          message: 'Space details retrieved successfully',
          space: spaceData,
          recentReviews: reviews,
          amenities: amenities,
          nearbySpaces: nearbySpaces
        };
      } 
      // Otherwise, we're searching for spaces based on criteria
      else {
        // Prepare the request body by cleaning the parameters
        const cleanParams = { ...params };
        
        // Remove null, undefined and empty values
        Object.keys(cleanParams).forEach(key => {
          const value = cleanParams[key as keyof typeof cleanParams];
          if (
            value === null || 
            value === undefined || 
            (typeof value === 'string' && value === '') ||
            (Array.isArray(value) && value.length === 0)
          ) {
            delete cleanParams[key as keyof typeof cleanParams];
          }
        });
        
        console.log('Searching spaces with params:', cleanParams);
        
        // Real API implementation using POST with JSON body
        // const response = await fetch(`${this.BASE_URL}/spaces/search`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(cleanParams)
        // });
        //
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        //
        // const data = await response.json();
        //
        // return {
        //   success: data.success || data.status_code === 200,
        //   message: data.message || '',
        //   spaces: data.spaces || [],
        //   totalCount: data.totalCount || (data.spaces ? data.spaces.length : 0)
        // };
        
        // Mock implementation until backend is ready
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Use the existing mock implementation from searchSpaces
        // Generate mock spaces based on the search parameters
        const mockSpaces: SpaceDto[] = [
          {
            id: 1,
            name: 'Executive Meeting Room',
            description: 'Professional meeting space with modern amenities for your business needs',
            location: 'Kandy Lakeside',
            address: '123 Kandy Street, Kandy',
            productType: 'meeting-room',
            images: [
              'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            reviews: 124,
            pricing: {
              hourly: 25,
              daily: 180
            },
            capacity: 12,
            maxCapacity: 15,
            features: ['wifi', 'High-Speed WiFi', 'projector', '4K Display', 'whiteboard', 'coffee', 'printing'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
            ]
          },
          {
            id: 2,
            name: 'Hot Desk Premium',
            description: 'Flexible workspace for professionals on the go',
            location: 'Colombo Central',
            address: '45 Main Street, Colombo',
            productType: 'hot-desk',
            images: [
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.5,
            reviews: 89,
            pricing: {
              daily: 35
            },
            capacity: 1,
            maxCapacity: 1,
            features: ['wifi', 'coffee', 'printing', 'locker'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-28', slots: [{ startTime: '09:00', endTime: '17:00' }] },
              { date: '2025-08-29', slots: [{ startTime: '09:00', endTime: '17:00' }] }
            ]
          },
          {
            id: 3,
            name: 'Dedicated Office Space',
            description: 'Private office space with 24/7 access',
            location: 'Galle Fort',
            address: '78 Fort Road, Galle',
            productType: 'dedicated-desk',
            images: [
              'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            reviews: 45,
            pricing: {
              monthly: 350
            },
            capacity: 1,
            maxCapacity: 1,
            features: ['wifi', 'coffee', 'printing', 'parking', '24-7-access', 'meeting-room-credits'],
            isAvailable: true,
            availability: [
              { date: '2025-08-27', slots: [{ startTime: '00:00', endTime: '23:59' }] },
              { date: '2025-08-28', slots: [{ startTime: '00:00', endTime: '23:59' }] },
              { date: '2025-08-29', slots: [{ startTime: '00:00', endTime: '23:59' }] }
            ]
          }
        ];
        
        // Apply filters similar to the original searchSpaces method
        let filteredSpaces = this.applyFilters(mockSpaces, params);
        
        return {
          success: true,
          message: `Found ${filteredSpaces.length} spaces matching your criteria`,
          spaces: filteredSpaces,
          totalCount: filteredSpaces.length
        };
      }
    } catch (error) {
      console.error('Error with spaces API:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch spaces data',
        spaces: [],
        totalCount: 0
      };
    }
  }
  
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
    if (params.priceRange && typeof params.priceRange === 'object') {
      const { min, max } = params.priceRange as { min: number; max: number };
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
        
        return price >= min && price <= max;
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
    const result = await this.getSpaces({ id: spaceId, spaceType });
    return {
      success: result.success,
      message: result.message,
      space: result.space || {} as SpaceDto,
      recentReviews: result.recentReviews || [],
      amenities: result.amenities || [],
      nearbySpaces: result.nearbySpaces || []
    };
  }

  static async getBookedTimeSlots(spaceId: number, date: string): Promise<Array<{ startTime: string; endTime: string }>> {
    try {
      // Mock data for now - replace with real API call when backend is ready
      // const response = await fetch(`${this.BASE_URL}/spaces/${spaceId}/booked-slots`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ date })
      // });
      // const data = await response.json();
      // return data.data.bookedSlots;

      // Mock booked time slots for testing
      const mockBookedSlots = [
        { startTime: '09:00', endTime: '10:30' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '14:00', endTime: '16:00' },
        { startTime: '17:30', endTime: '18:30' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockBookedSlots;
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
    location?: string;
    spaceType?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    capacity?: number | null;
    priceRange?: { min: number; max: number };
    facilities?: string[];
    minRating?: string | number;
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
}
