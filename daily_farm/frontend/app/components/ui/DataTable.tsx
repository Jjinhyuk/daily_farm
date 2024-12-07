'use client'

import React, { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import SearchFilter from './SearchFilter'
import Pagination from './Pagination'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  itemsPerPage?: number
  filterOptions?: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 10,
  filterOptions = [],
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [filteredData, setFilteredData] = useState(data)
  const [searchQuery, setSearchQuery] = useState('')

  // 정렬 처리
  const handleSort = (key: keyof T) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  // 검색 처리
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(query.toLowerCase())
      )
    )
    setFilteredData(filtered)
    setCurrentPage(1)
  }

  // 필터 처리
  const handleFilter = (filters: Record<string, any>) => {
    let filtered = data
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => item[key] === value)
      }
    })
    setFilteredData(filtered)
    setCurrentPage(1)
  }

  // 정렬된 데이터
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // 페이지네이션
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={filterOptions}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  {column.sortable ? (
                    <button
                      className="group inline-flex items-center gap-x-1"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      <span className="ml-2 flex-none rounded text-gray-400">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
} 