'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, error, updateItem, removeItem } = useCart();
  const { showNotification } = useNotification();

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeItem(itemId);
        return;
      }
      await updateItem(itemId, quantity);
    } catch (err: any) {
      showNotification('error', err.message || '수량 변경에 실패했습니다.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      showNotification('success', '상품이 장바구니에서 제거되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '상품 제거에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <p className="text-gray-500 mb-8">장바구니가 비어있습니다.</p>
          <button
            onClick={() => router.push('/market')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm flex gap-4"
            >
              {/* 상품 이미지 */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.crop.images[0]}
                  alt={item.crop.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* 상품 정보 */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="font-medium hover:text-primary cursor-pointer"
                      onClick={() => router.push(`/market/${item.crop.id}`)}
                    >
                      {item.crop.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.crop.farmer.farm_name || item.crop.farmer.full_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      className="w-16 text-center border rounded"
                      min="1"
                      max={item.crop.quantity_available}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">
                      {item.crop.unit}
                    </span>
                  </div>
                  <div className="font-medium">
                    {(item.crop.price_per_unit * item.quantity).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">주문 요약</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 수</span>
                <span>{cart.items.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 상품 금액</span>
                <span>{cart.total_price.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 