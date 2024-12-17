import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OverallSummary({ data }: { data: any }) {
  const {
    totalPosts,
    totalAssignments,
    categoryAverages,
    topAssignment,
    lowestAssignment
  } = data || {}

  // Prepare category averages data for the bar chart
  const categories = categoryAverages ? Object.keys(categoryAverages) : []
  const categoryValues = categoryAverages ? categories.map(cat => categoryAverages[cat]) : []

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Category Averages (%)',
        data: categoryValues,
        backgroundColor: '#4f46e5', // A nice indigo color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Average Grades by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-around text-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold">Total Posts</h3>
            <p className="text-2xl font-bold">{totalPosts ?? 0}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Assignments</h3>
            <p className="text-2xl font-bold">{totalAssignments ?? 0}</p>
          </div>
        </div>

        <Separator />

        {categories.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>No category averages available</p>
        )}

        <Separator />

        <div className="flex flex-col sm:flex-row sm:justify-around text-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold">Top Assignment</h3>
            {topAssignment ? (
              <div className="space-y-2">
                <p className="font-semibold">{topAssignment.title}</p>
                <Badge variant="outline">{topAssignment.category}</Badge>
                <p>Avg Grade: {topAssignment.avg_grade?.toFixed(2)}%</p>
              </div>
            ) : (
              <p>No top assignment found</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">Lowest Assignment</h3>
            {lowestAssignment ? (
              <div className="space-y-2">
                <p className="font-semibold">{lowestAssignment.title}</p>
                <Badge variant="destructive">{lowestAssignment.category}</Badge>
                <p>Avg Grade: {lowestAssignment.avg_grade?.toFixed(2)}%</p>
              </div>
            ) : (
              <p>No lowest assignment found</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
