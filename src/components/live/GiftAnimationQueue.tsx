import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift } from '../../types';

export interface GiftComboBanner {
  id: string;
  senderName: string;
  senderAvatar: string;
  targetText: string;
  giftName: string;
  giftIcon: string;
  comboCount: number;
}

interface Props {
  activeGift: { gift: Gift; senderName: string; count: number } | null;
}

export const GiftAnimationQueue: React.FC<Props> = ({ activeGift }) => {
  // Initial demo banners matching reference image (Cajan & Kity s's)
  const [banners, setBanners] = useState<GiftComboBanner[]>([
    {
      id: 'demo-1',
      senderName: 'Cajan',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      targetText: 'Send to Host',
      giftName: 'Dessert Cake',
      giftIcon: '🧁',
      comboCount: 157,
    },
    {
      id: 'demo-2',
      senderName: "Kity s's",
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      targetText: 'Send all in the room',
      giftName: 'Lucky Clover',
      giftIcon: '🍀',
      comboCount: 95,
    },
  ]);

  useEffect(() => {
    if (activeGift) {
      // Trigger canvas confetti on high tier gifts
      if (activeGift.gift.cost >= 500) {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ff2a6d', '#00f2fe', '#fa709a', '#7f00ff'],
        });
      }

      const newBanner: GiftComboBanner = {
        id: 'gift-' + Date.now(),
        senderName: activeGift.senderName,
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        targetText: 'Send to Host',
        giftName: activeGift.gift.name,
        giftIcon: activeGift.gift.icon,
        comboCount: activeGift.count || 1,
      };

      setBanners(prev => {
        // If same sender & gift, increment combo
        const existingIdx = prev.findIndex(b => b.senderName === activeGift.senderName && b.giftName === activeGift.gift.name);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx].comboCount += activeGift.count;
          return updated;
        }
        return [...prev.slice(-2), newBanner];
      });
    }
  }, [activeGift]);

  if (banners.length === 0) return null;

  return (
    <div className="pointer-events-none absolute left-2 bottom-56 sm:bottom-52 z-30 flex flex-col items-start gap-1.5 max-w-[85%] select-none">
      {banners.map((item, idx) => (
        <div
          key={item.id}
          className="animate-in slide-in-from-left duration-200 flex items-center gap-2 bg-gradient-to-r from-purple-700/90 via-indigo-700/85 to-purple-900/90 backdrop-blur-md pl-1.5 pr-3 py-1 rounded-full border border-purple-400/40 shadow-xl"
        >
          {/* Sender Round Avatar */}
          <img
            src={item.senderAvatar}
            alt={item.senderName}
            className="w-7 h-7 rounded-full object-cover border border-purple-300 ring-1 ring-white/30"
          />

          {/* Sender Name & Target info */}
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[11px] font-bold text-white tracking-wide">
              {item.senderName}
            </span>
            <span className="text-[9px] text-purple-200/90 font-medium">
              {item.targetText}
            </span>
          </div>

          {/* Gift Icon */}
          <span className="text-xl animate-bounce drop-shadow">
            {item.giftIcon}
          </span>

          {/* Big Golden Combo Multiplier (Matching reference: x157, x95) */}
          <span className="text-base font-black italic tracking-tighter text-amber-300 drop-shadow-md font-mono ml-0.5">
            x{item.comboCount}
          </span>
        </div>
      ))}
    </div>
  );
};
