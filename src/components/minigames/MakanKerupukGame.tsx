import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Trophy, Coins, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface MakanKerupukGameProps {
  onBack: () => void;
  onReward: (coins: number) => void;
}

interface KerupukQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  shapeEmoji: string;
}

const KERUPUK_QUESTIONS: KerupukQuestion[] = [
  {
    question: 'Berapa pecahan dari kerupuk yang terbelah menjadi 4 bagian dan kamu memakan 1 bagian?',
    options: ['1/2', '1/4', '3/4', '2/4'],
    answer: 1, // 1/4
    explanation: '1 bagian dari total 4 potongan yang sama besar adalah pecahan 1/4.',
    shapeEmoji: '🍘',
  },
  {
    question: 'Bangun datar kerupuk bulat yang tidak memiliki sudut sama sekali adalah...',
    options: ['Segitiga', 'Persegi', 'Lingkaran', 'Trapesium'],
    answer: 2, // Lingkaran
    explanation: 'Lingkaran memiliki garis lengkung tertutup dan 0 sudut!',
    shapeEmoji: '⭕',
  },
  {
    question: 'Kerupuk kotak dipotong diagonal menjadi 2 bagian. Setiap bagian berbentuk bangun...',
    options: ['Segitiga Siku-Siku', 'Lingkaran', 'Persegi Panjang', 'Segi Enam'],
    answer: 0, // Segitiga Siku-Siku
    explanation: 'Memotong persegi diagonal menghasilkan 2 buah segitiga siku-siku yang sama besar!',
    shapeEmoji: '📐',
  },
  {
    question: 'Pecahan 2/4 bagian kerupuk sama luasnya dengan...',
    options: ['1/3', '1/2 (Setengah)', '1/4', '3/4'],
    answer: 1, // 1/2
    explanation: '2/4 bagian senilai dengan 1/2 (setengah kerupuk).',
    shapeEmoji: '🥪',
  },
  {
    question: 'Sudut pada pojok kerupuk persegi membentuk sudut sebesar 90 derajat yang dinamakan...',
    options: ['Sudut Lancip', 'Sudut Tumpul', 'Sudut Siku-Siku', 'Sudut Lurus'],
    answer: 2, // Sudut Siku-Siku
    explanation: 'Sudut 90 derajat dinamakan sudut siku-siku!',
    shapeEmoji: '🟩',
  },
];

export const MakanKerupukGame: React.FC<MakanKerupukGameProps> = ({ onBack, onReward }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bitesTaken, setBitesTaken] = useState(0); // 0 to 4 bites to eat whole cracker
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const totalBitesNeeded = 4;
  const currentQ = KERUPUK_QUESTIONS[currentIdx % KERUPUK_QUESTIONS.length];

  const handleSelect = (idx: number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answer;

    if (isCorrect) {
      soundManager.playCorrect();
      const nextBites = bitesTaken + 1;
      setBitesTaken(nextBites);

      if (nextBites >= totalBitesNeeded) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(40);
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
    setBitesTaken(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
  };

  // Cracker graphic based on bites taken
  const crackerVisual = () => {
    switch (bitesTaken) {
      case 0:
        return '🍘'; // Full cracker
      case 1:
        return '🧇'; // 1/4 bitten
      case 2:
        return '🥐'; // Half eaten
      case 3:
        return '🥨'; // Small bite left
      case 4:
      default:
        return '✨ (Habis Dimakan!)';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-lg space-y-6 max-w-4xl mx-auto">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-heading font-black text-slate-600 hover:text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Game</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
            🍘 Kategori: Geometri & Pecahan
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hadiah: +40 Koin</span>
          </span>
        </div>
      </div>

      {/* Interactive Kerupuk String Arena */}
      <div className="bg-gradient-to-b from-sky-100/70 via-emerald-50/50 to-amber-50/70 rounded-2xl p-4 sm:p-6 border-2 border-emerald-300 relative overflow-hidden space-y-4">
        
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            🧵 Tali Kerupuk Bergoyang
          </span>
          <span className="text-slate-600 bg-white/90 px-3 py-0.5 rounded-full border border-slate-300">
            Gigitan Kerupuk: {bitesTaken} / {totalBitesNeeded} Gigitan
          </span>
          <span className="text-amber-800 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
            😋 Nyam Nyam!
          </span>
        </div>

        {/* The Hanging Cracker on String */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          {/* Top Hanging Bar */}
          <div className="w-48 h-2 bg-amber-900 rounded-full border border-amber-950 mb-1" />

          {/* Hanging String with Sway Animation */}
          <motion.div
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center origin-top"
          >
            {/* String Line */}
            <div className="w-0.5 h-16 bg-slate-600" />

            {/* Cracker on End of String */}
            <motion.div
              key={bitesTaken}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-6xl sm:text-7xl filter drop-shadow-lg cursor-pointer select-none"
            >
              {crackerVisual()}
            </motion.div>
          </motion.div>

          {/* Kid Mouth below reaching */}
          <div className="mt-2 text-3xl">
            😋
          </div>
        </div>

        {/* Progress Bar of Cracker Eaten */}
        <div className="w-full bg-emerald-100 rounded-full h-3.5 border border-emerald-300 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(bitesTaken / totalBitesNeeded) * 100}%` }}
          />
        </div>

      </div>

      {/* Question & Options */}
      {!isGameOver ? (
        <div className="space-y-5">
          <div className="text-center">
            <span className="text-xs font-heading font-black text-emerald-700 uppercase tracking-widest block">
              Tantangan Gigitan #{currentIdx + 1}
            </span>
            <h3 className="text-lg sm:text-xl font-heading font-black text-slate-800 mt-1 max-w-xl mx-auto leading-snug">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Jawab benar untuk menggigit sepotong kerupuk gurih!
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnColor = 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-800';

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
                  <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>
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
                  ? '🎉 KRIUK! Gigitan lezat berhasil didapat!'
                  : `❌ Kerupuk bergoyang menjauh! ${currentQ.explanation}`}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-teal text-white font-heading font-black text-xs cursor-pointer shadow-md"
              >
                Gigitan Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Result */
        <div className="text-center py-6 space-y-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6">
          <div className="text-5xl">🏆 😋</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Kriuk! Kerupuk Habis Tak Tersisa!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Hebat sekali! Pemahaman geometri dan pecahanmu sangat memuaskan. Kamu mendapatkan 40 Koin Aviasi!
          </p>

          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>+40 Koin Emas Ditambahkan!</span>
          </div>

          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-teal text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Makan Kerupuk Lagi</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs cursor-pointer border border-emerald-200"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
