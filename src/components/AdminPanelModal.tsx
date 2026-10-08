import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Users, Radio, Coins, AlertTriangle, Send, CheckCircle2, X } from 'lucide-react';

export const AdminPanelModal: React.FC = () => {
  const {
    showAdminModal,
    setShowAdminModal,
    currentUser,
    liveRooms,
    reports,
    adminAddCoins,
    adminToggleBan,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'users' | 'reports'>('stats');
  const [coinInput, setCoinInput] = useState<number>(5000);
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  if (!showAdminModal) return null;

  const totalDiamonds = liveRooms.reduce((acc, r) => acc + r.diamondsEarned, 0) + currentUser.diamonds;
  const totalCoinsCirculated = currentUser.coins + 150000;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastText('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl overflow-y-auto max-h-[92vh] relative">
        <button
          type="button"
          onClick={() => setShowAdminModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Admin Management Console (ধাপ ২০)</span>
              <span className="text-[10px] bg-red-600 px-1.5 py-0.2 rounded font-mono font-bold">ROOT</span>
            </h3>
            <p className="text-xs text-neutral-400">Poppo Live platform controls & moderation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-800/80 p-1 rounded-2xl gap-1 my-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveAdminTab('stats')}
            className={`flex-1 py-1.5 rounded-xl transition-colors ${
              activeAdminTab === 'stats' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('users')}
            className={`flex-1 py-1.5 rounded-xl transition-colors ${
              activeAdminTab === 'users' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            User Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('reports')}
            className={`flex-1 py-1.5 rounded-xl transition-colors ${
              activeAdminTab === 'reports' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Reports ({reports.length})
          </button>
        </div>

        {/* TAB 1: STATS */}
        {activeAdminTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Radio className="w-3.5 h-3.5 text-red-500" />
                  <span>Active Streams</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {liveRooms.length} Rooms
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">100% server uptime</span>
              </div>

              <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Total Viewers</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {liveRooms.reduce((acc, r) => acc + r.viewerCount, 0).toLocaleString()}
                </div>
                <span className="text-[10px] text-blue-300 font-medium">Across all channels</span>
              </div>

              <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Coins Economy</span>
                </div>
                <div className="text-lg font-black text-amber-300 font-mono">
                  {totalCoinsCirculated.toLocaleString()} 🪙
                </div>
                <span className="text-[10px] text-amber-400/80">In circulation</span>
              </div>

              <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Diamonds Gifted</span>
                </div>
                <div className="text-lg font-black text-pink-300 font-mono">
                  {totalDiamonds.toLocaleString()} 💎
                </div>
                <span className="text-[10px] text-pink-400/80">Host earnings</span>
              </div>
            </div>

            {/* Broadcast Form */}
            <div className="p-3.5 bg-neutral-800/50 rounded-2xl border border-neutral-700/60">
              <h4 className="text-xs font-bold text-white mb-1.5">Broadcast System Alert (সার্ভার বার্তা)</h4>
              <form onSubmit={handleBroadcast} className="flex gap-2">
                <input
                  type="text"
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  placeholder="e.g. Server maintenance tonight at 2 AM..."
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
              {broadcastSent && (
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Broadcast pushed to all live rooms.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: USER CONTROLS */}
        {activeAdminTab === 'users' && (
          <div className="space-y-3">
            <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-pink-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{currentUser.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      ID: {currentUser.publicId} • {currentUser.email}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentUser.isBanned
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {currentUser.isBanned ? 'BANNED' : 'ACTIVE'}
                </span>
              </div>

              {/* Modify Coins */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-700/60">
                <input
                  type="number"
                  value={coinInput}
                  onChange={e => setCoinInput(Number(e.target.value))}
                  className="w-28 bg-neutral-900 border border-neutral-700 rounded-xl px-2 py-1 text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => adminAddCoins(currentUser.id, coinInput)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  Grant Coins 🪙
                </button>
                <button
                  type="button"
                  onClick={() => adminToggleBan(currentUser.id)}
                  className={`ml-auto px-3 py-1 text-xs font-bold rounded-xl ${
                    currentUser.isBanned
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600/80 hover:bg-red-600 text-white'
                  }`}
                >
                  {currentUser.isBanned ? 'Unban User' : 'Ban User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeAdminTab === 'reports' && (
          <div className="space-y-2.5">
            {reports.length === 0 ? (
              <div className="p-6 text-center text-neutral-400 text-xs">
                No active violations reported. Platform is clean!
              </div>
            ) : (
              reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-3 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-bold text-red-400">{rep.reason}</span>
                    <span className="text-[10px] text-neutral-500">{rep.timestamp}</span>
                  </div>
                  <p className="text-white text-[11px]">
                    Reported user: <span className="font-semibold text-pink-300">{rep.reportedUserName}</span> (ID: {rep.reportedUserId})
                  </p>
                  {rep.details && (
                    <p className="text-neutral-400 text-[10px] italic">"{rep.details}"</p>
                  )}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`Warning letter dispatched to ${rep.reportedUserName}`)}
                      className="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-[10px] font-bold"
                    >
                      Dismiss / Warn
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        adminToggleBan(rep.reportedUserId);
                        alert(`User ${rep.reportedUserName} has been suspended.`);
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-[10px] font-bold text-white"
                    >
                      Ban Streamer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
