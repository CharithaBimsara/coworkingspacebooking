// Invoice related interfaces

export interface InvoiceFacility {
  name: string;
  price: number;
}

export interface InvoiceItem {
  name: string;
  date: string;
  time?: string;
  price: number;
  location?: string;
  facilities?: InvoiceFacility[];
}

export interface InvoiceData {
  orderId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod: string;
  items: InvoiceItem[];
  total: number;
}

// API response interfaces - matches NetworkManager.getInvoice response
export interface ApiInvoiceFacility {
  facility_id: number;
  facility_name: string;
  price: number;
}

export interface ApiInvoiceProduct {
  product_id: number;
  product_type: string;
  location_name: string;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  total_price: number;
  additional_facilities?: ApiInvoiceFacility[];
}

export interface ApiInvoiceData {
  order_id: string;
  transaction_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_amount: number;
  products: ApiInvoiceProduct[];
}