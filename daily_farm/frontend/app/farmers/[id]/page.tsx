import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 더미 데이터
const farmer = {
  id: 1,
  name: '행복한 농장',
  owner: '김농부',
  location: '전라남도 나주시',
  experience: '10년',
  mainCrops: ['방울토마토', '파프리카', '오이'],
  certification: ['무농약 인증', '친환경 농산물 인증'],
  description: '자연과 함께하는 친환경 농법으로 건강한 작물을 재배합니다.',
  images: ['/images/test.png', '/images/test.png', '/images/test.png'],
  rating: 4.8,
  reviewCount: 128,
  farmSize: '3,000평',
  establishedYear: '2014년',
  contact: {
    phone: '010-1234-5678',
    email: 'happy@farm.com',
  },
  facilities: [
    '스마트 온실',
    '자동 급수 시스템',
    '환경 모니터링 시스템',
    '저온 저장고',
  ],
  currentCrops: [
    {
      id: 1,
      name: '방울토마토',
      status: '수확 중',
      price: 15000,
      unit: '1kg',
      image: '/images/test.png',
    },
    {
      id: 2,
      name: '파프리카',
      status: '재배 중',
      price: 8000,
      unit: '500g',
      image: '/images/test.png',
    },
    {
      id: 3,
      name: '오이',
      status: '수확 예정',
      price: 4000,
      unit: '1kg',
      image: '/images/test.png',
    },
  ],
  reviews: [
    {
      id: 1,
      user: '홍길동',
      rating: 5,
      comment: '항상 신선하고 품질 좋은 농산물 감사합니다.',
      date: '2024-01-05',
    },
    {
      id: 2,
      user: '김철수',
      rating: 4,
      comment: '배송이 빠르고 신선해서 좋았어요.',
      date: '2024-01-03',
    },
  ],
}

export default function FarmerDetailPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 농장 기본 정보 */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <Image
              src={farmer.images[0]}
              alt={farmer.name}
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{farmer.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{farmer.location}</p>
              </div>
              <div className="flex items-center">
                <span className="text-green-600">★</span>
                <span className="ml-1 text-sm font-medium text-gray-900">{farmer.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({farmer.reviewCount} 리뷰)</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">농장 설명</h3>
              <div className="space-y-6 text-base text-gray-700">{farmer.description}</div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">대표자</h4>
                <p className="text-sm text-gray-900">{farmer.owner}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">영농 경력</h4>
                <p className="text-sm text-gray-900">{farmer.experience}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">농장 규모</h4>
                <p className="text-sm text-gray-900">{farmer.farmSize}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">설립연도</h4>
                <p className="text-sm text-gray-900">{farmer.establishedYear}</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900">보유 시설</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {farmer.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900">인증 현황</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {farmer.certification.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                className="flex-1 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                메시지 보내기
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-600 hover:bg-green-50"
              >
                연락처 보기
              </button>
            </div>
          </div>
        </div>

        {/* 현재 판매 중인 작물 */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">현재 판매 중인 작물</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {farmer.currentCrops.map((crop) => (
              <Link key={crop.id} href={`/market/${crop.id}`} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={crop.image}
                    alt={crop.name}
                    fill
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm text-gray-700">{crop.name}</h3>
                    <p className="text-sm font-medium text-gray-900">
                      {crop.price.toLocaleString()}원/{crop.unit}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{crop.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">농장 리뷰</h2>
          <div className="mt-6 space-y-6">
            {farmer.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-green-600' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="ml-3 text-sm font-medium text-gray-900">{review.user}</p>
                  <time className="ml-3 text-sm text-gray-500">{review.date}</time>
                </div>
                <p className="mt-4 text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 