'use client'

import React from 'react'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:shadow-lg"
    >
      메인 콘텐츠로 바로가기
    </a>
  )
} 