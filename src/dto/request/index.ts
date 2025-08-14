// src/dto/request/index.ts

// Authentication Request DTOs
export class SignInRequestDto {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class SignUpRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;

  constructor(firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}

// Search Request DTOs
export class SearchSpacesRequestDto {
  location?: string;
  spaceType?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  priceRange?: {
    min: number;
    max: number;
  };

  constructor(params: Partial<SearchSpacesRequestDto> = {}) {
    this.location = params.location;
    this.spaceType = params.spaceType;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.capacity = params.capacity;
    this.priceRange = params.priceRange;
  }
}

// Booking Request DTOs
export class CreateBookingRequestDto {
  spaceId: number;
  productType: string;
  date: string;
  startTime?: string;
  duration?: string;
  facilities?: string[];
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };

  constructor(params: {
    spaceId: number;
    productType: string;
    date: string;
    startTime?: string;
    duration?: string;
    facilities?: string[];
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      specialRequests?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
    };
  }) {
    this.spaceId = params.spaceId;
    this.productType = params.productType;
    this.date = params.date;
    this.startTime = params.startTime;
    this.duration = params.duration;
    this.facilities = params.facilities;
    this.guestInfo = params.guestInfo;
  }
}

export class CreateSubscriptionRequestDto {
  spaceId: number;
  productType: string;
  packageType: string;
  startDate: string;
  teamSize?: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };

  constructor(params: {
    spaceId: number;
    productType: string;
    packageType: string;
    startDate: string;
    teamSize?: string;
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      specialRequests?: string;
    };
  }) {
    this.spaceId = params.spaceId;
    this.productType = params.productType;
    this.packageType = params.packageType;
    this.startDate = params.startDate;
    this.teamSize = params.teamSize;
    this.guestInfo = params.guestInfo;
  }
}

// Payment Request DTOs
export class ProcessPaymentRequestDto {
  bookingId: string;
  paymentMethod: string;
  cardInfo?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  billingAddress: {
    country: string;
    zipCode: string;
    address: string;
    city: string;
    state: string;
  };
  amount: number;

  constructor(params: {
    bookingId: string;
    paymentMethod: string;
    cardInfo?: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    };
    billingAddress: {
      country: string;
      zipCode: string;
      address: string;
      city: string;
      state: string;
    };
    amount: number;
  }) {
    this.bookingId = params.bookingId;
    this.paymentMethod = params.paymentMethod;
    this.cardInfo = params.cardInfo;
    this.billingAddress = params.billingAddress;
    this.amount = params.amount;
  }
}

// Profile Request DTOs
export class UpdateProfileRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;

  constructor(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
  }) {
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
    this.phone = params.phone;
    this.company = params.company;
    this.jobTitle = params.jobTitle;
    this.bio = params.bio;
  }
}

export class ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(currentPassword: string, newPassword: string, confirmPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}

// Newsletter Request DTO
export class NewsletterSubscriptionRequestDto {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

// Payment Method Request DTOs
export class AddPaymentMethodRequestDto {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  setAsDefault: boolean;

  constructor(params: {
    number: string;
    holderName: string;
    expiry: string;
    cvv: string;
    setAsDefault: boolean;
  }) {
    this.number = params.number;
    this.holderName = params.holderName;
    this.expiry = params.expiry;
    this.cvv = params.cvv;
    this.setAsDefault = params.setAsDefault;
  }
}

export class UpdateBillingAddressRequestDto {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  constructor(params: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) {
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.address1 = params.address1;
    this.address2 = params.address2;
    this.city = params.city;
    this.state = params.state;
    this.zipCode = params.zipCode;
    this.country = params.country;
  }
}