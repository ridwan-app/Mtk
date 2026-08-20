import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Island, ChildProgress } from '../types';
import { Plane, Star, Sparkles, X, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { IslandVectorArt } from './illustrations/IslandVectorArt';
import { NusantaraCulturalIcon } from './illustrations/NusantaraCulturalIcon';

interface BoardingPassModalProps {
  island: Island | null;
  isOpen: boolean;
  onClose: () => void;
  onStartFlight: (island: Island) => void;
  progress: ChildProgress;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  island,
  isOpen,
  onClose,
  onStartFlight,
  progress,
}) => {
  if (!island) return null;

  const starsEarned = progress.islandStars[island.id] || 0;
  const isLocked = island.status === 'locked' && !progress.completedIslands.includes(island.id) && island.order > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center">
          <motion.div
            id="boarding-pass-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Boarding Pass Header (Warm Gradient with Island Emoji) */}
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 sm:p-5 text-slate-900 relative shrink-0">
              <button
                id="close-boarding-pass-btn"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center text-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-slate-800 text-[11px] font-heading font-black uppercase tracking-wider mb-1.5">
                <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                <span>Garuda Math Airways • Tiket Boarding Pass</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/30 backdrop-blur-xs border border-white/40 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    <NusantaraCulturalIcon nameOrId={island.name || island.culturalMotif.title} size="sm" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                      Pulau {island.name}
                    </h2>
                    <p className="text-xs text-amber-950 font-bold">
                      {island.culturalMotif.title}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-heading font-black text-slate-900 border border-amber-500/30">
                    Misi #{island.order}
                  </span>
                </div>
              </div>
            </div>

            {/* Cutout punch decoration */}
            <div className="relative bg-white flex items-center justify-between px-2 -my-2.5 z-10 shrink-0">
              <div className="w-5 h-5 bg-slate-900/60 rounded-full -ml-4" />
              <div className="flex-1 border-t-2 border-dashed border-amber-300 mx-2" />
              <div className="w-5 h-5 bg-slate-900/60 rounded-full -mr-4" />
            </div>

            {/* Content Body with smooth scrolling */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              
              {/* Math Topic Info */}
              <div className="bg-sky-50/80 rounded-2xl p-3.5 sm:p-4 border-2 border-sky-200">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-black uppercase tracking-wider text-sky-700">
                      Topik Matematika {island.targetClass}
                    </span>
                    <h4 className="text-sm sm:text-base font-heading font-black text-slate-800 leading-snug mt-0.5">
                      {island.topicName}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {island.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Combined Cultural Fun Fact & Island Illustration */}
              <div className="bg-[#FFFDF9] rounded-2xl p-3.5 sm:p-4 border-2 border-amber-200">
                <div className="flex items-center sm:items-start gap-3 sm:gap-4">
                  {/* Island Vector Illustration Badge */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF6EE] rounded-2xl border-2 border-amber-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <IslandVectorArt islandId={island.id} size="sm" className="w-full h-full object-contain" />
                  </div>

                  {/* Cultural Facts & Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs">✨</span>
                      <span className="text-[10px] font-heading font-black uppercase tracking-wider text-amber-800">
                        Fakta Budaya & Destinasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {island.culturalMotif.funFact}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="bg-amber-100/70 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                        <span>🏛️</span> {island.culturalMotif.landmark}
                      </span>
                      <span className="bg-amber-100/70 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                        <span>🎨</span> {island.culturalMotif.cultureItem}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Rating / Completion status */}
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-amber-50/70 rounded-2xl border-2 border-amber-200 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-heading font-black text-amber-900">Bintang Didapat:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= starsEarned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  {progress.completedIslands.includes(island.id) ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 text-xs font-heading font-black bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </span>
                  ) : isLocked ? (
                    <span className="inline-flex items-center space-x-1 text-slate-500 text-xs font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-orange-700 text-xs font-heading font-black bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Siap Terbang</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1 shrink-0">
                <button
                  id="cancel-boarding-btn"
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                  }}
                  className="w-full py-2.5 sm:py-3 px-3 rounded-2xl btn-chunky-white text-slate-700 font-heading font-black text-xs sm:text-sm cursor-pointer border border-slate-200 flex items-center justify-center text-center"
                >
                  Nanti Dulu
                </button>

                <button
                  id="takeoff-flight-btn"
                  disabled={isLocked}
                  onClick={() => {
                    soundManager.playTakeoff();
                    onStartFlight(island);
                  }}
                  className={`w-full py-2.5 sm:py-3 px-3 rounded-2xl font-heading font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer text-center ${
                    isLocked
                      ? 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed'
                      : 'btn-chunky-orange text-white active:scale-95'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform -rotate-45 shrink-0" />
                  <span className="truncate">{progress.completedIslands.includes(island.id) ? 'Terbang Lagi' : 'Lepas Landas! ✈️'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
