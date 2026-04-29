import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import StatCard from './components/StatCard';
import Charts from './components/Charts';
import LiveFeed from './components/LiveFeed';
import DashboardPage from './pages/DashboardPage';
import LiveFeedPage from './pages/LiveFeedPage';
import AnalyticsPage from './pages/AnalyticsPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeQuery, setActiveQuery] = useState('school');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [filters, setFilters] = useState({ hashtags: [], excludeBots: false });
  const [data, setData] = useState({
    tweets: [],
    stats: {
      total: 0,
      positive_percent: 0,
      negative_percent: 0,
      neutral_percent: 0,
      total_trend: 0
    }
  });

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/live-analysis`, {
        params: { 
          query: activeQuery, 
          count: 15,
          hashtags: filters.hashtags.join(','),
          exclude_bots: filters.excludeBots
        }
      });
      if (response.data) {
        // Prepend new tweets to existing tweets (max 50)
        setData(prev => {
          const newTweets = response.data.tweets;
          const combined = [...newTweets, ...prev.tweets];
          const uniqueTweets = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return {
            tweets: uniqueTweets.slice(0, 50),
            stats: response.data.stats
          };
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeQuery, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // fetchData will be triggered automatically because filters is in the dependency array
    // Wait, no, we need to ensure useEffect triggers.
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <div className={`min-h-screen bg-background text-on-surface font-body-md custom-scrollbar antialiased transition-colors duration-300 ${isDark ? '' : 'light'}`}>
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} isDark={isDark} />
      <TopBar 
        activeQuery={activeQuery} 
        onSelectKey={setActiveQuery} 
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
      />
      
      <main className="ml-[240px] pt-24 pb-8 px-6 lg:pt-28 lg:px-8 lg:pb-12 min-h-screen">
        {activeTab === 'dashboard' && <DashboardPage activeQuery={activeQuery} data={data} />}
        {activeTab === 'live-feed' && <LiveFeedPage activeQuery={activeQuery} tweets={data.tweets} />}
        {activeTab === 'analytics' && <AnalyticsPage activeQuery={activeQuery} data={data} onApplyFilters={handleApplyFilters} />}
        {activeTab === 'settings' && (
          <div className="h-full flex items-center justify-center text-neutral-500">
            <p>Settings panel coming soon...</p>
          </div>
        )}
      </main>



    </div>
  );
}

export default App;
