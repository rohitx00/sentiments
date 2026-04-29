export default function LiveFeed({ tweets }) {
  const getSentimentStyle = (sentiment) => {
    switch(sentiment) {
      case 'Positive': return 'text-secondary bg-secondary/10';
      case 'Negative': return 'text-error bg-error/10';
      default: return 'text-neutral-400 bg-white/10';
    }
  };

  return (
    <div className="glass inner-glow p-lg rounded-xl flex flex-col h-full max-h-[600px]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h4 className="text-white font-semibold">Emerging High-Impact Mentions</h4>
        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-neutral-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          Live Feed
        </span>
      </div>
      
      <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
        {tweets?.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className="flex gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <img 
                alt="Avatar" 
                className="w-10 h-10 rounded-full bg-white/10" 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tweet.user || tweet.id}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-bold text-white truncate">@{tweet.user || `user_${tweet.id}`}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${getSentimentStyle(tweet.sentiment)}`}>
                    {tweet.sentiment}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed break-words">
                  {tweet.text}
                </p>
                <div className="text-[10px] text-neutral-500 font-mono mt-2">
                  {new Date(tweet.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
            <span className="material-symbols-outlined text-[32px] animate-pulse">sensors</span>
            <p className="text-sm font-mono">Listening for signals...</p>
          </div>
        )}
      </div>
    </div>
  );
}
