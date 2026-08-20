import React, { useRef, useEffect, useState } from 'react';
import { Island, ChildProgress } from '../../types';
import { PHASES } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { Plane, Star, Lock, ChevronUp, ChevronDown, Target, Sparkles, Navigation } from 'lucide-react';
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
  const [containerWidth, setContainerWidth] = useState<number>(760);

  // Measure container width dynamically for pixel-perfect responsive alignment on both mobile & desktop
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          setContainerWidth(measured);
        }
      }
    };

    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Active Phase info
  const activePhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];

  // Sort islands strictly by order (1 to N)
  const sortedIslands = [...islands].sort((a, b) => a.order - b.order);

  // Responsive layout measurements
  const isMobile = containerWidth < 520;
  
  const MAP_WIDTH = containerWidth;
  const STEP_HEIGHT = isMobile ? 220 : 260;
  const TOP_PADDING = isMobile ? 150 : 180;
  const BOTTOM_PADDING = isMobile ? 160 : 200;
  const MAP_HEIGHT = TOP_PADDING + Math.max(1, sortedIslands.length - 1) * STEP_HEIGHT + BOTTOM_PADDING;

  // Safe margin calculations so cards never clip or overflow screen boundaries
  const cardHalfWidth = isMobile ? 68 : 88;
  const safeMargin = cardHalfWidth + 12;

  // Calculate coordinates for each island climbing vertically (Tahap 1 at bottom, Tahap N at top)
  const islandPositions = sortedIslands.map((island, index) => {
    // Y-coordinate: Bottom is Index 0 (Tahap 1), Top is Index N-1 (Tahap Terakhir)
    const posY = MAP_HEIGHT - BOTTOM_PADDING - index * STEP_HEIGHT;

    // X-coordinate: Alternating zig-zag curve safely centered for organic flight path
    const isEven = index % 2 === 0;
    
    // Left column vs Right column anchor
    let posX: number;
    if (isEven) {
      posX = Math.max(safeMargin, MAP_WIDTH * (isMobile ? 0.27 : 0.32));
    } else {
      posX = Math.min(MAP_WIDTH - safeMargin, MAP_WIDTH * (isMobile ? 0.73 : 0.68));
    }

    return {
      island,
      index,
      posX,
      posY,
      altitudeFeet: 5000 + index * 5000,
    };
  });

  // Find active island to center the vertical scroll on initial load
  const currentActiveIsland =
    sortedIslands.find((i) => i.order === progress.currentIslandOrder) || sortedIslands[0];
  const activePosition =
    islandPositions.find((p) => p.island.id === currentActiveIsland?.id) || islandPositions[0];

  const scrollToPosition = (targetY: number) => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const scrollTarget = targetY - containerHeight / 2;
      containerRef.current.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  };

  const focusActiveMission = () => {
    if (activePosition) {
      soundManager.playClick();
      scrollToPosition(activePosition.posY);
    }
  };

  useEffect(() => {
    if (activePosition) {
      const timer = setTimeout(() => {
        scrollToPosition(activePosition.posY);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activePosition?.island.id, MAP_HEIGHT]);

  const scrollMapVertical = (direction: 'up' | 'down') => {
    if (containerRef.current) {
      soundManager.playClick();
      const offset = direction === 'up' ? -320 : 320;
      containerRef.current.scrollBy({ top: offset, behavior: 'smooth' });
    }
  };

  // Generate dynamic, firm & bold flight routes connecting each island vertically
  const flightPaths = islandPositions.slice(0, -1).map((currentPos, index) => {
    const nextPos = islandPositions[index + 1];

    const x1 = currentPos.posX;
    const y1 = currentPos.posY;
    const x2 = nextPos.posX;
    const y2 = nextPos.posY;

    // Cubic Bézier S-curve connecting upwards
    const dy = y2 - y1; // negative value since y2 is higher
    const cp1x = x1;
    const cp1y = y1 + dy * 0.5;
    const cp2x = x2;
    const cp2y = y1 + dy * 0.5;

    const d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

    // Midpoint on cubic curve at t = 0.5
    const midX = 0.125 * x1 + 0.375 * cp1x + 0.375 * cp2x + 0.125 * x2;
    const midY = 0.125 * y1 + 0.375 * cp1y + 0.375 * cp2y + 0.125 * y2;

    // Flight vector angle pointing towards next destination
    const angleRad = Math.atan2(y2 - y1, x2 - x1);
    const angleDeg = (angleRad * 180) / Math.PI;

    const isCurrentCompleted = progress.completedIslands.includes(currentPos.island.id);
    const isNextCompleted = progress.completedIslands.includes(nextPos.island.id);
    const isSegmentCompleted = isCurrentCompleted && (isNextCompleted || nextPos.island.order === progress.currentIslandOrder);
    const isSegmentActive =
      (currentPos.island.order === progress.currentIslandOrder || isCurrentCompleted) &&
      nextPos.island.order === progress.currentIslandOrder;

    return {
      id: `route-${currentPos.island.id}-to-${nextPos.island.id}`,
      d,
      fromOrder: currentPos.island.order,
      toOrder: nextPos.island.order,
      fromName: currentPos.island.name,
      toName: nextPos.island.name,
      x1,
      y1,
      x2,
      y2,
      midX,
      midY,
      angleDeg,
      isSegmentCompleted,
      isSegmentActive,
      isLocked: !isSegmentCompleted && !isSegmentActive,
    };
  });

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-300 select-none bg-[#0369A1]">
      
      {/* 1. Floating Flight Cockpit HUD Header Overlay */}
      <div className="sticky top-2 sm:top-3 z-30 px-2 sm:px-4 flex items-center justify-between pointer-events-none gap-2">
        
        {/* Left Badge: Flight Info */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl border-2 border-amber-300 shadow-xl flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-base sm:text-xl shadow-xs shrink-0">
            <Plane className="w-4 h-4 sm:w-6 sm:h-6 transform -rotate-45" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="font-heading font-black text-slate-900 text-[11px] sm:text-sm tracking-tight truncate">
                {activePhase.title}
              </span>
              <span className="text-[9px] sm:text-[11px] font-heading font-black bg-amber-100 text-amber-900 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                {progress.completedIslands.length}/{sortedIslands.length} ✈️
              </span>
            </div>
            <p className="text-[9px] text-slate-600 font-bold hidden sm:flex items-center space-x-1.5 mt-0.5">
              <span>🚀 Geser ke atas untuk terbang ke pulau berikutnya!</span>
            </p>
          </div>
        </div>

        {/* Right Badge: Vertical Quick Jump Controls */}
        <div className="pointer-events-auto flex items-center space-x-1 sm:space-x-2 shrink-0">
          
          {/* Focus on My Active Position Button */}
          <button
            type="button"
            id="focus-active-island-btn"
            onClick={focusActiveMission}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 border-2 border-amber-500 shadow-lg flex items-center space-x-1 cursor-pointer transition-all active:scale-95 text-[11px] sm:text-xs font-heading font-black min-h-[38px] sm:min-h-[44px]"
            title="Arahkan Peta ke Misi Aktif Saya"
          >
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950" />
            <span className="hidden xs:inline sm:inline">Misi Saya</span>
          </button>

          {/* Scroll Up Button */}
          <button
            type="button"
            id="map-scroll-up-btn"
            onClick={() => scrollMapVertical('up')}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-slate-800 border-2 border-amber-300 shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 min-h-[38px] sm:min-h-[44px]"
            title="Geser Peta ke Atas (Pulau Berikutnya)"
          >
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" />
          </button>

          {/* Scroll Down Button */}
          <button
            type="button"
            id="map-scroll-down-btn"
            onClick={() => scrollMapVertical('down')}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white text-slate-800 border-2 border-amber-300 shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 min-h-[38px] sm:min-h-[44px]"
            title="Geser Peta ke Bawah (Pulau Sebelumnya)"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" />
          </button>
        </div>
      </div>

      {/* 2. Vertical Scrollable Sky Adventure Canvas */}
      <div
        ref={containerRef}
        className="w-full max-h-[76vh] sm:max-h-[78vh] overflow-y-auto overflow-x-hidden scrollbar-none relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className="relative mx-auto bg-gradient-to-t from-[#0369A1] via-[#0284C7] via-50% via-[#38BDF8] via-80% to-[#1E1B4B] overflow-hidden"
          style={{ width: '100%', height: `${MAP_HEIGHT}px` }}
        >
          {/* A. Atmospheric Background Altitude Bands & SVG Radar Grid */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="vert-radar-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.2" />
                <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.12" />
              </pattern>

              <linearGradient id="stream-upward" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#vert-radar-grid)" />

            {/* Vertical Atmospheric Jet Currents */}
            <path
              d={`M ${MAP_WIDTH * 0.15} 0 Q ${MAP_WIDTH * 0.1} 400, ${MAP_WIDTH * 0.18} 800 T ${MAP_WIDTH * 0.12} 1600 T ${MAP_WIDTH * 0.16} 2400`}
              fill="none"
              stroke="url(#stream-upward)"
              strokeWidth={isMobile ? 16 : 24}
              strokeLinecap="round"
            />
            <path
              d={`M ${MAP_WIDTH * 0.85} 0 Q ${MAP_WIDTH * 0.9} 400, ${MAP_WIDTH * 0.82} 800 T ${MAP_WIDTH * 0.88} 1600 T ${MAP_WIDTH * 0.84} 2400`}
              fill="none"
              stroke="url(#stream-upward)"
              strokeWidth={isMobile ? 18 : 28}
              strokeLinecap="round"
            />
          </svg>

          {/* B. Altitude Markers & Sky Landmarks */}
          {/* 1. Puncak Angkasa (Top Milestone) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center pointer-events-none w-11/12 max-w-sm">
            <div className="bg-indigo-900/90 text-amber-300 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border-2 border-amber-400 shadow-xl flex items-center space-x-1.5 text-[10px] sm:text-xs font-heading font-black animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">Puncak Angkasa Nusantara • 35.000 FT</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </div>
            <div className="flex items-center space-x-2 text-amber-200 text-xs sm:text-sm mt-1">
              <span>🌟 Bintang Khatulistiwa 🌟</span>
            </div>
          </div>

          {/* 2. Bandara Lepas Landas (Bottom Milestone) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center pointer-events-none w-11/12 max-w-sm">
            <div className="bg-sky-900/90 text-white px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border-2 border-amber-300 shadow-xl flex items-center space-x-1.5 text-[10px] sm:text-xs font-heading font-black">
              <span>🛫</span>
              <span className="truncate">Pangkalan Penerbang Nusantara</span>
              <span>✈️</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-sky-200 font-bold mt-0.5">Mulai Petualangan dari Tahap 1</span>
          </div>

          {/* C. Decorative Floating Cloud Assets */}
          {islandPositions.map((pos, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <React.Fragment key={`deco-${pos.island.id}`}>
                <div
                  className="absolute text-4xl sm:text-6xl opacity-75 animate-float pointer-events-none select-none drop-shadow-md z-0"
                  style={{
                    top: `${pos.posY - 30}px`,
                    [isLeft ? 'right' : 'left']: '4%',
                    animationDelay: `${(idx * 0.7) % 3}s`,
                  }}
                >
                  ☁️
                </div>

                {/* Altitude Tag on the side (desktop) */}
                <div
                  className="absolute z-0 pointer-events-none opacity-60 hidden md:flex items-center space-x-1 text-[10px] font-heading font-black text-white/90 bg-sky-950/40 px-2 py-0.5 rounded-md border border-white/20"
                  style={{
                    top: `${pos.posY}px`,
                    [isLeft ? 'left' : 'right']: '3%',
                  }}
                >
                  <Navigation className="w-3 h-3 text-amber-300 transform -rotate-45" />
                  <span>{pos.altitudeFeet.toLocaleString('id-ID')} FT</span>
                </div>
              </React.Fragment>
            );
          })}

          {/* D. SVG FLIGHT ROUTE LAYER (TEGAS, MENARIK, BOLD & GLOWING UPWARD) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Neon Glow Filter */}
              <filter id="routeGlowSky" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render each upward curved flight route segment */}
            {flightPaths.map((route) => {
              const strokeColor = route.isSegmentCompleted
                ? '#10B981' // Completed: Emerald Green
                : route.isSegmentActive
                ? '#F59E0B' // Active mission: Brilliant Gold Amber
                : '#E0F2FE'; // Future airway: High-Contrast Crisp Cloud White

              const strokeWidth = route.isSegmentActive
                ? (isMobile ? 5 : 7)
                : route.isSegmentCompleted
                ? (isMobile ? 4.5 : 6)
                : (isMobile ? 3.5 : 5);
              const strokeDash = route.isSegmentCompleted ? 'none' : '12 8';

              return (
                <g key={route.id}>
                  {/* 1. Underlying Bold Shadow Outline for High Contrast */}
                  <path
                    d={route.d}
                    fill="none"
                    stroke="#0C4A6E"
                    strokeWidth={strokeWidth + (isMobile ? 3 : 4)}
                    strokeLinecap="round"
                    opacity="0.6"
                  />

                  {/* 2. Glowing Halo for Active/Completed segments */}
                  {(route.isSegmentActive || route.isSegmentCompleted) && (
                    <path
                      d={route.d}
                      fill="none"
                      stroke={route.isSegmentCompleted ? '#34D399' : '#FBBF24'}
                      strokeWidth={strokeWidth + (isMobile ? 5 : 8)}
                      strokeOpacity="0.6"
                      filter="url(#routeGlowSky)"
                    />
                  )}

                  {/* 3. Main Flight Path (Firm, Crisp, Bold) */}
                  <path
                    d={route.d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                    className={route.isSegmentActive ? 'animate-pulse' : ''}
                  />

                  {/* 4. Waypoint Node Dots */}
                  <circle
                    cx={route.x1}
                    cy={route.y1}
                    r={route.isSegmentCompleted ? (isMobile ? 7 : 9) : (isMobile ? 5 : 7)}
                    fill={route.isSegmentCompleted ? '#10B981' : '#F59E0B'}
                    stroke="#FFFFFF"
                    strokeWidth={isMobile ? '2' : '3'}
                  />
                  <circle
                    cx={route.x2}
                    cy={route.y2}
                    r={route.isSegmentCompleted ? (isMobile ? 7 : 9) : (isMobile ? 5 : 7)}
                    fill={route.isSegmentCompleted ? '#10B981' : '#F59E0B'}
                    stroke="#FFFFFF"
                    strokeWidth={isMobile ? '2' : '3'}
                  />

                  {/* 5. Animated Directional Airplane Icon Mid-Flight */}
                  <g transform={`translate(${route.midX}, ${route.midY}) rotate(${route.angleDeg})`}>
                    {route.isSegmentActive ? (
                      <g className="animate-bounce">
                        <circle
                          cx="0"
                          cy="0"
                          r={isMobile ? 14 : 18}
                          fill="#F97316"
                          stroke="#FFFFFF"
                          strokeWidth={isMobile ? 2 : 3}
                          className="drop-shadow-lg"
                        />
                        <path
                          d={isMobile ? "M -4 -6 L 6 0 L -4 6 Z" : "M -6 -8 L 8 0 L -6 8 Z"}
                          fill="#FFFFFF"
                        />
                      </g>
                    ) : route.isSegmentCompleted ? (
                      <g>
                        <circle
                          cx="0"
                          cy="0"
                          r={isMobile ? 11 : 14}
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth={isMobile ? 1.8 : 2.5}
                          className="drop-shadow-md"
                        />
                        <path
                          d={isMobile ? "M -3 -4.5 L 4.5 0 L -3 4.5 Z" : "M -4 -6 L 6 0 L -4 6 Z"}
                          fill="#FFFFFF"
                        />
                      </g>
                    ) : (
                      <g opacity="0.85">
                        <circle
                          cx="0"
                          cy="0"
                          r={isMobile ? 9 : 11}
                          fill="#0284C7"
                          stroke="#FFFFFF"
                          strokeWidth={isMobile ? 1.5 : 2}
                        />
                        <path
                          d={isMobile ? "M -2.5 -3.5 L 3.5 0 L -2.5 3.5 Z" : "M -3 -5 L 5 0 L -3 5 Z"}
                          fill="#FFFFFF"
                        />
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>

          {/* E. RESPONSIVE ISLAND CARDS (SEMUA IKON, BUDAYA & TEMA ASLI DIPERTAHANKAN) */}
          {islandPositions.map(({ island, posX, posY }) => {
            const isCompleted = progress.completedIslands.includes(island.id);
            const isCurrent = island.order === progress.currentIslandOrder && !isCompleted;
            const isLocked =
              !isCompleted && !isCurrent && island.status === 'locked' && island.order > 1;
            const stars = progress.islandStars[island.id] || 0;

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
                  whileHover={!isLocked ? { scale: 1.06 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectIsland(island);
                  }}
                  className={`group relative cursor-pointer flex flex-col items-center transition-all ${
                    isLocked ? 'opacity-75 filter grayscale-[65%]' : ''
                  }`}
                >
                  {/* Active Radar Ping Ripple Effect */}
                  {isCurrent && (
                    <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                  )}

                  {/* Island Frame Plate with Original Maximized Cultural Motif Icon */}
                  <div className="relative">
                    
                    {/* Generous Island Landmass Base Plate (Responsive sizing for mobile) */}
                    <div
                      className={`w-[136px] h-[112px] sm:w-44 sm:h-36 rounded-2xl sm:rounded-3xl border-3 sm:border-4 shadow-xl sm:shadow-2xl flex flex-col items-center justify-between p-2 sm:p-2.5 transition-all duration-300 overflow-hidden relative ${
                        isCompleted
                          ? 'bg-gradient-to-b from-[#ECFDF5] via-[#A7F3D0] to-[#059669] border-emerald-400 ring-3 sm:ring-4 ring-emerald-300/60 shadow-emerald-950/30'
                          : isCurrent
                          ? 'bg-gradient-to-b from-[#FFFBEB] via-[#FDE68A] to-[#D97706] border-amber-400 ring-3 sm:ring-4 ring-amber-400/90 shadow-orange-950/40 ring-offset-2 ring-offset-sky-400 animate-pulse'
                          : 'bg-gradient-to-b from-[#F8FAFC] via-[#CBD5E1] to-[#64748B] border-slate-300 shadow-slate-900/30'
                      }`}
                    >
                      {/* Top Island Badge: Stage Number & Topic Icon */}
                      <div className="w-full flex items-center justify-between z-10">
                        <span className="text-[9px] sm:text-[11px] font-heading font-black text-slate-900 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/90 shadow-xs border border-amber-400/40">
                          Tahap {island.order}
                        </span>
                        <span className="text-sm sm:text-base filter drop-shadow-xs">
                          {island.icon}
                        </span>
                      </div>

                      {/* MAXIMIZED CULTURAL ICON / ISLAND ARTWORK */}
                      <div className="my-auto transform group-hover:scale-105 transition-transform duration-200 z-10 flex items-center justify-center">
                        <NusantaraCulturalIcon
                          nameOrId={island.name || island.culturalMotif.title}
                          size={isMobile ? 'md' : 'lg'}
                          className="filter drop-shadow-md"
                        />
                      </div>

                      {/* Cultural Landmark Subtitle Accent */}
                      <div className="w-full text-center z-10">
                        <span className="text-[9px] sm:text-[10px] font-heading font-black text-slate-800 bg-white/90 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border border-slate-300/60 truncate block max-w-[120px] sm:max-w-[150px] mx-auto">
                          {island.culturalMotif.title}
                        </span>
                      </div>
                    </div>

                    {/* Parked Airplane on Active Mission Island */}
                    {isCurrent && (
                      <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-3 z-30 animate-bounce pointer-events-none">
                        <div className="bg-orange-500 text-white p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center transform -rotate-12">
                          <Plane className="w-4 h-4 sm:w-5 sm:h-5 fill-white transform -rotate-45" />
                        </div>
                      </div>
                    )}

                    {/* Completed Island Stars Floating Badge */}
                    {isCompleted && (
                      <div className="absolute -top-2.5 -right-1.5 sm:-top-3 sm:-right-2 z-30 bg-emerald-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border-2 border-white shadow-lg flex items-center space-x-1 text-[10px] sm:text-xs font-heading font-black">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300" />
                        <span>{stars}/3</span>
                      </div>
                    )}

                    {/* Locked Island Padlock */}
                    {isLocked && (
                      <div className="absolute -top-2 -right-1.5 sm:-top-2 sm:-right-2 z-30 bg-slate-800 text-slate-100 p-1.5 sm:p-2 rounded-full border-2 border-white shadow-lg">
                        <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* High-Contrast Floating Island Title Pill */}
                  <div className="mt-1.5 sm:mt-2 bg-white/95 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border-2 border-amber-300 shadow-md sm:shadow-lg text-center max-w-[136px] sm:max-w-[160px]">
                    <span className="font-heading font-black text-[11px] sm:text-sm text-slate-900 block leading-tight truncate">
                      Pulau {island.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-heading font-bold text-orange-600 block truncate mt-0.5">
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
