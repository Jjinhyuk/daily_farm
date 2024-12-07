import React, { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (rating: number, content: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      alert('리뷰 내용을 10자 이상 작성해주세요.');
      return;
    }
    await onSubmit(rating, content);
    setContent('');
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting || content.trim().length < 10}
        className={`
          w-full py-2 rounded-lg text-white font-medium
          ${isSubmitting || content.trim().length < 10
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-600'}
        `}
      >
        {isSubmitting ? '등록 중...' : '리뷰 등록'}
      </button>
    </form>
  );
} 