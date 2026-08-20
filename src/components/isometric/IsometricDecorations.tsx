import React from 'react';

interface IsometricDecorationsProps {
  timeOfDay: 'day' | 'sunset' | 'night';
}

export const IsometricDecorations: React.FC<IsometricDecorationsProps> = ({ timeOfDay }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      
      {/* 1. Ambient Ocean Waves & Caustic Reflections */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="iso-ocean-waves" width="80" height="40" patternUnits="userSpaceOnUse">
            {/* Isometric diamond wave crests */}
            <path
              d="M 0 20 L 40 0 L 80 20 L 40 40 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="4 8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-ocean-waves)" />
      </svg>

      {/* 2. Leaping Dolphin Pair (Near Bali/Jawa waters) */}
      <div className="absolute left-[34%] top-[82%] sm:left-[36%] sm:top-[80%] flex items-center space-x-2">
        <div className="animate-bounce" style={{ animationDuration: '4s' }}>
          <svg viewBox="0 0 40 30" className="w-8 h-6 overflow-visible opacity-90 drop-shadow-md">
            {/* Splash Ring */}
            <ellipse cx="20" cy="24" rx="14" ry="4" fill="none" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
            {/* Dolphin Body */}
            <path
              d="M 5,22 Q 18,2 32,12 Q 36,15 38,18 Q 30,16 22,20 Z"
              fill="#38bdf8"
              stroke="#0284c7"
              strokeWidth="1"
            />
            {/* Dorsal Fin */}
            <polygon points="18,10 22,3 25,12" fill="#0284c7" />
            {/* Tail Fluke */}
            <polygon points="5,22 0,18 4,26" fill="#0284c7" />
          </svg>
        </div>
      </div>

      {/* 3. Traditional Jukung / Perahu Cadik (Near Sulawesi/Kalimantan Waters) */}
      <div className="absolute left-[62%] top-[30%] sm:left-[60%] sm:top-[28%] opacity-85">
        <svg viewBox="0 0 50 35" className="w-10 h-7 drop-shadow-lg">
          {/* Shadow */}
          <ellipse cx="25" cy="28" rx="20" ry="5" fill="#000000" opacity="0.25" />
          {/* Wooden Canoe Body */}
          <path d="M 5,22 Q 25,28 45,22 L 40,26 Q 25,30 10,26 Z" fill="#78350f" />
          {/* Outrigger Floats (Cadik Bambu) */}
          <line x1="8" y1="20" x2="42" y2="20" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="12" y1="20" x2="16" y2="24" stroke="#ca8a04" strokeWidth="1.2" />
          <line x1="34" y1="20" x2="38" y2="24" stroke="#ca8a04" strokeWidth="1.2" />
          {/* Triangle Sail */}
          <polygon points="25,5 38,20 22,20" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
        </svg>
      </div>

      {/* 4. Marine Navigation Buoy with Flashing Beacon (Near Sumatera/Java Strait) */}
      <div className="absolute left-[28%] top-[56%] sm:left-[30%] sm:top-[54%]">
        <svg viewBox="0 0 30 40" className="w-6 h-8 drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="15" cy="34" rx="10" ry="4" fill="#000000" opacity="0.25" />
          {/* Floating Ring Base */}
          <ellipse cx="15" cy="30" rx="12" ry="5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          {/* Red-White Beacon Tower */}
          <polygon points="10,30 13,10 17,10 20,30" fill="#ef4444" />
          <rect x="11.5" y="16" width="7" height="6" fill="#ffffff" />
          {/* Light Lantern Top */}
          <circle cx="15" cy="8" r="3.5" fill="#fde047" className="animate-ping" />
          <circle cx="15" cy="8" r="2.5" fill="#facc15" />
        </svg>
      </div>

      {/* 5. Floating Volumetric 2.5D Clouds with Ground Shadows */}
      {/* Cloud 1 (Top-Left floating over ocean) */}
      <div
        className="absolute top-8 left-12 sm:left-24 animate-pulse select-none"
        style={{ animationDuration: '6s' }}
      >
        <div className="relative">
          {/* Projected Ground Shadow */}
          <div className="absolute top-16 left-4 w-28 h-10 bg-black/15 rounded-full blur-xs" />
          
          {/* 2.5D Fluffy Cloud Cluster */}
          <svg viewBox="0 0 100 50" className="w-24 sm:w-32 h-auto drop-shadow-lg opacity-80">
            <ellipse cx="50" cy="30" rx="38" ry="16" fill="#ffffff" />
            <circle cx="34" cy="22" r="16" fill="#f8fafc" />
            <circle cx="56" cy="18" r="18" fill="#ffffff" />
            <circle cx="70" cy="25" r="13" fill="#f1f5f9" />
          </svg>
        </div>
      </div>

      {/* Cloud 2 (Bottom-Right drifting) */}
      <div
        className="absolute bottom-16 right-16 sm:right-28 select-none opacity-70"
      >
        <div className="relative">
          <div className="absolute top-14 left-4 w-32 h-10 bg-black/15 rounded-full blur-xs" />
          <svg viewBox="0 0 110 50" className="w-28 sm:w-36 h-auto drop-shadow-lg">
            <ellipse cx="55" cy="30" rx="42" ry="15" fill="#ffffff" />
            <circle cx="38" cy="20" r="18" fill="#ffffff" />
            <circle cx="62" cy="16" r="20" fill="#f8fafc" />
            <circle cx="80" cy="24" r="14" fill="#f1f5f9" />
          </svg>
        </div>
      </div>

      {/* Cloud 3 (Mid Center Altitude) */}
      <div className="absolute top-[48%] left-[5%] select-none opacity-60">
        <svg viewBox="0 0 80 40" className="w-20 sm:w-24 h-auto">
          <ellipse cx="40" cy="24" rx="30" ry="12" fill="#ffffff" />
          <circle cx="30" cy="16" r="14" fill="#ffffff" />
          <circle cx="50" cy="14" r="15" fill="#f8fafc" />
        </svg>
      </div>

      {/* 6. Night Sky Starlight & Constellations (if night mode) */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0">
          <div className="absolute top-6 left-1/4 text-amber-200 text-xs animate-ping">✨</div>
          <div className="absolute top-16 right-1/3 text-amber-200 text-xs animate-pulse">⭐</div>
          <div className="absolute top-1/3 right-1/4 text-amber-200 text-sm animate-ping">✨</div>
          <div className="absolute bottom-1/4 left-1/3 text-amber-200 text-xs animate-pulse">⭐</div>
          <div className="absolute top-1/2 right-12 text-amber-200 text-xs animate-ping">✨</div>
        </div>
      )}
    </div>
  );
};
