import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Fallback guide if browser blocks automated prompt
      alert(
        'আপনার ফোনে ইনস্টল করতে:\n১. ব্রাউজারের ওপরের ডানদিকের ৩টি ডটে (⋮) চাপ দিন।\n২. "Install App" বা "Add to Home screen" নির্বাচন করুন।'
      );
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white px-3 py-2 flex items-center justify-between text-xs shadow-md border-b border-pink-400/30 relative z-30 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-extrabold flex items-center gap-1">
            <span>ফোনে Kotha App ইনস্টল করুন</span>
            <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">APK এর মতো</span>
          </div>
          <div className="text-[10px] text-pink-100">কোনো ডাউনলোড ছাড়াই সরাসরি হোম স্ক্রিনে চলবে</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1 rounded-full bg-white text-pink-600 font-extrabold text-[11px] shadow-md hover:bg-pink-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3 h-3 stroke-[2.5]" />
          <span>ইনস্টল করুন</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-pink-200 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
