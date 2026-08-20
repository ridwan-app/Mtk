import React, { useState } from 'react';
import { Island, ChildProgress } from '../../types';
import { IslandVectorArt } from './IslandVectorArt';
import { MascotCharacter } from '../MascotCharacter';
import { soundManager } from '../../utils/audio';
import { Plane, Star, Lock, CheckCircle2, Play, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlatNusantaraMapProps {
  islands: Island[];
  progress: ChildProgress;
  onSelectIsland: (island: Island) => void;
  onStartFlight: (island: Island) => void;
}

export const FlatNusantaraMap: React.FC<FlatNusantaraMapProps> = ({
  islands,
  progress,
  onSelectIsland: _onSelectIsland,
  onStartFlight,
}) => {
  const [activeIslandId, setActiveIslandId] = useState<string>(() => {
    const current = islands.find((i) => i.order === progress.currentIslandOrder);
    return current ? current.id : islands[0].id;
  });

  const activeIsland = islands.find((i) => i.id === activeIslandId) || islands[0];
  const isActiveCompleted = progress.completedIslands.includes(activeIsland.id);
  const isActiveUnlocked = activeIsland.status === 'unlocked' || isActiveCompleted || activeIsland.order === 1;

  // Mascot quotes for each island
  const mascotHints: Record<string, string> = {
    sumatera: 'Halo Sobat Pilot! Di Sumatera kita belajar Ribuan & Nilai Tempat sambil melihat Rumah Gadang & Gunung Kerinci! 🌋',
    jawa: 'Wah, Candi Borobudur megah sekali! Ayo kuasai Penjumlahan & Pengurangan 4-Angka! 🏛️',
    bali: 'Pantai Kuta dan Pura Ulun Danu indah ya! Kita asah Perkalian Bersusun di sini! 🌺',
    kalimantan: 'Menyusuri Sungai Mahakam di Kalimantan sambil belajar Pembagian & Sisa Bersusun! 🌳',
    sulawesi: 'Keren! Ada Perahu Pinisi dan Rumah Tongkonan! Misi terakhir kita: Pecahan Sederhana! ⛵',
  };

  return (
    <div className="space-y-6">
      {/* Top Map Stage Container */}
      <div className="relative bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD]/60 to-[#FAF6EE] rounded-3xl border-2 border-amber-200/80 p-4 sm:p-6 shadow-md shadow-amber-500/5 overflow-hidden">
        
        {/* Sky Clouds & Flight Atmosphere Decorations */}
        <div className="absolute top-3 left-4 text-slate-400/40 text-4xl select-none pointer-events-none animate-float">☁️</div>
        <div className="absolute top-8 right-16 text-slate-400/40 text-5xl select-none pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>
        <div className="absolute bottom-6 left-12 text-slate-400/30 text-3xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-16 right-1/4 text-3xl select-none pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>🎈</div>
        <div className="absolute bottom-16 right-1/3 text-2xl select-none pointer-events-none opacity-70">🦅</div>

        {/* Compass & Map Badge */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-amber-200 shadow-xs">
            <Compass className="w-4 h-4 text-sky-600 animate-spin-slow" />
            <span className="font-heading font-black text-xs text-sky-900">
              Rute Jalur Ekspedisi 5 Pulau Nusantara
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl border-2 border-amber-200 text-xs font-bold text-slate-700 shadow-xs">
            <span className="text-amber-500">⭐</span>
            <span>{progress.completedIslands.length} / 5 Pulau Ditaklukkan</span>
          </div>
        </div>

        {/* Islands Adventure Trail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 pt-2">
          {islands.map((island, index) => {
            const isCompleted = progress.completedIslands.includes(island.id);
            const isCurrent = island.order === progress.currentIslandOrder && !isCompleted;
            const isLocked = !isCompleted && !isCurrent && island.status === 'locked' && island.order > 1;
            const isSelected = island.id === activeIslandId;
            const stars = progress.islandStars[island.id] || 0;

            return (
              <motion.div
                key={island.id}
                whileHover={!isLocked ? { scale: 1.03, y: -4 } : {}}
                whileTap={!isLocked ? { scale: 0.97 } : {}}
                onClick={() => {
                  soundManager.playClick();
                  setActiveIslandId(island.id);
                }}
                className={`relative rounded-3xl p-4 cursor-pointer transition-all border-2 text-center flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-amber-400 shadow-xl shadow-amber-400/20 ring-4 ring-amber-300/40'
                    : isCompleted
                    ? 'bg-white/90 border-emerald-300 hover:border-emerald-400 shadow-sm'
                    : isCurrent
                    ? 'bg-white border-sky-400 shadow-lg shadow-sky-400/15 ring-2 ring-sky-300'
                    : 'bg-white/60 border-slate-200/80 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Stepper order badge */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : isCurrent
                        ? 'bg-sky-100 text-sky-800 border-sky-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    Misi #{island.order}
                  </span>

                  {/* Status icon */}
                  {isCompleted ? (
                    <span className="text-emerald-600 flex items-center text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : isLocked ? (
                    <span className="text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-amber-500 animate-bounce text-xs">
                      ✈️
                    </span>
                  )}
                </div>

                {/* Flying Plane Badge on Current active node */}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-white shadow-md flex items-center space-x-1 z-20">
                    <Plane className="w-3 h-3 transform -rotate-45" />
                    <span>POSISIMU</span>
                  </div>
                )}

                {/* Island Vector Illustration Art - Maximized Frame */}
                <div className="py-2 flex justify-center transform group-hover:scale-110 transition-transform">
                  <IslandVectorArt islandId={island.id} size="lg" />
                </div>

                {/* Island Info */}
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 leading-tight">
                    {island.name}
                  </h3>
                  <p className="text-[11px] font-bold text-sky-700 truncate">
                    {island.topicName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    🏛️ {island.culturalMotif.landmark}
                  </p>
                </div>

                {/* Stars earned display */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-center space-x-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= stars
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow to next island connector */}
                {index < islands.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 text-sky-400 font-black text-xs select-none">
                    ➜
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Island Detail Card & Mascot Guide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIsland.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200/90 shadow-lg shadow-amber-500/5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          {/* Mascot Co-Pilot Speech on the left */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <MascotCharacter
              mood={isActiveCompleted ? 'cheering' : isActiveUnlocked ? 'waving' : 'thinking'}
              size="lg"
              speechTitle={`Pemandu Kiko: ${activeIsland.name}`}
              speechText={mascotHints[activeIsland.id] || activeIsland.description}
              speechBubblePosition="top"
            />
          </div>

          {/* Island Details & Takeoff Action in middle/right */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-slate-800 flex items-center justify-center text-2xl shadow-xs">
                  {activeIsland.culturalMotif.iconEmoji}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-800 tracking-tight">
                      Pulau {activeIsland.name}
                    </h2>
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200">
                      Misi #{activeIsland.order}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-sky-600">
                    Materi: {activeIsland.topicName}
                  </p>
                </div>
              </div>

              {/* Cultural Badge Ribbon */}
              <div className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-2xl border border-purple-200 text-xs font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Lencana: {activeIsland.culturalMotif.badgeName}</span>
              </div>
            </div>

            {/* Cultural Fun Fact Callout */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3.5 border border-amber-200/80 text-xs sm:text-sm text-amber-950 flex items-start space-x-3">
              <span className="text-xl">🏛️</span>
              <div>
                <span className="font-heading font-black text-amber-900 block">
                  Ikon & Warisan Budaya: {activeIsland.culturalMotif.landmark}
                </span>
                <p className="text-slate-600 mt-0.5">{activeIsland.culturalMotif.funFact}</p>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-500 font-medium">
                {isActiveCompleted ? (
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Misi telah selesai! Kamu bisa latihan ulang untuk skor sempurna.</span>
                  </span>
                ) : isActiveUnlocked ? (
                  <span className="text-sky-700 font-bold">
                    ✈️ Pesawat Garuda Math-01 siap lepas landas menuju pulau ini!
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">
                    🔒 Selesaikan pulau sebelumnya untuk membuka rute penerbangan ini.
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  id={`takeoff-island-btn-${activeIsland.id}`}
                  disabled={!isActiveUnlocked}
                  onClick={() => {
                    soundManager.playTakeoff();
                    onStartFlight(activeIsland);
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-heading font-black text-sm sm:text-base flex items-center space-x-2 shadow-md transition-all ${
                    isActiveUnlocked
                      ? 'btn-chunky-orange text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {isActiveCompleted ? 'Terbang & Latihan Lagi ✈️' : 'Lepas Landas Sekarang! ✈️'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
