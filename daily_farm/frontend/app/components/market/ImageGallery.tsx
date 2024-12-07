import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">이미지 없음</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div
        className={`
          relative aspect-square rounded-lg overflow-hidden bg-gray-100
          cursor-zoom-in
          transition-transform duration-300
          ${isZoomed ? 'scale-150' : ''}
        `}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* 썸네일 목록 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                ${index === selectedIndex
                  ? 'ring-2 ring-primary'
                  : 'hover:ring-2 hover:ring-gray-300'}
              `}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1} 썸네일`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 