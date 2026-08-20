import React from 'react';

interface IslandVectorArtProps {
  islandId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const IslandVectorArt: React.FC<IslandVectorArtProps> = ({
  islandId,
  className = '',
  size = 'md',
}) => {
  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-44 h-32 sm:w-52 sm:h-36',
    lg: 'w-full h-48 sm:h-56',
    full: 'w-full h-full',
  }[size];

  const lower = (islandId || '').toLowerCase();

  // 1. SUMATERA (Rumah Gadang Minangkabau & Danau Toba)
  if (lower.includes('sumatera')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="sumateraLand" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="sumateraLake" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="gonjongArt" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>

          {/* Tropical Island Base */}
          <ellipse cx="150" cy="155" rx="135" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="145" rx="128" ry="36" fill="#FDE68A" />
          <path
            d="M 45 140 C 35 100, 90 70, 150 75 C 220 80, 265 110, 250 145 C 230 170, 75 170, 45 140 Z"
            fill="url(#sumateraLand)"
          />

          {/* Danau Toba Blue Crater Lake */}
          <ellipse cx="85" cy="130" rx="28" ry="14" fill="url(#sumateraLake)" stroke="#E0F2FE" strokeWidth="2" />
          <ellipse cx="85" cy="130" rx="9" ry="5" fill="#10B981" />

          {/* Authentic Rumah Gadang Minangkabau Vector */}
          <g transform="translate(145, 70)">
            {/* 4 Pointed Gonjong Horns */}
            <path d="M 0 25 C 10 32, 20 38, 25 40 C 20 32, 12 26, 0 25 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
            <path d="M 22 14 C 28 24, 34 32, 40 34 C 34 26, 28 18, 22 14 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
            <path d="M 78 14 C 72 24, 66 32, 60 34 C 66 26, 72 18, 78 14 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
            <path d="M 100 25 C 90 32, 80 38, 75 40 C 80 32, 88 26, 100 25 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
            
            {/* Main Roof Arch */}
            <path
              d="M 5 36 C 25 46, 75 46, 95 36 C 88 26, 68 22, 50 28 C 32 22, 12 26, 5 36 Z"
              fill="url(#gonjongArt)"
              stroke="#7F1D1D"
              strokeWidth="1.5"
            />
            <path d="M 10 37 Q 50 45 90 37" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

            {/* House Body */}
            <rect x="18" y="44" width="64" height="24" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            {/* Minang Carvings & Windows */}
            <line x1="22" y1="52" x2="78" y2="52" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" />
            <rect x="25" y="56" width="8" height="8" rx="1" fill="#FEF3C7" />
            <rect x="46" y="54" width="8" height="14" rx="1" fill="#FEF3C7" />
            <rect x="67" y="56" width="8" height="8" rx="1" fill="#FEF3C7" />

            {/* Wooden Stilts */}
            <line x1="22" y1="68" x2="22" y2="78" stroke="#451A03" strokeWidth="2.5" />
            <line x1="38" y1="68" x2="38" y2="78" stroke="#451A03" strokeWidth="2.5" />
            <line x1="62" y1="68" x2="62" y2="78" stroke="#451A03" strokeWidth="2.5" />
            <line x1="78" y1="68" x2="78" y2="78" stroke="#451A03" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 2. JAWA (Candi Borobudur Megah)
  if (lower.includes('jawa')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="jawaLand" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          <ellipse cx="150" cy="155" rx="140" ry="36" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="132" ry="32" fill="#FDE68A" />
          <path
            d="M 35 140 C 40 110, 110 85, 170 90 C 230 95, 270 120, 260 145 C 240 165, 80 165, 35 140 Z"
            fill="url(#jawaLand)"
          />

          {/* Gunung Merapi di kejauhan */}
          <polygon points="190,135 225,80 260,135" fill="#475569" />
          <polygon points="215,95 225,80 235,95" fill="#E2E8F0" />

          {/* Candi Borobudur Berundak */}
          <g transform="translate(75, 70)">
            <rect x="0" y="52" width="100" height="14" rx="2" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="12" y="38" width="76" height="14" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="24" y="24" width="52" height="14" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Stupa Kecil */}
            <circle cx="18" cy="38" r="4" fill="#94A3B8" />
            <circle cx="82" cy="38" r="4" fill="#94A3B8" />
            <circle cx="30" cy="24" r="4" fill="#94A3B8" />
            <circle cx="70" cy="24" r="4" fill="#94A3B8" />

            {/* Stupa Induk Utama */}
            <path d="M 36 24 C 36 6, 44 0, 50 0 C 56 0, 64 6, 64 24 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="48" y="-10" width="4" height="12" rx="1" fill="#FBBF24" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. BALI (Gapura Candi Bentar & Pura Meru)
  if (lower.includes('bali')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="125" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="118" ry="34" fill="#FEF08A" />
          <path
            d="M 60 145 C 50 100, 100 80, 160 85 C 220 90, 245 115, 235 145 C 220 170, 90 170, 60 145 Z"
            fill="#16A34A"
          />

          {/* Pura Meru Tumpang */}
          <g transform="translate(100, 50)">
            <polygon points="25,12 18,22 32,22" fill="#1E293B" />
            <polygon points="25,18 12,30 38,30" fill="#1E293B" />
            <polygon points="25,26 6,40 44,40" fill="#1E293B" />
            <polygon points="25,36 0,52 50,52" fill="#1E293B" />
            <rect x="10" y="52" width="30" height="25" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          </g>

          {/* Candi Bentar Split Gate Bali */}
          <g transform="translate(165, 65)">
            {/* Left Pillar */}
            <path d="M 0 65 L 0 50 L 5 50 L 5 38 L 10 38 L 10 24 L 16 16 L 22 16 L 22 65 Z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.2" />
            {/* Right Pillar */}
            <path d="M 52 65 L 52 50 L 47 50 L 47 38 L 42 38 L 42 24 L 36 16 L 30 16 L 30 65 Z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.2" />
            <circle cx="22" cy="16" r="2" fill="#FBBF24" />
            <circle cx="30" cy="16" r="2" fill="#FBBF24" />
          </g>

          {/* Penjor Janur */}
          <path d="M 235 140 C 235 90, 220 70, 205 65" stroke="#EAB308" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="205" cy="65" r="3" fill="#FBBF24" />
        </svg>
      </div>
    );
  }

