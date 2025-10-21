// src/dto/response/index.ts

// Base Response DTO
export class BaseResponseDto {
  success: boolean;
  message?: string;
  timestamp: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

// Company Profile DTO
export class CompanyProfileDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;

  constructor(params: {
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
  }) {
    this.name = params.name;
    this.email = params.email;
    this.phone = params.phone;
    this.address = params.address;
    this.image = params.image;
  }
}

// User and Authentication Response DTOs
export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  avatar: string;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
    avatar: string;
    rewardPoints?: number;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = params.id;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
    this.phone = params.phone;
    this.company = params.company;
    this.jobTitle = params.jobTitle;
    this.bio = params.bio;
    this.avatar = params.avatar;
    this.rewardPoints = params.rewardPoints || 0;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.updatedAt = params.updatedAt || new Date().toISOString();
  }
}

export class AuthResponseDto extends BaseResponseDto {
  user?: UserDto;
  token?: string;

  constructor(success: boolean, message?: string, user?: UserDto, token?: string) {
    super(success, message);
    this.user = user;
    this.token = token;
  }
}

// Space Response DTOs

// Raw API response interface for accessing additional properties not in SpaceDto
export interface RawSpaceApiResponse extends Partial<SpaceDto> {
  operation_schedule?: Array<{
    day: string;
    start_time: string;
    end_time: string;
    is_enabled: boolean;
  }>;
  location_url?: string;
  [key: string]: unknown; // Allow additional unknown properties
}

export class SpaceDto {
  id: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  features: string[];
  pricing: {
    hourly?: number;
    daily?: number;
    monthly?: number;
    annual?: number;
  };
  capacity?: number;
  maxCapacity?: number;
  isAvailable: boolean;
  availability: Array<{ date: string; slots: unknown[] }>;
  productType: string;
  // Additional properties used in NetworkManager
  displayProductType?: string;
  additional_facilities?: Array<{
    facility_id: number;
    facility_name: string;
    hourly_price?: number;
    icon?: string;
  }>;
  default_facilities?: Array<{
    facility_id: number;
    facility_name: string;
    hourly_price?: number;
    icon?: string;
  }>;
  facilities?: Array<{
    facility_id: number;
    facility_name: string;
    hourly_price?: number;
    icon?: string;
  }>;
  recent_ratings?: Array<{ rating: number; comment?: string; user?: string }>;
  start_operation_time?: string;
  end_operation_time?: string;
  locationUrl?: string;
  recentReviews?: Array<{ rating: number; comment?: string; user?: string }>;

  constructor(params: {
    id: number;
    name: string;
    location: string;
    address: string;
    rating: number;
    reviews: number;
    description: string;
    images: string[];
    features: string[];
    pricing: {
      hourly?: number;
      daily?: number;
      monthly?: number;
      annual?: number;
    };
    capacity?: number;
    maxCapacity?: number;
    isAvailable: boolean;
    productType: string;
    availability: Array<{ date: string; slots: unknown[] }>;
    // Optional properties
    displayProductType?: string;
    additional_facilities?: Array<{
      facility_id: number;
      facility_name: string;
      hourly_price?: number;
      icon?: string;
    }>;
    default_facilities?: Array<{
      facility_id: number;
      facility_name: string;
      hourly_price?: number;
      icon?: string;
    }>;
    recent_ratings?: Array<{ rating: number; comment?: string; user?: string }>;
    start_operation_time?: string;
    end_operation_time?: string;
    locationUrl?: string;
    recentReviews?: Array<{ rating: number; comment?: string; user?: string }>;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.location = params.location;
    this.address = params.address;
    this.rating = params.rating;
    this.reviews = params.reviews;
    this.description = params.description;
    this.images = params.images;
    this.features = params.features;
    this.pricing = params.pricing;
    this.capacity = params.capacity;
    this.maxCapacity = params.maxCapacity;
    this.isAvailable = params.isAvailable;
    this.productType = params.productType;
    this.availability = params.availability;
    
    // Optional properties
    if (params.displayProductType) this.displayProductType = params.displayProductType;
    if (params.additional_facilities) this.additional_facilities = params.additional_facilities;
    if (params.recent_ratings) this.recent_ratings = params.recent_ratings;
    if (params.start_operation_time) this.start_operation_time = params.start_operation_time;
    if (params.end_operation_time) this.end_operation_time = params.end_operation_time;
    if (params.locationUrl) this.locationUrl = params.locationUrl;
    if (params.recentReviews) this.recentReviews = params.recentReviews;
  }
}

export class SearchSpacesResponseDto extends BaseResponseDto {
  spaces: SpaceDto[];
  totalCount: number;
  filters: {
    location?: string;
    spaceType?: string;
    priceRange?: { min: number; max: number };
  };

