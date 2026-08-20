import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager, mascotSpeechManager } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface KikoGameGuideHeaderProps {
  guideText: string;
  title?: string;
  gameName?: string;
  className?: string;
}

export const KikoGameGuideHeader: React.FC<KikoGameGuideHeaderProps> = ({
  guideText,
  title = 'Panduan Kiko',
  gameName,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to speech state
  useEffect(() => {
    const unsubscribe = mascotSpeechManager.addListener((speaking) => {
      setIsSpeaking(speaking);
      // When speech ends and balloon is open, auto close after 2.5 seconds
      if (!speaking && isOpen) {
        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 2500);
      }
    });
    return () => {
      unsubscribe();
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, [isOpen]);

  const handleToggle = () => {
    soundManager.playClick();
    if (!isOpen) {
      setIsOpen(true);
      // Play mascot chirp & speak
      soundManager.playMascotChirp(0.35);
      mascotSpeechManager.speak(guideText);

      // Fallback auto close after 8 seconds if speech synthesis is silent
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        mascotSpeechManager.stop();
      }, 8000);
    } else {
      setIsOpen(false);
      mascotSpeechManager.stop();
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    }
  };

  const handleManualClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    setIsOpen(false);
    mascotSpeechManager.stop();
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
  };

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      mascotSpeechManager.stop();
    } else {
      mascotSpeechManager.speak(guideText);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* 1. COMPACT HEADER BUTTON (Sejajar di Header Game) */}
      <button
        type="button"
        id="kiko-game-guide-btn"
        onClick={handleToggle}
        title="Klik untuk melihat & mendengar panduan bermain dari Kiko"
        className={`group flex items-center space-x-2 px-3 py-1.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs active:scale-95 select-none ${
          isOpen
            ? 'bg-amber-400 border-amber-500 text-amber-950 ring-2 ring-amber-300'
            : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-800'
        }`}
      >
        {/* Kiko Avatar Icon (Topi Pilot & Kacamata) */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white shadow-2xs overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform shrink-0">
          <img
            src="/kiko-logo.jpg"
            alt="Kiko Pilot"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Animated pulse dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
        </div>

        <div className="text-left hidden xs:block">
          <span className="font-heading font-black text-xs block leading-tight text-slate-800 group-hover:text-orange-600">
            Panduan Kiko
          </span>
          <span className="text-[9px] font-bold text-amber-700 block leading-none">
            {isOpen ? 'Tutup Petunjuk ✕' : 'Klik Bantuan 💡'}
          </span>
        </div>

        {/* Mini Speaker indicator when speaking */}
        {isSpeaking && (
          <Volume2 className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
        )}
      </button>

      {/* 2. FLOATING SPEECH BALLOON (Muncul saat diklik & Hilang Otomatis) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute right-0 top-full mt-2.5 z-50 w-72 sm:w-84 bg-white/95 backdrop-blur-md rounded-3xl p-4 border-3 border-amber-400 shadow-2xl shadow-amber-900/20 text-left space-y-2.5"
          >
            {/* Balloon Header */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-300 shadow-2xs shrink-0">
                  <img
                    src="/kiko-logo.jpg"
                    alt="Kiko Maskot"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-heading font-black text-xs text-amber-900 block leading-tight">
                    {title} {gameName ? `• ${gameName}` : ''}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    Suara Kiko Pendamping Belajar
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Audio speaker toggle */}
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                  title={isSpeaking ? 'Matikan Suara' : 'Ulangi Suara'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleManualClose}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 cursor-pointer transition-all"
                  title="Tutup Balon Petunjuk"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Guide Content Text */}
            <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 text-xs text-slate-700 font-medium leading-relaxed">
              <p className="font-heading font-bold text-amber-950 mb-1 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Cara Bermain & Misi:</span>
              </p>
              <p>{guideText}</p>
            </div>

            {/* Auto-Dismiss Notice Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>⏱️ Menghilang otomatis setelah selesai bicara</span>
              <button
                type="button"
                onClick={handleManualClose}
                className="text-orange-600 hover:underline cursor-pointer"
              >
                Tutup Sekarang
              </button>
            </div>

            {/* Tail pointing up to the Kiko button */}
            <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
