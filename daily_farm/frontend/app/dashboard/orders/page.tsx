'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

// 임시 데이터
const orders = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    date: '2024-01-05',
    customer: {
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
    },
    items: [
      {
        id: 1,
        name: '방울토마토',
        quantity: 3,
        price: 15000,
      }
    ],
    total: 45000,
    status: '신규 주문',
    paymentStatus: '결제 완료',
    shippingAddress: '서울시 강남구 테헤란로 123',
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    date: '2024-01-05',
    customer: {
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
    },
    items: [
      {
        id: 2,
        name: '파프리카',
        quantity: 2,
        price: 8000,
      },
      {
        id: 3,
        name: '오이',
        quantity: 1,
        price: 4000,
      }
    ],
    total: 20000,
    status: '배송 준비중',
    paymentStatus: '결제 완료',
    shippingAddress: '경기도 성남시 분당구 판교로 456',
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    date: '2024-01-04',
    customer: {
      name: '박지민',
      email: 'park@example.com',
      phone: '010-3456-7890',
    },
    items: [
      {
        id: 1,
        name: '방울토마토',
        quantity: 2,
        price: 15000,
      }
    ],
    total: 30000,
    status: '배송중',
    paymentStatus: '결제 완료',
    shippingAddress: '부산시 해운대구 해운대로 789',
  },
]

const statusColors = {
  '신규 주문': 'bg-yellow-100 text-yellow-800',
  '주문 확인': 'bg-blue-100 text-blue-800',
  '배송 준비중': 'bg-indigo-100 text-indigo-800',
  '배송중': 'bg-purple-100 text-purple-800',
  '배송 완료': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
} as const

type OrderStatus = keyof typeof statusColors

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .filter(order => 
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">주문 관리</h1>
            <p className="mt-2 text-sm text-gray-700">
              모든 주문 내역을 확인하고 관리할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="mt-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="주문번호 또는 고객명 검색"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              >
                <option value="all">전체 보기</option>
                <option value="신규 주문">신규 주문</option>
                <option value="주문 확인">주문 확인</option>
                <option value="배송 준비중">배송 준비중</option>
                <option value="배송중">배송중</option>
                <option value="배송 완료">배송 완료</option>
                <option value="취소">취소</option>
              </select>
            </div>
          </div>
        </div>

        {/* 주문 목록 */}
        <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id}>
                <Link href={`/dashboard/orders/${order.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <p className="truncate text-sm font-medium text-green-600">
                          {order.orderNumber}
                        </p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status as OrderStatus]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="text-sm font-medium text-gray-900">₩{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.customer.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {order.items.map(item => item.name).join(', ')}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {order.date}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 