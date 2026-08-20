import React from 'react';

export type CulturalIconKey =
  | 'sumatera'
  | 'rumah-gadang'
  | 'jawa'
  | 'candi-borobudur'
  | 'bali'
  | 'pura-bali'
  | 'kalimantan'
  | 'rumah-betang'
  | 'sulawesi'
  | 'tongkonan'
  | 'nusa-tenggara'
  | 'rumah-sasak'
  | 'maluku'
  | 'benteng-belgica'
  | 'timor'
  | 'sasando-lopo'
  | 'halmahera'
  | 'sasadu'
  | 'papua'
  | 'honai';

interface NusantaraCulturalIconProps {
  nameOrId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const NusantaraCulturalIcon: React.FC<NusantaraCulturalIconProps> = ({
  nameOrId = '',
  size = 'md',
  className = '',
}) => {
  const sizePixels = {
    xs: 24,
    sm: 32,
    md: 44,
    lg: 64,
    xl: 88,
  }[size];

  const lower = (nameOrId || '').toLowerCase();

  // 1. SUMATERA - RUMAH GADANG MINANGKABAU (Atap Gonjong Tanduk Kerbau)
  if (lower.includes('sumatera') || lower.includes('gadang') || lower.includes('minang')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Gadang Minangkabau (Sumatera)"
      >
        <defs>
          <linearGradient id="gonjongRoof" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
          <linearGradient id="gadangWood" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
        {/* Background Soft Badge */}
        <circle cx="50" cy="50" r="46" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
        
        {/* Gonjong Roof Tips (4 Tanduk Runcing Melengkung) */}
        {/* Far Left Horn */}
        <path d="M 12 28 C 18 36, 26 42, 32 44 C 28 36, 22 30, 12 28 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        {/* Mid Left Horn */}
        <path d="M 30 18 C 36 28, 42 36, 46 38 C 42 30, 36 22, 30 18 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        {/* Mid Right Horn */}
        <path d="M 70 18 C 64 28, 58 36, 54 38 C 58 30, 64 22, 70 18 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        {/* Far Right Horn */}
        <path d="M 88 28 C 82 36, 74 42, 68 44 C 72 36, 78 30, 88 28 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        
        {/* Main Curved Gonjong Roof Body */}
        <path
          d="M 14 42 C 30 52, 70 52, 86 42 C 80 34, 68 28, 50 36 C 32 28, 20 34, 14 42 Z"
          fill="url(#gonjongRoof)"
          stroke="#7F1D1D"
          strokeWidth="2"
        />
        {/* Golden Roof Trim & Ornaments */}
        <path d="M 18 43 Q 50 51 82 43" stroke="#FBBF24" strokeWidth="2" fill="none" />

        {/* House Main Body (Dinding Bertingkat Khas Minang) */}
        <rect x="24" y="48" width="52" height="24" rx="2" fill="url(#gadangWood)" stroke="#451A03" strokeWidth="1.8" />
        
        {/* Minang Wall Carvings (Pucuak Rabuang Motifs) */}
        <line x1="28" y1="55" x2="72" y2="55" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 2" />
        <line x1="28" y1="62" x2="72" y2="62" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 2" />
        
        {/* Windows & Central Entrance Door */}
        <rect x="29" y="58" width="6" height="8" rx="1" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
        <rect x="47" y="56" width="7" height="13" rx="1" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
        <rect x="65" y="58" width="6" height="8" rx="1" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />

        {/* Stilts / Tiang Penyangga Bawah */}
        <line x1="28" y1="72" x2="28" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="72" x2="42" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="72" x2="58" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="72" x2="72" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        {/* Ground Foundation Stone */}
        <rect x="22" y="82" width="56" height="4" rx="2" fill="#78716C" />
      </svg>
    );
  }

