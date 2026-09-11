'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TranscriptEntry } from '../../types';
import {
  Volume2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Play,
  Pause,
  ArrowDown,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const TranscriptStream: React.FC = () => {
  const { transcripts, audioPlayingTimestamp, playAudioSnapshot } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  const getSpeakerStyle = (role: TranscriptEntry['role']) => {
    switch (role) {
      case 'TECH_LEAD':
        return {
          label: 'Alex — Principal Tech Lead',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          bubble: 'bg-slate-900/90 border-blue-900/40 text-slate-200',
        };
      case 'PRODUCT_MANAGER':
        return {
          label: 'Sarah — Lead Product Manager',
          badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
          bubble: 'bg-slate-900/90 border-violet-900/40 text-slate-200',
        };
      case 'HIRING_MANAGER':
        return {
          label: 'Jordan — Hiring Lead',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          bubble: 'bg-slate-900/90 border-amber-900/40 text-slate-200',
        };
      case 'CANDIDATE':
      default:
        return {
          label: 'Aarav Sharma — Senior Candidate',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          bubble: 'bg-slate-900/95 border-emerald-900/50 text-slate-100 shadow-lg shadow-emerald-950/20',
        };
    }
  };

  const renderFlagChip = (entry: TranscriptEntry) => {
    if (!entry.flag) return null;

    let flagStyle = 'bg-slate-800 text-slate-300 border-slate-700';
    let Icon = Sparkles;

    if (entry.flagType === 'success' || entry.flag.includes('VERIFIED') || entry.flag.includes('EVIDENCE')) {
      flagStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      Icon = CheckCircle;
    } else if (entry.flagType === 'warning' || entry.flag.includes('INTERRUPTION') || entry.flag.includes('PROBE')) {
      flagStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      Icon = AlertTriangle;
    } else if (entry.flagType === 'contradiction' || entry.flag.includes('CONTRADICTION')) {
      flagStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse';
      Icon = ShieldAlert;
    } else if (entry.flagType === 'info' || entry.flag.includes('HANDOFF')) {
      flagStyle = 'bg-violet-500/15 text-violet-300 border-violet-500/40';
      Icon = HelpCircle;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold mt-2 ${flagStyle}`}>
        <Icon className="w-3 h-3 shrink-0" />
        <span>{entry.flag}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-950/60 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      {/* Stream Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Evaluated Transcript Stream
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {transcripts.length} Turns Captured
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!autoScroll && (
            <button
              onClick={() => {
                setAutoScroll(true);
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }}
              className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium transition-colors"
            >
              <ArrowDown className="w-3 h-3" />
              Jump to Latest
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Audio Sync: 0.18s latency
          </span>
        </div>
      </div>

      {/* Transcript Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth"
      >
        {transcripts.map((entry) => {
          const style = getSpeakerStyle(entry.role);
          const isCandidate = entry.role === 'CANDIDATE';
          const isAudioPlaying = audioPlayingTimestamp === entry.timestamp;

          return (
            <div
              key={entry.id}
              className={`flex flex-col transition-all duration-200 ${
                isCandidate ? 'items-end pl-6' : 'items-start pr-6'
              }`}
            >
              {/* Speaker Metadata Bar */}
              <div className="flex items-center gap-2 mb-1 text-xs">
                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${style.badge}`}>
                  {style.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{entry.timestamp}</span>

                {/* Audio Bookmark Playback Button */}
                {entry.audioBookmarkSeconds !== undefined && (
                  <button
                    onClick={() => playAudioSnapshot(entry.timestamp)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      isAudioPlaying
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700/60'
                    }`}
                    title="Play recorded audio segment bookmark"
                  >
                    {isAudioPlaying ? (
                      <>
                        <Pause className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Playing Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Play Audio Clip</span>
                      </>
                    )}
                  </button>
                )}

                {entry.competencyTag && (
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60 hidden sm:inline">
                    Tag: {entry.competencyTag}
                  </span>
                )}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-2xl p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${style.bubble}`}
              >
                <p className="whitespace-pre-wrap">{entry.text}</p>
                {renderFlagChip(entry)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
