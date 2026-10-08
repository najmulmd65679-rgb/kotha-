import React, { useState } from 'react';
import { Mic, MicOff, Maximize2, Minimize2, Video, X } from 'lucide-react';

interface Props {
  streamUrl?: string;
  guestName?: string;
  onToggleGuest?: () => void;
}

export const FloatingGuestVideo: React.FC<Props> = ({
  streamUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  guestName = 'Guest Co-Host',
  onToggleGuest,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="absolute bottom-28 right-3 z-30 p-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-1.5 text-[11px] font-bold"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Co-Host 2</span>
        <Maximize2 className="w-3 h-3 text-neutral-300" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-28 right-3 z-30 w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-neutral-900 group select-none animate-in zoom-in-95 duration-200">
      {/* Co-Host Video Feed (Man in grey t-shirt matching reference image) */}
      <img
        src={streamUrl}
        alt={guestName}
        className="w-full h-full object-cover"
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between text-white pointer-events-auto">
        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>PK Guest</span>
        </span>

        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="p-1 rounded-full bg-black/50 text-white/80 hover:text-white"
        >
          <Minimize2 className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white pointer-events-auto">
        <span className="text-[10px] font-bold drop-shadow bg-black/40 px-1 rounded truncate max-w-[55px]">
          {guestName}
        </span>

        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1 rounded-full backdrop-blur-sm ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-black/60 text-white'
          }`}
        >
          {isMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
};
