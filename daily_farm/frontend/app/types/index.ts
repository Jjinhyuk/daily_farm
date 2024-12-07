export type UserType = 'FARMER' | 'CUSTOMER';
export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO';

export interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  user_type: 'FARMER' | 'CUSTOMER';
  auth_provider: 'LOCAL' | 'GOOGLE' | 'KAKAO';
  phone_number?: string;
  profile_image?: string;
  farm_name?: string;
  farm_location?: string;
  farm_description?: string;
  created_at: string;
  updated_at: string;
}

export type CropStatus = 'GROWING' | 'HARVESTED' | 'SOLD';

export interface Crop {
  id: number;
  farmer_id: number;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  status: CropStatus;
  planting_date: string;
  expected_harvest_date: string;
  actual_harvest_date?: string;
  temperature?: number;
  humidity?: number;
  soil_ph?: number;
  images: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  farmer: User;
  reviews?: Review[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  order_id: number;
  crop_id: number;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  crop: Crop;
}

export interface Order {
  id: number;
  consumer_id: number;
  farmer_id: number;
  total_price: number;
  status: OrderStatus;
  delivery_address: string;
  delivery_contact: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  consumer: User;
  farmer: User;
  items: OrderItem[];
  reviews: Review[];
}

export interface CartItemUpdateData {
  quantity: number;
}

export interface CartItem {
  id: number;
  cart_id: number;
  crop_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  crop: Crop;
}

export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  total_price: number;
}

export interface Review {
  id: number;
  user_id: number;
  crop_id: number;
  order_id: number;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Message {
  id: number;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    full_name: string;
    profile_image: string | null;
  };
  receiver: {
    id: number;
    full_name: string;
    profile_image: string | null;
  };
}

export interface MessageCreate {
  title: string;
  content: string;
  receiver_id: number;
} 