/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { RankingView } from './components/RankingView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { LiveRoomModal } from './components/LiveRoomModal';
import { StartLiveModal } from './components/StartLiveModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RechargeModal } from './components/RechargeModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { LoginModal } from './components/LoginModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { AdminApp } from './admin/AdminApp';

const AppContent: React.FC = () => {
  const { activeTab, activeRoom, viewMode, setViewMode } = useApp();
  const [showStartLive, setShowStartLive] = useState(false);

  // If viewing the Standalone Web Admin Panel
  if (viewMode === 'admin_portal') {
    return <AdminApp onBackToUserApp={() => setViewMode('user_app')} />;
  }

  // Regular User App (Untouched & 100% Intact)
  return (
    <AndroidFrame>
      {/* 1-Click Mobile App Install Banner */}
      <InstallAppBanner />

      {/* Top Header */}
      <TopNav />

      {/* Main Tab Screen */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && <HomeView onOpenStartLive={() => setShowStartLive(true)} />}
        {activeTab === 'ranking' && <RankingView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Bottom Tab Bar */}
      <BottomNav onOpenStartLive={() => setShowStartLive(true)} />

      {/* Overlays and Modals */}
      {activeRoom && <LiveRoomModal />}
      {showStartLive && <StartLiveModal onClose={() => setShowStartLive(false)} />}
      <OnboardingModal />
      <RechargeModal />
      <AdminPanelModal />
      <BeginnerGuideModal />
      <LoginModal />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
