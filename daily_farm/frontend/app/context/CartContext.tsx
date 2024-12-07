'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem } from '../types';
import apiClient from '../lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (cropId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const cart = await apiClient.getCart();
      setCart(cart);
    } catch (err: any) {
      setError(err.message || '장바구니를 불러오는데 실패했습니다.');
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const addItem = async (cropId: number, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.addCartItem({ crop_id: cropId, quantity });
      await fetchCart();
    } catch (err: any) {
      setError(err.message || '상품을 장바구니에 추가하는데 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.updateCartItem(itemId, { quantity });
      await fetchCart();
    } catch (err: any) {
      setError(err.message || '장바구니 수정에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.removeCartItem(itemId);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || '상품을 장바구니에서 제거하는데 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.clearCart();
      setCart(null);
    } catch (err: any) {
      setError(err.message || '장바구니 비우기에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = fetchCart;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 