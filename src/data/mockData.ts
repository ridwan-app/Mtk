import { Phase, Island, Question, ChildProgress, MiniGame, PhaseId } from '../types';
import { PHASES, ALL_ISLANDS } from './islandsData';
import { FASE_A_QUESTIONS } from './faseAQuestions';
import { FASE_B_QUESTIONS } from './faseBQuestions';
import { FASE_C_QUESTIONS } from './faseCQuestions';

export { PHASES, ALL_ISLANDS };

export interface AvatarOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'av-pilot-bimo', name: 'Kapten Bimo', icon: '🧑‍✈️', desc: 'Kapten Penjelajah Nusantara' },
  { id: 'av-pilot-alya', name: 'Kadet Alya', icon: '👧', desc: 'Kadet Bintang Muda' },
  { id: 'av-pilot-kenzo', name: 'Laksamana Kenzo', icon: '🧑‍🚀', desc: 'Laksamana Bintang Angkasa' },
  { id: 'av-pilot-rio', name: 'Penerbang Rio', icon: '👦', desc: 'Penerbang Pemberani' },
  { id: 'av-hero-siti', name: 'Pahlawan Siti', icon: '🦸‍♀️', desc: 'Penjaga Langit Khatulistiwa' },
  { id: 'av-hero-andi', name: 'Pahlawan Andi', icon: '🦸‍♂️', desc: 'Ksatria Hitung Cepat' },
  { id: 'av-scholar-nur', name: 'Cendekia Nur', icon: '🧕', desc: 'Pakar Matematika Cilik' },
  { id: 'av-pilot-fajar', name: 'Profesor Fajar', icon: '🧑‍🎓', desc: 'Penemu Teori Nusantara' },
];

// Combine all questions
export const ALL_QUESTIONS: Question[] = [
  ...FASE_A_QUESTIONS,
  ...FASE_B_QUESTIONS,
  ...FASE_C_QUESTIONS,
];

// Initial multi-child profiles supporting Fase A, B, and C
export const INITIAL_CHILDREN: ChildProgress[] = [
  {
    childId: 'child-1-bimo',
    childName: 'Bimo',
    phaseId: 'fase-b', // Fase B (Kelas 3-4 SD) - Main focus
    pilotTitle: 'Kapten Penjelajah Nusantara',
    avatarIcon: '🧑‍✈️',
    currentIslandOrder: 1,
    completedIslands: [],
    islandStars: {},
    streak: 1,
    totalStars: 0,
    badges: [],
    lastActiveDate: new Date().toISOString(),
    coins: 50, // Bonus pendaftaran pilot cilik perdana
    fuel: 100,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    soundEnabled: true,
  },
  {
    childId: 'child-2-alya',
    childName: 'Alya',
    phaseId: 'fase-a', // Fase A (Kelas 1-2 SD)
    pilotTitle: 'Kadet Bintang Muda',
    avatarIcon: '👧',
    currentIslandOrder: 1,
    completedIslands: [],
    islandStars: {},
    streak: 1,
    totalStars: 0,
    badges: [],
    lastActiveDate: new Date().toISOString(),
    coins: 50,
    fuel: 100,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    soundEnabled: true,
  },
  {
    childId: 'child-3-kenzo',
    childName: 'Kenzo',
    phaseId: 'fase-c', // Fase C (Kelas 5-6 SD)
    pilotTitle: 'Laksamana Bintang Angkasa',
    avatarIcon: '🧑‍🚀',
    currentIslandOrder: 1,
    completedIslands: [],
    islandStars: {},
    streak: 1,
    totalStars: 0,
    badges: [],
    lastActiveDate: new Date().toISOString(),
    coins: 50,
    fuel: 100,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    soundEnabled: true,
  },
];

