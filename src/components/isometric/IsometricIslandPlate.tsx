import React from 'react';
import { Island, IslandStatus } from '../../types';
import { Star, Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface IsometricIslandPlateProps {
  island: Island;
  isSelected: boolean;
  isCurrentActive: boolean;
  stars: number;
  timeOfDay: 'day' | 'sunset' | 'night';
  onClick: () => void;
}

export const IsometricIslandPlate: React.FC<IsometricIslandPlateProps> = ({
  island,
  isSelected,
  isCurrentActive,
  stars,
  timeOfDay,
  onClick,
}) => {
  const isLocked = island.status === 'locked';
  const isCompleted = island.status === 'completed';

  // Specific island dimensions and isometric visual styling
  const renderIslandDetails = () => {
    switch (island.id) {
      case 'sumatera':
        return (
          <g id="decor-sumatera">
            {/* Lake Toba in center crater */}
            <ellipse cx="140" cy="115" rx="36" ry="18" fill="#0284c7" opacity="0.85" />
            <ellipse cx="140" cy="115" rx="30" ry="14" fill="#0369a1" />
            <ellipse cx="142" cy="113" rx="12" ry="6" fill="#15803d" /> {/* Samosir Island */}
            
            {/* Mt. Kerinci Volcano (Isometric Cone) */}
            <g transform="translate(60, 45)">
              {/* Shadow */}
              <ellipse cx="30" cy="50" rx="32" ry="12" fill="#000000" opacity="0.25" />
              {/* Mountain cone Left Shaded Face */}
              <polygon points="30,0 2,46 30,50" fill="#334155" />
              {/* Mountain cone Right Sunlit Face */}
              <polygon points="30,0 30,50 58,46" fill="#475569" />
              {/* Volcano peak crater */}
              <ellipse cx="30" cy="6" rx="8" ry="3" fill="#1e293b" />
              <ellipse cx="30" cy="6" rx="5" ry="1.8" fill="#f97316" opacity="0.9" />
              {/* Animated Smoke Puffs */}
              <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                <circle cx="30" cy="-6" r="4" fill="#f1f5f9" opacity="0.75" />
                <circle cx="34" cy="-14" r="6" fill="#f1f5f9" opacity="0.55" />
                <circle cx="32" cy="-24" r="8" fill="#f1f5f9" opacity="0.35" />
              </g>
            </g>

            {/* 2.5D Rumah Gadang (Minangkabau House with iconic curved horn roofs) */}
            <g transform="translate(165, 55)">
              {/* House shadow */}
              <polygon points="0,50 50,25 90,45 40,70" fill="#000000" opacity="0.3" />
              
              {/* Wooden House Walls Base */}
              <polygon points="15,40 45,25 75,40 45,55" fill="#78350f" />
              <polygon points="15,40 45,55 45,70 15,55" fill="#92400e" />
              <polygon points="45,55 75,40 75,55 45,70" fill="#b45309" />
              
              {/* Wall Carving details */}
              <line x1="22" y1="46" x2="22" y2="52" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="32" y1="51" x2="32" y2="57" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="55" y1="51" x2="55" y2="57" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="65" y1="46" x2="65" y2="52" stroke="#fef08a" strokeWidth="1.5" />

              {/* Iconic Curved Gonjong Roof (Front & Side) */}
              <path
                d="M 5,28 Q 20,40 45,28 Q 70,40 85,28 Q 80,18 70,22 Q 45,10 45,8 Q 45,10 20,22 Q 10,18 5,28 Z"
                fill="#b91c1c"
                stroke="#fde047"
                strokeWidth="1"
              />
              {/* Horn Roof Tips (Gonjong) */}
              <path d="M 5,28 Q 0,16 -4,8 Q 2,16 10,22" fill="#d97706" />
              <path d="M 85,28 Q 90,16 94,8 Q 88,16 80,22" fill="#d97706" />
              <path d="M 45,8 Q 45,-2 45,-6 Q 47,2 50,10" fill="#f59e0b" />
            </g>

            {/* Tropical Palm / Coconut Trees Cluster */}
            <g transform="translate(45, 120)">
              {/* Palm 1 */}
              <path d="M 20,35 Q 26,20 22,8" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="22" cy="7" rx="14" ry="5" fill="#16a34a" transform="rotate(-20 22 7)" />
              <ellipse cx="22" cy="7" rx="14" ry="5" fill="#15803d" transform="rotate(35 22 7)" />
              <ellipse cx="22" cy="7" rx="12" ry="4" fill="#22c55e" transform="rotate(90 22 7)" />
              <circle cx="21" cy="9" r="2" fill="#ca8a04" />
              
              {/* Palm 2 */}
              <path d="M 38,40 Q 45,25 48,14" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="48" cy="13" rx="11" ry="4" fill="#16a34a" transform="rotate(-10 48 13)" />
              <ellipse cx="48" cy="13" rx="11" ry="4" fill="#15803d" transform="rotate(45 48 13)" />
            </g>

            {/* Coffee Plants / Greenery Bushes */}
            <g transform="translate(195, 125)">
              <ellipse cx="10" cy="12" rx="10" ry="6" fill="#15803d" />
              <ellipse cx="22" cy="15" rx="8" ry="5" fill="#16a34a" />
              <circle cx="12" cy="10" r="1.5" fill="#ef4444" />
              <circle cx="20" cy="13" r="1.5" fill="#ef4444" />
            </g>
          </g>
        );

      case 'jawa':
        return (
          <g id="decor-jawa">
            {/* Stepped Terraced Rice Fields (Terasering Sawah Hijau) */}
            <g transform="translate(45, 95)">
              <path d="M 0,25 Q 35,10 70,25 L 65,32 Q 35,18 0,32 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1" />
              <path d="M 10,32 Q 45,18 80,32 L 75,40 Q 45,26 10,40 Z" fill="#65a30d" stroke="#3f6212" strokeWidth="1" />
              <path d="M 20,40 Q 55,26 90,40 L 85,48 Q 55,34 20,48 Z" fill="#4d7c0f" stroke="#365314" strokeWidth="1" />
              {/* Water sheen in rice field */}
              <path d="M 30,30 Q 50,22 65,30" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.7" />
            </g>

            {/* 2.5D Candi Borobudur (Grand Tiered Stone Temple Pyramid with Stupas) */}
            <g transform="translate(130, 35)">
              {/* Shadow */}
              <polygon points="0,75 55,45 105,70 50,100" fill="#000000" opacity="0.35" />

              {/* Tier 1 Base Platform (Square Stone Terrace) */}
              <polygon points="10,65 50,45 90,65 50,85" fill="#475569" stroke="#334155" strokeWidth="1" />
              <polygon points="10,65 50,85 50,92 10,72" fill="#334155" />
              <polygon points="50,85 90,65 90,72 50,92" fill="#1e293b" />

              {/* Tier 2 Middle Terrace */}
              <polygon points="20,55 50,40 80,55 50,70" fill="#64748b" stroke="#475569" strokeWidth="1" />
              <polygon points="20,55 50,70 50,75 20,60" fill="#475569" />
              <polygon points="50,70 80,55 80,60 50,75" fill="#334155" />

              {/* Tier 3 Circular Terraces with Mini Stupas */}
              <polygon points="28,47 50,36 72,47 50,58" fill="#94a3b8" />
              
              {/* Mini Bell Stupas around top */}
              <path d="M 36,44 Q 38,38 40,44 Z" fill="#475569" />
              <path d="M 60,44 Q 62,38 64,44 Z" fill="#475569" />
              <path d="M 48,52 Q 50,46 52,52 Z" fill="#475569" />

              {/* Main Golden Crown Stupa (Stupa Induk) */}
              <path d="M 44,36 Q 50,22 56,36 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              {/* Spire Pinnacle (Chattra) */}
              <line x1="50" y1="23" x2="50" y2="12" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="11" r="2.5" fill="#fde047" className="animate-pulse" />
            </g>

            {/* Mount Bromo Volcano & Crater */}
            <g transform="translate(35, 40)">
              {/* Volcanic Ridge Left */}
              <polygon points="35,5 5,42 35,46" fill="#713f12" />
              {/* Volcanic Ridge Right */}
              <polygon points="35,5 35,46 62,40" fill="#854d0e" />
              {/* Crater Mouth with Lava Glow */}
              <ellipse cx="35" cy="8" rx="7" ry="2.5" fill="#451a03" />
              <ellipse cx="35" cy="8" rx="4" ry="1.5" fill="#f97316" />
              {/* Gentle Smoke */}
              <circle cx="35" cy="-2" r="3" fill="#e2e8f0" opacity="0.6" />
              <circle cx="38" cy="-8" r="5" fill="#cbd5e1" opacity="0.4" />
            </g>

            {/* Javanese Joglo Pavilion */}
            <g transform="translate(195, 110)">
              {/* Shadow */}
              <polygon points="5,25 25,15 45,25 25,35" fill="#000000" opacity="0.25" />
              {/* Wooden Pillars */}
              <line x1="12" y1="20" x2="12" y2="28" stroke="#78350f" strokeWidth="2" />
              <line x1="38" y1="20" x2="38" y2="28" stroke="#78350f" strokeWidth="2" />
              <line x1="25" y1="25" x2="25" y2="33" stroke="#78350f" strokeWidth="2" />
              {/* Joglo Stepped Roof */}
              <polygon points="5,20 25,8 45,20 25,27" fill="#b91c1c" />
              <polygon points="15,12 25,2 35,12 25,17" fill="#991b1b" stroke="#fde047" strokeWidth="0.8" />
            </g>
          </g>
        );

      case 'bali':
        return (
          <g id="decor-bali">
            {/* White Sand Beach & Coral Shallows */}
            <path
              d="M 25,120 Q 80,140 160,135 Q 210,120 230,105 L 220,115 Q 150,148 20,130 Z"
              fill="#fef08a"
              opacity="0.9"
            />
            {/* Surf Wave Foam */}
            <path
              d="M 30,128 Q 90,148 170,140 Q 215,128 235,115"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="8 4"
              opacity="0.8"
            />

            {/* 2.5D Candi Bentar (Balinese Split Gateway) */}
            <g transform="translate(70, 60)">
              {/* Shadow */}
              <ellipse cx="40" cy="55" rx="35" ry="12" fill="#000000" opacity="0.25" />

              {/* Left Gate Wing */}
              <polygon points="12,50 28,42 28,10 12,20" fill="#9a3412" stroke="#ea580c" strokeWidth="0.8" />
              <polygon points="28,42 34,45 34,12 28,10" fill="#7c2d12" />
              {/* Stepped Ornaments Left */}
              <polygon points="8,35 12,33 12,22 8,25" fill="#f59e0b" />
              <polygon points="4,45 8,43 8,36 4,38" fill="#f59e0b" />
              
              {/* Right Gate Wing (Symmetrical Split) */}
              <polygon points="46,45 52,42 52,10 46,12" fill="#7c2d12" />
              <polygon points="52,42 68,50 68,20 52,10" fill="#9a3412" stroke="#ea580c" strokeWidth="0.8" />
              {/* Stepped Ornaments Right */}
              <polygon points="68,22 72,25 72,35 68,33" fill="#f59e0b" />
              <polygon points="72,36 76,38 76,45 72,43" fill="#f59e0b" />

              {/* Central Stone Threshold Walkway */}
              <polygon points="34,45 46,45 52,55 28,55" fill="#cbd5e1" />
              {/* Red/Yellow Poleng Checkered Cloth accent */}
              <rect x="14" y="38" width="12" height="6" fill="#facc15" stroke="#1e293b" strokeWidth="0.5" />
              <rect x="54" y="38" width="12" height="6" fill="#facc15" stroke="#1e293b" strokeWidth="0.5" />
            </g>

            {/* Pura Ulun Danu Meru (Multi-tiered Thatched Roof Pagoda Temple) */}
            <g transform="translate(160, 40)">
              {/* Shadow */}
              <ellipse cx="25" cy="65" rx="20" ry="8" fill="#000000" opacity="0.3" />
              
              {/* Stone Base in Water */}
              <polygon points="5,55 25,45 45,55 25,65" fill="#475569" />
              <polygon points="5,55 25,65 25,70 5,60" fill="#334155" />
              
              {/* Tier 1 Thatched Roof (Ijuk Hitam) */}
              <polygon points="2,48 25,36 48,48 25,56" fill="#292524" stroke="#44403c" strokeWidth="1" />
              {/* Tier 2 */}
              <polygon points="6,38 25,28 44,38 25,45" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
              {/* Tier 3 */}
              <polygon points="10,28 25,20 40,28 25,34" fill="#292524" stroke="#44403c" strokeWidth="1" />
              {/* Tier 4 */}
              <polygon points="14,19 25,13 36,19 25,24" fill="#1c1917" />
              {/* Top Spire */}
              <polygon points="18,11 25,6 32,11 25,15" fill="#f59e0b" />
              <line x1="25" y1="6" x2="25" y2="0" stroke="#fde047" strokeWidth="2" />
            </g>

            {/* Tropical Coconut Palms & Frangipani Flowers */}
            <g transform="translate(25, 65)">
              <path d="M 15,35 Q 22,18 20,5" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="20" cy="5" rx="12" ry="4" fill="#16a34a" transform="rotate(-30 20 5)" />
              <ellipse cx="20" cy="5" rx="12" ry="4" fill="#22c55e" transform="rotate(30 20 5)" />
              <ellipse cx="20" cy="5" rx="10" ry="3.5" fill="#15803d" transform="rotate(90 20 5)" />

              {/* Frangipani (Bunga Kamboja) Blossom */}
              <g transform="translate(26, 25)">
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <circle cx="0" cy="0" r="1.2" fill="#facc15" />
              </g>
            </g>

            {/* Beach Umbrella & Surfboard */}
            <g transform="translate(200, 95)">
              {/* Umbrella Pole */}
              <line x1="15" y1="12" x2="15" y2="28" stroke="#ffffff" strokeWidth="1.5" />
              {/* Colorful Umbrella Canopy */}
              <path d="M 4,14 Q 15,0 26,14 Z" fill="#ec4899" stroke="#f43f5e" strokeWidth="0.8" />
              <path d="M 10,14 Q 15,0 20,14 Z" fill="#facc15" />
              {/* Surfboard on Sand */}
              <ellipse cx="24" cy="24" rx="3" ry="8" fill="#06b6d4" transform="rotate(45 24 24)" />
              <line x1="20" y1="20" x2="28" y2="28" stroke="#ffffff" strokeWidth="1" />
            </g>
          </g>
        );

      case 'kalimantan':
        return (
          <g id="decor-kalimantan">
            {/* Winding Sungai Mahakam River Cutting Through Jungle */}
            <path
              d="M 50,45 Q 90,65 110,85 Q 130,105 160,110 Q 190,115 220,135"
              fill="none"
              stroke="#0284c7"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 50,45 Q 90,65 110,85 Q 130,105 160,110 Q 190,115 220,135"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Wooden Canoe Boat on River */}
            <g transform="translate(130, 96)">
              <ellipse cx="8" cy="4" rx="8" ry="3" fill="#78350f" transform="rotate(25 8 4)" />
              <line x1="6" y1="1" x2="14" y2="3" stroke="#fef08a" strokeWidth="1" />
              <circle cx="10" cy="2" r="1.5" fill="#f97316" />
            </g>

            {/* Giant Rainforest Jungle Canopy (Dense 2.5D Trees) */}
            <g transform="translate(30, 45)">
              {/* Canopy Tree 1 */}
              <ellipse cx="25" cy="25" rx="20" ry="14" fill="#14532d" />
              <ellipse cx="23" cy="22" rx="17" ry="12" fill="#15803d" />
              <ellipse cx="20" cy="18" rx="13" ry="9" fill="#22c55e" />
              {/* Canopy Tree 2 */}
              <ellipse cx="50" cy="20" rx="18" ry="12" fill="#14532d" />
              <ellipse cx="48" cy="18" rx="15" ry="10" fill="#16a34a" />
              <ellipse cx="46" cy="15" rx="11" ry="8" fill="#4ade80" />
            </g>

            {/* 2.5D Rumah Betang (Dayak Longhouse on High Stilts) */}
            <g transform="translate(135, 40)">
              {/* Shadow */}
              <polygon points="0,55 50,30 100,55 50,80" fill="#000000" opacity="0.3" />

              {/* Wooden High Stilts (Tiang Kayu Ulin) */}
              <line x1="15" y1="45" x2="15" y2="60" stroke="#451a03" strokeWidth="2.5" />
              <line x1="35" y1="35" x2="35" y2="50" stroke="#451a03" strokeWidth="2.5" />
              <line x1="65" y1="35" x2="65" y2="50" stroke="#451a03" strokeWidth="2.5" />
              <line x1="85" y1="45" x2="85" y2="60" stroke="#451a03" strokeWidth="2.5" />
              <line x1="50" y1="52" x2="50" y2="68" stroke="#451a03" strokeWidth="2.5" />

              {/* Longhouse Body Floor */}
              <polygon points="10,45 50,25 90,45 50,65" fill="#78350f" />
              <polygon points="10,45 50,65 50,72 10,52" fill="#92400e" />
              <polygon points="50,65 90,45 90,52 50,72" fill="#b45309" />

              {/* Massive Gabled Roof */}
              <polygon points="5,40 50,15 95,40 50,55" fill="#854d0e" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="5,40 50,15 50,10 5,35" fill="#a16207" />
              <polygon points="50,15 95,40 95,35 50,10" fill="#713f12" />

              {/* Traditional Roof Finials */}
              <path d="M 5,35 Q 2,25 0,20" fill="none" stroke="#fde047" strokeWidth="2" />
              <path d="M 95,35 Q 98,25 100,20" fill="none" stroke="#fde047" strokeWidth="2" />
            </g>

            {/* Dayak Talawang Shield Carving Monolith */}
            <g transform="translate(195, 100)">
              {/* Stone Base */}
              <polygon points="5,20 18,14 30,20 18,26" fill="#64748b" />
              {/* Talawang Hexagonal Shield */}
              <polygon points="18,0 26,10 26,22 18,30 10,22 10,10" fill="#dc2626" stroke="#fde047" strokeWidth="1.2" />
              {/* Dayak Spiral Swirl Pattern */}
              <path d="M 14,10 Q 18,6 22,10 Q 18,16 14,20" fill="none" stroke="#fef08a" strokeWidth="1" />
              <circle cx="18" cy="15" r="2" fill="#1e293b" />
            </g>

            {/* Orangutan Friendly Silhouette in Trees */}
            <g transform="translate(55, 115)">
              <ellipse cx="12" cy="10" rx="8" ry="6" fill="#9a3412" />
              <circle cx="12" cy="5" r="4" fill="#c2410c" />
              <ellipse cx="6" cy="12" rx="2" ry="4" fill="#9a3412" transform="rotate(30 6 12)" />
              <ellipse cx="18" cy="12" rx="2" ry="4" fill="#9a3412" transform="rotate(-30 18 12)" />
            </g>
          </g>
        );

      case 'sulawesi':
        return (
          <g id="decor-sulawesi">
            {/* 2.5D Perahu Pinisi Sailing Vessel on the Coast Water */}
            <g transform="translate(15, 75)">
              {/* Ship Shadow on water */}
              <ellipse cx="40" cy="45" rx="35" ry="10" fill="#000000" opacity="0.3" />

              {/* Wooden Hull (Badan Kapal Pinisi) */}
              <path
                d="M 5,35 Q 25,48 60,40 Q 75,32 80,24 L 70,25 Q 55,36 20,28 Z"
                fill="#78350f"
                stroke="#451a03"
                strokeWidth="1.2"
              />
              <path d="M 5,35 Q 25,42 60,35 L 70,25 Q 55,32 20,28 Z" fill="#92400e" />

              {/* Main Mast 1 (Tiang Layar Depan) */}
              <line x1="32" y1="35" x2="32" y2="4" stroke="#451a03" strokeWidth="2" />
              {/* Main Mast 2 (Tiang Layar Belakang) */}
              <line x1="52" y1="33" x2="52" y2="8" stroke="#451a03" strokeWidth="2" />
              {/* Bowsprit (Anjungan Haluan Kapal) */}
              <line x1="70" y1="26" x2="90" y2="18" stroke="#451a03" strokeWidth="2" />

              {/* Billowing White/Cream Canvas Sails (Layar Pinisi) */}
              {/* Front Sail */}
              <path d="M 32,8 Q 44,14 44,28 L 32,28 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
              {/* Back Sail */}
              <path d="M 52,12 Q 62,18 62,30 L 52,30 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
              {/* Jib Triangle Sails (Layar Cucur) */}
              <polygon points="70,25 86,19 72,12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />

              {/* Indonesian Aviation / Maritime Red-White Flaglet */}
              <rect x="32" y="3" width="8" height="3" fill="#ef4444" />
              <rect x="32" y="6" width="8" height="3" fill="#ffffff" />
            </g>

            {/* 2.5D Rumah Tongkonan (Toraja High Boat-Shaped Horn Roof House) */}
            <g transform="translate(130, 45)">
              {/* Shadow */}
              <polygon points="5,60 45,35 90,60 50,85" fill="#000000" opacity="0.32" />

              {/* High Wooden Base Platform with Carvings (Pa'ssura) */}
              <polygon points="20,48 50,32 80,48 50,64" fill="#78350f" />
              <polygon points="20,48 50,64 50,72 20,56" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.8" />
              <polygon points="50,64 80,48 80,56 50,72" fill="#7c2d12" />

              {/* Giant Saddle / Boat Curved Roof (Atap Lengkung Menjulang) */}
              <path
                d="M -5,16 Q 20,38 50,28 Q 80,38 105,16 Q 95,8 80,18 Q 50,8 50,6 Q 50,8 20,18 Q 5,8 -5,16 Z"
                fill="#b91c1c"
                stroke="#facc15"
                strokeWidth="1.2"
              />
              {/* High Swooping Front & Rear Prows */}
              <path d="M -5,16 Q -12,4 -16,-4 Q -8,8 2,14" fill="#dc2626" />
              <path d="M 105,16 Q 112,4 116,-4 Q 108,8 98,14" fill="#dc2626" />

              {/* Buffalo Horns Stack (Tanduk Kerbau Toraja on Pillar) */}
              <line x1="50" y1="28" x2="50" y2="60" stroke="#fde047" strokeWidth="2.5" />
              <path d="M 46,40 Q 50,36 54,40" fill="none" stroke="#ffffff" strokeWidth="2" />
              <path d="M 45,46 Q 50,42 55,46" fill="none" stroke="#ffffff" strokeWidth="2" />
              <path d="M 44,52 Q 50,48 56,52" fill="none" stroke="#ffffff" strokeWidth="2" />
            </g>

            {/* Rammang-Rammang Karst Limestone Cliffs */}
            <g transform="translate(60, 35)">
              <polygon points="20,0 5,30 25,32" fill="#64748b" />
              <polygon points="20,0 25,32 38,28" fill="#475569" />
              <polygon points="35,6 25,32 45,34" fill="#94a3b8" />
              {/* Greenery on Karst top */}
              <circle cx="20" cy="1" r="3" fill="#16a34a" />
              <circle cx="35" cy="7" r="2.5" fill="#22c55e" />
            </g>

            {/* Coastal Coconut Palms */}
            <g transform="translate(195, 105)">
              <path d="M 15,30 Q 24,15 22,5" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="22" cy="5" rx="12" ry="4" fill="#16a34a" transform="rotate(-20 22 5)" />
              <ellipse cx="22" cy="5" rx="12" ry="4" fill="#15803d" transform="rotate(40 22 5)" />
              <circle cx="21" cy="7" r="1.5" fill="#ca8a04" />
            </g>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id={`isometric-island-${island.id}`}
      onClick={onClick}
      className={`relative cursor-pointer transition-transform duration-300 group select-none ${
        isSelected ? 'scale-105 z-30' : 'hover:scale-102 z-20'
      }`}
    >
      {/* Active Island Glowing Radar Aura */}
      {isCurrentActive && (
        <div className="absolute -inset-8 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
      )}

      {/* SVG 2.5D Isometric Platform & Terrain */}
      <svg
        viewBox="0 0 260 170"
        className="w-48 sm:w-60 md:w-72 h-auto drop-shadow-2xl overflow-visible transition-all"
      >
        <defs>
          {/* Island 3D Top Terrain Gradient */}
          <linearGradient id={`terrain-grad-${island.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={timeOfDay === 'night' ? '#1e3a29' : '#4ade80'} />
            <stop offset="60%" stopColor={timeOfDay === 'night' ? '#142e1f' : '#22c55e'} />
            <stop offset="100%" stopColor={timeOfDay === 'night' ? '#0f2317' : '#16a34a'} />
          </linearGradient>

          {/* Sandy Beach Rim Gradient */}
          <linearGradient id={`sand-grad-${island.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Left Cliff Wall Shading */}
          <linearGradient id={`cliff-left-${island.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Right Cliff Wall Shading */}
          <linearGradient id={`cliff-right-${island.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Coastal Shallow Water / Coral Reef Halo */}
          <radialGradient id={`reef-halo-${island.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Deep Ocean Floor Shadow under Island Platform */}
        <ellipse
          cx="130"
          cy="128"
          rx="118"
          ry="38"
          fill="#000000"
          opacity={timeOfDay === 'night' ? 0.6 : 0.35}
        />

        {/* 2. Coastal Shallow Reef Water Halo around Island */}
        <ellipse cx="130" cy="115" rx="122" ry="44" fill={`url(#reef-halo-${island.id})`} />

        {/* 3. 3D Isometric Cliff Walls (Extrusion Base) */}
        {/* Left Front Cliff Facet */}
        <path
          d="M 16,92 Q 70,122 130,122 L 130,140 Q 70,140 16,110 Z"
          fill={`url(#cliff-left-${island.id})`}
          stroke="#451a03"
          strokeWidth="1.2"
        />
        {/* Right Front Cliff Facet */}
        <path
          d="M 130,122 Q 190,122 244,92 L 244,110 Q 190,140 130,140 Z"
          fill={`url(#cliff-right-${island.id})`}
          stroke="#451a03"
          strokeWidth="1.2"
        />

        {/* Cliff Rock Strata Texture Lines */}
        <path
          d="M 40,102 Q 80,124 130,128 Q 180,124 220,102"
          fill="none"
          stroke="#ca8a04"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M 60,114 Q 95,130 130,132 Q 165,130 200,114"
          fill="none"
          stroke="#451a03"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* 4. Golden Sandy Beach Shoreline Rim (Top Perimeter) */}
        <path
          d="M 130,22 C 205,22 250,55 244,92 C 238,118 190,122 130,122 C 70,122 22,118 16,92 C 10,55 55,22 130,22 Z"
          fill={`url(#sand-grad-${island.id})`}
          stroke="#ca8a04"
          strokeWidth="1.5"
        />

        {/* 5. Top Grassy Lush Isometric Plateau (Main Landmass) */}
        <path
          d="M 130,28 C 196,28 238,58 232,88 C 226,112 184,115 130,115 C 76,115 34,112 28,88 C 22,58 64,28 130,28 Z"
          fill={`url(#terrain-grad-${island.id})`}
          stroke="#15803d"
          strokeWidth="1.5"
        />

        {/* Highlight Contour Edge on Top Surface */}
        <path
          d="M 38,82 C 32,58 70,34 130,34 C 190,34 228,58 222,82"
          fill="none"
          stroke="#86efac"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* 6. Specific Handcrafted 2.5D Island Landmarks & Flora */}
        {renderIslandDetails()}

        {/* Locked Island Fog / Grayscale Shroud */}
        {isLocked && (
          <g>
            <path
              d="M 130,22 C 205,22 250,55 244,92 C 238,118 190,122 130,122 C 70,122 22,118 16,92 C 10,55 55,22 130,22 Z"
              fill="#0f172a"
              opacity="0.6"
            />
            {/* Shrouded Fog Swirls */}
            <ellipse cx="130" cy="80" rx="60" ry="25" fill="#334155" opacity="0.4" />
          </g>
        )}
      </svg>

      {/* 3D Milestone Level Badge (Floating Game Pin) */}
      <div
        className={`absolute -top-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-transform duration-300 ${
          isSelected ? '-translate-y-2 scale-110' : ''
        }`}
      >
        {/* Active Island Flight Marker */}
        {isCurrentActive && (
          <div className="mb-1 bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center space-x-1 animate-bounce">
            <span>✈️</span>
            <span>Target Misi</span>
          </div>
        )}

        {/* 3D Game Milestone Pin */}
        <div
          className={`relative px-3 py-1.5 rounded-2xl flex items-center space-x-2 border-2 shadow-xl backdrop-blur-md transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 border-white text-white shadow-emerald-500/30'
              : isLocked
              ? 'bg-slate-800/90 border-slate-600 text-slate-400 shadow-slate-900/50'
              : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 border-white text-slate-950 shadow-amber-500/40'
          }`}
        >
          {/* Level Order Circle */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${
              isCompleted
                ? 'bg-emerald-700 text-white'
                : isLocked
                ? 'bg-slate-700 text-slate-400'
                : 'bg-white text-orange-600'
            }`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : `#${island.order}`}
          </div>

          {/* Island Label & Stars */}
          <div className="flex flex-col">
            <span className="font-black text-xs tracking-tight leading-none">
              {island.name.replace('Pulau ', '')}
            </span>

            {/* Stars row */}
            {!isLocked && (
              <div className="flex items-center space-x-0.5 mt-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-2.5 h-2.5 ${
                      s <= stars ? 'text-amber-300 fill-amber-300' : 'text-black/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sparkle on completed */}
          {isCompleted && (
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          )}
        </div>

        {/* Pin Stem Pointer (Isometric Ground Touch Point) */}
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-800/80 -mt-0.5 shadow-sm" />
      </div>
    </div>
  );
};
