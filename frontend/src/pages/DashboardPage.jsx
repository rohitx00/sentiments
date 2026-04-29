import { useState } from 'react';
import StatCard from '../components/StatCard';
import Charts from '../components/Charts';
import LiveFeed from '../components/LiveFeed';
import ExportModal from '../components/ExportModal';

export default function DashboardPage({ activeQuery, data }) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Dashboard Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-h1 text-h1 text-white tracking-tight">System Overview</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-sm font-mono text-secondary uppercase tracking-widest">Streaming live data for #{activeQuery}...</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="glass inner-glow px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 24 Hours
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="glass inner-glow px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/5 transition-all text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        activeQuery={activeQuery}
        data={data}
      />

      {/* Bento Grid - Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Analyzed" 
          value={data.stats.total} 
          icon="analytics"
          iconColor="text-indigo-400"
          trend={data.stats.total_trend}
          trendText="vs prev"
        />
        <StatCard 
          title="Positive Sentiment" 
          value={`${data.stats.positive_percent}%`}
          icon="sentiment_very_satisfied"
          iconColor="text-secondary"
          progress={data.stats.positive_percent}
          progressColor="bg-secondary"
        />
        <StatCard 
          title="Negative Sentiment" 
          value={`${data.stats.negative_percent}%`}
          icon="sentiment_very_dissatisfied"
          iconColor="text-error"
          progress={data.stats.negative_percent}
          progressColor="bg-error"
        />
        <StatCard 
          title="Neutral Pulse" 
          value={`${data.stats.neutral_percent}%`}
          icon="sentiment_neutral"
          iconColor="text-neutral-400"
          progress={data.stats.neutral_percent}
          progressColor="bg-neutral-500"
        />
      </div>

      {/* Main Trend Section */}
      <Charts stats={data.stats} />

      {/* Bottom Content: Live Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        
        {/* AI Insight Card */}
        <div className="lg:col-span-1 rounded-xl p-[1px] bg-gradient-to-br from-indigo-500/50 to-transparent">
          <div className="glass inner-glow h-full p-6 rounded-xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="text-white font-semibold">AI Sentiment Projection</h4>
            </div>
            <p className="text-body-sm text-on-surface-variant flex-1">
              Current trends for <span className="text-white font-bold capitalize">{activeQuery}</span> suggest a <span className="text-secondary font-bold">bullish shift</span> in brand perception over the next 4 hours. Market influencers are reacting positively to recent updates.
            </p>
            <button className="mt-6 text-sm font-semibold text-indigo-400 flex items-center gap-1 group">
              View full forecast
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Feed Spotlight */}
        <div className="lg:col-span-2">
          <LiveFeed tweets={data.tweets} />
        </div>

      </div>
    </div>
  );
}
