import React, { useState } from 'react';
import { Island, ChildProgress } from '../../types';
import { IsometricIslandPlate } from './IsometricIslandPlate';
import { IsometricPlane } from './IsometricPlane';
import { IsometricDecorations } from './IsometricDecorations';
import { soundManager } from '../../utils/audio';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plane,
  Sparkles,
  Award,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  BookOpen
} from 'lucide-react';

interface IsometricMapStageProps {
  islands: Island[];
  progress: ChildProgress;
  selectedIsland: Island;
  onSelectIsland: (island: Island) => void;
  onStartFlight: (island: Island) => void;
}

export const IsometricMapStage: React.FC<IsometricMapStageProps> = ({
  islands,
  progress,
  selectedIsland,
  onSelectIsland,
  onStartFlight,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [perspectiveMode, setPerspectiveMode] = useState<'isometric' | 'flat'>('isometric');

  // Find active flight position
  const activeIsland = islands.find((i) => i.id === selectedIsland.id) || islands[0];

  // Ocean background themes
  const oceanBackgrounds = {
    day: 'bg-gradient-to-b from-sky-400 via-cyan-500 to-blue-600',
    sunset: 'bg-gradient-to-b from-orange-400 via-rose-500 to-indigo-800',
    night: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950',
  };

  // Adjusted isometric responsive coordinates for 2.5D layout
  // 5 Islands positions in 2.5D isometric plane space (% x, y)
  const islandPositions: Record<string, { x: number; y: number }> = {
    sumatera: { x: 16, y: 32 },
    jawa: { x: 38, y: 72 },
    bali: { x: 56, y: 76 },
    kalimantan: { x: 44, y: 28 },
    sulawesi: { x: 74, y: 42 },
  };

  const handleZoomIn = () => {
    soundManager.playClick();
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  };

  const handleZoomOut = () => {
    soundManager.playClick();
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.8));
  };

  const handleResetZoom = () => {
    soundManager.playClick();
    setZoomLevel(1);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-sky-100 shadow-sm">
        
        {/* Island Fast Hopper Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Rute:
          </span>
          {islands.map((island) => {
            const isSel = island.id === selectedIsland.id;
            const isCompleted = island.status === 'completed';
            const isLocked = island.status === 'locked';

            return (
              <button
                key={island.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectIsland(island);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                  isSel
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : isLocked
                    ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <span>{island.culturalMotif.iconEmoji}</span>
                <span>#{island.order} {island.name.replace('Pulau ', '')}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                {isLocked && <Lock className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </div>

        {/* Atmosphere & View Controls */}
        <div className="flex items-center space-x-2">
          {/* Time of Day Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                soundManager.playClick();
                setTimeOfDay('day');
              }}
              title="Waktu Siang Cerah"
              className={`p-1.5 rounded-xl transition-all ${
                timeOfDay === 'day'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setTimeOfDay('sunset');
              }}
              title="Waktu Senja / Sunset"
              className={`p-1.5 rounded-xl transition-all ${
                timeOfDay === 'sunset'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setTimeOfDay('night');
              }}
              title="Waktu Malam Bintang"
              className={`p-1.5 rounded-xl transition-all ${
                timeOfDay === 'night'
                  ? 'bg-indigo-900 text-amber-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Perspective 2.5D / Flat Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setPerspectiveMode((prev) => (prev === 'isometric' ? 'flat' : 'isometric'));
            }}
            title="Ubah Sudut Pandang 2.5D Isometrik"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              perspectiveMode === 'isometric'
                ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {perspectiveMode === 'isometric' ? '📐 2.5D Isometrik' : '🗺️ 2D Peta Datar'}
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={handleZoomIn}
              title="Perbesar Peta"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Perkecil Peta"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Tampilan"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main 2.5D Isometric World Stage Canvas */}
      <div
        id="isometric-viewport"
        className={`relative w-full rounded-3xl overflow-hidden border-4 border-sky-300 shadow-2xl transition-colors duration-700 min-h-[520px] sm:min-h-[620px] lg:min-h-[680px] flex items-center justify-center ${oceanBackgrounds[timeOfDay]}`}
        style={{
          perspective: perspectiveMode === 'isometric' ? '1200px' : 'none',
        }}
      >
        
        {/* Ocean Ambient Decorations (Clouds, Dolphins, Waves, Ships) */}
        <IsometricDecorations timeOfDay={timeOfDay} />

        {/* Compass Card in Top-Right Corner */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 text-white flex items-center space-x-2 shadow-lg">
          <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-sky-200 tracking-wider uppercase">Navigasi Udara</span>
            <span className="text-[11px] font-extrabold text-white">Nusantara 2.5D</span>
          </div>
        </div>

        {/* Transformed Isometric Archipelago Surface */}
        <div
          className="relative w-full h-full min-h-[520px] sm:min-h-[620px] lg:min-h-[680px] transition-transform duration-500 ease-out"
          style={{
            transform:
              perspectiveMode === 'isometric'
                ? `scale(${zoomLevel}) rotateX(25deg) rotateZ(-3deg)`
                : `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          
          {/* SVG 3D Curved Flight Trajectories with Glowing Waypoints */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible">
            <defs>
              <linearGradient id="flight-trail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* Glowing waypoint filter */}
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Trajectory 1: Sumatera (16,32) -> Jawa (38,72) */}
            <path
              d="M 16% 36% Q 24% 62% 38% 72%"
              fill="none"
              stroke="#fde047"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="opacity-95 drop-shadow-md animate-pulse"
            />

            {/* Trajectory 2: Jawa (38,72) -> Bali (56,76) */}
            <path
              d="M 38% 72% Q 47% 78% 56% 76%"
              fill="none"
              stroke="#fde047"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="opacity-95 drop-shadow-md"
            />

            {/* Trajectory 3: Bali (56,76) -> Kalimantan (44,28) */}
            <path
              d="M 56% 76% Q 54% 50% 44% 32%"
              fill="none"
              stroke="#fde047"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="opacity-95 drop-shadow-md"
            />

            {/* Trajectory 4: Kalimantan (44,28) -> Sulawesi (74,42) */}
            <path
              d="M 44% 32% Q 60% 32% 74% 44%"
              fill="none"
              stroke="#fde047"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="opacity-95 drop-shadow-md"
            />

            {/* Trajectory Directional Arrows / Beacons */}
            <circle cx="27%" cy="52%" r="4" fill="#ffffff" className="animate-ping" />
            <circle cx="47%" cy="75%" r="4" fill="#ffffff" className="animate-ping" />
            <circle cx="50%" cy="50%" r="4" fill="#ffffff" className="animate-ping" />
            <circle cx="59%" cy="33%" r="4" fill="#ffffff" className="animate-ping" />
          </svg>

          {/* 5 Isometric Island Platforms */}
          {islands.map((island) => {
            const pos = islandPositions[island.id] || { x: 50, y: 50 };
            const isSelected = selectedIsland.id === island.id;
            const isCurrentActive = island.order === progress.currentIslandOrder;
            const stars = progress.islandStars[island.id] || 0;

            return (
              <div
                key={island.id}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <IsometricIslandPlate
                  island={island}
                  isSelected={isSelected}
                  isCurrentActive={isCurrentActive}
                  stars={stars}
                  timeOfDay={timeOfDay}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectIsland(island);
                  }}
                />
              </div>
            );
          })}

          {/* 2.5D Garuda Math-01 Airplane Flying Hovering Over Selected Island */}
          <div
            className="absolute z-40 transition-all duration-700 ease-out"
            style={{
              left: `${(islandPositions[selectedIsland.id]?.x || 50)}%`,
              top: `${(islandPositions[selectedIsland.id]?.y || 50) - 16}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <IsometricPlane pilotName={progress.childName || 'Garuda Math-01'} isFlying={true} />
          </div>

        </div>

        {/* Bottom Atmosphere Footer Info Pill */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white text-xs font-semibold flex items-center space-x-3 shadow-lg">
          <div className="flex items-center space-x-1.5 text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span className="font-extrabold">Ekspedisi Matematika 2.5D</span>
          </div>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-sky-200 hidden sm:inline">
            Klik pulau mana saja untuk melihat detail & lepas landas!
          </span>
        </div>

      </div>

      {/* Selected Island 2.5D Boarding Pass & Mission Dispatch Inspector */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100 shadow-xl relative overflow-hidden">
        
        {/* Top Boarding Pass Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedIsland.culturalMotif.color} text-white flex items-center justify-center text-3xl shadow-lg`}>
              {selectedIsland.culturalMotif.iconEmoji}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Penerbangan #{selectedIsland.order}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Kode: GA-0{selectedIsland.order}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {selectedIsland.name}
              </h2>
            </div>
          </div>

          {/* Status Chip & Stars */}
          <div className="flex items-center space-x-3">
            {selectedIsland.status === 'completed' && (
              <span className="inline-flex items-center space-x-1.5 text-emerald-700 bg-emerald-100 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Misi Tuntas</span>
              </span>
            )}
            {selectedIsland.status === 'unlocked' && (
              <span className="inline-flex items-center space-x-1.5 text-sky-700 bg-sky-100 text-xs font-black px-3 py-1.5 rounded-full border border-sky-200">
                <Plane className="w-4 h-4 transform -rotate-45" />
                <span>Siap Lepas Landas</span>
              </span>
            )}
            {selectedIsland.status === 'locked' && (
              <span className="inline-flex items-center space-x-1.5 text-slate-600 bg-slate-200 text-xs font-black px-3 py-1.5 rounded-full">
                <Lock className="w-4 h-4" />
                <span>Misi Terkunci</span>
              </span>
            )}

            {/* Stars */}
            <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`text-sm ${
                    s <= (progress.islandStars[selectedIsland.id] || 0)
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Mission Specs Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          
          {/* Column 1: Math Challenge Target */}
          <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-100 space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-700 font-extrabold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>MATERI MATEMATIKA</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              {selectedIsland.topicName}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedIsland.description}
            </p>
          </div>

          {/* Column 2: 2.5D Cultural & Landmark Highlights */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-800 font-extrabold text-xs">
              <span>🏛️</span>
              <span>IKON & CIRI KHAS 2.5D</span>
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm">
              {selectedIsland.culturalMotif.landmark}
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {selectedIsland.culturalMotif.funFact}
            </p>
          </div>

          {/* Column 3: Aviation Badge Reward */}
          <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs">
              <Award className="w-4 h-4" />
              <span>HADIAH LENCANA BUDAYA</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              {selectedIsland.culturalMotif.badgeName}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Selesaikan 5 soal tantangan dengan skor sempurna untuk menyegel stempel emas di paspormu!
            </p>
          </div>

        </div>

        {/* Flight Dispatch Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium flex items-center space-x-2">
            <span>✈️ Pesawat Ekspedisi: <strong>Garuda Math-01</strong></span>
            <span>•</span>
            <span>Bahan Bakar: <strong>{progress.fuel}%</strong></span>
          </div>

          <button
            id="isometric-takeoff-btn"
            disabled={selectedIsland.status === 'locked'}
            onClick={() => {
              soundManager.playTakeoff();
              onStartFlight(selectedIsland);
            }}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-xl transition-all ${
              selectedIsland.status === 'locked'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/30 transform hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>
              {selectedIsland.status === 'completed'
                ? 'Terbang Lagi (Latihan Ulang)'
                : `Lepas Landas ke ${selectedIsland.name}!`}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
