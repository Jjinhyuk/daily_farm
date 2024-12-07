'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMessage } from '../../lib/api';
import { MessageCreate } from '../../types';

export default function NewMessagePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MessageCreate>({
    title: '',
    content: '',
    receiver_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createMessage(formData);
      router.push('/messages');
    } catch (err) {
      setError('메시지 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'receiver_id' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← 뒤로 가기
      </button>

      <h1 className="text-2xl font-bold mb-6">새 메시지 작성</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        <div>
          <label htmlFor="receiver_id" className="block text-sm font-medium mb-1">
            받는 사람 ID
          </label>
          <input
            type="number"
            id="receiver_id"
            name="receiver_id"
            value={formData.receiver_id || ''}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '전송 중...' : '메시지 보내기'}
        </button>
      </form>
    </div>
  );
} 