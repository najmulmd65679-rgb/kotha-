import React, { useState } from 'react';
import { LiveRoom } from '../../types';
import {
  X,
  Crown,
  Sparkles,
  Heart,
  Copy,
  Check,
  Flag,
  ShieldAlert,
  Gift,
  MessageCircle,
} from 'lucide-react';

interface Props {
  room: LiveRoom;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onOpenGiftSheet: () => void;
  onOpenReport: () => void;
  onClose: () => void;
}

export const HostProfileModal: React.FC<Props> = ({
  room,
  isFollowing,
  onToggleFollow,
  onOpenGiftSheet,
  onOpenReport,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(room.streamerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl relative animate-in slide-in-from-bottom duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <img
              src={room.streamerAvatar}
              alt={room.streamerName}
              className="w-20 h-20 rounded-full object-cover border-2 border-pink-500 shadow-xl ring-4 ring-pink-500/20"
            />
            <span className="absolute bottom-0 right-0 px-1.5 py-0.2 rounded-full bg-red-600 text-[9px] font-bold text-white border border-neutral-900">
              LIVE
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <span>{room.streamerName}</span>
            <span className="text-sm">{room.countryCode === 'BD' ? '🇧🇩' : '🌍'}</span>
          </h3>

          {/* Public ID */}
          <button
            type="button"
            onClick={handleCopyId}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-pink-300 font-mono mt-0.5"
          >
            <span>Kotha ID: {room.streamerId}</span>
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Level Badges */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="p-2.5 rounded-2xl bg-neutral-800/60 border border-amber-500/30 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Wealth Level</div>
              <div className="text-xs font-bold text-amber-300 font-mono">
                Level {Math.max(1, Math.floor(room.streamerLevel / 2))}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-neutral-800/60 border border-pink-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Charm Level</div>
              <div className="text-xs font-bold text-pink-300 font-mono">
                Charm Lv.{room.streamerLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Stream stats */}
        <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-850 text-xs text-neutral-300 space-y-1 mb-4">
          <div className="font-semibold text-white line-clamp-1">"{room.title}"</div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60 font-mono">
            <span>Diamonds: {room.diamondsEarned.toLocaleString()} 💎</span>
            <span>Viewers: {room.viewerCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={onToggleFollow}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isFollowing
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{isFollowing ? 'Following' : '+ Follow Host'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGiftSheet();
            }}
            className="py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Send Gift 🎁</span>
          </button>
        </div>

        {/* Report / Safety links */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReport();
            }}
            className="hover:text-rose-400 flex items-center gap-1"
          >
            <Flag className="w-3 h-3" />
            <span>Report Violation</span>
          </button>
          <span>Country: {room.country}</span>
        </div>
      </div>
    </div>
  );
};
