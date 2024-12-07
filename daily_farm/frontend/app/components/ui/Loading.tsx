'use client'

import React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-16 w-16">
          <div className="absolute h-16 w-16 rounded-full border-4 border-solid border-gray-200"></div>
          <div className="absolute h-16 w-16 rounded-full border-4 border-solid border-green-600 border-t-transparent animate-spin"></div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">로딩중...</div>
      </div>
    </div>
  )
} 