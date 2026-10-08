import React, { useState } from 'react';
import { Trophy, Award, Calendar, Sparkles, Save } from 'lucide-react';

export const RankingsConfigView: React.FC = () => {
  const [resetPeriod, setResetPeriod] = useState('00:00 UTC Daily');
  const [topGiftMultiplier, setTopGiftMultiplier] = useState(1.0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Leaderboards & Ranking Configuration</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure daily/weekly star streamer resets, podium rewards, and leaderboard weighting
        </p>
      </div>

      <form onSubmit={handleSave} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Daily Reset Schedule</label>
            <input
              type="text"
              value={resetPeriod}
              onChange={e => setResetPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Star Streamer Point Weight (Diamonds)</label>
            <input
              type="number"
              step="0.1"
              value={topGiftMultiplier}
              onChange={e => setTopGiftMultiplier(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
            />
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
          Rankings are calculated dynamically from real-time Firestore room gifts and user diamond records.
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
        >
          {isSaved ? 'Settings Saved!' : 'Save Ranking Settings'}
        </button>
      </form>
    </div>
  );
};
