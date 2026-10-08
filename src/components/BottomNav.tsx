import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Trophy, MessageSquare, User, Video } from 'lucide-react';

interface Props {
  onOpenStartLive: () => void;
}

export const BottomNav: React.FC<Props> = ({ onOpenStartLive }) => {
  const { activeTab, setActiveTab, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky bottom-0 z-30 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900 px-3 py-1 flex items-center justify-around text-neutral-400">
      {/* Home */}
      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          activeTab === 'home' ? 'text-pink-500 font-bold' : 'hover:text-neutral-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Ranking */}
      <button
        type="button"
        onClick={() => setActiveTab('ranking')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          activeTab === 'ranking' ? 'text-pink-500 font-bold' : 'hover:text-neutral-200'
        }`}
      >
        <Trophy className="w-5 h-5" />
        <span className="text-[10px]">Ranking</span>
      </button>

      {/* Central Go Live Action Button */}
      <button
        type="button"
        onClick={onOpenStartLive}
        className="relative -top-3 flex flex-col items-center group focus:outline-none"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-600/40 group-active:scale-95 transition-transform flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white">
            <Video className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-pink-400 mt-0.5">Go Live</span>
      </button>

      {/* Messages */}
      <button
        type="button"
        onClick={() => setActiveTab('messages')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          activeTab === 'messages' ? 'text-pink-500 font-bold' : 'hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-pink-500 text-[8px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Messages</span>
      </button>

      {/* Profile */}
      <button
        type="button"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          activeTab === 'profile' ? 'text-pink-500 font-bold' : 'hover:text-neutral-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};
