import React from 'react';
import { CropStatus, SortOption } from '../../types';

interface FilterBarProps {
  onSearch: (value: string) => void;
  onStatusChange: (status: CropStatus | '') => void;
  onSortChange: (sort: SortOption) => void;
  onPriceRangeChange: (min: number | undefined, max: number | undefined) => void;
  onRegionChange: (region: string) => void;
  searchValue: string;
  selectedStatus: CropStatus | '';
  selectedSort: SortOption;
  minPrice?: number;
  maxPrice?: number;
  selectedRegion: string;
}

export default function FilterBar({
  onSearch,
  onStatusChange,
  onSortChange,
  onPriceRangeChange,
  onRegionChange,
  searchValue,
  selectedStatus,
  selectedSort,
  minPrice,
  maxPrice,
  selectedRegion,
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* 검색 */}
      <div>
        <input
          type="text"
          placeholder="농산물 검색..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 상태 필터 */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as CropStatus | '')}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">전체 상태</option>
          <option value={CropStatus.GROWING}>재배 중</option>
          <option value={CropStatus.HARVESTED}>수확 완료</option>
          <option value={CropStatus.SOLD}>품절</option>
        </select>

        {/* 정렬 */}
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="latest">최신순</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
          <option value="rating">평점순</option>
        </select>

        {/* 가격 범위 */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="최소 가격"
            value={minPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              onPriceRangeChange(value, maxPrice);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="최대 가격"
            value={maxPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              onPriceRangeChange(minPrice, value);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 지역 필터 */}
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">전체 지역</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="강원">강원</option>
          <option value="충북">충북</option>
          <option value="충남">충남</option>
          <option value="전북">전북</option>
          <option value="전남">전남</option>
          <option value="경북">경북</option>
          <option value="경남">경남</option>
          <option value="제주">제주</option>
        </select>
      </div>
    </div>
  );
} 