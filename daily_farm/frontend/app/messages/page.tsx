'use client';

import { useEffect, useState } from 'react';
import { getMessages } from '../lib/api';
import { Message } from '../types';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        setError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">메시지함</h1>
        <Link
          href="/messages/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          새 메시지 작성
        </Link>
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <Link
            href={`/messages/${message.id}`}
            key={message.id}
            className={`block border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
              !message.is_read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{message.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {message.sender.id === message.receiver.id ? '보낸 메시지' : '받은 메시지'} |{' '}
                  {message.sender.id === message.receiver.id
                    ? `To: ${message.receiver.full_name}`
                    : `From: ${message.sender.full_name}`}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(message.created_at), 'PPP p', { locale: ko })}
              </span>
            </div>
          </Link>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-500">메시지가 없습니다.</p>
        )}
      </div>
    </div>
  );
} 