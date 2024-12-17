'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ResultsDisplay from '@/components/ResultsDisplay'
import OverallSummary from '@/components/OverallSummary'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import PersonalityDisplay from '@/components/PersonalityDisplay'

export default function Results() {
  const [wrappedData, setWrappedData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem('wrappedData')
    if (storedData) {
      setWrappedData(JSON.parse(storedData))
    }
  }, [])

  if (!wrappedData) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Google Classroom Wrapped</h1>
        <PersonalityDisplay studentProfile={wrappedData.studentProfile} />
        <OverallSummary data={wrappedData.overall} />
        <ResultsDisplay wrappedData={wrappedData.classes} />
        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

