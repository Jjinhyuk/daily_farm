'use client'

import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useNotification } from '../../../context/NotificationContext'
import api from '../../../lib/api'

export default function NewCropPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { showNotification } = useNotification()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      showNotification('error', '이미지는 최대 5개까지 등록할 수 있습니다.')
      return
    }

    setImages([...images, ...files])

    // 이미지 미리보기 생성
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || user.user_type !== 'FARMER') return

    try {
      setIsSubmitting(true)
      const formData = new FormData(e.currentTarget)
      const cropData = {
        name: formData.get('name')?.toString(),
        description: formData.get('description')?.toString(),
        price_per_unit: Number(formData.get('price_per_unit')),
        unit: formData.get('unit')?.toString(),
        quantity_available: Number(formData.get('quantity_available')),
        planting_date: formData.get('planting_date')?.toString(),
        expected_harvest_date: formData.get('expected_harvest_date')?.toString(),
        temperature: Number(formData.get('temperature')),
        humidity: Number(formData.get('humidity')),
        soil_ph: Number(formData.get('soil_ph')),
      }

      // TODO: 작물 등록 API 구현 필요
      // const response = await api.createCrop(cropData)
      showNotification('success', '작물이 성공적으로 등록되었습니다.')
      router.push('/dashboard/crops')
    } catch (error: any) {
      showNotification('error', error.message || '작물 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.user_type !== 'FARMER') {
    router.push('/')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">새 작물 등록</h1>
        
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
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                      required
                      min="0"
                      className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
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
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
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
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    step="0.1"
                    min="0"
                    max="14"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">이미지</h2>
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
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== index))
                          setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
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
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 