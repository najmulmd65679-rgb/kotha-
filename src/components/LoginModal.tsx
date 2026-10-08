import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, CheckCircle2, X, HelpCircle, ArrowRight } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginWithGoogle, isLoggedIn } = useApp();
  const [loading, setLoading] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  if (!showLoginModal && isLoggedIn) {
    return null;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white shadow-2xl relative">
        {/* Close button if user just wants to browse */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Logo & Glowing Header */}
        <div className="text-center pt-2">
          <div className="relative inline-block mx-auto mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-pink-600/40 border-2 border-white/20">
              K
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center text-[9px] font-bold text-white">
              ✓
            </span>
          </div>

          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
            Kotha Live Login
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            বিশ্বজুড়ে বন্ধুদের সাথে লাইভ কথা ও বিনোদন
          </p>
        </div>

        {/* Welcome Bonus Callout */}
        <div className="my-4 p-3 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 rounded-2xl border border-pink-500/30 flex items-center gap-3">
          <span className="text-2xl animate-bounce">🎁</span>
          <div className="text-xs">
            <span className="font-bold text-yellow-300">৫,০০০ ফ্রী কয়েন বোনাস!</span>
            <p className="text-[11px] text-neutral-300">লগইন করলেই উপহার দেওয়ার কয়েন পাবেন।</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Real Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white text-neutral-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-neutral-100 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{loading ? 'লগইন হচ্ছে...' : 'Continue with Google (গুগল সাইন-ইন)'}</span>
          </button>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold text-xs border border-neutral-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>১-ক্লিকে টেস্ট লগইন (Quick Demo)</span>
          </button>
        </div>

        {/* How It Works Accordion in Bangla */}
        <div className="mt-4 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setShowHowItWorks(prev => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-pink-400 font-semibold"
          >
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ইউজার লগইন কীভাবে কাজ করে?</span>
            </span>
            <span>{showHowItWorks ? '▲' : '▼'}</span>
          </button>

          {showHowItWorks && (
            <div className="mt-2.5 space-y-2 text-[11px] text-neutral-300 bg-neutral-800/60 p-3 rounded-xl border border-neutral-750">
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ১
                </span>
                <span><strong>Google Sign-In:</strong> ইউজার বাটনে চাপ দিয়ে যেকোনো জিমেইল অ্যাকাউন্ট সিলেক্ট করবেন।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ২
                </span>
                <span><strong>ইউনিক Kotha ID:</strong> সিস্টেমে স্বয়ংক্রিয়ভাবে ৭-ডিজিটের ইউনিক পাবলিক আইডি তৈরি হয়ে ডেটাবেজে সেভ হবে।</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ৩
                </span>
                <span><strong>অনবোর্ডিং:</strong> প্রথমবার ইউজার তার বয়স (Age), লিঙ্গ (Gender) ও দেশ (Location) সেট করবেন এবং বাড়তি +১,০০০ বোনাস কয়েন পাবেন।</span>
              </div>
            </div>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Firebase Authentication Protected</span>
        </div>
      </div>
    </div>
  );
};