  constructor(success: boolean, spaces: SpaceDto[], totalCount: number, filters: { location?: string; spaceType?: string; priceRange?: { min: number; max: number } } = {}, message?: string) {
    super(success, message);
    this.spaces = spaces;
    this.totalCount = totalCount;
    this.filters = filters;
  }
}

export class SpaceDetailsResponseDto extends BaseResponseDto {
  space: SpaceDto;
  recentReviews: ReviewDto[];
  availability: AvailabilityDto[];

  constructor(success: boolean, space: SpaceDto, recentReviews: ReviewDto[] = [], availability: AvailabilityDto[] = [], message?: string) {
    super(success, message);
    this.space = space;
    this.recentReviews = recentReviews;
    this.availability = availability;
  }
}

// Review DTO
export class ReviewDto {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;

  constructor(params: {
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar: string;
    date?: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.rating = params.rating;
    this.comment = params.comment;
    this.avatar = params.avatar;
    this.date = params.date || new Date().toISOString();
  }
}

// Availability DTO
export class AvailabilityDto {
  date: string;
  timeSlots: {
    time: string;
    available: boolean;
  }[];

  constructor(date: string, timeSlots: { time: string; available: boolean }[]) {
    this.date = date;
    this.timeSlots = timeSlots;
  }
}

// Booking Response DTOs
export class BookingDto {
  id: string;
  spaceId: number;
  spaceName: string;
  productType: string;
  date: string;
  startTime?: string;
  duration?: string;
  packageType?: string;
  status: string;
  totalAmount: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: string;

  constructor(params: {
    id: string;
    spaceId: number;
    spaceName: string;
    productType: string;
    date: string;
    startTime?: string;
    duration?: string;
    packageType?: string;
    status: string;
    totalAmount: number;
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    createdAt?: string;
  }) {
    this.id = params.id;
    this.spaceId = params.spaceId;
    this.spaceName = params.spaceName;
    this.productType = params.productType;
    this.date = params.date;
    this.startTime = params.startTime;
    this.duration = params.duration;
    this.packageType = params.packageType;
    this.status = params.status;
    this.totalAmount = params.totalAmount;
    this.guestInfo = params.guestInfo;
    this.createdAt = params.createdAt || new Date().toISOString();
  }
}

export class CreateBookingResponseDto extends BaseResponseDto {
  booking: BookingDto;
  paymentRequired: boolean;

  constructor(success: boolean, booking: BookingDto, paymentRequired: boolean = true, message?: string) {
    super(success, message);
    this.booking = booking;
    this.paymentRequired = paymentRequired;
  }
}

export class BookingListResponseDto extends BaseResponseDto {
  bookings: BookingDto[];
  totalCount: number;

  constructor(success: boolean, bookings: BookingDto[], totalCount: number, message?: string) {
    super(success, message);
    this.bookings = bookings;
    this.totalCount = totalCount;
  }
}

// Payment Response DTOs
export class PaymentDto {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId: string;
  processedAt: string;

