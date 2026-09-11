'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        id="theme-toggle-pill-btn"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-all ${
          isDark
            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-200">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline text-slate-700">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <div
        className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-300'
            : 'bg-slate-100/90 border-slate-200 text-slate-700'
        } ${className}`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
        </div>

        <button
          id="theme-toggle-switch-btn"
          onClick={toggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={`Toggle to ${isDark ? 'light' : 'dark'} mode`}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            isDark ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }

  // Default compact icon button
  return (
    <button
      id="theme-toggle-compact-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700/80 hover:border-slate-600'
          : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300 hover:border-slate-400 shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
