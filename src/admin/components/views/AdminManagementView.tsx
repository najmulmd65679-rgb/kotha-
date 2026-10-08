import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminUser, AdminRole } from '../../types';
import { ROLE_PERMISSIONS } from '../../defaultConfigs';
import { ShieldCheck, UserPlus, KeyRound, CheckCircle, ShieldAlert } from 'lucide-react';

export const AdminManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('moderator');

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'admins'), snap => {
        const list: AdminUser[] = [];
        snap.forEach(d => list.push(d.data() as AdminUser));
        setAdmins(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('admins:manage')) {
      alert('Permission Denied: Only Super Admin can appoint staff.');
      return;
    }

    const email = newAdminEmail.trim().toLowerCase();
    const adminId = 'admin-' + Date.now();
    const item: AdminUser = {
      id: adminId,
      email,
      name: newAdminName.trim() || 'Staff Officer',
      role: newAdminRole,
      permissions: ROLE_PERMISSIONS[newAdminRole],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'admins', adminId), item);
      await recordAuditLog(
        'CREATE_ADMIN_OFFICER',
        'admin',
        adminId,
        `Appointed ${email} as ${newAdminRole}`
      );
      setIsAdding(false);
      setNewAdminEmail('');
      setNewAdminName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    if (!hasPermission('admins:manage')) return;
    if (admin.role === 'super_admin') {
      alert('Cannot deactivate primary Super Admin.');
      return;
    }

    const next = !admin.isActive;
    try {
      await setDoc(doc(db, 'admins', admin.id), { isActive: next }, { merge: true });
      await recordAuditLog(
        'TOGGLE_ADMIN_STATUS',
        'admin',
        admin.id,
        `${next ? 'Reactivated' : 'Deactivated'} admin account for ${admin.email}`
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Staff RBAC & Admin Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Appoint administrators, finance controllers, and content moderators with granular permissions
          </p>
        </div>

        {hasPermission('admins:manage') && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Appoint Admin Officer</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddAdmin} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Appoint Administrative Officer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Email (Google Account)</label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={e => setNewAdminEmail(e.target.value)}
                placeholder="officer@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newAdminName}
                onChange={e => setNewAdminName(e.target.value)}
                placeholder="Officer Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Assigned Role</label>
              <select
                value={newAdminRole}
                onChange={e => setNewAdminRole(e.target.value as AdminRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="moderator">Moderator (Live & Reports)</option>
                <option value="finance_admin">Finance Admin (Withdrawals & Packages)</option>
                <option value="admin">Operations Admin (Full Management)</option>
                <option value="support_admin">Support Admin (User Inquiries)</option>
                <option value="super_admin">Super Admin (Root Privileges)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
            >
              Grant Role
            </button>
          </div>
        </form>
      )}

      {/* Admins Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Officer Name</th>
              <th className="py-3 px-4">Authorized Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Permissions Count</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {admins.map(adm => (
              <tr key={adm.id} className="hover:bg-slate-850/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{adm.name}</td>
                <td className="py-3 px-4 font-mono text-slate-300">{adm.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase border border-indigo-500/30">
                    {adm.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      adm.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {adm.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {adm.role === 'super_admin' ? 'All (Full Root)' : `${adm.permissions?.length || 0} Permissions`}
                </td>
                <td className="py-3 px-4 text-right">
                  {adm.role !== 'super_admin' && (
                    <button
                      type="button"
                      onClick={() => handleToggleActive(adm)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                    >
                      {adm.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