  constructor(params: {
    id: string;
    bookingId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionId: string;
    processedAt?: string;
  }) {
    this.id = params.id;
    this.bookingId = params.bookingId;
    this.amount = params.amount;
    this.status = params.status;
    this.paymentMethod = params.paymentMethod;
    this.transactionId = params.transactionId;
    this.processedAt = params.processedAt || new Date().toISOString();
  }
}

export class ProcessPaymentResponseDto extends BaseResponseDto {
  payment: PaymentDto;
  booking: BookingDto;

  constructor(success: boolean, payment: PaymentDto, booking: BookingDto, message?: string) {
    super(success, message);
    this.payment = payment;
    this.booking = booking;
  }
}

// Payment Method DTOs
export class PaymentMethodDto {
  id: number;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  isDefault: boolean;

  constructor(params: {
    id: number;
    brand: string;
    last4: string;
    expMonth: string;
    expYear: string;
    holderName: string;
    isDefault: boolean;
  }) {
    this.id = params.id;
    this.brand = params.brand;
    this.last4 = params.last4;
    this.expMonth = params.expMonth;
    this.expYear = params.expYear;
    this.holderName = params.holderName;
    this.isDefault = params.isDefault;
  }
}

export class PaymentMethodsResponseDto extends BaseResponseDto {
  paymentMethods: PaymentMethodDto[];

  constructor(success: boolean, paymentMethods: PaymentMethodDto[], message?: string) {
    super(success, message);
    this.paymentMethods = paymentMethods;
  }
}

// Transaction DTOs
export class TransactionDto {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
  receiptUrl?: string;

  constructor(params: {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: string;
    receiptUrl?: string;
  }) {
    this.id = params.id;
    this.date = params.date;
    this.description = params.description;
    this.amount = params.amount;
    this.status = params.status;
    this.receiptUrl = params.receiptUrl;
  }
}

export class TransactionHistoryResponseDto extends BaseResponseDto {
  transactions: TransactionDto[];
  totalCount: number;

  constructor(success: boolean, transactions: TransactionDto[], totalCount: number, message?: string) {
    super(success, message);
    this.transactions = transactions;
    this.totalCount = totalCount;
  }
}

// Home Page DTOs
export class AdvertisementDto {
  images: string;
  url: string;

  constructor(params: {
    images: string;
    url: string;
  }) {
    this.images = params.images;
    this.url = params.url;
  }
}

export class TestimonialDto {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;

  constructor(params: {
    id: number;
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.role = params.role;
    this.content = params.content;
    this.avatar = params.avatar;
    this.rating = params.rating;
  }
}

export class HomePageDataResponseDto extends BaseResponseDto {
  featuredSpaces: SpaceDto[];
  advertisements: AdvertisementDto[];
  testimonials: TestimonialDto[];

  constructor(success: boolean, featuredSpaces: SpaceDto[], advertisements: AdvertisementDto[], testimonials: TestimonialDto[], message?: string) {
    super(success, message);
    this.featuredSpaces = featuredSpaces;
    this.advertisements = advertisements;
    this.testimonials = testimonials;
  }
}

// Newsletter Response DTO
export class NewsletterResponseDto extends BaseResponseDto {
  subscribed: boolean;

  constructor(success: boolean, subscribed: boolean, message?: string) {
    super(success, message);
    this.subscribed = subscribed;
  }
}

// Booked Time Slots Response DTO
export class BookedTimeSlotDto {
  start_time: string;
  end_time: string;

  constructor(startTime: string, endTime: string) {
    this.start_time = startTime;
    this.end_time = endTime;
  }
}

export class BookedTimeSlotsResponseDto {
  status_code: number;
  message: string;
  data: BookedTimeSlotDto[];
  
  constructor(statusCode: number, message: string, data: BookedTimeSlotDto[]) {
    this.status_code = statusCode;
    this.message = message;
    this.data = data;
  }
}