import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift } from '../types';
import { Coins, Plus, Send, X } from 'lucide-react';

interface Props {
  roomId: string;
  onClose: () => void;
}

export const GiftSheet: React.FC<Props> = ({ roomId, onClose }) => {
  const { gifts, currentUser, sendGift, setShowRechargeModal } = useApp();
  const [selectedGift, setSelectedGift] = useState<Gift>(gifts[0]);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isSending, setIsSending] = useState<boolean>(false);

  const multipliers = [1, 10, 66, 99];
  const totalCost = selectedGift.cost * multiplier;

  const handleSend = () => {
    setIsSending(true);
    const success = sendGift(roomId, selectedGift.id, multiplier);
    setTimeout(() => {
      setIsSending(false);
    }, 400);

    if (success && multiplier >= 10) {
      // automatically close or keep open for continuous tapping
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 rounded-t-3xl p-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200">
      {/* Top Header: Coin balance + Recharge */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-amber-500/40 rounded-full px-2.5 py-1">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {currentUser.coins.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowRechargeModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Recharge</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-4 gap-2.5 py-4 max-h-56 overflow-y-auto">
        {gifts.map(gift => {
          const isSelected = selectedGift.id === gift.id;
          return (
            <button
              key={gift.id}
              type="button"
              onClick={() => setSelectedGift(gift)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-pink-500/20 to-purple-600/20 border-pink-500 scale-105 shadow-md shadow-pink-500/20'
                  : 'bg-neutral-900/80 border-neutral-850 hover:border-neutral-700'
              }`}
            >
              <span className="text-3xl drop-shadow-md select-none">{gift.icon}</span>
              <span className="text-[11px] font-bold text-white mt-1 truncate max-w-full">
                {gift.name}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-semibold flex items-center gap-0.5 mt-0.5">
                <span>🪙</span>
                {gift.cost}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Multipliers & Send Button */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
        {/* Multiplier Pills */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          {multipliers.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                multiplier === m
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
            currentUser.coins >= totalCost
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-500/30 active:scale-95'
              : 'bg-neutral-800 text-amber-300 border border-amber-500/30'
          }`}
        >
          {currentUser.coins >= totalCost ? (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send ({totalCost.toLocaleString()} 🪙)</span>
            </>
          ) : (
            <>
              <span>Get Coins ({totalCost.toLocaleString()})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
