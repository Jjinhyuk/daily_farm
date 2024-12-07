'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '../../lib/api';
import { Crop, CropStatus, Review } from '../../types';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';
import ImageGallery from '@/app/components/market/ImageGallery';
import ReviewForm from '@/app/components/market/ReviewForm';
import ReviewManager from '@/app/components/market/ReviewManager';

const REVIEWS_PER_PAGE = 5;

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  const [crop, setCrop] = useState<Crop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cropId = Number(params.id);
        
        const [cropData, reviewsData] = await Promise.all([
          apiClient.getCropById(cropId),
          apiClient.getCropReviews(cropId, { page: currentPage, limit: REVIEWS_PER_PAGE })
        ]);

        setCrop(cropData);
        setReviews(reviewsData.reviews);
        setTotalPages(reviewsData.total_pages);
      } catch (err: any) {
        setError(err.message || '작물 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, currentPage]);

  const handleAddToCart = async (quantity: number) => {
    if (!crop) return;

    try {
      await addItem(crop.id, quantity);
      showNotification('success', '장바구니에 추가되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '장바구니에 추가하는데 실패했습니다.');
    }
  };

  const handleSubmitReview = async (rating: number, content: string) => {
    if (!crop) return;

    try {
      setIsSubmittingReview(true);
      await apiClient.createReview({
        crop_id: crop.id,
        rating,
        content,
      });
      
      // 리뷰 목록 새로고침
      const reviewsData = await apiClient.getCropReviews(crop.id, {
        page: currentPage,
        limit: REVIEWS_PER_PAGE,
      });

      setReviews(reviewsData.reviews);
      setTotalPages(reviewsData.total_pages);
      setRating(0);
      setContent('');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/market')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageGallery images={crop.images} alt={crop.name} />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{crop.name}</h1>
          <p className="text-gray-600 mb-6">{crop.description}</p>
          
          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">가격</span>
              <span className="text-2xl font-bold text-primary">
                {crop.price_per_unit.toLocaleString()}원/{crop.unit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">농장</span>
              <span>{crop.farmer.farm_name || crop.farmer.full_name}</span>
            </div>
          </div>

          {crop.status === CropStatus.SOLD ? (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
              품절된 상품입니다
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                defaultValue="1"
                max={crop.quantity_available}
                className="w-20 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => handleAddToCart(1)}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-600"
              >
                장바구니 담기
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">상품 리뷰</h2>
        
        {user && (
          <div className="mb-8">
            <ReviewForm
              onSubmit={handleSubmitReview}
              isSubmitting={isSubmittingReview}
            />
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewManager
                  key={review.id}
                  review={review}
                  onUpdate={async () => {
                    const reviewsData = await apiClient.getCropReviews(Number(params.id), {
                      page: currentPage,
                      limit: REVIEWS_PER_PAGE,
                    });
                    setReviews(reviewsData.reviews);
                    setTotalPages(reviewsData.total_pages);
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        px-4 py-2 rounded
                        ${pageNum === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 