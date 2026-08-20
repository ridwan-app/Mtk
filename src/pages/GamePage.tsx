import React, { useState } from 'react';
import { ChildProgress, PageRoute, MiniGame } from '../types';
import { ALL_MINI_GAMES, getMiniGamesByPhase, PHASES } from '../data/mockData';
import { soundManager } from '../utils/audio';
import { TraditionalMiniGameArena } from '../components/minigames/TraditionalMiniGameArena';
import { Gamepad2, Coins, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface GamePageProps {
  progress: ChildProgress;
  onUpdateProgress: (updated: Partial<ChildProgress>) => void;
  onNavigate: (route: PageRoute) => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  progress,
  onUpdateProgress,
  onNavigate: _onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeGame, setActiveGame] = useState<MiniGame | null>(null);

  // Filter mini-games strictly by active child's phaseId
  const phaseGames = getMiniGamesByPhase(progress.phaseId);
  const currentPhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];

  // Dynamic categories from the phase's mini-games
  const availableCategories = ['Semua', ...Array.from(new Set(phaseGames.map((g) => g.category)))];

  const filteredGames = selectedCategory === 'Semua'
    ? phaseGames
    : phaseGames.filter((g) => g.category === selectedCategory);

  const handleStartGame = (game: MiniGame) => {
    soundManager.playClick();
    setActiveGame(game);
  };

  const handleReward = (coinsReward: number) => {
    onUpdateProgress({
      coins: progress.coins + coinsReward,
    });
  };

  // Active Mini-Game Arena
  if (activeGame) {
    return (
      <TraditionalMiniGameArena
        game={activeGame}
        onBack={() => setActiveGame(null)}
        onReward={handleReward}
      />
    );
  }

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto">
      
      {/* 1. Header with Big Icon, Active Phase Pill & Coins Pill */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-200 shadow-md shadow-amber-500/5 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 border-2 border-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs">
            <Gamepad2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-800 tracking-tight">
                Mini-Game Nusantara
              </h1>
              <span className="text-[11px] font-heading font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 border border-indigo-300">
                Fase {currentPhase.name} ({currentPhase.gradeRange})
              </span>
            </div>
            <span className="text-xs text-slate-500 font-bold">
              Permainan Tradisional & Koin Hadiah 🪙
            </span>
          </div>
        </div>

        {/* Current Coin Stash */}
        <div className="flex items-center space-x-2 bg-amber-100/80 px-4 py-2 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-heading font-black text-amber-950">
          <span className="text-xl">🪙</span>
          <span className="text-lg">{progress.coins}</span>
        </div>
      </div>

      {/* 2. Visual Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {availableCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              {cat === 'Semua' && '🎮 '}
              {cat === 'Bilangan' && '🔢 '}
              {cat === 'Pola' && '🐉 '}
              {cat === 'Pengukuran' && '📏 '}
              {cat === 'Operasi Hitung' && '⚡ '}
              {cat === 'Pecahan' && '🪁 '}
              {cat === 'Geometri' && '📐 '}
              {cat === 'Data' && '📊 '}
              {cat === 'Bilangan Bulat' && '🎋 '}
              {cat === 'Perbandingan' && '🗺️ '}
              {cat === 'Statistik' && '⚪ '}
              {cat === 'Bangun Ruang' && '🏛️ '}
              {cat === 'Pecahan Lanjutan' && '♟️ '}
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Horizontal Mini-Game Cards with Giant Thumbnails & Big Rewards */}
      <div className="space-y-3.5">
        {filteredGames.map((game) => {
          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -2 }}
              id={`minigame-card-${game.id}`}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left: Giant Icon & Concise Info */}
              <div className="flex items-center space-x-4">
                
                {/* Big Thumbnail */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${game.bgGradient || 'from-amber-400 to-orange-500'} flex items-center justify-center text-3xl sm:text-4xl shadow-xs border-2 border-white shrink-0`}
                >
                  <span className="filter drop-shadow-xs">{game.thumbnailIcon}</span>
                </div>

                {/* Title & Badges */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-xl font-heading font-black text-slate-800">
                      {game.name}
                    </h3>

                    {/* Category */}
                    <span className="text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full border bg-amber-100 text-amber-900 border-amber-300">
                      {game.category}
                    </span>

                    {/* Math Skill */}
                    {game.tag && (
                      <span className="text-[10px] font-heading font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {game.tag}
                      </span>
                    )}
                  </div>

                  {/* Concise Description */}
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">
                    {game.description}
                  </p>

                  {/* Big Reward Tag */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="text-xs font-heading font-black bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1">
                      <span>+{game.rewardCoins || 30} 🪙 Menang</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Right: Giant Play Button */}
              <div className="shrink-0 self-end sm:self-center">
                <button
                  id={`play-btn-${game.id}`}
                  onClick={() => handleStartGame(game)}
                  className="px-6 py-3 rounded-2xl btn-chunky-orange text-white font-heading font-black text-sm shadow-md flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>MAIN 🎮</span>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
