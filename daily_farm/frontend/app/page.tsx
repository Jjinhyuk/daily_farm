'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ChartPieIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: '실시간 모니터링',
    description: '온도, 습도, CO2 등 스마트팜의 환경을 실시간으로 모니터링하고 제어할 수 있습니다.',
    icon: ChartBarIcon,
  },
  {
    name: '작물 관리',
    description: '작물의 생육 상태를 체계적으로 관리하고, AI 기반 생육 예측 정보를 제공받을 수 있습니다.',
    icon: ChartPieIcon,
  },
  {
    name: '농산물 직거래',
    description: '신선한 농산물을 소비자에게 직접 판매하고, 안정적인 판로를 확보할 수 있습니다.',
    icon: CurrencyDollarIcon,
  },
  {
    name: '농업인 커뮤니티',
    description: '다른 농업인들과 정보를 공유하고, 전문가의 조언을 받을 수 있습니다.',
    icon: UserGroupIcon,
  },
]

const stats = [
  { id: 1, name: '누적 농가', value: '1,000+' },
  { id: 2, name: '월간 거래액', value: '₩5억+' },
  { id: 3, name: '고객 만족도', value: '98%' },
  { id: 4, name: '스마트팜 면적', value: '50,000㎡+' },
]

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
        </svg>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-24 sm:mt-32 lg:mt-16">
                <Link href="/market" className="inline-flex space-x-6">
                  <span className="rounded-full bg-green-600/10 px-3 py-1 text-sm font-semibold leading-6 text-green-600 ring-1 ring-inset ring-green-600/10">
                    새소식
                  </span>
                  <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                    <span>직거래 마켓 오픈</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Link>
              </div>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                스마트팜으로 시작하는{' '}
                <span className="text-green-600">새로운 농업</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Daily Farm과 함께 스마트팜의 미래를 만들어가세요. 
                실시간 모니터링, AI 기반 생육 관리, 직거래 플랫폼을 통해 
                더 효율적이고 수익성 높은 농업이 가능합니다.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/auth/register"
                  className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  시작하기
                </Link>
                <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                  더 알아보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1585500159109-6ca3aee0c122?q=80&w=2000&auto=format&fit=crop"
                  alt="스마트팜 이미지"
                  width={800}
                  height={600}
                  className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">더 스마트한 농업</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Daily Farm이 제공하는 스마트팜 솔루션
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            최신 IoT 기술과 AI를 활용한 스마트팜 솔루션으로 농업의 디지털 혁신을 이끕니다.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              신뢰할 수 있는 스마트팜 플랫폼
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Daily Farm은 대한민국 농업의 디지털 혁신을 선도하고 있습니다
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1d4240dd-898f-445f-932d-e2872fd12de3"
              width={200}
              height={200}
              x="50%"
              y={0}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={0} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)" />
        </svg>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Daily Farm과 함께 스마트팜의 새로운 미래를 만들어가세요.
            지금 가입하시면 30일 무료 체험 기회를 드립니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              무료로 시작하기
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              문의하기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 