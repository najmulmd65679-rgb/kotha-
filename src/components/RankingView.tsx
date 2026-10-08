import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Crown, Sparkles, Flame } from 'lucide-react';

export const RankingView: React.FC = () => {
  const { liveRooms, currentUser } = useApp();
  const [tab, setTab] = useState<'charm' | 'wealth'>('charm');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all'>('daily');

  // Simulated charm ranking (Star streamers)
  const charmList = [
    ...liveRooms.map(r => ({
      id: r.streamerId,
      name: r.streamerName,
      avatar: r.streamerAvatar,
      level: r.streamerLevel,
      points: r.diamondsEarned,
      tag: 'Diamonds 💎',
    })),
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      level: currentUser.receivingLevel,
      points: currentUser.diamonds + 1200,
      tag: 'Diamonds 💎',
    },
  ].sort((a, b) => b.points - a.points);

  // Simulated wealth ranking (Top Gifters / Rich users)
  const wealthList = [
    {
      id: 'g-1',
      name: 'Prince Fahad 👑',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      level: 45,
      points: 250000,
      tag: 'Coins Spent 🪙',
    },
    {
      id: 'g-2',
      name: 'Sultan Sheikh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      level: 38,
      points: 180000,
      tag: 'Coins Spent 🪙',
    },
    {
      id: currentUser.id,
      name: `${currentUser.name} (You)`,
      avatar: currentUser.avatar,
      level: currentUser.spendingLevel,
      points: currentUser.spendingXp || 8200,
      tag: 'Coins Spent 🪙',
    },
    {
      id: 'g-3',
      name: 'Moonlight VIP',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      level: 22,
      points: 45000,
      tag: 'Coins Spent 🪙',
    },
    {
      id: 'g-4',
      name: 'Rana Boss BD',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      level: 19,
      points: 31000,
      tag: 'Coins Spent 🪙',
    },
  ].sort((a, b) => b.points - a.points);

  const activeList = tab === 'charm' ? charmList : wealthList;
  const top1 = activeList[0];
  const top2 = activeList[1];
  const top3 = activeList[2];
  const rest = activeList.slice(3);

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-b from-purple-950 via-neutral-900 to-neutral-950 border-b border-neutral-900 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
          <Trophy className="w-4 h-4" />
          <span>Hall of Fame & Leaderboards</span>
        </div>

        {/* Tab switcher: Charm (Streamers) vs Wealth (Gifters) */}
        <div className="flex p-1 bg-neutral-900/90 rounded-2xl border border-neutral-800 max-w-xs mx-auto mt-2">
          <button
            type="button"
            onClick={() => setTab('charm')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'charm'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Star Streamers 💖
          </button>
          <button
            type="button"
            onClick={() => setTab('wealth')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'wealth'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-neutral-950 font-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Top Gifters 👑
          </button>
        </div>

        {/* Period Pills */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {(['daily', 'weekly', 'all'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                period === p ? 'bg-white/20 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-end justify-center gap-2">
          {/* #2 Rank */}
          {top2 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥈</span>
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-md"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-400 text-neutral-950 text-[9px] font-extrabold px-1.5 rounded-full">
                  #2
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[85px] mt-1 text-center">
                {top2.name}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-semibold">
                {top2.points.toLocaleString()}
              </span>
              <div className="w-full h-16 bg-gradient-to-t from-neutral-800 to-slate-800/60 rounded-t-xl mt-2 flex items-center justify-center text-xs font-black text-slate-300">
                2nd
              </div>
            </div>
          )}

          {/* #1 Rank (Center, Highest) */}
          {top1 && (
            <div className="flex-1 flex flex-col items-center -mt-3">
              <div className="relative mb-1">
                <Crown className="w-6 h-6 text-yellow-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-18 h-18 rounded-full object-cover border-2 border-yellow-400 shadow-xl ring-4 ring-yellow-400/30"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 text-[10px] font-black px-2 rounded-full shadow">
                  #1
                </span>
              </div>
              <span className="text-xs font-extrabold text-white truncate max-w-[95px] mt-1 text-center">
                {top1.name}
              </span>
              <span className="text-[11px] text-yellow-300 font-mono font-black">
                {top1.points.toLocaleString()}
              </span>
              <div className="w-full h-22 bg-gradient-to-t from-neutral-800 to-amber-700/60 rounded-t-xl mt-2 flex items-center justify-center text-sm font-black text-yellow-300">
                1st 👑
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {top3 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥉</span>
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-600 shadow-md"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-600 text-neutral-950 text-[9px] font-extrabold px-1.5 rounded-full">
                  #3
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[85px] mt-1 text-center">
                {top3.name}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-semibold">
                {top3.points.toLocaleString()}
              </span>
              <div className="w-full h-12 bg-gradient-to-t from-neutral-800 to-amber-900/60 rounded-t-xl mt-2 flex items-center justify-center text-xs font-black text-amber-500">
                3rd
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rest of the list (Rank 4+) */}
      <div className="p-3 space-y-2">
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
          Leaderboard (4 - 10)
        </h4>
        {rest.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-neutral-500 text-xs">
                {idx + 4}
              </span>
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-[8px] font-bold text-white">
                    Lv.{item.level}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">Kotha Star</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold font-mono text-amber-300">
                {item.points.toLocaleString()}
              </div>
              <div className="text-[9px] text-neutral-500">{item.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
