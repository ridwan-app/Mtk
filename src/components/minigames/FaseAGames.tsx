import React, { useState, useEffect } from 'react';
import { MiniGame } from '../../types';
import { MiniGameQuestion, MINI_GAME_QUESTIONS, shuffleArray } from '../../data/mockMiniGamesData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Coins, RotateCcw, CheckCircle2, XCircle, Trophy, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';
import { KikoGameGuideHeader } from './KikoGameGuideHeader';

interface GameProps {
  game: MiniGame;
  onBack: () => void;
  onReward: (coins: number) => void;
}

// -------------------------------------------------------------
// 1. BALAP KARUNG (FASE A) - Horizontal 2-lane Sack Race Duel
// -------------------------------------------------------------
export const BalapKarungGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playerPos, setPlayerPos] = useState(0); // 0 to 5
  const [kikoPos, setKikoPos] = useState(0);     // 0 to 5
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);

  const targetSteps = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'bk-1',
    gameId: game.id,
    question: '7 + 5 = ...',
    options: [10, 11, 12, 13],
    answer: 12,
    explanation: '7 + 5 = 12.',
    visualDetail: '🍎🍎 + 🍎🍎🍎',
  };

  // Kiko AI jumps periodically
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setKikoPos((prev) => {
        if (prev + 1 >= targetSteps && playerPos < targetSteps) {
          setIsGameOver(true);
          setPlayerWon(false);
          soundManager.playWrong();
          return targetSteps;
        }
        return Math.min(prev + 1, targetSteps);
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [isGameOver, playerPos, targetSteps]);

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextPos = playerPos + 1;
      setPlayerPos(nextPos);

      if (nextPos >= targetSteps) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 30);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 800);
      // Opponent advances when player makes a mistake!
      setKikoPos((prev) => Math.min(prev + 1, targetSteps));
      if (kikoPos + 1 >= targetSteps) {
        setIsGameOver(true);
        setPlayerWon(false);
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setPlayerPos(0);
    setKikoPos(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
    setIsWobbling(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-orange-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
            🏃 Balap Karung Cilik
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 30} 🪙</span>
          </span>
        </div>

        {/* Kiko Guide on Right */}
        <KikoGameGuideHeader
          gameName="Balap Karung"
          guideText="Jawab operasi penjumlahan dengan cepat dan tepat untuk melompat sejauh 10 meter tiap soal. Jangan sampai lawanmu Kiko Garuda mencapai garis finish 50m duluan!"
        />
      </div>

      {/* 2-Lane Visual Race Track with Field & Flags */}
      <div className="bg-gradient-to-b from-amber-50 via-amber-100/70 to-emerald-100/80 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 relative overflow-hidden shadow-inner space-y-4">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-base">🏁</span>
            <span>Lintasan Balap Karung 50 Meter (Duel Lawan)</span>
          </div>
          <span className="bg-white/90 text-amber-900 px-3 py-1 rounded-full border border-amber-200 text-[11px]">
            {playerPos} / {targetSteps} Lompatan Kamu
          </span>
        </div>

        {/* Lane 1: Kiko Garuda (Opponent) */}
        <div className="bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-amber-200/80 space-y-1">
          <div className="flex justify-between text-[11px] font-heading font-black text-amber-900 px-1">
            <span>🦅 Lawan: Kiko Garuda (AI)</span>
            <span>{kikoPos * 10}m / 50m</span>
          </div>
          <div className="h-14 bg-amber-200/50 rounded-xl relative flex items-center px-3 border border-dashed border-amber-300 overflow-hidden">
            <div className="absolute right-4 top-0 bottom-0 w-3 bg-slate-300 flex items-center justify-center border-l border-r border-slate-700">
              <span className="text-xs">🏁</span>
            </div>
            <motion.div
              animate={{
                left: `${(kikoPos / targetSteps) * 80}%`,
                y: [0, -10, 0],
              }}
              transition={{
                left: { type: 'spring', stiffness: 200, damping: 15 },
                y: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
              }}
              className="absolute flex items-center space-x-1"
            >
              <div className="relative">
                <span className="text-2xl filter drop-shadow-xs">🦅</span>
                <span className="absolute -bottom-1 -right-1 text-xs">🥔</span>
              </div>
              <span className="text-[10px] font-heading font-black bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded shadow-2xs">
                Kiko
              </span>
            </motion.div>
          </div>
        </div>

        {/* Lane 2: Player Runner */}
        <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border-2 border-orange-300 space-y-1">
          <div className="flex justify-between text-[11px] font-heading font-black text-orange-950 px-1">
            <span className="flex items-center space-x-1">
              <span>👦 Jalur Kamu: Kapten Pilot Cilik</span>
              {isWobbling && <span className="text-rose-600 animate-bounce">⚠️ Karung Tergelincir!</span>}
            </span>
            <span>{playerPos * 10}m / 50m</span>
          </div>
          <div className="h-14 bg-orange-100/60 rounded-xl relative flex items-center px-3 border border-dashed border-orange-300 overflow-hidden">
            <div className="absolute right-4 top-0 bottom-0 w-3 bg-slate-300 flex items-center justify-center border-l border-r border-slate-700">
              <span className="text-xs">🏁</span>
            </div>
            <motion.div
              animate={{
                left: `${(playerPos / targetSteps) * 80}%`,
                y: isWobbling ? [0, 8, -4, 0] : [0, -14, 0],
                rotate: isWobbling ? [-12, 12, -8, 0] : 0,
              }}
              transition={{
                left: { type: 'spring', stiffness: 250, damping: 18 },
                y: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
              }}
              className="absolute flex items-center space-x-1"
            >
              <div className="relative">
                <span className="text-3xl filter drop-shadow-xs">🏃‍♂️</span>
                <span className="absolute -bottom-1 -right-1 text-sm">🥔</span>
              </div>
              <span className="text-[10px] font-heading font-black bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                Kamu
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Question / Victory */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-orange-800 bg-orange-100 px-3 py-0.5 rounded-full border border-orange-200">
              Soal #{currentIdx + 1} • Lompat Cepat!
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
            {currentQ.visualDetail && (
              <p className="text-xs text-slate-600 font-bold bg-amber-50 inline-block px-3 py-1 rounded-xl border border-amber-200">
                {currentQ.visualDetail}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800';
              if (isAnswered) {
                if (String(opt).trim() === String(currentQ.answer).trim()) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`p-3.5 rounded-2xl border-2 text-base font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && String(opt).trim() === String(currentQ.answer).trim() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div
                className={`p-3 rounded-2xl border max-w-md text-xs font-heading font-black ${
                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCorrect ? `🎉 Lompat 10 meter! ${currentQ.explanation}` : `❌ Karung tergelincir! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Lompat Lagi ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">{playerWon ? '🏆' : '💪'}</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            {playerWon ? 'Hore! Kamu Juara Balap Karung!' : 'Kiko Sampai Duluan!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {playerWon
              ? 'Lompatan dan hitungan kilatmu sukses membawamu melewati garis finish pertama!'
              : 'Jangan menyerah! Latih hitungan cepatmu dan tantang Kiko kembali!'}
          </p>
          {playerWon && (
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>+{game.rewardCoins || 30} Koin Didapatkan!</span>
            </div>
          )}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-orange text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tanding Ulang</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-amber-200 cursor-pointer"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. TARIK TAMBANG (FASE A) - Dynamic Rope Tug Duel with Tension
// -------------------------------------------------------------
export const TarikTambangGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ropePosition, setRopePosition] = useState(0); // -3 (Kiko wins) to +3 (Player wins), 0 is center
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const winTarget = 3;
  const currentQ = questionsList[currentIdx % questionsList.length] || {
    id: 'tt-1',
    question: 'Bandingkan: 18 ... 24',
    options: ['< (Lebih Kecil)', '> (Lebih Besar)', '= (Sama Dengan)'],
    answer: '< (Lebih Kecil)',
    explanation: '18 < 24',
  };

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextPos = ropePosition + 1;
      setRopePosition(nextPos);

      if (nextPos >= winTarget) {
        setIsGameOver(true);
        setPlayerWon(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 35);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      const nextPos = ropePosition - 1;
      setRopePosition(nextPos);

      if (nextPos <= -winTarget) {
        setIsGameOver(true);
        setPlayerWon(false);
        soundManager.playWrong();
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setRopePosition(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setPlayerWon(false);
    setRewardClaimed(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-indigo-100 text-indigo-950 px-3 py-1 rounded-full border border-indigo-300">
            🪢 Tarik Tambang Nusantara
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 35} 🪙</span>
          </span>
        </div>

        {/* Kiko Guide on Right */}
        <KikoGameGuideHeader
          gameName="Tarik Tambang"
          guideText="Bandingkan bilangan dengan benar untuk menarik pita merah tali tambang ke sisi Tim Kamu! Jawaban keliru akan memberi kekuatan pada Tim Lawan untuk menarik tali!"
        />
      </div>

      {/* Interactive Rope Tension Field */}
      <div className="bg-gradient-to-r from-blue-100 via-indigo-50 to-amber-100 rounded-3xl p-5 border-2 border-indigo-300 relative overflow-hidden space-y-4 shadow-inner">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="text-indigo-900 bg-white/80 px-2.5 py-1 rounded-lg border border-indigo-200">
            👦 Tim Kamu (Kiri)
          </span>
          <span className="text-[11px] bg-white px-3 py-1 rounded-full border border-slate-300 font-bold">
            Tarik pita merah melewati batas ({ropePosition > 0 ? `+${ropePosition}` : ropePosition})
          </span>
          <span className="text-amber-900 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
            🦅 Tim Kiko (Kanan)
          </span>
        </div>

        {/* Rope with Ribbon Visual */}
        <div className="h-28 bg-white/70 backdrop-blur-xs rounded-2xl border-2 border-indigo-200 relative flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute top-0 bottom-0 left-1/2 w-1 border-l-2 border-dashed border-slate-400 -translate-x-1/2 z-0" />
          <div className="absolute top-2 text-[10px] font-heading font-bold text-slate-400">Garis Tengah</div>

          {/* Left Player Character */}
          <motion.div
            animate={{
              x: ropePosition * -10,
              rotate: isAnswered && isCorrect ? [-5, -15, -5] : -5,
            }}
            className="absolute left-6 flex flex-col items-center z-10"
          >
            <span className="text-4xl filter drop-shadow-md">👦💪</span>
            <span className="text-[10px] font-heading font-black text-indigo-950 bg-indigo-100 px-1.5 py-0.5 rounded mt-1">
              Kamu
            </span>
          </motion.div>

          {/* Thick Rope */}
          <div className="w-full h-4 bg-amber-800 rounded-full relative shadow-sm border border-amber-950 flex items-center">
            <motion.div
              animate={{
                left: `${50 - ropePosition * 12}%`,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="absolute -top-3 transform -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-xl">🎀</span>
              <div className="w-2 h-6 bg-red-600 rounded-full shadow-xs" />
            </motion.div>
          </div>

          {/* Right Kiko Character */}
          <motion.div
            animate={{
              x: ropePosition * -10,
              rotate: isAnswered && !isCorrect ? [5, 15, 5] : 5,
            }}
            className="absolute right-6 flex flex-col items-center z-10"
          >
            <span className="text-4xl filter drop-shadow-md">🦅💥</span>
            <span className="text-[10px] font-heading font-black text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded mt-1">
              Kiko
            </span>
          </motion.div>
        </div>
      </div>

      {/* Interactive Comparison Selection */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-indigo-800 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-200">
              Tantangan #{currentIdx + 1} • Bandingkan Bilangan!
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800';
              if (isAnswered) {
                if (String(opt).trim() === String(currentQ.answer).trim()) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`p-3.5 rounded-2xl border-2 text-sm sm:text-base font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && String(opt).trim() === String(currentQ.answer).trim() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div
                className={`p-3 rounded-2xl border max-w-md text-xs font-heading font-black ${
                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCorrect ? `💪 Tarikan Kuat Berhasil! ${currentQ.explanation}` : `❌ Tali ditarik lawan! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Tarik Lagi ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-indigo-50 rounded-3xl border-2 border-indigo-300 p-6">
          <div className="text-6xl">{playerWon ? '🏆' : '🪢'}</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            {playerWon ? 'Hore! Tarik Tambang Dimenangkan!' : 'Kiko Menarik Tali Lebih Kuat!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {playerWon
              ? 'Kerja keras dan perbandingan bilanganmu yang akurat menarik pita merah ke sisi kemenangan!'
              : 'Kiko menang tipis kali ini. Ayo coba lagi dan rebut kembali talinya!'}
          </p>
          {playerWon && (
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>+{game.rewardCoins || 35} Koin Didapatkan!</span>
            </div>
          )}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-2xl btn-chunky-orange text-white font-heading font-black text-xs flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tanding Ulang</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-indigo-200 cursor-pointer"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. ENGKLEK ANGKA (FASE A) - Authentic Step-by-Step Hopscotch Grid
// -------------------------------------------------------------
export const EngklekAngkaGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeSquare, setActiveSquare] = useState(0); // 0 (start) to 5 (mountain peak)
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isStumbling, setIsStumbling] = useState(false);

  const totalSquares = 5;
  const currentQ = questionsList[currentIdx % questionsList.length] || {
    id: 'ea-1',
    question: 'Pola lompat: 2, 4, 6, 8, [ ? ]',
    options: [9, 10, 11, 12],
    answer: 10,
    explanation: '8 + 2 = 10',
  };

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextSquare = activeSquare + 1;
      setActiveSquare(nextSquare);

      if (nextSquare >= totalSquares) {
        setIsGameOver(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 35);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsStumbling(true);
      setTimeout(() => setIsStumbling(false), 800);
      // Penalty: step backward 1 square!
      setActiveSquare((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setActiveSquare(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsStumbling(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-emerald-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300">
            👣 Engklek Kotak Angka
          </span>
          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{game.rewardCoins || 35} 🪙</span>
          </span>
        </div>

        {/* Kiko Guide on Right */}
        <KikoGameGuideHeader
          gameName="Engklek Angka"
          guideText="Lompati kotak engklek menuju puncak gunung dengan menjawab pola bilangan! Awas jangan salah injak garis atau kamu akan tergelincir mundur 1 kotak!"
        />
      </div>

      {/* Hopscotch Field Visual */}
      <div className="bg-gradient-to-b from-amber-50 to-emerald-100 rounded-3xl p-5 border-2 border-emerald-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Lapang Engklek Tradisional</span>
            {isStumbling && <span className="text-rose-600 animate-bounce">⚠️ Injak Garis! Mundur 1 Kotak!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-emerald-200">
            Kotak Terlompati: {activeSquare} / {totalSquares}
          </span>
        </div>

        {/* Hopscotch Layout */}
        <div className="flex flex-col items-center space-y-2 py-2">
          {/* Peak Box */}
          <div
            className={`w-32 h-14 rounded-t-full border-2 flex items-center justify-center font-heading font-black text-sm transition-all ${
              activeSquare >= 5
                ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                : activeSquare === 4
                ? 'bg-amber-200 text-amber-950 border-amber-400 animate-pulse ring-2 ring-amber-300'
                : 'bg-white/80 text-slate-400 border-slate-300'
            }`}
          >
            {activeSquare >= 5 ? '👑 Puncak Gunung (5)' : '⛰️ Puncak (5)'}
          </div>

          {/* Double Wing Boxes */}
          <div className="flex space-x-2">
            <div
              className={`w-20 h-14 rounded-2xl border-2 flex items-center justify-center font-heading font-black text-sm transition-all ${
                activeSquare >= 4
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : activeSquare === 3
                  ? 'bg-amber-200 text-amber-950 border-amber-400 animate-pulse'
                  : 'bg-white/80 text-slate-400 border-slate-300'
              }`}
            >
              {activeSquare >= 4 ? '⭐ (4)' : 'Sayap (4)'}
            </div>
            <div
              className={`w-20 h-14 rounded-2xl border-2 flex items-center justify-center font-heading font-black text-sm transition-all ${
                activeSquare >= 3
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : activeSquare === 2
                  ? 'bg-amber-200 text-amber-950 border-amber-400 animate-pulse'
                  : 'bg-white/80 text-slate-400 border-slate-300'
              }`}
            >
              {activeSquare >= 3 ? '⭐ (3)' : 'Sayap (3)'}
            </div>
          </div>

          {/* Middle Box */}
          <div
            className={`w-24 h-14 rounded-2xl border-2 flex items-center justify-center font-heading font-black text-sm transition-all ${
              activeSquare >= 2
                ? 'bg-emerald-500 text-white border-emerald-600'
                : activeSquare === 1
                ? 'bg-amber-200 text-amber-950 border-amber-400 animate-pulse'
                : 'bg-white/80 text-slate-400 border-slate-300'
            }`}
          >
            {activeSquare >= 2 ? '⭐ (2)' : 'Tengah (2)'}
          </div>

          {/* Bottom Start Box */}
          <div
            className={`w-24 h-14 rounded-2xl border-2 flex items-center justify-center font-heading font-black text-sm transition-all ${
              activeSquare >= 1
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-amber-200 text-amber-950 border-amber-400 animate-pulse'
            }`}
          >
            {activeSquare >= 1 ? '⭐ (1)' : 'Mulai (1)'}
          </div>
        </div>
      </div>

      {/* Interactive Selection */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Lompatan #{currentIdx + 1} • Tebak Angka Kotak!
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-2xl border-2 text-base font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between ${
                  isAnswered
                    ? String(opt).trim() === String(currentQ.answer).trim()
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                      : selectedOption === opt
                      ? 'bg-rose-100 border-rose-400 text-rose-950'
                      : 'bg-slate-50 opacity-60 text-slate-400'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {isAnswered && String(opt).trim() === String(currentQ.answer).trim() && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div
                className={`p-3 rounded-2xl border max-w-md text-xs font-heading font-black ${
                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCorrect ? `👣 Lompat Berhasil! ${currentQ.explanation}` : `❌ Salah injak! Mundur 1 kotak. ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Lompat ke Kotak Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-emerald-50 rounded-3xl border-2 border-emerald-300 p-6">
          <div className="text-6xl">🏆</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Hebat! Kamu Mencapai Puncak Gunung Engklek!
          </h3>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>+{game.rewardCoins || 35} Koin Didapatkan!</span>
          </div>
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
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-emerald-200 cursor-pointer"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 4. ULAR NAGA (FASE A) - Pattern Dragon Gate Passage
// -------------------------------------------------------------
export const UlarNagaGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [unlockedGates, setUnlockedGates] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isGateSnapped, setIsGateSnapped] = useState(false);

  const targetGates = 5;
  const currentQ = questionsList[currentIdx % questionsList.length] || {
    id: 'un-1',
    question: 'Pola: 🔴 🔵 🔴 🔵 [ ? ]',
    options: ['🔴 (Merah)', '🔵 (Biru)', '🟡 (Kuning)'],
    answer: '🔴 (Merah)',
    explanation: 'Pola Merah-Biru bergantian.',
  };

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextGate = unlockedGates + 1;
      setUnlockedGates(nextGate);

      if (nextGate >= targetGates) {
        setIsGameOver(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 40);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsGateSnapped(true);
      setTimeout(() => setIsGateSnapped(false), 800);
      // Ekor naga tertangkap jika salah gerbang!
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setUnlockedGates(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsGateSnapped(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-rose-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-rose-100 text-rose-950 px-3 py-1 rounded-full border border-rose-300">
            🐉 Ular Naga Panjangnya
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 40} 🪙</span>
          </span>
        </div>

        {/* Kiko Guide on Right */}
        <KikoGameGuideHeader
          gameName="Ular Naga"
          guideText="Bantu barisan ular naga menerobos 5 gerbang naga dengan menebak kelanjutan pola warna dan bentuk! Hindari gerbang menutup agar ekor naga tidak tertangkap!"
        />
      </div>

      {/* Dragon Arch Gate Visual */}
      <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-amber-100 rounded-3xl p-5 border-2 border-rose-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Gerbang Kerajaan Ular Naga</span>
            {isGateSnapped && <span className="text-rose-600 animate-bounce">⚠️ Gerbang Menutup Cepat!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200">
            Gerbang Terbuka: {unlockedGates} / {targetGates}
          </span>
        </div>

        {/* Dragon Bridge and Kids Conga */}
        <div className="h-28 bg-white/75 backdrop-blur-xs rounded-2xl border-2 border-rose-200 relative flex items-center justify-between px-6 overflow-hidden">
          <div className="flex flex-col items-center">
            <span className="text-3xl">⛩️</span>
            <span className="text-[10px] font-heading font-black text-rose-950 bg-rose-200 px-2 py-0.5 rounded">
              Gerbang Naga
            </span>
          </div>

          {/* Lanterns for 5 Gates */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((gate) => (
              <div
                key={gate}
                className={`w-10 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-heading font-black text-xs transition-all ${
                  unlockedGates >= gate
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-white/70 text-slate-400 border-slate-300'
                }`}
              >
                <span>{unlockedGates >= gate ? '🏮' : '🔒'}</span>
                <span className="text-[9px]">G-{gate}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-2xl">🐉</span>
            <span className="text-xl">🏃</span>
          </div>
        </div>
      </div>

      {/* Interactive Selection */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-rose-800 bg-rose-100 px-3 py-0.5 rounded-full border border-rose-200">
              Gerbang #{currentIdx + 1} • Tebak Pola Lanjutan!
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-2xl border-2 text-base font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between ${
                  isAnswered
                    ? String(opt).trim() === String(currentQ.answer).trim()
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                      : selectedOption === opt
                      ? 'bg-rose-100 border-rose-400 text-rose-950'
                      : 'bg-slate-50 opacity-60 text-slate-400'
                    : 'bg-white hover:bg-rose-50 border-rose-200 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {isAnswered && String(opt).trim() === String(currentQ.answer).trim() && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div
                className={`p-3 rounded-2xl border max-w-md text-xs font-heading font-black ${
                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCorrect ? `✨ Gerbang Terbuka! ${currentQ.explanation}` : `❌ Gerbang tertutup! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Gerbang Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-rose-50 rounded-3xl border-2 border-rose-300 p-6">
          <div className="text-6xl">🐲✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Seluruh Gerbang Ular Naga Terbuka Sempurna!
          </h3>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>+{game.rewardCoins || 40} Koin Didapatkan!</span>
          </div>
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
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-rose-200 cursor-pointer"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 5. GOBAK SODOR (FASE A) - Grid Dodge Guard Crossing
// -------------------------------------------------------------
export const GobakSodorGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [passedLines, setPassedLines] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const targetLines = 5;
  const currentQ = questionsList[currentIdx % questionsList.length] || {
    id: 'gs-1',
    question: 'Pensil A (12 cm) vs Pensil B (8 cm). Mana lebih panjang?',
    options: ['Pensil A (12 cm)', 'Pensil B (8 cm)'],
    answer: 'Pensil A (12 cm)',
    explanation: '12 cm > 8 cm',
  };

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextLine = passedLines + 1;
      setPassedLines(nextLine);

      if (nextLine >= targetLines) {
        setIsGameOver(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 45);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 800);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setPassedLines(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsBlocked(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
            🛡️ Lapang Gobak Sodor
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Kiko Guide on Right */}
        <KikoGameGuideHeader
          gameName="Gobak Sodor"
          guideText="Terobos 5 garis penjagaan lawan dengan menjawab perbandingan ukuran panjang dengan tepat! Penjaga garis AI akan menghadang jika kamu salah hitung!"
        />
      </div>

      {/* Gobak Sodor 4-Zone Court Visual */}
      <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-5 border-2 border-amber-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Garis Pertahanan Penjaga (Lawan AI)</span>
            {isBlocked && <span className="text-rose-600 animate-bounce">⚠️ Terhadang Penjaga Garis!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-amber-300">
            Garis Diterobos: {passedLines} / {targetLines}
          </span>
        </div>

        {/* Court Layout */}
        <div className="h-32 bg-amber-200/60 rounded-2xl border-2 border-amber-400 relative flex items-center justify-between px-4 overflow-hidden">
          <div className="absolute right-3 top-2 bottom-2 w-12 bg-emerald-200/90 rounded-xl border border-emerald-400 flex flex-col items-center justify-center font-heading font-black text-[10px] text-emerald-950">
            <span>🏁</span>
            <span>Zona Aman</span>
          </div>

          {/* Guard Patrol Lines */}
          <div className="flex space-x-6 pl-14">
            {[1, 2, 3, 4, 5].map((line) => (
              <div key={line} className="relative flex flex-col items-center">
                <div className="w-1 h-24 bg-amber-600/80 rounded" />
                <motion.div
                  animate={{ y: [0, -25, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: line * 0.2 }}
                  className="absolute top-2 text-lg"
                >
                  💂
                </motion.div>
                <span className="text-[9px] font-heading font-bold text-amber-950">L-{line}</span>
              </div>
            ))}
          </div>

          {/* Player running through lines */}
          <motion.div
            animate={{
              left: `${10 + passedLines * 15}%`,
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute left-3 flex flex-col items-center"
          >
            <span className="text-3xl">🏃‍♂️💨</span>
            <span className="text-[9px] font-heading font-black bg-orange-500 text-white px-1 rounded">
              Kamu
            </span>
          </motion.div>
        </div>
      </div>

      {/* Interactive Selection */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Garis Pertahanan #{currentIdx + 1} • Bandingkan Panjang!
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-2xl border-2 text-base font-heading font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-between ${
                  isAnswered
                    ? String(opt).trim() === String(currentQ.answer).trim()
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                      : selectedOption === opt
                      ? 'bg-rose-100 border-rose-400 text-rose-950'
                      : 'bg-slate-50 opacity-60 text-slate-400'
                    : 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {isAnswered && String(opt).trim() === String(currentQ.answer).trim() && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div
                className={`p-3 rounded-2xl border max-w-md text-xs font-heading font-black ${
                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCorrect ? `💨 Lolos Garis Pertahanan! ${currentQ.explanation}` : `❌ Terhadang penjaga! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Terobos Garis Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">🏆🛡️</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Lolos Semua Garis! Juara Gobak Sodor!
          </h3>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>+{game.rewardCoins || 45} Koin Didapatkan!</span>
          </div>
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
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-amber-200 cursor-pointer"
            >
              Pilih Game Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
