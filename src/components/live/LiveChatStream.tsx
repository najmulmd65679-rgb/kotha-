import React, { useEffect, useRef } from 'react';
import { LiveMessage } from '../../types';
import { User, Sparkles, Gem, Award, ShieldCheck } from 'lucide-react';

interface Props {
  messages: LiveMessage[];
  hostName: string;
}

export const LiveChatStream: React.FC<Props> = ({ messages, hostName }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Default mock chat items styled matching the reference image
  const defaultChats = [
    {
      id: 'c1',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      name: 'Kity ss',
      blueLevel: 5,
      orangeLevel: null,
      badges: [],
      text: "It's been ages!",
    },
    {
      id: 'c2',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      name: 'Cajan',
      blueLevel: null,
      orangeLevel: 25,
      badges: ['Sweetie'],
      text: 'It cracks me up',
    },
    {
      id: 'c3',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      name: 'Annana',
      blueLevel: null,
      orangeLevel: 30,
      badges: ['Sweetie', 'New*'],
      mention: '@Kity ss',
      text: 'Hi, Guys',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-none pointer-events-auto max-h-48 sm:max-h-52 select-none">
      {/* Pinned System Notice (Matching reference image: "Please respect each other") */}
      <div className="inline-block text-[11px] font-semibold text-yellow-200/90 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-xl border border-yellow-300/20 shadow-sm">
        Please respect each other & keep chat friendly
      </div>

      {/* Reference styled demo chats */}
      {defaultChats.map(item => (
        <div
          key={item.id}
          className="flex items-start gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/5 text-[11px] leading-snug w-fit max-w-[85%] shadow-sm"
        >
          {/* Avatar */}
          <img
            src={item.avatar}
            alt={item.name}
            className="w-4 h-4 rounded-full object-cover shrink-0 mt-0.5 border border-white/30"
          />

          <div className="flex flex-wrap items-center gap-1">
            {/* Sender Name */}
            <span className="font-bold text-white/90">{item.name}</span>

            {/* Blue User Level Badge (e.g. 👤 5 in reference) */}
            {item.blueLevel && (
              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                <User className="w-2 h-2" />
                <span>{item.blueLevel}</span>
              </span>
            )}

            {/* Orange Wealth Badge (e.g. 💎 25, 💎 30 in reference) */}
            {item.orangeLevel && (
              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                <span>💎</span>
                <span>{item.orangeLevel}</span>
              </span>
            )}

            {/* Purple Title Badges (e.g. Sweetie, New* in reference) */}
            {item.badges.map((b, idx) => (
              <span
                key={idx}
                className={`text-[8px] font-bold px-1 py-0.2 rounded-full ${
                  b === 'New*'
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-purple-600/90 text-white'
                }`}
              >
                {b}
              </span>
            ))}

            {/* Message Body */}
            <span className="text-white/95">
              {item.mention && (
                <span className="text-amber-300 font-semibold mr-1">
                  {item.mention}
                </span>
              )}
              {item.text}
            </span>
          </div>
        </div>
      ))}

      {/* Dynamic real-time messages */}
      {messages.map(msg => {
        if (msg.isGiftAlert) {
          return (
            <div
              key={msg.id}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-900/60 via-pink-900/50 to-indigo-900/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-pink-400/30 text-[11px] text-white"
            >
              <img
                src={msg.userAvatar}
                alt={msg.userName}
                className="w-4 h-4 rounded-full object-cover border border-pink-300"
              />
              <span className="font-bold text-amber-300">{msg.userName}</span>
              <span className="text-pink-200">{msg.text}</span>
            </div>
          );
        }

        if (msg.isSystem) {
          return (
            <div
              key={msg.id}
              className="inline-flex items-center gap-1 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] text-neutral-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-white">{msg.userName}</span>
              <span>{msg.text}</span>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className="flex items-start gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/5 text-[11px] leading-snug w-fit max-w-[85%]"
          >
            <img
              src={msg.userAvatar}
              alt={msg.userName}
              className="w-4 h-4 rounded-full object-cover shrink-0 mt-0.5 border border-white/20"
            />
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold text-white/90">{msg.userName}</span>
              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                <span>Lv.{msg.userLevel}</span>
              </span>
              <span className="text-white">{msg.text}</span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};
