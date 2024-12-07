'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import type { ChartData, ChartOptions } from 'chart.js'

const LineChart = dynamic(() => import('../../components/charts/Line'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading chart...</div>
})

type TimeRange = 'day' | 'week' | 'month' | 'year'

// 임시 데이터
const salesData: Record<TimeRange, ChartData<'line'>> = {
  day: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: '매출',
        data: [150000, 220000, 380000, 420000, 550000, 680000],
        borderColor: '#22c55e',
        tension: 0.3,
      },
    ],
  },
  week: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '매출',
        data: [2500000, 2800000, 2600000, 3100000, 3500000, 4200000, 3800000],
        borderColor: '#22c55e',
        tension: 0.3,
      },
    ],
  },
  month: {
    labels: ['1주', '2주', '3주', '4주'],
    datasets: [
      {
        label: '매출',
        data: [12000000, 15000000, 13500000, 16000000],
        borderColor: '#22c55e',
        tension: 0.3,
      },
    ],
  },
  year: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '매출',
        data: [
          45000000, 48000000, 52000000, 49000000, 53000000, 58000000,
          62000000, 60000000, 55000000, 57000000, 60000000, 63000000,
        ],
        borderColor: '#22c55e',
        tension: 0.3,
      },
    ],
  },
}

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(tickValue: number | string, index: number, ticks) {
          const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue
          return `₩${value.toLocaleString()}`
        },
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let value = context.parsed.y
          return `₩${value.toLocaleString()}`
        },
      },
    },
  },
}

export default function SalesPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">매출 관리</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* 통계 카드 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">총 매출</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">₩15,300,000</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">총 주문</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">328건</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">신규 고객</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">45명</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">평균 주문액</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">₩46,600</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="mt-8">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">매출 추이</h3>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
                  >
                    <option value="day">일간</option>
                    <option value="week">주간</option>
                    <option value="month">월간</option>
                    <option value="year">연간</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <div className="h-80">
                  <LineChart
                    data={salesData[timeRange]}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 