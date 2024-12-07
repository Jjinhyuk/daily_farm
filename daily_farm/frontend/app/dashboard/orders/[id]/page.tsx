'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

// 임시 데이터
const order = {
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
      image: '/images/test.png',
    }
  ],
  total: 45000,
  status: '신규 주문',
  paymentStatus: '결제 완료',
  paymentMethod: '신용카드',
  shippingAddress: '서울시 강남구 테헤란로 123',
  shippingInfo: {
    carrier: 'CJ대한통운',
    trackingNumber: '',
  },
}

const statusColors = {
  '신규 주문': 'bg-yellow-100 text-yellow-800',
  '주문 확인': 'bg-blue-100 text-blue-800',
  '배송 준비중': 'bg-indigo-100 text-indigo-800',
  '배송중': 'bg-purple-100 text-purple-800',
  '배송 완료': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
} as const

type OrderStatus = keyof typeof statusColors

export default function OrderDetailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus)
  const [trackingNumber, setTrackingNumber] = useState(order.shippingInfo.trackingNumber)
  const [isEditing, setIsEditing] = useState(false)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus)
    // TODO: API 연동
  }

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">주문 상세</h1>
            <p className="mt-2 text-sm text-gray-700">
              주문번호: {order.orderNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 주문 정보 */}
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">주문 정보</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">주문 상태</span>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                      className="rounded-md border-gray-300 text-sm focus:border-green-500 focus:ring-green-500"
                    >
                      {Object.keys(statusColors).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">주문일시</span>
                    <span className="text-sm text-gray-900">{order.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">결제 상태</span>
                    <span className="text-sm text-gray-900">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">결제 수단</span>
                    <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">배송 정보</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TruckIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{order.shippingInfo.carrier}</span>
                    </div>
                    {isEditing ? (
                      <form onSubmit={handleTrackingSubmit} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="운송장 번호 입력"
                          className="rounded-md border-gray-300 text-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        >
                          저장
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        {trackingNumber ? '운송장 수정' : '운송장 입력'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 고객 및 상품 정보 */}
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">고객 정보</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{order.customer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">주문 상품</h2>
                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity}개</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₩{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">총 금액</span>
                      <span className="text-base font-medium text-gray-900">
                        ₩{order.total.toLocaleString()}
                      </span>
                    </div>
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