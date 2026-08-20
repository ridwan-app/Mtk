import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager, mascotSpeechManager } from '../utils/audio';

export type MascotMood = 'happy' | 'flying' | 'cheering' | 'thinking' | 'proud' | 'waving';

interface MascotCharacterProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechText?: string;
  speechTitle?: string;
  speechBubblePosition?: 'top' | 'right' | 'left' | 'bottom';
  className?: string;
  onMascotClick?: () => void;
  enableVoice?: boolean;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  speechText,
  speechTitle,
  speechBubblePosition = 'right',
  className = '',
  onMascotClick,
  enableVoice = true,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = mascotSpeechManager.addListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!enableVoice || !soundManager.isSoundEnabled()) {
      soundManager.playClick();
      return;
    }

    if (isSpeaking) {
      mascotSpeechManager.stop();
    } else if (speechText) {
      mascotSpeechManager.speak(speechText);
    } else {
      // Default cheerful greeting chirp
      soundManager.playMascotChirp(0.35);
      mascotSpeechManager.speak('Halo Teman Petualang! Ayo kita belajar matematika bersama Kiko!');
    }
  };

  const handleAvatarClick = () => {
    if (onMascotClick) {
      onMascotClick();
    } else {
      handleSpeak();
    }
  };

  // Dimensions based on size
  const sizeConfig = {
    sm: { width: 64, height: 64, bubbleMax: 'max-w-xs', textSize: 'text-xs' },
    md: { width: 96, height: 96, bubbleMax: 'max-w-sm', textSize: 'text-xs sm:text-sm' },
    lg: { width: 128, height: 128, bubbleMax: 'max-w-md', textSize: 'text-sm' },
    xl: { width: 160, height: 160, bubbleMax: 'max-w-lg', textSize: 'text-sm sm:text-base' },
  }[size];

  // Speaker control button inside speech bubble
  const renderSpeakerButton = () => (
    <button
      type="button"
      onClick={handleSpeak}
      title={isSpeaking ? 'Hentikan Suara Kiko' : 'Dengarkan Suara Kiko (Bahasa Indonesia)'}
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-black cursor-pointer transition-all active:scale-90 border shadow-xs select-none ${
        isSpeaking
          ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
      }`}
    >
      {isSpeaking ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>Suara Kiko Aktif</span>
          <span className="flex space-x-0.5 ml-1">
            <span className="w-1 h-2.5 bg-white rounded-full animate-pulse" />
            <span className="w-1 h-3.5 bg-white rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-white rounded-full animate-pulse delay-150" />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Dengarkan Kiko 🔊</span>
        </>
      )}
    </button>
  );

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Speech bubble on left if positioned left */}
      {speechText && speechBubblePosition === 'left' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative bg-white border-2 border-amber-200 rounded-3xl p-3.5 sm:p-4 shadow-md shadow-amber-500/5 ${sizeConfig.bubbleMax} text-left space-y-1.5`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {speechTitle ? (
              <span className="font-heading font-black text-xs text-amber-700 uppercase tracking-wider block">
                {speechTitle}
              </span>
            ) : (
              <span className="font-heading font-black text-[11px] text-amber-800">Kiko Garuda 🦅</span>
            )}
            {enableVoice && renderSpeakerButton()}
          </div>
          <p className={`font-medium text-slate-700 leading-snug ${sizeConfig.textSize}`}>
            {speechText}
          </p>
          {/* Bubble tail on right */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
          <div className="absolute top-1/2 -right-2.5 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-amber-200 -z-10" />
        </motion.div>
      )}

      {/* Speech bubble on top if positioned top */}
      {speechText && speechBubblePosition === 'top' && (
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative bg-white border-2 border-amber-200 rounded-3xl p-3.5 sm:p-4 shadow-md shadow-amber-500/5 ${sizeConfig.bubbleMax} text-left space-y-1.5`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {speechTitle ? (
                <span className="font-heading font-black text-xs text-amber-700 uppercase tracking-wider block">
                  {speechTitle}
                </span>
              ) : (
                <span className="font-heading font-black text-[11px] text-amber-800">Kiko Garuda 🦅</span>
              )}
              {enableVoice && renderSpeakerButton()}
            </div>
            <p className={`font-medium text-slate-700 leading-snug ${sizeConfig.textSize}`}>
              {speechText}
            </p>
            {/* Bubble tail bottom */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
            <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-amber-200 -z-10" />
          </motion.div>
        </div>
      )}

      {/* Vector Mascot SVG Avatar */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={
          isSpeaking
            ? {
                y: [0, -4, 0, -3, 0],
                rotate: [0, -1.5, 1.5, -1, 0],
              }
            : undefined
        }
        transition={
          isSpeaking
            ? {
                repeat: Infinity,
                duration: 0.6,
                ease: 'easeInOut',
              }
            : undefined
        }
        onClick={handleAvatarClick}
        className="relative shrink-0 cursor-pointer select-none"
        title="Klik untuk mendengarkan suara Kiko!"
      >
        {/* Animated Sound Glow Ripple when speaking */}
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.15, 0.6] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 rounded-full bg-amber-400 -z-10 blur-sm"
          />
        )}

        <svg
          width={sizeConfig.width}
          height={sizeConfig.height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="goggleGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Halo / Soft Glow */}
          <circle cx="60" cy="60" r="54" fill="#FEF3C7" opacity="0.6" />

          {/* Garuda Tail Feathers */}
          <path d="M 52 92 C 40 108, 48 114, 60 112 C 72 114, 80 108, 68 92 Z" fill="#D97706" />
          <path d="M 56 94 C 50 106, 56 110, 60 108 C 64 110, 70 106, 64 94 Z" fill="#F59E0B" />

          {/* Little Feet */}
          <ellipse cx="48" cy="104" rx="6" ry="3.5" fill="#EA580C" />
          <ellipse cx="72" cy="104" rx="6" ry="3.5" fill="#EA580C" />

          {/* Main Body (Fluffy Golden Garuda) */}
          <ellipse cx="60" cy="68" rx="36" ry="34" fill="url(#bodyGrad)" stroke="#D97706" strokeWidth="2.5" />

          {/* Belly Patch */}
          <ellipse cx="60" cy="74" rx="22" ry="20" fill="url(#bellyGrad)" />

          {/* Head Tuft / Feathers Crest */}
          <path
            d="M 52 24 C 48 12, 58 10, 60 18 C 62 8, 74 12, 68 24 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="2"
          />
          <path
            d="M 56 22 C 54 14, 60 12, 60 17 C 62 12, 66 14, 64 22 Z"
            fill="#FBBF24"
          />

          {/* Wings */}
          {mood === 'cheering' || mood === 'flying' || isSpeaking ? (
            /* Upraised joyful wings */
            <>
              <path
                d="M 28 62 C 12 40, 18 26, 32 38 C 36 44, 34 56, 30 64 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              <path
                d="M 92 62 C 108 40, 102 26, 88 38 C 84 44, 86 56, 90 64 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
            </>
          ) : mood === 'waving' ? (
            /* One waving wing */
            <>
              <path
                d="M 26 66 C 14 62, 16 80, 28 84 C 34 82, 34 72, 28 68 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              <path
                d="M 92 62 C 108 40, 104 26, 90 38 C 86 44, 88 56, 90 64 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
            </>
          ) : (
            /* Rested wings at side */
            <>
              <path
                d="M 26 62 C 16 66, 16 82, 28 86 C 34 84, 34 72, 28 64 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              <path
                d="M 94 62 C 104 66, 104 82, 92 86 C 86 84, 86 72, 92 64 Z"
                fill="url(#wingGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* Red-White Aviator Scarf */}
          <path
            d="M 38 60 C 46 66, 74 66, 82 60 C 86 66, 74 72, 60 72 C 46 72, 34 66, 38 60 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          {/* Fluttering Scarf Tails */}
          <path
            d="M 44 68 C 40 76, 32 82, 36 90 C 40 92, 48 84, 48 72 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          <path
            d="M 48 70 C 46 78, 42 84, 46 88 C 48 89, 52 82, 51 72 Z"
            fill="#FFFFFF"
          />

          {/* Aviator Goggles Strap */}
          <path d="M 28 40 Q 60 36 92 40" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />

          {/* Aviator Goggles Lenses */}
          {/* Left Goggle */}
          <circle cx="46" cy="40" r="13" fill="#78350F" />
          <circle cx="46" cy="40" r="10.5" fill="#D97706" />
          <circle cx="46" cy="40" r="9" fill="url(#goggleGlass)" />
          {/* Glass reflection shine */}
          <ellipse cx="43" cy="37" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 43 37)" />

          {/* Bridge */}
          <rect x="54" y="38" width="12" height="4" rx="2" fill="#78350F" />

          {/* Right Goggle */}
          <circle cx="74" cy="40" r="13" fill="#78350F" />
          <circle cx="74" cy="40" r="10.5" fill="#D97706" />
          <circle cx="74" cy="40" r="9" fill="url(#goggleGlass)" />
          {/* Glass reflection shine */}
          <ellipse cx="71" cy="37" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 71 37)" />

          {/* Cheerful Eyes under Goggles */}
          {mood === 'cheering' || mood === 'proud' ? (
            /* Curved happy squinting eyes ^ ^ */
            <>
              <path d="M 44 54 C 47 50, 51 50, 54 54" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 66 54 C 69 50, 73 50, 76 54" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Big sparky anime eyes */
            <>
              {/* Left Eye */}
              <circle cx="48" cy="53" r="5" fill="#1E293B" />
              <circle cx="46.5" cy="51.5" r="2" fill="#FFFFFF" />
              <circle cx="49.5" cy="54.5" r="1" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="72" cy="53" r="5" fill="#1E293B" />
              <circle cx="70.5" cy="51.5" r="2" fill="#FFFFFF" />
              <circle cx="73.5" cy="54.5" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Rosy Cheeks */}
          <ellipse cx="38" cy="58" rx="4.5" ry="3" fill="#F43F5E" opacity="0.5" />
          <ellipse cx="82" cy="58" rx="4.5" ry="3" fill="#F43F5E" opacity="0.5" />

          {/* Golden Eagle Beak */}
          <path
            d="M 54 56 C 54 52, 66 52, 66 56 C 66 64, 60 67, 60 67 C 60 67, 54 64, 54 56 Z"
            fill="#EA580C"
            stroke="#C2410C"
            strokeWidth="1.5"
          />
          {/* Beak smile line / open talking beak */}
          {isSpeaking ? (
            <ellipse cx="60" cy="60" rx="3.5" ry="2.5" fill="#7C2D12" />
          ) : (
            <path d="M 57 58 Q 60 61 63 58" stroke="#7C2D12" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          )}

          {/* Little Pilot Star Badge on Scarf */}
          <polygon
            points="60,74 61.5,78 65.5,78 62.5,80.5 63.5,84.5 60,82 56.5,84.5 57.5,80.5 54.5,78 58.5,78"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="0.8"
          />
        </svg>
      </motion.div>

      {/* Speech bubble on right (default) */}
      {speechText && speechBubblePosition === 'right' && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative bg-white border-2 border-amber-200 rounded-3xl p-3.5 sm:p-4 shadow-md shadow-amber-500/5 ${sizeConfig.bubbleMax} text-left space-y-1.5`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {speechTitle ? (
              <span className="font-heading font-black text-xs text-amber-700 uppercase tracking-wider block">
                {speechTitle}
              </span>
            ) : (
              <span className="font-heading font-black text-[11px] text-amber-800">Kiko Garuda 🦅</span>
            )}
            {enableVoice && renderSpeakerButton()}
          </div>
          <p className={`font-medium text-slate-700 leading-snug ${sizeConfig.textSize}`}>
            {speechText}
          </p>
          {/* Bubble tail on left */}
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
          <div className="absolute top-1/2 -left-2.5 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200 -z-10" />
        </motion.div>
      )}
    </div>
  );
};
