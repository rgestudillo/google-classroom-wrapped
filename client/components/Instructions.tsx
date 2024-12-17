export default function Instructions() {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">How to Get Your Google Classroom Wrapped</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>Go to Google Takeout (takeout.google.com)</li>
        <li>Deselect all services</li>
        <li>Select only &quot;Google Classroom&quot;</li>
        <li>Click &quot;Next step&quot; and choose your export options</li>
        <li>Click &quot;Create export&quot;</li>
        <li>Wait for the email from Google with your download link</li>
        <li>Download and extract the ZIP file</li>
        <li>Use the &quot;Select Folder&quot; button below to choose the extracted Classroom folder</li>
      </ol>
    </div>
  )
}

