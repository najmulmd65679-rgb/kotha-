import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Shield, LogOut, ArrowLeft, Bell, UserCheck } from 'lucide-react';

interface Props {
  onBackToUserApp: () => void;
}

export const AdminHeader: React.FC<Props> = ({ onBackToUserApp }) => {
  const { currentAdmin, logoutAdmin } = useAdminAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'finance_admin':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'moderator':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Switch back to User App button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToUserApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
          title="Return to the live streaming User App"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>User App (অ্যাপ)-এ যান</span>
        </button>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-400">Firebase Firestore Live Sync</span>
        </div>
      </div>

      {/* Right: Admin profile & Logout */}
      <div className="flex items-center gap-3">
        {currentAdmin && (
          <div className="flex items-center gap-2.5 bg-slate-850 border border-slate-700/60 rounded-full pl-3 pr-1.5 py-1">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {currentAdmin.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {currentAdmin.email}
              </span>
            </div>

            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${getRoleBadge(
                currentAdmin.role
              )}`}
            >
              {currentAdmin.role.replace('_', ' ')}
            </span>

            <button
              type="button"
              onClick={logoutAdmin}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
