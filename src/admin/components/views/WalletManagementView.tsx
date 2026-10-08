import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserProfile } from '../../../types';
import { Wallet, Coins, Gem, ArrowUpRight, ArrowDownLeft, ShieldAlert } from 'lucide-react';

export const WalletManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(1000);
  const [adjustReason, setAdjustReason] = useState<string>('');

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'users'), snap => {
        const list: UserProfile[] = [];
        snap.forEach(d => list.push(d.data() as UserProfile));
        setUsers(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!hasPermission('wallet:adjust')) {
      alert('Permission Denied: Finance or Super Admin privilege required.');
      return;
    }
    if (!adjustReason.trim()) {
      alert('Audit Requirement: A justification reason is mandatory for any manual wallet balance adjustment.');
      return;
    }

    const previousCoins = selectedUser.coins || 0;
    const nextCoins = Math.max(0, previousCoins + adjustAmount);

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), { coins: nextCoins });
      await recordAuditLog(
        'ADJUST_WALLET_BALANCE',
        'user',
        selectedUser.id,
        `${currentAdmin?.name} adjusted coins for ${selectedUser.name} (${selectedUser.publicId}) by ${adjustAmount}. Reason: ${adjustReason}`,
        { coins: previousCoins },
        { coins: nextCoins, reason: adjustReason }
      );

      alert(`Balance updated for ${selectedUser.name}. Previous: ${previousCoins}, New: ${nextCoins}. Full audit log registered.`);
      setSelectedUser(null);
      setAdjustReason('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Wallet & Virtual Currency Oversight</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Monitor user coin and diamond reserves, review transaction histories, and manage adjustments with mandatory audit trail
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Total Coins Circulated</div>
          <div className="text-xl font-black text-amber-300 font-mono mt-1">
            {users.reduce((acc, u) => acc + (u.coins || 0), 0).toLocaleString()} 🪙
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Total Host Diamonds Held</div>
          <div className="text-xl font-black text-pink-400 font-mono mt-1">
            {users.reduce((acc, u) => acc + (u.diamonds || 0), 0).toLocaleString()} 💎
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Registered Accounts</div>
          <div className="text-xl font-black text-white font-mono mt-1">{users.length}</div>
        </div>
      </div>

      {/* Adjustment Form Modal */}
      {selectedUser && (
        <form
          onSubmit={handleAdjustBalance}
          className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3"
        >
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Audit-Logged Balance Adjustment for {selectedUser.name} (ID: {selectedUser.publicId})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Adjustment Amount (use negative to deduct, e.g. -500)
              </label>
              <input
                type="number"
                value={adjustAmount}
                onChange={e => setAdjustAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Mandatory Reason (Will be logged in immutable audit records)
              </label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                placeholder="e.g. Compensation for stream disconnection / Promo reward"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Confirm & Record in Audit Log
            </button>
          </div>
        </form>
      )}

      {/* Users Wallet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Public ID</th>
              <th className="py-3 px-4">Coin Balance</th>
              <th className="py-3 px-4">Diamond Balance</th>
              <th className="py-3 px-4">Lifetime Coins Spent</th>
              <th className="py-3 px-4 text-right">Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                <td className="py-3 px-4 font-sans font-bold text-white">{u.name}</td>
                <td className="py-3 px-4 text-amber-300">{u.publicId}</td>
                <td className="py-3 px-4 text-amber-300 font-bold">{(u.coins || 0).toLocaleString()} 🪙</td>
                <td className="py-3 px-4 text-pink-400 font-bold">{(u.diamonds || 0).toLocaleString()} 💎</td>
                <td className="py-3 px-4 text-slate-400">{(u.spendingXp || 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(u)}
                    className="font-sans px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
