import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Award,
  Sparkles,
  Gift,
  CreditCard,
  ArrowDownToLine,
  Radio,
  AlertTriangle,
  Trophy,
  Bell,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'wallet'
  | 'wallet_levels'
  | 'charm_levels'
  | 'gifts'
  | 'recharge'
  | 'withdrawals'
  | 'live'
  | 'reports'
  | 'rankings'
  | 'notifications'
  | 'admins'
  | 'audit';

interface Props {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const { hasPermission } = useAdminAuth();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet & Coins', icon: <Wallet className="w-4 h-4" /> },
    { id: 'wallet_levels', label: 'Wallet Levels', icon: <Award className="w-4 h-4" /> },
    { id: 'charm_levels', label: 'Charm Levels', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'gifts', label: 'Gift Management', icon: <Gift className="w-4 h-4" /> },
    { id: 'recharge', label: 'Recharge Packages', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'Withdrawal Queue', icon: <ArrowDownToLine className="w-4 h-4" />, badge: 'Queue' },
    { id: 'live', label: 'Live Broadcasts', icon: <Radio className="w-4 h-4" /> },
    { id: 'reports', label: 'Safety Reports', icon: <AlertTriangle className="w-4 h-4" />, badge: 'Active' },
    { id: 'rankings', label: 'Rankings Config', icon: <Trophy className="w-4 h-4" /> },
    { id: 'notifications', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
    { id: 'admins', label: 'Admin Staff & Roles', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trail Logs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30">
          K
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white leading-tight">Kotha Admin</h2>
          <span className="text-[10px] text-slate-400 font-mono">Control Engine v2.0</span>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Firestore RBAC:</span>
          <span className="text-emerald-400 font-semibold font-mono">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Security Mode:</span>
          <span className="text-indigo-400 font-semibold">Strict Zero-Trust</span>
        </div>
      </div>
    </aside>
  );
};
