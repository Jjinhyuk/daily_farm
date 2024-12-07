'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

// 임시 데이터
const conversations = [
  {
    id: 1,
    user: {
      name: '김철수',
      image: '/images/test.png',
      lastSeen: '방금 전',
      online: true,
    },
    lastMessage: {
      text: '방울토마토 재고 있나요?',
      timestamp: '14:23',
      unread: true,
    },
  },
  {
    id: 2,
    user: {
      name: '이영희',
      image: '/images/test.png',
      lastSeen: '1시간 전',
      online: false,
    },
    lastMessage: {
      text: '배송 예정일이 어떻게 되나요?',
      timestamp: '13:15',
      unread: false,
    },
  },
  {
    id: 3,
    user: {
      name: '박지민',
      image: '/images/test.png',
      lastSeen: '2시간 전',
      online: false,
    },
    lastMessage: {
      text: '네, 알겠습니다. 감사합니다!',
      timestamp: '12:30',
      unread: false,
    },
  },
]

const messages = [
  {
    id: 1,
    sender: 'customer',
    text: '��녕하세요, 방울토마토 재고 있나요?',
    timestamp: '14:23',
  },
  {
    id: 2,
    sender: 'farmer',
    text: '네, 현재 100kg 정도 재고가 있습니다.',
    timestamp: '14:24',
  },
  {
    id: 3,
    sender: 'customer',
    text: '가격이 어떻게 되나요?',
    timestamp: '14:24',
  },
  {
    id: 4,
    sender: 'farmer',
    text: '1kg당 15,000원입니다. 3kg 이상 구매시 10% 할인해드립니다.',
    timestamp: '14:25',
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    // TODO: API 연동
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl h-screen flex">
        {/* 채팅 목록 */}
        <div className="w-96 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="대화 검색"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-73px)]">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                  selectedConversation.id === conversation.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="relative h-10 w-10">
                    <Image
                      src={conversation.user.image}
                      alt={conversation.user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  {conversation.user.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.user.name}
                    </p>
                    <p className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.text}</p>
                    {conversation.lastMessage.unread && (
                      <span className="inline-flex items-center justify-center w-2 h-2 bg-green-600 rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 채팅 내용 */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* 채팅 헤더 */}
              <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="relative h-10 w-10">
                    <Image
                      src={selectedConversation.user.image}
                      alt={selectedConversation.user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  {selectedConversation.user.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedConversation.user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.user.online ? '온라인' : `마지막 접속: ${selectedConversation.user.lastSeen}`}
                  </p>
                </div>
              </div>

              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-sm ${
                        message.sender === 'farmer'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'farmer' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 메시지 입력 */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-green-600 p-2 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">대화를 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 