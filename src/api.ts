// src/api.ts
import {
  SignInRequestDto,
  SignUpRequestDto,
  SearchSpacesRequestDto,
  CreateBookingRequestDto,
  CreateSubscriptionRequestDto,
  ProcessPaymentRequestDto,
  UpdateProfileRequestDto,
  ChangePasswordRequestDto,
  NewsletterSubscriptionRequestDto,
  AddPaymentMethodRequestDto,
  UpdateBillingAddressRequestDto
} from './dto/request';

import {
  BaseResponseDto,
  UserDto,
  AuthResponseDto,
  SpaceDto,
  SearchSpacesResponseDto,
  SpaceDetailsResponseDto,
  ReviewDto,
  AvailabilityDto,
  BookingDto,
  CreateBookingResponseDto,
  BookingListResponseDto,
  PaymentDto,
  ProcessPaymentResponseDto,
  PaymentMethodDto,
  PaymentMethodsResponseDto,
  TransactionDto,
  TransactionHistoryResponseDto,
  AdvertisementDto,
  TestimonialDto,
  HomePageDataResponseDto,
  NewsletterResponseDto
} from './dto/response';

import { SpaceType, getSpaceTypeString, getSpaceTypeEnum } from './types/enums';

// Real API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.workspace.com/v1';
const API_TIMEOUT = 10000;

// Real API Helper Functions (commented out for now - using mock implementation)
/*
const makeApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
*/

