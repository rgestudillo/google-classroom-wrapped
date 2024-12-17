'use client'

import { useEffect, useRef } from 'react'

interface StreakCalendarProps {
  onNext: () => void
}

export default function StreakCalendar({ onNext }: StreakCalendarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const daysInYear = 365
        const squareSize = 15
        const gap = 2
        const weeksInYear = 52
        
        for (let week = 0; week < weeksInYear; week++) {
          for (let day = 0; day < 7; day++) {
            const x = week * (squareSize + gap)
            const y = day * (squareSize + gap)
            
            // Random activity level (0-4)
            const activityLevel = Math.floor(Math.random() * 5)
            
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + activityLevel * 0.2})`
            ctx.fillRect(x, y, squareSize, squareSize)
          }
        }
      }
    }
  }, [])

  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center animate-fade-in">
      <h3 className="text-2xl font-semibold mb-4">Your Learning Streak</h3>
      <canvas ref={canvasRef} width="900" height="120" />
      <p className="text-xl mt-4 mb-8">You had a 42-day learning streak! Amazing consistency!</p>
      <button
        onClick={onNext}
        className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-colors"
      >
        Next
      </button>
    </div>
  )
}

