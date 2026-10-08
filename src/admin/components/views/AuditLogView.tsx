import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { AuditLogItem } from '../../types';
import { FileText, Shield, User, Clock, ArrowRight } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(100));
      const unsub = onSnapshot(q, snap => {
        const list: AuditLogItem[] = [];
        snap.forEach(d => list.push(d.data() as AuditLogItem));
        setLogs(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Audit listener notice:', e);
    }
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('BAN') || action.includes('TERMINATE') || action.includes('DELETE')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
    if (action.includes('APPROVE') || action.includes('ADD')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Immutable Administrative Audit Log</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tamper-evident record of all staff operations, status changes, financial approvals, and configurations
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Admin Email</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity / ID</th>
              <th className="py-3 px-4">Details / Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-sans">
                  No audit log records recorded yet. Every action in this panel will appear here.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">{log.adminEmail}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-amber-300">
                    {log.targetEntity}: {log.targetId}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {log.details}
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
