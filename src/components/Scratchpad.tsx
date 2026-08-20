import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eraser, Pencil, Trash2, X, Undo2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>('#2563eb');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to container rect
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = width;
      canvas.height = height;

      // Draw subtle grid lines for vertical math calculations (kertas berpetak)
      drawGrid(ctx, width, height);

      // Save baseline blank state
      const initialSnapshot = ctx.getImageData(0, 0, width, height);
      setHistory([initialSnapshot]);
    };

    const timer = setTimeout(resizeCanvas, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    const gridSize = 24;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    if (mode === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();

    // Save snapshot to history
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), snapshot]);
  };

  const handleClear = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas.width, canvas.height);
    const blankSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([blankSnapshot]);
  };

  const handleUndo = () => {
    soundManager.playClick();
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop(); // Remove current
    const previous = nextHistory[nextHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(nextHistory);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="scratchpad-overlay"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3.5 flex items-center justify-between text-slate-900">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-heading font-black text-base leading-tight">Papan Coretan Pilot</h3>
                  <p className="text-[11px] text-amber-950 font-bold">Gunakan untuk hitung susun ke bawah atau coret-coret!</p>
                </div>
              </div>
              <button
                id="scratchpad-close-btn"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white/60 hover:bg-white text-slate-800 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  id="pen-mode-btn"
                  onClick={() => {
                    soundManager.playClick();
                    setMode('pen');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-heading font-black transition-all cursor-pointer ${
                    mode === 'pen' ? 'bg-sky-500 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Pensil</span>
                </button>

                <button
                  id="eraser-mode-btn"
                  onClick={() => {
                    soundManager.playClick();
                    setMode('eraser');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-heading font-black transition-all cursor-pointer ${
                    mode === 'eraser' ? 'bg-orange-500 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Penghapus</span>
                </button>

                {/* Color pickers */}
                {mode === 'pen' && (
                  <div className="flex items-center space-x-1.5 pl-2 border-l border-amber-200">
                    {[
                      { color: '#2563eb', label: 'Biru' },
                      { color: '#dc2626', label: 'Merah' },
                      { color: '#16a34a', label: 'Hijau' },
                      { color: '#1e293b', label: 'Hitam' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => {
                          soundManager.playClick();
                          setPenColor(c.color);
                        }}
                        style={{ backgroundColor: c.color }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          penColor === c.color ? 'border-amber-400 scale-110 shadow-xs ring-2 ring-amber-300' : 'border-white'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="undo-canvas-btn"
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 text-xs font-heading font-black flex items-center space-x-1 border border-amber-200 cursor-pointer"
                  title="Urungkan Coretan"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  id="clear-canvas-btn"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-heading font-black flex items-center space-x-1 border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative flex-1 bg-white cursor-crosshair overflow-hidden touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
