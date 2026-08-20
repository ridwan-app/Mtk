import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Trophy, Coins, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface PanjatPinangGameProps {
  onBack: () => void;
  onReward: (coins: number) => void;
}

interface MeasurementQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const PINANG_QUESTIONS: MeasurementQuestion[] = [
  {
    question: '1 meter sama dengan berapa centimeter (cm)?',
    options: ['10 cm', '100 cm', '1.000 cm', '50 cm'],
    answer: 1, // 100 cm
    explanation: '1 m = 100 cm. Naik 1 tingkat!',
  },
  {
    question: '2 kilogram (kg) beras sama dengan berapa gram (g)?',
    options: ['200 g', '500 g', '2.000 g', '20.000 g'],
    answer: 2, // 2.000 g
    explanation: '1 kg = 1.000 g, jadi 2 kg = 2.000 g.',
  },
  {
    question: '1 jam terdiri dari berapa menit?',
    options: ['30 menit', '50 menit', '60 menit', '100 menit'],
    answer: 2, // 60 menit
    explanation: '1 jam = 60 menit.',
  },
  {
    question: 'Sebuah tali panjangnya 350 cm. Berapa meter dan centimeter tali itu?',
    options: ['3 m 50 cm', '35 m 0 cm', '3 m 5 cm', '5 m 30 cm'],
    answer: 0, // 3 m 50 cm
    explanation: '350 cm = 300 cm + 50 cm = 3 m 50 cm.',
  },
];

export const PanjatPinangGame: React.FC<PanjatPinangGameProps> = ({ onBack, onReward }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [climbLevel, setClimbLevel] = useState(0); // 0 to 4 levels
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const targetClimb = 4;
  const currentQ = PINANG_QUESTIONS[currentIdx % PINANG_QUESTIONS.length];

  const handleSelect = (idx: number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answer;

    if (isCorrect) {
      soundManager.playCorrect();
      const nextLevel = climbLevel + 1;
      setClimbLevel(nextLevel);

      if (nextLevel >= targetClimb) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(45);
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
    setClimbLevel(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-lg space-y-6 max-w-4xl mx-auto">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-heading font-black text-slate-600 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Game</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-heading font-black bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-300">
            🎋 Kategori: Pengukuran (Panjang & Berat)
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hadiah: +45 Koin</span>
          </span>
        </div>
      </div>

      {/* Interactive Pinang Climbing Pole Arena */}
      <div className="bg-gradient-to-b from-sky-200/60 via-amber-50/50 to-emerald-100/60 rounded-2xl p-4 sm:p-6 border-2 border-rose-300 relative overflow-hidden space-y-3">
        
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-rose-800 bg-white/80 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
            🎁 Hadiah Puncak: Sepeda & Piala Emas
          </span>
          <span className="text-slate-600 bg-white/90 px-3 py-0.5 rounded-full border border-slate-300">
            Tinggi Panjatan: {climbLevel} / {targetClimb} Tingkat
          </span>
          <span className="text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            🚩 Bendera Merah Putih
          </span>
        </div>

        {/* The Greased Pole */}
        <div className="relative h-44 flex items-center justify-center">
          
          {/* Top Prizes Wheel */}
          <div className="absolute top-0 flex items-center space-x-2 bg-amber-200/90 px-4 py-1 rounded-full border-2 border-amber-400 z-10 shadow-xs">
            <span className="text-xl">🚲</span>
            <span className="text-xl">🏆</span>
            <span className="text-xl">🎒</span>
            <span className="text-xl">🎁</span>
            <span className="text-xl">🇮🇩</span>
          </div>

          {/* Bamboo Trunk */}
          <div className="w-6 h-full bg-amber-700 rounded-full border-2 border-amber-900 flex flex-col justify-between py-2 items-center">
            <div className="w-full h-1 bg-amber-900/40" />
            <div className="w-full h-1 bg-amber-900/40" />
            <div className="w-full h-1 bg-amber-900/40" />
          </div>

          {/* Climber Character positioned according to climbLevel */}
          <motion.div
            animate={{ bottom: `${(climbLevel / targetClimb) * 70}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="absolute text-4xl filter drop-shadow-md"
          >
            🧗‍♂️
          </motion.div>

        </div>

      </div>

      {/* Question & Options */}
      {!isGameOver ? (
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-heading font-black text-rose-700 uppercase tracking-widest block">
              Tantangan Pengukuran #{currentIdx + 1}
            </span>
            <h3 className="text-lg sm:text-xl font-heading font-black text-slate-800 mt-1 max-w-xl mx-auto leading-snug">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Pilih satuan yang tepat untuk memanjat 1 tingkat ke atas!
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnColor = 'bg-white hover:bg-rose-50 border-rose-200 text-slate-800';

              if (isAnswered) {
                if (idx === currentQ.answer) {
                  btnColor = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnColor = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnColor = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`p-3.5 rounded-2xl border-2 font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between text-sm sm:text-base ${btnColor}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.answer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {isAnswered && isSelected && idx !== currentQ.answer && (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {isAnswered && (
            <div className="flex flex-col items-center space-y-3 pt-2 text-center">
              <p className={`text-xs font-heading font-black ${selectedOption === currentQ.answer ? 'text-emerald-700' : 'text-rose-600'}`}>
                {selectedOption === currentQ.answer
                  ? '🎉 Mantap! Berhasil memanjat lebih tinggi!'
                  : `❌ Tergelincir sedikit! ${currentQ.explanation}`}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-rose text-white font-heading font-black text-xs cursor-pointer shadow-md"
              >
                Tantangan Panjat Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Result */
        <div className="text-center py-6 space-y-4 bg-rose-50 rounded-2xl border-2 border-rose-300 p-6">
          <div className="text-5xl">🏆 🎁 🎋</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Hore! Berhasil Mencapai Puncak Pinang!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Semua hadiah berhasil diraih berkat ketelitianmu mengukur satuan! Kamu mendapatkan 45 Koin Aviasi!
          </p>

          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>+45 Koin Emas Ditambahkan!</span>
          </div>

          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-rose text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Panjat Lagi</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs cursor-pointer border border-rose-200"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
