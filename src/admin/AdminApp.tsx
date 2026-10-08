import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminLogin } from './components/AdminLogin';
import { DashboardView } from './components/views/DashboardView';
import { UserManagementView } from './components/views/UserManagementView';
import { WalletManagementView } from './components/views/WalletManagementView';
import { LevelConfigView } from './components/views/LevelConfigView';
import { GiftManagementView } from './components/views/GiftManagementView';
import { RechargeManagementView } from './components/views/RechargeManagementView';
import { WithdrawalManagementView } from './components/views/WithdrawalManagementView';
import { LiveManagementView } from './components/views/LiveManagementView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationManagementView } from './components/views/NotificationManagementView';
import { AdminManagementView } from './components/views/AdminManagementView';
import { AuditLogView } from './components/views/AuditLogView';
import { RankingsConfigView } from './components/views/RankingsConfigView';

interface Props {
  onBackToUserApp: () => void;
}

const AdminPortalContent: React.FC<Props> = ({ onBackToUserApp }) => {
  const { currentAdmin, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  // If not authenticated as an authorized admin, show AdminLogin
  if (!currentAdmin) {
    return <AdminLogin onBackToUserApp={onBackToUserApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <AdminHeader onBackToUserApp={onBackToUserApp} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'users' && <UserManagementView />}
            {activeTab === 'wallet' && <WalletManagementView />}
            {(activeTab === 'wallet_levels' || activeTab === 'charm_levels') && <LevelConfigView />}
            {activeTab === 'gifts' && <GiftManagementView />}
            {activeTab === 'recharge' && <RechargeManagementView />}
            {activeTab === 'withdrawals' && <WithdrawalManagementView />}
            {activeTab === 'live' && <LiveManagementView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'rankings' && <RankingsConfigView />}
            {activeTab === 'notifications' && <NotificationManagementView />}
            {activeTab === 'admins' && <AdminManagementView />}
            {activeTab === 'audit' && <AuditLogView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export const AdminApp: React.FC<Props> = ({ onBackToUserApp }) => {
  return (
    <AdminAuthProvider>
      <AdminPortalContent onBackToUserApp={onBackToUserApp} />
    </AdminAuthProvider>
  );
};
