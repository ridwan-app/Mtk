import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phase, ChildProgress, PhaseId } from '../types';
import { PHASES, AVATAR_OPTIONS, loadAllChildren, saveAllChildren, saveActiveChildId } from '../data/mockData';
import { soundManager } from '../utils/audio';
import { X, Check, UserPlus, Users, Sparkles, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import { PilotAvatar } from './PilotAvatar';

interface PhaseChildSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress: ChildProgress;
  onSwitchChild: (child: ChildProgress) => void;
  onUpdatePhase: (newPhaseId: PhaseId) => void;
}

export const PhaseChildSwitcherModal: React.FC<PhaseChildSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentProgress,
  onSwitchChild,
  onUpdatePhase,
}) => {
  const [activeTab, setActiveTab] = useState<'phase' | 'children'>('phase');
  const [childrenList, setChildrenList] = useState<ChildProgress[]>(loadAllChildren);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildPhase, setNewChildPhase] = useState<PhaseId>('fase-a');
  const [newChildAvatar, setNewChildAvatar] = useState(AVATAR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSelectPhase = (phaseId: PhaseId) => {
    soundManager.playCorrect();
    onUpdatePhase(phaseId);
    onClose();
  };

  const handleSelectChild = (child: ChildProgress) => {
    soundManager.playClick();
    saveActiveChildId(child.childId);
    onSwitchChild(child);
    onClose();
  };

  const handleCreateNewChild = () => {
    if (!newChildName.trim()) return;
    soundManager.playFanfare();

    const newChild: ChildProgress = {
      childId: `child-${Date.now()}`,
      childName: newChildName.trim(),
      phaseId: newChildPhase,
      pilotTitle: newChildAvatar.desc,
      avatarIcon: newChildAvatar.icon,
      currentIslandOrder: 1,
      completedIslands: [],
      islandStars: {},
      streak: 1,
      totalStars: 0,
      badges: ['Bibit Garuda'],
      lastActiveDate: new Date().toISOString(),
      coins: 50,
      fuel: 100,
      totalQuestionsAnswered: 0,
      correctAnswersCount: 0,
      soundEnabled: true,
    };

    const updated = [...childrenList, newChild];
    setChildrenList(updated);
    saveAllChildren(updated);
    saveActiveChildId(newChild.childId);
    onSwitchChild(newChild);

    setIsAddingChild(false);
    setNewChildName('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center">
        <motion.div
          id="phase-child-switcher-modal"
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="w-full max-w-xl bg-[#FFFDF9] rounded-3xl shadow-2xl overflow-hidden border-3 border-amber-300 flex flex-col max-h-[92vh] my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 sm:p-5 text-slate-900 relative shrink-0">
            <button
              id="close-phase-modal-btn"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center text-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-slate-900 text-xs font-heading font-black uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Kurikulum Merdeka SD</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
              Pilih Fase & Profil Anak 🇮🇩
            </h2>
            <p className="text-xs text-amber-950 font-bold mt-0.5">
              Pilot Aktif: <strong>{currentProgress.childName}</strong> • {PHASES.find(p => p.id === currentProgress.phaseId)?.title}
            </p>

            {/* Tab switchers */}
            <div className="flex items-center space-x-2 mt-3 bg-amber-500/40 p-1 rounded-2xl border border-amber-600/20">
              <button
                id="tab-phase-btn"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('phase');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                  activeTab === 'phase'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-900 hover:bg-white/40'
                }`}
              >
                🌱 Fase Belajar ({PHASES.find(p => p.id === currentProgress.phaseId)?.name})
              </button>
              <button
                id="tab-children-btn"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('children');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                  activeTab === 'children'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-900 hover:bg-white/40'
                }`}
              >
                👥 Ganti Profil Anak ({childrenList.length})
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            
            {/* Tab 1: Phase Selection (Fase A, B, C) */}
            {activeTab === 'phase' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-600 font-bold">
                  Pilih tingkat fase Kurikulum Merdeka untuk menyesuaikan pulau & materi kuis:
                </div>

                <div className="space-y-3">
                  {PHASES.map((phase) => {
                    const isSelected = currentProgress.phaseId === phase.id;
                    return (
                      <div
                        key={phase.id}
                        id={`phase-card-${phase.id}`}
                        onClick={() => handleSelectPhase(phase.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50/80 border-orange-500 shadow-md ring-3 ring-orange-200'
                            : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/40'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${phase.color} text-white flex items-center justify-center text-2xl shadow-xs shrink-0`}>
                            {phase.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-heading font-black text-base text-slate-800">
                                {phase.title}
                              </h3>
                              <span className="text-[10px] font-heading font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                6 Pulau
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                              {phase.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end sm:justify-center shrink-0">
                          {isSelected ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-500 text-white text-xs font-heading font-black px-3 py-1.5 rounded-full shadow-xs">
                              <Check className="w-4 h-4" />
                              <span>Aktif</span>
                            </span>
                          ) : (
                            <span className="text-xs font-heading font-black text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200">
                              Pilih Fase Ini
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Multi-Child Profile Switcher */}
            {activeTab === 'children' && (
              <div className="space-y-4">
                {!isAddingChild ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-bold">
                        Pilih anak untuk melanjutkan petualangan terpisah:
                      </span>
                      <button
                        id="add-child-toggle-btn"
                        onClick={() => {
                          soundManager.playClick();
                          setIsAddingChild(true);
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-heading font-black text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1 rounded-xl border border-orange-300 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Tambah Anak</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {childrenList.map((child) => {
                        const isCurrentActive = child.childId === currentProgress.childId;
                        const phaseData = PHASES.find((p) => p.id === child.phaseId) || PHASES[0];

                        return (
                          <div
                            key={child.childId}
                            id={`child-profile-${child.childId}`}
                            onClick={() => handleSelectChild(child)}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isCurrentActive
                                ? 'bg-amber-50 border-orange-500 shadow-md ring-3 ring-orange-200'
                                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <PilotAvatar
                                avatarPhoto={child.avatarPhoto}
                                avatarIcon={child.avatarIcon}
                                altName={child.childName}
                                size="md"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-heading font-black text-sm sm:text-base text-slate-800">
                                    {child.childName}
                                  </h4>
                                  <span className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-full border ${phaseData.badgeBg} ${phaseData.badgeText}`}>
                                    {phaseData.name} ({phaseData.gradeRange})
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-slate-500 font-bold mt-0.5">
                                  <span>⭐ {Math.max(child.totalStars || 0, Object.values(child.islandStars || {}).reduce<number>((s, val) => s + (typeof val === 'number' ? val : 0), 0))}</span>
                                  <span>🪙 {child.coins}</span>
                                  <span>🔥 {child.streak} Hari</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              {isCurrentActive ? (
                                <span className="text-xs font-heading font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aktif</span>
                                </span>
                              ) : (
                                <button className="text-xs font-heading font-black text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl border border-slate-300">
                                  Pilih
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* Form: Tambah Profil Anak Baru */
                  <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <h4 className="font-heading font-black text-sm text-slate-800">
                        Tambah Profil Anak Baru
                      </h4>
                      <button
                        onClick={() => setIsAddingChild(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        Batal
                      </button>
                    </div>

                    {/* Nama */}
                    <div>
                      <label className="text-xs font-heading font-black text-slate-700 block mb-1">
                        Nama Anak:
                      </label>
                      <input
                        type="text"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        placeholder="Contoh: Kapten Dika"
                        className="w-full bg-slate-50 px-3 py-2 rounded-xl text-sm font-bold border border-slate-300 outline-none ring-2 ring-orange-400"
                      />
                    </div>

                    {/* Pilih Fase */}
                    <div>
                      <label className="text-xs font-heading font-black text-slate-700 block mb-1">
                        Pilih Fase (Kelas):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {PHASES.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setNewChildPhase(p.id)}
                            className={`p-2 rounded-xl border-2 text-center text-xs font-heading font-black transition-all cursor-pointer ${
                              newChildPhase === p.id
                                ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-300'
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="block text-base">{p.icon}</span>
                            <span className="block mt-0.5">Fase {p.name}</span>
                            <span className="text-[10px] text-slate-500 block">{p.gradeRange}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pilih Avatar */}
                    <div>
                      <label className="text-xs font-heading font-black text-slate-700 block mb-1">
                        Pilih Avatar Pilot:
                      </label>
                      <div className="flex space-x-2 overflow-x-auto pb-1">
                        {AVATAR_OPTIONS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setNewChildAvatar(av)}
                            className={`p-2 rounded-xl border-2 shrink-0 text-center transition-all cursor-pointer ${
                              newChildAvatar.id === av.id
                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-300'
                                : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl block">{av.icon}</span>
                            <span className="text-[10px] font-heading font-bold text-slate-800 block mt-0.5">
                              {av.name.split(' ')[1]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Add */}
                    <button
                      id="save-new-child-btn"
                      onClick={handleCreateNewChild}
                      disabled={!newChildName.trim()}
                      className="w-full py-2.5 rounded-xl btn-chunky-orange text-white font-heading font-black text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50"
                    >
                      Simpan & Mulai Terbang 🚀
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer Close */}
          <div className="bg-[#FAF6EE] p-3.5 border-t border-amber-200 flex justify-end shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-heading font-black text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
