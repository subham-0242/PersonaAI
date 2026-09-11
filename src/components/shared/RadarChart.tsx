'use client';

import React, { useState } from 'react';

export interface RadarDataPoint {
  label: string;
  value: number; // 0 to 100
  secondaryValue?: number; // e.g., benchmark (0 to 100)
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 320,
  primaryLabel = 'Verified Score',
  secondaryLabel = 'Benchmark',
  primaryColor = '#10b981', // emerald-500
  secondaryColor = '#8b5cf6', // violet-500
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const center = size / 2;
  const radius = size * 0.38;
  const total = data.length;

  const getCoordinates = (value: number, index: number, maxVal = 100) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const distance = (value / maxVal) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const levels = [25, 50, 75, 100];

  // Primary polygon points
  const primaryPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(d.value, i);
      return `${x},${y}`;
    })
    .join(' ');

  // Secondary polygon points (if exists)
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  const secondaryPoints = hasSecondary
    ? data
        .map((d, i) => {
          const { x, y } = getCoordinates(d.secondaryValue || 0, i);
          return `${x},${y}`;
        })
        .join(' ')
    : '';

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Concentric Rings */}
          {levels.map((lvl) => {
            const r = (lvl / 100) * radius;
            return (
              <circle
                key={lvl}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="currentColor"
                className="text-slate-800"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Spokes */}
          {data.map((_, i) => {
            const { x, y } = getCoordinates(100, i);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-slate-800/80"
                strokeWidth="1"
              />
            );
          })}

          {/* Secondary Polygon (Benchmark) */}
          {hasSecondary && (
            <>
              <polygon
                points={secondaryPoints}
                fill={secondaryColor}
                fillOpacity="0.15"
                stroke={secondaryColor}
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {data.map((d, i) => {
                const { x, y } = getCoordinates(d.secondaryValue || 0, i);
                return (
                  <circle
                    key={`sec-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={secondaryColor}
                    className="opacity-70"
                  />
                );
              })}
            </>
          )}

          {/* Primary Polygon (Candidate / Cohort) */}
          <polygon
            points={primaryPoints}
            fill={primaryColor}
            fillOpacity="0.25"
            stroke={primaryColor}
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const { x, y } = getCoordinates(d.value, i);
            const isHovered = hoveredIdx === i;
            return (
              <g key={`pt-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '6' : '4'}
                  fill={primaryColor}
                  className="cursor-pointer transition-all duration-150 stroke-slate-950 stroke-2"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
            const labelDistance = radius + 24;
            const lx = center + labelDistance * Math.cos(angle);
            const ly = center + labelDistance * Math.sin(angle);

            // Text alignment based on horizontal position
            let anchor: 'start' | 'middle' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) anchor = 'start';
            else if (Math.cos(angle) < -0.3) anchor = 'end';

            const isHovered = hoveredIdx === i;

            return (
              <text
                key={`lbl-${i}`}
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="central"
                className={`text-[11px] font-medium transition-colors duration-150 cursor-pointer ${
                  isHovered ? 'fill-emerald-400 font-semibold' : 'fill-slate-400'
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {d.label} ({d.value}%)
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip overlay */}
        {hoveredIdx !== null && (
          <div className="absolute top-2 right-2 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs shadow-xl pointer-events-none z-10 backdrop-blur-md">
            <div className="font-semibold text-slate-200">{data[hoveredIdx].label}</div>
            <div className="text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {primaryLabel}: <span className="font-bold">{data[hoveredIdx].value}%</span>
            </div>
            {hasSecondary && (
              <div className="text-violet-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                {secondaryLabel}: <span className="font-bold">{data[hoveredIdx].secondaryValue}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span>{primaryLabel}</span>
        </div>
        {hasSecondary && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span>{secondaryLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