// Mini-Games for each Phase
export const ALL_MINI_GAMES: MiniGame[] = [
  // === FASE A (Kelas 1-2) ===
  {
    id: 'balap-karung-a',
    phaseId: 'fase-a',
    name: 'Balap Karung',
    description: 'Lompat secepat kilat dengan menghitung penjumlahan & pengurangan angka 1–20 untuk mengalahkan maskot di lintasan lari!',
    category: 'Bilangan',
    thumbnailIcon: '🏃',
    isLocked: false,
    bgGradient: 'from-orange-400 to-amber-600',
    accentColor: '#f59e0b',
    tag: 'Penjumlahan & Pengurangan Cepat',
    rewardCoins: 30,
    difficulty: 'Mudah',
  },
  {
    id: 'tarik-tambang-a',
    phaseId: 'fase-a',
    name: 'Tarik Tambang',
    description: 'Bandingkan dua bilangan dengan simbol <, >, atau = untuk menarik tambang ke arah timmu!',
    category: 'Bilangan',
    thumbnailIcon: '🪢',
    isLocked: false,
    bgGradient: 'from-blue-400 to-indigo-600',
    accentColor: '#4f46e5',
    tag: 'Membandingkan Bilangan (<, >, =)',
    rewardCoins: 35,
    difficulty: 'Mudah',
  },
  {
    id: 'engklek-angka-a',
    phaseId: 'fase-a',
    name: 'Engklek Angka',
    description: 'Lompati petak engklek tradisional dengan menebak urutan bilangan maju, mundur, dan ganjil-genap!',
    category: 'Bilangan',
    thumbnailIcon: '👣',
    isLocked: false,
    bgGradient: 'from-emerald-400 to-teal-600',
    accentColor: '#059669',
    tag: 'Urutan Bilangan & Lompatan',
    rewardCoins: 35,
    difficulty: 'Mudah',
  },
  {
    id: 'ular-naga-a',
    phaseId: 'fase-a',
    name: 'Ular Naga',
    description: 'Buka gerbang naga panjang dengan melengkapi barisan pola bilangan sederhana dan pola bentuk!',
    category: 'Pola',
    thumbnailIcon: '🐉',
    isLocked: false,
    bgGradient: 'from-rose-400 to-pink-600',
    accentColor: '#e11d48',
    tag: 'Pola Bilangan & Gambar',
    rewardCoins: 40,
    difficulty: 'Sedang',
  },
  {
    id: 'gobak-sodor-a',
    phaseId: 'fase-a',
    name: 'Gobak Sodor',
    description: 'Lewati garis penjaga arena dengan membandingkan panjang, tinggi, dan berat benda sehari-hari!',
    category: 'Pengukuran',
    thumbnailIcon: '🛡️',
    isLocked: false,
    bgGradient: 'from-amber-400 to-yellow-600',
    accentColor: '#d97706',
    tag: 'Perbandingan Panjang & Berat',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },

  // === FASE B (Kelas 3-4) - 10 Mini Game Tradisional Nusantara ===
  {
    id: 'congklak-hitung-b',
    phaseId: 'fase-b',
    name: 'Congklak Hitung',
    description: 'Isi lubang congklak dan lumbung utama dengan menyelesaikan hitungan perkalian tabel 1–10!',
    category: 'Perkalian',
    thumbnailIcon: '🐚',
    isLocked: false,
    bgGradient: 'from-amber-400 to-orange-500',
    accentColor: '#ea580c',
    tag: 'Perkalian Cepat & Lumbung Biji',
    rewardCoins: 40,
    difficulty: 'Sedang',
  },
  {
    id: 'layang-layang-pecahan-b',
    phaseId: 'fase-b',
    name: 'Layang-Layang Pecahan',
    description: 'Terbangkan layang-layang ke langit tinggi setiap kali kamu mencocokkan pecahan senilai yang tepat!',
    category: 'Pecahan',
    thumbnailIcon: '🪁',
    isLocked: false,
    bgGradient: 'from-sky-400 to-blue-600',
    accentColor: '#0284c7',
    tag: 'Pecahan Senilai & Perbandingan',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },
  {
    id: 'egrang-bilangan-bulat-b',
    phaseId: 'fase-b',
    name: 'Egrang Bilangan Bulat',
    description: 'Melangkah maju atau mundur di atas egrang bambu melintasi garis bilangan positif dan negatif!',
    category: 'Bilangan Bulat',
    thumbnailIcon: '🎋',
    isLocked: false,
    bgGradient: 'from-teal-400 to-emerald-600',
    accentColor: '#0d9488',
    tag: 'Garis Bilangan & Keseimbangan',
    rewardCoins: 50,
    difficulty: 'Tantangan',
  },
  {
    id: 'bentengan-bangun-datar-b',
    phaseId: 'fase-b',
    name: 'Bentengan Bangun Datar',
    description: 'Rebut dan kepung benteng lawan dengan menghitung keliling dan luas bidang persegi, persegi panjang, dan segitiga!',
    category: 'Keliling & Luas',
    thumbnailIcon: '🏰',
    isLocked: false,
    bgGradient: 'from-emerald-400 to-green-600',
    accentColor: '#059669',
    tag: 'Keliling & Luas Area Benteng',
    rewardCoins: 50,
    difficulty: 'Tantangan',
  },
  {
    id: 'petak-jongkok-data-b',
    phaseId: 'fase-b',
    name: 'Petak Jongkok Data',
    description: 'Lari dan berjongkok di kotak data yang tepat sesuai pembacaan diagram batang, piktogram, dan tabel!',
    category: 'Pengumpulan Data',
    thumbnailIcon: '📊',
    isLocked: false,
    bgGradient: 'from-purple-400 to-indigo-600',
    accentColor: '#7c3aed',
    tag: 'Diagram Batang & Piktogram',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },
  {
    id: 'dam-daman-pembagian-b',
    phaseId: 'fase-b',
    name: 'Dam-Daman Pembagian',
    description: 'Gerakkan dan makan bidak lawan di papan dam tradisional dengan memecahkan pembagian bilangan bersisa & pas!',
    category: 'Pembagian',
    thumbnailIcon: '♟️',
    isLocked: false,
    bgGradient: 'from-amber-500 to-yellow-600',
    accentColor: '#d97706',
    tag: 'Pembagian Bidak Dam-Daman',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },
  {
    id: 'gasing-simetri-b',
    phaseId: 'fase-b',
    name: 'Gasing Simetri',
    description: 'Putar gasing kayu hingga menampilkan bentuk geometri, lalu tentukan jumlah sumbu simetri lipat dan putar!',
    category: 'Simetri & Pencerminan',
    thumbnailIcon: '🌀',
    isLocked: false,
    bgGradient: 'from-cyan-400 to-blue-600',
    accentColor: '#0891b2',
    tag: 'Sumbu Simetri & Putaran Gasing',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },
  {
    id: 'ular-tangga-waktu-b',
    phaseId: 'fase-b',
    name: 'Ular Tangga Waktu',
    description: 'Lempar dadu dan panjat tangga dengan menyelesaikan soal konversi waktu (jam/menit), berat (kg/g), dan panjang (m/cm)!',
    category: 'Pengukuran',
    thumbnailIcon: '🎲',
    isLocked: false,
    bgGradient: 'from-rose-400 to-red-600',
    accentColor: '#e11d48',
    tag: 'Konversi Waktu, Berat, & Panjang',
    rewardCoins: 50,
    difficulty: 'Sedang',
  },
  {
    id: 'pasar-pasaran-uang-b',
    phaseId: 'fase-b',
    name: 'Pasar-Pasaran Uang',
    description: 'Simulasi jual-beli jajanan pasar tradisional Nusantara, hitung total belanja dan kembalian uang Rupiah!',
    category: 'Uang & Transaksi',
    thumbnailIcon: '🏪',
    isLocked: false,
    bgGradient: 'from-emerald-500 to-teal-700',
    accentColor: '#047857',
    tag: 'Uang Rupiah & Kembalian Warung',
    rewardCoins: 50,
    difficulty: 'Sedang',
  },
  {
    id: 'kelereng-sudut-b',
    phaseId: 'fase-b',
    name: 'Kelereng Sudut',
    description: 'Arahkan dan jentikkan kelereng ke zona sudut yang tepat: sudut lancip, siku-siku, tumpul, atau lurus!',
    category: 'Sudut Dasar',
    thumbnailIcon: '⚪',
    isLocked: false,
    bgGradient: 'from-indigo-400 to-violet-600',
    accentColor: '#6366f1',
    tag: 'Sudut Lancip, Siku, & Tumpul',
    rewardCoins: 45,
    difficulty: 'Sedang',
  },

  // === FASE C (Kelas 5-6) ===
  {
    id: 'petak-umpet-skala-c',
    phaseId: 'fase-c',
    name: 'Petak Umpet Skala',
    description: 'Temukan lokasi persembunyian teman pada peta pulau dengan menghitung skala peta dan perbandingan senilai!',
    category: 'Perbandingan',
    thumbnailIcon: '🗺️',
    isLocked: false,
    bgGradient: 'from-blue-400 to-cyan-600',
    accentColor: '#2563eb',
    tag: 'Skala Peta & Rasio Perbandingan',
    rewardCoins: 55,
    difficulty: 'Tantangan',
  },
  {
    id: 'kelereng-statistik-c',
    phaseId: 'fase-c',
    name: 'Kelereng Statistik',
    description: 'Tembak kelereng sasaran dengan menganalisis rata-rata (mean), median, modus, dan diagram lingkaran!',
    category: 'Statistik',
    thumbnailIcon: '⚪',
    isLocked: false,
    bgGradient: 'from-indigo-400 to-violet-600',
    accentColor: '#4f46e5',
    tag: 'Mean, Median, Modus & Diagram',
    rewardCoins: 55,
    difficulty: 'Tantangan',
  },
  {
    id: 'gasing-fpb-kpk-c',
    phaseId: 'fase-c',
    name: 'Gasing FPB-KPK',
    description: 'Putar gasing kayu tradisional agar berputar kencang dengan memecahkan FPB dan KPK bilangan!',
    category: 'Bilangan',
    thumbnailIcon: '🌀',
    isLocked: false,
    bgGradient: 'from-amber-400 to-yellow-600',
    accentColor: '#d97706',
    tag: 'FPB & KPK Bilangan',
    rewardCoins: 50,
    difficulty: 'Tantangan',
  },
  {
    id: 'rumah-rumahan-volume-c',
    phaseId: 'fase-c',
    name: 'Rumah-Rumahan Volume',
    description: 'Bangun miniatur rumah adat Nusantara dengan menghitung volume kubus, balok, prisma, dan tabung!',
    category: 'Bangun Ruang',
    thumbnailIcon: '🏛️',
    isLocked: false,
    bgGradient: 'from-rose-400 to-amber-600',
    accentColor: '#e11d48',
    tag: 'Volume Bangun Ruang 3D',
    rewardCoins: 60,
    difficulty: 'Tantangan',
  },
  {
    id: 'dam-daman-desimal-c',
    phaseId: 'fase-c',
    name: 'Dam-Daman Desimal',
    description: 'Langkahkan bidak dam-daman di papan strategis dengan mengonversi pecahan biasa, pecahan desimal, dan persen!',
    category: 'Pecahan Lanjutan',
    thumbnailIcon: '♟️',
    isLocked: false,
    bgGradient: 'from-slate-600 to-slate-900',
    accentColor: '#334155',
    tag: 'Konversi Pecahan, Desimal & Persen',
    rewardCoins: 60,
    difficulty: 'Tantangan',
  },
];

