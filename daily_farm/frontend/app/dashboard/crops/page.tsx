'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

// 임시 데이터
const crops = [
  {
    id: 1,
    name: '방울토마토',
    status: '수확 중',
    plantedDate: '2023-12-01',
    harvestDate: '2024-01-15',
    temperature: '25°C',
    humidity: '65%',
    image: '/images/test.png',
    price: 15000,
    stock: 100,
  },
  {
    id: 2,
    name: '파프리카',
    status: '생육 중',
    plantedDate: '2023-12-15',
    harvestDate: '2024-02-01',
    temperature: '23°C',
    humidity: '60%',
    image: '/images/test.png',
    price: 8000,
    stock: 0,
  },
  {
    id: 3,
    name: '오이',
    status: '파종',
    plantedDate: '2024-01-01',
    harvestDate: '2024-02-15',
    temperature: '22°C',
    humidity: '70%',
    image: '/images/test.png',
    price: 4000,
    stock: 50,
  },
]

const statusColors = {
  '수확 중': 'bg-green-100 text-green-800',
  '생육 중': 'bg-blue-100 text-blue-800',
  '파종': 'bg-yellow-100 text-yellow-800',
}

export default function CropsPage() {
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredCrops = filterStatus === 'all' 
    ? crops 
    : crops.filter(crop => crop.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">작물 관리</h1>
            <p className="mt-2 text-sm text-gray-700">
              현재 재배 중인 작물 목록과 상태를 확인하고 관리할 수 있습니다.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/dashboard/crops/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              새 작물 등록
            </Link>
          </div>
        </div>

        {/* 필터 */}
        <div className="mt-4 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            >
              <option value="all">전체 보기</option>
              <option value="수확 중">수확 중</option>
              <option value="생육 중">생육 중</option>
              <option value="파종">파종</option>
            </select>
          </div>
        </div>

        {/* 작물 목록 */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={crop.image}
                    alt={crop.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/crops/${crop.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-lg font-medium text-gray-900">{crop.name}</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[crop.status]}`}>
                        {crop.status}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">파종일</p>
                  <p className="mt-1 font-medium text-gray-900">{crop.plantedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">예상 수확일</p>
                  <p className="mt-1 font-medium text-gray-900">{crop.harvestDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">온도</p>
                  <p className="mt-1 font-medium text-gray-900">{crop.temperature}</p>
                </div>
                <div>
                  <p className="text-gray-500">습도</p>
                  <p className="mt-1 font-medium text-gray-900">{crop.humidity}</p>
                </div>
                <div>
                  <p className="text-gray-500">판매가</p>
                  <p className="mt-1 font-medium text-gray-900">₩{crop.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">재고</p>
                  <p className="mt-1 font-medium text-gray-900">{crop.stock}kg</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 