'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOrders, cancelOrder } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Order, OrderStatus } from '@/app/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: number) => {
    if (!confirm('주문을 취소하시겠습니까?')) return;

    try {
      await cancelOrder(orderId);
      toast.success('주문이 취소되었습니다.');
      fetchOrders();
    } catch (error) {
      toast.error('주문 취소에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">내 주문 목록</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  주문번호: {order.id}
                </h2>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.created_at), 'PPP p', { locale: ko })}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-sm rounded bg-gray-100">
                  {order.status === 'PENDING' && '주문 대기'}
                  {order.status === 'CONFIRMED' && '주문 확인'}
                  {order.status === 'SHIPPED' && '배송 중'}
                  {order.status === 'DELIVERED' && '배송 완료'}
                  {order.status === 'CANCELLED' && '주문 취소'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.crop.images[0] || '/images/placeholder.png'}
                      alt={item.crop.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.crop.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.crop.unit} × {item.price_per_unit.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">
                      농장: {item.crop.farmer.farm_name || item.crop.farmer.full_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.total_price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">배송지: {order.delivery_address}</p>
                  <p className="text-sm text-gray-600">연락처: {order.delivery_contact}</p>
                  {order.tracking_number && (
                    <p className="text-sm text-gray-600">운송장번호: {order.tracking_number}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">
                    총 {order.total_price.toLocaleString()}원
                  </p>
                  <div className="mt-2 space-x-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        주문 취소
                      </button>
                    )}
                    {order.status === 'DELIVERED' && !order.reviews?.length && (
                      <Link
                        href={`/orders/${order.id}/review`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        리뷰 작성
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-500">주문 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
} 