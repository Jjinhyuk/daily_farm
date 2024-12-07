import axios from 'axios';
import { User, Crop, Order, Review, Cart, Message, CropStatus } from '../types';

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  total_pages: number;
}

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'rating';

export interface GetCropsParams {
  page?: number;
  limit?: number;
  status?: CropStatus;
  farmer_id?: number;
  search?: string;
  sort_by?: SortOption;
  min_price?: number;
  max_price?: number;
  region?: string;
}

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        localStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API functions
const apiClient = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: Partial<User>) => {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // User management endpoints
  updateUserProfile: async (userData: Partial<User>) => {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
  },

  updateUserProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profile_image', file);

    const response = await api.put<User>('/users/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Crop endpoints
  createCrop: async (cropData: FormData) => {
    const response = await api.post<Crop>('/crops', cropData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCrop: async (cropId: number, cropData: FormData) => {
    const response = await api.put<Crop>(`/crops/${cropId}`, cropData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCrop: async (cropId: number) => {
    await api.delete(`/crops/${cropId}`);
  },

  getCrops: async (params?: GetCropsParams) => {
    const response = await api.get<PaginatedResponse<Crop>>('/crops', { params });
    return response.data;
  },

  getCropById: async (id: number) => {
    const response = await api.get<Crop>(`/crops/${id}`);
    return response.data;
  },

  getCropReviews: async (cropId: number, params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Review>>(
      `/crops/${cropId}/reviews`,
      { params }
    );
    return {
      reviews: response.data.items,
      total: response.data.total,
      total_pages: response.data.total_pages,
    };
  },

  // Review endpoints
  createReview: async (reviewData: {
    crop_id: number;
    order_id?: number;
    rating: number;
    content: string;
  }) => {
    const response = await api.post<Review>('/reviews', reviewData);
    return response.data;
  },

  updateReview: async (id: number, reviewData: { rating?: number; content?: string }) => {
    const response = await api.put<Review>(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id: number) => {
    await api.delete(`/reviews/${id}`);
  },

  // Cart endpoints
  getCart: async () => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  addCartItem: async (itemData: { crop_id: number; quantity: number }) => {
    const response = await api.post<Cart>('/cart/items', itemData);
    return response.data;
  },

  updateCartItem: async (itemId: number, itemData: { quantity: number }) => {
    const response = await api.put<Cart>(`/cart/items/${itemId}`, itemData);
    return response.data;
  },

  removeCartItem: async (itemId: number) => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<Cart>('/cart');
    return response.data;
  },

  // Order endpoints
  createOrder: async (orderData: {
    items: Array<{
      crop_id: number;
      quantity: number;
      price_per_unit: number;
    }>;
    delivery_address: string;
    delivery_contact: string;
    delivery_message?: string;
  }) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (orderId: number) => {
    const response = await api.put<Order>(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Message endpoints
  getMessages: async () => {
    const response = await api.get<Message[]>('/messages');
    return response.data;
  },

  sendMessage: async (messageData: { receiver_id: number; content: string }) => {
    const response = await api.post<Message>('/messages', messageData);
    return response.data;
  },
};

export default apiClient; 