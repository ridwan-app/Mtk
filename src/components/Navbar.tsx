import React from 'react';
import { PageRoute, ChildProgress } from '../types';
import { PHASES } from '../data/mockData';
import { Plane, Volume2, VolumeX, Users, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { PilotAvatar } from './PilotAvatar';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  progress: ChildProgress;
  onToggleSound: () => void;
  onOpenPhaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  progress,
  onToggleSound,
  onOpenPhaseModal,
}) => {
  const activePhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b-2 border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand & Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => {
              soundManager.playClick();
              onNavigate('home');
            }}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-100 border-2 border-amber-400 border-b-4 overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/kiko-logo.jpg"
                alt="Kiko Maskot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-orange-500 rounded-tl-md flex items-center justify-center text-white text-[9px] shadow-xs">
                ✈️
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-black text-base sm:text-xl text-slate-800 tracking-tight leading-none">
                  Nusantara<span className="text-orange-500">Math</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 font-bold hidden sm:block">
                Petualangan Matematika Kurikulum Merdeka 🇮🇩
              </p>
            </div>
          </div>

          {/* User / Child Profile Info Card in Top Header */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Child Profile Pill / Badge */}
            <button
              type="button"
              id="active-child-header-card"
              onClick={() => {
                soundManager.playClick();
                if (onOpenPhaseModal) onOpenPhaseModal();
              }}
              className="flex items-center space-x-2.5 bg-white hover:bg-amber-50/90 border-2 border-amber-300/90 p-1.5 sm:py-1.5 sm:px-3 rounded-2xl shadow-xs transition-all cursor-pointer group text-left"
              title="Klik untuk ganti Fase atau Profil Siswa"
            >
              {/* Child Avatar Icon / Photo */}
              <PilotAvatar
                avatarPhoto={progress.avatarPhoto}
                avatarIcon={progress.avatarIcon}
                altName={progress.childName}
                size="sm"
                className="group-hover:scale-105 transition-transform"
              />

              {/* Name & Phase Details */}
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-black text-xs sm:text-sm text-slate-800 group-hover:text-orange-600 transition-colors truncate max-w-[90px] sm:max-w-[130px]">
                    {progress.childName}
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-md">
                    Pilot
                  </span>
                </div>
                
                {/* Phase Pill */}
                <div className="flex items-center space-x-1 text-[10px] font-heading font-extrabold text-slate-500">
                  <span className={`px-1.5 py-0.2 rounded-md border text-[9px] sm:text-[10px] font-black ${activePhase.badgeBg} ${activePhase.badgeText}`}>
                    Fase {activePhase.name} ({activePhase.gradeRange})
                  </span>
                </div>
              </div>

              {/* Switch icon */}
              <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100/60 text-amber-800 group-hover:bg-amber-200 transition-colors ml-1">
                <Users className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Sound Toggle Button */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                progress.soundEnabled
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
              title={progress.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Sound Toggle"
            >
              {progress.soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
