import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Video, Sparkles, X, Tag } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const StartLiveModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, startLiveStream } = useApp();
  const [title, setTitle] = useState(`${currentUser.name}'s Live Party ✨`);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Chat', 'Music']);

  const availableTags = ['Chat', 'Music', 'Singing', 'Dance', 'PK Battle', 'Gaming', 'Friendly'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startLiveStream(title, selectedTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Go Live (লাইভ শুরু করুন)</h3>
            <p className="text-xs text-neutral-400">Broadcasting to global viewers</p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-4 mt-4">
          {/* Stream Title */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Stream Title (লাইভ টাইটেল)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your room a fun title..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              <span>Room Category Tags</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-pink-600 border-pink-500 text-white font-semibold'
                      : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-800 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-[11px] text-neutral-300">
              Your device camera and microphone will start broadcasting directly. Viewers can send gifts to support you!
            </div>
          </div>

          {/* Start Stream Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-95 transition-all"
          >
            Start Broadcast 🔴
          </button>
        </form>
      </div>
    </div>
  );
};
