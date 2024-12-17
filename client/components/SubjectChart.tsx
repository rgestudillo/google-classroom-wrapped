'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface SubjectChartProps {
  onNext: () => void
}

export default function SubjectChart({ onNext }: SubjectChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Math', 'Science', 'English', 'History', 'Art'],
            datasets: [{
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Your Subject Breakdown',
                color: 'white',
                font: {
                  size: 20
                }
              }
            }
          }
        })
      }
    }
  }, [])

  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center animate-fade-in">
      <canvas ref={chartRef} />
      <p className="text-xl mt-4 mb-8">Math was your top subject this year!</p>
      <button
        onClick={onNext}
        className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-colors"
      >
        Next
      </button>
    </div>
  )
}

