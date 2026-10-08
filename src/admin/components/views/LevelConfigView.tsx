import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { WalletLevelConfig, CharmLevelConfig } from '../../types';
import { DEFAULT_WALLET_LEVELS, DEFAULT_CHARM_LEVELS } from '../../defaultConfigs';
import { Award, Sparkles, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const LevelConfigView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [tab, setTab] = useState<'wallet' | 'charm'>('wallet');
  const [walletLevels, setWalletLevels] = useState<WalletLevelConfig[]>(DEFAULT_WALLET_LEVELS);
  const [charmLevels, setCharmLevels] = useState<CharmLevelConfig[]>(DEFAULT_CHARM_LEVELS);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load from Firestore
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const walletSnap = await getDoc(doc(db, 'system_configs', 'wallet_levels'));
        if (walletSnap.exists() && walletSnap.data().data) {
          setWalletLevels(walletSnap.data().data);
        }

        const charmSnap = await getDoc(doc(db, 'system_configs', 'charm_levels'));
        if (charmSnap.exists() && charmSnap.data().data) {
          setCharmLevels(charmSnap.data().data);
        }
      } catch (e) {
        console.warn('Configs load notice:', e);
      }
    };
    loadConfigs();
  }, []);

  const handleSave = async () => {
    if (!hasPermission('levels:configure')) {
      alert('Permission Denied: You do not possess levels:configure privilege.');
      return;
    }

    try {
      if (tab === 'wallet') {
        await setDoc(doc(db, 'system_configs', 'wallet_levels'), {
          id: 'wallet_levels',
          configType: 'wallet_levels',
          data: walletLevels,
          updatedByAdminId: currentAdmin?.id,
          updatedAt: new Date().toISOString(),
        });
        await recordAuditLog(
          'UPDATE_WALLET_LEVEL_CONFIG',
          'level_config',
          'wallet_levels',
          `Updated wallet spending level thresholds (${walletLevels.length} levels configured)`
        );
      } else {
        await setDoc(doc(db, 'system_configs', 'charm_levels'), {
          id: 'charm_levels',
          configType: 'charm_levels',
          data: charmLevels,
          updatedByAdminId: currentAdmin?.id,
          updatedAt: new Date().toISOString(),
        });
        await recordAuditLog(
          'UPDATE_CHARM_LEVEL_CONFIG',
          'level_config',
          'charm_levels',
          `Updated charm receiving level thresholds (${charmLevels.length} levels configured)`
        );
      }
      setSaveStatus('Configuration successfully saved to Firebase Firestore!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleUpdateWallet = (index: number, field: keyof WalletLevelConfig, value: any) => {
    const next = [...walletLevels];
    next[index] = { ...next[index], [field]: value };
    setWalletLevels(next);
  };

  const handleUpdateCharm = (index: number, field: keyof CharmLevelConfig, value: any) => {
    const next = [...charmLevels];
    next[index] = { ...next[index], [field]: value };
    setCharmLevels(next);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Level System Configuration</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure coin spending thresholds for Wallet Levels & diamond thresholds for Charm Levels
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save to Firebase</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setTab('wallet')}
          className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
            tab === 'wallet'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Wallet Level (Spending / Wealth)</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('charm')}
          className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
            tab === 'charm'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Charm Level (Receiving / Star)</span>
        </button>
      </div>

      {/* Configuration Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="space-y-3">
          {tab === 'wallet'
            ? walletLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lvl.icon}</span>
                    <span className="font-mono font-bold text-amber-300">Level {lvl.level}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                        Title / Badge Name
                      </label>
                      <input
                        type="text"
                        value={lvl.name}
                        onChange={e => handleUpdateWallet(idx, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                        Required Coins Spent 🪙
                      </label>
                      <input
                        type="number"
                        value={lvl.requiredCoinsSpent}
                        onChange={e =>
                          handleUpdateWallet(idx, 'requiredCoinsSpent', Number(e.target.value))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))
            : charmLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lvl.icon}</span>
                    <span className="font-mono font-bold text-pink-300">Charm {lvl.level}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                        Title / Star Name
                      </label>
                      <input
                        type="text"
                        value={lvl.name}
                        onChange={e => handleUpdateCharm(idx, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                        Required Diamonds Earned 💎
                      </label>
                      <input
                        type="number"
                        value={lvl.requiredDiamondsEarned}
                        onChange={e =>
                          handleUpdateCharm(idx, 'requiredDiamondsEarned', Number(e.target.value))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-pink-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
