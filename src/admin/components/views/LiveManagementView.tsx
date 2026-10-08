import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LiveRoom } from '../../../types';
import { Radio, Users, Gem, StopCircle, UserX, AlertTriangle } from 'lucide-react';

export const LiveManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [rooms, setRooms] = useState<LiveRoom[]>([]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'rooms'), snap => {
        const list: LiveRoom[] = [];
        snap.forEach(d => list.push(d.data() as LiveRoom));
        setRooms(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleTerminateRoom = async (room: LiveRoom) => {
    if (!hasPermission('live:terminate')) {
      alert('Permission Denied.');
      return;
    }

    if (!confirm(`Force-close broadcast room "${room.title}" hosted by ${room.streamerName}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'rooms', room.id));
      await recordAuditLog(
        'TERMINATE_LIVE_ROOM',
        'room',
        room.id,
        `${currentAdmin?.name} terminated broadcast room "${room.title}" of host ${room.streamerName}`
      );
      setRooms(prev => prev.filter(r => r.id !== room.id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Live Broadcast Monitoring</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time oversight of active streams, viewer counts, and emergency stream termination
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl border border-slate-800">
            No active live broadcasts at this moment.
          </div>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={room.streamerAvatar}
                    alt={room.streamerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-white text-xs">{room.streamerName}</div>
                    <div className="text-[10px] text-slate-400">Host ID: {room.streamerId}</div>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="my-3 text-xs text-slate-200 font-semibold line-clamp-1">
                "{room.title}"
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-t border-slate-800 text-slate-400">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  {room.viewerCount} Viewers
                </span>
                <span className="flex items-center gap-1 font-mono text-pink-400">
                  <Gem className="w-3.5 h-3.5" />
                  {room.diamondsEarned.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleTerminateRoom(room)}
                className="mt-2 w-full py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Force Stop Broadcast</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
