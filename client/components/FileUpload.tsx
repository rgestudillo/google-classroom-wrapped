'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FolderOpen } from 'lucide-react'

interface FileUploadProps {
  onDataProcessed: (data: any[]) => void
}

export default function FileUpload({ onDataProcessed }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles)
  }, [onDataProcessed])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: true,
    noClick: true,
  })

  const processFiles = async (files: File[]) => {
    const jsonFiles = files.filter(file => file.name === 'Class data.json')
    const jsonData = await Promise.all(
      jsonFiles.map(async (file) => {
        const text = await file.text()
        return JSON.parse(text)
      })
    )
    onDataProcessed(jsonData)
  }

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      processFiles(Array.from(files))
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
            <input
              type="file"
              // @ts-expect-error non-standard attribute
              webkitdirectory="true"
              directory=""
              style={{ display: 'none' }}
              onChange={handleFolderSelect}
              id="folder-input"
            />
            <Button variant="outline" onClick={() => document.getElementById('folder-input')?.click()}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Select Folder
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

