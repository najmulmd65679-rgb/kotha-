import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<Props> = ({ children }) => {
  const { isMobileFrame, toggleMobileFrame } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('12:00');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isMobileFrame) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col max-w-lg mx-auto shadow-2xl relative">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Device frame container */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-neutral-950 rounded-[44px] shadow-[0_0_60px_-15px_rgba(236,72,153,0.3)] border-[8px] border-neutral-800 flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Android Punch Hole Camera & Speaker */}
        <div className="relative z-40 bg-neutral-950 px-6 pt-2 pb-1 flex items-center justify-between text-neutral-400 text-[11px] font-semibold border-b border-neutral-900/40">
          {/* Status Bar Left: Clock */}
          <span className="font-mono text-white tracking-tight text-xs">{currentTime}</span>

          {/* Punch Hole Camera in Center */}
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-800 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950/60" />
          </div>

          {/* Status Bar Right: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-[10px] font-bold">5G</span>
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Inner Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="relative z-40 bg-neutral-950 py-1 flex justify-center items-center pointer-events-none">
          <div className="w-32 h-1 bg-neutral-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