// Simulate API delay for demonstration purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate mock availability
const generateMockAvailability = (days: number = 7) => {
  const availability = [];
  let currentDate = new Date();
  for (let i = 0; i < days; i++) {
    const dateString = currentDate.toISOString().split('T')[0];
    const isAvailable = Math.random() > 0.2; // 80% chance of being available
    let availableTimes: string[] = [];

    if (isAvailable) {
      // Generate some random time slots
      const startHour = 9;
      const endHour = 17;
      for (let hour = startHour; hour <= endHour; hour++) {
        if (Math.random() > 0.3) { // 70% chance of a time slot being available
          availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      }
    }
    availability.push({ date: dateString, available: isAvailable, availableTimes });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return availability;
};

// Authentication API
export class AuthAPI {
  // Real API call (commented out for now)
  /*
  static async signIn(request: SignInRequestDto): Promise<AuthResponseDto> {
    return makeApiRequest<AuthResponseDto>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: request.email,
        password: request.password,
        rememberMe: request.rememberMe
      })
    });
  }
  */

  // Mock implementation
  static async signIn(request: SignInRequestDto): Promise<AuthResponseDto> {
    try {
      await delay(1000);

      // Mock successful response
      const mockUser = new UserDto({
        id: Date.now(),
        firstName: request.email.split('@')[0] || 'Demo',
        lastName: 'User',
        email: request.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      });

      return new AuthResponseDto(
        true,
        'Successfully signed in',
        mockUser,
        'mock-jwt-token'
      );
    } catch (error) {
      console.error('Sign in error:', error);
      return new AuthResponseDto(false, 'Failed to sign in. Please check your credentials and try again.');
    }
  }

  // Real API call (commented out for now)
  /*
  static async signUp(request: SignUpRequestDto): Promise<AuthResponseDto> {
    return makeApiRequest<AuthResponseDto>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        password: request.password,
        phone: request.phone,
        acceptTerms: request.acceptTerms,
        subscribeNewsletter: request.subscribeNewsletter
      })
    });
  }
  */

  // Mock implementation
  static async signUp(request: SignUpRequestDto): Promise<AuthResponseDto> {
    try {
      await delay(1000);

      if (request.password !== request.confirmPassword) {
        return new AuthResponseDto(false, 'Passwords do not match');
      }

      const mockUser = new UserDto({
        id: Date.now(),
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      });

      return new AuthResponseDto(
        true,
        'Account created successfully',
        mockUser,
        'mock-jwt-token'
      );
    } catch (error) {
      console.error('Sign up error:', error);
      return new AuthResponseDto(false, 'Failed to create account. Please try again.');
    }
  }
}

// Spaces API
export class SpacesAPI {
  // Real API call (commented out for now)
  /*
  static async searchSpaces(request: SearchSpacesRequestDto): Promise<SearchSpacesResponseDto> {
    const queryParams = new URLSearchParams({
      location: request.location || '',
      spaceType: request.spaceType || '',
      capacity: request.capacity?.toString() || '',
      priceMin: request.priceMin?.toString() || '',
      priceMax: request.priceMax?.toString() || '',
      rating: request.rating?.toString() || '',
      page: request.page?.toString() || '1',
      limit: request.limit?.toString() || '10'
    });

    return makeApiRequest<SearchSpacesResponseDto>(`/spaces/search?${queryParams}`);
  }
  */

  // Mock implementation
  static async searchSpaces(request: SearchSpacesRequestDto): Promise<SearchSpacesResponseDto> {
    try {
      await delay(800);

      const mockSpaces = [
        new SpaceDto({
          id: 1,
          name: 'The Innovation Hub',
          location: 'Downtown, San Francisco',
          address: '123 Business District, San Francisco, CA 94105',
          rating: 4.9,
          reviews: 127,
          description: 'A premium workspace designed for innovation and collaboration.',
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['High-Speed WiFi', '4K Display', 'Coffee Service', 'Security Access'],
          pricing: { hourly: 85, daily: 35, monthly: 450, annual: 4500 },
          capacity: 12,
          isAvailable: true,
          productType: request.spaceType || 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 2,
          name: 'Creative Commons',
          location: 'SOMA, San Francisco',
          address: '456 Creative Street, San Francisco, CA 94103',
          rating: 4.8,
          reviews: 89,
          description: 'Open workspace perfect for creative professionals.',
          images: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Natural Light', 'Standing Desks', 'Community Events', 'Printing'],
          pricing: { daily: 40, monthly: 500, annual: 5200 },
          isAvailable: true,
          productType: 'hot-desk',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 3,
          name: 'Executive Boardroom',
          location: 'Financial District, San Francisco',
          address: '789 Executive Plaza, San Francisco, CA 94111',
          rating: 4.9,
          reviews: 156,
          description: 'Premium executive boardroom for high-level meetings.',
          images: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['4K Display', 'Video Conferencing', 'Executive Seating'],
          pricing: { hourly: 120 },
          capacity: 16,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 4,
          name: 'Startup Incubator Space',
          location: 'Mission Bay, San Francisco',
          address: '321 Innovation Drive, San Francisco, CA 94158',
          rating: 4.7,
          reviews: 203,
          description: 'Collaborative workspace designed for startups and growing teams.',
          images: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Open Layout', 'Meeting Pods', '24/7 Access'],
          pricing: { monthly: 2500, annual: 27000 },
          maxCapacity: 50,
          isAvailable: true,
          productType: 'coworking-space',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 5,
          name: 'Skyline Boardroom',
          location: 'Downtown, SF',
          address: '100 Main St, San Francisco, CA 94105',
          rating: 4.8,
          reviews: 42,
          description: 'A modern boardroom with panoramic city views.',
          images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Panoramic View', 'Smart TV', 'Coffee Machine'],
          pricing: { hourly: 110 },
          capacity: 10,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 6,
          name: 'Tech Valley Workspace',
          location: 'Palo Alto, CA',
          address: '456 Tech Avenue, Palo Alto, CA 94305',
          rating: 4.9,
          reviews: 78,
          description: 'A tech-focused workspace with cutting-edge amenities.',
          images: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['High-Speed Internet', 'Video Conferencing', 'Ergonomic Chairs'],
          pricing: { hourly: 95, daily: 400, monthly: 3800 },
          capacity: 20,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 7,
          name: 'Tech Valley Workspace',
          location: 'Palo Alto, CA',
          address: '456 Tech Avenue, Palo Alto, CA 94305',
          rating: 4.9,
          reviews: 78,
          description: 'A tech-focused workspace with cutting-edge amenities.',
          images: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['High-Speed Internet', 'Video Conferencing', 'Ergonomic Chairs'],
          pricing: { hourly: 95, daily: 400, monthly: 3800 },
          capacity: 20,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 8,
          name: 'Downtown Executive Hub',
          location: 'New York, NY',
          address: '200 Madison Ave, New York, NY 10016',
          rating: 4.8,
          reviews: 102,
          description: 'Premium meeting space with panoramic city views and top-tier services.',
          images: [
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['24/7 Access', 'Private Lounge', 'Smart Board'],
          pricing: { hourly: 120, daily: 500, monthly: 4500 },
          capacity: 15,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),

        new SpaceDto({
          id: 9,
          name: 'Creative Loft Boardroom',
          location: 'Austin, TX',
          address: '88 Congress Ave, Austin, TX 78701',
          rating: 4.7,
          reviews: 64,
          description: 'A modern, art-inspired meeting room ideal for brainstorming sessions.',
          images: [
            'https://images.unsplash.com/photo-1590490360182-663ea36f84b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Whiteboards', 'Natural Lighting', 'Coffee & Snacks'],
          pricing: { hourly: 85, daily: 350, monthly: 3200 },
          capacity: 12,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),

        new SpaceDto({
          id: 10,
          name: 'Harbor View Conference Hall',
          location: 'San Francisco, CA',
          address: '500 Embarcadero, San Francisco, CA 94107',
          rating: 4.9,
          reviews: 91,
          description: 'Spacious waterfront meeting venue with state-of-the-art facilities.',
          images: [
            'https://images.unsplash.com/photo-1573164573938-c9b3fd37f3a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['HD Projector', 'Catering Services', 'Sound System'],
          pricing: { hourly: 110, daily: 450, monthly: 4100 },
          capacity: 25,
          isAvailable: false,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),

        new SpaceDto({
          id: 11,
          name: 'Greenlight Innovation Room',
          location: 'Seattle, WA',
          address: '600 5th Ave, Seattle, WA 98104',
          rating: 4.6,
          reviews: 55,
          description: 'Eco-friendly meeting space with greenery and fresh air circulation.',
          images: [
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Sustainable Materials', 'Natural Light', 'High-Speed Wi-Fi'],
          pricing: { hourly: 75, daily: 300, monthly: 2800 },
          capacity: 10,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),

        new SpaceDto({
          id: 12,
          name: 'Global Connect Conference Suite',
          location: 'Chicago, IL',
          address: '150 Wacker Dr, Chicago, IL 60606',
          rating: 4.8,
          reviews: 83,
          description: 'Fully equipped for international business calls and hybrid meetings.',
          images: [
            'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Multi-Language Support', '4K Video Conferencing', 'Secure Wi-Fi'],
          pricing: { hourly: 100, daily: 420, monthly: 3900 },
          capacity: 18,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),


      ];

      // Filter spaces based on request
      let filteredSpaces = mockSpaces;
      if (request.location) {
        filteredSpaces = filteredSpaces.filter(space =>
          space.location.toLowerCase().includes(request.location!.toLowerCase())
        );
      }
      if (request.spaceType) {
        filteredSpaces = filteredSpaces.filter(space => space.productType === request.spaceType);
      }

      return new SearchSpacesResponseDto(
        true,
        filteredSpaces,
        filteredSpaces.length,
        {
          location: request.location,
          spaceType: request.spaceType,
          priceRange: request.priceRange
        }
      );
    } catch (error) {
      console.error('Search spaces error:', error);
      return new SearchSpacesResponseDto(false, [], 0, {}, 'Failed to search spaces');
    }
  }

  // Real API call (commented out for now)
  /*
  static async getSpaceDetails(spaceId: number, productType?: string): Promise<SpaceDetailsResponseDto> {
    return makeApiRequest<SpaceDetailsResponseDto>(`/spaces/${spaceId}?productType=${productType || ''}`);
  }
  */

  // Mock implementation
  static async getSpaceDetails(spaceId: number, spaceType?: SpaceType): Promise<SpaceDetailsResponseDto> {
    try {
      await delay(600);

      // Create a comprehensive space database with SpaceType enums
      const spaceDatabase: Record<number, any> = {
        1: {
          id: 1,
          name: 'The Innovation Hub',
          location: 'Downtown, San Francisco',
          address: '123 Business District, San Francisco, CA 94105',
          rating: 4.9,
          reviews: 127,
          description: 'A premium workspace designed for innovation and collaboration. Perfect for team meetings, presentations, and creative sessions.',
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['High-Speed WiFi', '4K Display', 'Coffee Service', 'Security Access', 'Video Conferencing', 'Whiteboard'],
          pricing: { hourly: 85, daily: 35, monthly: 450, annual: 4500 },
          capacity: 12,
          isAvailable: true,
          spaceType: SpaceType.MEETING_ROOM,
          productType: getSpaceTypeString(SpaceType.MEETING_ROOM),
          availability: generateMockAvailability()
        },
        2: {
          id: 2,
          name: 'Creative Commons',
          location: 'SOMA, San Francisco',
          address: '456 Creative Street, San Francisco, CA 94103',
          rating: 4.8,
          reviews: 89,
          description: 'Open workspace perfect for creative professionals. Bright, airy environment with natural light and modern amenities.',
          images: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Natural Light', 'Standing Desks', 'Community Events', 'Printing', 'High-Speed WiFi', 'Kitchen Access'],
          pricing: { daily: 40, monthly: 500, annual: 5200 },
          isAvailable: true,
          spaceType: SpaceType.HOT_DESK,
          productType: getSpaceTypeString(SpaceType.HOT_DESK),
          availability: generateMockAvailability()
        },
        3: {
          id: 3,
          name: 'Executive Boardroom',
          location: 'Financial District, San Francisco',
          address: '789 Executive Plaza, San Francisco, CA 94111',
          rating: 4.9,
          reviews: 156,
          description: 'Premium executive boardroom for high-level meetings and presentations. Sophisticated environment with top-tier amenities.',
          images: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['4K Display', 'Video Conferencing', 'High-Speed WiFi', 'Climate Control', 'Executive Seating', 'Catering Service'],
          pricing: { hourly: 120 },
          capacity: 16,
          isAvailable: true,
          spaceType: SpaceType.MEETING_ROOM,
          productType: getSpaceTypeString(SpaceType.MEETING_ROOM),
          availability: generateMockAvailability()
        },
        4: {
          id: 4,
          name: 'Startup Incubator Space',
          location: 'Mission Bay, San Francisco',
          address: '321 Innovation Drive, San Francisco, CA 94158',
          rating: 4.7,
          reviews: 203,
          description: 'Collaborative workspace designed for startups and growing teams. Flexible environment that adapts to your team\'s needs.',
          images: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Open Layout', 'Meeting Pods', 'High-Speed WiFi', 'Community Events', 'Mentorship Programs', '24/7 Access'],
          pricing: { monthly: 2500, annual: 27000 },
          maxCapacity: 50,
          isAvailable: true,
          spaceType: SpaceType.COWORKING_SPACE,
          productType: getSpaceTypeString(SpaceType.COWORKING_SPACE),
          availability: generateMockAvailability()
        }
      };

      // Get the space data based on ID, fallback to space 1 if not found
      const spaceData = spaceDatabase[spaceId] || spaceDatabase[1];

      // Override spaceType if provided
      if (spaceType !== undefined) {
        spaceData.spaceType = spaceType;
        spaceData.productType = getSpaceTypeString(spaceType);
      }

      const mockSpace = new SpaceDto(spaceData);

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
        ],
        4: [
          {
            id: 7,
            name: 'Lisa Anderson',
            rating: 5,
            comment: 'Perfect for our growing startup. The flexible space adapts as we scale.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
          },
          {
            id: 8,
            name: 'James Brown',
            rating: 4,
            comment: 'Great community and networking opportunities. The mentorship programs are valuable.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
          }
        ]
      };

      const reviewsData = reviewsDatabase[spaceId] || reviewsDatabase[1];
      const mockReviews = reviewsData.map(review => new ReviewDto(review));

      return new SpaceDetailsResponseDto(true, mockSpace, mockReviews);
    } catch (error) {
      console.error('Get space details error:', error);
      return new SpaceDetailsResponseDto(false, {} as SpaceDto, [], [], 'Failed to get space details');
    }
  }

  static async getFeaturedSpaces(): Promise<SearchSpacesResponseDto> {
    try {
      await delay(500);

      const featuredSpaces = [
        new SpaceDto({
          id: 1,
          name: 'The Innovation Hub',
          location: 'Downtown, San Francisco',
          address: '123 Business District, San Francisco, CA 94105',
          rating: 4.9,
          reviews: 127,
          description: 'Premium workspace for innovation and collaboration',
          images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['High-Speed WiFi', '4K Display', 'Coffee Service'],
          pricing: { hourly: 85, daily: 35 },
          capacity: 12,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 2,
          name: 'Creative Commons',
          location: 'SOMA, San Francisco',
          address: '456 Creative Street, San Francisco, CA 94103',
          rating: 4.8,
          reviews: 89,
          description: 'Creative workspace for professionals',
          images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['Natural Light', 'Standing Desks'],
          pricing: { daily: 40, monthly: 500 },
          isAvailable: true,
          productType: 'hot-desk',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 3,
          name: 'Executive Boardroom',
          location: 'Financial District, San Francisco',
          address: '789 Executive Plaza, San Francisco, CA 94111',
          rating: 4.9,
          reviews: 156,
          description: 'Premium executive boardroom for high-level meetings',
          images: ['https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['4K Display', 'Video Conferencing'],
          pricing: { hourly: 120 },
          capacity: 16,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        })
      ];

      return new SearchSpacesResponseDto(true, featuredSpaces, featuredSpaces.length);
    } catch (error) {
      console.error('Get featured spaces error:', error);
      return new SearchSpacesResponseDto(false, [], 0, {}, 'Failed to get featured spaces');
    }
  }
}

// Bookings API
export class BookingsAPI {
  static async createBooking(request: CreateBookingRequestDto): Promise<CreateBookingResponseDto> {
    try {
      await delay(1200);

      const bookingId = 'WS' + Date.now().toString().slice(-8);
      const mockBooking = new BookingDto({
        id: bookingId,
        spaceId: request.spaceId,
        spaceName: 'Executive Boardroom',
        productType: request.productType,
        date: request.date,
        startTime: request.startTime,
        duration: request.duration,
        status: 'confirmed',
        totalAmount: 170,
        guestInfo: request.guestInfo
      });

      return new CreateBookingResponseDto(true, mockBooking, true, 'Booking created successfully');
    } catch (error) {
      console.error('Create booking error:', error);
      return new CreateBookingResponseDto(false, {} as BookingDto, false, 'Failed to create booking');
    }
  }

  static async createSubscription(request: CreateSubscriptionRequestDto): Promise<CreateBookingResponseDto> {
    try {
      await delay(1200);

      const bookingId = 'WS' + Date.now().toString().slice(-8);
      const mockBooking = new BookingDto({
        id: bookingId,
        spaceId: request.spaceId,
        spaceName: request.productType === 'hot-desk' ? 'Hot Desk Area' : 'Co-working Space',
        productType: request.productType,
        date: request.startDate,
        packageType: request.packageType,
        status: 'confirmed',
        totalAmount: request.packageType === 'monthly' ? 450 : 4500,
        guestInfo: request.guestInfo
      });

      return new CreateBookingResponseDto(true, mockBooking, true, 'Subscription created successfully');
    } catch (error) {
      console.error('Create subscription error:', error);
      return new CreateBookingResponseDto(false, {} as BookingDto, false, 'Failed to create subscription');
    }
  }

  static async getUserBookings(userId: number): Promise<BookingListResponseDto> {
    try {
      await delay(800);

      const mockBookings = [
        new BookingDto({
          id: 'WS12345678',
          spaceId: 1,
          spaceName: 'Executive Boardroom',
          productType: 'meeting-room',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          duration: '2',
          status: 'confirmed',
          totalAmount: 170,
          guestInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567'
          }
        })
      ];

      return new BookingListResponseDto(true, mockBookings, mockBookings.length);
    } catch (error) {
      console.error('Get user bookings error:', error);
      return new BookingListResponseDto(false, [], 0, 'Failed to get bookings');
    }
  }
  static async getMyBookingsData(userId: number): Promise<MyBookingsResponseDto> {
    try {
      await delay(800);

      const stats: BookingStats = {
        totalBookings: 12,
        upcomingBookings: 3,
        favoriteSpaces: 5,
        totalSpent: 1248,
        pastBookings: 8,
        cancelledBookings: 1
      };

      const bookings: BookingItem[] = [
        {
          id: 'WS12345678',
          status: 'Confirmed',
          date: '2024-12-20',
          duration: 'daily',
          spaceType: 'hot-desk',
          guests: 1,
          totalAmount: 85,
          basePrice: 65,
          extraFees: 0,
          serviceFee: 8,
          taxes: 12,
          hasReview: false,
          space: {
            id: 1,
            name: 'The Innovation Hub',
            location: 'Downtown, San Francisco',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        },
        {
          id: 'WS12345679',
          status: 'Confirmed',
          date: '2024-12-22',
          duration: 'weekly',
          spaceType: 'private-office',
          guests: 4,
          totalAmount: 520,
          basePrice: 450,
          extraFees: 15,
          serviceFee: 47,
          taxes: 8,
          hasReview: false,
          space: {
            id: 2,
            name: 'Creative Commons',
            location: 'SOMA, San Francisco',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        },
        {
          id: 'WS12345680',
          status: 'Confirmed',
          date: '2024-12-25',
          duration: 'daily',
          spaceType: 'meeting-room',
          guests: 8,
          totalAmount: 165,
          basePrice: 120,
          extraFees: 35,
          serviceFee: 16,
          taxes: 4,
          hasReview: false,
          space: {
            id: 3,
            name: 'Tech Valley Workspace',
            location: 'Palo Alto, CA',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        },
        {
          id: 'WS12345677',
          status: 'Completed',
          date: '2024-12-15',
          duration: 'daily',
          spaceType: 'dedicated-desk',
          guests: 1,
          totalAmount: 95,
          basePrice: 75,
          extraFees: 0,
          serviceFee: 8,
          taxes: 12,
          hasReview: true,
          space: {
            id: 4,
            name: 'The Productivity Lab',
            location: 'Mission Bay, SF',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        },
        {
          id: 'WS12345676',
          status: 'Completed',
          date: '2024-12-10',
          duration: 'daily',
          spaceType: 'hot-desk',
          guests: 1,
          totalAmount: 75,
          basePrice: 55,
          extraFees: 0,
          serviceFee: 6,
          taxes: 14,
          hasReview: false,
          space: {
            id: 5,
            name: 'Startup Central',
            location: 'South Beach, SF',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        },
        {
          id: 'WS12345675',
          status: 'Cancelled',
          date: '2024-12-08',
          duration: 'daily',
          spaceType: 'private-office',
          guests: 2,
          totalAmount: 95,
          basePrice: 75,
          extraFees: 5,
          serviceFee: 8,
          taxes: 7,
          hasReview: false,
          space: {
            id: 6,
            name: 'Executive Suites',
            location: 'Financial District, SF',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
        }
      ];

      const favoriteSpaces = [
        {
          id: 1,
          name: 'The Innovation Hub',
          location: 'Downtown, San Francisco',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          spaceType: SpaceType.MEETING_ROOM,
          lastBooked: '2024-12-15'
        },
        {
          id: 2,
          name: 'Creative Commons',
          location: 'SOMA, San Francisco',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          spaceType: SpaceType.HOT_DESK,
          lastBooked: '2024-12-10'
        },
        {
          id: 3,
          name: 'Executive Boardroom',
          location: 'Financial District, San Francisco',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          spaceType: SpaceType.MEETING_ROOM,
          lastBooked: '2024-12-08'
        },
        {
          id: 4,
          name: 'Startup Incubator Space',
          location: 'Mission Bay, San Francisco',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          spaceType: SpaceType.COWORKING_SPACE,
          lastBooked: '2024-12-05'
        },
        {
          id: 5,
          name: 'Tech Valley Workspace',
          location: 'Palo Alto, CA',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          spaceType: SpaceType.MEETING_ROOM,
          lastBooked: '2024-12-01'
        }
      ];

      return new MyBookingsResponseDto(true, stats, bookings, favoriteSpaces);
    } catch (error) {
      console.error('Get my bookings data error:', error);
      return new MyBookingsResponseDto(false, {} as BookingStats, [], [], 'Failed to get bookings data');
    }
  }

  static async changeBookingDate(bookingId: string, newDate: string): Promise<BaseResponseDto> {
    try {
      await delay(1000);
      return new BaseResponseDto(true, 'Booking date changed successfully');
    } catch (error) {
      console.error('Change booking date error:', error);
      return new BaseResponseDto(false, 'Failed to change booking date');
    }
  }

  static async cancelBooking(bookingId: string): Promise<BaseResponseDto> {
    try {
      await delay(800);
      return new BaseResponseDto(true, 'Booking cancelled successfully');
    } catch (error) {
      console.error('Cancel booking error:', error);
      return new BaseResponseDto(false, 'Failed to cancel booking');
    }
  }
}

// MyBookings API interfaces and response classes
export interface BookingStats {
  totalBookings: number
  upcomingBookings: number
  favoriteSpaces: number
  totalSpent: number
  pastBookings: number
  cancelledBookings: number
}

export interface BookingItem {
  id: string
  status: 'Confirmed' | 'Completed' | 'Cancelled'
  date: string
  duration: string
  spaceType: string
  guests: number
  totalAmount: number
  basePrice: number
  extraFees: number
  serviceFee: number
  taxes: number
  hasReview: boolean
  space: {
    id: number
    name: string
    location: string
    rating: number
    image: string
  }
}

export class MyBookingsResponseDto extends BaseResponseDto {
  constructor(
    success: boolean,
    public stats: BookingStats,
    public bookings: BookingItem[],
    public favoriteSpaces: Array<{
      id: number
      name: string
      location: string
      rating: number
      image: string
      spaceType: SpaceType
      lastBooked: string
    }>,
    message?: string
  ) {
    super(success, message)
  }
}

// Payments API
export class PaymentsAPI {
  static async processPayment(request: ProcessPaymentRequestDto): Promise<ProcessPaymentResponseDto> {
    try {
      await delay(1500);

      const mockPayment = new PaymentDto({
        id: 'PAY' + Date.now().toString().slice(-8),
        bookingId: request.bookingId,
        amount: request.amount,
        status: 'completed',
        paymentMethod: request.paymentMethod,
        transactionId: 'TXN' + Date.now().toString().slice(-8)
      });

      const mockBooking = new BookingDto({
        id: request.bookingId,
        spaceId: 1,
        spaceName: 'Executive Boardroom',
        productType: 'meeting-room',
        date: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        totalAmount: request.amount,
        guestInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '(555) 123-4567'
        }
      });

      return new ProcessPaymentResponseDto(true, mockPayment, mockBooking, 'Payment processed successfully');
    } catch (error) {
      console.error('Process payment error:', error);
      return new ProcessPaymentResponseDto(false, {} as PaymentDto, {} as BookingDto, 'Payment processing failed');
    }
  }

  static async getPaymentMethods(userId: number): Promise<PaymentMethodsResponseDto> {
    try {
      await delay(600);

      const mockPaymentMethods = [
        new PaymentMethodDto({
          id: 1,
          brand: 'visa',
          last4: '4242',
          expMonth: '12',
          expYear: '25',
          holderName: 'John Doe',
          isDefault: true
        }),
        new PaymentMethodDto({
          id: 2,
          brand: 'mastercard',
          last4: '5555',
          expMonth: '08',
          expYear: '26',
          holderName: 'John Doe',
          isDefault: false
        })
      ];

      return new PaymentMethodsResponseDto(true, mockPaymentMethods);
    } catch (error) {
      console.error('Get payment methods error:', error);
      return new PaymentMethodsResponseDto(false, [], 'Failed to get payment methods');
    }
  }

  static async addPaymentMethod(request: AddPaymentMethodRequestDto): Promise<BaseResponseDto> {
    try {
      await delay(800);
      return new BaseResponseDto(true, 'Payment method added successfully');
    } catch (error) {
      console.error('Add payment method error:', error);
      return new BaseResponseDto(false, 'Failed to add payment method');
    }
  }

  static async getTransactionHistory(userId: number): Promise<TransactionHistoryResponseDto> {
    try {
      await delay(700);

      const mockTransactions = [
        new TransactionDto({
          id: 1,
          date: new Date('2024-01-15').toISOString(),
          description: 'Executive Boardroom - 2 hours',
          amount: 170,
          status: 'completed'
        }),
        new TransactionDto({
          id: 2,
          date: new Date('2024-01-10').toISOString(),
          description: 'Hot Desk - Monthly Plan',
          amount: 450,
          status: 'completed'
        })
      ];

      return new TransactionHistoryResponseDto(true, mockTransactions, mockTransactions.length);
    } catch (error) {
      console.error('Get transaction history error:', error);
      return new TransactionHistoryResponseDto(false, [], 0, 'Failed to get transaction history');
    }
  }
}

// Profile API
export class ProfileAPI {
  static async updateProfile(request: UpdateProfileRequestDto): Promise<AuthResponseDto> {
    try {
      await delay(800);

      const updatedUser = new UserDto({
        id: Date.now(),
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        company: request.company,
        jobTitle: request.jobTitle,
        bio: request.bio,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      });

      return new AuthResponseDto(true, 'Profile updated successfully', updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      return new AuthResponseDto(false, 'Failed to update profile');
    }
  }

  static async changePassword(request: ChangePasswordRequestDto): Promise<BaseResponseDto> {
    try {
      await delay(600);

      if (request.newPassword !== request.confirmPassword) {
        return new BaseResponseDto(false, 'New passwords do not match');
      }

      if (request.newPassword.length < 6) {
        return new BaseResponseDto(false, 'Password must be at least 6 characters long');
      }

      return new BaseResponseDto(true, 'Password updated successfully');
    } catch (error) {
      console.error('Change password error:', error);
      return new BaseResponseDto(false, 'Failed to change password');
    }
  }
}

// Home Page API
export class HomeAPI {
  static async getHomePageData(): Promise<HomePageDataResponseDto> {
    try {
      await delay(600);

      const featuredSpaces = [
        new SpaceDto({
          id: 1,
          name: 'The Innovation Hub',
          location: 'Downtown, San Francisco',
          address: '123 Business District, San Francisco, CA 94105',
          rating: 4.9,
          reviews: 127,
          description: 'Premium workspace for innovation and collaboration',
          images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['High-Speed WiFi', '4K Display', 'Coffee Service'],
          pricing: { hourly: 85, daily: 35 },
          capacity: 12,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 2,
          name: 'Creative Commons',
          location: 'SOMA, San Francisco',
          address: '456 Creative Street, San Francisco, CA 94103',
          rating: 4.8,
          reviews: 89,
          description: 'Creative workspace for professionals',
          images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['Natural Light', 'Standing Desks'],
          pricing: { daily: 40, monthly: 500 },
          isAvailable: true,
          productType: 'hot-desk',
          availability: generateMockAvailability()
        }),
        new SpaceDto({
          id: 3,
          name: 'Executive Boardroom',
          location: 'Financial District, San Francisco',
          address: '789 Executive Plaza, San Francisco, CA 94111',
          rating: 4.9,
          reviews: 156,
          description: 'Premium executive boardroom for high-level meetings',
          images: ['https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['4K Display', 'Video Conferencing'],
          pricing: { hourly: 120 },
          capacity: 16,
          isAvailable: true,
          productType: 'meeting-room',
          availability: generateMockAvailability()
        })
      ];

      const advertisements = [
        new AdvertisementDto({
          id: 1,
          title: 'Premium Workspaces',
          description: 'Experience luxury coworking spaces with world-class amenities',
          buttonText: 'Explore Now',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 2,
          title: 'Meeting Rooms Available',
          description: 'Book professional meeting rooms equipped with latest technology',
          buttonText: 'Book Meeting Room',
          image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 3,
          title: 'Flexible Hot Desks',
          description: 'Grab a hot desk for a day or week, perfect for remote work',
          buttonText: 'Find a Desk',
          image: 'https://images.unsplash.com/photo-1504384308090-c8997100287a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 4,
          title: 'Private Office Suites',
          description: 'Secure your own private office for enhanced productivity',
          buttonText: 'View Offices',
          image: 'https://images.unsplash.com/photo-1520004439295-91d8d1f1f2c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 5,
          title: 'Community Events',
          description: 'Join our vibrant community with exclusive networking events',
          buttonText: 'See Events',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 6,
          title: 'Virtual Office Solutions',
          description: 'Establish a professional presence with our virtual office services',
          buttonText: 'Learn More',
          image: 'https://images.unsplash.com/photo-1507679799977-c7ad93d79e02?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 7,
          title: 'Coworking Memberships',
          description: 'Choose a membership plan that fits your work style and budget',
          buttonText: 'Compare Plans',
          image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 8,
          title: 'Exclusive Partner Deals',
          description: 'Access special discounts from our network of trusted partners',
          buttonText: 'View Deals',
          image: 'https://images.unsplash.com/photo-1521737711867-ee1ab92e975e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 9,
          title: 'New Location Opening',
          description: 'Discover our brand new coworking space in the city center',
          buttonText: 'Visit New Space',
          image: 'https://images.unsplash.com/photo-1504384308090-c8997100287a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }),
        new AdvertisementDto({
          id: 10,
          title: 'Refer a Friend',
          description: 'Earn rewards by referring your friends to WorkSpace',
          buttonText: 'Refer Now',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        })
      ];

      const testimonials = [
        new TestimonialDto({
          id: 1,
          name: 'Sarah Chen',
          role: 'Product Manager at Stripe',
          content: 'WorkSpace has completely transformed how I work. The flexibility to book different spaces based on my needs is incredible.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          rating: 5
        }),
        new TestimonialDto({
          id: 2,
          name: 'Marcus Rodriguez',
          role: 'Freelance Designer',
          content: 'As a freelancer, I love the variety of environments I can choose from. Perfect for different types of work.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          rating: 5
        })
      ];

      return new HomePageDataResponseDto(true, featuredSpaces, advertisements, testimonials);
    } catch (error) {
      console.error('Get home page data error:', error);
      return new HomePageDataResponseDto(false, [], [], [], 'Failed to get home page data');
    }
  }

  static async subscribeNewsletter(request: NewsletterSubscriptionRequestDto): Promise<NewsletterResponseDto> {
    try {
      await delay(500);
      return new NewsletterResponseDto(true, true, 'Successfully subscribed to newsletter');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return new NewsletterResponseDto(false, false, 'Failed to subscribe to newsletter');
    }
  }
}

// Legacy exports for backward compatibility
export const authAPI = {
  signIn: AuthAPI.signIn,
  signUp: AuthAPI.signUp
};

export { SignInRequestDto as SignInData, SignUpRequestDto as SignUpData };
export type { UserDto as User, AuthResponseDto as AuthResponse };