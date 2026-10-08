import React, { useState } from 'react';
import {
  Send,
  Gift as GiftIcon,
  Gamepad2,
  Heart,
  Smile,
  Mic,
  Activity,
} from 'lucide-react';

interface Props {
  onSendMessage: (text: string) => void;
  onOpenGiftSheet: () => void;
  onOpenGames: () => void;
  onOpenMenu: () => void;
  onTapLike: (e: React.MouseEvent) => void;
  likesCount: number;
}

export const LiveBottomBar: React.FC<Props> = ({
  onSendMessage,
  onOpenGiftSheet,
  onOpenGames,
  onOpenMenu,
  onTapLike,
  likesCount,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const quickEmojis = ['❤️', '🔥', '👏', '😂', '😍', '💎', '🎉', '🌹'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="relative pointer-events-auto space-y-1.5 pt-1 select-none">
      {/* Quick emoji drawer */}
      {showEmojiPicker && (
        <div className="flex items-center gap-1.5 p-1.5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 w-fit animate-in fade-in">
          {quickEmojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-base p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Bottom Bar Matching Reference */}
      <div className="flex items-center gap-2">
        {/* Capsule "Hi..." input (Matching reference image) */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full pl-3.5 pr-1.5 py-1.5 focus-within:border-pink-500/80 transition-colors shadow-lg"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Hi..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-white/60 hover:text-white px-1"
          >
            <Smile className="w-4 h-4" />
          </button>

          {inputText.trim() && (
            <button
              type="submit"
              className="p-1 rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Equalizer / Audio Wave Button (Matching reference icon) */}
        <button
          type="button"
          onClick={onOpenMenu}
          title="Audio & Room Controls"
          className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 shadow-lg transition-transform active:scale-95"
        >
          <Activity className="w-4 h-4 text-cyan-300" />
        </button>

        {/* Mini-Games Button 🎮 */}
        <button
          type="button"
          onClick={onOpenGames}
          title="Play Mini-Games"
          className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-purple-300 shadow-lg transition-transform active:scale-95"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>

        {/* Like Floating Heart Button */}
        <button
          type="button"
          onClick={onTapLike}
          title="Send Hearts"
          className="relative w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-pink-400 shadow-lg transition-transform active:scale-125"
        >
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <span className="absolute -top-1 -right-1 bg-pink-600 text-[8px] font-bold text-white px-1 rounded-full font-mono">
            {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </button>

        {/* Special 3D Floating Gift Button (Matching reference image: glowing rocket/gift) */}
        <button
          type="button"
          onClick={onOpenGiftSheet}
          title="Send Gift"
          className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 p-0.5 shadow-xl shadow-pink-500/40 hover:scale-110 active:scale-95 transition-all animate-bounce"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white border border-white/40">
            <span className="text-xl drop-shadow">🎁</span>
          </div>
        </button>
      </div>
    </div>
  );
};
