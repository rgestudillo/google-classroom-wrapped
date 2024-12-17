import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverallSummaryProps {
  data: {
    totalPosts: number
    totalAssignments: number
    categoryAverages: Record<string, number | null>
    topAssignment: {
      title: string
      category: string
      avg_grade: number
    } | null
    lowestAssignment: {
      title: string
      category: string
      avg_grade: number
    } | null
  }
}

export default function OverallSummary({ data }: OverallSummaryProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Total Posts: {data.totalPosts}</p>
          <p>Total Assignments: {data.totalAssignments}</p>
          <h3 className="font-semibold mt-4">Category Averages:</h3>
          <ul>
            {Object.entries(data.categoryAverages).map(([category, average]) => (
              <li key={category}>{category}: {average !== null ? average.toFixed(2) : 'N/A'}</li>
            ))}
          </ul>
          {data.topAssignment && (
            <>
              <h3 className="font-semibold mt-4">Top Assignment:</h3>
              <p>{data.topAssignment.title} (Average: {data.topAssignment.avg_grade.toFixed(2)})</p>
            </>
          )}
          {data.lowestAssignment && (
            <>
              <h3 className="font-semibold mt-4">Lowest Assignment:</h3>
              <p>{data.lowestAssignment.title} (Average: {data.lowestAssignment.avg_grade.toFixed(2)})</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

