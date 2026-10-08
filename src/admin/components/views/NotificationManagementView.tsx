import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AnnouncementItem } from '../../types';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

export const NotificationManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'streamers' | 'vip'>('all');
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'announcements'), snap => {
        const list: AnnouncementItem[] = [];
        snap.forEach(d => list.push(d.data() as AnnouncementItem));
        setAnnouncements(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('notifications:send')) {
      alert('Permission Denied.');
      return;
    }

    const id = 'ann-' + Date.now();
    const item: AnnouncementItem = {
      id,
      title: title.trim(),
      message: message.trim(),
      targetAudience: audience,
      createdByAdminEmail: currentAdmin?.email || 'admin@poppolive.com',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'announcements', id), item);
      await recordAuditLog(
        'BROADCAST_ANNOUNCEMENT',
        'announcement',
        id,
        `Broadcast announcement: "${item.title}" to ${audience} users`
      );
      setSentSuccess(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Broadcast Notifications & Announcements</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Push system announcements, maintenance alerts, and festival tournament news to users
        </p>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleBroadcast} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-pink-400" />
          <span>Compose System Push Broadcast</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[10px] text-slate-400 block mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Server Maintenance Notice / Weekend Star Tournament"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Target Audience</label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="all">All Users</option>
              <option value="streamers">Active Streamers Only</option>
              <option value="vip">VIP Level 10+ Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Message Body</label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type announcement details here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {sentSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Broadcast dispatched successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Broadcast</span>
          </button>
        </div>
      </form>

      {/* History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Notification History</h3>
        <div className="space-y-2">
          {announcements.map(a => (
            <div key={a.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{a.title}</span>
                <span className="text-[10px] text-slate-500">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 text-[11px]">{a.message}</p>
              <div className="text-[10px] text-pink-400 font-mono">
                Audience: {a.targetAudience} • By: {a.createdByAdminEmail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
