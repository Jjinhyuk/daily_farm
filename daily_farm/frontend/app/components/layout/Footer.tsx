'use client'

import React from 'react'
import Link from 'next/link'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline'

const navigation = {
  solutions: [
    { name: '스마트팜 모니터링', href: '/dashboard/monitoring' },
    { name: '작물 관리', href: '/dashboard/crops' },
    { name: '주문 관리', href: '/dashboard/orders' },
    { name: '매출 관리', href: '/dashboard/sales' },
  ],
  support: [
    { name: '고객센터', href: '#' },
    { name: '이용가이드', href: '#' },
    { name: '자주 묻는 질문', href: '#' },
    { name: '공지사항', href: '#' },
  ],
  company: [
    { name: '회사 소개', href: '#' },
    { name: '이용약관', href: '#' },
    { name: '개인정보처리방침', href: '#' },
    { name: '제휴 문의', href: '#' },
  ],
  social: [
    {
      name: '블로그',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 28 28" {...props}>
          <path d="M24.8 8.4c0 .4-.1.8-.4 1.1L12.7 21.2c-.3.3-.6.4-1.1.4-.4 0-.8-.1-1.1-.4L3.4 14c-.3-.3-.4-.6-.4-1.1 0-.4.1-.8.4-1.1l1.1-1.1c.3-.3.6-.4 1.1-.4.4 0 .8.1 1.1.4l5.7 5.7 10.3-10.3c.3-.3.6-.4 1.1-.4.4 0 .8.1 1.1.4l1.1 1.1c.2.3.4.7.4 1.1z" />
        </svg>
      ),
    },
    {
      name: '인스타그램',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: '유튜브',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="text-lg font-bold text-green-600">
              Daily Farm
            </Link>
            <p className="text-sm leading-6 text-gray-600">
              스마트팜 기술로 더 나은 농업의 미래를 만들어갑니다.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">서울특별시 강남구 테헤란로 123</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">contact@dailyfarm.com</span>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">서비스</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">고객지원</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">회사</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">소셜 미디어</h3>
                <div className="mt-6 flex space-x-6">
                  {navigation.social.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; 2024 Daily Farm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 