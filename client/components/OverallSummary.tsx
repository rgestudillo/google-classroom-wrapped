import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverallSummary({ data }: any) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
