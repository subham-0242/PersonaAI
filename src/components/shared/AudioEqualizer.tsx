'use client';

import React from 'react';

interface AudioEqualizerProps {
  isActive: boolean;
  color?: 'emerald' | 'violet' | 'amber' | 'blue';
  barCount?: number;
  heightClass?: string;
}

export const AudioEqualizer: React.FC<AudioEqualizerProps> = ({
  isActive,
  color = 'emerald',
  barCount = 12,
  heightClass = 'h-6',
}) => {
  const colorMap = {
    emerald: 'bg-emerald-400 shadow-emerald-500/50',
    violet: 'bg-violet-400 shadow-violet-500/50',
    amber: 'bg-amber-400 shadow-amber-500/50',
    blue: 'bg-blue-400 shadow-blue-500/50',
  };

  // 12 pseudo heights for dynamic pulsing feel
  const activeHeights = [30, 75, 45, 95, 60, 85, 40, 100, 70, 50, 90, 65];

  return (
    <div className={`flex items-end justify-center gap-0.5 ${heightClass} px-1`} aria-label="Audio Visualizer">
      {Array.from({ length: barCount }).map((_, idx) => {
        const heightPercent = isActive
          ? activeHeights[idx % activeHeights.length]
          : 15;
        const animationDelay = (idx * 0.08).toFixed(2);

        return (
          <span
            key={idx}
            className={`w-1 rounded-full transition-all duration-200 ${
              isActive ? colorMap[color] : 'bg-slate-700'
            }`}
            style={{
              height: `${heightPercent}%`,
              transitionDelay: `${animationDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};
