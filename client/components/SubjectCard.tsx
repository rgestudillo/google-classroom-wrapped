'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SubjectCardProps {
  subject: string
  data: any
}

export default function SubjectCard({ subject, data }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isExpanded ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p>Click 'Show JSON' to view the full data for this subject.</p>
          )}
          <Button
            variant="outline"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" /> Hide JSON
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" /> Show JSON
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

