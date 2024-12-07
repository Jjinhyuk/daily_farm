'use client'

import React, { memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Scale,
  ScriptableContext,
} from 'chart.js'
import { Line as LineChart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export interface LineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
}

const Line = memo(function Line({ data, options }: LineChartProps) {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale<any>, value: number | string) {
            if (typeof value === 'number') {
              return value.toLocaleString()
            }
            return value
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: ScriptableContext<'line'>) {
            let value = context.parsed.y
            if (typeof value === 'number') {
              return value.toLocaleString()
            }
            return String(value)
          },
        },
      },
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  return <LineChart data={data} options={mergedOptions} />
})

export default Line 