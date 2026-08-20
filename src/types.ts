export type PhaseId = 'fase-a' | 'fase-b' | 'fase-c';

export interface Phase {
  id: PhaseId;
  name: 'A' | 'B' | 'C';
  gradeRange: string; // misal "Kelas 1-2"
  title: string; // misal "Fase A (Kelas 1-2 SD)"
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}

export type IslandStatus = 'locked' | 'unlocked' | 'completed';

export interface Island {
  id: string;
  phaseId: PhaseId;
  name: string;
  topicName: string;
  order: number; // 1 to 6
  status: IslandStatus;
  icon: string;
  culturalMotif: {
    title: string;
    landmark: string;
    cultureItem: string;
    funFact: string;
    iconEmoji: string;
    badgeName: string;
    color: string;
    accentColor: string;
  };
  description: string;
  targetClass: string;
  mapCoords: {
    xPercent: number; // 0 to 100 for responsive map plotting
    yPercent: number; // 0 to 100
  };
}

export interface Question {
  id: string;
  islandId: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-based index of options
  explanation: string;
  hint?: string;
  mathFormula?: string;
  category?: string;
}

export interface IslandResult {
  islandId: string;
  starsEarned: number;
  score: number;
  completedAt: string;
}

export type MiniGameCategory = 'Bilangan' | 'Aljabar' | 'Geometri' | 'Pengukuran';

export interface MiniGame {
  id: string;
  phaseId: PhaseId;
  name: string;
  description: string;
  category: string;
  thumbnailIcon: string;
  isLocked: boolean;
  bgGradient?: string;
  accentColor?: string;
  tag?: string;
  rewardCoins?: number;
  difficulty?: 'Mudah' | 'Sedang' | 'Tantangan';
}

export interface ChildProgress {
  childId: string;
  childName: string;
  phaseId: PhaseId;
  pilotTitle: string;
  avatarIcon: string;
  avatarPhoto?: string; // Optional Base64 data URL for uploaded player photo
  currentIslandOrder: number; // 1 to 6
  completedIslands: string[]; // array of island ids
  islandStars: Record<string, number>; // islandId -> stars (1, 2, 3)
  streak: number; // consecutive days
  totalStars: number;
  badges: string[]; // badge ids or names
  lastActiveDate: string;
  coins: number;
  fuel: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  soundEnabled: boolean;
  miniGameScores?: Record<string, number>;
}

export type PageRoute = 'home' | 'peta' | 'game' | 'profil';
