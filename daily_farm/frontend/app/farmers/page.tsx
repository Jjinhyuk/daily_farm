import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const farmers = [
  {
    id: 1,
    name: '행복한 농장',
    owner: '김농부',
    location: '전라남도 나주시',
    experience: '10년',
    mainCrops: ['방울토마토', '파프리카', '오이'],
    certification: ['무농약 인증', '친환경 농산물 인증'],
    description: '자연과 함께하는 친환경 농법으로 건강한 작물을 재배합니다.',
    image: '/images/test.png',
    rating: 4.8,
    reviewCount: 128,
  },
  {
    id: 2,
    name: '초록 농원',
    owner: '이농부',
    location: '충청남도 부여군',
    experience: '15년',
    mainCrops: ['상추', '깻잎', '쌈채소'],
    certification: ['유기농 인증'],
    description: '정성을 다해 기른 신선한 채소를 제공합니다.',
    image: '/images/test.png',
    rating: 4.9,
    reviewCount: 95,
  },
  {
    id: 3,
    name: '산들 농장',
    owner: '박농부',
    location: '강원도 평창군',
    experience: '8년',
    mainCrops: ['감자', '당근', '양배추'],
    certification: ['GAP 인증', '친환경 농산물 인증'],
    description: '깨끗한 자연 환경에서 건강한 작물을 재배합니다.',
    image: '/images/test.png',
    rating: 4.7,
    reviewCount: 73,
  },
  {
    id: 4,
    name: '해피 팜',
    owner: '최농부',
    location: '제주특별자치도',
    experience: '12년',
    mainCrops: ['당근', '브로콜리', '양상추'],
    certification: ['유기농 인증', 'GAP 인증'],
    description: '제주의 깨끗한 환경에서 자란 신선한 채소를 제공합니다.',
    image: '/images/test.png',
    rating: 4.9,
    reviewCount: 156,
  },
]

export default function FarmersPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">농가 목록</h2>
            <p className="mt-2 text-sm text-gray-600">신뢰할 수 있는 농가들을 만나보세요</p>
          </div>
          <div className="flex gap-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
              <option>평점순</option>
              <option>리뷰 많은순</option>
              <option>경력순</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
              <option>전체 지역</option>
              <option>충청도</option>
              <option>전라도</option>
              <option>경상도</option>
              <option>강원도</option>
              <option>제주도</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {farmers.map((farmer) => (
            <Link key={farmer.id} href={`/farmers/${farmer.id}`} className="group">
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="aspect-h-1 aspect-w-2 overflow-hidden">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    fill
                    className="object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{farmer.location}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600">★</span>
                      <span className="ml-1 text-sm font-medium text-gray-900">{farmer.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({farmer.reviewCount})</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{farmer.description}</p>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
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
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">주요 작물</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {farmer.mainCrops.map((crop) => (
                        <span
                          key={crop}
                          className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>영농 경력: {farmer.experience}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 