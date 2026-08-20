import React, { useState } from 'react';
import { MiniGame } from '../../types';
import { MiniGameQuestion, MINI_GAME_QUESTIONS, shuffleArray } from '../../data/mockMiniGamesData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Coins, RotateCcw, CheckCircle2, XCircle, Trophy, Sparkles, MapPin, Gauge, Box, Crown } from 'lucide-react';
import { KikoGameGuideHeader } from './KikoGameGuideHeader';

interface GameProps {
  game: MiniGame;
  onBack: () => void;
  onReward: (coins: number) => void;
}

// -------------------------------------------------------------
// 1. PETAK UMPET SKALA (FASE C) - Nautical Map Scale & Radar Search
// -------------------------------------------------------------
export const PetakUmpetSkalaGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [foundClues, setFoundClues] = useState(0); // 0 to 5
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isRadarScrambled, setIsRadarScrambled] = useState(false);

  const targetClues = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'pu-1',
    gameId: game.id,
    question: 'Skala peta 1 : 500.000. Jarak pada peta 4 cm. Jarak sebenarnya? 🗺️',
    options: ['2 km', '20 km', '200 km', '50 km'],
    answer: '20 km',
    explanation: '4 cm × 500.000 = 2.000.000 cm = 20 km',
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
      const nextClues = foundClues + 1;
      setFoundClues(nextClues);

      if (nextClues >= targetClues) {
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
      setIsRadarScrambled(true);
      setTimeout(() => setIsRadarScrambled(false), 900);
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
    setFoundClues(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsRadarScrambled(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-emerald-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header with Kiko Mascot Guide on the Right */}
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
            🗺️ Petak Umpet Skala Peta
          </span>
          <span className="text-xs font-heading font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{game.rewardCoins || 50} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Petak Umpet Skala"
          guideText="Hitung skala peta dan jarak sebenarnya untuk melacak koordinat pulau tempat persembunyian Kiko di kepulauan Nusantara!"
        />
      </div>

      {/* Archipelago Radar Map Visual */}
      <div className="bg-gradient-to-b from-blue-900 to-indigo-950 rounded-3xl p-5 border-2 border-indigo-400 relative shadow-2xl space-y-3 text-white overflow-hidden">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="flex items-center space-x-1 text-emerald-300">
            <MapPin className="w-4 h-4" />
            <span>Peta Navigasi Radar Bahari</span>
            {isRadarScrambled && <span className="text-rose-400 animate-bounce">⚠️ Sinyal Radar Terganggu!</span>}
          </span>
          <span className="bg-indigo-800/90 px-3 py-1 rounded-full border border-indigo-500 text-emerald-200">
            Titik Koordinat Terkuak: {foundClues} / {targetClues}
          </span>
        </div>

        {/* Nautical Radar Map Grid */}
        <div className="h-36 bg-blue-950/80 rounded-2xl border-2 border-indigo-500 relative flex items-center justify-center overflow-hidden">
          {/* Radar Circles */}
          <div className="absolute w-28 h-28 rounded-full border border-cyan-400/30 animate-ping" />
          <div className="absolute w-48 h-48 rounded-full border border-cyan-400/20" />
          <div className="absolute w-full h-0.5 bg-cyan-400/20" />
          <div className="absolute h-full w-0.5 bg-cyan-400/20" />

          {/* Islands on map */}
          <div className="absolute left-10 top-6 text-2xl filter drop-shadow">🏝️</div>
          <div className="absolute right-14 top-10 text-2xl filter drop-shadow">🏝️</div>
          <div className="absolute left-1/3 bottom-4 text-2xl filter drop-shadow">🏝️</div>

          {/* Hiding Kiko Mascot popping up at target location */}
          <motion.div
            animate={{
              scale: isAnswered && isCorrect ? [1, 1.3, 1] : 1,
              opacity: foundClues > 0 ? 1 : 0.4,
              x: isRadarScrambled ? [-10, 10, -5, 0] : 0,
            }}
            className="absolute right-1/4 bottom-6 flex flex-col items-center"
          >
            <span className="text-3xl">🦅🔍</span>
            <span className="text-[9px] font-heading font-black bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded">
              {foundClues >= targetClues ? 'Ketemu!' : 'Sembunyi'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Koordinat Pencarian #{foundClues + 1}
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
                {isCorrect ? `🔍 Radar Menemukan Titik! ${currentQ.explanation}` : `❌ Sinyal radar hilang! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Lacak Titik Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-emerald-50 rounded-3xl border-2 border-emerald-300 p-6">
          <div className="text-6xl">🗺️🔍🦅✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Kiko Berhasil Ditemukan di Pulau Rahasia!
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
// 2. KELERENG STATISTIK (FASE C) - Marble Circle (Kalang Gundu)
// -------------------------------------------------------------
export const KelerengStatistikGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
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
  const [isMissed, setIsMissed] = useState(false);

  const targetMarbles = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'ks-1',
    gameId: game.id,
    question: 'Nilai kuis 5 anak: 70, 80, 80, 90, 80. Berapakah nilai rata-rata (mean)-nya? (400 ÷ 5) = ... ⚪',
    options: [75, 78, 80, 82],
    answer: 80,
    explanation: 'Jumlah = 400. Rata-rata = 400 ÷ 5 = 80.',
  };

  // Extract or map dataset for display in the circle
  const getMarbleDataSet = (qId: string) => {
    if (qId === 'ks-1') return ['70', '80', '80', '90', '80'];
    if (qId === 'ks-2') return ['6', '7', '8', '8', '9', '8', '10'];
    if (qId === 'ks-3') return ['4', '5', '7', '8', '9'];
    if (qId === 'ks-4') return ['75', '85', '80'];
    if (qId === 'ks-5') return ['⚽ 50%', '🎨 30%', '📚 20%'];
    if (qId === 'ks-6') return ['10', '12', '14', '16', '18'];
    if (qId === 'ks-7') return ['5', '6', '6', '7', '8', '9', '9'];
    if (qId === 'ks-8') return ['4', '8', '12', '15', '20'];
    if (qId === 'ks-9') return ['80', '85', '90'];
    if (qId === 'ks-10') return ['🐱 40%', '🐶 35%', '🐰 25%'];
    return ['70', '80', '80', '90', '80'];
  };

  const dataMarbles = getMarbleDataSet(currentQ.id);

  const handleSelect = (val: string | number) => {
    if (isAnswered || isGameOver) return;
    soundManager.playClick();
    setSelectedOption(val);
    setIsAnswered(true);

    const match = String(val).trim() === String(currentQ.answer).trim();
    setIsCorrect(match);

    if (match) {
      soundManager.playCorrect();
      const nextCount = knockedMarbles + 1;
      setKnockedMarbles(nextCount);

      if (nextCount >= targetMarbles) {
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
            ⚪ Kelereng Kalang Statistik
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Kelereng Statistik"
          guideText="Tentukan mean, median, atau modus dengan tepat untuk menyentil kelereng gaco keluar lingkaran tanah!"
        />
      </div>

      {/* Ground Ring (Kalang Gundu) Visual */}
      <div className="bg-gradient-to-b from-amber-200 via-amber-100 to-orange-100 rounded-3xl p-5 border-2 border-amber-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Lingkaran Kalang Gundu Tanah</span>
            {isMissed && <span className="text-rose-600 animate-bounce">⚠️ Sentilan Gaco Meleset!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-amber-300">
            Kelereng Dikeluarkan: {knockedMarbles} / {targetMarbles}
          </span>
        </div>

        {/* Circular Sand Pit with Marbles */}
        <div className="h-36 bg-amber-300/60 rounded-2xl border-2 border-amber-500 relative flex items-center justify-center overflow-hidden">
          <div className="w-56 h-28 rounded-full border-2 border-dashed border-white bg-amber-400/30 flex items-center justify-center p-2 gap-1.5 flex-wrap relative">
            {dataMarbles.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-sky-100 to-indigo-200 border-2 border-indigo-400 flex items-center justify-center text-[10px] font-heading font-black text-indigo-950 shadow-md"
              >
                {val}
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{
              x: isAnswered && isCorrect ? [0, 60, 0] : isMissed ? [-20, 20, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className="absolute left-6 flex flex-col items-center"
          >
            <span className="text-2xl filter drop-shadow">🔮</span>
            <span className="text-[9px] font-heading font-black bg-slate-800 text-white px-1.5 py-0.5 rounded">
              Gaco
            </span>
          </motion.div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Sentilan #{knockedMarbles + 1}
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
                {isCorrect ? `⚪ Sentilan Tepat Mengenai Target! ${currentQ.explanation}` : `❌ Sentilan meleset! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Sentil Kelereng Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-amber-50 rounded-3xl border-2 border-amber-300 p-6">
          <div className="text-6xl">⚪🏆✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Semua Kelereng Statistik Berhasil Dikeluarkan!
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
// 3. GASING FPB-KPK (FASE C) - Spinning Top Duel Arena
// -------------------------------------------------------------
export const GasingFPBKPKGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playerRpm, setPlayerRpm] = useState(200); // 200 to 1000 RPM
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isSlowing, setIsSlowing] = useState(false);

  const targetRpm = 1000;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'gf-1',
    gameId: game.id,
    question: 'FPB dari 12 dan 18 adalah ... 🌀',
    options: [2, 3, 6, 12],
    answer: 6,
    explanation: 'Faktor persekutuan terbesar 12 dan 18 adalah 6.',
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
      const nextRpm = Math.min(targetRpm, playerRpm + 200);
      setPlayerRpm(nextRpm);

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
      setIsSlowing(true);
      setTimeout(() => setIsSlowing(false), 800);
      setPlayerRpm((prev) => Math.max(100, prev - 150));
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
    setPlayerRpm(200);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsSlowing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-orange-200 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-orange-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-heading font-black text-slate-700 hover:text-orange-600 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-heading font-black bg-orange-100 text-orange-950 px-3 py-1 rounded-full border border-orange-300">
            🌀 Gelanggang Gasing Kayu
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 45} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Gasing FPB-KPK"
          guideText="Tarik tali gasingmu dengan menyelesaikan perhitungan FPB dan KPK secepat mungkin untuk memutar gasing hingga 1000 RPM mengalahkan gasing Kiko!"
        />
      </div>

      {/* Spinning Top Arena Visual */}
      <div className="bg-gradient-to-b from-orange-100 via-amber-100 to-yellow-100 rounded-3xl p-5 border-2 border-orange-300 relative shadow-inner space-y-3">
        <div className="flex justify-between items-center text-xs font-heading font-black text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Arena Duel Putaran Gasing</span>
            {isSlowing && <span className="text-rose-600 animate-bounce">⚠️ Gasing Goyah & Melambat -150 RPM!</span>}
          </span>
          <span className="bg-white px-3 py-1 rounded-full border border-orange-300">
            Kecepatan Putaranmu: {playerRpm} / {targetRpm} RPM
          </span>
        </div>

        {/* Wooden Arena Ring with 2 Spinning Tops */}
        <div className="h-36 bg-amber-900/10 rounded-2xl border-2 border-orange-400 relative flex items-center justify-around overflow-hidden">
          {/* Player Gasing */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                rotate: 360,
                x: isSlowing ? [-8, 8, 0] : 0,
              }}
              transition={{
                rotate: { repeat: Infinity, duration: Math.max(0.15, 1.2 - playerRpm / 1000), ease: 'linear' },
              }}
              className="text-4xl filter drop-shadow-md"
            >
              🌀
            </motion.div>
            <span className="text-[10px] font-heading font-black bg-amber-500 text-white px-2 py-0.5 rounded-full mt-1">
              Gasingmu ({playerRpm} RPM)
            </span>
          </div>

          {/* Sparks Effect in Middle */}
          <div className="text-2xl animate-pulse">⚡🔥</div>

          {/* Kiko Gasing */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
              className="text-4xl filter drop-shadow-md"
            >
              🌀
            </motion.div>
            <span className="text-[10px] font-heading font-black bg-slate-700 text-white px-2 py-0.5 rounded-full mt-1">
              Gasing Kiko (500 RPM)
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-orange-900 bg-orange-100 px-3 py-0.5 rounded-full border border-orange-200">
              Putaran Tarikan #{Math.round(playerRpm / 200)}
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
                    : 'bg-white hover:bg-orange-50 border-orange-200 text-slate-800'
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
                {isCorrect ? `🌀 Gasing Berputar Sangat Kencang +200 RPM! ${currentQ.explanation}` : `❌ Gasing melambat -150 RPM! ${currentQ.explanation}`}
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
        <div className="text-center py-6 space-y-4 bg-orange-50 rounded-3xl border-2 border-orange-300 p-6">
          <div className="text-6xl">🌀🏆⚡</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Gasing Emasmu Berputar Paling Lama dan Menang!
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
              className="px-5 py-2.5 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs border border-orange-200 cursor-pointer"
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
// 4. RUMAH-RUMAHAN VOLUME (FASE C) - 3D Architectural Assembly
// -------------------------------------------------------------
export const RumahRumahanVolumeGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
  const [questionsList, setQuestionsList] = useState<MiniGameQuestion[]>(() =>
    shuffleArray(MINI_GAME_QUESTIONS[game.id] || [])
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [assembledLayers, setAssembledLayers] = useState(0); // 0 to 5
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);

  const targetLayers = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'rv-1',
    gameId: game.id,
    question: 'Kubus sisi s = 6 cm. Volume = ... cm³ 🏛️',
    options: [36, 144, 216, 256],
    answer: 216,
    explanation: 'Volume = 6 × 6 × 6 = 216 cm³',
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
      const nextLayers = assembledLayers + 1;
      setAssembledLayers(nextLayers);

      if (nextLayers >= targetLayers) {
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
      setIsCollapse(true);
      setTimeout(() => setIsCollapse(false), 800);
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
    setAssembledLayers(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setRewardClaimed(false);
    setIsCollapse(false);
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
            🏛️ Rancang Bangun Rumah Adat
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 50} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Rumah-Rumahan Volume"
          guideText="Hitung volume bangun ruang kubus, balok, dan prisma untuk memasang pondasi, dinding, dan atap miniatur rumah adat Joglo!"
        />
      </div>

      {/* 3D Blueprint Assembly Table Visual */}
      <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-5 border-2 border-indigo-400 relative shadow-2xl space-y-3 text-white">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-indigo-300 flex items-center space-x-1">
            <Box className="w-4 h-4" />
            <span>Meja Arsitek 3D Rumah Adat Joglo</span>
            {isCollapse && <span className="text-rose-400 animate-bounce">⚠️ Ukuran Volume Tidak Pas!</span>}
          </span>
          <span className="bg-indigo-800/90 px-3 py-1 rounded-full border border-indigo-500 text-indigo-200">
            Bagian Terpasang: {assembledLayers} / {targetLayers}
          </span>
        </div>

        {/* Blueprint House Assembly */}
        <div className="h-36 bg-indigo-950/70 rounded-2xl border-2 border-indigo-500 relative flex flex-col items-center justify-center p-3">
          <div
            className={`w-32 h-10 border-2 rounded-t-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
              assembledLayers >= 3
                ? 'bg-amber-600 border-amber-400 text-white shadow-lg'
                : 'border-dashed border-indigo-500 text-indigo-400'
            }`}
          >
            {assembledLayers >= 3 ? '🏛️ Atap Prisma Terpasang' : 'Atap Prisma (Volume)'}
          </div>

          <div
            className={`w-28 h-12 border-2 flex items-center justify-center text-xs font-heading font-bold transition-all ${
              assembledLayers >= 2
                ? 'bg-amber-700 border-amber-500 text-white shadow-lg'
                : 'border-dashed border-indigo-500 text-indigo-400'
            }`}
          >
            {assembledLayers >= 2 ? '🧱 Dinding Kubus Terpasang' : 'Dinding Kubus (Volume)'}
          </div>

          <div
            className={`w-36 h-8 border-2 rounded-b-xl flex items-center justify-center text-xs font-heading font-bold transition-all ${
              assembledLayers >= 1
                ? 'bg-amber-800 border-amber-600 text-white shadow-lg'
                : 'border-dashed border-indigo-500 text-indigo-400'
            }`}
          >
            {assembledLayers >= 1 ? '🪵 Pondasi Balok Terpasang' : 'Pondasi Balok (Volume)'}
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-200">
              Modul Konstruksi #{assembledLayers + 1}
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
                {isCorrect ? `🏛️ Balok Terpasang Presisi! ${currentQ.explanation}` : `❌ Ukuran volume tidak sesuai! ${currentQ.explanation}`}
              </div>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Rakit Bagian Berikutnya ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 bg-indigo-50 rounded-3xl border-2 border-indigo-300 p-6">
          <div className="text-6xl">🏛️✨👑</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Mahakarya Rumah Adat Berdiri Megah Sempurna!
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
// 5. DAM-DAMAN DESIMAL (FASE C) - Strategic Diamond Board Tactics
// -------------------------------------------------------------
export const DamDamanDesimalGame: React.FC<GameProps> = ({ game, onBack, onReward }) => {
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
  const [isOpponentCounter, setIsOpponentCounter] = useState(false);

  const targetPieces = 5;
  const currentQ: MiniGameQuestion = questionsList[currentIdx % questionsList.length] || {
    id: 'dd-1',
    gameId: game.id,
    question: 'Bentuk desimal dari 3/4 adalah ... ♟️',
    options: ['0,25', '0,5', '0,75', '0,8'],
    answer: '0,75',
    explanation: '3/4 = 75/100 = 0,75',
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
      const nextPieces = capturedPieces + 1;
      setCapturedPieces(nextPieces);

      if (nextPieces >= targetPieces) {
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
      setIsOpponentCounter(true);
      setTimeout(() => setIsOpponentCounter(false), 800);
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
    setIsOpponentCounter(false);
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
            ♟️ Papan Taktik Dam-Daman
          </span>
          <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{game.rewardCoins || 50} 🪙</span>
          </span>
        </div>

        {/* Mascot Guide Header */}
        <KikoGameGuideHeader
          gameName="Dam-Daman Desimal"
          guideText="Konversi pecahan, desimal, dan persen untuk melompati dan memakan bidak perak lawan!"
        />
      </div>

      {/* Traditional Dam-Daman Board Visual */}
      <div className="bg-gradient-to-b from-amber-900 to-stone-900 rounded-3xl p-5 border-2 border-amber-700 relative shadow-2xl space-y-3 text-amber-100">
        <div className="flex justify-between items-center text-xs font-heading font-black">
          <span className="text-amber-300 flex items-center space-x-1">
            <Crown className="w-4 h-4" />
            <span>Papan Garis Silang Nusantara</span>
            {isOpponentCounter && <span className="text-rose-400 animate-bounce">⚠️ Bidak Lawan Menutup Jalur!</span>}
          </span>
          <span className="bg-amber-800/90 px-3 py-1 rounded-full border border-amber-600 text-amber-200">
            Bidak Lawan Dimakan: {capturedPieces} / {targetPieces}
          </span>
        </div>

        {/* Dam-daman Interconnected Diamond Lines */}
        <div className="h-36 bg-amber-950/80 rounded-2xl border-2 border-amber-800 relative flex items-center justify-around px-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-36 h-28 border-2 border-amber-400 rotate-45" />
            <div className="absolute w-full h-0.5 bg-amber-400" />
            <div className="absolute h-full w-0.5 bg-amber-400" />
          </div>

          <div className="flex space-x-2 z-10">
            {[1, 2, 3].map((p) => (
              <div
                key={p}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-yellow-200 flex items-center justify-center text-xs font-bold text-amber-950 shadow-md"
              >
                0.7
              </div>
            ))}
          </div>

          <div className="z-10 text-xl font-heading font-black text-yellow-300 animate-bounce">
            ⚔️
          </div>

          <div className="flex space-x-2 z-10">
            {[1, 2, 3].map((p) => (
              <div
                key={p}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-md transition-all ${
                  capturedPieces >= p
                    ? 'bg-red-900/60 border-red-500 text-red-300 opacity-40 line-through'
                    : 'bg-gradient-to-br from-slate-200 to-slate-400 border-white text-slate-900'
                }`}
              >
                %
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      {!isGameOver ? (
        <div className="space-y-4 pt-1">
          <div className="text-center space-y-1">
            <span className="text-xs font-heading font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Langkah Taktik #{capturedPieces + 1}
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
                {isCorrect ? `♟️ Bidak Berhasil Melompat! ${currentQ.explanation}` : `❌ Gerakan terhalang! ${currentQ.explanation}`}
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
          <div className="text-6xl">♟️👑✨</div>
          <h3 className="text-2xl font-heading font-black text-slate-800">
            Raja Papan Dam-Daman Dikuasai Sempurna!
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
