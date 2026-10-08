import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { RechargePackage } from '../../types';
import { DEFAULT_RECHARGE_PACKAGES } from '../../defaultConfigs';
import { CreditCard, Plus, Save, Trash2, CheckCircle2 } from 'lucide-react';

export const RechargeManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [packages, setPackages] = useState<RechargePackage[]>(DEFAULT_RECHARGE_PACKAGES);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const snap = await getDoc(doc(db, 'system_configs', 'recharge_packages'));
        if (snap.exists() && snap.data().data) {
          setPackages(snap.data().data);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    loadPackages();
  }, []);

  const handleSave = async () => {
    if (!hasPermission('recharge:manage')) {
      alert('Permission Denied: Finance privileges required.');
      return;
    }
    try {
      await setDoc(doc(db, 'system_configs', 'recharge_packages'), {
        id: 'recharge_packages',
        configType: 'recharge_packages',
        data: packages,
        updatedByAdminId: currentAdmin?.id,
        updatedAt: new Date().toISOString(),
      });
      await recordAuditLog(
        'UPDATE_RECHARGE_PACKAGES',
        'recharge_package',
        'recharge_packages',
        `Updated coin store packages (${packages.length} packages active)`
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = (idx: number, field: keyof RechargePackage, val: any) => {
    const next = [...packages];
    next[idx] = { ...next[idx], [field]: val, updatedAt: new Date().toISOString() };
    setPackages(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Recharge & Coin Packages</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure virtual coin store tiers, bonus coins, and USD prices
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Packages synced to Firestore!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{pkg.name}</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-bold text-[10px]">
                Tier {idx + 1}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Coins</label>
                <input
                  type="number"
                  value={pkg.coins}
                  onChange={e => handleUpdate(idx, 'coins', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-amber-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Bonus Coins</label>
                <input
                  type="number"
                  value={pkg.bonusCoins}
                  onChange={e => handleUpdate(idx, 'bonusCoins', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-amber-400/80 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pkg.priceUsd}
                  onChange={e => handleUpdate(idx, 'priceUsd', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
