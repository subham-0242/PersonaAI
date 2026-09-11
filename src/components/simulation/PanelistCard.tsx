'use client';

import React from 'react';
import { ActiveSpeaker } from '../../types';
import { AudioEqualizer } from '../shared/AudioEqualizer';
import { Cpu, DollarSign, Users2, Volume2, Radio } from 'lucide-react';

interface PanelistCardProps {
  personaKey: 'TECH_LEAD' | 'PRODUCT_MANAGER' | 'HIRING_MANAGER';
  name: string;
  roleTitle: string;
  focusArea: string;
  avatarUrl: string;
  activeSpeaker: ActiveSpeaker;
  onSelectSpeaker?: () => void;
}

export const PanelistCard: React.FC<PanelistCardProps> = ({
  personaKey,
  name,
  roleTitle,
  focusArea,
  avatarUrl,
  activeSpeaker,
  onSelectSpeaker,
}) => {
  const isActive = activeSpeaker === personaKey;
  const isListening = activeSpeaker === 'CANDIDATE';
  const isStandby = !isActive && !isListening;

  const iconConfig = {
    TECH_LEAD: {
      icon: Cpu,
      color: 'blue' as const,
      accentText: 'text-blue-400',
      badgeBorder: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    },
    PRODUCT_MANAGER: {
      icon: DollarSign,
      color: 'violet' as const,
      accentText: 'text-violet-400',
      badgeBorder: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    },
    HIRING_MANAGER: {
      icon: Users2,
      color: 'amber' as const,
      accentText: 'text-amber-400',
      badgeBorder: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
  };

  const config = iconConfig[personaKey];
  const Icon = config.icon;

  return (
    <div
      onClick={onSelectSpeaker}
      className={`relative rounded-xl transition-all duration-300 overflow-hidden cursor-pointer border p-4 flex flex-col justify-between ${
        isActive
          ? 'bg-slate-900/95 border-emerald-500 ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20 translate-y-[-2px]'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Bar: Persona Status Badge & Audio Waveform */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`flex h-2 w-2 rounded-full ${
              isActive
                ? 'bg-emerald-400 animate-ping'
                : isListening
                ? 'bg-blue-400'
                : 'bg-slate-600'
            }`}
          />
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isListening
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}
          >
            {isActive ? '[ACTIVE SPEAKER]' : isListening ? '[LISTENING]' : '[STANDBY]'}
          </span>
        </div>

        {/* Pulsing Audio Equalizer */}
        <div className="h-6 flex items-center">
          <AudioEqualizer isActive={isActive} color={config.color} barCount={8} />
        </div>
      </div>

      {/* Center: Avatar & Persona Details */}
      <div className="flex items-start gap-3.5 my-1">
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
              isActive ? 'border-emerald-400 ring-4 ring-emerald-500/20' : 'border-slate-700'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          </div>
          <span
            className={`absolute -bottom-1 -right-1 p-1 rounded-md bg-slate-950 border border-slate-700 ${config.accentText}`}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100 truncate">{name}</h4>
            {isActive && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <Volume2 className="w-3 h-3 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-slate-400 leading-snug">{roleTitle}</div>
          <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
            {focusArea}
          </p>
        </div>
      </div>

      {/* Footer Pill: Evaluator Focus */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Evaluation Lens:</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${config.badgeBorder}`}>
          {personaKey === 'TECH_LEAD'
            ? 'Concurrency & Architecture'
            : personaKey === 'PRODUCT_MANAGER'
            ? 'ROI, SLA & Egress FinOps'
            : 'STAR Ownership & Culture'}
        </span>
      </div>
    </div>
  );
};
