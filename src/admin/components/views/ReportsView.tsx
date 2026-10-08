import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserReport } from '../../../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Eye, MessageSquare } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [reports, setReports] = useState<UserReport[]>([]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'reports'), snap => {
        const list: UserReport[] = [];
        snap.forEach(d => list.push(d.data() as UserReport));
        setReports(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleResolve = async (report: UserReport, action: 'resolved' | 'dismissed') => {
    if (!hasPermission('reports:resolve')) {
      alert('Permission Denied.');
      return;
    }

    try {
      await updateDoc(doc(db, 'reports', report.id), {
        status: action,
        resolvedByAdminId: currentAdmin?.id,
        resolutionAction: action,
        resolvedAt: new Date().toISOString(),
      });

      await recordAuditLog(
        'RESOLVE_REPORT',
        'user',
        report.reportedUserId,
        `${currentAdmin?.name} marked report ${report.id} on ${report.reportedUserName} as ${action}`
      );

      setReports(prev => prev.map(r => (r.id === report.id ? { ...r, status: action } : r)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Trust & Safety Reports</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review community reports regarding violations, harassment, inappropriate content, or fraud
        </p>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl border border-slate-800">
            No safety reports submitted. Community is secure!
          </div>
        ) : (
          reports.map(rep => (
            <div
              key={rep.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    {rep.reason}
                  </span>
                  <span className="text-[10px] text-slate-500">• {rep.timestamp}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                      rep.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>

                <div className="text-slate-200">
                  Reported Host/User:{' '}
                  <span className="font-bold text-white">{rep.reportedUserName}</span> (ID:{' '}
                  <span className="font-mono text-amber-300">{rep.reportedUserId}</span>)
                </div>

                {rep.details && (
                  <p className="text-slate-400 text-[11px] italic bg-slate-950 p-2 rounded-lg border border-slate-850">
                    "{rep.details}"
                  </p>
                )}
              </div>

              {rep.status !== 'resolved' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleResolve(rep, 'dismissed')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(rep, 'resolved')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    Resolve & Close
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
