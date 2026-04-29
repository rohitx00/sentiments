import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Charts({ stats }) {
  const velocityData = stats?.velocity || [
    { time: 'T-5h', positive: 50, negative: 50 },
    { time: 'T-4h', positive: 55, negative: 45 },
    { time: 'T-3h', positive: 60, negative: 40 },
    { time: 'T-2h', positive: 58, negative: 42 },
    { time: 'T-1h', positive: 62, negative: 38 },
    { time: 'Now', positive: 65, negative: 35 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter w-full">
      {/* Large Line Chart Container */}
      <div className="lg:col-span-2 glass inner-glow p-lg rounded-xl flex flex-col">
        <div className="flex justify-between items-center mb-xl">
          <div>
            <h3 className="text-h2 font-h2 text-white">Sentiment Velocity</h3>
            <p className="text-sm text-on-surface-variant">Real-time flux of positive vs negative engagement</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-xs text-on-surface-variant font-mono">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="text-xs text-on-surface-variant font-mono">Negative</span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Line type="monotone" dataKey="positive" stroke="#89ceff" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="negative" stroke="#ffb4ab" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Pie Chart/Distribution Section */}
      <div className="glass inner-glow p-lg rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-h2 font-h2 text-white">Share of Voice</h3>
          <p className="text-sm text-on-surface-variant mb-xl">Platform-wide distribution</p>
        </div>
        <div className="relative w-48 h-48 mx-auto my-xl">
          {/* Ring Chart Simulation */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#89ceff" strokeDasharray={`${stats?.positive_percent || 64} ${100 - (stats?.positive_percent || 64)}`} strokeWidth="3.5"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ffb4ab" strokeDasharray={`${stats?.negative_percent || 18} ${100 - (stats?.negative_percent || 18)}`} strokeDashoffset={`-${stats?.positive_percent || 64}`} strokeWidth="3.5"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#464554" strokeDasharray={`${stats?.neutral_percent || 18} ${100 - (stats?.neutral_percent || 18)}`} strokeDashoffset={`-${(stats?.positive_percent || 64) + (stats?.negative_percent || 18)}`} strokeWidth="3.5"></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-h2 font-h2 text-white">{stats?.positive_percent || 64}%</span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Reliability</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-neutral-300">Positive Mentions</span>
            </div>
            <span className="font-mono text-white">{stats?.positive_percent || 64}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <span className="text-neutral-300">Negative Signals</span>
            </div>
            <span className="font-mono text-white">{stats?.negative_percent || 18}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
              <span className="text-neutral-300">Neutral Noise</span>
            </div>
            <span className="font-mono text-white">{stats?.neutral_percent || 18}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
