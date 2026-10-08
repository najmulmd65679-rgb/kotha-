import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Dices, Layers, Sparkles, Coins, Trophy, RefreshCw } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const LiveGamesModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, rechargeCoins } = useApp();
  const [activeGame, setActiveGame] = useState<'ludo' | 'card'>('ludo');
  const [betCoins, setBetCoins] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Ludo State
  const [diceRoll, setDiceRoll] = useState<number>(6);
  const [chosenNumber, setChosenNumber] = useState<number>(6);

  // Card Game State
  const [cards, setCards] = useState<string[]>(['🂡', '🂮', '🂭']);

  const playLudo = () => {
    if (currentUser.coins < betCoins) {
      alert('Insufficient virtual coins! Please recharge coins.');
      return;
    }
    setIsPlaying(true);
    setGameResult(null);

    // Animate rolling
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(finalRoll);
        setIsPlaying(false);

        if (finalRoll === chosenNumber) {
          const reward = betCoins * 3;
          rechargeCoins(reward);
          setGameResult(`🎉 BINGO! Lucky ${finalRoll} matched! You won +${reward} Virtual Coins!`);
        } else {
          setGameResult(`Rolled ${finalRoll}. Better luck next roll!`);
        }
      }
    }, 100);
  };

  const playCardGame = () => {
    if (currentUser.coins < betCoins) {
      alert('Insufficient virtual coins! Please recharge coins.');
      return;
    }
    setIsPlaying(true);
    setGameResult(null);

    const deck = ['🂡', '🂮', '🂭', '🂫', '🂪', '🂩', '🂨', '🂧', '🂦', '🂥', '🂤', '🂣', '🂢'];
    let flips = 0;
    const interval = setInterval(() => {
      setCards([
        deck[Math.floor(Math.random() * deck.length)],
        deck[Math.floor(Math.random() * deck.length)],
        deck[Math.floor(Math.random() * deck.length)],
      ]);
      flips++;
      if (flips > 8) {
        clearInterval(interval);
        const finalCards = [
          deck[Math.floor(Math.random() * deck.length)],
          deck[Math.floor(Math.random() * deck.length)],
          deck[Math.floor(Math.random() * deck.length)],
        ];
        setCards(finalCards);
        setIsPlaying(false);

        const isWin = Math.random() > 0.45;
        if (isWin) {
          const reward = betCoins * 2;
          rechargeCoins(reward);
          setGameResult(`🏆 Winning Hand! High combination won +${reward} Virtual Coins!`);
        } else {
          setGameResult(`Hand scored lower. Try another virtual hand!`);
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl relative animate-in slide-in-from-bottom duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Live Room Mini-Games (🎮)</span>
            </h3>
            <p className="text-[10px] text-neutral-400">Virtual coin fun only • No real-money betting</p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveGame('ludo');
              setGameResult(null);
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeGame === 'ludo'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Lucky Ludo Dice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveGame('card');
              setGameResult(null);
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeGame === 'card'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lucky 3 Cards</span>
          </button>
        </div>

        {/* GAME 1: LUDO LUCKY ROLL */}
        {activeGame === 'ludo' && (
          <div className="space-y-3 p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-300">Choose your lucky number (1 - 6):</div>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setChosenNumber(n)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                    chosenNumber === n
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Rolling Dice Display */}
            <div className="py-2 flex justify-center">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-pink-600 to-amber-500 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-xl ${
                  isPlaying ? 'animate-spin' : ''
                }`}
              >
                {diceRoll}
              </div>
            </div>

            <button
              type="button"
              onClick={playLudo}
              disabled={isPlaying}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-bold text-xs text-white shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {isPlaying ? 'Rolling...' : `Roll Dice (${betCoins} 🪙)`}
            </button>
          </div>
        )}

        {/* GAME 2: LUCKY 3 CARDS */}
        {activeGame === 'card' && (
          <div className="space-y-3 p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-300">Virtual Teen Patti Hand Draw:</div>
            <div className="flex justify-center gap-2 py-2">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className={`w-14 h-20 bg-neutral-800 rounded-xl border border-amber-500/40 flex items-center justify-center text-4xl shadow-md ${
                    isPlaying ? 'animate-bounce' : ''
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={playCardGame}
              disabled={isPlaying}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90 font-bold text-xs text-white shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {isPlaying ? 'Drawing Cards...' : `Draw 3 Cards (${betCoins} 🪙)`}
            </button>
          </div>
        )}

        {/* Result Message */}
        {gameResult && (
          <div className="p-2.5 mt-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-bold text-purple-200 text-center animate-in zoom-in-95">
            {gameResult}
          </div>
        )}

        {/* Virtual Coin Balance Footer */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-800 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Balance: {currentUser.coins.toLocaleString()} 🪙</span>
          </div>

          <div className="flex gap-1 text-[10px]">
            {[50, 100, 500].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setBetCoins(amt)}
                className={`px-2 py-0.5 rounded-lg font-mono font-bold ${
                  betCoins === amt ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
