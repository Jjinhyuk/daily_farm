import axios, { AxiosError } from 'axios';
import { User, Crop, Order, Cart, Review, Message, MessageCreate, OrderStatus } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃
});

// 재시도 설정
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

// 인터셉터 설정
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 재시도 횟수 초과하면 에러 throw
    if (originalRequest._retry >= MAX_RETRIES) {
      throw error;
    }

    // 네트워크 에러나 타임아웃인 경우 재시도
    if (
      (error.code === 'ECONNABORTED' || !error.response) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return api(originalRequest);
    }

    // 401 에러(인증 만료)인 경우 토큰 삭제
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    throw error;
  }
);

// 에러 처리 함수
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail: string }>;
    
    // 네트워크 에러
    if (!axiosError.response) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }

    // 서버 에러
    if (axiosError.response.status >= 500) {
      throw new Error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    // API 에러
    throw new Error(axiosError.response?.data?.detail || axiosError.message || '요청을 처리하는 중 오류가 발생했습니다.');
  }
  throw error;
};

// User API
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const register = async (userData: {
  email: string;
  password: string;
  full_name: string;
  user_type: 'FARMER' | 'CUSTOMER';
}): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<{ access_token: string; token_type: string }> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<{ access_token: string; token_type: string }>(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw handleError(error);
  }
};

// Crops API
export const getAvailableCrops = async (): Promise<Crop[]> => {
  try {
    const response = await api.get<Crop[]>('/crops/available');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCropById = async (id: number): Promise<Crop> => {
  try {
    const response = await api.get<Crop>(`/crops/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCrop = async (cropData: {
  name: string;
  description?: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  planting_date: string;
  expected_harvest_date: string;
  temperature?: number;
  humidity?: number;
  soil_ph?: number;
}): Promise<Crop> => {
  try {
    const response = await api.post<Crop>('/crops', cropData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCrop = async (
  id: number,
  cropData: Partial<Crop>
): Promise<Crop> => {
  try {
    const response = await api.put<Crop>(`/crops/${id}`, cropData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Cart API
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await api.get<Cart>('/cart');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const addCartItem = async (itemData: {
  crop_id: number;
  quantity: number;
}): Promise<Cart> => {
  try {
    const response = await api.post<Cart>('/cart/items', itemData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCartItem = async (
  itemId: number,
  itemData: { quantity: number }
): Promise<Cart> => {
  try {
    const response = await api.put<Cart>(`/cart/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const removeCartItem = async (itemId: number): Promise<Cart> => {
  try {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await api.delete('/cart');
  } catch (error) {
    throw handleError(error);
  }
};

// Order API
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOrder = async (id: number): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createOrder = async (data: {
  items: { crop_id: number; quantity: number }[];
  delivery_address: string;
  delivery_contact: string;
}): Promise<Order> => {
  try {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateOrderStatus = async (
  orderId: number,
  data: { status: OrderStatus; tracking_number?: string }
): Promise<Order> => {
  try {
    const response = await api.put<Order>(`/orders/${orderId}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const cancelOrder = async (orderId: number): Promise<Order> => {
  try {
    const response = await api.put<Order>(`/orders/${orderId}`, {
      status: 'CANCELLED',
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Review API
export const createReview = async (reviewData: {
  crop_id: number;
  order_id: number;
  rating: number;
  content: string;
}): Promise<Review> => {
  try {
    const response = await api.post<Review>('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getReviews = async (cropId: number): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>(`/reviews/crop/${cropId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateReview = async (
  reviewId: number,
  reviewData: Partial<Review>
): Promise<Review> => {
  try {
    const response = await api.put<Review>(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await api.delete(`/reviews/${reviewId}`);
  } catch (error) {
    throw handleError(error);
  }
};

// Message API
export const getMessages = async (): Promise<Message[]> => {
  try {
    const response = await api.get<Message[]>('/messages');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMessage = async (id: number): Promise<Message> => {
  try {
    const response = await api.get<Message>(`/messages/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMessage = async (data: MessageCreate): Promise<Message> => {
  try {
    const response = await api.post<Message>('/messages', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const markMessageAsRead = async (id: number): Promise<Message> => {
  try {
    const response = await api.put<Message>(`/messages/${id}/read`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUnreadMessageCount = async (): Promise<number> => {
  try {
    const response = await api.get<number>('/messages/unread-count');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export default api; 