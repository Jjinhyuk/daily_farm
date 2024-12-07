'use client'

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: string
}

// 기본 fallback 이미지 URL
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=500&auto=format&fit=crop'

export default function OptimizedImage({ 
  src, 
  alt, 
  fallback = DEFAULT_FALLBACK,
  className = '',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        )}
      </AnimatePresence>
      
      <Image
        src={error ? fallback : src}
        alt={alt}
        {...props}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={80}
        priority={props.priority}
      />
    </div>
  )
} 