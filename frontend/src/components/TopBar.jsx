export default function TopBar({ activeQuery, onSelectKey, onRefresh, isRefreshing, isDark, onToggleTheme }) {
  const keywords = ['school', 'weekend', 'movie', 'summer', 'friends', 'phone'];

  const btnBase = `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 border`;
  const btnIdle = isDark
    ? 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border-white/5 hover:border-white/20'
    : 'bg-black/5 text-neutral-600 hover:bg-black/10 hover:text-black border-black/5 hover:border-black/20';

  return (
    <header className={`fixed top-0 right-0 h-16 w-[calc(100%-240px)] border-b backdrop-blur-xl flex justify-between items-center px-6 z-40 shadow-2xl transition-colors duration-300 ${
      isDark
        ? 'border-white/10 bg-neutral-950/80 shadow-black/50'
        : 'border-black/5 bg-white/80 shadow-black/10'
    }`}>
      <div className="flex items-center gap-4 flex-1 w-full">
        <div className="flex justify-between flex-1 pr-8">
          {keywords.map(kw => (
            <button
              key={kw}
              onClick={() => onSelectKey(kw)}
              className={`px-6 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${activeQuery === kw
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/50 shadow-[inset_0_0_20px_rgba(99,102,241,0.2),0_0_15px_rgba(99,102,241,0.3)]'
                : isDark
                  ? 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20'
                  : 'bg-black/5 text-neutral-500 hover:bg-black/10 hover:text-neutral-800 border border-black/5 hover:border-black/20'
              }`}
            >
              {kw.charAt(0).toUpperCase() + kw.slice(1)}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`${btnBase} ${
            isRefreshing
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] cursor-not-allowed'
              : btnIdle
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
          <span className="hidden sm:inline">{isRefreshing ? 'Syncing…' : 'Refresh'}</span>
        </button>

        {/* Theme toggle button */}
        <button
          onClick={onToggleTheme}
          className={`${btnBase} ${btnIdle}`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