export function getIslandsByPhase(phaseId: PhaseId): Island[] {
  return ALL_ISLANDS.filter((i) => i.phaseId === phaseId);
}

export function getMiniGamesByPhase(phaseId: PhaseId): MiniGame[] {
  return ALL_MINI_GAMES.filter((g) => g.phaseId === phaseId);
}

export const MINI_GAMES: MiniGame[] = ALL_MINI_GAMES;
export const MOCK_QUESTIONS = ALL_QUESTIONS;
export const INITIAL_PROGRESS = INITIAL_CHILDREN[0];
export const INITIAL_ISLANDS = ALL_ISLANDS;

const PROGRESS_STORAGE_KEY = 'nusantara_math_child_progress_v4';
const ISLANDS_STORAGE_KEY = 'nusantara_math_islands_v4';
const CHILDREN_STORAGE_KEY = 'nusantara_math_all_children_v4';
const ACTIVE_CHILD_ID_KEY = 'nusantara_math_active_child_id_v4';

export function loadAllChildren(): ChildProgress[] {
  if (typeof window === 'undefined') return INITIAL_CHILDREN;
  try {
    const saved = localStorage.getItem(CHILDREN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading all children:', e);
  }
  return INITIAL_CHILDREN;
}

export function saveAllChildren(children: ChildProgress[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(children));
  } catch (e) {
    console.error('Error saving all children:', e);
  }
}

