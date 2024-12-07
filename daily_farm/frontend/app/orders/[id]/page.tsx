'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '../../lib/api';
import { Order } from '../../types';
import { useAuth } from '@/app/context/AuthContext';
import { useNotification } from '@/app/context/NotificationContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';
import ReviewForm from '@/app/components/market/ReviewForm';

const ORDER_STATUS_MAP = {
  PENDING: '주문 대기',
  CONFIRMED: '주문 확인',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
};

const ORDER_STATUS_COLOR = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderId = Number(params.id);
        const order = await apiClient.getOrderById(orderId);
        setOrder(order);
      } catch (err: any) {
        setError(err.message || '주문 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [user, params.id]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await apiClient.cancelOrder(order.id);
      const order = await apiClient.getOrderById(order.id);
      setOrder(order);
      showNotification('success', '주문이 취소되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '주문 취소에 실패했습니다.');
    }
  };

  const handleSubmitReview = async (cropId: number, rating: number, content: string) => {
    if (!order) return;

    try {
      setIsSubmittingReview(true);
      await apiClient.createReview({
        crop_id: cropId,
        order_id: order.id,
        rating,
        content,
      });

      // 주문 정보 새로고침
      const order = await apiClient.getOrderById(order.id);
      setOrder(order);
      showNotification('success', '리뷰가 등록되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '리뷰 등록에 실패했습니다.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || '주문을 찾을 수 없습니다.'} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">주문 상세</h1>
        <span
          className={`
            px-3 py-1 rounded-full text-sm
            ${ORDER_STATUS_COLOR[order.status]}
          `}
        >
          {ORDER_STATUS_MAP[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">주문 상품</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.crop.images[0]}
                        alt={item.crop.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3
                        className="font-medium hover:text-primary cursor-pointer"
                        onClick={() => router.push(`/market/${item.crop.id}`)}
                      >
                        {item.crop.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.crop.farmer.farm_name || item.crop.farmer.full_name}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">
                          {item.quantity} {item.crop.unit}
                        </span>
                        <span className="font-medium">
                          {(item.price_per_unit * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 리뷰 작성 폼 */}
                  {order.status === 'DELIVERED' &&
                    !order.reviews.some((review) => review.crop_id === item.crop.id) && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">리뷰 작성</h4>
                        <ReviewForm
                          onSubmit={(rating, content) =>
                            handleSubmitReview(item.crop.id, rating, content)
                          }
                          isSubmitting={isSubmittingReview}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 주문 정보 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">주문 정보</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">주문번호</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">주문일시</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">배송지</p>
                <p className="font-medium">{order.delivery_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">연락처</p>
                <p className="font-medium">{order.delivery_contact}</p>
              </div>
              {order.tracking_number && (
                <div>
                  <p className="text-sm text-gray-500">운송장번호</p>
                  <p className="font-medium">{order.tracking_number}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">결제 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span>{order.total_price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span>무료</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>총 결제금액</span>
                <span className="text-primary">
                  {order.total_price.toLocaleString()}원
                </span>
              </div>
            </div>

            {order.status === 'PENDING' && (
              <button
                onClick={handleCancelOrder}
                className="w-full mt-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                주문 취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 