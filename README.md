# Twitter Sentiment Analysis (Sentiment) - Project Documentation

## Project Overview

Sentiment is a real-time Twitter sentiment analysis platform designed to monitor and analyze public opinion on specific topics. The application combines machine learning with a modern, interactive dashboard to provide insights into sentiment trends, distribution, and top-performing keywords.

---

## Key Features

### 1. Real-Time Sentiment Dashboard

- **Query Search**: Monitor any topic by entering keywords (e.g., "technology", "education").
- **Live Analysis**: Instantly fetches and analyzes tweets related to the query.
- **Key Metrics**: View total tweets processed, sentiment percentage (Positive, Negative, Neutral), and trend indicators.

### 2. Advanced Analytics

- **Sentiment Distribution**: Visual representation of how public opinion is divided.
- **Velocity Trends**: Time-series charts showing sentiment changes over the last few hours.
- **Category Density**: Analysis of top words associated with the sentiment in the current context.

### 3. Live Tweet Feed

- **Dynamic Updates**: A continuous stream of analyzed tweets.
- **Sentiment Labels**: Each tweet is tagged with its predicted sentiment for quick identification.
- **Timestamp Tracking**: Tracks when tweets were "fetched" or "posted."

### 4. Custom Prediction Tool

- **Text Analysis**: Users can input custom text to see how the ML model classifies its sentiment.

### 5. Filtering & Customization

- **Hashtag Filtering**: Narrow down analysis to specific hashtags.
- **Bot Exclusion**: Heuristic filtering to remove automated content and links.
- **Dark/Light Mode**: Premium UI with support for different visual preferences.

---

## Project Flow

1.  **User Input**: The user selects or enters a query via the **TopBar**.
2.  **API Request**: The React frontend sends an asynchronous request to the Flask backend's `/api/live-analysis` endpoint.
3.  **Data Retrieval**:
    - The backend searches a local dataset (`twitter.csv`) for matches to the query.
    - It applies filters like hashtags or bot exclusion if specified.
4.  **Preprocessing**:
    - Text is cleaned (removing URLs, mentions, and special characters).
    - Natural Language Toolkit (NLTK) is used for **Porter Stemming** and **Stopword removal**.
5.  **Sentiment Prediction**:
    - The cleaned text is transformed into a numerical vector using a pre-trained **TF-IDF Vectorizer**.
    - A machine learning model (e.g., Logistic Regression or SVM) predicts the sentiment.
6.  **Stat Generation**: The backend calculates overall percentages and generates mock time-series data for trend visualization.
7.  **Frontend Rendering**: The dashboard updates dynamically using **Axios** and **React Hooks** to reflect the new data in charts and feeds.

---

## Backend Documentation

### Technology Stack

- **Language**: Python 3.x
- **Framework**: Flask
- **Libraries**:
  - `pandas`: For dataset management.
  - `nltk`: For text preprocessing (Stemming, Stopwords).
  - `scikit-learn`: For TF-IDF Vectorization and Prediction.
  - `flask-cors`: To enable communication with the React frontend.
  - `python-dotenv`: For managing environment variables.

### Core Components

- **`app.py`**: The main entry point containing API routes and prediction logic.
- **`model.pkl`**: The serialized pre-trained machine learning model.
- **`vectorizer.pkl`**: The TF-IDF vectorizer used for text-to-feature conversion.
- **`dataset/twitter.csv`**: The local dataset used to simulate live tweet fetching.

### API Endpoints

- `GET /api/live-analysis`: Returns analyzed tweets, statistics, and trend data for a query.
- `GET /api/live-tweets`: Returns a raw list of tweets matching a query.
- `POST /api/predict`: Takes a JSON object with `text` and returns the predicted sentiment.

---

## Frontend Documentation

### Technology Stack

- **Framework**: React.js (built with Vite)
- **Styling**: Modern Vanilla CSS
- **Libraries**:
  - `axios`: For API requests.
  - `lucide-react`: For iconography.
  - `recharts` (or custom SVG): For data visualization.

### Architecture

- **`App.jsx`**: Manages the global state, theme, and main routing (Dashboard vs. Analytics).
- **Components**:
  - **`Sidebar`**: Navigation menu.
  - **`TopBar`**: Search input and global controls.
  - **`StatCard`**: Reusable metric cards with trend indicators.
  - **`Charts`**: Renders complex data visualizations.
  - **`LiveFeed`**: Scrollable component for real-time tweets.
- **Pages**:
  - **`DashboardPage`**: Main overview with charts and summary stats.
  - **`AnalyticsPage`**: Detailed breakdown with filters and density analysis.
  - **`LiveFeedPage`**: Full-screen view of analyzed tweets.

### Design System

- **Glassmorphism**: Subtle blurs and translucent backgrounds for a premium feel.
- **Responsive Layout**: Designed to work seamlessly on desktop and mobile.
- **Custom Scrollbars**: Tailored for the modern aesthetic.

---

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`.
5. Run the server: `python app.py`.

### Frontend Setup

1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
