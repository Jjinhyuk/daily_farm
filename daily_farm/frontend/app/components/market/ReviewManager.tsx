import React, { useState } from 'react';
import Image from 'next/image';
import { Review } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import { useNotification } from '@/app/context/NotificationContext';
import apiClient from '@/app/lib/api';

interface ReviewManagerProps {
  review: Review;
  onUpdate: () => Promise<void>;
}

export default function ReviewManager({ review, onUpdate }: ReviewManagerProps) {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      showNotification('warning', '리뷰 내용을 10자 이상 작성해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.updateReview(review.id, { rating, content });
      await onUpdate();
      setIsEditing(false);
      showNotification('success', '리뷰가 수정되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '리뷰 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      setIsSubmitting(true);
      await apiClient.deleteReview(review.id);
      await onUpdate();
      showNotification('success', '리뷰가 삭제되었습니다.');
    } catch (err: any) {
      showNotification('error', err.message || '리뷰 삭제에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.id !== review.user_id) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {review.user.profile_image && (
              <Image
                src={review.user.profile_image}
                alt={review.user.full_name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{review.user.full_name}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-700">{review.content}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {review.user.profile_image && (
            <Image
              src={review.user.profile_image}
              alt={review.user.full_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{review.user.full_name}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-primary"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-red-500"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEdit} className="space-y-4">
          {/* 별점 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              별점
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="text-2xl focus:outline-none"
                >
                  <span
                    className={
                      value <= (hoveredRating ?? rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <label
              htmlFor="review-content"
              className="block text-sm font-medium text-gray-700"
            >
              리뷰 내용
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="리뷰를 작성해주세요. (최소 10자)"
              disabled={isSubmitting}
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setRating(review.rating);
                setContent(review.content);
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || content.trim().length < 10}
              className={`
                px-4 py-2 rounded-lg text-white font-medium
                ${isSubmitting || content.trim().length < 10
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-600'}
              `}
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-700">{review.content}</p>
        </>
      )}
    </div>
  );
} 