import React, { useRef, useState } from 'react';
import Image from 'next/image';
import apiClient from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface ProfileImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  onUploadSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      setIsUploading(true);
      const updatedUser = await apiClient.updateUserProfileImage(file);
      onUploadSuccess(updatedUser.profile_image!);
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      // Reset preview
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-full">
        <Image
          src={previewUrl || currentImage || '/images/default-profile.png'}
          alt="Profile"
          fill
          className="object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? '업로드 중...' : '이미지 변경'}
      </button>
    </div>
  );
};

export default ProfileImageUpload; 