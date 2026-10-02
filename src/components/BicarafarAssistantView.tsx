import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BicarafarMessage, LanguageCode, Task, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface BicarafarAssistantViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'synced'>) => void;
  onNavigateToTab: (tab: any) => void;
  isOnline: boolean;
}

export const BicarafarAssistantView: React.FC<BicarafarAssistantViewProps> = ({
  currentLang,
  userRole,
  tasks,
  onAddTask,
  onNavigateToTab,
  isOnline
}) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<BicarafarMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: t.assistant.greeting,
      timestamp: 'Baru saja',
      predictiveInsight: {
        riskLevel: 'medium',
        headline: 'Prediksi Bottleneck H-2 Terdeteksi',
        detail: 'Tugas "Audit Keamanan Enkripsi End-to-End" memerlukan percepatan review sebelum tenggat 18 September 2026.'
      },
      suggestedAction: {
        type: 'create_task',
        label: 'Otomatisasi Penjadwalan Review',
        payload: {
          title: 'Review Audit Kriptografi H-1',
          priority: 'urgent',
          deadline: '2026-09-17',
          description: 'Peninjauan mendesak kesiapan kunci HSM dan standar AES-256 GCM.'
        }
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const langCodes: Record<LanguageCode, string> = {
        id: 'id-ID',
        en: 'en-US',
        ar: 'ar-SA',
        ja: 'ja-JP',
        zh: 'zh-CN'
      };
      recognition.lang = langCodes[currentLang] || 'id-ID';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Browser tidak mendukung Web Speech Recognition langsung di dalam frame ini.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser tidak mendukung sintesis suara.');
      return;
    }

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langVoiceCodes: Record<LanguageCode, string> = {
      id: 'id-ID',
      en: 'en-US',
      ar: 'ar-SA',
      ja: 'ja-JP',
      zh: 'zh-CN'
    };
    utterance.lang = langVoiceCodes[currentLang] || 'id-ID';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsSpeakingId(null);
    };
    utterance.onerror = () => {
      setIsSpeakingId(null);
    };

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const query = (promptToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: BicarafarMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bicarafar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
          context: {
            tasksCount: tasks.length,
            urgentCount: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
            userRole
          }
        })
      });

      if (!response.ok) throw new Error('Failed to reach Bicarafar service');

      const data = await response.json();
      const aiMsg: BicarafarMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Permintaan Anda telah diproses oleh asisten Bicarafar.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction,
        predictiveInsight: data.predictiveInsight
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Local fallback in case of connection drop
      const aiMsg: BicarafarMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `[Mode Offline / Resilien] Bicarafar menganalisis: "${query}". Sistem mencatat alur kerja secara lokal dan siap menyinkronkan saat terhubung kembali ke sideoffar.cloud.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        predictiveInsight: {
          riskLevel: 'low',
          headline: 'Penyimpanan Cache Resilien Aktif',
          detail: 'Semua perubahan disimpan di brankas lokal berenkripsi.'
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (action: NonNullable<BicarafarMessage['suggestedAction']>) => {
    if (action.type === 'create_task' && action.payload) {
      onAddTask({
        title: action.payload.title || 'Tugas Otomatis via Bicarafar',
        description: action.payload.description || 'Dibuat otomatis oleh AI Bicarafar',
        priority: action.payload.priority || 'high',
        status: 'todo',
        deadline: action.payload.deadline || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        assignee: 'Farhan Maulana',
        tags: ['AI-Auto', 'Bicarafar'],
        estimatedHours: 8,
        actualHours: 0
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {}

      // Add feedback system message
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `Berhasil menambahkan tugas "${action.payload.title}" ke dalam papan alur kerja sideoffar.cloud.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (action.type === 'resolve_risk') {
      onNavigateToTab('tasks');
    } else if (action.type === 'encrypt_vault') {
      onNavigateToTab('vault');
    } else if (action.type === 'export_report') {
      onNavigateToTab('analytics');
    }
  };

  const quickPrompts = [
    t.assistant.quickPrompts.optimize,
    t.assistant.quickPrompts.riskAnalysis,
    t.assistant.quickPrompts.createTask,
    t.assistant.quickPrompts.summarize
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/50 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Bicarafar Virtual Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                Gemini 3.8 Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.assistant.subtitle}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Aktif & Mengoptimalkan</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-3xl">
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-600/10'
                    : msg.sender === 'system'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/50 w-full'
                    : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Predictive Insight Card */}
                {msg.predictiveInsight && (
                  <div className="mt-3 p-3 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{msg.predictiveInsight.headline}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          msg.predictiveInsight.riskLevel === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                            : msg.predictiveInsight.riskLevel === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        }`}
                      >
                        Risk: {msg.predictiveInsight.riskLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {msg.predictiveInsight.detail}
                    </p>
                  </div>
                )}

                {/* Suggested Action Button */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => handleExecuteAction(msg.suggestedAction!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs group cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">1-Klik Eksekusi Alur Kerja</span>
                  </div>
                )}
              </div>
            </div>

            {/* Read Aloud Button & Timestamp */}
            {msg.sender === 'assistant' && (
              <div className="flex items-center gap-3 mt-1 ml-10 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                <button
                  onClick={() => speakMessage(msg.id, msg.text)}
                  className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {isSpeakingId === msg.id ? (
                    <>
                      <VolumeX className="w-3 h-3 text-indigo-500 animate-pulse" />
                      <span className="text-indigo-500">{t.assistant.stopVoice}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3" />
                      <span>{t.assistant.speakVoice}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 pl-10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Bicarafar sedang menganalisis data alur kerja & menyusun wawasan prediktif...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Otomasi Cepat:
        </span>
        {quickPrompts.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(promptText)}
            className="text-xs shrink-0 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form with Voice Button */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isListening ? 'Hentikan Mendengarkan' : 'Perintah Suara (Speech to Text)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            id="bicarafar-prompt-input"
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder={isListening ? t.assistant.listening : t.assistant.inputPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
