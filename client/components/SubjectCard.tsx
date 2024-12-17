'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SubjectCardProps {
  data: any
}

export default function SubjectCard({ data }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.courseName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Subject: {data.subject}</p>
        {isExpanded && (
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <Button variant="outline" onClick={toggleExpand}>
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
