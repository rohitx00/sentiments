export default function Sidebar({ activeTab, onSelectTab, isDark }) {
  const tabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'live-feed', icon: 'rss_feed', label: 'Live Feed' },
    { id: 'analytics', icon: 'leaderboard', label: 'Analytics' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full w-[240px] border-r flex flex-col py-6 z-50 transition-colors duration-300 ${
      isDark ? 'border-white/10 bg-neutral-950' : 'border-black/5 bg-white'
    }`}>
      <div className="px-6 mb-10">
        <h1 className="text-lg font-black bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">SentimentOS</h1>
        <p className={`text-[10px] font-mono tracking-widest mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>v1.0.4</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === tab.id
              ? 'bg-indigo-500/10 text-indigo-500 border-l-2 border-indigo-500 font-medium'
              : isDark
                ? 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border-l-2 border-transparent'
                : 'text-neutral-400 hover:text-neutral-800 hover:bg-black/5 border-l-2 border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>


    </aside>
  );
}
