export default function LiveFeedPage({ tweets, activeQuery }) {
  const getSentimentStyles = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        icon: 'recommend',
        label: 'Positive',
        cardBorder: 'hover:border-emerald-500/30'
      };
      case 'Negative': return {
        bg: 'bg-error/10 border-error/20 text-error',
        icon: 'mood_bad',
        label: 'Negative',
        cardBorder: 'hover:border-error/30'
      };
      default: return {
        bg: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400',
        icon: 'drag_handle',
        label: 'Neutral',
        cardBorder: 'hover:border-neutral-500/30'
      };
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] -mx-6 lg:-mx-8 -my-8 flex overflow-hidden">
      {/* Live Feed Panel */}
      <section className="flex-1 flex flex-col border-r border-white/5 bg-surface-container-lowest">
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-surface-container-low/50">
          <div>
            <h2 className="font-h1 text-h1 text-white">Live Stream</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-body-sm font-body-sm text-neutral-400 uppercase tracking-tighter">Monitoring #{activeQuery}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-indigo-400">speed</span>
              <span className="text-xs font-mono text-indigo-400">LATENCY: 42ms</span>
            </div>
          </div>
        </div>
        
        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
          {tweets?.length > 0 ? (
            tweets.map(tweet => {
              const styles = getSentimentStyles(tweet.sentiment);
              return (
                <div key={tweet.id} className={`glass inner-glow rounded-2xl p-6 transition-all ${styles.cardBorder} group border border-white/5`}>
                  <div className="flex gap-4">
                    <img alt="Avatar" className="w-12 h-12 rounded-full border border-white/10 bg-white/10" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tweet.user || tweet.id}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">@{tweet.user || `user_${tweet.id}`}</span>
                          <span className="text-neutral-600 text-sm">· {new Date(tweet.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className={`px-3 py-0.5 rounded-full border text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 ${styles.bg}`}>
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{styles.icon}</span>
                          {styles.label}
                        </div>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface mb-4 leading-relaxed break-words">
                        {tweet.text}
                      </p>
                      <div className="flex items-center gap-6 text-neutral-500">
                        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"><span className="material-symbols-outlined text-lg">chat_bubble</span> <span className="text-xs">0</span></button>
                        <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"><span className="material-symbols-outlined text-lg">repeat</span> <span className="text-xs">0</span></button>
                        <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"><span className="material-symbols-outlined text-lg">favorite</span> <span className="text-xs">0</span></button>
                        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors ml-auto"><span className="material-symbols-outlined text-lg">share</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
              <span className="material-symbols-outlined text-[32px] animate-pulse">sensors</span>
              <p className="text-sm font-mono">Listening for signals...</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Right Filter Sidebar */}
      <aside className="w-80 bg-surface flex flex-col p-8 overflow-y-auto custom-scrollbar border-l border-white/5">
        <h3 className="font-label-caps text-label-caps text-neutral-500 mb-6 uppercase tracking-widest">Sentiment Filters</h3>
        <div className="space-y-3 mb-10">
          <button className="w-full flex items-center justify-between p-3 rounded-xl glass border-indigo-500/40 text-white inner-glow transition-all">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-400">apps</span>
              <span className="text-body-sm font-semibold">All Feed</span>
            </div>
            <span className="text-xs font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-400">{tweets?.length || 0}</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-neutral-400 transition-all border border-transparent">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400">check_circle</span>
              <span className="text-body-sm">Positive</span>
            </div>
            <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded">{tweets?.filter(t => t.sentiment === 'Positive').length || 0}</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-neutral-400 transition-all border border-transparent">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error">error</span>
              <span className="text-body-sm">Negative Only</span>
            </div>
            <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-error">{tweets?.filter(t => t.sentiment === 'Negative').length || 0}</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-neutral-400 transition-all border border-transparent">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neutral-500">radio_button_checked</span>
              <span className="text-body-sm">Neutral</span>
            </div>
            <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded">{tweets?.filter(t => t.sentiment === 'Neutral').length || 0}</span>
          </button>
        </div>
        
        <h3 className="font-label-caps text-label-caps text-neutral-500 mb-6 uppercase tracking-widest">Trending Keywords</h3>
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-on-surface-variant hover:border-indigo-500/50 cursor-pointer transition-colors">#{activeQuery}</span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-on-surface-variant hover:border-indigo-500/50 cursor-pointer transition-colors">#tech</span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-on-surface-variant hover:border-indigo-500/50 cursor-pointer transition-colors">#live</span>
        </div>
        
        <div className="mt-auto p-4 glass rounded-2xl border border-indigo-500/20 inner-glow">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-indigo-400 text-sm">auto_awesome</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Insights</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed italic">
            "Feed is currently active with {tweets?.length || 0} mentions. Sentiment is shifting based on recent {activeQuery} interactions."
          </p>
        </div>
      </aside>
    </div>
  );
}
