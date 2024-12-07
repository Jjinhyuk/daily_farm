'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  CurrencyDollarIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  CogIcon
} from '@heroicons/react/24/outline'

// 임시 데이터
const stats = [
  { name: '총 주문', value: '24', change: '+4.75%', changeType: 'positive' },
  { name: '이번 달 매출', value: '₩2,450,000', change: '+10.18%', changeType: 'positive' },
  { name: '재배 중인 작물', value: '12', change: '0', changeType: 'neutral' },
  { name: '평균 평점', value: '4.8', change: '+0.3', changeType: 'positive' },
]

const recentOrders = [
  {
    id: 1,
    product: '방울토마토',
    customer: '김철수',
    amount: '₩45,000',
    status: '배송 준비중',
    date: '2024-01-05',
  },
  {
    id: 2,
    product: '파프리카',
    customer: '이영희',
    amount: '₩32,000',
    status: '주문 확인',
    date: '2024-01-05',
  },
  {
    id: 3,
    product: '오이',
    customer: '박지민',
    amount: '₩28,000',
    status: '배송중',
    date: '2024-01-04',
  },
]

const navigationItems = [
  {
    name: '작물 관리',
    href: '/dashboard/crops',
    icon: BeakerIcon,
    description: '작물 상태 모니터링 및 관리',
  },
  {
    name: '주문 관리',
    href: '/dashboard/orders',
    icon: ClipboardDocumentListIcon,
    description: '주문 확인 및 배송 관리',
  },
  {
    name: '스마트팜 모니터링',
    href: '/dashboard/monitoring',
    icon: ChartBarIcon,
    description: '실시간 환경 데이터 모니터링',
  },
  {
    name: '매출 관리',
    href: '/dashboard/sales',
    icon: CurrencyDollarIcon,
    description: '매출 통계 및 분석',
  },
  {
    name: '메시지',
    href: '/dashboard/messages',
    icon: ChatBubbleLeftRightIcon,
    description: '고객 문의 및 메시지',
  },
  {
    name: '설정',
    href: '/dashboard/settings',
    icon: CogIcon,
    description: '농장 정보 및 계정 설정',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          
          {/* 통계 카드 */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
              >
                <dt>
                  <p className="truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="mt-1">
                  <p className="text-3xl font-semibold text-gray-900">{item.value}</p>
                  <p className={`mt-2 flex items-center text-sm ${
                    item.changeType === 'positive' ? 'text-green-600' : 
                    item.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {item.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* 메뉴 그리드 */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">관리 메뉴</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 최근 주문 */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">최근 주문</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-300 bg-white shadow">
              <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            상품
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            고객
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            금액
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            상태
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            날짜
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {order.product}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {order.customer}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {order.amount}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {order.status}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {order.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 