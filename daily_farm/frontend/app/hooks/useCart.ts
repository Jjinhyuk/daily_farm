import { useState, useEffect } from 'react';
import { Cart } from '../types';
import { getCart, updateCartItem, removeCartItem } from '../lib/api';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
      setError(null);
    } catch (err) {
      setError('장바구니를 불러오는데 실패했습니다.');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = async (cartItemId: number, quantity: number) => {
    try {
      await updateCartItem(cartItemId, { quantity });
      await fetchCart();
    } catch (err) {
      setError('장바구니 수정에 실패했습니다.');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId);
      await fetchCart();
    } catch (err) {
      setError('장바구니에서 상품 제거에 실패했습니다.');
    }
  };

  const clearCart = async () => {
    setCart(null);
    // 여기에 장바구니 비우기 API 호출을 추가할 수 있습니다
  };

  return { 
    cart, 
    loading, 
    error, 
    updateCart, 
    removeFromCart, 
    clearCart,
    refreshCart: fetchCart 
  };
} 