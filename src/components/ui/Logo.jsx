import React from 'react';
import { clsx } from 'clsx';

/**
 * Aggressively zoomed and cropped logo to isolate ONLY the shield icon.
 * Hides all internal baked-in text from the source image.
 */
export function Logo({ className = "w-12 h-12", showText = false }) {
    return (
        <div className={clsx("flex flex-col items-center justify-center", !showText && className, showText && "w-full")}>
            <div className={clsx("relative flex items-center justify-center", showText && className)}>
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-2xl select-none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#065f46" />
                            <stop offset="100%" stopColor="#064e3b" />
                        </linearGradient>
                        <filter id="bookGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Outer Spread Reflection */}
                    <path
                        d="M50 85C30 85 15 81 10 77V32C15 36 30 40 50 40C70 40 85 36 90 32V77C85 81 70 85 50 85Z"
                        fill="#059669"
                        fillOpacity="0.05"
                        transform="scale(1.1) translate(-4.5, -4.5)"
                    />

                    {/* Left Page Shadow Detail */}
                    <path
                        d="M50 82C30 82 15 78 10 74V28C15 32 30 36 50 36V82Z"
                        fill="url(#bookGradient)"
                        filter="url(#bookGlow)"
                    />

                    {/* Right Page Shadow Detail */}
                    <path
                        d="M50 82C70 82 85 78 90 74V28C85 32 70 36 50 36V82Z"
                        fill="url(#bookGradient)"
                        filter="url(#bookGlow)"
                    />

                    {/* White Page Surfaces for Contrast */}
                    <path
                        d="M50 80C32 80 17 76 12 73V29C17 33 32 37 50 37V80Z"
                        fill="white"
                        fillOpacity="0.07"
                    />
                    <path
                        d="M50 80C68 80 83 76 88 73V29C83 33 68 37 50 37V80Z"
                        fill="white"
                        fillOpacity="0.03"
                    />

                    {/* Center Spine Line */}
                    <path
                        d="M50 35V82"
                        stroke="white"
                        strokeOpacity="0.2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />

                    {/* Ledger Lines (Left Page) */}
                    <g stroke="white" strokeOpacity="0.1" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M22 45C28 47 38 48 44 48" />
                        <path d="M20 53C26 55 36 56 42 56" />
                        <path d="M18 61C24 63 34 64 40 64" />
                    </g>

                    {/* Ledger Icon (Right Page) */}
                    <circle cx="70" cy="55" r="8" fill="white" fillOpacity="0.05" className="animate-pulse" />
                    <path
                        d="M66 55L69 58L74 53"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse-soft"
                    />

                    {/* Subtle Highlight Reflection */}
                    <path
                        d="M15 30C30 35 45 36 50 36"
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeWidth="0.5"
                    />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col items-center animate-fade-in-up mt-8 text-center">
                    <span className="font-extrabold tracking-tight text-emerald-950 text-5xl leading-none italic">
                        My Kernit
                    </span>
                    <div className="flex items-center justify-center gap-2 mt-4 bg-emerald-950/5 px-4 py-1.5 rounded-full border border-emerald-950/10 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[11px] font-black text-emerald-900 uppercase tracking-[0.4em] italic leading-none">
                            Admin Pro
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
