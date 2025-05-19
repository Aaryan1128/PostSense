import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-2">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">PostSense</h1>
      </div>
    </header>
  );
}