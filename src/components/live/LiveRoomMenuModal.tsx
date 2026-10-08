import React, { useState } from 'react';
import { LiveRoom } from '../../types';
import {
  X,
  Flag,
  UserX,
  Share2,
  Info,
  Shield,
  VolumeX,
  StopCircle,
  Ban,
  Check,
  Link,
} from 'lucide-react';

interface Props {
  room: LiveRoom;
  onOpenReport: () => void;
  onOpenHostProfile: () => void;
  onClose: () => void;
}

export const LiveRoomMenuModal: React.FC<Props> = ({
  room,
  onOpenReport,
  onOpenHostProfile,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    alert(isMuted ? 'Host unmuted.' : 'Host audio muted.');
  };

  const handleBlock = () => {
    setIsBlocked(!isBlocked);
    alert(isBlocked ? `Unblocked ${room.streamerName}` : `Blocked ${room.streamerName}. You will not see their streams.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl relative animate-in slide-in-from-bottom duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>Room Options & Settings</span>
        </h3>

        {/* Action List */}
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHostProfile();
            }}
            className="w-full p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-left flex items-center gap-3 transition-colors"
          >
            <Info className="w-4 h-4 text-pink-400" />
            <div className="flex-1">
              <div className="font-semibold text-white">View Host Profile</div>
              <div className="text-[10px] text-neutral-400">ID: {room.streamerId} • Levels & Bio</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-left flex items-center gap-3 transition-colors"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <div className="flex-1">
              <div className="font-semibold text-white">Share Live Broadcast</div>
              <div className="text-[10px] text-neutral-400">
                {copiedLink ? 'Link Copied to Clipboard!' : 'Copy invite link to share with friends'}
              </div>
            </div>
            {copiedLink && <Check className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={handleMute}
            className="w-full p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-left flex items-center gap-3 transition-colors"
          >
            <VolumeX className="w-4 h-4 text-amber-400" />
            <div className="flex-1">
              <div className="font-semibold text-white">{isMuted ? 'Unmute Host Audio' : 'Mute Host Audio'}</div>
              <div className="text-[10px] text-neutral-400">Control audio volume in this room</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleBlock}
            className="w-full p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-left flex items-center gap-3 transition-colors"
          >
            <UserX className="w-4 h-4 text-purple-400" />
            <div className="flex-1">
              <div className="font-semibold text-white">{isBlocked ? 'Unblock User' : 'Block User'}</div>
              <div className="text-[10px] text-neutral-400">Hide messages and streams from this host</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReport();
            }}
            className="w-full p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:bg-rose-950/40 text-left flex items-center gap-3 transition-colors text-rose-300"
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <div className="flex-1">
              <div className="font-semibold text-rose-200">Report Live Room</div>
              <div className="text-[10px] text-rose-400/80">Violations, harassment or inappropriate behavior</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
