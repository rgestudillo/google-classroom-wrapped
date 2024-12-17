'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FileUpload from '@/components/FileUpload'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function Home() {
  const [subjectsData, setSubjectsData] = useState<Record<string, any>>({})

  const handleDataProcessed = (data: any[]) => {
    const processedData: Record<string, any> = {}
    data.forEach((item) => {
      const subjectName = item.name || 'Unknown Subject'
      processedData[subjectName] = item
    })
    setSubjectsData(processedData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Google Classroom Wrapped</h1>
        <FileUpload onDataProcessed={handleDataProcessed} />
        <ResultsDisplay subjectsData={subjectsData} />
      </main>
      <Footer />
    </div>
  )
}

