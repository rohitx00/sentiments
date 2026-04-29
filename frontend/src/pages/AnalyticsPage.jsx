import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage({ activeQuery, data, onApplyFilters }) {
  const velocityData = data?.stats?.velocity || [];
  
  // Extract top keywords from the category density data, fallback to activeQuery if empty
  const dynamicCategories = (data?.stats?.category_density || []).map(item => item.label.toLowerCase());
  const availableHashtags = dynamicCategories.length > 0 ? dynamicCategories : [activeQuery];
  
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [excludeBots, setExcludeBots] = useState(false);

  const toggleHashtag = (tag) => {
    setSelectedHashtags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        hashtags: selectedHashtags,
        excludeBots
      });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Page Header & Global Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <span className="text-primary font-mono text-label-caps uppercase">System Analytics</span>
          <h2 className="text-display font-display text-white">Sentiment Intelligence</h2>
        </div>

      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-12 gap-6 pb-12">

        {/* Primary Metric: Topic Sentiment Comparison */}
        <section className="col-span-12 lg:col-span-7 glass p-lg rounded-xl flex flex-col inner-glow">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-h2 text-white">Keyword Sentiment Density</h3>
              <p className="text-on-surface-variant text-body-sm">Aggregated sentiment score across primary industry tags</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Positive
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-error-container/20 text-error text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Negative
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 h-[300px] px-4">
            {/* Dynamic stacked bars based on the data */}
            {(data?.stats?.category_density || []).map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full flex items-end gap-1 h-full">
                  <div className="flex-1 bg-gradient-to-t from-secondary/40 to-secondary rounded-t-sm transition-all duration-1000 group-hover:brightness-125" style={{ height: item.pos }}></div>
                  <div className="flex-1 bg-gradient-to-t from-error/40 to-error rounded-t-sm transition-all duration-1000 group-hover:brightness-125" style={{ height: item.neg }}></div>
                </div>
                <span className="text-on-surface-variant font-mono text-[11px] font-bold uppercase truncate w-full text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Filter Panel */}
        <aside className="col-span-12 lg:col-span-5 glass p-lg rounded-xl space-y-6 inner-glow flex flex-col">
          <h3 className="font-h2 text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Segmentation
          </h3>
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-2 block">Active Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {availableHashtags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${selectedHashtags.includes(tag)
                      ? 'bg-primary/20 border border-primary/40 text-primary'
                      : 'bg-white/5 border border-white/10 text-on-surface-variant hover:bg-white/10'
                      }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-2 block">Engagement Threshold</label>
              <input className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-mono">
                <span>0</span>
                <span>500k+ interactions</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Exclude Bot Activity</span>
                <div
                  onClick={() => setExcludeBots(!excludeBots)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${excludeBots ? 'bg-indigo-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${excludeBots ? 'right-1' : 'left-1 bg-neutral-400'}`}></div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleApply}
            className="w-full py-3 mt-4 rounded-lg border border-indigo-500/30 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:bg-indigo-500/10 active:scale-95 transition-all">
            Apply Parameters
          </button>
        </aside>

        {/* Trend Analysis - Recharts AreaChart */}
        <section className="col-span-12 glass p-lg rounded-xl inner-glow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-h2 text-white">Sentiment Velocity</h3>
              <p className="text-on-surface-variant text-body-sm">Tracking volatility and growth over a 30-day window</p>
            </div>
            <div className="p-2 glass rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              <span className="text-sm font-bold text-white">{data?.stats?.total_trend}% <span className="font-normal text-neutral-500">vs last period</span></span>
            </div>
          </div>

          <div className="relative h-[250px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#89ceff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#89ceff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#464554" tick={{ fill: '#908fa0', fontSize: 10, fontFamily: 'Space Grotesk' }} />
                <YAxis stroke="#464554" tick={{ fill: '#908fa0', fontSize: 10, fontFamily: 'Space Grotesk' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(16, 32, 52, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(211, 228, 254, 0.1)',
                    borderRadius: '8px',
                    color: '#d3e4fe'
                  }}
                  itemStyle={{ color: '#d3e4fe' }}
                />
                <Area type="monotone" dataKey="positive" stroke="#89ceff" fillOpacity={1} fill="url(#colorPos)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Heatmap & AI Insights */}
        <section className="col-span-12 lg:col-span-8 glass p-lg rounded-xl inner-glow">
          <h3 className="font-h2 text-white mb-6">Activity Heatmap</h3>
          <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
            {/* Generate random mock heatmap cells */}
            {Array.from({ length: 4 * 24 }).map((_, i) => {
              const opacity = [10, 20, 30, 40, 50, 60, 80, 90][Math.floor(Math.random() * 8)];
              return (
                <div key={i} className={`aspect-square rounded-[2px] ${opacity >= 80 ? 'shadow-lg shadow-indigo-500/20' : ''}`} style={{ backgroundColor: `rgba(99, 102, 241, ${opacity / 100})` }}></div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-neutral-500 font-mono">
            <span>Less Active</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-indigo-500/10"></div>
              <div className="w-3 h-3 rounded-[2px] bg-indigo-500/40"></div>
              <div className="w-3 h-3 rounded-[2px] bg-indigo-500/70"></div>
              <div className="w-3 h-3 rounded-[2px] bg-indigo-500"></div>
            </div>
            <span>Highly Active</span>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-lg rounded-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-indigo-400 text-label-caps uppercase tracking-tighter">AI Insight Engine</span>
            </div>
            <p className="text-white font-h2 leading-tight">Unexpected surge in <span className="text-indigo-400">#{activeQuery}</span> sentiment detected.</p>
            <p className="text-on-surface-variant text-body-sm">The shift correlates with the recent trends, driving a {data?.stats?.total_trend}% increase in discussions.</p>
            <div className="pt-4 flex gap-3">
              <button className="bg-white text-indigo-950 px-4 py-2 rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors">
                Read Analysis
              </button>
              <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 border border-white/10 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
