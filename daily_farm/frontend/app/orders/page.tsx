'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '../lib/api';
import { Order, OrderStatus } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import { useNotification } from '@/app/context/NotificationContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';

const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  PENDING: '주문 대기',
  CONFIRMED: '주문 확인',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
};

const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orders = await apiClient.getOrders();
        setOrders(orders);
      } catch (err: any) {
        setError(err.message || '주문 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      await apiClient.cancelOrder(orderId);
      // 주문 목록 새로고침
      const orders = await apiClient.getOrders();
      setOrders(orders);
      showNotification('success', '주문이 취소되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '주문 취소에 실패했습니다.');
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문 내역</h1>
          <p className="text-gray-500 mb-8">로그인이 필요한 서비스입니다.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문 내역</h1>
          <p className="text-gray-500 mb-8">아직 주문 내역이 없습니다.</p>
          <button
            onClick={() => router.push('/market')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            쇼핑하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">주문 내역</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
            {/* 주문 헤더 */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  주문번호: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  주문일: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`
                  px-3 py-1 rounded-full text-sm
                  ${ORDER_STATUS_COLOR[order.status]}
                `}
              >
                {ORDER_STATUS_MAP[order.status]}
              </span>
            </div>

            {/* 주문 상품 목록 */}
            <div className="space-y-4">
              {order.items.map((item) => (
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
              ))}
            </div>

            {/* 주문 정보 */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">배송지</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">연락처</p>
                  <p className="font-medium">{order.delivery_contact}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="font-bold">
                  총 결제금액: {order.total_price.toLocaleString()}원
                </div>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    주문 취소
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 