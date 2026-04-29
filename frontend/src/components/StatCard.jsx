export default function StatCard({ title, value, icon, iconColor, trend, trendText, progress, progressColor }) {
  return (
    <div className="glass inner-glow p-md rounded-xl space-y-sm hover:scale-[1.02] transition-transform duration-300">
      <div className="flex justify-between items-start">
        <p className="text-on-surface-variant font-label-caps uppercase">{title}</p>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-h1 font-h1 text-white">{value}</p>
        
        {trend !== undefined && (
          <p className="text-xs text-secondary flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {trend > 0 ? '+' : ''}{trend}% {trendText}
          </p>
        )}
        
        {progress !== undefined && (
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
            <div className={`${progressColor} h-full`} style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
