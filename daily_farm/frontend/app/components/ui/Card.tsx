import React from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  imageAlt?: string;
  badge?: string;
}

export default function Card({
  title,
  description,
  imageUrl,
  footer,
  onClick,
  className = '',
  isLoading = false,
  imageAlt,
  badge,
}: CardProps) {
  const cardContent = (
    <>
      {imageUrl && (
        <div className="relative h-48 w-full group">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {badge && (
            <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm overflow-hidden text-ellipsis"
             style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {description}
          </p>
        )}
      </div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div
        className={`
          bg-white
          rounded-lg
          shadow-md
          overflow-hidden
          animate-pulse
          ${className}
        `}
      >
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        {footer && <div className="h-16 bg-gray-100" />}
      </div>
    );
  }

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`
        bg-white
        rounded-lg
        shadow-md
        overflow-hidden
        transition-all
        duration-200
        hover:shadow-lg
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {cardContent}
    </Component>
  );
} 