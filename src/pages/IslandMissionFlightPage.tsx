import React, { useState, useEffect } from 'react';
import { Island, Question, ChildProgress } from '../types';
import { ALL_QUESTIONS } from '../data/mockData';
import { Scratchpad } from '../components/Scratchpad';
import { MascotCharacter } from '../components/MascotCharacter';
import { soundManager } from '../utils/audio';
import { NusantaraCulturalIcon } from '../components/illustrations/NusantaraCulturalIcon';
import confetti from 'canvas-confetti';
import {
  Star,
  HelpCircle,
  Pencil,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IslandMissionFlightPageProps {
  currentIsland: Island;
  islands: Island[];
  progress: ChildProgress;
  onUpdateProgress: (updated: Partial<ChildProgress>) => void;
  onUnlockNextIsland: (completedIslandId: string, stars: number, rewardCoins?: number) => void;
  onBackToMap: () => void;
}

export const IslandMissionFlightPage: React.FC<IslandMissionFlightPageProps> = ({
  currentIsland,
  islands,
  progress,
  onUpdateProgress,
  onUnlockNextIsland,
  onBackToMap,
}) => {
  // Filter questions for this island
  const questions: Question[] = ALL_QUESTIONS.filter(
    (q) => q.islandId === currentIsland.id
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionFuel, setSessionFuel] = useState(100);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [answeredHistory, setAnsweredHistory] = useState<{ isCorrect: boolean }[]>([]);

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  // Reset when island changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setSessionFuel(100);
    setIsGameCompleted(false);
    setAnsweredHistory([]);
    setShowHint(false);
  }, [currentIsland.id]);

  // Handle answer selection
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setSelectedOption(index);
  };

  // Submit answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctAnswer;
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      soundManager.playCorrect();
      setScore((prev) => prev + 1);
      setAnsweredHistory((prev) => [...prev, { isCorrect: true }]);
    } else {
      soundManager.playWrong();
      setSessionFuel((prev) => Math.max(prev - 20, 20));
      setAnsweredHistory((prev) => [...prev, { isCorrect: false }]);
    }

    // Update global question counters
    onUpdateProgress({
      totalQuestionsAnswered: progress.totalQuestionsAnswered + 1,
      correctAnswersCount: progress.correctAnswersCount + (isCorrect ? 1 : 0),
    });
  };

  // Proceed to next question or complete flight
  const handleNextQuestion = () => {
    soundManager.playClick();
    setShowHint(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Complete flight mission
      setIsGameCompleted(true);
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 0 : 0);
      const earnedStars = finalScore >= Math.ceil(questions.length * 0.75) ? 3 : finalScore >= Math.ceil(questions.length * 0.5) ? 2 : 1;
      const coinReward = earnedStars * 50;

      soundManager.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onUnlockNextIsland(currentIsland.id, earnedStars, coinReward);
    }
  };

  // Restart current island mission
  const handleRestartMission = () => {
    soundManager.playClick();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setSessionFuel(100);
    setIsGameCompleted(false);
    setAnsweredHistory([]);
    setShowHint(false);
  };

  const calculateStars = () => {
    if (score >= Math.ceil(questions.length * 0.75)) return 3;
    if (score >= Math.ceil(questions.length * 0.5)) return 2;
    return 1;
  };

  const nextIsland = islands.find((i) => i.order === currentIsland.order + 1);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      
      {/* 1. Header Cockpit (Sleek, Compact HUD) */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border-2 border-amber-200 shadow-md shadow-amber-500/5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Back Button & Island Title */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onBackToMap}
              className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-slate-700 hover:text-orange-600 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Kembali ke Peta"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center shadow-xs shrink-0 border-2 border-amber-300 overflow-hidden">
              <NusantaraCulturalIcon nameOrId={currentIsland.name || currentIsland.culturalMotif.title} size="sm" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-heading font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Misi #{currentIsland.order}
                </span>
                <h1 className="text-sm sm:text-base font-heading font-black text-slate-900 tracking-tight">
                  {currentIsland.name}
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-orange-600 truncate max-w-[180px] sm:max-w-xs">
                Topik: {currentIsland.topicName}
              </p>
            </div>
          </div>

          {/* HUD Metrics (Fuel, Score, Scratchpad) */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            {/* Bahan Bakar */}
            <div className="hidden xs:flex items-center space-x-1 bg-sky-50 px-2.5 py-1.5 rounded-2xl border border-sky-200 text-[11px] font-heading font-black text-sky-900">
              <Zap className="w-3.5 h-3.5 text-sky-600 fill-sky-500" />
              <span>{sessionFuel}%</span>
            </div>

            {/* Skor */}
            <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-2xl border border-amber-200 text-[11px] font-heading font-black text-amber-900">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{score}/{questions.length}</span>
            </div>

            {/* Papan Coretan */}
            <button
              id="scratchpad-toggle-btn"
              type="button"
              onClick={() => setIsScratchpadOpen(true)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-2xl btn-chunky-amber text-slate-900 text-xs font-heading font-black cursor-pointer shadow-xs"
              title="Buka Papan Coretan Hitung"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coretan</span>
            </button>
          </div>

        </div>

        {/* Runway Progress Tracker (Single clean strip) */}
        <div className="mt-3 pt-3 border-t border-amber-100">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-bold text-slate-600 mb-1.5">
            <span>🛫 Soal {currentQuestionIndex + 1} dari {questions.length}</span>
            <span className="text-orange-600 font-black">🛬 {currentIsland.culturalMotif.landmark}</span>
          </div>

          <div className="relative h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Micro dots step markers */}
          <div className="flex justify-between items-center mt-2 px-0.5">
            {questions.map((_, idx) => {
              const isPassed = idx < currentQuestionIndex;
              const isCurrent = idx === currentQuestionIndex;
              const historyItem = answeredHistory[idx];

              return (
                <div
                  key={idx}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-heading font-black border transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white border-orange-300 scale-110 shadow-xs'
                      : isPassed && historyItem?.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-300'
                      : isPassed && !historyItem?.isCorrect
                      ? 'bg-rose-500 text-white border-rose-300'
                      : 'bg-slate-50 text-slate-400 border-amber-200'
                  }`}
                >
                  {isPassed && historyItem?.isCorrect ? '✓' : idx + 1}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Compact Cultural Strip (Gambar Rumah Adat & Keterangan Budaya) */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl px-3.5 py-2.5 border-2 border-amber-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            <NusantaraCulturalIcon nameOrId={currentIsland.name || currentIsland.culturalMotif.title} size="sm" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-heading font-black text-slate-800 truncate">
                {currentIsland.culturalMotif.title}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
                Budaya Nusantara
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate max-w-[280px] sm:max-w-md lg:max-w-xl">
              {currentIsland.culturalMotif.funFact}
            </p>
          </div>
        </div>

        {/* Petunjuk Kiko Button */}
        {!isAnswerSubmitted && currentQ.hint && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="self-end sm:self-auto shrink-0 text-xs font-heading font-black text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-400 flex items-center space-x-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Minta Petunjuk Maskot Kiko"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-900" />
            <span>{showHint ? 'Tutup Petunjuk' : 'Petunjuk Kiko 💡'}</span>
          </button>
        )}
      </div>

      {/* 3. Main Question Arena (Clean, Focused, No Spoiler Answers) */}
      {!isGameCompleted ? (
        <div className="space-y-3">
          
          {/* Animated Hint Popdown (Only opens if student requests it) */}
          <AnimatePresence>
            {showHint && currentQ.hint && !isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-sky-50 rounded-2xl p-3.5 border-2 border-sky-200 shadow-sm flex items-start space-x-3"
              >
                <div className="shrink-0 mt-0.5">
                  <MascotCharacter
                    mood="thinking"
                    size="sm"
                    speechText={currentQ.hint}
                    speechTitle="Tips Kiko Garuda:"
                    speechBubblePosition="right"
                    enableVoice={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Question Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-md shadow-amber-500/5 space-y-5">
            
            {/* Top Tag: Question Difficulty & Number Only (NO math formulas or answers leaked!) */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-xs font-heading font-black bg-orange-50 text-orange-800 px-3 py-1 rounded-full border border-orange-200">
                {currentQ.category || 'Misi Matematika'}
              </span>
              <span className="text-xs font-heading font-bold text-slate-500">
                Pertanyaan #{currentQuestionIndex + 1}
              </span>
            </div>

            {/* Question Text */}
            <div className="py-1">
              <h2 className="text-base sm:text-xl font-heading font-black text-slate-900 leading-snug">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Options Grid (A, B, C, D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let cardStyle = 'bg-amber-50/40 hover:bg-amber-100/60 border-amber-200 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400 shadow-xs';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                  } else {
                    cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-orange-100 border-orange-400 text-orange-950 ring-2 ring-orange-400 shadow-xs';
                }

                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left font-heading font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between group ${cardStyle}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${
                          isSelected || (isAnswerSubmitted && isCorrect)
                            ? 'bg-white text-slate-900 border-slate-300 shadow-2xs'
                            : 'bg-white/80 text-slate-600 border-amber-200'
                        }`}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span className="font-heading font-black truncate">{optionText}</span>
                    </div>

                    {/* Status Icon */}
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box (ONLY REVEALED AFTER SUBMISSION) */}
            <AnimatePresence>
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-2xl p-4 border-2 text-xs sm:text-sm space-y-2 ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-heading font-black text-xs uppercase tracking-wider">
                      <span>
                        {selectedOption === currentQ.correctAnswer
                          ? '🎉 Jawaban Tepat!'
                          : '💡 Kunci Pembahasan:'}
                      </span>
                    </div>

                    {/* Show verified math formula here in explanation as proof */}
                    {currentQ.mathFormula && (
                      <span className="text-[11px] font-heading font-black bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300/80 font-mono text-slate-800">
                        {currentQ.mathFormula}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  id="submit-answer-btn"
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className={`px-6 py-3 rounded-2xl font-heading font-black text-sm sm:text-base transition-all flex items-center space-x-2 cursor-pointer shadow-md ${
                    selectedOption !== null
                      ? 'btn-chunky-orange text-white active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                  }`}
                >
                  <span>Kirim Jawaban 🚀</span>
                </button>
              ) : (
                <button
                  id="next-question-btn"
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl btn-chunky-teal text-white font-heading font-black text-sm sm:text-base flex items-center space-x-2 cursor-pointer shadow-md active:scale-95"
                >
                  <span>
                    {currentQuestionIndex + 1 < questions.length
                      ? 'Lanjut ke Soal Berikutnya'
                      : 'Lihat Hasil Penerbangan 🏁'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        
        /* 4. Flight Debrief / Island Mission Completed Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl shadow-amber-500/10 text-center space-y-5 max-w-xl mx-auto">
          {/* Trophy */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 border-4 border-amber-500 flex items-center justify-center text-3xl shadow-md">
              🏆
            </div>

            <div className="space-y-1">
              <span className="text-xs font-heading font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider">
                Misi Selesai • Pendaratan Sukses
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                Selamat, Kapten {progress.childName}!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Misi matematika di {currentIsland.name} telah tuntas dan pesawat berhasil mendarat dengan mulus!
              </p>
            </div>
          </div>

          {/* Stars & Score Summary */}
          <div className="bg-[#FAF6EE] rounded-2xl p-4 border-2 border-amber-200 space-y-3">
            <div className="flex justify-center items-center space-x-2">
              {[1, 2, 3].map((starIdx) => {
                const earned = starIdx <= calculateStars();
                return (
                  <motion.div
                    key={starIdx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: starIdx * 0.15 }}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        earned
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-slate-200'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-heading font-bold text-slate-500 uppercase block">
                  Benar
                </span>
                <span className="text-base sm:text-lg font-heading font-black text-emerald-600">
                  {score}/{questions.length}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-heading font-bold text-slate-500 uppercase block">
                  Hadiah
                </span>
                <span className="text-base sm:text-lg font-heading font-black text-amber-600">
                  +{calculateStars() * 50} 🪙
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] font-heading font-bold text-slate-500 uppercase block">
                  Status
                </span>
                <span className="text-base sm:text-lg font-heading font-black text-sky-600">
                  Lolos ✈️
                </span>
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={handleRestartMission}
              className="w-full py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-heading font-black text-xs sm:text-sm border-2 border-amber-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Misi</span>
            </button>

            {nextIsland ? (
              <button
                type="button"
                onClick={onBackToMap}
                className="w-full py-3 px-4 rounded-2xl btn-chunky-orange text-white font-heading font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <span>Lanjut Misi 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToMap}
                className="w-full py-3 px-4 rounded-2xl btn-chunky-teal text-white font-heading font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <span>Kembali ke Peta 🗺️</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Interactive Scratchpad Canvas Drawer */}
      <Scratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

    </div>
  );
};