export function loadActiveChildId(): string {
  if (typeof window === 'undefined') return INITIAL_CHILDREN[0].childId;
  try {
    const saved = localStorage.getItem(ACTIVE_CHILD_ID_KEY);
    if (saved) return saved;
  } catch (e) {
    console.error('Error loading active child id:', e);
  }
  return INITIAL_CHILDREN[0].childId;
}

export function saveActiveChildId(childId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_CHILD_ID_KEY, childId);
  } catch (e) {
    console.error('Error saving active child id:', e);
  }
}

export function loadChildProgress(): ChildProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const allChildren = loadAllChildren();
    const activeId = loadActiveChildId();
    const activeChild = allChildren.find((c) => c.childId === activeId);
    if (activeChild) return activeChild;

    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.childName) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return INITIAL_PROGRESS;
}

export function saveChildProgress(progress: ChildProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    const allChildren = loadAllChildren();
    const index = allChildren.findIndex((c) => c.childId === progress.childId);
    if (index >= 0) {
      allChildren[index] = progress;
    } else {
      allChildren.push(progress);
    }
    saveAllChildren(allChildren);
    saveActiveChildId(progress.childId);
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

export function loadIslands(): Island[] {
  if (typeof window === 'undefined') return ALL_ISLANDS;
  try {
    const saved = localStorage.getItem(ISLANDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === ALL_ISLANDS.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading islands:', e);
  }
  return ALL_ISLANDS;
}

export function saveIslands(islands: Island[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ISLANDS_STORAGE_KEY, JSON.stringify(islands));
  } catch (e) {
    console.error('Error saving islands:', e);
  }
}
