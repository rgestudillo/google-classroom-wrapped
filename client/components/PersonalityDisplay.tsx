export default function PersonalityDisplay({ studentProfile }: { studentProfile: any }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Academic Persona</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(studentProfile, null, 2)}
            </pre>
        </div>
    );
} 