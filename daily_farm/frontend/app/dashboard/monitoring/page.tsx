'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { 
  ChartBarIcon, 
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import type { ChartData, ChartOptions } from 'chart.js'

const LineChart = dynamic(() => import('../../components/charts/Line'), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading chart...</div>
})

// 차트 데이터 타입 정의
interface ChartDataSet {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    tension: number
  }[]
}

// 임시 데이터
const historicalData: Record<string, ChartData<'line'>> = {
  temperature: {
    labels: ['1일', '2일', '3일', '4일', '5일', '6일', '7일'],
    datasets: [
      {
        label: '온도 (°C)',
        data: [22, 23, 21, 24, 22, 23, 24],
        borderColor: '#22c55e',
        tension: 0.3,
      },
    ],
  },
  humidity: {
    labels: ['1일', '2일', '3일', '4일', '5일', '6일', '7일'],
    datasets: [
      {
        label: '습도 (%)',
        data: [65, 63, 68, 64, 65, 67, 66],
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  },
  co2: {
    labels: ['1일', '2일', '3일', '4일', '5일', '6일', '7일'],
    datasets: [
      {
        label: 'CO2 (ppm)',
        data: [400, 420, 410, 430, 415, 425, 420],
        borderColor: '#ef4444',
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
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

export default function MonitoringPage() {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'co2'>('temperature')

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">스마트팜 모니터링</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* 메트릭 선택 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => setSelectedMetric('temperature')}
              className={`relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus:outline-none ${
                selectedMetric === 'temperature'
                  ? 'border-green-600 ring-2 ring-green-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">온도</p>
                <p className="truncate text-sm text-gray-500">현재 22°C</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('humidity')}
              className={`relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus:outline-none ${
                selectedMetric === 'humidity'
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">습도</p>
                <p className="truncate text-sm text-gray-500">현재 65%</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('co2')}
              className={`relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus:outline-none ${
                selectedMetric === 'co2'
                  ? 'border-red-600 ring-2 ring-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex-shrink-0">
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">CO2</p>
                <p className="truncate text-sm text-gray-500">현재 420ppm</p>
              </div>
            </button>
          </div>
        </div>

        {/* 차트 */}
        <div className="mt-8">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {selectedMetric === 'temperature' && '온도 변화'}
                    {selectedMetric === 'humidity' && '습도 변화'}
                    {selectedMetric === 'co2' && 'CO2 변화'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">최근 7일간의 변화 추이</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="h-80">
                  <LineChart
                    data={historicalData[selectedMetric]}
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