import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';
import { SAMPLE_COUNTRIES, SAMPLE_AVATARS } from '../mockData';
import { Sparkles, MapPin, User, Calendar, CheckCircle2 } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, currentUser, completeOnboarding } = useApp();

  const [age, setAge] = useState<number>(currentUser.age || 21);
  const [gender, setGender] = useState<Gender>(currentUser.gender || 'Male');
  const [country, setCountry] = useState(SAMPLE_COUNTRIES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || SAMPLE_AVATARS[0]);

  if (!showOnboardingModal && currentUser.onboardingCompleted) {
    return null;
  }

  const handleFinish = () => {
    completeOnboarding({
      age,
      gender,
      location: `${country.name}`,
      countryCode: country.code,
      avatar: selectedAvatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Welcome Setup (ধাপ ৩)</h2>
              <p className="text-xs text-neutral-400">Complete your profile to unlock streaming</p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-mono font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
            ID: {currentUser.publicId}
          </span>
        </div>

        {/* Bonus alert */}
        <div className="mt-4 p-3 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 rounded-2xl border border-pink-500/30 flex items-center gap-3">
          <span className="text-2xl">🪙</span>
          <div className="text-xs">
            <span className="font-semibold text-yellow-300">+1,000 Free Coins</span> will be added to your wallet upon completing this step!
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
              Select Avatar (ছবি নির্বাচন)
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {SAMPLE_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === av ? 'border-pink-500 scale-105 ring-2 ring-pink-500/40' : 'border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  {selectedAvatar === av && (
                    <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
              <User className="w-3.5 h-3.5 inline mr-1 text-pink-400" />
              Gender (লিঙ্গ)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Other'] as Gender[]).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                    gender === g
                      ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30'
                      : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {g === 'Male' && '👨 Male'}
                  {g === 'Female' && '👩 Female'}
                  {g === 'Other' && '🌈 Other'}
                </button>
              ))}
            </div>
          </div>

          {/* Age Selection */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-pink-400" />
                Age (বয়স)
              </label>
              <span className="text-sm font-bold text-pink-400">{age} Years</span>
            </div>
            <input
              type="range"
              min={18}
              max={65}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full accent-pink-500 bg-neutral-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>18 (Min)</span>
              <span>40</span>
              <span>65</span>
            </div>
          </div>

          {/* Location / Country */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-pink-400" />
              Location / Country (দেশ)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {SAMPLE_COUNTRIES.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCountry(c)}
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border text-left transition-all ${
                    country.code === c.code
                      ? 'bg-purple-900/40 border-purple-500 text-white shadow-md'
                      : 'bg-neutral-800/80 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Complete Setup & Enter App</span>
          <span className="text-lg">🚀</span>
        </button>
      </div>
    </div>
  );
};
