'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onDataProcessed: (data: any[]) => void
}

export default function FileUpload({ onDataProcessed }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true)
    setError(null)
    processFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: true,
  })

  const processFiles = async (files: File[]) => {
    try {
      const jsonFiles = files.filter(file => file.name === 'Class data.json')
      const jsonData = await Promise.all(
        jsonFiles.map(async (file) => {
          const text = await file.text()
          return JSON.parse(text)
        })
      )
      onDataProcessed(jsonData)
    } catch (err) {
      setError('Error processing files. Please try again.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the Classroom folder here...</p>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p>Drag and drop your Classroom folder here, or click to select</p>
            <Button variant="outline">Select Folder</Button>
          </div>
        )}
      </div>
      {isProcessing && <p className="mt-4 text-center">Processing files...</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  )
}

