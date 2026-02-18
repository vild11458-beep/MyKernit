import React from 'react';
import { clsx } from 'clsx';
import { Sidebar } from './Sidebar';

/**
 * Main layout wrapper for the application.
 * Updated for the "Nordic Forest" Premium Light Mode experience.
 */
export function Layout({ children, className }) {
  return (
    <div className={clsx(
      "h-screen w-full bg-[#F8F9F5] text-slate-900 font-sans flex overflow-hidden",
      className
    )}>
      {/* Fixed Sidebar - width is 72 (18rem / 288px) */}
      <Sidebar />

      {/* Content wrapper - anchored to the right of the sidebar, filling 100% height */}
      <main className="flex-1 ml-72 h-screen relative bg-[#F8F9F5] flex flex-col overflow-hidden">
        {/* Layered background blurs - Clean Emerald Accents */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-900/[0.03] rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        {/* Inner Scrollable area - This is where the actual content lives */}
        <div className="flex-1 w-full overflow-y-auto relative z-10 scroll-smooth custom-scrollbar">
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </div>

        {/* Subtle separator to give the sidebar depth */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-100 z-20"></div>
      </main>
    </div>
  );
}
