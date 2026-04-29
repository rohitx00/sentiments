import os
import random
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import tweepy
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import pandas as pd

nltk.download('stopwords', quiet=True)
port_stem = PorterStemmer()

def clean_tweet(text):
    text = re.sub(r"http\S+", "", str(text))
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)
    return text.lower()

def stemming(content):
    stemmed_content = re.sub('[^a-zA-Z]', ' ', content)
    stemmed_content = stemmed_content.lower()
    stemmed_content = stemmed_content.split()
    stemmed_content = [port_stem.stem(word) for word in stemmed_content if not word in stopwords.words('english')]
    stemmed_content = ' '.join(stemmed_content)
    return stemmed_content

import requests

# Load environment variables
BASE_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(BASE_DIR, '.env'))

app = Flask(__name__)
CORS(app)

# Paths configuration
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'vectorizer.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder.pkl')
DATASET_PATH = os.path.join(BASE_DIR, 'dataset', 'twitter.csv')

model = None
vectorizer = None
label_encoder = None
tweets_df = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(VECTORIZER_PATH, 'rb') as f:
            vectorizer = pickle.load(f)
        if os.path.exists(LABEL_ENCODER_PATH):
            with open(LABEL_ENCODER_PATH, 'rb') as f:
                label_encoder = pickle.load(f)
        print("ML Model and Vectorizer loaded successfully.")
    else:
        print("model.pkl or vectorizer.pkl not found. Using mock sentiment prediction.")
except Exception as e:
    print(f"Error loading model/vectorizer: {e}")

try:
    if os.path.exists(DATASET_PATH):
        print("Loading dataset for simulation...")
        df_head = pd.read_csv(DATASET_PATH, nrows=0, encoding='latin-1')
        
        if 'text' in df_head.columns:
            tweets_df = pd.read_csv(DATASET_PATH, usecols=['text'], encoding='latin-1')
        else:
            # Fallback for datasets without headers
            tweets_df = pd.read_csv(DATASET_PATH, encoding='latin-1', header=None).iloc[:, [-1]]
            tweets_df.columns = ['text']
            
        print(f"Dataset loaded successfully ({len(tweets_df)} rows).")
    else:
        print("twitter.csv dataset not found in backend/dataset/")
except Exception as e:
    print(f"Error loading dataset: {e}")

def predict_sentiment(text):
    if model and vectorizer:
        try:
            cleaned = clean_tweet(text)
            stemmed = stemming(cleaned)
            text_vectorized = vectorizer.transform([stemmed])
            prediction = model.predict(text_vectorized)[0]
            if label_encoder:
                # If prediction is numeric or encoded, inverse transform it
                try:
                    prediction = label_encoder.inverse_transform([prediction])[0]
                except Exception as e:
                    print(f"Label encoder error: {e}")
            
            # Map common numeric outputs just in case (e.g. 0,1,2 or 0,4)
            if str(prediction) == '0': return "Negative"
            if str(prediction) == '1': return "Neutral"
            if str(prediction) == '2' or str(prediction) == '4': return "Positive"
            
            # Ensure proper capitalization if already a string
            if isinstance(prediction, str):
                pred_upper = prediction.upper()
                if "POS" in pred_upper: return "Positive"
                if "NEG" in pred_upper: return "Negative"
                if "NEU" in pred_upper: return "Neutral"
                
            return str(prediction).capitalize()
        except Exception as e:
            print(f"Prediction error: {e}")
            return "Neutral"
    else:
        # Mock sentiment
        import random
        return random.choices(["Positive", "Negative", "Neutral"], weights=[0.4, 0.4, 0.2])[0]

def fetch_live_tweets(query="technology", max_results=10, hashtags=None, exclude_bots=False):
    if tweets_df is not None and not tweets_df.empty:
        try:
            # Filter tweets containing the main query
            matched_tweets = tweets_df[tweets_df['text'].str.contains(query, case=False, na=False)]
            
            # Apply hashtag filters if any
            if hashtags:
                for tag in hashtags:
                    matched_tweets = matched_tweets[matched_tweets['text'].str.contains(tag, case=False, na=False)]

            # Apply heuristic bot filter (remove tweets with links)
            if exclude_bots:
                matched_tweets = matched_tweets[~matched_tweets['text'].str.contains('http', case=False, na=False)]
                matched_tweets = matched_tweets[~matched_tweets['text'].str.contains('rt @', case=False, na=False)]

            if matched_tweets.empty:
                # Fallback to random if filters are too strict (just to keep dashboard alive)
                sampled = tweets_df.sample(n=min(max_results, len(tweets_df)))
            else:
                sampled = matched_tweets.sample(n=min(max_results, len(matched_tweets)))
                
            tweets = []
            for text in sampled['text']:
                tweets.append({
                    "text": str(text),
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                })
            return tweets
        except Exception as e:
            print(f"Dataset simulation error: {e}")
            return []
    return []

