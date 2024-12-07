'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Cart, CartItem } from '../types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;

    setLoading(true);

    try {
      // 농장별로 주문 아이템 그룹화
      const farmerOrders = new Map<number, { crop_id: number; quantity: number }[]>();
      
      cart.items.forEach((item: CartItem) => {
        const farmerId = item.crop.farmer?.id;
        if (!farmerId) return;

        const farmerItems = farmerOrders.get(farmerId) || [];
        farmerItems.push({
          crop_id: item.crop_id,
          quantity: item.quantity,
        });
        farmerOrders.set(farmerId, farmerItems);
      });

      // 각 농장별로 주문 생성
      const promises = Array.from(farmerOrders.entries()).map(([farmerId, items]) => 
        createOrder({
          items,
          delivery_address: address,
          delivery_contact: contact,
        })
      );

      await Promise.all(promises);
      await clearCart();
      toast.success('주문이 완료되었습니다.');
      router.push('/orders');
    } catch (error) {
      toast.error('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">주문하기</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">배송 정보</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                배송지 주소
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="배송받으실 주소를 입력해주세요"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium mb-1">
                연락처
              </label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="연락 가능한 전화번호를 입력해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !address || !contact}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '주문 처리 중...' : '주문하기'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
          <div className="space-y-4">
            {cart.items.map((item: CartItem) => (
              <div key={item.id} className="flex gap-4 py-4 border-b">
                <div className="flex-1">
                  <h3 className="font-medium">{item.crop.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.crop.unit} × {item.crop.price_per_unit.toLocaleString()}원
                  </p>
                  <p className="text-sm text-gray-600">
                    농장: {item.crop.farmer?.farm_name || item.crop.farmer?.full_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.total_price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">총 결제금액</span>
                <span className="text-xl font-bold text-blue-600">
                  {cart.total_price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 