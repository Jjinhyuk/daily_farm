'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/app/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'farmer' | 'consumer'>('consumer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',  // API 필드명과 일치하도록 변경
    phone: '',
    address: '',
    // 농가 전용 필드
    farmName: '',
    farmAddress: '',
    experience: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      })
      
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/auth/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || '회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}

          {/* 사용자 유형 선택 */}
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  userType === 'consumer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setUserType('consumer')}
              >
                일반 회원
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  userType === 'farmer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setUserType('farmer')}
              >
                농가 회원
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <div className="mt-1">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '가입 중...' : '가입하기'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500">
                이미 계정이 있으신가요?{' '}
                <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
                  로그인
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 