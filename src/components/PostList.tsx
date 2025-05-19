import { RedditPost } from '../types/reddit';
import { MessageCircle, ThumbsUp, ExternalLink } from 'lucide-react';

interface PostListProps {
  posts: RedditPost[];
}

export default function PostList({ posts }: PostListProps) {
  const getSentimentColor = (sentiment: RedditPost['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {posts.map((post, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(
                post.sentiment
              )}`}
            >
              {post.sentiment}
            </span>
          </div>

          {post.selftext && (
            <p className="mt-2 text-gray-600 line-clamp-3">{post.selftext}</p>
          )}

          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {post.score}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.num_comments}
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Post
            </a>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Length:</span> {post.analysis.length}
            </p>
            {post.analysis.spelling.length > 0 && (
              <p className="text-sm">
                <span className="font-medium">Spelling:</span>{' '}
                {post.analysis.spelling.join(', ')}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Engagement:</span>{' '}
              {post.analysis.engagement}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}