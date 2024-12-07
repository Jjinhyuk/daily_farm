'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: Record<string, any>) => void
  filterOptions?: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
}

export default function SearchFilter({ onSearch, onFilter, filterOptions = [] }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = {
      ...activeFilters,
      [key]: value,
    }
    setActiveFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            placeholder="검색..."
          />
        </div>

        {/* Filter button */}
        {filterOptions.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FunnelIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              필터
            </button>

            {/* Filter dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  {filterOptions.map((filter) => (
                    <div key={filter.key} className="mb-4 last:mb-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {filter.label}
                      </label>
                      <select
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">전체</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 