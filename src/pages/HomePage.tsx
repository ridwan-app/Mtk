import React from 'react';
import { Island, ChildProgress, PageRoute } from '../types';
import { PHASES, getMiniGamesByPhase } from '../data/mockData';
import { Plane, Star, Flame, Map, Sparkles, ChevronRight, Coins, Zap, Trophy, Play, GraduationCap } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MascotCharacter } from '../components/MascotCharacter';
import { IslandVectorArt } from '../components/illustrations/IslandVectorArt';
import { NusantaraCulturalIcon } from '../components/illustrations/NusantaraCulturalIcon';
import { motion } from 'motion/react';

interface HomePageProps {
  islands: Island[];
  progress: ChildProgress;
  onNavigate: (route: PageRoute) => void;
  onSelectIsland: (island: Island) => void;
  onOpenPhaseModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  islands,
  progress,
  onNavigate,
  onSelectIsland,
  onOpenPhaseModal,
}) => {
  const activePhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];
  const activeIsland = islands.find((isl) => isl.order === progress.currentIslandOrder) || islands[0];
  const completedCount = progress.completedIslands.length;
  const totalEarnedStars = Object.values(progress.islandStars || {}).reduce<number>((sum, s) => sum + (typeof s === 'number' ? s : 0), 0);
  const calculatedStars = Math.max(progress.totalStars || 0, totalEarnedStars);
  const xpPoints = (calculatedStars * 150) + (progress.coins * 2) + ((progress.correctAnswersCount || 0) * 20);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Giant Visual Stats Bar */}
      <section className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200/90 shadow-md shadow-amber-500/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Koin */}
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 flex items-center space-x-3">
            <span className="text-3xl sm:text-4xl">🪙</span>
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black text-amber-950 block leading-tight">
                {progress.coins}
              </span>
              <span className="text-[10px] font-heading font-bold text-amber-700 uppercase tracking-wider">
                Koin Emas
              </span>
            </div>
          </div>

          {/* XP */}
          <div className="bg-sky-50 rounded-2xl p-3 border-2 border-sky-200 flex items-center space-x-3">
            <span className="text-3xl sm:text-4xl">⚡</span>
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black text-sky-950 block leading-tight">
                {xpPoints}
              </span>
              <span className="text-[10px] font-heading font-bold text-sky-700 uppercase tracking-wider">
                XP Terbang
              </span>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-orange-50 rounded-2xl p-3 border-2 border-orange-200 flex items-center space-x-3">
            <span className="text-3xl sm:text-4xl">🔥</span>
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black text-orange-950 block leading-tight">
                {progress.streak}
              </span>
              <span className="text-[10px] font-heading font-bold text-orange-700 uppercase tracking-wider">
                Streak Hari
              </span>
            </div>
          </div>

          {/* Bintang */}
          <div className="bg-yellow-50 rounded-2xl p-3 border-2 border-yellow-200 flex items-center space-x-3">
            <span className="text-3xl sm:text-4xl">⭐</span>
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black text-yellow-950 block leading-tight">
                {calculatedStars} <span className="text-sm font-normal text-yellow-700">/ {islands.length * 3}</span>
              </span>
              <span className="text-[10px] font-heading font-bold text-yellow-700 uppercase tracking-wider">
                Bintang (Fase {activePhase.name})
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Hero Cockpit: Mascot & Active Phase Takeoff Destination */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-lg shadow-amber-500/5 relative overflow-hidden">
        
        <div className="absolute top-2 right-12 text-amber-200/50 text-6xl select-none pointer-events-none animate-float">
          ☁️
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Mascot Co-pilot */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <MascotCharacter
              mood="cheering"
              size="lg"
              speechTitle={`Kapten ${progress.childName}!`}
              speechText={`Misi berikutnya di Pulau ${activeIsland?.name || 'Sumatera'} (${activeIsland?.topicName || 'Matematika'})! Ayo terbang! ✈️`}
              speechBubblePosition="top"
            />
          </div>

          {/* Active Flight Ready Card */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Phase Switch Trigger */}
              <button
                id="hero-phase-chip-btn"
                onClick={() => {
                  soundManager.playClick();
                  if (onOpenPhaseModal) onOpenPhaseModal();
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-heading font-black cursor-pointer hover:scale-105 transition-transform ${activePhase.badgeBg} ${activePhase.badgeText}`}
              >
                <span>{activePhase.icon}</span>
                <span>{activePhase.title}</span>
                <span>⚙️</span>
              </button>

              <span className="inline-flex items-center space-x-1.5 bg-orange-100 text-orange-950 px-3 py-1 rounded-full border border-orange-300 text-xs font-heading font-black">
                <span>📍 Misi #{activeIsland?.order}</span>
                <span>•</span>
                <span>Pulau {activeIsland?.name}</span>
              </span>

              <span className="inline-flex items-center space-x-1 bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-300 text-xs font-heading font-black">
                {activeIsland?.topicName}
              </span>
            </div>

            {activeIsland && (
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border-2 border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                    <NusantaraCulturalIcon nameOrId={activeIsland.name || activeIsland.culturalMotif.title} size="md" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg sm:text-xl text-slate-800 leading-tight">
                      {activeIsland.culturalMotif.landmark}
                    </h3>
                    <p className="text-xs font-bold text-orange-600 mt-0.5">
                      {activeIsland.culturalMotif.title}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                      {activeIsland.description}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block shrink-0">
                  <IslandVectorArt islandId={activeIsland.id} size="sm" />
                </div>
              </div>
            )}

            {/* Action Buttons - Equal Size, Responsive, Centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 w-full">
              <button
                id="hero-start-flight-btn"
                onClick={() => {
                  soundManager.playTakeoff();
                  if (activeIsland) onSelectIsland(activeIsland);
                }}
                className="w-full py-3.5 px-4 rounded-2xl btn-chunky-orange text-white font-heading font-black text-sm sm:text-base shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 text-center"
              >
                <Plane className="w-5 h-5 transform -rotate-45 shrink-0" />
                <span className="truncate">Terbang ke {activeIsland?.name} ✈️</span>
              </button>

              <button
                id="hero-open-map-btn"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('peta');
                }}
                className="w-full py-3.5 px-4 rounded-2xl btn-chunky-teal text-white font-heading font-black text-sm sm:text-base shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 text-center"
              >
                <Map className="w-5 h-5 shrink-0" />
                <span className="truncate">Buka Peta Rute 🗺️</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. Mini-Game Quick Arena */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-md shadow-indigo-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-slate-800">
                Arena Mini-Game Bebas
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Bebas diakses kapan saja untuk latihan ketangkasan hitung & koin ekstra!
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('game')}
            className="text-xs font-heading font-black text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
          >
            <span>Semua Game</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Phase-Aware Mini-Game Visual Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {getMiniGamesByPhase(progress.phaseId).slice(0, 4).map((game) => (
            <div
              key={game.id}
              onClick={() => onNavigate('game')}
              className="bg-amber-50 hover:bg-amber-100 p-3.5 rounded-2xl border-2 border-amber-200 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{game.thumbnailIcon}</span>
              <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800 line-clamp-1">{game.name}</h4>
              <span className="text-[10px] font-heading font-black bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md">
                {game.category} • +{game.rewardCoins || 30} 🪙
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Paspor Cap Stempel Nusantara 6 Pulau Fase */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md shadow-amber-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🛂</span>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-800">
                Cap Paspor Penerbang ({activePhase.title})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {completedCount} dari 6 pulau dituntaskan
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profil')}
            className="text-xs font-heading font-black text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            Lihat Profil 👤
          </button>
        </div>

        {/* 6 Stamps Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 pt-1">
          {islands.map((island) => {
            const isStamped = progress.completedIslands.includes(island.id);
            return (
              <div
                key={island.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectIsland(island);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[95px] ${
                  isStamped
                    ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {isStamped ? (
                    <NusantaraCulturalIcon nameOrId={island.name || island.culturalMotif.title} size="sm" />
                  ) : (
                    <span className="text-xl">🔒</span>
                  )}
                </div>
                <span className="text-[10px] font-heading font-black mt-1 truncate max-w-full">
                  {island.name}
                </span>
                <span className="text-[9px] text-orange-600 font-bold truncate max-w-full">
                  {island.topicName}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
