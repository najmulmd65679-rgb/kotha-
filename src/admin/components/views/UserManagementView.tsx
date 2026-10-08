import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserProfile } from '../../../types';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck, Eye, Coins, Gem, Award } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'users'), snapshot => {
        const list: UserProfile[] = [];
        snapshot.forEach(docSnap => {
          list.push(docSnap.data() as UserProfile);
        });
        if (list.length > 0) setUsers(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.publicId && u.publicId.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const handleToggleBan = async (user: UserProfile) => {
    if (!hasPermission('users:ban')) {
      alert('Permission Denied: You do not possess users:ban privilege.');
      return;
    }

    const nextStatus = !user.isBanned;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        isBanned: nextStatus,
        bannedAt: nextStatus ? new Date().toISOString() : null,
      });

      await recordAuditLog(
        nextStatus ? 'BAN_USER' : 'UNBAN_USER',
        'user',
        user.id,
        `${currentAdmin?.name} ${nextStatus ? 'banned' : 'unbanned'} user ${user.name} (${user.publicId})`,
        { isBanned: user.isBanned },
        { isBanned: nextStatus }
      );

      // update local
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, isBanned: nextStatus } : u)));
    } catch (err: any) {
      alert('Error updating user ban state: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Search by 7-Digit Public ID, manage account statuses, and review level records
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Public ID, Name, Email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">User / Avatar</th>
                <th className="py-3 px-4">Public ID</th>
                <th className="py-3 px-4">Age / Gender / Loc</th>
                <th className="py-3 px-4">Wallet Lv.</th>
                <th className="py-3 px-4">Charm Lv.</th>
                <th className="py-3 px-4">Coins / Diamonds</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      {user.publicId || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-300">
                      {user.age} yrs • {user.gender} • {user.countryCode || 'BD'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                        Lv.{user.spendingLevel || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold text-[10px] border border-pink-500/30">
                        Lv.{user.receivingLevel || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-amber-300 font-mono">
                        {(user.coins || 0).toLocaleString()} 🪙
                      </div>
                      <div className="text-[10px] text-pink-400 font-mono">
                        {(user.diamonds || 0).toLocaleString()} 💎
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.isBanned
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {user.isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleBan(user)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          user.isBanned
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {user.isBanned ? 'Unban' : 'Ban User'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
