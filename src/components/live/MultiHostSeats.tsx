import React, { useState } from 'react';
import { Mic, MicOff, Plus, UserPlus, Users } from 'lucide-react';

interface Props {
  onJoinSeat?: () => void;
}

interface GuestSeat {
  id: number;
  userName?: string;
  avatar?: string;
  isMuted?: boolean;
}

export const MultiHostSeats: React.FC<Props> = ({ onJoinSeat }) => {
  const [seats, setSeats] = useState<GuestSeat[]>([
    { id: 1, userName: 'Mim', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', isMuted: false },
    { id: 2, userName: 'Shohel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', isMuted: true },
    { id: 3 },
    { id: 4 },
  ]);

  const [hasRequested, setHasRequested] = useState(false);

  const handleRequestSeat = () => {
    setHasRequested(true);
    setTimeout(() => {
      setHasRequested(false);
      alert('Seat request sent to Host! Waiting for approval.');
    }, 400);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 w-fit max-w-[94%]">
      <div className="flex items-center gap-1.5">
        {seats.map(seat => (
          <div key={seat.id} className="relative group">
            {seat.userName ? (
              <div className="relative">
                <img
                  src={seat.avatar}
                  alt={seat.userName}
                  className="w-8 h-8 rounded-full object-cover border border-pink-400 ring-1 ring-pink-500/30"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center border border-white/20">
                  {seat.isMuted ? (
                    <MicOff className="w-2 h-2 text-rose-400" />
                  ) : (
                    <Mic className="w-2 h-2 text-emerald-400" />
                  )}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestSeat}
                title="Join Guest Seat"
                className="w-8 h-8 rounded-full border border-dashed border-white/30 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleRequestSeat}
        className="px-2 py-1 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <UserPlus className="w-3 h-3" />
        <span>{hasRequested ? 'Requested...' : 'Join Seat'}</span>
      </button>
    </div>
  );
};
