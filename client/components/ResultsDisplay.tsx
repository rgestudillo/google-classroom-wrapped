import SubjectCard from './SubjectCard'

interface ResultsDisplayProps {
  subjectsData: Record<string, any>
}

export default function ResultsDisplay({ subjectsData }: ResultsDisplayProps) {
  const subjects = Object.keys(subjectsData)

  if (subjects.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Classroom Data</h2>
      {subjects.map((subject) => (
        <SubjectCard key={subject} subject={subject} data={subjectsData[subject]} />
      ))}
    </div>
  )
}

