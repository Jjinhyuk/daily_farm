'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { useRouter } from 'next/navigation';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import { useNotification } from '../context/NotificationContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      full_name: formData.get('full_name')?.toString(),
      phone_number: formData.get('phone_number')?.toString(),
      ...(user.user_type === 'FARMER' && {
        farm_name: formData.get('farm_name')?.toString(),
        farm_location: formData.get('farm_location')?.toString(),
        farm_description: formData.get('farm_description')?.toString(),
      }),
    };

    try {
      await updateUser(userData);
      showNotification('success', '프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      showNotification('error', '프로필 업데이트에 실패했습니다.');
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    showNotification('success', '프로필 이미지가 성공적으로 업데이트되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">프로필 관리</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>프로필 정보를 수정하실 수 있습니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">프로필 이미지</label>
                <div className="mt-1">
                  <ProfileImageUpload
                    currentImage={user.profile_image}
                    onUploadSuccess={handleImageUploadSuccess}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  이름
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    defaultValue={user.full_name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user.email}
                    disabled
                    className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  전화번호
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    defaultValue={user.phone_number}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {user.user_type === 'FARMER' && (
                <>
                  <div>
                    <label htmlFor="farm_name" className="block text-sm font-medium text-gray-700">
                      농장 이름
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="farm_name"
                        id="farm_name"
                        defaultValue={user.farm_name}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700">
                      농장 위치
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="farm_location"
                        id="farm_location"
                        defaultValue={user.farm_location}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="farm_description" className="block text-sm font-medium text-gray-700">
                      농장 소개
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="farm_description"
                        id="farm_description"
                        rows={4}
                        defaultValue={user.farm_description}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 