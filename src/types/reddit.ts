export interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  analysis: {
    length: string;
    spelling: string[];
    engagement: string;
  };
}

export interface AnalysisResponse {
  posts: RedditPost[];
  commonMistakes: string[];
  suggestions: string[];
  error?: string;
}