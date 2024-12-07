'use client'

import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/layout/Navbar'
import { Metadata } from 'next'

const metadata: Metadata = {
  title: '데일리팜 - 신선한 농산물 직거래 마켓',
  description: '농부와 소비자를 직접 연결하는 신선한 농산물 직거래 마켓',
  keywords: '농산물, 직거래, 신선식품, 로컬푸드, 친환경',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2B7A0B" />
      </head>
      <body className="h-full bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <div className="min-h-full flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 