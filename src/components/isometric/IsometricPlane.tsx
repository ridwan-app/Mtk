import React from 'react';

interface IsometricPlaneProps {
  pilotName?: string;
  isFlying?: boolean;
}

export const IsometricPlane: React.FC<IsometricPlaneProps> = ({
  pilotName = 'Garuda Math-01',
  isFlying = false,
}) => {
  return (
    <div className="relative pointer-events-none select-none flex flex-col items-center">
      {/* Pilot Callout Tag */}
      <div className="mb-1 bg-slate-900/90 text-amber-300 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-amber-300/40 flex items-center space-x-1.5 backdrop-blur-md animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>✈️ {pilotName}</span>
      </div>

      {/* 2.5D Isometric Aircraft Body (SVG) */}
      <div className={`relative transition-transform duration-500 ${isFlying ? 'animate-bounce' : 'hover:-translate-y-1'}`}>
        
        {/* Soft Dropped Ground Shadow */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black/25 rounded-full blur-xs" />

        {/* 2.5D Plane SVG */}
        <svg viewBox="0 0 120 90" className="w-20 sm:w-24 md:w-28 h-auto overflow-visible drop-shadow-xl">
          <defs>
            {/* Fuselage White Gradient */}
            <linearGradient id="fuselage-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            {/* Fuselage Shaded Underbelly */}
            <linearGradient id="fuselage-side" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Aviation Red Stripe */}
            <linearGradient id="aviation-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            {/* Cockpit Windshield Glass */}
            <linearGradient id="cockpit-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Jet Engine Contrail Cloud Trail */}
          <g className="opacity-75">
            <ellipse cx="15" cy="55" rx="8" ry="3" fill="#ffffff" opacity="0.6" className="animate-pulse" />
            <ellipse cx="2" cy="58" rx="6" ry="2.5" fill="#ffffff" opacity="0.4" />
            <ellipse cx="-10" cy="60" rx="4" ry="2" fill="#ffffff" opacity="0.2" />
          </g>

          {/* Left Wing (Lower / Shaded) */}
          <polygon points="40,48 10,68 25,72 55,54" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8" />
          <polygon points="10,68 18,73 25,72 10,68" fill="#ef4444" /> {/* Red wingtip */}

          {/* Fuselage Underbelly & Side */}
          <path
            d="M 18,52 Q 60,62 102,38 L 92,30 Q 55,48 18,44 Z"
            fill="url(#fuselage-side)"
          />

          {/* Main Fuselage Top Deck */}
          <path
            d="M 18,44 Q 60,32 98,28 Q 108,32 102,38 Q 60,56 18,52 Z"
            fill="url(#fuselage-top)"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />

          {/* Indonesian Red Top Stripe across fuselage */}
          <path
            d="M 35,42 Q 65,34 94,30 L 98,34 Q 68,40 37,47 Z"
            fill="url(#aviation-red)"
          />

          {/* Cockpit Canopy Windshield */}
          <path
            d="M 80,30 Q 94,29 96,33 Q 92,38 78,35 Z"
            fill="url(#cockpit-glass)"
            stroke="#0369a1"
            strokeWidth="0.8"
          />
          {/* Glass Glint Reflection */}
          <line x1="84" y1="31" x2="90" y2="33" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Wing (Upper / Sunlit Isometric Projection) */}
          <polygon points="50,42 80,12 95,16 65,46" fill="url(#fuselage-top)" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Wing Red Tip */}
          <polygon points="80,12 88,8 95,16 80,12" fill="#ef4444" />
          {/* Wing Engine Nacelle */}
          <ellipse cx="68" cy="30" rx="6" ry="3" fill="#64748b" />
          <ellipse cx="72" cy="29" rx="3" ry="2" fill="#0284c7" />

          {/* Tail Fin (Vertical Stabilizer with Indonesian Flag) */}
          <polygon points="18,44 10,20 22,22 30,42" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          <polygon points="12,20 22,22 24,28 14,26" fill="#ef4444" /> {/* Red top half */}
          <polygon points="14,26 24,28 26,34 16,32" fill="#ffffff" /> {/* White bottom half */}

          {/* Horizontal Tail Stabilizers */}
          <polygon points="12,46 -2,42 2,39 16,43" fill="#cbd5e1" />

          {/* Propeller Spinner Hub & Spinning Rotor Blades */}
          <ellipse cx="102" cy="36" rx="3" ry="5" fill="#eab308" />
          <g className="animate-spin" style={{ transformOrigin: '102px 36px', animationDuration: '0.4s' }}>
            <line x1="102" y1="20" x2="102" y2="52" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
            <line x1="90" y1="36" x2="114" y2="36" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
          </g>

          {/* Beacon Light */}
          <circle cx="22" cy="22" r="2" fill="#ef4444" className="animate-ping" />
        </svg>

      </div>
    </div>
  );
};
