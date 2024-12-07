'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMessage } from '../../lib/api';
import { Message } from '../../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await getMessage(Number(params.id));
        setMessage(data);
      } catch (err) {
        setError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [params.id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!message) return <div className="p-4">메시지를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← 뒤로 가기
      </button>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{message.title}</h1>
          <span className="text-sm text-gray-500">
            {format(new Date(message.created_at), 'PPP p', { locale: ko })}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            From: {message.sender.full_name}
          </p>
          <p className="text-sm text-gray-600">
            To: {message.receiver.full_name}
          </p>
        </div>

        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
} 