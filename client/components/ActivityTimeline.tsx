'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface ActivityTimelineProps {
  onNext: () => void
}

export default function ActivityTimeline({ onNext }: ActivityTimelineProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Assignments Completed',
              data: [10, 15, 12, 18, 20, 15, 8, 5, 22, 25, 18, 30],
              borderColor: 'white',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Your Activity Throughout the Year',
                color: 'white',
                font: {
                  size: 20
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: 'white'
                }
              },
              x: {
                ticks: {
                  color: 'white'
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
      <p className="text-xl mt-4 mb-8">You were most active in December!</p>
      <button
        onClick={onNext}
        className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-colors"
      >
        Next
      </button>
    </div>
  )
}

