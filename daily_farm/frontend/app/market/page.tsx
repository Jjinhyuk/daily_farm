'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '../lib/api';
import type { Crop, CropStatus, SortOption } from '../types';
import Card from '@/app/components/ui/Card';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Alert from '@/app/components/ui/Alert';
import FilterBar from '@/app/components/market/FilterBar';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 12;

export default function MarketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // 필터 상태
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<CropStatus | ''>(
    (searchParams.get('status') as CropStatus | '') || ''
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined
  );
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');

  const debouncedSearch = useDebounce(searchValue, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.getCrops({
          page,
          limit: ITEMS_PER_PAGE,
          status: selectedStatus || undefined,
          search: debouncedSearch || undefined,
          sort_by: selectedSort,
          min_price: debouncedMinPrice,
          max_price: debouncedMaxPrice,
          region: selectedRegion || undefined,
        });
        setCrops(response.items);
        setTotalPages(response.total_pages);
      } catch (err: any) {
        setError(err.message || '작물 목록을 불러오는데 실패했습니다.');
        setCrops([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, [
    page,
    selectedStatus,
    debouncedSearch,
    selectedSort,
    debouncedMinPrice,
    debouncedMaxPrice,
    selectedRegion,
  ]);

  const updateQueryParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 페이지 파라미터 초기화 (필터 변경 시)
    if (!('page' in updates)) {
      params.delete('page');
    }

    // 업데이트할 파라미터 설정
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/market?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateQueryParams({ search: value || undefined });
  };

  const handleStatusChange = (status: CropStatus | '') => {
    setSelectedStatus(status);
    updateQueryParams({ status: status || undefined });
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    updateQueryParams({ sort_by: sort });
  };

  const handlePriceRangeChange = (min: number | undefined, max: number | undefined) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateQueryParams({
      min_price: min?.toString(),
      max_price: max?.toString(),
    });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    updateQueryParams({ region: region || undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">농산물 마켓</h1>
      </div>

      <FilterBar
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onPriceRangeChange={handlePriceRangeChange}
        onRegionChange={handleRegionChange}
        searchValue={searchValue}
        selectedStatus={selectedStatus}
        selectedSort={selectedSort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedRegion={selectedRegion}
      />

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {crops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {error ? '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' : '등록된 농산물이 없습니다.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {crops.map((crop) => (
              <Card
                key={crop.id}
                title={crop.name}
                description={crop.description}
                imageUrl={crop.images[0]}
                imageAlt={`${crop.name} 이미지`}
                badge={crop.status === 'HARVESTED' ? '수확 완료' : undefined}
                footer={
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-semibold">
                      {crop.price_per_unit.toLocaleString()}원/{crop.unit}
                    </span>
                    <span className="text-sm text-gray-500">
                      {crop.farmer.farm_name || crop.farmer.full_name}
                    </span>
                  </div>
                }
                onClick={() => router.push(`/market/${crop.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`
                      px-4 py-2 rounded
                      ${pageNum === page
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {pageNum}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 