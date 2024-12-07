'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  CursorArrowRaysIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [cursorSize, setCursorSize] = useState(16)

  const toggleMenu = () => setIsOpen(!isOpen)

  const adjustFontSize = (increment: number) => {
    const newSize = Math.min(Math.max(fontSize + increment, 80), 150)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle('high-contrast')
  }

  const adjustCursorSize = (increment: number) => {
    const newSize = Math.min(Math.max(cursorSize + increment, 16), 32)
    setCursorSize(newSize)
    document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${newSize}" height="${newSize}" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="black"/></svg>') ${newSize/2} ${newSize/2}, auto`
  }

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 left-4 z-50 rounded-full bg-green-600 p-3 text-white shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-400"
        aria-label="접근성 메뉴 열기"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-20 left-4 z-50 w-72 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">접근성 설정</h2>
              <button
                onClick={toggleMenu}
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="접근성 메뉴 닫기"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* 글자 크기 조절 */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">글자 크기</label>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    onClick={() => adjustFontSize(-10)}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="글자 크기 줄이기"
                  >
                    A-
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}%</span>
                  <button
                    onClick={() => adjustFontSize(10)}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="글자 크기 키우기"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* 고대비 모드 */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={toggleHighContrast}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">고대비 모드</span>
                </label>
              </div>

              {/* 커서 크기 조절 */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">커서 크기</label>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    onClick={() => adjustCursorSize(-4)}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="커서 크기 줄이기"
                  >
                    작게
                  </button>
                  <button
                    onClick={() => adjustCursorSize(4)}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="커서 크기 키우기"
                  >
                    크게
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 