'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Cart, CartItemUpdateData } from '@/app/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '장바구니를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await updateCartItem(itemId, { quantity: newQuantity });
      await fetchCart();
      toast.success('수량이 업데이트되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('수량 업데이트에 실패했습니다.');
      }
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
      toast.success('상품이 장바구니에서 제거되었습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '상품 제거에 실패했습니다.');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      await fetchCart();
      toast.success('장바구니가 비워졌습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '장바구니 비우기에 실패했습니다.');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h1>
          <Link href="/market" className="text-green-600 hover:text-green-700">
            상품 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center border rounded-lg p-4 gap-4">
            <div className="w-24 h-24 relative">
              <Image
                src={item.crop.images[0] || '/placeholder.png'}
                alt={item.crop.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            
            <div className="flex-grow">
              <Link href={`/market/${item.crop.id}`} className="font-semibold hover:text-green-600">
                {item.crop.name}
              </Link>
              <p className="text-sm text-gray-600">{item.crop.farmer?.farm_name || '농장명 없음'}</p>
              <p className="text-green-600">
                {(item.crop.price_per_unit * item.quantity).toLocaleString()}원
                <span className="text-sm text-gray-500 ml-1">
                  ({item.crop.price_per_unit.toLocaleString()}원/{item.crop.unit})
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => handleQuantityChange(item.id, Math.max(0.1, item.quantity - 0.1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 min-w-[60px] text-center">
                  {item.quantity.toFixed(1)} {item.crop.unit}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 0.1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-600"
          >
            장바구니 비우기
          </button>
          <div className="text-xl font-bold">
            총 금액: {cart.total_price.toLocaleString()}원
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
} 