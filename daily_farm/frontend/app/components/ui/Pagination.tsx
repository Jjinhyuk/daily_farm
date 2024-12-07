'use client'

import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const maxVisiblePages = 5

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) return pages

    const start = Math.max(
      Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1),
      1
    )
    const end = Math.min(start + maxVisiblePages - 1, totalPages)

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
          이전
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                currentPage === 1
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              currentPage === page
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                currentPage === totalPages
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
          <ChevronRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
} 