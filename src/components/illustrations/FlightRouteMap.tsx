import React, { useRef, useEffect } from 'react';
import { Island, ChildProgress } from '../../types';
import { PHASES } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { Plane, Star, Lock, ChevronRight, ChevronLeft, Wind, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { NusantaraCulturalIcon } from './NusantaraCulturalIcon';

interface FlightRouteMapProps {
  islands: Island[];
  progress: ChildProgress;
  onSelectIsland: (island: Island) => void;
  onStartFlight: (island: Island) => void;
}

export const FlightRouteMap: React.FC<FlightRouteMapProps> = ({
  islands,
  progress,
  onSelectIsland,
  onStartFlight: _onStartFlight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Phase info
  const activePhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];

  // Sort islands strictly by order (1 to N)
  const sortedIslands = [...islands].sort((a, b) => a.order - b.order);

  // Dynamic canvas width based on number of islands
  const MAP_WIDTH = sortedIslands.length > 6 ? 2500 : 2000;
  const MAP_HEIGHT = 760;

  // Find active island to center the scroll on initial load
  const currentActiveIsland =
    sortedIslands.find((i) => i.order === progress.currentIslandOrder) || sortedIslands[0];

  useEffect(() => {
    if (containerRef.current && currentActiveIsland) {
      const targetX = (currentActiveIsland.mapCoords.xPercent / 100) * MAP_WIDTH;
      const scrollTarget = targetX - containerRef.current.clientWidth / 2;
      containerRef.current.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [currentActiveIsland?.id, MAP_WIDTH]);

  const scrollMap = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const offset = direction === 'left' ? -420 : 420;
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Generate dynamic, mathematically curved high-altitude flight routes (Sky Airways)
  const flightPaths = sortedIslands.slice(0, -1).map((currentIsland, index) => {
    const nextIsland = sortedIslands[index + 1];

    const x1 = (currentIsland.mapCoords.xPercent / 100) * MAP_WIDTH;
    const y1 = (currentIsland.mapCoords.yPercent / 100) * MAP_HEIGHT;
    const x2 = (nextIsland.mapCoords.xPercent / 100) * MAP_WIDTH;
    const y2 = (nextIsland.mapCoords.yPercent / 100) * MAP_HEIGHT;

    // Calculate midpoint and distance
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Natural curved aviation flight arc (arching upward in the sky)
    const curvature = Math.min(130, Math.max(50, dist * 0.24));
    const cx = mx;
    const cy = my - curvature;

    // Angle of flight vector
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Midpoint along quadratic curve (t = 0.5)
    const midCurveX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
    const midCurveY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;

    const isCurrentCompleted = progress.completedIslands.includes(currentIsland.id);
    const isNextCompleted = progress.completedIslands.includes(nextIsland.id);
    const isSegmentCompleted = isCurrentCompleted && (isNextCompleted || nextIsland.order === progress.currentIslandOrder);
    const isSegmentActive =
      (currentIsland.order === progress.currentIslandOrder || isCurrentCompleted) &&
      nextIsland.order === progress.currentIslandOrder;

    return {
      id: `route-${currentIsland.id}-to-${nextIsland.id}`,
      d: `M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`,
      fromOrder: currentIsland.order,
      toOrder: nextIsland.order,
      fromName: currentIsland.name,
      toName: nextIsland.name,
      x1,
      y1,
      x2,
      y2,
      midCurveX,
      midCurveY,
      angleDeg,
      isSegmentCompleted,
      isSegmentActive,
      isLocked: !isSegmentCompleted && !isSegmentActive,
    };
  });

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 select-none bg-[#0369A1]">
      
      {/* 1. Floating Flight Cockpit HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        
        {/* Left Badge: Flight Altitude & Phase Info */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-xl flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-slate-900 text-xs sm:text-sm tracking-tight">
                Jalur Penerbangan Udara • {activePhase.title}
              </span>
              <span className="text-[11px] font-heading font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                {progress.completedIslands.length}/{sortedIslands.length} Pulau Tuntas ✈️
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold hidden sm:flex items-center space-x-2 mt-0.5">
              <span>✈️ Ketinggian Jelajah: 28.000 Kaki</span>
              <span>•</span>
              <span>Cuaca: Cerah Berawan ⛅</span>
            </p>
          </div>
        </div>

        {/* Right Badge: Navigation Controls & Wind Compass */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <button
            type="button"
            id="map-scroll-left-btn"
            onClick={() => scrollMap('left')}
            className="w-11 h-11 rounded-2xl bg-white/95 hover:bg-white text-slate-800 border-2 border-amber-300 shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Geser Peta ke Barat (Kiri)"
          >
            <ChevronLeft className="w-6 h-6 text-amber-900" />
          </button>
          <button
            type="button"
            id="map-scroll-right-btn"
            onClick={() => scrollMap('right')}
            className="w-11 h-11 rounded-2xl bg-white/95 hover:bg-white text-slate-800 border-2 border-amber-300 shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Geser Peta ke Timur (Kanan)"
          >
            <ChevronRight className="w-6 h-6 text-amber-900" />
          </button>
        </div>
      </div>

      {/* 2. Full-Bleed Scrollable Sky Flight Canvas */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className="relative bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] overflow-hidden"
          style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}
        >
          {/* A. Sky & Atmospheric Wind Currents SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Flight Altitude Radar Grid */}
              <pattern id="sky-radar-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.25" />
                <path d="M 60 0 L 60 120 M 0 60 L 120 60" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.15" />
              </pattern>

              {/* Jet Stream Gradient */}
              <linearGradient id="jetstream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#sky-radar-grid)" />

            {/* High-Altitude Wind / Jet Streams */}
            <path
              d="M -50 140 Q 400 80, 850 160 T 1700 120 T 2600 150"
              fill="none"
              stroke="url(#jetstream-grad)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 100 480 Q 600 420, 1100 500 T 1950 460 T 2600 520"
              fill="none"
              stroke="url(#jetstream-grad)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 0 620 Q 500 560, 1000 640 T 1800 600 T 2600 630"
              fill="none"
              stroke="url(#jetstream-grad)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>

          {/* B. Floating Fluffy Clouds & Aviation Sky Assets */}
          {/* Cloud Group 1 */}
          <div className="absolute top-12 left-16 text-6xl opacity-90 animate-float pointer-events-none select-none drop-shadow-md">
            ☁️
          </div>
          <div
            className="absolute top-28 left-[22%] text-7xl opacity-85 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '1.8s' }}
          >
            ☁️
          </div>
          <div
            className="absolute bottom-20 left-[18%] text-5xl opacity-80 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '3.2s' }}
          >
            ☁️
          </div>
          <div
            className="absolute top-10 left-[48%] text-8xl opacity-90 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '0.8s' }}
          >
            ☁️
          </div>
          <div
            className="absolute bottom-24 left-[58%] text-6xl opacity-85 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '2.4s' }}
          >
            ☁️
          </div>
          <div
            className="absolute top-16 left-[76%] text-7xl opacity-90 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '1.4s' }}
          >
            ☁️
          </div>
          <div
            className="absolute bottom-16 right-20 text-8xl opacity-90 animate-float pointer-events-none select-none drop-shadow-md"
            style={{ animationDelay: '3.6s' }}
          >
            ☁️
          </div>

          {/* Hot Air Balloons, Birds & Sunlight Elements */}
          <div
            className="absolute top-14 left-[32%] text-4xl animate-bounce pointer-events-none select-none drop-shadow-md"
            style={{ animationDuration: '4s' }}
          >
            🎈
          </div>
          <div
            className="absolute top-32 left-[66%] text-4xl animate-bounce pointer-events-none select-none drop-shadow-md"
            style={{ animationDuration: '5s' }}
          >
            🎈
          </div>
          <div className="absolute top-8 right-[28%] text-3xl pointer-events-none select-none opacity-80">
            🦅
          </div>
          <div className="absolute bottom-36 left-[8%] text-3xl pointer-events-none select-none opacity-80">
            🕊️
          </div>
          <div className="absolute top-6 right-10 text-5xl pointer-events-none select-none animate-pulse">
            ☀️
          </div>

          {/* Aviation Compass Rose HUD */}
          <div className="absolute bottom-8 left-8 pointer-events-none opacity-90 z-10">
            <div className="w-22 h-22 rounded-full bg-white/30 backdrop-blur-md border-2 border-white/60 flex items-center justify-center relative shadow-lg">
              <span className="absolute -top-3 text-[11px] font-heading font-black text-white bg-orange-600 px-1.5 py-0.2 rounded-md shadow-xs">
                U (North)
              </span>
              <span className="absolute -bottom-3 text-[10px] font-heading font-black text-sky-950">
                S
              </span>
              <span className="absolute -right-3 text-[10px] font-heading font-black text-sky-950">
                T
              </span>
              <span className="absolute -left-3 text-[10px] font-heading font-black text-sky-950">
                B
              </span>
              <Navigation className="w-9 h-9 text-amber-300 drop-shadow-md transform -rotate-45" />
            </div>
          </div>

          {/* C. DYNAMIC PRECISION FLIGHT ROUTE SVG LAYER */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          >
            <defs>
              <filter id="routeGlowSky" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render each curved flight path */}
            {flightPaths.map((route) => {
              const strokeColor = route.isSegmentCompleted
                ? '#10B981' // Completed flight: Emerald Green
                : route.isSegmentActive
                ? '#F59E0B' // Active mission: Brilliant Gold Amber
                : '#E0F2FE'; // Upcoming airway: Soft Cloud White

              const strokeWidth = route.isSegmentActive ? 6 : route.isSegmentCompleted ? 5 : 4;
              const strokeDash = route.isSegmentCompleted ? 'none' : '12 8';

              return (
                <g key={route.id}>
                  {/* Glowing halo trail */}
                  {(route.isSegmentActive || route.isSegmentCompleted) && (
                    <path
                      d={route.d}
                      fill="none"
                      stroke={route.isSegmentCompleted ? '#34D399' : '#FBBF24'}
                      strokeWidth={strokeWidth + 6}
                      strokeOpacity="0.5"
                      filter="url(#routeGlowSky)"
                    />
                  )}

                  {/* Main Flight Path */}
                  <path
                    d={route.d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                    className={route.isSegmentActive ? 'animate-pulse' : ''}
                  />

                  {/* Waypoint circles */}
                  <circle
                    cx={route.x1}
                    cy={route.y1}
                    r={route.isSegmentCompleted ? 8 : 6}
                    fill={route.isSegmentCompleted ? '#10B981' : '#F59E0B'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={route.x2}
                    cy={route.y2}
                    r={route.isSegmentCompleted ? 8 : 6}
                    fill={route.isSegmentCompleted ? '#10B981' : '#F59E0B'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />

                  {/* Animated Cruising Airplane along the curve */}
                  <g
                    transform={`translate(${route.midCurveX}, ${route.midCurveY}) rotate(${route.angleDeg})`}
                  >
                    {route.isSegmentActive ? (
                      <g className="animate-bounce">
                        {/* Glowing Active Airplane Pin */}
                        <circle cx="0" cy="0" r="16" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
                        <path
                          d="M -5 -7 L 7 0 L -5 7 Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    ) : route.isSegmentCompleted ? (
                      <g>
                        <circle cx="0" cy="0" r="12" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                        <path
                          d="M -3.5 -5 L 5 0 L -3.5 5 Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    ) : (
                      <g opacity="0.75">
                        <circle cx="0" cy="0" r="9" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                        <path
                          d="M -2.5 -4 L 3.5 0 L -2.5 4 Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>

          {/* D. MAXIMIZED ISLAND PLATES & PROMINENT CULTURAL ICONS */}
          {sortedIslands.map((island) => {
            const isCompleted = progress.completedIslands.includes(island.id);
            const isCurrent = island.order === progress.currentIslandOrder && !isCompleted;
            const isLocked =
              !isCompleted && !isCurrent && island.status === 'locked' && island.order > 1;
            const stars = progress.islandStars[island.id] || 0;

            const posX = (island.mapCoords.xPercent / 100) * MAP_WIDTH;
            const posY = (island.mapCoords.yPercent / 100) * MAP_HEIGHT;

            return (
              <div
                key={island.id}
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20"
              >
                <motion.div
                  whileHover={!isLocked ? { scale: 1.07 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectIsland(island);
                  }}
                  className={`group relative cursor-pointer flex flex-col items-center transition-all ${
                    isLocked ? 'opacity-70 filter grayscale-[70%]' : ''
                  }`}
                >
                  {/* Active Radar Ping Ripple Effect */}
                  {isCurrent && (
                    <div className="absolute -inset-6 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                  )}

                  {/* Island Frame Plate with MAXIMIZED ARTWORK & PROMINENT PRESENCE */}
                  <div className="relative">
                    
                    {/* Generous Island Landmass Base Plate (Maximized Size & Contrast) */}
                    <div
                      className={`w-40 h-32 sm:w-44 sm:h-36 rounded-3xl border-4 shadow-2xl flex flex-col items-center justify-between p-2.5 transition-all duration-300 overflow-hidden relative ${
                        isCompleted
                          ? 'bg-gradient-to-b from-[#ECFDF5] via-[#A7F3D0] to-[#059669] border-emerald-400 ring-4 ring-emerald-300/60 shadow-emerald-950/30'
                          : isCurrent
                          ? 'bg-gradient-to-b from-[#FFFBEB] via-[#FDE68A] to-[#D97706] border-amber-400 ring-4 ring-amber-400/80 shadow-orange-950/40 ring-offset-2 ring-offset-sky-400 animate-pulse'
                          : 'bg-gradient-to-b from-[#F8FAFC] via-[#CBD5E1] to-[#64748B] border-slate-300 shadow-slate-900/30'
                      }`}
                    >
                      {/* Top Island Badge: Stage Number & Icon */}
                      <div className="w-full flex items-center justify-between z-10">
                        <span className="text-[11px] font-heading font-black text-slate-900 px-2.5 py-0.5 rounded-full bg-white/90 shadow-xs border border-amber-400/40">
                          Tahap {island.order}
                        </span>
                        <span className="text-base filter drop-shadow-xs">
                          {island.icon}
                        </span>
                      </div>

                      {/* MAXIMIZED CULTURAL ICON / ISLAND ARTWORK (Fills the Frame Prominently) */}
                      <div className="my-auto transform group-hover:scale-110 transition-transform duration-200 z-10 flex items-center justify-center">
                        <NusantaraCulturalIcon
                          nameOrId={island.name || island.culturalMotif.title}
                          size="lg"
                          className="filter drop-shadow-md"
                        />
                      </div>

                      {/* Tropical Ground Texture Accent */}
                      <div className="w-full text-center z-10">
                        <span className="text-[10px] font-heading font-black text-slate-800 bg-white/85 px-2 py-0.5 rounded-lg border border-slate-300/60 truncate block max-w-[140px] mx-auto">
                          {island.culturalMotif.title}
                        </span>
                      </div>
                    </div>

                    {/* Parked Airplane on Active Mission Island */}
                    {isCurrent && (
                      <div className="absolute -top-6 -right-4 z-30 animate-bounce pointer-events-none">
                        <div className="bg-orange-500 text-white p-3 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center transform -rotate-12">
                          <Plane className="w-6 h-6 fill-white transform -rotate-45" />
                        </div>
                      </div>
                    )}

                    {/* Completed Island Stars Floating Badge */}
                    {isCompleted && (
                      <div className="absolute -top-3 -right-2 z-30 bg-emerald-600 text-white px-3 py-1 rounded-full border-2 border-white shadow-lg flex items-center space-x-1 text-xs font-heading font-black">
                        <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>{stars}/3</span>
                      </div>
                    )}

                    {/* Locked Island Padlock */}
                    {isLocked && (
                      <div className="absolute -top-2 -right-2 z-30 bg-slate-800 text-slate-100 p-2 rounded-full border-2 border-white shadow-lg">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* High-Contrast Floating Island Title Pill */}
                  <div className="mt-2.5 bg-white/95 px-3.5 py-1.5 rounded-2xl border-2 border-amber-300 shadow-lg text-center max-w-[160px]">
                    <span className="font-heading font-black text-xs sm:text-sm text-slate-900 block leading-tight">
                      Pulau {island.name}
                    </span>
                    <span className="text-[10px] font-heading font-bold text-orange-600 block truncate mt-0.5">
                      {island.topicName}
                    </span>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