  // 2. JAWA - CANDI BOROBUDUR / PRAMBANAN (Stupa Bertingkat Batu Megah)
  if (lower.includes('jawa') || lower.includes('borobudur') || lower.includes('prambanan') || lower.includes('candi')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Candi Borobudur Megah (Jawa)"
      >
        <defs>
          <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
        
        {/* Mountain Merapi Silhouette in background */}
        <polygon points="20,55 35,35 50,55" fill="#CBD5E1" opacity="0.6" />
        <polygon points="50,55 70,30 90,55" fill="#CBD5E1" opacity="0.6" />

        {/* Candi Undakan Bawah (Kamadhatu & Rupadhatu) */}
        <rect x="14" y="72" width="72" height="12" rx="2" fill="url(#stoneGrad)" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="22" y="60" width="56" height="12" rx="2" fill="url(#stoneGrad)" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="30" y="48" width="40" height="12" rx="2" fill="url(#stoneGrad)" stroke="#1E293B" strokeWidth="1.5" />

        {/* Small Stupas along terraces */}
        <path d="M 24 60 C 24 55, 28 55, 28 60 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />
        <path d="M 34 60 C 34 55, 38 55, 38 60 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />
        <path d="M 62 60 C 62 55, 66 55, 66 60 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />
        <path d="M 72 60 C 72 55, 76 55, 76 60 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />

        <path d="M 32 48 C 32 43, 36 43, 36 48 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />
        <path d="M 64 48 C 64 43, 68 43, 68 48 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1" />

        {/* Main Central Stupa (Arupadhatu) */}
        <path
          d="M 38 48 C 38 34, 44 28, 50 28 C 56 28, 62 34, 62 48 Z"
          fill="#475569"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Crown Pinnacle / Lingga Mahkota */}
        <rect x="48" y="16" width="4" height="12" rx="1" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
        <circle cx="50" cy="14" r="3" fill="#F59E0B" />