@app.route('/api/live-tweets', methods=['GET'])
def get_live_tweets():
    query = request.args.get('query', 'technology')
    tweets = fetch_live_tweets(query)
    return jsonify({"tweets": tweets})

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    sentiment = predict_sentiment(text)
    return jsonify({"sentiment": sentiment})

@app.route('/api/live-analysis', methods=['GET'])
def get_live_analysis():
    query = request.args.get('query', 'technology')
    max_results = int(request.args.get('count', 10))
    
    hashtags_param = request.args.get('hashtags', '')
    hashtags = [h.strip() for h in hashtags_param.split(',')] if hashtags_param else []
    exclude_bots = request.args.get('exclude_bots', 'false').lower() == 'true'

    tweets = fetch_live_tweets(query, max_results=max_results, hashtags=hashtags, exclude_bots=exclude_bots)
    
    analyzed_tweets = []
    counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    
    for tweet in tweets:
        sentiment = predict_sentiment(tweet['text'])
        counts[sentiment] += 1
        analyzed_tweets.append({
            "id": str(random.randint(100000, 999999)),
            "text": tweet['text'],
            "timestamp": tweet['timestamp'],
            "sentiment": sentiment
        })
        
    total = sum(counts.values())
    pos_pct = round((counts["Positive"] / total) * 100) if total > 0 else 0
    neg_pct = round((counts["Negative"] / total) * 100) if total > 0 else 0
    neu_pct = round((counts["Neutral"] / total) * 100) if total > 0 else 0
    
    # Generate mock time-series data for the velocity chart trending towards current stats
    velocity_data = []
    for i in range(6):
        noise_p = random.randint(-15, 15) if i < 5 else 0
        noise_n = random.randint(-10, 10) if i < 5 else 0
        velocity_data.append({
            "time": f"T-{5-i}h" if i < 5 else "Now",
            "positive": max(0, min(100, pos_pct + noise_p)),
            "negative": max(0, min(100, neg_pct + noise_n))
        })

    # Generate category density data from top words in the tweets
    from collections import Counter
    import re
    from nltk.corpus import stopwords
    
    stop_words = set(stopwords.words('english'))
    all_words = []
    for tw in analyzed_tweets:
        cleaned = re.sub(r'[^a-zA-Z\s]', '', tw['text']).lower()
        words = [w for w in cleaned.split() if w not in stop_words and len(w) > 3 and w != query.lower()]
        all_words.extend(words)
        
    top_words = [word for word, count in Counter(all_words).most_common(4)]
    categories = [query] + top_words
    
    category_density = []
    for cat in categories:
        cat_lower = cat.lower()
        cat_pos = 0
        cat_neg = 0
        for tw in analyzed_tweets:
            if cat_lower in tw['text'].lower():
                if tw['sentiment'] == 'Positive':
                    cat_pos += 1
                elif tw['sentiment'] == 'Negative':
                    cat_neg += 1
                    
        total_cat = cat_pos + cat_neg
        if total_cat > 0:
            pos_pct_cat = round((cat_pos / total_cat) * 100)
            neg_pct_cat = 100 - pos_pct_cat
        else:
            pos_pct_cat = 50
            neg_pct_cat = 50
            
        category_density.append({
            "label": cat[:10].capitalize(),
            "pos": f"{pos_pct_cat}%",
            "neg": f"{neg_pct_cat}%"
        })

    stats = {
        "total": total,
        "positive_percent": pos_pct,
        "negative_percent": neg_pct,
        "neutral_percent": neu_pct,
        "velocity": velocity_data,
        "category_density": category_density,
        "total_trend": round(random.uniform(-5.0, 15.0), 1)
    }
    
    return jsonify({
        "tweets": analyzed_tweets,
        "stats": stats
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
