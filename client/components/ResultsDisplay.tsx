import SubjectCard from './SubjectCard'

interface ResultsDisplayProps {
  wrappedData: any[]
}

export default function ResultsDisplay({ wrappedData }: ResultsDisplayProps) {
  if (wrappedData.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Classroom Wrapped</h2>
      {wrappedData.map((subjectData, index) => (
        <SubjectCard key={index} data={subjectData} />
      ))}
    </div>
  )
}