  // 4. KALIMANTAN (Rumah Betang Dayak & Sungai Mahakam)
  if (lower.includes('kalimantan')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="135" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="126" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 40 85, 100 65, 160 65 C 230 65, 255 105, 245 140 C 230 170, 70 170, 50 140 Z"
            fill="#059669"
          />

          {/* Sungai Mahakam */}
          <path d="M 55 135 Q 120 110 160 145 T 240 135" stroke="#38BDF8" strokeWidth="10" fill="none" strokeLinecap="round" />

          {/* Authentic Rumah Betang Panggung Panjang */}
          <g transform="translate(85, 75)">
            <polygon points="65,10 0,35 130,35" fill="#92400E" stroke="#451A03" strokeWidth="1.5" />
            <path d="M 2 34 Q 65 30 128 34" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
            <rect x="10" y="35" width="110" height="22" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            
            {/* Dayak Shield Motifs */}
            <polygon points="30,40 35,36 40,40 35,50" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />
            <polygon points="65,40 70,36 75,40 70,50" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />
            <polygon points="100,40 105,36 110,40 105,50" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />

            {/* Timber Stilts */}
            <line x1="15" y1="57" x2="15" y2="76" stroke="#451A03" strokeWidth="2.5" />
            <line x1="35" y1="57" x2="35" y2="76" stroke="#451A03" strokeWidth="2.5" />
            <line x1="55" y1="57" x2="55" y2="76" stroke="#451A03" strokeWidth="2.5" />
            <line x1="75" y1="57" x2="75" y2="76" stroke="#451A03" strokeWidth="2.5" />
            <line x1="95" y1="57" x2="95" y2="76" stroke="#451A03" strokeWidth="2.5" />
            <line x1="115" y1="57" x2="115" y2="76" stroke="#451A03" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 5. SULAWESI (Rumah Adat Tongkonan Toraja)
  if (lower.includes('sulawesi')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 45 90, 95 75, 140 75 C 190 75, 255 100, 245 140 C 235 170, 75 170, 50 140 Z"
            fill="#059669"
          />

          {/* Authentic Tongkonan Toraja with Boat-Shaped Curved Roof */}
          <g transform="translate(100, 60)">
            <path
              d="M 0 16 C 25 40, 75 40, 100 16 C 92 36, 75 48, 50 48 C 25 48, 8 36, 0 16 Z"
              fill="#B91C1C"
              stroke="#450A0A"
              strokeWidth="2"
            />
            <path d="M 4 18 Q 50 44 96 18" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

            <rect x="25" y="48" width="50" height="28" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            
            {/* Buffalo Horns Column (Kabongo') */}
            <line x1="50" y1="48" x2="50" y2="86" stroke="#451A03" strokeWidth="3" />
            <path d="M 44 60 Q 50 56 56 60" stroke="#FBBF24" strokeWidth="1.8" fill="none" />
            <path d="M 44 68 Q 50 64 56 68" stroke="#FBBF24" strokeWidth="1.8" fill="none" />
            <path d="M 44 76 Q 50 72 56 76" stroke="#FBBF24" strokeWidth="1.8" fill="none" />

            <line x1="30" y1="76" x2="30" y2="88" stroke="#78350F" strokeWidth="2.5" />
            <line x1="70" y1="76" x2="70" y2="88" stroke="#78350F" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. NUSA TENGGARA (Rumah Sasak Sade & Bukit Rinjani)
  if (lower.includes('nusa') || lower.includes('tenggara')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 45 90, 95 75, 140 75 C 190 75, 255 100, 245 140 C 235 170, 75 170, 50 140 Z"
            fill="#059669"
          />

          {/* Gunung Rinjani */}
          <polygon points="180,135 220,70 260,135" fill="#475569" />

          {/* Rumah Adat Sasak Bale Tani */}
          <g transform="translate(90, 68)">
            <path d="M 10 46 C 10 16, 25 8, 45 8 C 65 8, 80 16, 80 46 Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <rect x="8" y="46" width="74" height="5" rx="1" fill="#78350F" />
            <rect x="18" y="51" width="54" height="24" rx="1" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
            <rect x="40" y="58" width="10" height="17" fill="#78350F" />
            <rect x="10" y="75" width="70" height="6" rx="2" fill="#78716C" />
          </g>
        </svg>
      </div>
    );
  }

  // 7. MALUKU (Benteng Belgica Banda Neira)
  if (lower.includes('maluku')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 45 90, 95 75, 140 75 C 190 75, 255 100, 245 140 C 235 170, 75 170, 50 140 Z"
            fill="#059669"
          />

          {/* Benteng Belgica Pentagon */}
          <g transform="translate(100, 65)">
            <polygon points="50,10 90,36 76,80 24,80 10,36" fill="#F8FAFC" stroke="#475569" strokeWidth="2.5" />
            <polygon points="50,25 78,42 68,72 32,72 22,42" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
            <circle cx="50" cy="48" r="8" fill="#DC2626" />
            {/* Merah Putih Flag */}
            <line x1="50" y1="48" x2="50" y2="28" stroke="#000000" strokeWidth="1.5" />
            <rect x="50" y="28" width="9" height="4" fill="#EF4444" />
            <rect x="50" y="32" width="9" height="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 8. TIMOR (Rumah Adat Lopo & Sasando)
  if (lower.includes('timor')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 45 90, 95 75, 140 75 C 190 75, 255 100, 245 140 C 235 170, 75 170, 50 140 Z"
            fill="#059669"
          />

          {/* Rumah Adat Lopo Timor */}
          <g transform="translate(100, 65)">
            <polygon points="50,15 15,50 85,50" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <rect x="25" y="50" width="50" height="24" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            <line x1="30" y1="74" x2="30" y2="84" stroke="#451A03" strokeWidth="2.5" />
            <line x1="70" y1="74" x2="70" y2="84" stroke="#451A03" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 9. HALMAHERA (Rumah Adat Sasadu)
  if (lower.includes('halmahera')) {
    return (
      <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
          <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
          <path
            d="M 50 140 C 45 90, 95 75, 140 75 C 190 75, 255 100, 245 140 C 235 170, 75 170, 50 140 Z"
            fill="#059669"
          />

          {/* Balai Adat Sasadu */}
          <g transform="translate(95, 65)">
            <path d="M 55 15 L 10 50 L 100 50 Z" fill="#B45309" stroke="#451A03" strokeWidth="2" />
            <line x1="20" y1="50" x2="20" y2="82" stroke="#78350F" strokeWidth="3" />
            <line x1="40" y1="50" x2="40" y2="82" stroke="#78350F" strokeWidth="2.5" />
            <line x1="70" y1="50" x2="70" y2="82" stroke="#78350F" strokeWidth="2.5" />
            <line x1="90" y1="50" x2="90" y2="82" stroke="#78350F" strokeWidth="3" />
            <rect x="15" y="82" width="80" height="5" rx="2" fill="#78716C" />
          </g>
        </svg>
      </div>
    );
  }

  // 10. PAPUA (Rumah Honai Bundar Jerami)
  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className}`}>
      <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <ellipse cx="150" cy="155" rx="130" ry="38" fill="#BAE6FD" opacity="0.6" />
        <ellipse cx="150" cy="146" rx="122" ry="34" fill="#FDE68A" />
        <path
          d="M 50 140 C 45 85, 105 70, 155 70 C 215 70, 255 105, 245 140 C 230 170, 75 170, 50 140 Z"
          fill="#059669"
        />

        {/* Pegunungan Jayawijaya */}
        <polygon points="175,135 215,65 255,135" fill="#334155" />
        <polygon points="205,82 215,65 225,82" fill="#F8FAFC" />

        {/* Authentic Rumah Bundar Honai Papua */}
        <g transform="translate(90, 68)">
          <path d="M 12 48 C 12 18, 28 8, 48 8 C 68 8, 84 18, 84 48 Z" fill="#D97706" stroke="#451A03" strokeWidth="2" />
          <rect x="22" y="48" width="52" height="26" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="1.8" />
          <line x1="32" y1="48" x2="32" y2="74" stroke="#451A03" strokeWidth="1" />
          <line x1="42" y1="48" x2="42" y2="74" stroke="#451A03" strokeWidth="1" />
          <line x1="64" y1="48" x2="64" y2="74" stroke="#451A03" strokeWidth="1" />
          <rect x="47" y="55" width="12" height="19" rx="1" fill="#1C1917" />
          <ellipse cx="48" cy="76" rx="36" ry="4" fill="#78716C" />
        </g>
      </svg>
    </div>
  );
};
