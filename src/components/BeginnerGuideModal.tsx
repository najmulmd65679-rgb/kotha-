import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, CheckCircle, Smartphone, Flame, Layers, ArrowRight, X, Cpu, Globe } from 'lucide-react';

export const BeginnerGuideModal: React.FC = () => {
  const { showGuideModal, setShowGuideModal } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!showGuideModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl overflow-y-auto max-h-[92vh] relative">
        <button
          type="button"
          onClick={() => setShowGuideModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Kotha Live তৈরির সম্পূর্ণ রোডম্যাপ ও গাইডলাইন
            </h3>
            <p className="text-xs text-neutral-400">
              Technology Stack নির্বাচন এবং Step 1-এর পূর্ণাঙ্গ নির্দেশিকা
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-2xl text-left border transition-all ${
              activeStep === 1
                ? 'bg-pink-600/20 border-pink-500 text-white'
                : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-pink-400">Technology</div>
            <div className="text-xs font-bold mt-0.5">১. স্ট্যাক নির্বাচন</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`p-2.5 rounded-2xl text-left border transition-all ${
              activeStep === 2
                ? 'bg-pink-600/20 border-pink-500 text-white'
                : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-pink-400">Step 1 Status</div>
            <div className="text-xs font-bold mt-0.5">২. এখন যা তৈরি হলো</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`p-2.5 rounded-2xl text-left border transition-all ${
              activeStep === 3
                ? 'bg-pink-600/20 border-pink-500 text-white'
                : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-pink-400">Android APK</div>
            <div className="text-xs font-bold mt-0.5">৩. APK ফাইল তৈরি</div>
          </button>
        </div>

        {/* Content Section 1: Technology Stack */}
        {activeStep === 1 && (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
            <div className="p-3 bg-neutral-800/50 rounded-2xl border border-neutral-700/60">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-pink-400 mb-1">
                <Cpu className="w-4 h-4" />
                আপনার জন্য সেরা Technology Stack (কেন নির্বাচন করলাম?)
              </h4>
              <p>
                যেহেতু আপনি coding জানেন না এবং সরাসরি Android Mobile App (যেমন Poppo Live বা Taka Live) তৈরি করতে চান, তাই আমরা এমন স্ট্যাক বেছে নিয়েছি যাতে <strong>জটিল কোড লেখা ছাড়াই Google এর টুলস ও রেডিমেড লাইব্রেরি</strong> দিয়ে সব কাজ করা যায়:
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800">
                <span className="font-bold text-white text-xs block mb-1">
                  📱 Frontend (অ্যাপের ডিজাইন ও স্ক্রিন): <span className="text-pink-400">React + Tailwind CSS + Capacitor</span>
                </span>
                <p className="text-neutral-400">
                  <strong>কেন?</strong> React দিয়ে আধুনিক ওয়েব অ্যাপ তৈরি হয় এবং <strong>Capacitor</strong> মাত্র এক কমান্ডে এই ওয়েবসাইটটিকে একদম আসল Android Studio `.apk` বা `.aab` ফাইলে রূপান্তর করে দেয়। আপনাকে কোনো Kotlin বা Java শিখতে হবে না!
                </p>
              </div>

              <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800">
                <span className="font-bold text-white text-xs block mb-1">
                  🔥 Backend & Database: <span className="text-amber-400">Google Firebase (Firestore + Auth)</span>
                </span>
                <p className="text-neutral-400">
                  <strong>কেন?</strong> Firebase হলো Google-এর ক্লাউড সেবা। এতে সার্ভার কোড লেখা ছাড়াই Google Login, কোটি ইউজারের ডেটা, রিয়েলটাইম লাইভ চ্যাট এবং ওয়ালেট কয়েনের হিসাব সুরক্ষিতভাবে সংরক্ষিত হয়।
                </p>
              </div>

              <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800">
                <span className="font-bold text-white text-xs block mb-1">
                  🎥 Live Streaming Engine: <span className="text-cyan-400">WebRTC / Agora LiveKit</span>
                </span>
                <p className="text-neutral-400">
                  <strong>কেন?</strong> লাইভ ভিডিও ব্রডকাস্টিংয়ের জন্য কোনো সার্ভার বানাতে হয় না; গুগল সমর্থিত WebRTC এবং ক্লাউড লাইভ স্ট্রিমিং SDK দিয়ে মিলি-সেকেন্ড ল্যাটেন্সিতে ক্যামেরা লাইভ ব্রডকাস্ট করা যায়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Section 2: Step 1 & 2 Details */}
        {activeStep === 2 && (
          <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
            <div className="p-3 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-emerald-200">
              <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-4 h-4" />
                ধাপ ১ এবং ধাপ ২ সফলভাবে সম্পন্ন!
              </h4>
              <p>
                Kotha Live মোবাইল অ্যাপ এবং <strong>Google Firebase ক্লাউড ডেটাবেজ</strong> সফলভাবে যুক্ত হয়েছে। এখন আপনার কয়েন, ডায়মন্ড, প্রোফাইল ও চ্যাট রিয়েল-টাইমে গুগলের ক্লাউড ডেটাবেজে সংরক্ষিত হচ্ছে।
              </p>
            </div>

            <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800 space-y-2">
              <h5 className="font-bold text-white">এখন আপনি যা যা টেস্ট করতে পারেন:</h5>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                <li><strong className="text-white">Google Login ও প্রোফাইল:</strong> Profile ট্যাবে গিয়ে "Google Account Sign-In" এ ক্লিক করুন। আপনার অ্যাকাউন্ট ডেটাবেজে সিঙ্ক হবে।</li>
                <li><strong className="text-white">মোবাইল ফ্রেম ভিউ:</strong> উপরের স্ক্রিনের মোবাইল/মনিটর আইকন ক্লিক করে মোবাইল ফ্রেম বা ফুল স্ক্রিন দেখুন।</li>
                <li><strong className="text-white">অনবোর্ডিং (Age, Gender, Country):</strong> প্রোফাইল এডিট বাটনে চাপ দিয়ে বয়স, লিঙ্গ ও দেশ পরিবর্তন করুন (+1000 কয়েন বোনাস)।</li>
                <li><strong className="text-white">লাইভ স্ট্রিমিং ও ক্যামেরা:</strong> নিচের মাঝের "Go Live" এ ক্লিক করে আপনার নিজের মোবাইল বা কম্পিউটারের ক্যামেরা দিয়ে লাইভ চালু করুন!</li>
                <li><strong className="text-white">উপহার ও কয়েন (Gift System):</strong> যেকোনো লাইভ রুমে ঢুকে "🎁" বাটনে চাপ দিয়ে Rose, Car, Dragon ইত্যাদি উপহার পাঠান। সাথে সাথে কনফেটি অ্যানিমেশন ও লেভেল আপ দেখুন!</li>
                <li><strong className="text-white">লিডারবোর্ড ও রেংকিং:</strong> Ranking ট্যাবে গিয়ে দৈনিক স্টার ও টপ গিফটার দেখুন।</li>
                <li><strong className="text-white">অ্যাডমিন প্যানেল:</strong> উপরের "Shield" আইকন টিপে অ্যাডমিন থেকে ইউজার ব্যান বা কয়েন যুক্ত করুন।</li>
              </ul>
            </div>
          </div>
        )}

        {/* Content Section 3: Android APK Generation */}
        {activeStep === 3 && (
          <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
            <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-cyan-400 mb-1">
                <Smartphone className="w-4 h-4" />
                আপনার মোবাইলে APK ইন্সটল করার উপায়
              </h4>
              <p>
                এই প্রোজেক্টটিকে আপনার অ্যান্ড্রয়েড মোবাইলে সরাসরি অ্যাপ হিসেবে চালাতে নিচের ২টি সহজ পদ্ধতির যেকোনো একটি বেছে নিতে পারেন:
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800">
                <div className="font-bold text-white mb-1">
                  পদ্ধতি ১: ব্রাউজার থেকে সরাসরি "Install as App" (সবচেয়ে সহজ - ১ মিনিট)
                </div>
                <p className="text-neutral-400">
                  আপনার অ্যান্ড্রয়েড ফোনে Chrome ব্রাউজারে অ্যাপটির ডেভেলপমেন্ট বা প্রিভিউ লিংকটি ওপেন করুন। এরপর ব্রাউজারের ৩টি ডটে ক্লিক করে <strong>"Add to Home Screen" বা "Install App"</strong> চাপুন। এটি হুবহু মোবাইল অ্যাপের মতো হোমস্ক্রিনে অ্যাপ আইকন হয়ে বসে যাবে!
                </p>
              </div>

              <div className="p-3 bg-neutral-850 rounded-2xl border border-neutral-800">
                <div className="font-bold text-white mb-1">
                  পদ্ধতি ২: Capacitor দিয়ে আসল .APK ফাইল তৈরি (Google Play Store-এর জন্য)
                </div>
                <p className="text-neutral-400">
                  টার্মিনালে মাত্র ৩টি কমান্ড চালাতে হয়:
                </p>
                <div className="bg-neutral-950 p-2.5 rounded-xl font-mono text-[11px] text-pink-300 my-1 space-y-0.5">
                  <div>1. npm run build</div>
                  <div>2. npx cap add android</div>
                  <div>3. npx cap open android</div>
                </div>
                <p className="text-neutral-400">
                  এরপর Android Studio ওপেন হয়ে এক ক্লিকে .APK ফাইল বানিয়ে দেবে!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={() => setShowGuideModal(false)}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-bold text-xs shadow-lg shadow-pink-600/30 text-white"
          >
            বুঝেছি, অ্যাপ টেস্ট করি! 👍
          </button>
        </div>
      </div>
    </div>
  );
};
