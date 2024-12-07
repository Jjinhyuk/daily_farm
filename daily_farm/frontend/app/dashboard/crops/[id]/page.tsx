'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useNotification } from '../../../context/NotificationContext';
import { Crop } from '../../../types';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Alert from '../../../components/ui/Alert';
import Image from 'next/image';

export default function CropDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { showNotification } = useNotification();
  
  const [crop, setCrop] = useState<Crop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.user_type !== 'FARMER') {
      router.push('/');
      return;
    }

    fetchCrop();
  }, [user, router, params.id]);

  const fetchCrop = async () => {
    try {
      setIsLoading(true);
      const cropData = await api.getCropById(Number(params.id));
      setCrop(cropData);
      setImagePreviewUrls(cropData.images);
    } catch (err: any) {
      setError(err.message || '작물 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviewUrls.length > 5) {
      showNotification('error', '이미지는 최대 5개까지 등록할 수 있습니다.');
      return;
    }

    setNewImages([...newImages, ...files]);

    // 이미지 미리보기 생성
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!crop) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      
      // 기존 이미지 정보 추가
      crop.images.forEach((image, index) => {
        formData.append(`existing_images[${index}]`, image);
      });

      // 새 이미지 추가
      newImages.forEach((file) => {
        formData.append('new_images', file);
      });

      await api.updateCrop(crop.id, formData);
      showNotification('success', '작물 정보가 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
      fetchCrop();
    } catch (error: any) {
      showNotification('error', error.message || '작물 정보 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!crop || !confirm('정말로 이 작물을 삭제하시겠습니까?')) return;

    try {
      setIsSubmitting(true);
      await api.deleteCrop(crop.id);
      showNotification('success', '작물이 성공적으로 삭제되었습니다.');
      router.push('/dashboard/crops');
    } catch (error: any) {
      showNotification('error', error.message || '작물 삭제에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || '작물을 찾을 수 없습니다.'} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? '작물 정보 수정' : '작물 상세 정보'}
          </h1>
          <div className="flex space-x-3">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  작물명
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={crop.name}
                  disabled={!isEditing}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  defaultValue={crop.description}
                  disabled={!isEditing}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700">
                    단가
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="price_per_unit"
                      id="price_per_unit"
                      defaultValue={crop.price_per_unit}
                      disabled={!isEditing}
                      required
                      min="0"
                      className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">원</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    단위
                  </label>
                  <select
                    name="unit"
                    id="unit"
                    defaultValue={crop.unit}
                    disabled={!isEditing}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="개">개</option>
                    <option value="박스">박스</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700">
                  재고 수량
                </label>
                <input
                  type="number"
                  name="quantity_available"
                  id="quantity_available"
                  defaultValue={crop.quantity_available}
                  disabled={!isEditing}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* 재배 정보 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">재배 정보</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="planting_date" className="block text-sm font-medium text-gray-700">
                    파종일
                  </label>
                  <input
                    type="date"
                    name="planting_date"
                    id="planting_date"
                    defaultValue={crop.planting_date}
                    disabled={!isEditing}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="expected_harvest_date" className="block text-sm font-medium text-gray-700">
                    예상 수확일
                  </label>
                  <input
                    type="date"
                    name="expected_harvest_date"
                    id="expected_harvest_date"
                    defaultValue={crop.expected_harvest_date}
                    disabled={!isEditing}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                    온도 (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    id="temperature"
                    defaultValue={crop.temperature}
                    disabled={!isEditing}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="humidity" className="block text-sm font-medium text-gray-700">
                    습도 (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    id="humidity"
                    defaultValue={crop.humidity}
                    disabled={!isEditing}
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="soil_ph" className="block text-sm font-medium text-gray-700">
                    토양 pH
                  </label>
                  <input
                    type="number"
                    name="soil_ph"
                    id="soil_ph"
                    defaultValue={crop.soil_ph}
                    disabled={!isEditing}
                    step="0.1"
                    min="0"
                    max="14"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">이미지</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    작물 이미지 (최대 5개)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <span>이미지 업로드</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">또는 드래그 앤 드롭</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-5 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={96}
                          height={96}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
                            if (index >= crop.images.length) {
                              setNewImages(newImages.filter((_, i) => i !== (index - crop.images.length)));
                            }
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {crop.images.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`${crop.name} ${index + 1}`}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewImages([]);
                  setImagePreviewUrls(crop.images);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 