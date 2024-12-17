interface StatCardProps {
  title: string
  value: number
  description: string
  onNext: () => void
}

export default function StatCard({ title, value, description, onNext }: StatCardProps) {
  return (
    <div className="bg-white text-purple-600 rounded-lg p-8 text-center animate-fade-in">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-6xl font-bold mb-4">{value}</p>
      <p className="text-xl mb-8">{description}</p>
      <button
        onClick={onNext}
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-colors"
      >
        Next
      </button>
    </div>
  )
}

