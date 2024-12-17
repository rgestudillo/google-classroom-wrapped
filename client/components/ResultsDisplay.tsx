import SubjectCard from './SubjectCard'

interface ResultsDisplayProps {
  wrappedData: any[]
}

export default function ResultsDisplay({ wrappedData }: ResultsDisplayProps) {
  if (wrappedData.length === 0) {
    return <p className="text-center text-gray-500">No data available. Please upload your Classroom data.</p>
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Individual Class Summaries</h2>
      {wrappedData.map((subjectData, index) => (
        <SubjectCard key={index} data={subjectData} />
      ))}
    </div>
  )
}

