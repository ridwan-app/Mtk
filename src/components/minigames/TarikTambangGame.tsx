import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Trophy, Coins, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface TarikTambangGameProps {
  onBack: () => void;
  onReward: (coins: number) => void;
}

interface CompareItem {
  leftExpr: string;
  leftVal: number;
  rightExpr: string;
  rightVal: number;
  correctSymbol: '>' | '<' | '=';
  explanation: string;
}

const TARIK_QUESTIONS: CompareItem[] = [
  { leftExpr: '4.500', leftVal: 4500, rightExpr: '4.050', rightVal: 4050, correctSymbol: '>', explanation: '4.500 lebih besar (>) daripada 4.050 karena ratusan 500 > 50.' },
  { leftExpr: '6 × 7', leftVal: 42, rightExpr: '45', rightVal: 45, correctSymbol: '<', explanation: '6 × 7 = 42, dan 42 lebih kecil (<) dari 45.' },
  { leftExpr: '2.300 + 1.200', leftVal: 3500, rightExpr: '3.500', rightVal: 3500, correctSymbol: '=', explanation: '2.300 + 1.200 = 3.500, bernilai sama (=).' },
  { leftExpr: '8 × 8', leftVal: 64, rightExpr: '70 - 6', rightVal: 64, correctSymbol: '=', explanation: '8 × 8 = 64 dan 70 - 6 = 64, bernilai sama (=).' },
  { leftExpr: '3.120', leftVal: 3120, rightExpr: '3.210', rightVal: 3210, correctSymbol: '<', explanation: '3.120 lebih kecil (<) daripada 3.210.' },
  { leftExpr: '9 × 5', leftVal: 45, rightExpr: '40 + 6', rightVal: 46, correctSymbol: '<', explanation: '9 × 5 = 45, lebih kecil (<) dari 46.' },
  { leftExpr: '5.000 - 1.500', leftVal: 3500, rightExpr: '3.000', rightVal: 3000, correctSymbol: '>', explanation: '3.500 lebih besar (>) daripada 3.000.' },
];

