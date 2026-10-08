import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Gift } from '../../../types';
import { INITIAL_GIFTS } from '../../../mockData';
import { Gift as GiftIcon, Plus, Trash2, Edit3, Save, CheckCircle2 } from 'lucide-react';

export const GiftManagementView: React.FC = () => {
  const { currentAdmin, recordAuditLog, hasPermission } = useAdminAuth();
  const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newGift, setNewGift] = useState<Partial<Gift>>({
    name: '',
    icon: '💎',
    cost: 50,
    animationType: 'rose',
    color: '#ff2a6d',
  });

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'gifts'), snap => {
        const list: Gift[] = [];
        snap.forEach(d => list.push(d.data() as Gift));
        if (list.length > 0) setGifts(list);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('gifts:manage')) {
      alert('Permission Denied.');
      return;
    }
    const id = 'g-' + Date.now();
    const item: Gift = {
      id,
      name: newGift.name || 'New Gift',
      icon: newGift.icon || '🎁',
      cost: Number(newGift.cost) || 10,
      animationType: (newGift.animationType as any) || 'rose',
      color: newGift.color || '#ff2a6d',
    };

    try {
      await setDoc(doc(db, 'gifts', id), item);
      await recordAuditLog('ADD_GIFT', 'gift', id, `Added gift ${item.name} costing ${item.cost} coins`);
      setIsAdding(false);
      setNewGift({ name: '', icon: '💎', cost: 50, animationType: 'rose', color: '#ff2a6d' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGift = async (gift: Gift) => {
    if (!hasPermission('gifts:manage')) return;
    if (!confirm(`Delete gift ${gift.name}?`)) return;

    try {
      await deleteDoc(doc(db, 'gifts', gift.id));
      await recordAuditLog('DELETE_GIFT', 'gift', gift.id, `Removed gift ${gift.name}`);
      setGifts(prev => prev.filter(g => g.id !== gift.id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Gift Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure virtual gifts, set coin prices, and specify visual animation effects
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Gift</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateGift} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create Virtual Gift</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Name</label>
              <input
                type="text"
                required
                value={newGift.name}
                onChange={e => setNewGift({ ...newGift, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                placeholder="e.g. Sports Car"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Emoji / Icon</label>
              <input
                type="text"
                required
                value={newGift.icon}
                onChange={e => setNewGift({ ...newGift, icon: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                placeholder="e.g. 🏎️"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Cost (Coins 🪙)</label>
              <input
                type="number"
                required
                value={newGift.cost}
                onChange={e => setNewGift({ ...newGift, cost: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Animation Type</label>
              <select
                value={newGift.animationType}
                onChange={e => setNewGift({ ...newGift, animationType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="rose">Rose (Sparkle)</option>
                <option value="heart">Heart Burst</option>
                <option value="car">Vehicle / Ride</option>
                <option value="dragon">Dragon / Epic</option>
                <option value="rocket">Space Rocket</option>
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
              className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold"
            >
              Save Gift
            </button>
          </div>
        </form>
      )}

      {/* Gifts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {gifts.map(gift => (
          <div
            key={gift.id}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between text-center relative group"
          >
            <button
              type="button"
              onClick={() => handleDeleteGift(gift)}
              className="absolute top-2 right-2 p-1 rounded-md bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-4xl my-2">{gift.icon}</span>
            <div className="font-bold text-white text-xs">{gift.name}</div>
            <div className="text-amber-300 font-mono font-bold text-xs mt-1">
              {gift.cost.toLocaleString()} 🪙
            </div>
            <span className="text-[9px] text-slate-500 uppercase mt-0.5">{gift.animationType}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
