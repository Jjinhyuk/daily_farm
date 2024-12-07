'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getCropById, addCartItem, getReviews } from '@/app/lib/api'
import { toast } from 'react-hot-toast'
import { Crop, Review } from '@/app/types'

interface CropDetail extends Omit<Crop, 'farmer'> {
  farmer: {
    id: number;
    full_name: string;
    farm_name: string | null;
    farm_location: string | null;
    farm_description: string | null;
  };
}

export default function CropDetailPage() {
  const params = useParams();
  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setIsLoading(true);
        const [cropData, reviewsData] = await Promise.all([
          getCropById(Number(params.id)),
          getReviews(Number(params.id))
        ]);
        setCrop(cropData as CropDetail);
        setReviews(reviewsData);
        if (cropData.images.length > 0) {
          setSelectedImage(cropData.images[0]);
        }
      } catch (err) {
        setError('작물 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch crop:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCrop();
    }
  }, [params.id]);

  const handleQuantityChange = (value: number) => {
    if (crop) {
      const newQuantity = Math.max(0.1, Math.min(value, crop.quantity_available));
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!crop) return;

    setAddingToCart(true);
    try {
      await addCartItem({
        crop_id: crop.id,
        quantity: quantity
      });
      toast.success('장바구니에 추가되었습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '장바구니에 추가하는데 실패했습니다.');
    } finally {
      setAddingToCart(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || '작물을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
          {/* 이미지 갤러리 */}
          <div className="space-y-4">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage || crop.images[0] || '/images/placeholder.png'}
                alt={crop.name}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {crop.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {crop.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg ${
                      selectedImage === image ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${crop.name} ${index + 1}`}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 작물 정보 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{crop.name}</h1>
              <p className="mt-4 text-gray-500">{crop.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-medium text-gray-900">
                  {crop.price_per_unit.toLocaleString()}원/{crop.unit}
                </div>
                <div className="text-sm text-gray-500">
                  재고: {crop.quantity_available} {crop.unit}
                </div>
              </div>
            </div>

            {/* 농장 정보 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900">농장 정보</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">농장 이름:</span> {crop.farmer.farm_name}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">농부:</span> {crop.farmer.full_name}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">위치:</span> {crop.farmer.farm_location}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">소개:</span> {crop.farmer.farm_description}
                </p>
              </div>
            </div>

            {/* 재배 정보 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900">재배 정보</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">재배 시작일:</span>
                    <br />
                    {new Date(crop.planting_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">예상 수확일:</span>
                    <br />
                    {new Date(crop.expected_harvest_date).toLocaleDateString()}
                  </p>
                </div>
                {crop.actual_harvest_date && (
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">실제 수확일:</span>
                      <br />
                      {new Date(crop.actual_harvest_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 재배 환경 */}
            {(crop.temperature || crop.humidity || crop.soil_ph) && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900">재배 환경</h2>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {crop.temperature && (
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">온도</span>
                        <br />
                        {crop.temperature}°C
                      </p>
                    </div>
                  )}
                  {crop.humidity && (
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">습도</span>
                        <br />
                        {crop.humidity}%
                      </p>
                    </div>
                  )}
                  {crop.soil_ph && (
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">토양 pH</span>
                        <br />
                        {crop.soil_ph}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">총 주문</span>
                    <br />
                    {crop.total_orders}건
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">평균 평점</span>
                    <br />
                    {crop.average_rating.toFixed(1)}점
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">총 리뷰</span>
                    <br />
                    {crop.total_reviews}개
                  </p>
                </div>
              </div>
            </div>

            {/* 구매 버튼 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => handleQuantityChange(quantity - 0.1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 min-w-[60px] text-center">
                    {quantity.toFixed(1)} {crop.unit}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 0.1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-lg font-semibold">
                  {(crop.price_per_unit * quantity).toLocaleString()}원
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`w-full py-3 rounded-lg text-white ${
                    addingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {addingToCart ? '처리 중...' : '장바구니 담기'}
                </button>
                <Link
                  href="/cart"
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                >
                  장바구니 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">리뷰</h2>
          <div className="flex items-center gap-2">
            <div className="text-2xl text-yellow-400">★</div>
            <div className="text-xl font-semibold">
              {getAverageRating().toFixed(1)}
            </div>
            <div className="text-gray-500">
              ({reviews.length}개의 리뷰)
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-10 h-10">
                    <Image
                      src={review.user.profile_image || '/placeholder-avatar.png'}
                      alt={review.user.full_name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {review.user.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      key={value}
                      className={`text-xl ${
                        value <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 whitespace-pre-line">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 