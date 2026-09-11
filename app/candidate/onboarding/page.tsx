'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { AudioEqualizer } from '@/src/components/shared/AudioEqualizer';
import { useAppStore } from '@/src/store/useAppStore';
import { mockExtractedSkills } from '@/src/mock/mockCandidate';
import {
  FileText,
  UploadCloud,
  Mic,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Radio,
  Sparkles,
} from 'lucide-react';

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { startSimulation } = useAppStore();

  const [targetRole, setTargetRole] = useState('Senior Distributed Systems Engineer');
  const [seniority, setSeniority] = useState('Senior');
  const [resumeFileName, setResumeFileName] = useState('Aarav_Sharma_Backend_Resume.pdf');
  const [isMicTesting, setIsMicTesting] = useState(true);
  const [micDevice, setMicDevice] = useState('Built-in MacBook Pro Microphone (CoreAudio)');
  const [speakerTestFeedback, setSpeakerTestFeedback] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleTestSpeaker = () => {
    setSpeakerTestFeedback(true);
    // Play synthetic chime via AudioContext if available
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }
      }
    } catch {
      // AudioContext unavailable or blocked in iframe
    }
    setTimeout(() => setSpeakerTestFeedback(false), 2000);
  };

  const handleEnterArena = () => {
    if (!consentAccepted) return;
    startSimulation();
    router.push('/candidate/simulation');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Step Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Pre-Interview Calibration & Consent Gate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
            Calibrate Simulation Environment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Verify resume context, test bidirectional audio streaming latency, and accept evaluation disclosures before entering the arena.
          </p>
        </div>

        {/* Step 1: Role & Resume Context */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              1
            </span>
            <span>Target Role & Resume Ground Truth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Role Track
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>Senior Distributed Systems Engineer</option>
                <option>Staff Platform & Reliability Engineer</option>
                <option>Lead Backend Architect</option>
                <option>Technical Product Manager — Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Seniority Level
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>Junior (0-2 years)</option>
                <option>Mid (2-5 years)</option>
                <option>Senior (5-8 years)</option>
                <option>Staff / Principal (8+ years)</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Resume Upload Box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">{resumeFileName}</div>
                <div className="text-[11px] text-slate-400">2.4 MB • Extracted 10 verified claims • PDF</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Parsed & Ready
              </span>
              <button
                type="button"
                onClick={() => alert('Resume uploaded and extracted successfully.')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
              >
                Replace File
              </button>
            </div>
          </div>

          {/* Extracted Skills Chips */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Extracted Technical Competency Claims:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {mockExtractedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-medium text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Hardware & Audio Calibration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              2
            </span>
            <span>Hardware & Low-Latency Audio Streaming Calibration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Microphone Input Device
              </label>
              <select
                value={micDevice}
                onChange={(e) => setMicDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>Built-in MacBook Pro Microphone (CoreAudio)</option>
                <option>USB Audio Interface / Shure MV7</option>
                <option>Bluetooth Headset (AirPods Pro Low-Latency)</option>
              </select>
            </div>

            {/* Test Speaker Button */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Audio Output & Speaker Check
              </label>
              <button
                type="button"
                onClick={handleTestSpeaker}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  speakerTestFeedback
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{speakerTestFeedback ? 'Playing Clean Test Chime...' : 'Test Speaker Audio'}</span>
              </button>
            </div>
          </div>

          {/* Live Visual Volume Meter Reacting to Audio */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Live Microphone Sensitivity Meter</div>
                <div className="text-[11px] text-slate-400">Stream status: Active • Latency &lt;180ms</div>
              </div>
            </div>

            {/* Equalizer Waveform */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              <div className="h-8 w-44 bg-slate-900 rounded-lg px-2 border border-slate-800 flex items-center justify-center">
                <AudioEqualizer isActive={isMicTesting} color="emerald" barCount={16} heightClass="h-6" />
              </div>
              <button
                type="button"
                onClick={() => setIsMicTesting(!isMicTesting)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                {isMicTesting ? 'Pause Test' : 'Resume Test'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Mandatory AI Disclosure & Consent Gate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              3
            </span>
            <span>Mandatory AI Autonomous Disclosure & Consent Gate</span>
          </div>

          {/* Prominent Alert Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 mb-1 font-bold">Notice & Evaluation Protocol:</strong>
              You are entering an adaptive workplace simulation conducted by autonomous AI panelists:
              <strong className="text-slate-200"> Alex (Principal Tech Lead)</strong>,
              <strong className="text-slate-200"> Sarah (Lead Product Manager)</strong>, and
              <strong className="text-slate-200"> Jordan (Hiring Lead)</strong>.
              Voice audio is streamed in real time, and your responses are cross-examined against stated resume claims to generate a cryptographic competency passport.
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 mt-0.5 focus:ring-emerald-500 shrink-0"
            />
            <span className="text-xs text-slate-200 font-medium leading-relaxed">
              I understand and consent to autonomous AI voice interaction, real-time interruption handling, and evidence-grounded competency recording.
            </span>
          </label>
        </div>

        {/* Action Button: Enter Arena */}
        <div className="pt-2 flex justify-end">
          <button
            id="enter-simulation-arena-btn"
            disabled={!consentAccepted}
            onClick={handleEnterArena}
            className={`py-3 px-6 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 ${
              consentAccepted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>Enter Simulation Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
}
