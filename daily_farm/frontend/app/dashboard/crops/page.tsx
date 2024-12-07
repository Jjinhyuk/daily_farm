'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Crop } from '../../types';
import api from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Link from 'next/link';
import Image from 'next/image';

export default function CropsManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.user_type !== 'FARMER') {
      router.push('/');
      return;
    }

    fetchCrops();
  }, [user, router]);

  const fetchCrops = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCrops({ farmer_id: user?.id });
      setCrops(response.items);
    } catch (err: any) {
      setError(err.message || '작물 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">작물 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            등록한 작물들을 관리하고 새로운 작물을 등록할 수 있습니다.
          </p>
        </div>
        <Link
          href="/dashboard/crops/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          새 작물 등록
        </Link>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 작물이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">새로운 작물을 등록해보세요.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/crops/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              새 작물 등록
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => (
            <Link
              key={crop.id}
              href={`/dashboard/crops/${crop.id}`}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-3 aspect-h-2">
                  <Image
                    src={crop.images[0] || '/images/default-crop.jpg'}
                    alt={crop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {crop.price_per_unit.toLocaleString()}원/{crop.unit}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        crop.status === 'GROWING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : crop.status === 'HARVESTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {crop.status === 'GROWING'
                        ? '재배중'
                        : crop.status === 'HARVESTED'
                        ? '수확완료'
                        : '판매완료'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{crop.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>재고: {crop.quantity_available}{crop.unit}</span>
                      <span>등록일: {new Date(crop.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 