import { useState } from 'react';
import { Search } from 'lucide-react';

interface RedditInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export default function RedditInput({ onSubmit, isLoading }: RedditInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8">
      <div className="relative rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Enter Reddit username (u/...) or subreddit (r/...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block w-full rounded-lg border-gray-300 pl-4 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>
    </form>
  );
}