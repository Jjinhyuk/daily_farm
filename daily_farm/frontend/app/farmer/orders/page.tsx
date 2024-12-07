'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFarmerOrders, updateOrderStatus } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { Order, OrderStatus } from '@/app/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getFarmerOrders();
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

  const handleStatusUpdate = async (orderId: number, status: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, {
        status,
        tracking_number: status === 'SHIPPED' ? trackingNumber : undefined,
      });
      toast.success('주문 상태가 업데이트되었습니다.');
      await fetchOrders();
      setSelectedOrder(null);
      setTrackingNumber('');
    } catch (error) {
      toast.error('주문 상태 업데이트에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">주문 관리</h1>
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
                <p className="text-sm text-gray-600">
                  주문자: {order.consumer.full_name}
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
                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        disabled={updating}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        주문 확인
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <>
                        {selectedOrder?.id === order.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              placeholder="운송장번호 입력"
                              className="px-2 py-1 border rounded text-sm"
                            />
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                              disabled={!trackingNumber || updating}
                              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              배송 시작
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(null);
                                setTrackingNumber('');
                              }}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            배송 정보 입력
                          </button>
                        )}
                      </>
                    )}
                    {order.status === 'SHIPPED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                        disabled={updating}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        배송 완료
                      </button>
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