import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, MessageCircle, Gift, Sparkles, CheckCheck } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { notifications, markNotificationRead } = useApp();
  const [activeTab, setActiveTab] = useState<'notifications' | 'dms'>('notifications');

  const dms = [
    {
      id: 'dm-1',
      name: 'Ayesha Khan 🎵',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      lastMessage: 'Thank you so much for the Rose! ❤️ Join my next stream tonight!',
      time: '12m ago',
      unread: 1,
    },
    {
      id: 'dm-2',
      name: 'Kotha Official Team',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      lastMessage: 'Your account security check is verified. Welcome to our community!',
      time: '1d ago',
      unread: 0,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Switcher Tab */}
      <div className="flex border-b border-neutral-900 bg-neutral-950 sticky top-0 z-10 px-3 py-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notifications'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Notifications ({notifications.filter(n => !n.read).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dms')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dms'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Direct Messages (2)
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {activeTab === 'notifications' ? (
          <div className="space-y-2.5">
            {notifications.map(item => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  !item.read
                    ? 'bg-pink-950/20 border-pink-500/40 text-white shadow-sm'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0 mt-0.5">
                    {item.type === 'gift' ? (
                      <Gift className="w-4 h-4" />
                    ) : item.type === 'live' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-neutral-500">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {dms.map(chat => (
              <div
                key={chat.id}
                className="flex items-center gap-3 p-3 bg-neutral-900/70 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{chat.name}</h4>
                    <span className="text-[10px] text-neutral-500">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-pink-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
