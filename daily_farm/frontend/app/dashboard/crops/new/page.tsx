'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCropPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    plantedDate: '',
    expectedHarvestDate: '',
    price: '',
    stock: '',
    temperature: '',
    humidity: '',
    soilMoisture: '',
    light: '',
    image: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('Form submitted:', formData)
    router.push('/dashboard/crops')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">새 작물 등록</h1>
          <p className="mt-2 text-sm text-gray-700">
            새로운 작물의 정보를 입력하고 등록하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
                <p className="mt-1 text-sm text-gray-500">
                  작물의 기본적인 정보를 입력해주세요.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      작물 이름
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      카테고리
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    >
                      <option value="">선택하세요</option>
                      <option value="fruit">과일</option>
                      <option value="vegetable">채소</option>
                      <option value="grain">곡물</option>
                      <option value="other">기타</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      설명
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      판매가 (원)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                      초기 재고 (kg)
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">재배 정보</h3>
                <p className="mt-1 text-sm text-gray-500">
                  작물의 재배 환경과 관련된 정보를 입력해주세요.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700">
                      파종일
                    </label>
                    <input
                      type="date"
                      name="plantedDate"
                      id="plantedDate"
                      value={formData.plantedDate}
                      onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700">
                      예상 수확일
                    </label>
                    <input
                      type="date"
                      name="expectedHarvestDate"
                      id="expectedHarvestDate"
                      value={formData.expectedHarvestDate}
                      onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                      적정 온도 (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      id="temperature"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="humidity" className="block text-sm font-medium text-gray-700">
                      적정 습도 (%)
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      id="humidity"
                      value={formData.humidity}
                      onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="soilMoisture" className="block text-sm font-medium text-gray-700">
                      토양 수분 (%)
                    </label>
                    <input
                      type="number"
                      name="soilMoisture"
                      id="soilMoisture"
                      value={formData.soilMoisture}
                      onChange={(e) => setFormData({ ...formData, soilMoisture: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="light" className="block text-sm font-medium text-gray-700">
                      일조량 (lux)
                    </label>
                    <input
                      type="number"
                      name="light"
                      id="light"
                      value={formData.light}
                      onChange={(e) => setFormData({ ...formData, light: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">이미지</h3>
                <p className="mt-1 text-sm text-gray-500">
                  작물의 대표 이미지를 업로드해주세요.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="sm:col-span-6">
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
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
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500"
                        >
                          <span>이미지 업로드</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
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
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 