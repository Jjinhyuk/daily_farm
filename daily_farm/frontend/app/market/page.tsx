'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAvailableCrops } from '@/app/lib/api'
import { toast } from 'react-hot-toast'
import { Crop, CropStatus } from '@/app/types'

export default function MarketPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableCrops();
        setCrops(data);
      } catch (error) {
        console.error('Error fetching crops:', error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('작물 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const sortedCrops = [...crops].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price_per_unit - b.price_per_unit;
      case 'price_high':
        return b.price_per_unit - a.price_per_unit;
      case 'rating':
        return (b.average_rating || 0) - (a.average_rating || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const filteredCrops = sortedCrops.filter(crop => {
    if (region === 'all') return true;
    return crop.farmer.farm_location.includes(region);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">신선한 작물 마켓</h2>
          <div className="flex gap-4">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="price_low">가격 낮은순</option>
              <option value="price_high">가격 높은순</option>
              <option value="rating">평점순</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="all">전체 지역</option>
              <option value="충청">충청도</option>
              <option value="전라">전라도</option>
              <option value="경상">경상도</option>
              <option value="강원">강원도</option>
              <option value="제주">제주도</option>
            </select>
          </div>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">현재 판매 중인 작물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {filteredCrops.map((crop) => (
              <Link key={crop.id} href={`/market/${crop.id}`} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <div className="relative h-full w-full">
                    {crop.images && crop.images.length > 0 ? (
                      <Image
                        src={crop.images[0]}
                        alt={crop.name}
                        fill
                        className="object-cover object-center group-hover:opacity-75"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <span className="text-gray-400">이미지 없음</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm text-gray-700">{crop.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-lg font-medium text-gray-900">
                      {crop.price_per_unit.toLocaleString()}원/{crop.unit}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-500">
                        {crop.average_rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{crop.farmer.farm_name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 