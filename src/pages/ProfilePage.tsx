import React, { useState, useRef } from 'react';
import { Island, ChildProgress, PageRoute, PhaseId } from '../types';
import { PHASES, AVATAR_OPTIONS } from '../data/mockData';
import { soundManager } from '../utils/audio';
import { MascotCharacter } from '../components/MascotCharacter';
import { NusantaraCulturalIcon } from '../components/illustrations/NusantaraCulturalIcon';
import { PilotAvatar } from '../components/PilotAvatar';
import {
  User,
  Star,
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  RotateCcw,
  Plane,
  Edit3,
  BookCheck,
  Check,
  GraduationCap,
  Users,
  Sparkles,
  AlertTriangle,
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePageProps {
  islands: Island[];
  progress: ChildProgress;
  onUpdateProgress: (updated: Partial<ChildProgress>) => void;
  onResetProgress: () => void;
  onNavigate: (route: PageRoute) => void;
  onOpenPhaseModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  islands,
  progress,
  onUpdateProgress,
  onResetProgress,
  onNavigate: _onNavigate,
  onOpenPhaseModal,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.childName);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('🎉 Progres petualangan berhasil di-reset!');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePhase = PHASES.find((p) => p.id === progress.phaseId) || PHASES[0];

  const handleSaveName = () => {
    soundManager.playClick();
    if (nameInput.trim()) {
      onUpdateProgress({ childName: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatar: typeof AVATAR_OPTIONS[0]) => {
    soundManager.playClick();
    onUpdateProgress({
      avatarIcon: avatar.icon,
      pilotTitle: avatar.desc,
      avatarPhoto: undefined, // Clear uploaded photo to show selected cartoon avatar
    });
    setToastMessage(`🎉 Karakter pilot diubah ke ${avatar.name}!`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleRemovePhoto = () => {
    soundManager.playClick();
    onUpdateProgress({ avatarPhoto: undefined });
    setToastMessage('🗑️ Foto profil dihapus, kembali ke karakter kartun.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress & crop center-square to max 256x256
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        const width = img.width;
        const height = img.height;

        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onUpdateProgress({ avatarPhoto: dataUrl });
          soundManager.playFanfare();
          setToastMessage('🎉 Foto profil pilot berhasil dipasang!');
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3500);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleConfirmReset = () => {
    soundManager.playFanfare();
    onResetProgress();
    setIsResetModalOpen(false);
    setToastMessage('🎉 Progres petualangan berhasil di-reset ke Pulau 1!');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const completedCount = progress.completedIslands.length;
  const totalEarnedStars = Object.values(progress.islandStars || {}).reduce<number>((sum, s) => sum + (typeof s === 'number' ? s : 0), 0);
  const calculatedStars = Math.max(progress.totalStars || 0, totalEarnedStars);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 relative">
      
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="player-photo-upload-input"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Unggah Foto Profil Pemain"
      />

      {/* Toast Notifikasi Sukses */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-emerald-400 flex items-center space-x-3 text-sm font-heading font-black"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Header Profile & Avatar Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-md shadow-amber-500/5 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Pilot Info & Avatar */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            
            {/* Avatar Circle with quick upload trigger */}
            <div className="relative shrink-0 group">
              <PilotAvatar
                avatarPhoto={progress.avatarPhoto}
                avatarIcon={progress.avatarIcon}
                altName={progress.childName}
                size="xl"
                className="border-4 border-amber-400 shadow-md"
              />

              {/* Upload badge button */}
              <button
                type="button"
                id="quick-upload-photo-btn"
                onClick={() => {
                  soundManager.playClick();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-1 -right-1 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl shadow-md border-2 border-white transition-transform group-hover:scale-110 cursor-pointer"
                title="Ganti atau Unggah Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Pilot Name & Title */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center space-x-1.5 bg-amber-100 px-3 py-0.5 rounded-full text-xs font-heading font-black text-amber-900 border border-amber-300">
                  <span>{progress.pilotTitle}</span>
                </span>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    if (onOpenPhaseModal) onOpenPhaseModal();
                  }}
                  className={`inline-flex items-center space-x-1 text-xs font-heading font-black px-2.5 py-0.5 rounded-full border cursor-pointer hover:scale-105 transition-transform ${activePhase.badgeBg} ${activePhase.badgeText}`}
                  title="Ganti Fase / Profil Anak"
                >
                  <span>{activePhase.icon}</span>
                  <span>{activePhase.title}</span>
                </button>
              </div>

              {isEditingName ? (
                <div className="flex items-center space-x-2 pt-1 max-w-xs">
                  <input
                    id="edit-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-slate-50 text-slate-900 px-3 py-1.5 rounded-xl text-sm font-bold w-full outline-none ring-2 ring-orange-400 border border-slate-300"
                    placeholder="Nama Pilot"
                  />
                  <button
                    id="save-name-btn"
                    onClick={handleSaveName}
                    className="p-2 rounded-xl btn-chunky-amber text-slate-900 font-bold cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-800 tracking-tight">
                    {progress.childName}
                  </h1>
                  <button
                    id="edit-name-toggle-btn"
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer"
                    title="Ubah Nama"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* High Impact Visual Stats Row */}
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <span className="bg-orange-100 text-orange-950 text-xs font-heading font-black px-2.5 py-1 rounded-xl border border-orange-300 flex items-center space-x-1">
                  <span>🔥 {progress.streak} Hari</span>
                </span>
                <span className="bg-amber-100 text-amber-950 text-xs font-heading font-black px-2.5 py-1 rounded-xl border border-amber-300 flex items-center space-x-1">
                  <span>⭐ {calculatedStars}/18</span>
                </span>
                <span className="bg-purple-100 text-purple-950 text-xs font-heading font-black px-2.5 py-1 rounded-xl border border-purple-300 flex items-center space-x-1">
                  <span>🏆 {progress.badges.length} Lencana</span>
                </span>
                <span className="bg-emerald-100 text-emerald-950 text-xs font-heading font-black px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center space-x-1">
                  <span>🪙 {progress.coins} Koin</span>
                </span>
              </div>

            </div>

          </div>

          {/* Mascot Guide */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <MascotCharacter
              mood="proud"
              size="md"
              speechTitle="Instruktur Kiko:"
              speechText={`Hebat! ${completedCount} dari 6 pulau ${activePhase.name} sudah tuntas!`}
              speechBubblePosition="left"
            />
          </div>

        </div>
      </div>

      {/* 2. Photo Upload & Customization Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md shadow-amber-500/5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-amber-200 pb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-slate-800 tracking-tight">
                Foto Profil & Karakter Pilot
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kamu bisa mengunggah foto wajah aslimu atau memilih karakter kartun nusantara
              </p>
            </div>
          </div>

          {progress.avatarPhoto && (
            <button
              type="button"
              id="remove-photo-btn"
              onClick={handleRemovePhoto}
              className="px-3 py-1.5 rounded-xl text-xs font-heading font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Foto Pemain</span>
            </button>
          )}
        </div>

        {/* Drag-and-Drop & Manual File Upload Box */}
        <div
          id="photo-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-3 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-orange-500 bg-orange-50/80 scale-[1.01]'
              : 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/80 hover:border-orange-400'
          }`}
        >
          {progress.avatarPhoto ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <PilotAvatar
                  avatarPhoto={progress.avatarPhoto}
                  altName={progress.childName}
                  size="xl"
                  className="border-4 border-emerald-400 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="font-heading font-black text-sm text-slate-800">
                  Foto Pemain Terpasang ✨
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Klik atau seret foto baru ke sini untuk mengganti foto
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-heading font-black shadow-xs flex items-center space-x-1.5 pointer-events-none"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto Lain dari Perangkat</span>
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-amber-200/80 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="font-heading font-black text-base text-slate-800">
                  Unggah Foto Asli Pemain (Anak / Siswa)
                </p>
                <p className="text-xs text-slate-600 font-medium max-w-md">
                  Tarik & lepaskan (*drag and drop*) foto ke sini, atau klik tombol di bawah untuk memilih berkas dari galeri perangkat.
                </p>
                <p className="text-[11px] text-amber-700 font-bold">
                  Mendukung JPG, PNG, atau WebP
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-heading font-black shadow-sm flex items-center space-x-2 pointer-events-none"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Pilih Foto dari Galeri / Komputer</span>
              </button>
            </>
          )}
        </div>

        {/* Cartoon Character Pilot Choices */}
        <div className="pt-3 space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-orange-500" />
            <h4 className="font-heading font-black text-sm text-slate-800">
              Atau Pilih Karakter Kartun Pilot Nusantara
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = !progress.avatarPhoto && progress.avatarIcon === avatar.icon;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  id={`avatar-select-${avatar.id}`}
                  onClick={() => handleSelectAvatar(avatar)}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center text-center space-y-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-md ring-4 ring-orange-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-300'
                  }`}
                >
                  <span className="text-3xl">{avatar.icon}</span>
                  <span className="text-xs font-heading font-black text-slate-800 leading-tight">
                    {avatar.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Quick Kurikulum Merdeka Phase & Multi-Child Switcher Banner */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md shadow-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activePhase.color} text-white flex items-center justify-center text-2xl shadow-xs shrink-0`}>
            {activePhase.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-black text-base text-slate-800">
                {activePhase.title}
              </h3>
              <span className="text-[10px] font-heading font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Aktif
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {activePhase.description}
            </p>
          </div>
        </div>

        <button
          id="open-phase-modal-btn"
          onClick={() => {
            soundManager.playClick();
            if (onOpenPhaseModal) onOpenPhaseModal();
          }}
          className="px-5 py-2.5 rounded-2xl btn-chunky-amber text-slate-900 font-heading font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Ganti Fase / Profil Anak</span>
        </button>
      </div>

      {/* 4. Paspor Penerbang Cilik 6 Pulau */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#FEF3C7] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-300 space-y-4">
        
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🛂</span>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-slate-800 tracking-tight">
                Buku Paspor {activePhase.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Koleksi stempel budaya Nusantara setelah menuntaskan kuis pulau
              </p>
            </div>
          </div>

          <span className="bg-amber-200/90 text-amber-950 text-xs font-heading font-black px-3 py-1 rounded-full border border-amber-400">
            {completedCount} / 6 Cap
          </span>
        </div>

        {/* 6 Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {islands.map((island) => {
            const isCompleted = progress.completedIslands.includes(island.id);
            const stars = progress.islandStars[island.id] || 0;

            return (
              <div
                key={island.id}
                id={`passport-stamp-${island.id}`}
                className={`rounded-2xl p-3 border-2 transition-all text-center flex flex-col items-center justify-between min-h-[120px] ${
                  isCompleted
                    ? 'bg-white border-amber-400 shadow-sm'
                    : 'bg-amber-50/50 border-amber-200/60 opacity-60'
                }`}
              >
                <div className="text-center">
                  <span className="text-[10px] font-heading font-black text-slate-500 block">
                    Pulau #{island.order}
                  </span>
                  <span className="font-heading font-black text-xs text-slate-800">
                    {island.name}
                  </span>
                </div>

                <div className="my-1.5 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center bg-amber-50 text-lg shadow-2xs rotate-6">
                        <NusantaraCulturalIcon nameOrId={island.name || island.culturalMotif.title} size="sm" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center bg-slate-100 text-slate-300">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {isCompleted ? (
                  <div className="flex items-center space-x-0.5 text-amber-500 text-xs">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 font-bold">Terkunci</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Koleksi Lencana Prestasi (Badges) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md shadow-amber-500/5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-black text-base text-slate-800">
              Koleksi Lencana Terbang
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {progress.badges.length} Diraih
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200 flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-xl shadow-xs shrink-0">
              🛩️
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800">
                Penerbang Pemula
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Memulai misi perdana di Fase {activePhase.name}
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-3.5 border flex items-center space-x-3 transition-all ${
            completedCount >= 3
              ? 'bg-orange-50/70 border-orange-200'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${
              completedCount >= 3 ? 'bg-orange-400 text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              🎖️
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800">
                Penjelajah 3 Pulau
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Menaklukkan 3 pulau di {activePhase.title}
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-3.5 border flex items-center space-x-3 transition-all ${
            completedCount >= 6
              ? 'bg-purple-50/70 border-purple-200'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${
              completedCount >= 6 ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              👑
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800">
                Kapten Khatulistiwa
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Menamatkan seluruh pulau di {activePhase.title}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 6. Zona Bahaya / Reset Progres */}
      <div className="bg-rose-50/40 rounded-3xl p-5 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-black text-sm text-rose-900">
            Mulai Ulang Petualangan
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Kembalikan petualangan pulau dan bintang ke awal untuk pilot <strong className="text-slate-800">{progress.childName}</strong>.
          </p>
        </div>

        <button
          type="button"
          id="reset-progress-btn"
          onClick={() => {
            soundManager.playClick();
            setIsResetModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 font-heading font-black text-xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Progres Anak Ini</span>
        </button>
      </div>

      {/* Modal Konfirmasi Reset Progres */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border-3 border-rose-300 shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-black text-slate-900 leading-tight">
                    Reset Petualangan?
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Profil: {progress.childName} (Fase {activePhase.name})
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 text-xs text-rose-950 font-medium space-y-1.5">
                <p>
                  Apakah kamu yakin ingin mengulang petualangan matematika untuk <strong>{progress.childName}</strong>?
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-rose-800 text-[11px]">
                  <li>Progres pulau akan kembali ke <strong>Pulau 1</strong>.</li>
                  <li>Bintang pulau akan diatur ulang ke <strong>0</strong>.</li>
                  <li>Koin akan diatur ke modal awal <strong>50 Koin</strong>.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  id="cancel-reset-btn"
                  onClick={() => {
                    soundManager.playClick();
                    setIsResetModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-heading font-black text-xs hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  id="confirm-reset-btn"
                  onClick={handleConfirmReset}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-black text-xs shadow-md border-b-3 border-rose-800 transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ya, Reset Sekarang</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
