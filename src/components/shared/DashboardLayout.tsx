'use client';

import React, { useEffect } from 'react';
import { GlobalDemoBar } from './GlobalDemoBar';
import { AppSidebar } from './AppSidebar';
import { AppNavbar } from './AppNavbar';
import { useAppStore } from '../../store/useAppStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { initTheme } = useAppStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <GlobalDemoBar />
      <div className="flex-1 flex w-full relative min-h-0">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 w-full bg-slate-950">
          <AppNavbar />
          {children}
        </div>
      </div>
    </div>
  );
};