export const TarikTambangGame: React.FC<TarikTambangGameProps> = ({ onBack, onReward }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ropeScore, setRopeScore] = useState(0); // -3 (opponent wins) to +3 (player wins)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const currentQ = TARIK_QUESTIONS[currentIdx % TARIK_QUESTIONS.length];

  const handleSelect = (symbol: '>' | '<' | '=') => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedSymbol(symbol);
    setIsAnswered(true);

    const isCorrect = symbol === currentQ.correctSymbol;

    if (isCorrect) {
      soundManager.playCorrect();
      const nextRope = ropeScore + 1;
      setRopeScore(nextRope);

      if (nextRope >= 3) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(35);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      const nextRope = ropeScore - 1;
      setRopeScore(nextRope);

      if (nextRope <= -3) {
        setIsGameOver(true);
        setPlayerWon(false);
      }
    }
  };

  const handleNext = () => {
    setSelectedSymbol(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setRopeScore(0);
    setSelectedSymbol(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-indigo-200 shadow-lg space-y-6 max-w-4xl mx-auto">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-heading font-black text-slate-600 hover:text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Game</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-heading font-black bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-300">
            🪢 Kategori: Aljabar (Bandingkan Nilai)
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hadiah: +35 Koin</span>
          </span>
        </div>
      </div>

      {/* Tug of War Interactive Rope Arena */}
      <div className="bg-gradient-to-r from-blue-100/70 via-indigo-50/50 to-rose-100/70 rounded-2xl p-4 sm:p-6 border-2 border-indigo-300 relative overflow-hidden space-y-4">
        
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-indigo-800 bg-white/80 px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
            🔵 Regu Kamu (Kiri)
          </span>
          <span className="text-slate-600 bg-white/90 px-3 py-0.5 rounded-full border border-slate-300">
            Tarik Tali 3 Kali ke Sisi Kamu untuk Menang!
          </span>
          <span className="text-rose-800 bg-white/80 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
            🔴 Regu Lawan (Kanan)
          </span>
        </div>

        {/* The Rope Tension Graphic */}
        <div className="relative py-6 flex items-center justify-center">
          {/* Thick Rope */}
          <div className="w-full h-4 bg-amber-800/80 rounded-full border-2 border-amber-950 relative overflow-hidden flex items-center">
            <div className="w-full h-1 bg-amber-600/60" />
          </div>

          {/* Center Marker Line */}
          <div className="absolute h-14 w-0.5 bg-slate-400 border-dashed border-l border-slate-600 z-0" />

          {/* Red Ribbon Indicator moving with ropeScore */}
          <motion.div
            animate={{ x: `${ropeScore * -45}px` }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute z-10 flex flex-col items-center"
          >
            <span className="text-2xl filter drop-shadow-md">🎀</span>
            <span className="text-[10px] font-heading font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-md shadow-xs">
              Pita
            </span>
          </motion.div>

          {/* Left Team Characters */}
          <div className="absolute left-2 flex items-center space-x-1 text-2xl filter drop-shadow-xs">
            <span>🧒</span>
            <span>👧</span>
            <span>👦</span>
          </div>

          {/* Right Team Characters */}
          <div className="absolute right-2 flex items-center space-x-1 text-2xl filter drop-shadow-xs">
            <span>🦊</span>
            <span>🐻</span>
            <span>🐯</span>
          </div>
        </div>

        {/* Rope Score Progress */}
        <div className="flex justify-between items-center text-xs font-heading font-black px-2">
          <span className="text-indigo-700">Skor Tarikan: {Math.max(0, ropeScore)}/3</span>
          <span className="text-rose-700">Skor Lawan: {Math.max(0, -ropeScore)}/3</span>
        </div>

      </div>

      {/* Comparison Question Arena */}
      {!isGameOver ? (
        <div className="space-y-5">
          <div className="text-center">
            <span className="text-xs font-heading font-black text-indigo-700 uppercase tracking-widest block">
              Tantangan Bandingkan Angka #{currentIdx + 1}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Bandingkan sisi kiri dan kanan dengan memilih simbol yang benar!
            </p>
          </div>

          {/* Comparison Cards (Left Box vs Right Box) */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-6">
            
            {/* Left Expression Card */}
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-4 sm:p-6 text-center min-w-[120px] sm:min-w-[160px] shadow-xs">
              <span className="text-[10px] font-heading font-black text-indigo-700 block mb-1">
                Sisi Kiri
              </span>
              <span className="text-xl sm:text-2xl font-heading font-black text-indigo-950">
                {currentQ.leftExpr}
              </span>
            </div>

            {/* Middle Selected Symbol Placeholder */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl font-heading font-black text-amber-900 shadow-inner">
              {selectedSymbol || '?'}
            </div>

            {/* Right Expression Card */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-6 text-center min-w-[120px] sm:min-w-[160px] shadow-xs">
              <span className="text-[10px] font-heading font-black text-rose-700 block mb-1">
                Sisi Kanan
              </span>
              <span className="text-xl sm:text-2xl font-heading font-black text-rose-950">
                {currentQ.rightExpr}
              </span>
            </div>

          </div>

          {/* Symbol Choice Buttons: >, =, < */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto pt-2">
            {(['>', '=', '<'] as const).map((sym) => {
              const isSelected = selectedSymbol === sym;
              let btnColor = 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800';

              if (isAnswered) {
                if (sym === currentQ.correctSymbol) {
                  btnColor = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnColor = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnColor = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              const labelMap: Record<string, string> = {
                '>': 'Lebih Besar ( > )',
                '=': 'Sama Dengan ( = )',
                '<': 'Lebih Kecil ( < )',
              };

              return (
                <button
                  key={sym}
                  disabled={isAnswered}
                  onClick={() => handleSelect(sym)}
                  className={`p-3 sm:p-4 rounded-2xl border-2 font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex flex-col items-center justify-center space-y-1 ${btnColor}`}
                >
                  <span className="text-2xl sm:text-3xl">{sym}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-full">
                    {labelMap[sym]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {isAnswered && (
            <div className="flex flex-col items-center space-y-3 pt-2 text-center">
              <p className={`text-xs font-heading font-black ${selectedSymbol === currentQ.correctSymbol ? 'text-emerald-700' : 'text-rose-600'}`}>
                {selectedSymbol === currentQ.correctSymbol
                  ? '🎉 Tarikan Hebat! Tali bergerak ke regumu!'
                  : `❌ Lawan menarik balik! ${currentQ.explanation}`}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-indigo text-white font-heading font-black text-xs cursor-pointer shadow-md"
              >
                Ronde Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Result */
        <div className="text-center py-6 space-y-4 bg-indigo-50 rounded-2xl border-2 border-indigo-300 p-6">
          <div className="text-5xl">{playerWon ? '🏆' : '💪'}</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            {playerWon ? 'Luar Biasa! Regumu Memenangkan Tarik Tambang!' : 'Regu Lawan Lebih Kuat Kali Ini!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {playerWon
              ? 'Analisis perbandingan aljabarmu sangat tajam! Kamu dihadiahi 35 Koin Aviasi!'
              : 'Jangan putus asa! Latih perbandingan angka dan tarik kembali talinya!'}
          </p>

          {playerWon && (
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl font-heading font-black text-sm">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>+35 Koin Emas Masuk ke Kantongmu!</span>
            </div>
          )}

          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-indigo text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tanding Ulang</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs cursor-pointer border border-indigo-200"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