        {/* Relief Dots Pattern on Base */}
        <circle cx="20" cy="78" r="1.5" fill="#E2E8F0" />
        <circle cx="35" cy="78" r="1.5" fill="#E2E8F0" />
        <circle cx="50" cy="78" r="1.5" fill="#E2E8F0" />
        <circle cx="65" cy="78" r="1.5" fill="#E2E8F0" />
        <circle cx="80" cy="78" r="1.5" fill="#E2E8F0" />
      </svg>
    );
  }

  // 3. BALI - GAPURA CANDI BENTAR & MERU PURA ULUN DANU
  if (lower.includes('bali') || lower.includes('pura') || lower.includes('bentar') || lower.includes('tanah lot')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Candi Bentar & Pura Bali"
      >
        <defs>
          <linearGradient id="baliBrick" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="meruRoof" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2.5" />
        
        {/* Penjor Janur Keemasan Melengkung */}
        <path d="M 88 80 C 88 40, 80 18, 65 14 C 60 12, 62 20, 68 22" stroke="#EAB308" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="14" r="2.5" fill="#FBBF24" />

        {/* Central Meru Tiered Roofs (Pura Tumpang) */}
        <polygon points="50,22 42,30 58,30" fill="url(#meruRoof)" stroke="#0F172A" strokeWidth="1" />
        <polygon points="50,28 38,38 62,38" fill="url(#meruRoof)" stroke="#0F172A" strokeWidth="1" />
        <polygon points="50,36 34,48 66,48" fill="url(#meruRoof)" stroke="#0F172A" strokeWidth="1" />
        <polygon points="50,46 30,58 70,58" fill="url(#meruRoof)" stroke="#0F172A" strokeWidth="1" />

        {/* Candi Bentar Split Gate - Left Wing */}
        <path
          d="M 18 82 L 18 68 L 22 68 L 22 56 L 26 56 L 26 44 L 32 44 L 32 30 L 38 24 L 44 24 L 44 82 Z"
          fill="url(#baliBrick)"
          stroke="#7C2D12"
          strokeWidth="1.5"
        />
        {/* Candi Bentar Split Gate - Right Wing */}
        <path
          d="M 82 82 L 82 68 L 78 68 L 78 56 L 74 56 L 74 44 L 68 44 L 68 30 L 62 24 L 56 24 L 56 82 Z"
          fill="url(#baliBrick)"
          stroke="#7C2D12"
          strokeWidth="1.5"
        />

        {/* Golden Ornaments on Gate Tips */}
        <circle cx="44" cy="24" r="2" fill="#FBBF24" />
        <circle cx="56" cy="24" r="2" fill="#FBBF24" />

        {/* Plinth Base Steps */}
        <rect x="14" y="82" width="72" height="4" rx="1" fill="#78716C" stroke="#44403C" strokeWidth="1" />
        {/* Bunga Kamboja Putih-Kuning di bawah */}
        <circle cx="50" cy="80" r="3" fill="#FFFFFF" />
        <circle cx="50" cy="80" r="1.5" fill="#FBBF24" />
      </svg>
    );
  }

  // 4. KALIMANTAN - RUMAH BETANG DAYAK (Rumah Panggung Panjang Ulin & Burung Enggang)
  if (lower.includes('kalimantan') || lower.includes('betang') || lower.includes('dayak')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Betang Dayak (Kalimantan)"
      >
        <defs>
          <linearGradient id="betangWood" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="sirapRoof" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />

        {/* Burung Enggang Hornbill Crest on Roof Top */}
        <path d="M 46 22 C 46 16, 52 14, 56 16 C 54 20, 52 24, 46 22 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        <circle cx="52" cy="18" r="1" fill="#000000" />

        {/* High Pelana Sirap Roof (Atap Pelana Panjang) */}
        <polygon
          points="50,22 10,46 90,46"
          fill="url(#sirapRoof)"
          stroke="#451A03"
          strokeWidth="2"
        />
        {/* Dayak Spiral Carvings on Roof Edge */}
        <path d="M 12 45 Q 50 42 88 45" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

        {/* Super Long Stilt House Body (Rumah Panjang) */}
        <rect x="18" y="46" width="64" height="18" rx="2" fill="url(#betangWood)" stroke="#291304" strokeWidth="1.5" />
        
        {/* Dayak Talawang Shield Motifs */}
        <polygon points="30,51 34,48 38,51 34,60" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />
        <polygon points="50,51 54,48 58,51 54,60" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />
        <polygon points="70,51 74,48 78,51 74,60" fill="#EF4444" stroke="#FBBF24" strokeWidth="0.8" />

        {/* Long Timber Stilts (Tiang Kayu Ulin Tinggi) */}
        <line x1="20" y1="64" x2="20" y2="82" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="64" x2="32" y2="82" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <line x1="44" y1="64" x2="44" y2="82" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <line x1="56" y1="64" x2="56" y2="82" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="64" x2="68" y2="82" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="64" x2="80" y2="82" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Traditional Tangga Kayu Hejan */}
        <line x1="50" y1="64" x2="46" y2="82" stroke="#D97706" strokeWidth="2" />
        <line x1="47" y1="70" x2="49" y2="70" stroke="#78350F" strokeWidth="1" />
        <line x1="46" y1="75" x2="48" y2="75" stroke="#78350F" strokeWidth="1" />
      </svg>
    );
  }

  // 5. SULAWESI - RUMAH ADAT TONGKONAN TORAJA (Atap Perahu Melengkung Menjulang)
  if (lower.includes('sulawesi') || lower.includes('tongkonan') || lower.includes('toraja')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Adat Tongkonan Toraja (Sulawesi)"
      >
        <defs>
          <linearGradient id="tongkonanRoof" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="50%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
          <linearGradient id="torajaWood" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2.5" />

        {/* Iconic Boat-Shaped Curved Roof (Atap Melengkung Menjulang Tinggi Khas Perahu Toraja) */}
        <path
          d="M 10 24 C 28 44, 72 44, 90 24 C 84 40, 70 50, 50 50 C 30 50, 16 40, 10 24 Z"
          fill="url(#tongkonanRoof)"
          stroke="#450A0A"
          strokeWidth="2"
        />
        {/* Layered Bamboo Roof Edge */}
        <path d="M 12 26 Q 50 48 88 26" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

        {/* House Body (Dinding Ukiran Toraja Pa'teddong Merah & Kuning) */}
        <rect x="30" y="50" width="40" height="22" rx="2" fill="url(#torajaWood)" stroke="#451A03" strokeWidth="1.5" />
        
        {/* Toraja Sun / Buffalo Head Motifs */}
        <circle cx="50" cy="58" r="4" fill="#FEF3C7" stroke="#991B1B" strokeWidth="1" />
        <path d="M 46 56 C 46 52, 54 52, 54 56" stroke="#991B1B" strokeWidth="1" fill="none" />

        {/* Deretan Tanduk Kerbau di Tiang Utama (Kabongo') */}
        <line x1="50" y1="50" x2="50" y2="82" stroke="#451A03" strokeWidth="2.5" />
        <path d="M 46 64 Q 50 62 54 64" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
        <path d="M 46 69 Q 50 67 54 69" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
        <path d="M 46 74 Q 50 72 54 74" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

        {/* Supporting Stilts */}
        <line x1="33" y1="72" x2="33" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="67" y1="72" x2="67" y2="82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. NUSA TENGGARA - RUMAH ADAT SASAK SADE & KOMODO
  if (lower.includes('nusa') || lower.includes('tenggara') || lower.includes('sasak') || lower.includes('komodo')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Adat Sasak Sade (Nusa Tenggara)"
      >
        <defs>
          <linearGradient id="sasakThatch" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2.5" />

        {/* High Domed Thatched Roof of Bale Tani Sasak (Atap Jerami Alang-alang Melengkung) */}
        <path
          d="M 22 52 C 22 28, 34 20, 50 20 C 66 20, 78 28, 78 52 Z"
          fill="url(#sasakThatch)"
          stroke="#78350F"
          strokeWidth="2"
        />
        {/* Thatched Texture Lines */}
        <path d="M 32 40 Q 50 36 68 40" stroke="#78350F" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M 26 48 Q 50 44 74 48" stroke="#78350F" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Eaves Trim / List Bambu Anyaman */}
        <rect x="20" y="52" width="60" height="4" rx="1" fill="#78350F" />

        {/* Woven Bamboo Wall (Dinding Bedek) */}
        <rect x="26" y="56" width="48" height="18" rx="1" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
        {/* Woven Pattern */}
        <line x1="30" y1="62" x2="70" y2="62" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="30" y1="68" x2="70" y2="68" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Low Doorway */}
        <rect x="45" y="60" width="10" height="14" rx="1" fill="#78350F" />

        {/* Stone / Earth Terrace Foundation */}
        <rect x="18" y="74" width="64" height="6" rx="2" fill="#A8A29E" stroke="#57534E" strokeWidth="1" />
      </svg>
    );
  }

  // 7. MALUKU - BENTENG BELGICA BANDA NEIRA (Benteng Segi Lima Bersejarah Rempah Pala)
  if (lower.includes('maluku') || lower.includes('belgica') || lower.includes('banda')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Benteng Belgica Banda Neira (Maluku)"
      >
        <defs>
          <linearGradient id="fortressStone" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2.5" />

        {/* Pentagonal Outer Bastion Walls (Tembok Benteng Segi Lima Megah) */}
        <polygon
          points="50,22 84,42 72,78 28,78 16,42"
          fill="url(#fortressStone)"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* Inner Pentagonal Keep */}
        <polygon
          points="50,34 72,48 64,70 36,70 28,48"
          fill="#CBD5E1"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Central Watchtower Turrets (Menara Pengawas Bundar) */}
        <circle cx="50" cy="52" r="8" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="50" cy="52" r="4" fill="#FFFFFF" />
        {/* Indonesian Merah Putih Flagpole atop Belgica */}
        <line x1="50" y1="52" x2="50" y2="36" stroke="#000000" strokeWidth="1.5" />
        <rect x="50" y="36" width="7" height="3" fill="#EF4444" />
        <rect x="50" y="39" width="7" height="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />

        {/* 5 Corner Lookout Bastions */}
        <circle cx="50" cy="22" r="4" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <circle cx="84" cy="42" r="4" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <circle cx="72" cy="78" r="4" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <circle cx="28" cy="78" r="4" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <circle cx="16" cy="42" r="4" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
      </svg>
    );
  }

  // 8. TIMOR - RUMAH LOPO & ALAT MUSIK SASANDO
  if (lower.includes('timor') || lower.includes('lopo') || lower.includes('sasando') || lower.includes('rote')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Lopo & Sasando (Timor)"
      >
        <defs>
          <linearGradient id="lopoThatch" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="sasandoLeaf" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#FEFCE8" stroke="#CA8A04" strokeWidth="2.5" />

        {/* Sasando Fan-shaped Lontar Leaves Background */}
        <path
          d="M 50 78 C 30 70, 16 45, 24 28 C 34 20, 66 20, 76 28 C 84 45, 70 70, 50 78 Z"
          fill="url(#sasandoLeaf)"
          stroke="#B45309"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* Sasando Leaf Ribs */}
        <line x1="50" y1="78" x2="28" y2="34" stroke="#B45309" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="78" x2="40" y2="24" stroke="#B45309" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="78" x2="50" y2="22" stroke="#B45309" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="78" x2="60" y2="24" stroke="#B45309" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="78" x2="72" y2="34" stroke="#B45309" strokeWidth="1" opacity="0.6" />

        {/* Central Bamboo Sound Tube & Strings */}
        <rect x="47" y="24" width="6" height="54" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1" />
        <line x1="45" y1="30" x2="45" y2="72" stroke="#FFFFFF" strokeWidth="0.8" />
        <line x1="55" y1="30" x2="55" y2="72" stroke="#FFFFFF" strokeWidth="0.8" />

        {/* Mini Lopo Cone Roof Motif at Top */}
        <polygon points="50,18 42,26 58,26" fill="url(#lopoThatch)" stroke="#451A03" strokeWidth="1" />
      </svg>
    );
  }

  // 9. HALMAHERA - RUMAH ADAT SASADU
  if (lower.includes('halmahera') || lower.includes('sasadu') || lower.includes('gamalama')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Adat Sasadu (Halmahera)"
      >
        <defs>
          <linearGradient id="sasaduRoof" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />

        {/* High Sweeping Sago Palm Thatch Roof (Atap Pelana Daun Rumbia Tinggi) */}
        <path
          d="M 50 20 L 14 50 L 86 50 Z"
          fill="url(#sasaduRoof)"
          stroke="#451A03"
          strokeWidth="2"
        />
        {/* Carved Perahu Adat Motifs on Roof Ridge */}
        <path d="M 44 20 Q 50 16 56 20" stroke="#FBBF24" strokeWidth="2" fill="none" />

        {/* Open Wall Community Pavilion (Balai Tanpa Dinding) */}
        {/* 6 Round Timber Columns (Tiang Kayu Bulat Penyangga) */}
        <line x1="20" y1="50" x2="20" y2="78" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="50" x2="32" y2="78" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="50" x2="44" y2="78" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="56" y1="50" x2="56" y2="78" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="50" x2="68" y2="78" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="50" x2="80" y2="78" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

        {/* Wooden Bench (Bangku Kayu Melingkar) */}
        <rect x="22" y="66" width="56" height="4" rx="1" fill="#D97706" />

        {/* Stone Terrace Base */}
        <rect x="16" y="78" width="68" height="5" rx="2" fill="#78716C" />
      </svg>
    );
  }

  // 10. PAPUA - RUMAH ADAT HONAI (Rumah Bundar Dinding Kayu Atap Jamur Jerami)
  if (lower.includes('papua') || lower.includes('honai')) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-xs ${className}`}
        title="Rumah Bundar Honai (Papua)"
      >
        <defs>
          <linearGradient id="honaiThatch" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="60%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="honaiWood" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />

        {/* Conical Mushroom-Shaped Thatched Dome Roof (Kubah Bundar Jerami Alang-alang Tebal) */}
        <path
          d="M 18 54 C 18 26, 32 18, 50 18 C 68 18, 82 26, 82 54 Z"
          fill="url(#honaiThatch)"
          stroke="#451A03"
          strokeWidth="2"
        />
        {/* Layered Thatch Straw Details */}
        <path d="M 28 42 Q 50 36 72 42" stroke="#FDE68A" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M 22 50 Q 50 44 78 50" stroke="#FDE68A" strokeWidth="1.2" fill="none" opacity="0.6" />

        {/* Circular Timber Wall (Dinding Kayu Melingkar) */}
        <rect x="26" y="54" width="48" height="24" rx="2" fill="url(#honaiWood)" stroke="#291304" strokeWidth="1.8" />
        
        {/* Vertical Wood Planks */}
        <line x1="34" y1="54" x2="34" y2="78" stroke="#451A03" strokeWidth="1" />
        <line x1="42" y1="54" x2="42" y2="78" stroke="#451A03" strokeWidth="1" />
        <line x1="58" y1="54" x2="58" y2="78" stroke="#451A03" strokeWidth="1" />
        <line x1="66" y1="54" x2="66" y2="78" stroke="#451A03" strokeWidth="1" />

        {/* Small Traditional Honai Door (Pintu Kecil Tanpa Jendela) */}
        <rect x="45" y="60" width="10" height="18" rx="2" fill="#1C1917" stroke="#D97706" strokeWidth="1" />

        {/* Earth Ground Base */}
        <ellipse cx="50" cy="80" rx="34" ry="4" fill="#78716C" opacity="0.8" />
      </svg>
    );
  }

  // Fallback icon
  return (
    <div className={`flex items-center justify-center font-bold text-2xl ${className}`}>
      🏛️
    </div>
  );
};
