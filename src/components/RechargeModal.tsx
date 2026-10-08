import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Check, X, ShieldCheck, Zap } from 'lucide-react';

export const RechargeModal: React.FC = () => {
  const { showRechargeModal, setShowRechargeModal, currentUser, rechargeCoins } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!showRechargeModal) return null;

  const packages = [
    { coins: 300, price: '$0.99', popular: false, bonus: 0 },
    { coins: 1000, price: '$2.99', popular: true, bonus: 100 },
    { coins: 3500, price: '$9.99', popular: false, bonus: 500 },
    { coins: 8000, price: '$19.99', popular: false, bonus: 1500 },
    { coins: 25000, price: '$49.99', popular: false, bonus: 5000 },
    { coins: 60000, price: '$99.99', popular: false, bonus: 15000 },
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    const pkg = packages.find(p => p.coins === selectedPackage);
    const totalCoins = pkg ? pkg.coins + pkg.bonus : selectedPackage;

    setTimeout(() => {
      rechargeCoins(totalCoins);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl relative">
        <button
          type="button"
          onClick={() => setShowRechargeModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recharge Coins (কয়েন কিনুন)</h3>
            <p className="text-xs text-neutral-400">
              Current Balance: <span className="text-amber-400 font-mono font-bold">{currentUser.coins.toLocaleString()} 🪙</span>
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          {packages.map(pkg => {
            const isSelected = selectedPackage === pkg.coins;
            return (
              <button
                key={pkg.coins}
                type="button"
                onClick={() => setSelectedPackage(pkg.coins)}
                className={`relative p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-neutral-800/80 border-neutral-700/80 hover:border-neutral-600'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                    POPULAR
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🪙</span>
                  <div className="font-bold text-sm text-white font-mono">
                    {pkg.coins.toLocaleString()}
                  </div>
                </div>

                {pkg.bonus > 0 && (
                  <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-0.5 mt-0.5">
                    <Zap className="w-2.5 h-2.5" />
                    +{pkg.bonus.toLocaleString()} Bonus
                  </div>
                )}

                <div className="text-xs font-semibold text-neutral-300 mt-2">
                  {pkg.price}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-xl text-[10px] text-neutral-400 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Google Play / App Store Secure Simulation. Instant delivery.</span>
        </div>

        <button
          type="button"
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          {isProcessing ? (
            <span>Processing Recharge...</span>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm Recharge Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
