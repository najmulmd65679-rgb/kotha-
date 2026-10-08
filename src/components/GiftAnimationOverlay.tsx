import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift } from '../types';

interface Props {
  giftAnimation: { gift: Gift; senderName: string; count: number } | null;
}

export const GiftAnimationOverlay: React.FC<Props> = ({ giftAnimation }) => {
  useEffect(() => {
    if (giftAnimation) {
      if (giftAnimation.gift.cost >= 500) {
        // High tier gift fireworks
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ff2a6d', '#00f2fe', '#4facfe', '#fa709a'],
        });
      } else {
        // Smaller sparkle
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
  }, [giftAnimation]);

  if (!giftAnimation) return null;

  const { gift, senderName, count } = giftAnimation;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Floating Gift Banner */}
      <div className="animate-bounce flex items-center gap-3 bg-gradient-to-r from-amber-500/95 via-pink-600/95 to-purple-700/95 px-5 py-3 rounded-full text-white shadow-2xl border-2 border-yellow-300 backdrop-blur-md">
        <span className="text-4xl animate-pulse drop-shadow-lg">{gift.icon}</span>
        <div className="flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-wider text-yellow-200">
            Special Gift Sent!
          </div>
          <div className="text-sm font-bold truncate max-w-[200px]">
            <span className="text-yellow-100">{senderName}</span> sent{' '}
            <span className="text-white">{gift.name}</span>
          </div>
        </div>
        <div className="text-2xl font-black text-yellow-300 italic tracking-tight pl-2">
          x{count}
        </div>
      </div>
    </div>
  );
};
