import React from 'react';
import { LiveRoom } from '../../types';
import {
  X,
  Trophy,
  Share2,
  AlertTriangle,
  Gift,
  Star,
  Check,
  Plus,
} from 'lucide-react';

interface Props {
  room: LiveRoom;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onOpenHostProfile: () => void;
  onOpenWishGift?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onClose: () => void;
}

export const LiveRoomTopBar: React.FC<Props> = ({
  room,
  isFollowing,
  onToggleFollow,
  onOpenHostProfile,
  onOpenWishGift,
  onShare,
  onReport,
  onClose,
}) => {
  const topViewers = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
  ];

  return (
    <div className="relative z-30 select-none p-2.5 pt-3">
      {/* ROW 1: Host Pill (Left) & Viewers + Close (Right) */}
      <div className="flex items-center justify-between gap-2">
        {/* Host Info Capsule */}
        <div
          onClick={onOpenHostProfile}
          className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md pl-1 pr-2.5 py-1 rounded-full border border-white/10 cursor-pointer shadow-lg"
        >
          {/* Host Avatar with active live border */}
          <div className="relative">
            <img
              src={room.streamerAvatar}
              alt={room.streamerName}
              className="w-9 h-9 rounded-full object-cover border border-white/40 ring-1 ring-white/20"
            />
          </div>

          {/* Host Name & ID */}
          <div className="flex flex-col text-left pr-1 leading-tight">
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-[85px]">
              {room.streamerName}
            </span>
            <span className="text-[10px] text-white/70 font-mono tracking-tighter">
              ID:{room.streamerId.replace(/[^0-9]/g, '') || '5895985'}
            </span>
          </div>

          {/* Green Follow Button (Matching reference photo) */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleFollow();
            }}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-0.5 shadow-sm ${
              isFollowing
                ? 'bg-white/25 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Following</span>
              </>
            ) : (
              <span>Follow</span>
            )}
          </button>
        </div>

        {/* Right Area: Top 3 Viewers + Count + Coin badge + Close Button */}
        <div className="flex items-center gap-1.5">
          {/* 3 Overlapping Viewers Avatars */}
          <div className="flex items-center -space-x-2">
            {topViewers.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="Top Viewer"
                className="w-6 h-6 rounded-full object-cover border border-black ring-1 ring-white/30"
              />
            ))}
          </div>

          {/* Viewer count pill */}
          <div className="bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-white border border-white/10 font-mono">
            {room.viewerCount || 894}
          </div>

          {/* Golden Coin Icon */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] shadow-sm font-bold text-black border border-amber-200">
            🪙
          </div>

          {/* Close Button 'X' */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* ROW 2: Sub-bar with Top.10 badge, Wish Gift, Share, Report (Below Host) */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/90">
          {/* Top.10 Badge */}
          <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="text-amber-300 font-bold">Top.10</span>
          </div>

          {/* Wish Gift Badge */}
          <button
            type="button"
            onClick={onOpenWishGift}
            className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hover:bg-black/60 transition-colors"
          >
            <span className="text-xs">🌹</span>
            <span className="text-white/90">Wish gift</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hover:bg-black/60 transition-colors"
          >
            <Share2 className="w-3 h-3 text-cyan-300" />
            <span>Share</span>
          </button>

          {/* Report Button */}
          <button
            type="button"
            onClick={onReport}
            className="p-1 bg-black/45 backdrop-blur-md rounded-full border border-white/10 text-white/80 hover:text-rose-400"
            title="Report"
          >
            <AlertTriangle className="w-3 h-3 text-yellow-300" />
          </button>
        </div>

        {/* Right Floating Badge: Task Chest + 3.5 Star Rank Badge (Matching reference image) */}
        <div className="flex items-center gap-1 bg-indigo-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-indigo-400/30 text-[10px] text-white shadow-md">
          <div className="w-4 h-4 rounded-md bg-blue-500/40 flex items-center justify-center text-xs">
            🎁
          </div>
          <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span className="font-bold text-amber-300 font-mono">3.5 Star</span>
        </div>
      </div>
    </div>
  );
};
