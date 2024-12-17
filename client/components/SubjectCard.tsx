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
        <div className="space-y-4">
          <p>Subject: {data.subject}</p>
          <p>Section: {data.section}</p>
          <p>Total Posts: {data.totalPosts}</p>
          <p>Total Assignments: {data.totalAssignments}</p>
          {isExpanded && (
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
          <Button
            variant="outline"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" /> Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" /> Show Details
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

