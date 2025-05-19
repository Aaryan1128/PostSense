from flask import Flask, request, jsonify
from flask_cors import CORS
from praw import Reddit
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Reddit API client
reddit = Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

# Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

def analyze_length(text):
    word_count = len(text.split())
    if word_count < 50:
        return "Too short (under 50 words)"
    elif word_count > 500:
        return "Too long (over 500 words)"
    return "Good length"

def analyze_spelling(text):
    # Simple uncommon word detection (could be enhanced with a proper dictionary)
    words = re.findall(r'\b\w+\b', text.lower())
    uncommon = []
    for word in words:
        if len(word) > 12 or (len(word) > 7 and word.count(word[0]) > 2):
            uncommon.append(word)
    return uncommon[:5]  # Return up to 5 potentially misspelled words

def analyze_engagement(score, num_comments):
    total_engagement = score + num_comments
    if total_engagement < 10:
        return "Low engagement"
    return "Good engagement"

def get_sentiment(text):
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']
    if compound >= 0.05:
        return 'positive'
    elif compound <= -0.05:
        return 'negative'
    return 'neutral'

@app.route('/api/fetch', methods=['POST'])
def fetch_reddit_data():
    try:
        data = request.get_json()
        reddit_input = data.get('reddit_input', '').strip()

        if not reddit_input:
            return jsonify({'error': 'No input provided'}), 400

        # Determine if it's a username or subreddit
        if reddit_input.startswith(('u/', '/u/')):
            username = reddit_input.split('/')[-1]
            posts = reddit.redditor(username).submissions.new(limit=10)
        elif reddit_input.startswith(('r/', '/r/')):
            subreddit = reddit_input.split('/')[-1]
            posts = reddit.subreddit(subreddit).new(limit=10)
        else:
            return jsonify({'error': 'Invalid input format'}), 400

        analyzed_posts = []
        common_mistakes = set()
        total_engagement = 0
        total_length = 0
        total_spelling_errors = 0

        for post in posts:
            # Combine title and selftext for analysis
            full_text = f"{post.title} {post.selftext}"
            
            # Analyze the post
            length_analysis = analyze_length(full_text)
            spelling_errors = analyze_spelling(full_text)
            engagement_analysis = analyze_engagement(post.score, post.num_comments)
            sentiment = get_sentiment(full_text)

            # Track metrics for suggestions
            if "Too short" in length_analysis or "Too long" in length_analysis:
                common_mistakes.add("Inconsistent post length")
            if spelling_errors:
                common_mistakes.add("Spelling and readability issues")
            if "Low engagement" in engagement_analysis:
                common_mistakes.add("Low post engagement")

            total_engagement += post.score + post.num_comments
            total_length += len(full_text.split())
            total_spelling_errors += len(spelling_errors)

            analyzed_posts.append({
                'title': post.title,
                'selftext': post.selftext[:300] + '...' if len(post.selftext) > 300 else post.selftext,
                'score': post.score,
                'num_comments': post.num_comments,
                'url': f"https://reddit.com{post.permalink}",
                'sentiment': sentiment,
                'analysis': {
                    'length': length_analysis,
                    'spelling': spelling_errors,
                    'engagement': engagement_analysis
                }
            })

        # Generate personalized suggestions
        suggestions = []
        avg_engagement = total_engagement / len(analyzed_posts) if analyzed_posts else 0
        avg_length = total_length / len(analyzed_posts) if analyzed_posts else 0

        if avg_engagement < 20:
            suggestions.append("Try asking questions in your posts to encourage discussion")
            suggestions.append("Consider adding relevant images or links to increase engagement")
        
        if avg_length < 100:
            suggestions.append("Add more details to your posts to provide better context")
        elif avg_length > 400:
            suggestions.append("Try to be more concise while maintaining key information")

        if total_spelling_errors > 5:
            suggestions.append("Proofread your posts carefully before submitting")
            suggestions.append("Use shorter, simpler words when possible")

        return jsonify({
            'posts': analyzed_posts,
            'commonMistakes': list(common_mistakes),
            'suggestions': suggestions
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)