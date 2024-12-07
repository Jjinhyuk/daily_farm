'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
}

const icons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
}

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
}

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
}

export default function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
  const Icon = icons[type]

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`flex items-center gap-x-3 rounded-lg border p-4 shadow-lg ${colors[type]}`}>
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
            <p className="text-sm font-medium">{message}</p>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 inline-flex rounded-md p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 