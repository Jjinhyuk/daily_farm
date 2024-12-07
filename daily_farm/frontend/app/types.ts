// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  farm_name?: string;
  profile_image?: string;
  role: 'FARMER' | 'CUSTOMER' | 'ADMIN';
  created_at: string;
  updated_at: string;
}

// Crop types
export const enum CropStatus {
  GROWING = 'GROWING',
  HARVESTED = 'HARVESTED',
  SOLD = 'SOLD'
}

export interface Crop {
  id: number;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  status: CropStatus;
  images: string[];
  farmer: User;
  planting_date: string;
  expected_harvest_date: string;
  actual_harvest_date?: string;
  temperature?: number;
  humidity?: number;
  soil_ph?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Cart types
export interface CartItem {
  id: number;
  crop: Crop;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user: User;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

// Order types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  crop: Crop;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  delivery_contact: string;
  delivery_message?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
}

// Review types
export interface Review {
  id: number;
  user: User;
  crop: Crop;
  order?: Order;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
}

// Message types
export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  total_pages: number;
}

// Sort options
export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'rating'; 