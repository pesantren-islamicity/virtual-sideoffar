import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Timer,
  CheckSquare,
  Users,
  FileText,
  X,
  Volume2,
  Radio
} from 'lucide-react';

interface VoiceQuickActionsTriggerProps {
  onTriggerStartTimer: () => void;
  onTriggerNewTask: () => void;
  onTriggerLogMeeting: () => void;
  onTriggerQuickNote: () => void;
  onTriggerOpenMenu: () => void;
  onShowNotification: (title: string, message: string, priority?: 'info' | 'success' | 'urgent') => void;
}

export const VoiceQuickActionsTrigger: React.FC<VoiceQuickActionsTriggerProps> = ({
  onTriggerStartTimer,
  onTriggerNewTask,
  onTriggerLogMeeting,
  onTriggerQuickNote,
  onTriggerOpenMenu,
  onShowNotification
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedAction, setDetectedAction] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Play audio confirmation tone upon recognized voice command
  const playRecognitionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // audio context fallback
    }
  };

  const processSpokenPhrase = (phrase: string) => {
    const lower = phrase.toLowerCase().trim();

    if (
      lower.includes('start timer') ||
      lower.includes('timer') ||
      lower.includes('mulai timer') ||
      lower.includes('fokus')
    ) {
      setDetectedAction('Start Timer');
      playRecognitionChime();
      setTimeout(() => {
        setIsListening(false);
        setDetectedAction(null);
        setTranscript('');
        onTriggerStartTimer();
        onShowNotification('Perintah Suara Dikenali', 'Menjalankan "Start Timer" - Sesi fokus dimulai.', 'success');
      }, 500);
      return true;
    }

    if (
      lower.includes('new task') ||
      lower.includes('task') ||
      lower.includes('tugas baru') ||
      lower.includes('buat tugas') ||
      lower.includes('tambah tugas')
    ) {
      setDetectedAction('New Task');
      playRecognitionChime();
      setTimeout(() => {
        setIsListening(false);
        setDetectedAction(null);
        setTranscript('');
        onTriggerNewTask();
        onShowNotification('Perintah Suara Dikenali', 'Menjalankan "New Task" - Membuka formulir tugas kilat.', 'success');
      }, 500);
      return true;
    }

    if (
      lower.includes('log meeting') ||
      lower.includes('meeting') ||
      lower.includes('rapat') ||
      lower.includes('catat rapat') ||
      lower.includes('notulensi')
    ) {
      setDetectedAction('Log Meeting');
      playRecognitionChime();
      setTimeout(() => {
        setIsListening(false);
        setDetectedAction(null);
        setTranscript('');
        onTriggerLogMeeting();
        onShowNotification('Perintah Suara Dikenali', 'Menjalankan "Log Meeting" - Membuka pencatat rapat.', 'success');
      }, 500);
      return true;
    }

    if (
      lower.includes('quick note') ||
      lower.includes('note') ||
      lower.includes('catatan') ||
      lower.includes('memo')
    ) {
      setDetectedAction('Quick Note');
      playRecognitionChime();
      setTimeout(() => {
        setIsListening(false);
        setDetectedAction(null);
        setTranscript('');
        onTriggerQuickNote();
        onShowNotification('Perintah Suara Dikenali', 'Menjalankan "Quick Note" - Membuka scratchpad memo.', 'success');
      }, 500);
      return true;
    }

    if (
      lower.includes('quick actions') ||
      lower.includes('menu') ||
      lower.includes('aksi')
    ) {
      setDetectedAction('Quick Actions Menu');
      playRecognitionChime();
      setTimeout(() => {
        setIsListening(false);
        setDetectedAction(null);
        setTranscript('');
        onTriggerOpenMenu();
        onShowNotification('Perintah Suara Dikenali', 'Membuka menu Aksi Cepat.', 'info');
      }, 400);
      return true;
    }

    return false;
  };

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setTranscript('');
      setDetectedAction(null);
      return;
    }

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsListening(true);
      setTranscript('');
      onShowNotification(
        'Web Speech API Berjalan dalam Mode Interaktif',
        'Gunakan ucapan atau klik kata kunci: "start timer", "new task", atau "log meeting".',
        'info'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setDetectedAction(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        processSpokenPhrase(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onShowNotification(
            'Izin Mikrofon Diperlukan',
            'Harap izinkan akses mikrofon browser untuk menggunakan fitur perintah suara.',
            'urgent'
          );
          setIsListening(false);
        } else if (event.error !== 'no-speech') {
          // Keep active or reset
        }
      };

      recognition.onend = () => {
        // Will set to false if user didn't manually toggle
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      setIsListening(true);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // cleanup
        }
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Microphone Voice Trigger Button in the floating container */}
      <button
        id="voice-command-trigger-btn"
        data-testid="voice-command-trigger-btn"
        type="button"
        onClick={handleToggleListening}
        className={`flex items-center justify-center w-9 h-9 rounded-full border shadow-lg shadow-slate-900/10 transition-all cursor-pointer active:scale-95 ${
          isListening
            ? 'bg-rose-500 text-white border-rose-400 ring-4 ring-rose-400/40 animate-pulse'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-xl'
        }`}
        title={
          isListening
            ? 'Mendengarkan suara... (Katakan: "start timer", "new task", "log meeting")'
            : 'Aktifkan Perintah Suara ("start timer", "new task", "log meeting")'
        }
        aria-label="Voice command quick actions trigger"
      >
        {isListening ? (
          <Radio className="w-4 h-4 animate-spin text-white" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Voice Recognition HUD / Live Feedback Overlay */}
      {isListening && (
        <div
          id="voice-recognition-hud"
          data-testid="voice-recognition-hud"
          className="absolute bottom-full right-0 mb-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                Listening for Voice Command...
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.stop();
                  } catch {
                    // ignore
                  }
                }
                setIsListening(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              title="Tutup Voice Command"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time transcript feedback */}
          <div className="min-h-11 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 mb-2.5 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-center">
            {detectedAction ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Terdeteksi: {detectedAction}!</span>
              </div>
            ) : transcript ? (
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                "{transcript}"
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-400">
                Katakan salah satu kata kunci di bawah ini:
              </p>
            )}
          </div>

          {/* Quick Keyword Pills (Voice recognized or Clickable trigger) */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-0.5 tracking-wider">
              Kata Kunci Suara yang Didukung:
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => processSpokenPhrase('start timer')}
                className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/50 hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all text-center"
                title="Katakan 'start timer'"
              >
                <Timer className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-[10px] leading-tight">start timer</span>
              </button>

              <button
                type="button"
                onClick={() => processSpokenPhrase('new task')}
                className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/50 hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all text-center"
                title="Katakan 'new task'"
              >
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold text-[10px] leading-tight">new task</span>
              </button>

              <button
                type="button"
                onClick={() => processSpokenPhrase('log meeting')}
                className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/50 hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all text-center"
                title="Katakan 'log meeting'"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-[10px] leading-tight">log meeting</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 px-1">
              <span>Juga mendukung: 'quick note', 'menu'</span>
              <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Web Speech API</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
