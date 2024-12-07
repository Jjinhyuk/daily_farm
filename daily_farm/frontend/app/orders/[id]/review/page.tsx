'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getOrder, createReview } from '@/app/lib/api';
import { toast } from 'react-hot-toast';
import { Order, OrderItem } from '@/app/types';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(parseInt(params.id));
      if (data.status !== 'DELIVERED') {
        toast.error('배송 완료된 주문만 리뷰를 작성할 수 있습니다.');
        router.push('/orders');
        return;
      }
      setOrder(data);
      if (data.items.length === 1) {
        setSelectedCrop(data.items[0]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '주문 정보를 불러오는데 실패했습니다.');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) {
      toast.error('리뷰를 작성할 작물을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      toast.error('리뷰 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        crop_id: selectedCrop.crop.id,
        order_id: parseInt(params.id),
        rating,
        content: content.trim()
      });
      toast.success('리뷰가 작성되었습니다.');
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '리뷰 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">주문을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">리뷰 작성</h1>
      
      {order.items.length > 1 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">리뷰를 작성할 작물 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCrop(item)}
                className={`p-4 border rounded-lg ${
                  selectedCrop?.id === item.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-500'
                }`}
              >
                <div className="relative h-40 mb-2">
                  <Image
                    src={item.crop.images[0] || '/placeholder.png'}
                    alt={item.crop.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="font-semibold">{item.crop.name}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} {item.crop.unit}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedCrop && (
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="relative w-20 h-20">
              <Image
                src={selectedCrop.crop.images[0] || '/placeholder.png'}
                alt={selectedCrop.crop.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div>
              <div className="font-semibold">{selectedCrop.crop.name}</div>
              <div className="text-sm text-gray-500">
                {selectedCrop.quantity} {selectedCrop.crop.unit}
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            별점
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-2xl ${
                  value <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            리뷰 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="작물에 대한 솔직한 리뷰를 작성해주세요"
          />
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white ${
            submitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting ? '처리 중...' : '리뷰 작성'}
        </button>
      </form>
    </div>
  );
} 