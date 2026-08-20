import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Coins, RotateCcw, ArrowLeft, Zap, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface BalapKarungGameProps {
  onBack: () => void;
  onReward: (coins: number) => void;
}

interface QuestionItem {
  question: string;
  options: number[];
  answer: number;
  explanation: string;
}

const BALAP_QUESTIONS: QuestionItem[] = [
  { question: '15 + 25 = ...', options: [35, 40, 45, 50], answer: 40, explanation: '15 + 25 = 40 (Lompat 1 langkah maju!)' },
  { question: '7 × 6 = ...', options: [40, 42, 48, 54], answer: 42, explanation: '7 × 6 = 42' },
  { question: '100 - 35 = ...', options: [55, 65, 75, 85], answer: 65, explanation: '100 - 35 = 65' },
  { question: '8 × 4 = ...', options: [24, 28, 32, 36], answer: 32, explanation: '8 × 4 = 32' },
  { question: '50 + 75 = ...', options: [115, 125, 135, 145], answer: 125, explanation: '50 + 75 = 125' },
  { question: '45 ÷ 5 = ...', options: [7, 8, 9, 10], answer: 9, explanation: '45 ÷ 5 = 9' },
  { question: '30 + 170 = ...', options: [190, 200, 210, 220], answer: 200, explanation: '30 + 170 = 200' },
  { question: '9 × 8 = ...', options: [64, 72, 81, 90], answer: 72, explanation: '9 × 8 = 72' },
];

export const BalapKarungGame: React.FC<BalapKarungGameProps> = ({ onBack, onReward }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playerPos, setPlayerPos] = useState(0); // 0 to 5 steps to reach finish line
  const [opponentPos, setOpponentPos] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const targetSteps = 5;
  const currentQ = BALAP_QUESTIONS[currentIdx % BALAP_QUESTIONS.length];

  // Opponent periodically jumps
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setOpponentPos((prev) => {
        if (prev + 1 >= targetSteps) {
          setIsGameOver(true);
          setPlayerWon(false);
          soundManager.playWrong();
          return targetSteps;
        }
        return prev + 1;
      });
    }, 7000); // jumps every 7s

    return () => clearInterval(interval);
  }, [isGameOver, targetSteps]);

  const handleSelect = (val: number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const correct = val === currentQ.answer;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      const nextPos = playerPos + 1;
      setPlayerPos(nextPos);

      if (nextPos >= targetSteps) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(30);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setPlayerPos(0);
    setOpponentPos(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-lg space-y-6 max-w-4xl mx-auto">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-heading font-black text-slate-600 hover:text-orange-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Game</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-heading font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            🏃 Kategori: Bilangan (Hitung Kilat)
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hadiah: +30 Koin</span>
          </span>
        </div>
      </div>

      {/* Race Track Arena */}
      <div className="bg-gradient-to-b from-amber-100/60 to-orange-100/60 rounded-2xl p-4 sm:p-6 border-2 border-amber-300 relative overflow-hidden space-y-4">
        
        {/* Track Info */}
        <div className="flex justify-between items-center text-xs font-heading font-black text-amber-900">
          <span>🚩 Garis Start</span>
          <span className="bg-white/80 px-2.5 py-0.5 rounded-lg border border-amber-300">
            Capai 5 Lompatan Menuju Garis Finish!
          </span>
          <span>🏁 Garis Finish</span>
        </div>

        {/* Player Lane */}
        <div className="bg-white/80 p-3 rounded-xl border border-amber-300 space-y-1">
          <div className="flex justify-between text-xs font-heading font-bold text-slate-700">
            <span className="flex items-center space-x-1">
              <span>Kamu (Pemain Cilik)</span>
              <span className="text-orange-600">🏃‍♂️</span>
            </span>
            <span>{playerPos} / {targetSteps} Langkah</span>
          </div>

          <div className="h-10 bg-amber-100 rounded-xl relative flex items-center px-2 overflow-hidden border border-amber-200">
            <div
              className="absolute h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg transition-all duration-500"
              style={{ width: `${(playerPos / targetSteps) * 100}%` }}
            />
            <motion.div
              animate={{ x: `${(playerPos / targetSteps) * 350}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative z-10 text-2xl flex items-center justify-center filter drop-shadow-md"
            >
              🏃‍♂️💨
            </motion.div>
          </div>
        </div>

        {/* Opponent Lane */}
        <div className="bg-white/60 p-3 rounded-xl border border-amber-200 space-y-1">
          <div className="flex justify-between text-xs font-heading font-bold text-slate-500">
            <span className="flex items-center space-x-1">
              <span>Lawan (Koko Kelinci)</span>
              <span>🐰</span>
            </span>
            <span>{opponentPos} / {targetSteps} Langkah</span>
          </div>

          <div className="h-8 bg-slate-100 rounded-xl relative flex items-center px-2 overflow-hidden border border-slate-200">
            <div
              className="absolute h-full bg-slate-300 rounded-lg transition-all duration-700"
              style={{ width: `${(opponentPos / targetSteps) * 100}%` }}
            />
            <motion.div
              animate={{ x: `${(opponentPos / targetSteps) * 350}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative z-10 text-xl"
            >
              🐰
            </motion.div>
          </div>
        </div>

      </div>

      {/* Game Content / Quiz */}
      {!isGameOver ? (
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-xs font-heading font-black text-amber-700 uppercase tracking-widest block">
              Teka-Teki Lompatan #{currentIdx + 1}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-800 mt-1">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Pilih jawaban yang benar secepatnya untuk melompat maju!
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800';

              if (isAnswered) {
                if (opt === currentQ.answer) {
                  btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`p-4 rounded-2xl border-2 text-lg sm:text-xl font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center space-x-2 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && opt === currentQ.answer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {isAnswered && isSelected && opt !== currentQ.answer && (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="flex flex-col items-center space-y-3 pt-2">
              <p className={`text-xs font-heading font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isCorrect ? '🎉 Benar! Lompat 1 langkah maju!' : `❌ Kurang tepat! ${currentQ.explanation}`}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs cursor-pointer shadow-md"
              >
                Soal Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Result */
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-2xl border-2 border-amber-300 p-6">
          <div className="text-5xl">{playerWon ? '🏆' : '😅'}</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            {playerWon ? 'Selamat! Kamu Menang Balap Karung!' : 'Hampir Saja! Lawan Sampai Duluan!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {playerWon
              ? 'Lompatan dan hitungan matematika kamu sangat lincah! Kamu mendapatkan 30 Koin Aviasi!'
              : 'Jangan menyerah! Ayo coba lagi dan kalahkan waktu lawan dengan hitungan yang lebih cepat.'}
          </p>

          {playerWon && (
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl font-heading font-black text-sm">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>+30 Koin Emas Ditambahkan ke Dompetmu!</span>
            </div>
          )}

          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-orange text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs cursor-pointer border border-amber-200"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
