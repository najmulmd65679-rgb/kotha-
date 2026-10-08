import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Copy,
  Check,
  Crown,
  Coins,
  Gem,
  LogOut,
  LogIn,
  Settings,
  Shield,
  UserCheck,
  Edit3,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    loginWithGoogle,
    logout,
    setShowRechargeModal,
    setShowOnboardingModal,
    setShowAdminModal,
    setShowLoginModal,
    setViewMode,
    blockedUserIds,
    toggleBlockUser,
  } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showCashoutModal, setShowCashoutModal] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.publicId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // XP calculations for wealth & charm levels
  const currentSpendingLevel = currentUser.spendingLevel;
  const nextSpendingXp = (currentSpendingLevel * currentSpendingLevel) * 100;
  const currentLevelBaseXp = ((currentSpendingLevel - 1) * (currentSpendingLevel - 1)) * 100;
  const progressPercent = Math.min(
    100,
    Math.max(
      5,
      Math.floor(
        ((currentUser.spendingXp - currentLevelBaseXp) /
          Math.max(1, nextSpendingXp - currentLevelBaseXp)) *
          100
      )
    )
  );

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      {/* Profile Header Card */}
      <div className="relative p-4 pt-6 bg-gradient-to-b from-purple-950/80 via-neutral-900 to-neutral-950 border-b border-neutral-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-18 h-18 rounded-full object-cover border-2 border-pink-500 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-[10px] font-bold text-white px-2 py-0.2 rounded-full border border-neutral-900">
                Lv.{currentUser.spendingLevel}
              </span>
            </div>

            {/* Name, ID & Badges */}
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className="text-xs">
                  {currentUser.gender === 'Male' ? '👨' : currentUser.gender === 'Female' ? '👩' : '🌈'}
                </span>
              </h2>

              {/* Unique Public ID with copy button */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold bg-neutral-800/80 px-2 py-0.5 rounded-md text-amber-300 border border-neutral-700">
                  ID: {currentUser.publicId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Copy User ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Age, Gender, Location */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-0.5">
                <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                  {currentUser.age} yrs
                </span>
                <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                  {currentUser.gender}
                </span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span className="truncate max-w-[110px]">{currentUser.location}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit / Setup profile button */}
          <button
            type="button"
            onClick={() => setShowOnboardingModal(true)}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 hover:text-white transition-colors"
            title="Edit Profile Info"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <p className="text-xs text-neutral-300/90 mt-3 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/60 leading-relaxed">
            {currentUser.bio}
          </p>
        )}

        {/* Followers / Following Stats */}
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-neutral-800/60 text-center">
          <div>
            <div className="text-base font-extrabold text-white font-mono">
              {currentUser.followersCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Followers</div>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div>
            <div className="text-base font-extrabold text-white font-mono">
              {currentUser.followingCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Following</div>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div>
            <div className="text-base font-extrabold text-white font-mono">
              {currentUser.receivingLevel}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Charm Grade</div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="p-3 space-y-3">
        {/* Wallet Balance Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-pink-950/40 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>My Wallet & Earnings</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRechargeModal(true)}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-extrabold text-[11px] shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              + Recharge Coins
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Coins */}
            <div className="p-2.5 bg-neutral-900/90 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Virtual Coins</span>
              </div>
              <div className="text-lg font-black text-amber-300 font-mono">
                {currentUser.coins.toLocaleString()}
              </div>
              <span className="text-[9px] text-neutral-500">To send gifts in rooms</span>
            </div>

            {/* Diamonds */}
            <div className="p-2.5 bg-neutral-900/90 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                <Gem className="w-3.5 h-3.5 text-pink-400" />
                <span>Gift Diamonds</span>
              </div>
              <div className="text-lg font-black text-pink-300 font-mono">
                {currentUser.diamonds.toLocaleString()}
              </div>
              <button
                type="button"
                onClick={() => setShowCashoutModal(true)}
                className="text-[9px] text-pink-400 font-semibold hover:underline"
              >
                Cash Out (~${(currentUser.diamonds / 100).toFixed(2)})
              </button>
            </div>
          </div>
        </div>

        {/* Feature 6 & 7: User Spending Level & Gift Receiving Level */}
        <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
          {/* Spending Level */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Wealth Level (Spending):</span>
                <span className="text-amber-400 font-mono">Lv.{currentUser.spendingLevel}</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {currentUser.spendingXp.toLocaleString()} XP
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[9px] text-neutral-500 mt-1 flex justify-between">
              <span>Current: Lv.{currentUser.spendingLevel}</span>
              <span>Next: Lv.{currentUser.spendingLevel + 1} ({nextSpendingXp.toLocaleString()} XP)</span>
            </div>
          </div>

          <div className="h-px bg-neutral-800/80" />

          {/* Receiving Level */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Charm Level (Receiving):</span>
                <span className="text-pink-400 font-mono">Lv.{currentUser.receivingLevel}</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {currentUser.receivingDiamonds.toLocaleString()} 💎
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, currentUser.receivingLevel * 10)}%` }}
              />
            </div>
            <div className="text-[9px] text-neutral-500 mt-1 flex justify-between">
              <span>Star Level {currentUser.receivingLevel}</span>
              <span>Increases as viewers gift you</span>
            </div>
          </div>
        </div>

        {/* Firebase Live Cloud Status Banner */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-amber-300">Google Firebase Live Database</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
            SYNCED
          </span>
        </div>

        {/* Account & Safety Actions */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden divide-y divide-neutral-800/80 text-xs text-white">
          {/* Switch Google Account / Login */}
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-850 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                G
              </div>
              <div className="text-left">
                <span className="font-semibold block text-white">Google Account Sign-In (Firebase Auth)</span>
                <span className="text-[10px] text-neutral-400 truncate max-w-[200px] block">
                  {currentUser.email || 'Click to sign in with Google'}
                </span>
              </div>
            </div>
            <LogIn className="w-4 h-4 text-blue-400" />
          </button>

          {/* Blocked Users */}
          <button
            type="button"
            onClick={() => setShowBlockedModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-850 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-neutral-400" />
              <span>Blocked Users List ({blockedUserIds.length})</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          {/* Dedicated Web Admin Portal */}
          <button
            type="button"
            onClick={() => setViewMode('admin_portal')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-850 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-indigo-400 font-semibold">
              <Shield className="w-4 h-4" />
              <span>Dedicated Web Admin Portal (আলাদা অ্যাডমিন প্যানেল)</span>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              Web Portal
            </span>
          </button>

          {/* Reset / Logout */}
          <button
            type="button"
            onClick={logout}
            className="w-full p-3.5 flex items-center justify-between hover:bg-red-950/20 text-red-400 transition-colors"
          >
            <div className="flex items-center gap-2.5 font-semibold">
              <LogOut className="w-4 h-4" />
              <span>Reset Profile & Re-test Onboarding</span>
            </div>
          </button>
        </div>
      </div>

      {/* Blocked Users Modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl">
            <h3 className="text-sm font-bold mb-3 flex items-center justify-between">
              <span>Blocked Users ({blockedUserIds.length})</span>
              <button
                type="button"
                onClick={() => setShowBlockedModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </h3>
            {blockedUserIds.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No blocked users.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blockedUserIds.map(uid => (
                  <div key={uid} className="flex items-center justify-between p-2 bg-neutral-800 rounded-xl text-xs">
                    <span className="font-mono text-neutral-300">{uid}</span>
                    <button
                      type="button"
                      onClick={() => toggleBlockUser(uid)}
                      className="text-pink-400 text-xs font-bold"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cashout Simulation Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl">
            <h3 className="text-sm font-bold mb-2 flex items-center justify-between">
              <span>Diamonds Withdrawal 💎</span>
              <button
                type="button"
                onClick={() => setShowCashoutModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              You have {currentUser.diamonds.toLocaleString()} Diamonds (~${(currentUser.diamonds / 100).toFixed(2)} USD).
            </p>
            <div className="p-3 bg-neutral-800/80 rounded-xl text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between">
                <span>Minimum cashout:</span>
                <span className="font-bold">1,000 💎 ($10.00)</span>
              </div>
              <div className="flex justify-between">
                <span>Payout methods:</span>
                <span className="font-bold">bKash, Nagad, Bank, Binance</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Withdrawal request simulated! In production, funds transfer via bKash/Bank API.');
                setShowCashoutModal(false);
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 font-bold text-xs"
            >
              Simulate Payout Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
