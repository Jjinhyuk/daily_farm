'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '../lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';

interface OrderFormData {
  delivery_address: string;
  delivery_contact: string;
  delivery_message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, isLoading: isCartLoading, error: cartError, refreshCart, clearCart } = useCart();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<OrderFormData>({
    delivery_address: '',
    delivery_contact: '',
    delivery_message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = Object.fromEntries(new FormData(e.currentTarget));

      // 주문 생성
      await apiClient.createOrder({
        ...formData,
        items: cart.items.map((item) => ({
          crop_id: item.crop.id,
          quantity: item.quantity,
          price_per_unit: item.crop.price,
        })),
      });

      // 장바구니 비우기
      await clearCart();
      
      showNotification('success', '주문이 완료되었습니다.');
      router.push('/orders');
    } catch (err: any) {
      setError(err.message || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={cartError} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문하기</h1>
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
      <h1 className="text-2xl font-bold mb-8">주문하기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">주문 상품</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.crop.images[0]}
                      alt={item.crop.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.crop.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.crop.farmer.farm_name || item.crop.farmer.full_name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">
                        {item.quantity} {item.crop.unit}
                      </span>
                      <span className="font-medium">
                        {(item.crop.price_per_unit * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 배송 정보 */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">배송 정보</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="delivery_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  배송지 주소
                </label>
                <input
                  type="text"
                  id="delivery_address"
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="배송받으실 주소를 입력해주세요"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery_contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  연락처
                </label>
                <input
                  type="tel"
                  id="delivery_contact"
                  name="delivery_contact"
                  value={formData.delivery_contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="연락 가능한 전화번호를 입력해주세요"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery_message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  배송 메시지
                </label>
                <textarea
                  id="delivery_message"
                  name="delivery_message"
                  value={formData.delivery_message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="배송 시 요청사항을 입력해주세요"
                />
              </div>
            </div>
          </form>
        </div>

        {/* 결제 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">결제 정보</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 수</span>
                <span>{cart.items.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 상품 금액</span>
                <span>{cart.total_price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span>무료</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>총 결제 금액</span>
                  <span className="text-primary">
                    {cart.total_price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`
                w-full py-3 rounded-lg text-white font-bold
                ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-600'}
              `}
            >
              {isSubmitting ? '주문 처리 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 