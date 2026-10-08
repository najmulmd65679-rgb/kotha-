import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { WithdrawalRecord } from '../../types';
import { ArrowDownToLine, Check, X, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export const WithdrawalManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([
    {
      id: 'w-101',
      userId: 'u-101',
      userPublicId: '8491024',
      userName: 'Ayesha Khan',
      diamondsAmount: 25000,
      usdEquivalent: 250.0,
      paymentMethod: 'bKash',
      accountDetails: '+8801711223344 (Personal)',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-102',
      userId: 'u-103',
      userPublicId: '7842915',
      userName: 'Fatima Noor',
      diamondsAmount: 50000,
      usdEquivalent: 500.0,
      paymentMethod: 'Binance',
      accountDetails: 'USDT TRC20: TTx8912389148912348',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'withdrawals'), snap => {
        const list: WithdrawalRecord[] = [];
        snap.forEach(d => list.push(d.data() as WithdrawalRecord));
        if (list.length > 0) setWithdrawals(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleProcess = async (item: WithdrawalRecord, nextStatus: 'approved' | 'rejected') => {
    if (!hasPermission('withdrawals:process')) {
      alert('Permission Denied: Finance privileges required.');
      return;
    }

    const ref = prompt(
      nextStatus === 'approved'
        ? 'Enter Transaction Reference ID (e.g. bKash TrxID / Bank Ref):'
        : 'Enter Rejection Reason:'
    );
    if (ref === null) return;

    try {
      const updated: Partial<WithdrawalRecord> = {
        status: nextStatus,
        processedByAdminId: currentAdmin?.id,
        processedByAdminEmail: currentAdmin?.email,
        processedAt: new Date().toISOString(),
        transactionRef: nextStatus === 'approved' ? ref : undefined,
        rejectionReason: nextStatus === 'rejected' ? ref : undefined,
      };

      await setDoc(doc(db, 'withdrawals', item.id), { ...item, ...updated }, { merge: true });

      await recordAuditLog(
        nextStatus === 'approved' ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL',
        'withdrawal',
        item.id,
        `${currentAdmin?.name} ${nextStatus} withdrawal of $${item.usdEquivalent} (${item.diamondsAmount} diamonds) for user ${item.userName}. Note: ${ref}`,
        { status: item.status },
        { status: nextStatus, ref }
      );

      setWithdrawals(prev =>
        prev.map(w => (w.id === item.id ? ({ ...w, ...updated } as WithdrawalRecord) : w))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = withdrawals.filter(w => {
    if (activeFilter === 'all') return true;
    return w.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Withdrawal & Payout Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review host diamond cashout requests, verify payment credentials, and approve payouts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Host / ID</th>
              <th className="py-3 px-4">Diamonds 💎</th>
              <th className="py-3 px-4">USD Equivalent</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Account Details</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No withdrawal requests in this category.
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{item.userName}</div>
                    <div className="text-[10px] text-amber-300 font-mono">ID: {item.userPublicId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-pink-400">
                    {item.diamondsAmount.toLocaleString()} 💎
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400 text-sm">
                    ${item.usdEquivalent.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold text-[10px]">
                      {item.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300 max-w-[180px] truncate">
                    {item.accountDetails}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProcess(item, 'approved')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProcess(item, 'rejected')}
                          className="px-2.5 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.transactionRef || item.rejectionReason || 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
