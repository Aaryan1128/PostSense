import { useState } from 'react';
import Header from './components/Header';
import RedditInput from './components/RedditInput';
import PostList from './components/PostList';
import Analysis from './components/Analysis';
import type { AnalysisResponse } from './types/reddit';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

  const handleSubmit = async (input: string) => {
    setIsLoading(true);
    setError(null);

    // Ensure input starts with u/ or r/
    const formattedInput = input.startsWith('u/') || input.startsWith('r/') 
      ? input 
      : `u/${input}`;

    try {
      const response = await fetch('http://localhost:5000/api/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reddit_input: formattedInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RedditInput onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Analyzing Reddit data...</p>
          </div>
        )}

        {analysisData && !isLoading && (
          <>
            <PostList posts={analysisData.posts} />
            <Analysis
              commonMistakes={analysisData.commonMistakes}
              suggestions={analysisData.suggestions}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App