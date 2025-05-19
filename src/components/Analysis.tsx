interface AnalysisProps {
  commonMistakes: string[];
  suggestions: string[];
}

export default function Analysis({ commonMistakes, suggestions }: AnalysisProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Common Mistakes
        </h2>
        <ul className="space-y-2">
          {commonMistakes.map((mistake, index) => (
            <li key={index} className="text-gray-600">
              • {mistake}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Suggestions for Next Post
        </h2>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-gray-600">
              • {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}