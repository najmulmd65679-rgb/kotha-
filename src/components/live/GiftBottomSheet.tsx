import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Gift } from '../../types';
import { Coins, Plus, Send, X, Sparkles, Heart, Crown, Flame, Gem } from 'lucide-react';

interface Props {
  roomId: string;
  onClose: () => void;
}

type GiftCategory = 'popular' | 'love' | 'luxury' | 'special';

interface ExtendedGift extends Gift {
  category: GiftCategory;
}

const EXTENDED_GIFTS: ExtendedGift[] = [
  { id: 'g1', name: 'Rose', icon: '🌹', cost: 10, animationType: 'rose', color: '#ff2a6d', category: 'popular' },
  { id: 'g2', name: 'Heart', icon: '💖', cost: 50, animationType: 'heart', color: '#ff416c', category: 'love' },
  { id: 'g3', name: 'Love Balloon', icon: '🎈', cost: 100, animationType: 'heart', color: '#ff4b2b', category: 'love' },
  { id: 'g4', name: 'Crown', icon: '👑', cost: 250, animationType: 'rose', color: '#f7971e', category: 'popular' },
  { id: 'g9', name: 'Diamond Ring', icon: '💍', cost: 800, animationType: 'rose', color: '#00c6ff', category: 'luxury' },
  { id: 'g5', name: 'Sports Car', icon: '🏎️', cost: 500, animationType: 'car', color: '#00c6ff', category: 'luxury' },
  { id: 'g6', name: 'Golden Castle', icon: '🏰', cost: 1500, animationType: 'dragon', color: '#ffd200', category: 'luxury' },
  { id: 'g7', name: 'Fire Dragon', icon: '🐉', cost: 3000, animationType: 'dragon', color: '#f857a6', category: 'special' },
  { id: 'g8', name: 'Space Rocket', icon: '🚀', cost: 5000, animationType: 'rocket', color: '#7f00ff', category: 'special' },
  { id: 'g10', name: 'Lion Roar', icon: '🦁', cost: 10000, animationType: 'dragon', color: '#f59e0b', category: 'special' },
  { id: 'g11', name: 'Magic Wand', icon: '🪄', cost: 350, animationType: 'rose', color: '#ec4899', category: 'popular' },
  { id: 'g12', name: 'Romantic Kiss', icon: '💋', cost: 80, animationType: 'heart', color: '#e11d48', category: 'love' },
];

export const GiftBottomSheet: React.FC<Props> = ({ roomId, onClose }) => {
  const { currentUser, sendGift, setShowRechargeModal } = useApp();
  const [activeCategory, setActiveCategory] = useState<GiftCategory>('popular');
  const [selectedGift, setSelectedGift] = useState<ExtendedGift>(EXTENDED_GIFTS[0]);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isSending, setIsSending] = useState<boolean>(false);

  const multipliers = [1, 5, 10, 66, 99];
  const totalCost = selectedGift.cost * multiplier;
  const isAffordable = currentUser.coins >= totalCost;

  const handleSend = () => {
    if (!isAffordable) {
      setShowRechargeModal(true);
      return;
    }

    setIsSending(true);
    const success = sendGift(roomId, selectedGift.id, multiplier);
    setTimeout(() => {
      setIsSending(false);
    }, 300);

    if (!success) {
      setShowRechargeModal(true);
    }
  };

  const filteredGifts = EXTENDED_GIFTS.filter(g => g.category === activeCategory);

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 bg-neutral-950/95 backdrop-blur-2xl border-t border-neutral-800 rounded-t-3xl p-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200">
      {/* Header: Wallet Balance + Recharge */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-amber-500/40 rounded-full px-3 py-1">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {currentUser.coins.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowRechargeModal(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-neutral-950 font-bold text-xs shadow-md transition-opacity"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Recharge</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none text-xs font-semibold">
        {(['popular', 'love', 'luxury', 'special'] as const).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full capitalize transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-4 gap-2 py-2 max-h-56 overflow-y-auto pr-1">
        {filteredGifts.map(gift => {
          const isSelected = selectedGift.id === gift.id;
          return (
            <button
              key={gift.id}
              type="button"
              onClick={() => setSelectedGift(gift)}
              className={`p-2 rounded-2xl flex flex-col items-center justify-between text-center transition-all border ${
                isSelected
                  ? 'bg-pink-600/20 border-pink-500 ring-2 ring-pink-500/40 shadow-lg'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="text-3xl my-1 group-hover:scale-110 transition-transform">
                {gift.icon}
              </span>
              <div className="text-[11px] font-bold text-white truncate max-w-full">
                {gift.name}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-300 font-mono font-bold mt-0.5">
                <span>{gift.cost}</span>
                <span>🪙</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer: Multiplier combo selector + Send Button */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 gap-2">
        {/* Combo Multipliers */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {multipliers.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={`px-2 py-1 rounded-xl font-bold font-mono text-[11px] transition-all ${
                multiplier === m
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              x{m}
            </button>
          ))}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          className={`px-5 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all ${
            isAffordable
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white hover:opacity-95 active:scale-95'
              : 'bg-neutral-800 border border-amber-500/50 text-amber-300'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>
            {isAffordable ? `Send (${totalCost} 🪙)` : 'Recharge Coins 🪙'}
          </span>
        </button>
      </div>
    </div>
  );
};
