import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, HelpCircle, Shield, Plus, Smartphone, Monitor } from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    currentUser,
    notifications,
    setShowRechargeModal,
    setShowGuideModal,
    setShowAdminModal,
    isMobileFrame,
    toggleMobileFrame,
    setActiveTab,
    setViewMode,
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 px-3 py-2.5 flex items-center justify-between text-white">
      {/* Brand & Live status */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center font-black text-sm shadow-md shadow-pink-500/20 text-white">
          K
        </div>
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 text-sm">
              Kotha Live
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">ID: {currentUser.publicId}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Frame Toggle (Desktop <-> Android Mobile View) */}
        <button
          type="button"
          onClick={toggleMobileFrame}
          title={isMobileFrame ? 'Switch to Full Browser Mode' : 'Switch to Android Frame Mode'}
          className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-cyan-400" /> : <Smartphone className="w-4 h-4 text-pink-400" />}
        </button>

        {/* Beginner Guide in Bangla */}
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 text-xs font-medium transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">গাইড</span>
        </button>

        {/* Coin balance + recharge button */}
        <button
          type="button"
          onClick={() => setShowRechargeModal(true)}
          className="flex items-center gap-1.5 bg-neutral-900 border border-amber-500/40 rounded-full pl-2 pr-1.5 py-0.5 text-xs font-bold text-amber-300 hover:border-amber-400 transition-all shadow-sm group"
        >
          <span>🪙</span>
          <span className="text-[11px] font-mono">{currentUser.coins.toLocaleString()}</span>
          <div className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className="relative p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-neutral-950">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Standalone Admin Web Portal button */}
        <button
          type="button"
          onClick={() => setViewMode('admin_portal')}
          title="Open Standalone Admin Web Portal"
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-indigo-400 hover:text-white transition-colors"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
