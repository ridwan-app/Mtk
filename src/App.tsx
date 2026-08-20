/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PageRoute, Island, ChildProgress, PhaseId } from './types';
import {
  ALL_ISLANDS,
  INITIAL_PROGRESS,
  getIslandsByPhase,
  loadChildProgress,
  saveChildProgress,
  loadIslands,
  saveIslands,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { BoardingPassModal } from './components/BoardingPassModal';
import { PhaseChildSwitcherModal } from './components/PhaseChildSwitcherModal';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { IslandMissionFlightPage } from './pages/IslandMissionFlightPage';
import { soundManager } from './utils/audio';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [progress, setProgress] = useState<ChildProgress>(loadChildProgress);
  const [islands, setIsIslands] = useState<Island[]>(loadIslands);

  // Modal state for viewing boarding pass before takeoff
  const [inspectingIsland, setInspectingIsland] = useState<Island | null>(null);
  const [isBoardingModalOpen, setIsBoardingModalOpen] = useState(false);

  // Modal state for Kurikulum Merdeka Phase & Multi-Child Switcher
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  // Active island mission flight (on PETA flow)
  const [activeMissionIsland, setActiveMissionIsland] = useState<Island | null>(null);

  // Filter islands for child's active Phase (6 islands)
  const currentPhaseIslands = islands.filter((isl) => isl.phaseId === progress.phaseId);

  // Keep sound manager in sync with progress
  useEffect(() => {
    soundManager.setSoundEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Persist progress to localStorage
  useEffect(() => {
    saveChildProgress(progress);
  }, [progress]);

  // Persist islands to localStorage
  useEffect(() => {
    saveIslands(islands);
  }, [islands]);

  const handleUpdateProgress = (updated: Partial<ChildProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updated };
      return next;
    });
  };

  const handleToggleSound = () => {
    const nextSound = !progress.soundEnabled;
    soundManager.setSoundEnabled(nextSound);
    handleUpdateProgress({ soundEnabled: nextSound });
    if (nextSound) {
      soundManager.playCorrect();
    }
  };

  const handleNavigate = (route: PageRoute) => {
    if (route === 'peta') {
      setActiveMissionIsland(null); // Return to full map view
    }
    setCurrentRoute(route);
  };

  // Called when an island is clicked in home or map: opens boarding pass
  const handleSelectIsland = (island: Island) => {
    setInspectingIsland(island);
    setIsBoardingModalOpen(true);
  };

  // Called when child clicks "Lepas Landas & Kuis" in boarding pass modal
  const handleStartFlight = (island: Island) => {
    setIsBoardingModalOpen(false);
    setActiveMissionIsland(island);
    setCurrentRoute('peta');
  };

  // Called when completing island quiz to unlock next island & update stars & reward coins
  const handleUnlockNextIsland = (completedIslandId: string, stars: number, rewardCoins: number = 0) => {
    const currentCompleted = islands.find((i) => i.id === completedIslandId);
    if (!currentCompleted) return;

    // Update island states for this phase
    const updatedIslands = islands.map((isl) => {
      if (isl.id === completedIslandId) {
        return { ...isl, status: 'completed' as const };
      }
      // Unlock the next consecutive island in the same phase
      if (isl.phaseId === currentCompleted.phaseId && isl.order === currentCompleted.order + 1) {
        return {
          ...isl,
          status: isl.status === 'completed' ? 'completed' : ('unlocked' as const),
        };
      }
      return isl;
    });

    setIsIslands(updatedIslands);
    saveIslands(updatedIslands);

    // Update progress state & localStorage atomically
    setProgress((prev) => {
      const prevStars = prev.islandStars[completedIslandId] || 0;
      const starDiff = Math.max(0, stars - prevStars);
      const completedSet = new Set([...prev.completedIslands, completedIslandId]);
      const nextOrder = Math.min(6, Math.max(prev.currentIslandOrder, currentCompleted.order + 1));

      const updatedProgress: ChildProgress = {
        ...prev,
        coins: prev.coins + rewardCoins,
        fuel: Math.min(100, prev.fuel + 10),
        completedIslands: Array.from(completedSet),
        islandStars: {
          ...prev.islandStars,
          [completedIslandId]: Math.max(prevStars, stars),
        },
        totalStars: prev.totalStars + starDiff,
        currentIslandOrder: nextOrder,
        streak: prev.streak + (prev.completedIslands.includes(completedIslandId) ? 0 : 1),
      };

      saveChildProgress(updatedProgress);
      return updatedProgress;
    });
  };

  // Switch active child profile in family
  const handleSwitchChild = (selectedChild: ChildProgress) => {
    setProgress(selectedChild);
    setActiveMissionIsland(null);
  };

  // Switch Phase for the active child
  const handleUpdatePhase = (newPhaseId: PhaseId) => {
    handleUpdateProgress({
      phaseId: newPhaseId,
      currentIslandOrder: 1,
    });
    setActiveMissionIsland(null);
  };

  // Reset progress back to initial state for active child
  const handleResetProgress = () => {
    const resetState: ChildProgress = {
      ...progress,
      currentIslandOrder: 1,
      completedIslands: [],
      islandStars: {},
      totalStars: 0,
      streak: 1,
      coins: 50,
      fuel: 100,
      totalQuestionsAnswered: 0,
      correctAnswersCount: 0,
    };
    setProgress(resetState);
    saveChildProgress(resetState);

    // Reset status of islands in this phase
    const resetIslands = islands.map((isl) => {
      if (isl.phaseId === progress.phaseId) {
        return {
          ...isl,
          status: isl.order === 1 ? ('unlocked' as const) : ('locked' as const),
        };
      }
      return isl;
    });
    setIsIslands(resetIslands);
    saveIslands(resetIslands);
    setActiveMissionIsland(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Friendly Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        progress={progress}
        onToggleSound={handleToggleSound}
        onOpenPhaseModal={() => setIsPhaseModalOpen(true)}
      />

      {/* Main Content Area with Smooth Route Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-28 sm:pb-32">
        <AnimatePresence mode="wait">
          {currentRoute === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage
                islands={currentPhaseIslands}
                progress={progress}
                onNavigate={handleNavigate}
                onSelectIsland={handleSelectIsland}
                onOpenPhaseModal={() => setIsPhaseModalOpen(true)}
              />
            </motion.div>
          )}

          {currentRoute === 'peta' && (
            <motion.div
              key={activeMissionIsland ? `flight-${activeMissionIsland.id}` : `peta-map-${progress.phaseId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeMissionIsland ? (
                <IslandMissionFlightPage
                  currentIsland={activeMissionIsland}
                  islands={currentPhaseIslands}
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onUnlockNextIsland={handleUnlockNextIsland}
                  onBackToMap={() => setActiveMissionIsland(null)}
                />
              ) : (
                <MapPage
                  islands={currentPhaseIslands}
                  progress={progress}
                  onNavigate={handleNavigate}
                  onSelectIsland={handleSelectIsland}
                />
              )}
            </motion.div>
          )}

          {currentRoute === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GamePage
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {currentRoute === 'profil' && (
            <motion.div
              key="profil"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ProfilePage
                islands={currentPhaseIslands}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onResetProgress={handleResetProgress}
                onNavigate={handleNavigate}
                onOpenPhaseModal={() => setIsPhaseModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Primary Bottom Navigation Bar (Colorful, Large, Prominent Icons) */}
      <BottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />

      {/* Boarding Pass Flight Modal */}
      <BoardingPassModal
        island={inspectingIsland}
        isOpen={isBoardingModalOpen}
        onClose={() => setIsBoardingModalOpen(false)}
        onStartFlight={handleStartFlight}
        progress={progress}
      />

      {/* Kurikulum Merdeka Phase & Multi-Child Switcher Modal */}
      <PhaseChildSwitcherModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        currentProgress={progress}
        onSwitchChild={handleSwitchChild}
        onUpdatePhase={handleUpdatePhase}
      />

      {/* Playful Footer */}
      <footer className="bg-white/80 border-t-2 border-amber-200/60 py-6 mb-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-heading font-bold text-slate-700">
            ✈️ <strong>NusantaraMath</strong> — Petualangan Pesawat Matematika Kurikulum Merdeka
          </p>
          <p className="text-amber-800/80 font-bold">
            Fase A (Kelas 1-2) • Fase B (Kelas 3-4) • Fase C (Kelas 5-6) 🇮🇩
          </p>
        </div>
      </footer>

    </div>
  );
}
