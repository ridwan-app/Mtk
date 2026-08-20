import React, { useState } from 'react';
import { MiniGame } from '../../types';
import { MiniGameQuestion, MINI_GAME_QUESTIONS, shuffleArray } from '../../data/mockMiniGamesData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Coins,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  Wind,
  Castle,
  Dices,
  Store,
  Clock,
  Compass,
  CircleDot,
  Scale,
  ShoppingBag,
} from 'lucide-react';
import { KikoGameGuideHeader } from './KikoGameGuideHeader';

interface GameProps {
  game: MiniGame;
  onBack: () => void;
  onReward: (coins: number) => void;
}

// -------------------------------------------------------------
// 1. CONGKLAK HITUNG (FASE B) - Traditional Wooden Board Duel
// -------------------------------------------------------------
export const CongklakHitungGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playerShells, setPlayerShells] = useState(0);
  const [kikoShells, setKikoShells] = useState(0);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isShellSteal, setIsShellSteal] = useState(false);

  const targetShells = 35; // 7 shells * 5 rounds
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'ch-1',
    gameId: game.id,
    question: '7 × 6 = ... 🐚',
    options: [36, 40, 42, 48],
    answer: 42,
    explanation: '7 × 6 = 42. Masukkan 7 biji congklak ke lumbungmu!',
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
      setActiveHole(currentIdx % 7);
      const nextShells = playerShells + 7;
      setPlayerShells(nextShells);

      if (nextShells >= targetShells) {
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
      setIsShellSteal(true);
      setTimeout(() => setIsShellSteal(false), 900);
      // Kiko AI takes 7 shells to his storehouse!
      setKikoShells((prev) => prev + 7);
      if (kikoShells + 7 >= targetShells) {
        setIsGameOver(true);
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveHole(null);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuestionsList(shuffleArray(MINI_GAME_QUESTIONS[game.id] || []));
    setCurrentIdx(0);
    setPlayerShells(0);
    setKikoShells(0);
    setActiveHole(null);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsShellSteal(false);
  };

  const playerWon = playerShells >= targetShells;

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
            🐚 Congklak Perkalian & Pembagian
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 35} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Congklak Hitung"
          guideText="Isi lumbung congklakmu dengan menjawab operasi perkalian secara tepat! Setiap jawaban benar menambah 7 biji ke lumbungmu. Jika keliru, biji masuk ke lumbung Kiko!"
        />
      </div>

      {/* Visual Congklak Board */}
      <div className="bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 rounded-3xl p-5 border-4 border-amber-700 relative shadow-2xl space-y-4 text-amber-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-amber-200 flex items-center space-x-1">
            <span>🪵 Papan Kayu Jati Ukir Nusantara</span>
            {isShellSteal && <span className="text-rose-400 animate-bounce">⚠️ Giliran Menembak Biji Jatuh ke Kiko!</span>}
          </span>
          <span className="bg-amber-950/90 text-amber-200 px-3 py-1 rounded-full border border-amber-600 text-[11px]">
            Target Penuh: {targetShells} Biji Kerang
          </span>
        </div>

        {/* Authentic Carved Congklak Board with 2 Big Storehouses & 14 Small Pits */}
        <div className="bg-amber-900/90 p-4 rounded-2xl border-2 border-amber-700 flex items-center justify-between gap-2 shadow-inner overflow-x-auto">
          {/* Left Lumbung (Kiko Opponent Storehouse) */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-heading font-black text-amber-300">Lumbung Kiko</span>
            <div className="w-16 h-28 rounded-3xl bg-amber-950 border-2 border-amber-600 flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-xl">🐚</span>
              <span className="text-sm font-heading font-black text-amber-300">{kikoShells}</span>
              <span className="text-[9px] text-amber-400">Biji</span>
            </div>
          </div>

          {/* 2 Rows of 7 Small Pits (14 Lubang Kecil) */}
          <div className="flex-1 flex flex-col gap-2 max-w-xl">
            {/* Top Row (Kiko Pits) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`top-${i}`}
                  className="h-10 sm:h-12 rounded-full bg-amber-950/80 border border-amber-700/80 flex items-center justify-center text-[10px] text-amber-400 shadow-inner"
                >
                  🐚 {7}
                </div>
              ))}
            </div>

            {/* Bottom Row (Player Pits) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const isActive = activeHole === i;
                return (
                  <motion.div
                    key={`bottom-${i}`}
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={`h-10 sm:h-12 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-inner ${
                      isActive
                        ? 'bg-amber-400 border-amber-200 text-amber-950 font-black ring-2 ring-yellow-300'
                        : 'bg-amber-950 border-amber-600 text-amber-200'
                    }`}
                  >
                    🐚 {7}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Lumbung (Player Storehouse) */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-heading font-black text-yellow-300">Lumbungmu</span>
            <div className="w-16 h-28 rounded-3xl bg-amber-950 border-2 border-yellow-500 flex flex-col items-center justify-center p-2 shadow-inner ring-1 ring-yellow-400">
              <span className="text-xl">🐚</span>
              <span className="text-sm font-heading font-black text-yellow-300">{playerShells}</span>
              <span className="text-[9px] text-yellow-400">Biji</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Putaran Lumbung #{currentIdx + 1}
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
                {isCorrect ? `🐚 7 Biji masuk ke lumbungmu! ${currentQ.explanation}` : `❌ Kurang tepat! 7 Biji masuk ke lumbung Kiko. ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Putaran Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">{playerWon ? '🐚👑' : '💪'}</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            {playerWon ? 'Lumbung Congklak Penuh! Kamu Menang!' : 'Kiko Mengisi Lumbung Lebih Cepat!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {playerWon
              ? 'Kerja bagus! Perhitungan perkalianmu sukses mengumpulkan seluruh biji congklak ke lumbung pribadimu!'
              : 'Jangan menyerah! Ayo latih kembali perkalian dan kalahkan Kiko di ronde berikutnya!'}
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
// 2. LAYANG-LAYANG PECAHAN (FASE B) - Kite Soaring & Altitude Climbing/Falling
// -------------------------------------------------------------
export const LayangLayangPecahanGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [altitude, setAltitude] = useState(100); // 100m to 500m
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  const targetAltitude = 500;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'll-1',
    gameId: game.id,
    question: 'Pecahan senilai dengan 1/2 adalah ... 🪁',
    options: ['2/4', '1/3', '2/5', '3/8'],
    answer: '2/4',
    explanation: '1/2 = 2/4. Layang-layang naik +100m!',
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
      const nextAlt = Math.min(targetAltitude, altitude + 100);
      setAltitude(nextAlt);

      if (nextAlt >= targetAltitude) {
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
      setIsDropping(true);
      setTimeout(() => setIsDropping(false), 900);
      // REAL PENALTY: Kite drops altitude on incorrect answer!
      setAltitude((prev) => Math.max(50, prev - 75));
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
    setAltitude(100);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsDropping(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-sky-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header with Kiko Guide aligned on Right */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-sky-600 bg-sky-50 px-3 py-2 rounded-xl border border-sky-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-sky-100 text-sky-950 px-3 py-1 rounded-full border border-sky-300">
            🪁 Layang-Layang Pecahan
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 40} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Layang-Layang Pecahan"
          guideText="Cocokkan pecahan senilai untuk menerbangkan layang-layang semakin tinggi ke langit 500m! Hati-hati, jika salah jawab angin akan menurun dan layang-layang merosot turun -75m!"
        />
      </div>

      {/* Sky Canvas Visual */}
      <div className="bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 rounded-3xl p-5 border-2 border-sky-300 relative shadow-inner space-y-3 h-56 flex flex-col justify-between overflow-hidden">
        {/* Clouds & Wind */}
        <div className="flex justify-between items-center text-xs font-heading font-black text-white drop-shadow-xs z-10">
          <span className="flex items-center space-x-1">
            <Wind className="w-4 h-4 animate-spin" />
            <span>Langit Nusantara (Terbangkan Layangan)</span>
            {isDropping && <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-bounce">⚠️ Angin Turun! Layangan Merosot -75m!</span>}
          </span>
          <span className="bg-white/90 text-sky-900 px-3 py-1 rounded-full border border-sky-300 font-bold">
            Ketinggian: {altitude}m / {targetAltitude}m
          </span>
        </div>

        {/* Kite in the clouds */}
        <motion.div
          animate={{
            y: (500 - altitude) * -0.22,
            x: isDropping ? [0, -25, 25, 0] : [0, 10, -10, 0],
            rotate: isDropping ? [0, -20, 20, 0] : [0, 5, -5, 0],
          }}
          transition={{
            y: { type: 'spring', stiffness: 150 },
            x: { repeat: Infinity, duration: isDropping ? 0.4 : 3, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: isDropping ? 0.4 : 2, ease: 'easeInOut' },
          }}
          className="absolute right-1/3 top-16 flex flex-col items-center"
        >
          <span className="text-5xl filter drop-shadow-lg">🪁</span>
          <div className="w-0.5 h-20 bg-slate-300/80 -rotate-12 origin-top" />
          <span className="text-[10px] font-heading font-black bg-white/90 text-sky-900 px-2 py-0.5 rounded-full border border-sky-200 shadow-xs">
            {altitude} Meter
          </span>
        </motion.div>

        {/* Ground Runner */}
        <div className="flex justify-between items-end z-10">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-sky-200 text-xs font-heading font-bold text-sky-950">
            <span>🏃‍♂️ Pengendali Benang</span>
          </div>
          <div className="text-xs font-heading font-bold text-sky-900 bg-white/80 px-2.5 py-1 rounded-xl border border-sky-200">
            Puncak: 500 Meter (Awan Putih)
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-sky-900 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
              Tantangan Angin #{currentIdx + 1}
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
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-slate-800'
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
                {isCorrect ? `🪁 Terbang Melambung +100m! ${currentQ.explanation}` : `❌ Angin turun! Layang-layang merosot -75m. ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Tarik Ulur Lagi ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-sky-50 rounded-3xl border-2 border-sky-300 p-6">
          <div className="text-6xl">🪁☁️✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Layang-layang Mencapai Ketinggian Tertinggi 500 Meter!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Hore! Angin pecahan senilaimu sukses membawa layang-layangmu menembus awan tertinggi!
          </p>
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
              <span>Terbangkan Lagi</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-sky-200 cursor-pointer"
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
// 3. BENTENGAN BANGUN DATAR (FASE B) - Castle Defense Duel
// -------------------------------------------------------------
export const BentenganBangunDatarGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [capturedFlags, setCapturedFlags] = useState(0); // 0 to 5
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isRepelled, setIsRepelled] = useState(false);

  const targetFlags = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'bb-1',
    gameId: game.id,
    question: 'Persegi panjang p=8 cm, l=5 cm. Luasnya = ... cm² 📐',
    options: [13, 26, 40, 48],
    answer: 40,
    explanation: 'Luas = 8 × 5 = 40 cm²',
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
      const nextFlags = capturedFlags + 1;
      setCapturedFlags(nextFlags);

      if (nextFlags >= targetFlags) {
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
      setIsRepelled(true);
      setTimeout(() => setIsRepelled(false), 800);
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
    setCapturedFlags(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsRepelled(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header with Kiko Guide aligned on Right */}
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
            🏰 Bentengan Bangun Datar
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Bentengan Bangun Datar"
          guideText="Hitung keliling dan luas bangun datar untuk menyerbu dan merebut 5 tiang benteng lawan! Hati-hati penjaga benteng Kiko akan menolak serbuan jika salah hitung!"
        />
      </div>

      {/* 2 Castle Arenas Visual */}
      <div className="bg-gradient-to-r from-red-100 via-indigo-50 to-blue-100 rounded-3xl p-5 border-2 border-indigo-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Benteng Merah (Kamu) vs Benteng Biru (Kiko)</span>
            {isRepelled && <span className="text-rose-600 animate-bounce">⚠️ Serangan Tertahan Benteng Lawan!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-indigo-200">
            Tiang Direbut: {capturedFlags} / {targetFlags}
          </span>
        </div>

        {/* Field with Castle Walls and Charging Knight */}
        <div className="h-32 bg-white/75 backdrop-blur-xs rounded-2xl border-2 border-indigo-200 relative flex items-center justify-between px-6 overflow-hidden">
          {/* Player Fortress Left */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">🏰🔴</span>
            <span className="text-[10px] font-heading font-black text-red-900 bg-red-100 px-2 py-0.5 rounded">
              Bentengmu
            </span>
          </div>

          {/* Running Knight */}
          <motion.div
            animate={{
              left: `${20 + capturedFlags * 12}%`,
              x: isRepelled ? [-15, 5, 0] : 0,
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute flex flex-col items-center"
          >
            <span className="text-3xl">🏃‍♂️⚔️</span>
            <span className="text-[9px] font-heading font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded">
              Ksatria
            </span>
          </motion.div>

          {/* Opponent Fortress Right */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">🏰🔵</span>
            <span className="text-[10px] font-heading font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
              Benteng Kiko
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-200">
              Serangan Benteng #{capturedFlags + 1}
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
                    : 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800'
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
                {isCorrect ? `🚩 Tiang Benteng Lawan Berhasil Direbut! ${currentQ.explanation}` : `❌ Serangan tertahan benteng lawan! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Serbu Tiang Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-indigo-50 rounded-3xl border-2 border-indigo-300 p-6">
          <div className="text-6xl">🏰🚩✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Benteng Lawan Berhasil Direbut Sempurna!
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
// 4. PETAK JONGKOK DATA (FASE B) - Chart Reader & Crouch Defense
// -------------------------------------------------------------
export const PetakJongkokDataGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [safeRounds, setSafeRounds] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isTagged, setIsTagged] = useState(false);

  const targetRounds = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'pj-1',
    gameId: game.id,
    question: 'Tabel Buah: Apel (8 anak), Jeruk (12 anak), Mangga (5 anak). Buah apa yang paling banyak disukai? 📊',
    options: ['Jeruk (12 anak)', 'Apel (8 anak)', 'Mangga (5 anak)', 'Semua Sama'],
    answer: 'Jeruk (12 anak)',
    explanation: 'Jeruk memiliki peminat terbanyak yaitu 12 anak.',
  };

  // Dynamic chart data matching the active question
  const getChartData = (qId: string) => {
    if (qId === 'pj-1' || qId === 'pj-2') {
      return {
        title: '📊 Diagram Batang: Buah Kesukaan Siswa',
        items: [
          { label: 'Apel', count: 8, heightPercent: 66, color: 'bg-rose-500', emoji: '🍎' },
          { label: 'Jeruk', count: 12, heightPercent: 100, color: 'bg-amber-500', emoji: '🍊' },
          { label: 'Mangga', count: 5, heightPercent: 42, color: 'bg-emerald-500', emoji: '🥭' },
        ],
      };
    } else if (qId === 'pj-3' || qId === 'pj-4') {
      return {
        title: '📊 Diagram Batang: Penjualan Tiket',
        items: [
          { label: 'Senin', count: 15, heightPercent: 60, color: 'bg-sky-500', emoji: '📅' },
          { label: 'Selasa', count: 25, heightPercent: 100, color: 'bg-indigo-500', emoji: '📅' },
          { label: 'Rabu', count: 20, heightPercent: 80, color: 'bg-purple-500', emoji: '📅' },
        ],
      };
    } else if (qId === 'pj-5' || qId === 'pj-10') {
      return {
        title: '📊 Diagram Batang: Perolehan Nilai Siswa',
        items: [
          { label: 'Nilai 70', count: 4, heightPercent: 57, color: 'bg-blue-500', emoji: '📝' },
          { label: 'Nilai 80', count: 7, heightPercent: 100, color: 'bg-emerald-500', emoji: '📝' },
          { label: 'Nilai 90', count: 5, heightPercent: 71, color: 'bg-amber-500', emoji: '📝' },
        ],
      };
    } else if (qId === 'pj-6') {
      return {
        title: '📚 Piktogram: Peminjaman Buku (1 📚 = 5 buku)',
        items: [
          { label: '4 Simbol 📚', count: '4 × 5', heightPercent: 80, color: 'bg-indigo-500', emoji: '📚' },
          { label: 'Total', count: 20, heightPercent: 100, color: 'bg-emerald-500', emoji: '📖' },
        ],
      };
    } else if (qId === 'pj-7') {
      return {
        title: '🎨 Diagram Batang: Siswa Ekstrakurikuler',
        items: [
          { label: 'Menari', count: 6, heightPercent: 60, color: 'bg-rose-500', emoji: '💃' },
          { label: 'Menyanyi', count: 9, heightPercent: 90, color: 'bg-amber-500', emoji: '🎤' },
          { label: 'Melukis', count: 10, heightPercent: 100, color: 'bg-purple-500', emoji: '🎨' },
        ],
      };
    } else if (qId === 'pj-8') {
      return {
        title: '🏊 Diagram Batang: Peminat Olahraga',
        items: [
          { label: 'Futsal', count: 14, heightPercent: 100, color: 'bg-emerald-500', emoji: '⚽' },
          { label: 'Basket', count: 8, heightPercent: 57, color: 'bg-orange-500', emoji: '🏀' },
          { label: 'Renang', count: 6, heightPercent: 43, color: 'bg-cyan-500', emoji: '🏊' },
        ],
      };
    } else if (qId === 'pj-9') {
      return {
        title: '⭐ Piktogram: Perolehan Bintang (1 ⭐ = 10 Poin)',
        items: [
          { label: '6 Simbol ⭐', count: '6 × 10', heightPercent: 85, color: 'bg-amber-500', emoji: '⭐' },
          { label: 'Total Poin', count: 60, heightPercent: 100, color: 'bg-yellow-500', emoji: '🏆' },
        ],
      };
    } else {
      return {
        title: '📊 Diagram Batang: Data Siswa',
        items: [
          { label: 'Data A', count: 6, heightPercent: 60, color: 'bg-blue-500', emoji: '📊' },
          { label: 'Data B', count: 10, heightPercent: 100, color: 'bg-emerald-500', emoji: '📊' },
        ],
      };
    }
  };

  const chartData = getChartData(currentQ.id);

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextSafe = safeRounds + 1;
      setSafeRounds(nextSafe);

      if (nextSafe >= targetRounds) {
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
      setIsTagged(true);
      setTimeout(() => setIsTagged(false), 800);
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
    setSafeRounds(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsTagged(false);
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
            📊 Petak Jongkok Diagram Data
          </span>
          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Petak Jongkok Data"
          guideText="Baca diagram batang dan tabel data dengan tepat! Jawaban benar membuatmu jongkok aman dan selamat dari kejaran lawan!"
        />
      </div>

      {/* Field Visual */}
      <div className="bg-gradient-to-b from-emerald-100 via-teal-50 to-green-100 rounded-3xl p-5 border-2 border-emerald-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Arena Kejar-Kejaran Petak Jongkok</span>
            {isTagged && <span className="text-rose-600 animate-bounce">⚠️ Terlambat Jongkok! Nyaris Tertangkap!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-emerald-200 font-bold">
            Jongkok Aman: {safeRounds} / {targetRounds}
          </span>
        </div>

        {/* Arena with Dynamic Bar Chart Display */}
        <div className="h-40 bg-white/90 backdrop-blur-xs rounded-2xl border-2 border-emerald-200 p-3 flex items-center justify-between relative overflow-hidden">
          {/* Visual Mini Chart Bars & Title */}
          <div className="flex flex-col justify-end h-full pl-2">
            <span className="text-[10px] font-heading font-black text-emerald-950 mb-1">
              {chartData.title}
            </span>
            <div className="flex items-end space-x-4 h-24">
              {chartData.items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-heading font-black text-slate-700 mb-0.5">
                    {item.count}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.heightPercent * 0.58}px` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`w-9 sm:w-11 ${item.color} rounded-t-lg shadow-sm border-t border-x border-white/60`}
                  />
                  <span className="text-[9px] font-heading font-bold mt-1 text-slate-800 flex items-center space-x-0.5">
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crouching / Running Character */}
          <div className="pr-6 flex flex-col items-center">
            <span className="text-4xl filter drop-shadow-md">
              {isAnswered && isCorrect ? '🧘‍♂️ (Aman!)' : '🏃‍♂️ (Lari!)'}
            </span>
            <span className="text-[10px] font-heading font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded mt-1">
              {isAnswered && isCorrect ? 'Posisi Jongkok' : 'Menghindar Lawan'}
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Analisis Data #{currentIdx + 1}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
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
                {isCorrect ? `🧘‍♂️ Jongkok Tepat Waktu! ${currentQ.explanation}` : `❌ Terkena sentuhan! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Ronde Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-emerald-50 rounded-3xl border-2 border-emerald-300 p-6">
          <div className="text-6xl">📊👑🏆</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Hebat! Berhasil Lolos Dari Seluruh Kejaran Lawan!
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
// 5. EGRANG BILANGAN BULAT (FASE B) - Number Line & Bamboo Stilts
// -------------------------------------------------------------
export const EgrangBilanganBulatGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stiltPosition, setStiltPosition] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);

  const targetFinish = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'eb-1',
    gameId: game.id,
    question: 'Posisi awal 2. Melangkah mundur 5 langkah. Posisi sekarang: 2 - 5 = ... 🎋',
    options: [-3, -2, 3, 7],
    answer: -3,
    explanation: '2 - 5 = -3 pada garis bilangan.',
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
      const nextPos = stiltPosition + 1;
      setStiltPosition(nextPos);

      if (nextPos >= targetFinish) {
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
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 800);
      setStiltPosition((prev) => Math.max(-3, prev - 1));
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
    setStiltPosition(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
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
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
            🎋 Egrang Bilangan Bulat
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Egrang Bilangan Bulat"
          guideText="Jaga keseimbangan di atas egrang bambu! Langkah positif maju ke kanan, langkah negatif mundur ke kiri pada garis bilangan!"
        />
      </div>

      {/* Number Line Visual with Bamboo Stilts */}
      <div className="bg-gradient-to-b from-amber-100 to-orange-100 rounded-3xl p-5 border-2 border-amber-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Garis Bilangan Egrang Bambu</span>
            {isWobbling && <span className="text-rose-600 animate-bounce">⚠️ Egrang Goyang! Hilang Keseimbangan!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-amber-300">
            Posisi Egrang: [{stiltPosition > 0 ? `+${stiltPosition}` : stiltPosition}]
          </span>
        </div>

        {/* Horizontal Bamboo Number Line */}
        <div className="h-32 bg-white/80 backdrop-blur-xs rounded-2xl border-2 border-amber-200 relative flex items-center justify-between px-6">
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div className={`w-0.5 ${num === 0 ? 'h-6 bg-red-600 w-1' : 'h-3 bg-slate-400'}`} />
              <span className={`text-[10px] font-heading font-bold mt-1 ${num === 0 ? 'text-red-600 font-black' : 'text-slate-600'}`}>
                {num}
              </span>
            </div>
          ))}

          {/* Stilt Walker on Number Line */}
          <motion.div
            animate={{
              left: `${50 + stiltPosition * 8}%`,
              rotate: isWobbling ? [-15, 15, -10, 0] : 0,
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-4xl filter drop-shadow-md">🎋🏃</span>
            <span className="text-[9px] font-heading font-black bg-amber-700 text-white px-1.5 py-0.5 rounded">
              Egrang
            </span>
          </motion.div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Langkah Egrang #{currentIdx + 1}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
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
                {isCorrect ? `🎋 Langkah Seimbang! ${currentQ.explanation}` : `❌ Egrang goyah mundur 1 langkah! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Langkah Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">🎋🏆✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Luar Biasa! Egrang Sampai Garis Akhir Seimbang!
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

// -------------------------------------------------------------
// 6. DAM-DAMAN PEMBAGIAN (FASE B) - Traditional Checkers Duel
// -------------------------------------------------------------
export const DamDamanPembagianGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState(0); // 0 to 5
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [animatingJump, setAnimatingJump] = useState(false);

  const targetPieces = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'ddp-1',
    gameId: game.id,
    question: '42 ÷ 6 = ... ♟️',
    options: [6, 7, 8, 9],
    answer: 7,
    explanation: '42 ÷ 6 = 7. Bidak putih melompat memakan bidak lawan!',
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
      setAnimatingJump(true);
      setTimeout(() => setAnimatingJump(false), 800);

      const nextPieces = capturedPieces + 1;
      setCapturedPieces(nextPieces);

      if (nextPieces >= targetPieces) {
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
    setCapturedPieces(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
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
            ♟️ Dam-Daman Pembagian Nusantara
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Dam-Daman Pembagian"
          guideText="Hitung pembagian dengan teliti! Jawaban tepat membuat bidak putihmu melompati dan memakan bidak hitam milik Kiko AI!"
        />
      </div>

      {/* Dam-Daman Board Visual */}
      <div className="bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 rounded-3xl p-5 border-4 border-amber-700 relative shadow-2xl space-y-3 text-amber-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-amber-200">Papan Dam-Daman Tradisional (Duel Bidak)</span>
          <span className="bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600 text-amber-200">
            Bidak Lawan Dimakan: {capturedPieces} / {targetPieces}
          </span>
        </div>

        {/* Board Canvas */}
        <div className="h-44 bg-amber-950/90 rounded-2xl border-2 border-amber-600/60 relative flex items-center justify-between px-6 overflow-hidden">
          <div className="flex flex-col items-center space-y-1 z-10">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-amber-400 flex items-center justify-center text-xl shadow-lg">
              ⚪
            </div>
            <span className="text-[10px] font-heading font-black text-amber-200">Bidakmu (Putih)</span>
          </div>

          <div className="flex-1 px-4 relative flex items-center justify-center">
            <div className="w-full h-1 bg-amber-600/60 absolute" />
            <div className="w-1 h-28 bg-amber-600/60 absolute" />
            <div className="w-32 h-32 border border-amber-500/40 rotate-45 absolute" />

            <motion.div
              animate={
                animatingJump
                  ? {
                      x: [0, 60, 120],
                      y: [0, -35, 0],
                      scale: [1, 1.4, 1],
                    }
                  : { x: capturedPieces * 20 }
              }
              transition={{ duration: 0.7 }}
              className="z-20 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center text-lg shadow-xl">
                ⚪
              </div>
              <span className="text-[9px] font-heading font-bold bg-amber-800 text-amber-200 px-1 rounded mt-0.5">
                Maju
              </span>
            </motion.div>
          </div>

          <div className="flex flex-col items-center space-y-1 z-10">
            <div className="flex -space-x-2">
              {[...Array(Math.max(0, targetPieces - capturedPieces))].map((_, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-slate-900 border-2 border-amber-600 flex items-center justify-center text-sm shadow-md"
                >
                  ⚫
                </div>
              ))}
              {capturedPieces === targetPieces && (
                <span className="text-xs font-heading font-bold text-emerald-400">Habis! 👑</span>
              )}
            </div>
            <span className="text-[10px] font-heading font-black text-amber-300">Bidak Kiko (Hitam)</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Gerakan Bidak #{capturedPieces + 1} • Pembagian
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
                {isCorrect ? `♟️ Bidak Lawan Dimakan! ${currentQ.explanation}` : `❌ ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Gerakan Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">♟️👑✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Skakmat! Semua Bidak Lawan Berhasil Dimakan!
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

// -------------------------------------------------------------
// 7. GASING SIMETRI (FASE B) - Spinning Top & Geometric Symmetry
// -------------------------------------------------------------
export const GasingSimetriGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rpm, setRpm] = useState(200); // 200 to 1000 RPM
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);

  const targetRpm = 1000;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'gs-1',
    gameId: game.id,
    question: 'Berapa jumlah sumbu simetri lipat pada Persegi? 🌀🟩',
    options: [2, 3, 4, 6],
    answer: 4,
    explanation: 'Persegi memiliki 4 sumbu simetri lipat.',
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
      const nextRpm = Math.min(targetRpm, rpm + 160);
      setRpm(nextRpm);

      if (nextRpm >= targetRpm) {
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
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 800);
      // Top slows down on mistake!
      setRpm((prev) => Math.max(100, prev - 120));
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
    setRpm(200);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsWobbling(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-cyan-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-cyan-600 bg-cyan-50 px-3 py-2 rounded-xl border border-cyan-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-cyan-100 text-cyan-950 px-3 py-1 rounded-full border border-cyan-300">
            🌀 Gasing Simetri & Refleksi
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Gasing Simetri"
          guideText="Tentukan sumbu simetri lipat dan putar dengan tepat untuk memacu gasing berputar seimbang hingga 1000 RPM! Jika salah hitung, gasing akan bergoyang dan melambat!"
        />
      </div>

      {/* Spinning Arena Visual */}
      <div className="bg-gradient-to-b from-cyan-900 via-sky-800 to-indigo-950 rounded-3xl p-5 border-4 border-cyan-600 relative shadow-2xl space-y-3 text-cyan-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-cyan-200 flex items-center space-x-1">
            <span>Arena Gasing Kayu Tradisional Melayu</span>
            {isWobbling && <span className="text-rose-400 animate-bounce">⚠️ Gasing Oleng! Kecepatan Berkurang -120 RPM!</span>}
          </span>
          <span className="bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-400 text-yellow-300 font-bold">
            Kecepatan Putaran: {rpm} / {targetRpm} RPM
          </span>
        </div>

        {/* Center Disc with Spinning Top & Symmetry Silhouette */}
        <div className="h-44 bg-cyan-950/80 rounded-2xl border-2 border-cyan-500/50 relative flex items-center justify-around px-6 overflow-hidden">
          <div className="flex flex-col items-center bg-cyan-900/60 p-3 rounded-2xl border border-cyan-400/40">
            <span className="text-[10px] font-heading font-bold text-cyan-300 mb-1">Pola Geometri Gasing</span>
            <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-dashed border-cyan-300 flex items-center justify-center text-3xl relative">
              {currentIdx % 5 === 0 && '🟩'}
              {currentIdx % 5 === 1 && '▭'}
              {currentIdx % 5 === 2 && '🔺'}
              {currentIdx % 5 === 3 && '🔘'}
              {currentIdx % 5 === 4 && '🅰️'}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-0.5 border-t-2 border-dotted border-red-400" />
                <div className="h-full w-0.5 border-l-2 border-dotted border-blue-400 absolute" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: isCorrect ? [1, 1.2, 1] : 1,
                x: isWobbling ? [-10, 10, -5, 0] : 0,
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: Math.max(0.2, 1.5 - rpm / 800),
                  ease: 'linear',
                },
                scale: { duration: 0.5 },
              }}
              className="text-6xl filter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            >
              🌀
            </motion.div>
            <span className="text-[10px] font-heading font-black bg-cyan-700 text-white px-2 py-0.5 rounded-full mt-1">
              {rpm} RPM
            </span>
          </div>

          <div className="flex flex-col items-center bg-cyan-900/60 p-3 rounded-2xl border border-cyan-400/40">
            <span className="text-2xl">🪢</span>
            <span className="text-[10px] font-heading font-bold text-cyan-300">Tarikan Tali</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-cyan-900 bg-cyan-100 px-3 py-0.5 rounded-full border border-cyan-200">
              Tantangan Simetri #{currentIdx + 1}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-800">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
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
                    : 'bg-white hover:bg-cyan-50 border-cyan-200 text-slate-800'
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
                {isCorrect ? `🌀 Gasing Berputar Kencang +160 RPM! ${currentQ.explanation}` : `❌ Gasing oleng melambat -120 RPM! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Bentuk Simetri Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-cyan-50 rounded-3xl border-2 border-cyan-300 p-6">
          <div className="text-6xl">🌀⚡👑</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Luar Biasa! Gasing Berputar Maksimal 1000 RPM Tanpa Goyang!
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
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-cyan-200 cursor-pointer"
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
// 8. ULAR TANGGA WAKTU (FASE B) - Snakes & Ladders Board
// -------------------------------------------------------------
export const UlarTanggaWaktuGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [boardSquare, setBoardSquare] = useState(20);
  const [diceValue, setDiceValue] = useState(6);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isSnakeBite, setIsSnakeBite] = useState(false);

  const targetSquare = 100;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'utw-1',
    gameId: game.id,
    question: '2 jam sama dengan berapa menit? (2 × 60) = ... menit ⏱️',
    options: [90, 100, 120, 140],
    answer: 120,
    explanation: '1 jam = 60 menit, maka 2 jam = 120 menit.',
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
      const roll = Math.floor(Math.random() * 3) + 4;
      setDiceValue(roll);
      const nextSquare = Math.min(100, boardSquare + roll * 4);
      setBoardSquare(nextSquare);

      if (nextSquare >= targetSquare || currentIdx + 1 >= 5) {
        setIsGameOver(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 50);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsSnakeBite(true);
      setTimeout(() => setIsSnakeBite(false), 800);
      setBoardSquare((prev) => Math.max(10, prev - 10));
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
    setBoardSquare(20);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsSnakeBite(false);
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
            🎲 Ular Tangga Pengukuran Nusantara
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 50} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Ular Tangga Waktu"
          guideText="Konversikan satuan waktu, berat, dan panjang dengan cermat untuk mengocok dadu dan memanjat tangga bambu menuju puncak 100! Hindari kepala ular agar tidak melorot turun!"
        />
      </div>

      {/* Board Visual */}
      <div className="bg-gradient-to-b from-rose-50 to-red-100 rounded-3xl p-5 border-2 border-rose-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Papan Ular Tangga Waktu & Satuan Baku</span>
            {isSnakeBite && <span className="text-rose-600 animate-bounce">⚠️ Tergigit Ular! Melorot -10 Kotak!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200 text-rose-900 font-bold">
            Posisi Pion: Kotak #{boardSquare} / 100
          </span>
        </div>

        {/* Board Step Path */}
        <div className="h-36 bg-white/80 backdrop-blur-xs rounded-2xl border-2 border-rose-200 p-3 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-x-8 top-1/2 h-2 bg-slate-200 rounded-full" />
          <motion.div
            className="absolute left-8 top-1/2 h-2 bg-rose-500 rounded-full"
            animate={{ width: `${(boardSquare / 100) * 80}%` }}
          />

          {[20, 40, 60, 80, 100].map((step) => (
            <div key={step} className="z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-heading font-black border-2 shadow-xs ${
                  boardSquare >= step
                    ? 'bg-rose-500 border-rose-700 text-white'
                    : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                {step === 100 ? '👑' : step === 60 ? '🪜' : step}
              </div>
              <span className="text-[10px] font-heading font-bold mt-1 text-slate-600">
                {step === 100 ? 'Puncak' : step === 60 ? 'Tangga' : `Kotak ${step}`}
              </span>
            </div>
          ))}

          {/* Moving Pawn */}
          <motion.div
            animate={{ left: `${10 + (boardSquare / 100) * 75}%` }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute top-3 transform -translate-x-1/2 z-20 flex flex-col items-center"
          >
            <span className="text-3xl filter drop-shadow-md">🧙‍♂️</span>
            <span className="text-[9px] font-heading font-black bg-rose-700 text-white px-1.5 py-0.2 rounded shadow-xs">
              Pion Kamu
            </span>
          </motion.div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-rose-900 bg-rose-100 px-3 py-0.5 rounded-full border border-rose-200">
              Tantangan Tangga #{currentIdx + 1}
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
                {isCorrect ? `🪜 Panjat Tangga! Dadu angka ${diceValue}! ${currentQ.explanation}` : `❌ Tergigit ular melorot -10 kotak! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Kocok Dadu Lagi ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-rose-50 rounded-3xl border-2 border-rose-300 p-6">
          <div className="text-6xl">🎲👑🏆</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Selamat! Pion Berhasil Mencapai Puncak Kotak 100!
          </h3>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>+{game.rewardCoins || 50} Koin Didapatkan!</span>
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
// 9. PASAR-PASARAN UANG (FASE B) - Traditional Market Stall
// -------------------------------------------------------------
export const PasarPasaranUangGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [servedCustomers, setServedCustomers] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isChangeMistake, setIsChangeMistake] = useState(false);

  const targetCustomers = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'ppu-1',
    gameId: game.id,
    question: 'Beli 2 kue cucur @Rp2.000 dan 1 es dawet Rp3.000. Total belanja = ... 🏪',
    options: ['Rp6.000', 'Rp7.000', 'Rp8.000', 'Rp9.000'],
    answer: 'Rp7.000',
    explanation: '2 × Rp2.000 + Rp3.000 = Rp7.000 total belanja.',
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
      const nextServed = servedCustomers + 1;
      setServedCustomers(nextServed);

      if (nextServed >= targetCustomers) {
        setIsGameOver(true);
        soundManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (!rewardClaimed) {
          onReward(game.rewardCoins || 50);
          setRewardClaimed(true);
        }
      }
    } else {
      soundManager.playWrong();
      setIsChangeMistake(true);
      setTimeout(() => setIsChangeMistake(false), 800);
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
    setServedCustomers(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsChangeMistake(false);
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
            🏪 Warung Jajanan Pasar & Transaksi Rupiah
          </span>
          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{game.rewardCoins || 50} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Pasar-Pasaran Uang"
          guideText="Hitung total harga jajanan tradisional dan uang kembalian pembeli dengan teliti dan jujur untuk melayani 5 pelanggan setia!"
        />
      </div>

      {/* Traditional Market Stall Visual */}
      <div className="bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-5 border-4 border-emerald-600 relative shadow-2xl space-y-3 text-emerald-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-emerald-200 flex items-center space-x-1">
            <Store className="w-4 h-4" />
            <span>Warung Jajanan Tradisional Nusantara</span>
            {isChangeMistake && <span className="text-rose-400 animate-bounce">⚠️ Hitungan Kembalian Kurang Tepat!</span>}
          </span>
          <span className="bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400 text-yellow-300 font-bold">
            Pelanggan Terlayani: {servedCustomers} / {targetCustomers}
          </span>
        </div>

        {/* Stall Counter with Snack Trays and Rupiah Bills */}
        <div className="h-40 bg-emerald-950/90 rounded-2xl border-2 border-emerald-500/60 p-3 flex items-center justify-between relative overflow-hidden">
          <div className="flex flex-wrap gap-2 max-w-xs">
            <div className="bg-white/10 px-2 py-1 rounded-xl border border-emerald-400/40 flex items-center space-x-1">
              <span className="text-lg">🥮</span>
              <span className="text-[10px] font-heading font-bold">Cucur Rp2.000</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded-xl border border-emerald-400/40 flex items-center space-x-1">
              <span className="text-lg">🍡</span>
              <span className="text-[10px] font-heading font-bold">Klepon Rp1.500</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded-xl border border-emerald-400/40 flex items-center space-x-1">
              <span className="text-lg">🥤</span>
              <span className="text-[10px] font-heading font-bold">Es Dawet Rp3.000</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded-xl border border-emerald-400/40 flex items-center space-x-1">
              <span className="text-lg">🥟</span>
              <span className="text-[10px] font-heading font-bold">Lemper Rp2.500</span>
            </div>
          </div>

          <div className="flex flex-col items-center bg-emerald-900/80 p-2.5 rounded-2xl border border-emerald-400/60 shadow-lg">
            <span className="text-xs font-heading font-black text-yellow-300">Laci Uang Kasir</span>
            <div className="flex space-x-1 mt-1">
              <span className="text-[9px] font-bold bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded border border-blue-400">
                Rp1.000
              </span>
              <span className="text-[9px] font-bold bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-400">
                Rp2.000
              </span>
              <span className="text-[9px] font-bold bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded border border-amber-400">
                Rp5.000
              </span>
              <span className="text-[9px] font-bold bg-purple-900/80 text-purple-200 px-1.5 py-0.5 rounded border border-purple-400">
                Rp10.000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Transaksi Warung #{servedCustomers + 1}
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
                {isCorrect ? `💵 Transaksi Berhasil! Uang Pas! ${currentQ.explanation}` : `❌ Hitungan kembalian keliru! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Layani Pembeli Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-emerald-50 rounded-3xl border-2 border-emerald-300 p-6">
          <div className="text-6xl">🏪💵👑</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Warung Laris Manis! Semua Transaksi Selesai Sempurna!
          </h3>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-5 py-2 rounded-2xl font-heading font-black text-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>+{game.rewardCoins || 50} Koin Didapatkan!</span>
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
// 10. KELERENG SUDUT (FASE B) - Marble Ring & Protractor
// -------------------------------------------------------------
export const KelerengSudutGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [knockedMarbles, setKnockedMarbles] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [flickAnimation, setFlickAnimation] = useState(false);
  const [isMissed, setIsMissed] = useState(false);

  const targetMarbles = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'ksb-1',
    gameId: game.id,
    question: 'Sudut yang besarnya tepat 90 derajat disebut sudut ... 📐⚪',
    options: ['Sudut Lancip', 'Sudut Siku-Siku', 'Sudut Tumpul', 'Sudut Lurus'],
    answer: 'Sudut Siku-Siku',
    explanation: 'Sudut 90° adalah sudut siku-siku.',
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
      setFlickAnimation(true);
      setTimeout(() => setFlickAnimation(false), 700);

      const nextKnocked = knockedMarbles + 1;
      setKnockedMarbles(nextKnocked);

      if (nextKnocked >= targetMarbles) {
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
      setIsMissed(true);
      setTimeout(() => setIsMissed(false), 800);
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
    setKnockedMarbles(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsMissed(false);
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
            ⚪ Kelereng Sudut & Busur Derajat
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Kelereng Sudut"
          guideText="Bidik sudut yang tepat: lancip (<90°), siku-siku (90°), atau tumpul (>90°) untuk menjentikkan gundumu dan mengeluarkan seluruh gundu sasaran dari lingkaran!"
        />
      </div>

      {/* Circular Ground Ring & Protractor Visual */}
      <div className="bg-gradient-to-b from-indigo-900 via-slate-800 to-indigo-950 rounded-3xl p-5 border-4 border-indigo-600 relative shadow-2xl space-y-3 text-indigo-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-indigo-200 flex items-center space-x-1">
            <span>Arena Lingkaran Gundu Tradisional</span>
            {isMissed && <span className="text-rose-400 animate-bounce">⚠️ Jentikan Meleset dari Lingkaran!</span>}
          </span>
          <span className="bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-400 text-yellow-300 font-bold">
            Kelereng Sasaran Keluar: {knockedMarbles} / {targetMarbles}
          </span>
        </div>

        {/* Circular Sand Arena */}
        <div className="h-44 bg-indigo-950/90 rounded-2xl border-2 border-indigo-500/50 relative flex items-center justify-center overflow-hidden">
          <div className="w-40 h-40 rounded-full border-2 border-dashed border-indigo-400/50 flex items-center justify-center relative">
            <div className="w-28 h-28 rounded-full border border-indigo-500/30 flex items-center justify-center">
              <div className="flex -space-x-1">
                {[...Array(Math.max(0, targetMarbles - knockedMarbles))].map((_, i) => (
                  <span key={i} className="text-2xl filter drop-shadow-md">
                    ⚪
                  </span>
                ))}
              </div>
            </div>
            <span className="absolute top-1 text-[9px] font-heading font-black text-indigo-300">
              90° Siku-siku
            </span>
            <span className="absolute left-1 text-[9px] font-heading font-black text-indigo-300">
              180° Lurus
            </span>
            <span className="absolute right-1 text-[9px] font-heading font-black text-indigo-300">
              0° Lancip
            </span>
          </div>

          {/* Shooter Marble (Gundu Gacoan) */}
          <motion.div
            animate={
              flickAnimation
                ? {
                    x: [0, 45, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.3, 1],
                  }
                : isMissed
                ? { x: [-15, 15, 0], y: [10, -10, 0] }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 0.6 }}
            className="absolute bottom-3 left-10 flex flex-col items-center"
          >
            <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">
              🔮
            </span>
            <span className="text-[9px] font-heading font-bold bg-indigo-800 text-indigo-200 px-1 rounded">
              Gacoan
            </span>
          </motion.div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-200">
              Jentikan Kelereng #{knockedMarbles + 1}
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
                    : 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800'
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
                {isCorrect ? `🎯 Kelereng Kena Tepat di Sudut! ${currentQ.explanation}` : `❌ Jentikan meleset! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Bidik Sudut Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-indigo-50 rounded-3xl border-2 border-indigo-300 p-6">
          <div className="text-6xl">⚪🎯👑</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Hebat! Semua Kelereng Sasaran Berhasil Dikeluarkan!
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
