'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FileUpload from '@/components/FileUpload'
import Instructions from '@/components/Instructions'

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDataProcessed = async (jsonData: any[]) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Send data to the local Python API
      const response = await fetch('http://127.0.0.1:8000/wrapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })

      if (!response.ok) {
        throw new Error('Failed to process data')
      }

      const wrappedData = await response.json()
      console.log("wrapped data is: ", wrappedData)

      // Store the wrapped data in localStorage
      localStorage.setItem('wrappedData', JSON.stringify(wrappedData))

      // Redirect to the results page
      router.push('/results')
    } catch (err) {
      setError('Error processing files. Please try again.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Google Classroom Wrapped</h1>
        <Instructions />
        <FileUpload onDataProcessed={handleDataProcessed} />
        {isProcessing && <p className="mt-4 text-center">Processing files...</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </main>
      <Footer />
    </div>
  )
}

