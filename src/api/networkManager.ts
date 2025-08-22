// src/api/networkManager.ts
// NetworkManager for Home Page APIs (do not import or use in Home.vue yet)
// Each method simulates a real API call and includes backend response format as comments.

import type { SpaceDto, AdvertisementDto, TestimonialDto } from '../dto/response';

export class NetworkManager {
  private static readonly BASE_URL = 'http://192.168.2.30:9011/api';

  /**
   * Get all locations for the location dropdown.
   * Backend returns:
   *   { "status_code": 200, "message": "Locations retrieved successfully", "data": { "locations": ["Colombo", "Kandy", ...] } }
   * Frontend maps: response.data.locations (string[])
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
      
      if (data.status_code === 200 && data.data && data.data.locations) {
        return data.data.locations;
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
}
