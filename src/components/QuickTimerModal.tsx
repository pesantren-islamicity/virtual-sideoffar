import React from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Clock,
  Plus,
  CheckCircle2,
  Minimize2
} from 'lucide-react';

interface QuickTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerSeconds: number;
  isRunning: boolean;
  initialDuration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: (newDuration?: number) => void;
  onAddMinutes: (minutes: number) => void;
}

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({
  isOpen,
  onClose,
  timerSeconds,
  isRunning,
  initialDuration,
  onStart,
  onPause,
  onReset,
  onAddMinutes
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const progressPercent = initialDuration > 0
    ? Math.max(0, Math.min(100, ((initialDuration - timerSeconds) / initialDuration) * 100))
    : 0;

  const presets = [
    { label: '15m Sprint', seconds: 15 * 60 },
    { label: '25m Pomodoro', seconds: 25 * 60 },
    { label: '45m Deep Work', seconds: 45 * 60 },
    { label: '5m Istirahat', seconds: 5 * 60 }
  ];

  return (
    <div
      id="quick-timer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="quick-timer-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Start Focus Timer
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sesi fokus produktivitas alur kerja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Tutup / Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center space-y-5 text-center">
          {/* Circular / Large Timer Display */}
          <div className="relative w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 shadow-inner">
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-500 transition-all duration-1000 opacity-80"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${progressPercent > 25 ? '100% 0%,' : ''} ${
                  progressPercent > 50 ? '100% 100%,' : ''
                } ${progressPercent > 75 ? '0% 100%,' : ''} 0% 0%)`
              }}
            />
            <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider mt-1 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              {isRunning ? 'Sesi Berjalan' : timerSeconds === 0 ? 'Sesi Selesai!' : 'Siap Mulai'}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {presets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => onReset(p.seconds)}
                className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  initialDuration === p.seconds
                    ? 'border-amber-500/80 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 w-full pt-1">
            <button
              onClick={() => onReset()}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {isRunning ? (
              <button
                onClick={onPause}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Pause className="w-4 h-4" />
                <span>Jeda Timer</span>
              </button>
            ) : (
              <button
                onClick={onStart}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Fokus</span>
              </button>
            )}

            <button
              onClick={() => onAddMinutes(5)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
              title="Tambah +5 Menit"
            >
              +5m
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>💡 Timer tetap berjalan saat diminimalkan</span>
          <button
            onClick={onClose}
            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Tutup & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
