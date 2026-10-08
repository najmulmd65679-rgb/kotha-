import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveRoom } from '../types';
import {
  Flame,
  MapPin,
  Swords,
  Heart,
  Users,
  Sparkles,
  Globe,
  X,
  Check,
  Search,
} from 'lucide-react';

interface Props {
  onOpenStartLive: () => void;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'ALL', name: 'All Countries', flag: '🌐', nativeName: 'সকল দেশ' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', nativeName: 'বাংলাদেশ' },
  { code: 'IN', name: 'India', flag: '🇮🇳', nativeName: 'ভারত' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', nativeName: 'পাকিস্তান' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', nativeName: 'সৌদি আরব' },
  { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', nativeName: 'সংযুক্ত আরব আমিরাত' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', nativeName: 'মালয়েশিয়া' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', nativeName: 'সিঙ্গাপুর' },
  { code: 'US', name: 'United States', flag: '🇺🇸', nativeName: 'আমেরিকা' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', nativeName: 'যুক্তরাজ্য' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', nativeName: 'ফিলিপাইন' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', nativeName: 'ইন্দোনেশিয়া' },
];

export const HomeView: React.FC<Props> = ({ onOpenStartLive }) => {
  const { liveRooms, joinRoom, currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState<'hot' | 'nearby' | 'pk' | 'following'>('hot');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');

  // Filtering by category and country
  const filteredRooms = liveRooms.filter(room => {
    // 1. Category check
    if (activeCategory === 'nearby' && room.countryCode !== (currentUser.countryCode || 'BD')) {
      return false;
    }
    if (activeCategory === 'pk' && !room.tags.includes('PK')) {
      return false;
    }

    // 2. Country check
    if (selectedCountry !== 'ALL' && room.countryCode !== selectedCountry) {
      return false;
    }

    return true;
  });

  const selectedCountryObj = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  const filteredCountriesModal = COUNTRIES.filter(c => {
    const q = countrySearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.nativeName.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  // Calculate room counts per country
  const getRoomCountForCountry = (code: string) => {
    if (code === 'ALL') return liveRooms.length;
    return liveRooms.filter(r => r.countryCode === code).length;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Top Category Pills Header */}
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-20 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('hot');
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'hot'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Hot
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('nearby');
            setSelectedCountry(currentUser.countryCode || 'BD');
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'nearby'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Nearby ({currentUser.countryCode || 'BD'})
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('pk')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'pk'
              ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          PK Battles
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('following')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'following'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Following
        </button>
      </div>

      {/* Country Filter Quick Bar */}
      <div className="px-3 py-2 bg-neutral-900/50 border-b border-neutral-850 flex items-center gap-2">
        {/* Globe Country Selector Button */}
        <button
          type="button"
          onClick={() => setShowCountryModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold shrink-0 border border-neutral-700/80 shadow-sm"
          title="Filter by Country"
        >
          <Globe className="w-3.5 h-3.5 text-pink-400" />
          <span>{selectedCountryObj.flag}</span>
          <span className="text-[11px] font-semibold truncate max-w-[65px]">
            {selectedCountry === 'ALL' ? 'Country' : selectedCountryObj.name}
          </span>
        </button>

        <div className="w-px h-5 bg-neutral-800 shrink-0" />

        {/* Scrollable Country Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {COUNTRIES.slice(0, 8).map(c => {
            const isSelected = selectedCountry === c.code;
            const count = getRoomCountForCountry(c.code);
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCountry(c.code)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-pink-600/20 border-pink-500 text-white font-bold ring-1 ring-pink-500/30'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.code === 'ALL' ? 'All' : c.code}</span>
                {count > 0 && (
                  <span
                    className={`text-[9px] px-1 rounded-full ${
                      isSelected ? 'bg-pink-500 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Countries Button */}
          <button
            type="button"
            onClick={() => setShowCountryModal(true)}
            className="px-2 py-1 rounded-xl text-[10px] bg-neutral-800/80 hover:bg-neutral-800 text-pink-400 border border-neutral-700 whitespace-nowrap font-bold"
          >
            + More...
          </button>
        </div>
      </div>

      {/* Active Country Filter Status Banner (if a country is selected) */}
      {selectedCountry !== 'ALL' && (
        <div className="mx-3 mt-2.5 p-2 px-3 rounded-xl bg-pink-950/30 border border-pink-500/30 flex items-center justify-between text-xs text-pink-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCountryObj.flag}</span>
            <span>
              ফিল্টারিং: <strong>{selectedCountryObj.name} ({selectedCountryObj.nativeName})</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCountry('ALL')}
            className="p-1 rounded-lg hover:bg-pink-900/40 text-pink-300 font-bold flex items-center gap-1 text-[11px]"
          >
            <X className="w-3.5 h-3.5" />
            <span>সকল দেশ দেখুন</span>
          </button>
        </div>
      )}

      {/* Featured Banner / Daily Event */}
      <div className="px-3 pt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/90 via-pink-900/80 to-rose-950 p-3.5 text-white border border-pink-500/20 shadow-lg">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-300 text-[10px] font-bold border border-pink-400/30 mb-1.5">
              <Sparkles className="w-3 h-3" />
              Daily Star Contest 🌟
            </div>
            <h3 className="text-sm font-extrabold text-white">Top Gifter wins 100,000 Diamonds!</h3>
            <p className="text-[11px] text-pink-200/80 mt-0.5 line-clamp-1">
              Join active rooms and send Rose & Castle to climb the daily leaderboard.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-pink-500/20 blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Streamer Grid */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Live Broadcasts ({filteredRooms.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenStartLive}
            className="text-[11px] text-pink-400 font-semibold hover:underline"
          >
            + Start My Live
          </button>
        </div>

        {/* Empty state when no rooms exist for that country */}
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-3 my-2">
            <div className="text-4xl">{selectedCountryObj.flag}</div>
            <div className="text-xs font-bold text-white">
              {selectedCountryObj.name} দেশে এই মুহূর্তে কোনো লাইভ নেই
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              আপনি প্রথম ব্যক্তি হিসেবে {selectedCountryObj.name} থেকে লাইভ শুরু করতে পারেন অথবা সকল দেশের লাইভ দেখতে পারেন।
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedCountry('ALL')}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-semibold"
              >
                সকল দেশ দেখুন (View All)
              </button>
              <button
                type="button"
                onClick={onOpenStartLive}
                className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
              >
                এখানে লাইভ শুরু করুন 🔴
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredRooms.map((room: LiveRoom) => (
              <div
                key={room.id}
                onClick={() => joinRoom(room)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 transition-all hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 active:scale-[0.98]"
              >
                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                  <img
                    src={room.coverImage}
                    alt={room.streamerName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                  {/* Top Badge: LIVE + Viewers */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-medium border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <Users className="w-2.5 h-2.5 ml-0.5 text-neutral-300" />
                    <span>{room.viewerCount.toLocaleString()}</span>
                  </div>

                  {/* Top Right: Country Flag & Code */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white border border-white/10 font-bold flex items-center gap-1">
                    <span>
                      {COUNTRIES.find(c => c.code === room.countryCode)?.flag || '🌐'}
                    </span>
                    <span>{room.countryCode}</span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    {/* Streamer Level & Name */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-pink-600 to-purple-600 text-[9px] font-bold text-white shadow-sm">
                        Lv.{room.streamerLevel}
                      </span>
                      <span className="text-xs font-bold truncate drop-shadow-md">
                        {room.streamerName}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-[11px] text-neutral-300 line-clamp-1 leading-tight drop-shadow-sm">
                      {room.title}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1 mt-1 overflow-hidden">
                      {room.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-white/20 backdrop-blur-sm px-1.5 py-0.2 rounded text-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Country Selection Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowCountryModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <Globe className="w-5 h-5 text-pink-400" />
              <div>
                <h3 className="text-sm font-bold text-white">দেশ নির্বাচন করুন (Select Country)</h3>
                <p className="text-[11px] text-neutral-400">নির্দিষ্ট দেশের লাইভ ব্রডকাস্ট দেখুন</p>
              </div>
            </div>

            {/* Country search input */}
            <div className="relative my-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
                placeholder="Search country name or code..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Country List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredCountriesModal.map(country => {
                const isSelected = selectedCountry === country.code;
                const roomCount = getRoomCountForCountry(country.code);
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountryModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-pink-600/20 border-pink-500 text-white font-bold ring-1 ring-pink-500/30'
                        : 'bg-neutral-800/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{country.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{country.name}</div>
                        <div className="text-[10px] text-neutral-400">{country.nativeName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300">
                        {roomCount} {roomCount === 1 ? 'room' : 'rooms'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-pink-400 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
