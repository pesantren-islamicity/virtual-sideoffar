/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Navbar
} from './components/Navbar';
import {
  Sidebar,
  TabType
} from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BicarafarAssistantView } from './components/BicarafarAssistantView';
import { TasksKanbanCalendarView } from './components/TasksKanbanCalendarView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { PredictiveAnalyticsView } from './components/PredictiveAnalyticsView';
import { IntegrationsView } from './components/IntegrationsView';
import { SecurityView } from './components/SecurityView';
import { QuickTaskModal } from './components/QuickTaskModal';
import { QuickTimerModal } from './components/QuickTimerModal';
import { QuickNoteModal } from './components/QuickNoteModal';
import { LogMeetingModal } from './components/LogMeetingModal';
import { RecentActivitiesFeed } from './components/RecentActivitiesFeed';
import { VoiceQuickActionsTrigger } from './components/VoiceQuickActionsTrigger';
import {
  mockTasks,
  mockTeamMembers,
  mockDocuments,
  mockIntegrations,
  mockNotifications
} from './data/mockData';
import {
  Task,
  TaskStatus,
  TeamMember,
  DocumentItem,
  ThirdPartyIntegration,
  PushNotification,
  LanguageCode,
  UserRole,
  SyncState,
  QuickActionActivity
} from './types';
import {
  printExecutivePDFReport,
  exportTasksToSheetsCSV
} from './utils/exportUtils';
import {
  Bot,
  Zap,
  X,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Timer,
  FileText,
  Users,
  ChevronUp,
  ChevronDown,
  Search,
  Clock,
  ArrowDownAZ,
  Pin,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('sof_theme') === 'dark' ||
      (!('sof_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Language & Role State
  const [currentLang, setCurrentLang] = useState<LanguageCode>('id');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Core Data States with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('sof_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => t && typeof t === 'object' && t.id && t.title);
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data tugas dari cache lokal:', e);
    }
    return mockTasks;
  });

  const [team, setTeam] = useState<TeamMember[]>(mockTeamMembers);
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('sof_docs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(d => d && typeof d === 'object' && d.id && d.title);
        }
      }
    } catch (e) {
      console.warn('Gagal membaca dokumen dari cache lokal:', e);
    }
    return mockDocuments;
  });

  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>(mockIntegrations);
  const [notifications, setNotifications] = useState<PushNotification[]>(mockNotifications);

  // Cloud Sync State
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncedTimestamp: '16 Sep 2026, 13:40 WIB',
    pendingQueueCount: 0
  });

  // Toast alert state
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    priority: 'urgent' | 'info' | 'success';
  } | null>(null);

  // Quick Task Modal State (direct action without navigation)
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);

  // Quick Actions Utility Hub States
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [quickActionsSearchQuery, setQuickActionsSearchQuery] = useState('');
  const [quickActionsSortMode, setQuickActionsSortMode] = useState<'time' | 'alpha'>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_actions_sort_mode');
      if (stored === 'alpha' || stored === 'time') return stored;
    } catch {
      // fallback
    }
    return 'time';
  });

  // Pinned quick actions list (persisted in localStorage)
  const [pinnedQuickActions, setPinnedQuickActions] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_actions_pinned');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const togglePinAction = (actionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setPinnedQuickActions(prev => {
      const isPinned = prev.includes(actionId);
      const updated = isPinned ? prev.filter(id => id !== actionId) : [...prev, actionId];
      try {
        localStorage.setItem('sof_quick_actions_pinned', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Collapsible category sections state (persisted in localStorage)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_actions_collapsed_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      }
    } catch {
      // fallback
    }
    return {};
  });

  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const updated = {
        ...prev,
        [categoryId]: !prev[categoryId]
      };
      try {
        localStorage.setItem('sof_quick_actions_collapsed_categories', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = useState(false);
  const [isLogMeetingModalOpen, setIsLogMeetingModalOpen] = useState(false);

  // Focus Sprint Timer State
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Quick Timer Presets (defaults: 10m, 25m, 50m, persisted in localStorage)
  const [timerPresets, setTimerPresets] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_timer_presets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(n => typeof n === 'number' && n > 0)) {
          return parsed;
        }
      }
    } catch {}
    return [10, 25, 50];
  });
  const [isConfiguringPresets, setIsConfiguringPresets] = useState(false);
  const [presetDraft, setPresetDraft] = useState<number[]>(() => [10, 25, 50]);

  // Keep draft in sync with current presets
  useEffect(() => {
    setPresetDraft(timerPresets);
  }, [timerPresets]);

  // Helper to start preset timer instantly
  const startPresetTimer = (minutes: number) => {
    setIsQuickActionsOpen(false);
    setTimerDuration(minutes * 60);
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    logQuickActivity('timer', `${minutes}m Timer Preset`, `Sesi fokus ${minutes} menit dimulai`);
    showToast('Timer Dimulai', `Timer fokus ${minutes} menit telah berjalan secara instan.`, 'info');
  };

  // Recent Activities Feed for Quick Actions (historical log of last 5 performed quick actions)
  const [quickActivities, setQuickActivities] = useState<QuickActionActivity[]>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_actions_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'act-1',
        type: 'timer',
        title: 'Focus Sprint',
        detail: 'Sesi fokus 25 menit dimulai',
        timestamp: '15:10',
        createdAt: Date.now() - 1000 * 60 * 5
      },
      {
        id: 'act-2',
        type: 'task',
        title: 'New Quick Task',
        detail: 'Audit Cloudflare CDN DNS & WAF',
        timestamp: '14:52',
        createdAt: Date.now() - 1000 * 60 * 20
      },
      {
        id: 'act-3',
        type: 'note',
        title: 'Quick Note',
        detail: 'Catatan Rapat Sync Tim Q3',
        timestamp: '14:15',
        createdAt: Date.now() - 1000 * 60 * 60
      },
      {
        id: 'act-4',
        type: 'meeting',
        title: 'Log Meeting',
        detail: 'Sprint Sync & Architecture Review',
        timestamp: '13:30',
        createdAt: Date.now() - 1000 * 60 * 105
      },
      {
        id: 'act-5',
        type: 'timer',
        title: 'Quick Sprint',
        detail: 'Sesi kilat 15 menit tuntas',
        timestamp: '12:00',
        createdAt: Date.now() - 1000 * 60 * 195
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sof_quick_actions_history', JSON.stringify(quickActivities));
    } catch (e) {
      console.warn('Gagal menyimpan riwayat aksi cepat:', e);
    }
  }, [quickActivities]);

  const logQuickActivity = (type: QuickActionActivity['type'], title: string, detail?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAct: QuickActionActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title,
      detail,
      timestamp: timeStr,
      createdAt: Date.now()
    };
    setQuickActivities(prev => [newAct, ...prev].slice(0, 5));
  };

  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Timer countdown engine with audio alert
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            try {
              const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              if (AudioContextClass) {
                const ctx = new AudioContextClass();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
              }
            } catch {
              // audio context fallback
            }
            showToast('Sesi Timer Selesai!', 'Waktu fokus Anda telah tuntas. Luangkan sejenak untuk evaluasi hasil.', 'success');
            logQuickActivity('timer', 'Focus Sprint Selesai', 'Sesi timer tuntas');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Click outside to close quick actions pop-up menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setIsQuickActionsOpen(false);
        setQuickActionsSearchQuery('');
      }
    };
    if (isQuickActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isQuickActionsOpen]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    showToast('Timer Fokus Berjalan', `Sesi fokus ${Math.floor(timerSeconds / 60)} menit dimulai.`, 'info');
    logQuickActivity('timer', 'Start Timer', `Sesi fokus ${Math.floor(timerSeconds / 60)} menit`);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = (newDuration?: number) => {
    const duration = newDuration !== undefined ? newDuration : timerDuration;
    if (newDuration !== undefined) {
      setTimerDuration(newDuration);
    }
    setTimerSeconds(duration);
    setIsTimerRunning(false);
  };

  const handleAddTimerMinutes = (minutes: number) => {
    setTimerSeconds(prev => prev + minutes * 60);
    setTimerDuration(prev => prev + minutes * 60);
  };

  // Handle Dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sof_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sof_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist Tasks
  useEffect(() => {
    localStorage.setItem('sof_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist Documents
  useEffect(() => {
    localStorage.setItem('sof_docs', JSON.stringify(documents));
  }, [documents]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      triggerSync();
      showToast('Koneksi Pulih', 'sideoffar.cloud kembali terhubung secara online. Sinkronisasi aktif.', 'success');
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }));
      showToast('Mode Luring Aktif', 'Koneksi terputus. Data disimpan di brankas cache lokal dan akan disinkronkan otomatis saat terhubung kembali.', 'urgent');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (title: string, message: string, priority: 'urgent' | 'info' | 'success' = 'info') => {
    const id = `toast-${Date.now()}`;
    setActiveToast({ id, title, message, priority });
    setTimeout(() => {
      setActiveToast(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  // Sync with Backend server
  const triggerSync = async () => {
    if (syncState.isSyncing) return;
    setSyncState(prev => ({ ...prev, isSyncing: true }));

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          documentsCount: documents.length,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          pendingQueueCount: 0
        }));
        showToast('Sinkronisasi Berhasil', 'Semua perubahan alur kerja telah direplikasi ke sideoffar.cloud.', 'success');
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        pendingQueueCount: prev.pendingQueueCount + 1
      }));
    }
  };

  // Task Mutations
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, synced: false } : t))
    );
    setSyncState(prev => ({ ...prev, pendingQueueCount: prev.pendingQueueCount + 1 }));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'synced'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      synced: false
    };
    setTasks(prev => [newTask, ...prev]);
    setSyncState(prev => ({ ...prev, pendingQueueCount: prev.pendingQueueCount + 1 }));
    logQuickActivity('task', 'New Quick Task', newTask.title);
  };

  // Document Mutations
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSyncState(prev => ({ ...prev, pendingQueueCount: prev.pendingQueueCount + 1 }));
  };

  // Integration Toggle
  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'connected' ? 'disconnected' : 'connected';
          showToast(
            nextStatus === 'connected' ? 'Integrasi Terhubung' : 'Integrasi Diputus',
            `${item.name} berhasil diperbarui.`,
            nextStatus === 'connected' ? 'success' : 'info'
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Export handlers
  const handleExportPDF = () => {
    printExecutivePDFReport({
      tasks,
      team,
      securityScore: 98.4,
      reportTitle: 'Laporan Eksekutif Alur Kerja & Analisis Prediktif sideoffar.cloud'
    });
  };

  const handleExportCSV = () => {
    exportTasksToSheetsCSV(tasks);
    showToast('Berkas CSV Siap', 'Data alur kerja berhasil diekspor ke format CSV / Google Sheets.', 'success');
  };

  // Count of active pending tasks in the queue (tasks waiting or in progress, not yet completed)
  const activePendingTasksCount = tasks.filter(t => t && t.status !== 'completed').length;

  // List of available utility actions for Quick Actions Hub with category assignments
  const availableUtilityActions = [
    {
      id: 'action-start-timer',
      category: 'Timer',
      actionType: 'timer',
      defaultOrder: 1,
      title: 'Start Timer',
      subtitle: isTimerRunning ? 'Sesi fokus aktif berjalan' : 'Fokus Pomodoro & Sprint',
      keywords: ['start timer', 'timer', 'pomodoro', 'sprint', 'focus', 'fokus', 'countdown'],
      icon: <Timer className="w-4 h-4" />,
      iconContainerClass: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      hoverClass: 'hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300',
      extraBadge: isTimerRunning ? (
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
        </span>
      ) : null,
      onClick: () => setIsTimerModalOpen(true)
    },
    {
      id: 'action-quick-break',
      category: 'Timer',
      actionType: 'timer',
      defaultOrder: 2,
      title: '5m Quick Break',
      subtitle: 'Jeda istirahat singkat & relaksasi',
      keywords: ['quick break', 'break', 'istirahat', 'pause', '5m', 'timer', 'relaksasi', 'santai'],
      icon: <Clock className="w-4 h-4" />,
      iconContainerClass: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      hoverClass: 'hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300',
      extraBadge: null,
      onClick: () => {
        setTimerDuration(5 * 60);
        setTimerSeconds(5 * 60);
        setIsTimerRunning(true);
        logQuickActivity('timer', '5m Quick Break', 'Jeda istirahat 5 menit dimulai');
        showToast('Sesi Istirahat Dimulai', 'Timer 5 menit telah berjalan untuk relaksasi sejenak.', 'info');
      }
    },
    {
      id: 'action-log-meeting',
      category: 'Communication',
      actionType: 'meeting',
      defaultOrder: 3,
      title: 'Log Meeting',
      subtitle: 'Notulensi rapat & aksi tim',
      keywords: ['log meeting', 'meeting', 'rapat', 'notulensi', 'minutes', 'agenda', 'tim', 'attendees'],
      icon: <Users className="w-4 h-4" />,
      iconContainerClass: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      hoverClass: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300',
      extraBadge: null,
      onClick: () => setIsLogMeetingModalOpen(true)
    },
    {
      id: 'action-quick-note',
      category: 'Communication',
      actionType: 'note',
      defaultOrder: 4,
      title: 'Quick Note',
      subtitle: 'Catat memo kilat & scratchpad',
      keywords: ['quick note', 'note', 'memo', 'catatan', 'scratchpad', 'draft', 'tulisan'],
      icon: <FileText className="w-4 h-4" />,
      iconContainerClass: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20',
      hoverClass: 'hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-300',
      extraBadge: null,
      onClick: () => setIsQuickNoteModalOpen(true)
    },
    {
      id: 'action-new-task',
      category: 'Tasks',
      actionType: 'task',
      defaultOrder: 5,
      title: 'New Quick Task',
      subtitle: 'Buat tugas kilat dalam antrean',
      keywords: ['new task', 'task', 'tugas', 'todo', 'kanban', 'antrean', 'buat tugas'],
      icon: <Plus className="w-4 h-4" />,
      iconContainerClass: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      hoverClass: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300',
      extraBadge: (
        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
          {activePendingTasksCount} active
        </span>
      ),
      onClick: () => setIsQuickTaskModalOpen(true)
    },
    {
      id: 'action-task-queue',
      category: 'Tasks',
      actionType: 'task',
      defaultOrder: 6,
      title: 'Active Tasks Queue',
      subtitle: `${activePendingTasksCount} tugas menunggu eksekusi`,
      keywords: ['tasks queue', 'queue', 'antrean', 'tugas', 'kanban', 'tasks', 'todo'],
      icon: <CheckCircle2 className="w-4 h-4" />,
      iconContainerClass: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      hoverClass: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300',
      extraBadge: (
        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
          {activePendingTasksCount}
        </span>
      ),
      onClick: () => {
        setActiveTab('kanban');
        showToast('Antrean Tugas', `Membuka papan tugas (${activePendingTasksCount} tugas aktif).`, 'info');
      }
    }
  ];

  // Visual category definitions for grouping
  const utilityCategories = [
    {
      id: 'Timer',
      name: 'Timer',
      icon: <Timer className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />,
      headerColor: 'text-amber-700 dark:text-amber-400',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300/60 dark:border-amber-800/60'
    },
    {
      id: 'Communication',
      name: 'Communication',
      icon: <Users className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />,
      headerColor: 'text-emerald-700 dark:text-emerald-400',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800/60'
    },
    {
      id: 'Tasks',
      name: 'Tasks',
      icon: <Plus className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />,
      headerColor: 'text-indigo-700 dark:text-indigo-400',
      badgeClass: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300/60 dark:border-indigo-800/60'
    }
  ];

  const filteredUtilityActions = availableUtilityActions.filter(action => {
    if (!quickActionsSearchQuery.trim()) return true;
    const query = quickActionsSearchQuery.toLowerCase().trim();
    return (
      action.title.toLowerCase().includes(query) ||
      action.subtitle.toLowerCase().includes(query) ||
      action.keywords.some(k => k.toLowerCase().includes(query))
    );
  });

  const sortedUtilityActions = [...filteredUtilityActions].sort((a, b) => {
    if (quickActionsSortMode === 'alpha') {
      return a.title.localeCompare(b.title);
    }
    // Time-based sorting (recency of action execution based on quickActivities)
    const getLatestTime = (actionType: string, defaultOrder: number) => {
      const recent = quickActivities.find(act => act.type === actionType);
      if (recent && recent.timestamp) {
        const parsed = new Date(recent.timestamp).getTime();
        if (!isNaN(parsed)) return parsed;
      }
      return -defaultOrder;
    };

    const timeA = getLatestTime(a.actionType, a.defaultOrder);
    const timeB = getLatestTime(b.actionType, b.defaultOrder);
    return timeB - timeA;
  });

  // Partition sorted actions into pinned and unpinned categories
  const pinnedActions = sortedUtilityActions.filter(a => pinnedQuickActions.includes(a.id));
  const unpinnedActions = sortedUtilityActions.filter(a => !pinnedQuickActions.includes(a.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onLanguageChange={setCurrentLang}
        currentRole={currentRole}
        userRole={currentRole}
        onSelectRole={setCurrentRole}
        onRoleChange={setCurrentRole}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        syncState={syncState}
        onTriggerSync={triggerSync}
        onToggleOfflineMode={() => setSyncState(prev => ({ ...prev, isOnline: !prev.isOnline }))}
        notifications={notifications}
        onMarkAllNotificationsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
        onClearNotifications={() => setNotifications([])}
        onOpenAssistant={() => setActiveTab('assistant')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex pt-16">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentLang={currentLang}
          currentRole={currentRole}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentLang={currentLang}
              userRole={currentRole}
              tasks={tasks}
              team={team}
              syncState={syncState}
              onOpenAssistant={() => setActiveTab('assistant')}
              onNavigateToTab={setActiveTab}
              onAddTaskModal={() => setIsQuickTaskModalOpen(true)}
              onExportPDF={handleExportPDF}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onShowNotification={showToast}
            />
          )}

          {activeTab === 'assistant' && (
            <BicarafarAssistantView
              currentLang={currentLang}
              userRole={currentRole}
              tasks={tasks}
              onAddTask={handleAddTask}
              onNavigateToTab={setActiveTab}
              isOnline={syncState.isOnline}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksKanbanCalendarView
              currentLang={currentLang}
              userRole={currentRole}
              tasks={tasks}
              team={team}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
              onShowNotification={showToast}
            />
          )}

          {activeTab === 'vault' && (
            <DocumentVaultView
              currentLang={currentLang}
              userRole={currentRole}
              documents={documents}
              onAddDocument={handleAddDocument}
              onShowNotification={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <PredictiveAnalyticsView
              currentLang={currentLang}
              userRole={currentRole}
              tasks={tasks}
              team={team}
              onOpenAssistant={() => setActiveTab('assistant')}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsView
              currentLang={currentLang}
              userRole={currentRole}
              integrations={integrations}
              onToggleIntegration={handleToggleIntegration}
              onShowNotification={showToast}
            />
          )}

          {activeTab === 'security' && (
            <SecurityView
              currentLang={currentLang}
              userRole={currentRole}
              onShowNotification={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Action Container (#floating-bicarafar-btn container) */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        {/* Voice-controlled trigger for Quick Actions (Web Speech API) */}
        <VoiceQuickActionsTrigger
          onTriggerStartTimer={() => {
            handleStartTimer();
            setIsTimerModalOpen(true);
          }}
          onTriggerNewTask={() => setIsQuickTaskModalOpen(true)}
          onTriggerLogMeeting={() => setIsLogMeetingModalOpen(true)}
          onTriggerQuickNote={() => setIsQuickNoteModalOpen(true)}
          onTriggerOpenMenu={() => setIsQuickActionsOpen(true)}
          onShowNotification={showToast}
        />

        {/* Secondary small button for 'New Quick Task' */}
        <button
          id="quick-new-task-btn"
          onClick={() => setIsQuickTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-xs border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all cursor-pointer group"
          title={`New Quick Task (${activePendingTasksCount} antrean tugas aktif)`}
        >
          <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Plus className="w-3 h-3" />
          </div>
          <span>New Quick Task</span>
          <span
            id="quick-task-pending-badge"
            data-testid="quick-task-pending-badge"
            className="ml-0.5 px-1.5 py-0.5 min-w-4 text-center rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 leading-none shadow-xs"
            title={`${activePendingTasksCount} active pending tasks in queue`}
          >
            {activePendingTasksCount}
          </span>
        </button>

        {/* Secondary button for 'Quick Actions' opening mini pop-up menu */}
        <div className="relative" ref={quickActionsRef}>
          <button
            id="quick-actions-menu-btn"
            data-testid="quick-actions-menu-btn"
            onClick={() => setIsQuickActionsOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-semibold text-xs border shadow-lg shadow-slate-900/10 hover:shadow-xl active:scale-95 transition-all cursor-pointer group ${
              isQuickActionsOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
            title="Quick Actions Utility Hub"
            aria-haspopup="true"
            aria-expanded={isQuickActionsOpen}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              isQuickActionsOpen
                ? 'bg-slate-950 text-amber-400'
                : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950'
            }`}>
              <Zap className="w-2.5 h-2.5 fill-current" />
            </div>
            <span>Quick Actions</span>
            {isTimerRunning && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 leading-none animate-pulse">
                {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
              </span>
            )}
            <ChevronUp className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mini Pop-up Menu */}
          {isQuickActionsOpen && (
            <div
              id="quick-actions-popup-menu"
              data-testid="quick-actions-popup-menu"
              className="absolute bottom-full right-0 mb-2.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-40 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
            >
              {/* Menu Header */}
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quick Actions Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>

              {/* Search input field at the top of #quick-actions-popup-menu */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="quick-actions-search-input"
                  data-testid="quick-actions-search-input"
                  type="text"
                  value={quickActionsSearchQuery}
                  onChange={e => setQuickActionsSearchQuery(e.target.value)}
                  placeholder="Filter utility actions (timer, note, task)..."
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                />
                {quickActionsSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setQuickActionsSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Clear filter"
                    aria-label="Clear filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sorting & Category Controls Bar */}
              <div className="flex items-center justify-between px-1 py-1 mb-2 text-xs border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Categories
                  </span>
                  <button
                    id="toggle-all-categories-btn"
                    data-testid="toggle-all-categories-btn"
                    type="button"
                    onClick={() => {
                      const areAllCollapsed = utilityCategories.every(c => !!collapsedCategories[c.id]);
                      const nextState = areAllCollapsed
                        ? {}
                        : utilityCategories.reduce((acc, c) => ({ ...acc, [c.id]: true }), {});
                      setCollapsedCategories(nextState);
                      try {
                        localStorage.setItem('sof_quick_actions_collapsed_categories', JSON.stringify(nextState));
                      } catch {}
                    }}
                    className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors cursor-pointer underline"
                  >
                    {utilityCategories.every(c => !!collapsedCategories[c.id]) ? 'Expand All' : 'Collapse All'}
                  </button>
                </div>
                <div
                  id="quick-actions-sort-toggle"
                  data-testid="quick-actions-sort-toggle"
                  className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80"
                >
                  <button
                    id="sort-by-time-btn"
                    data-testid="sort-by-time-btn"
                    type="button"
                    onClick={() => {
                      setQuickActionsSortMode('time');
                      try {
                        localStorage.setItem('sof_quick_actions_sort_mode', 'time');
                      } catch {}
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[10px] transition-all cursor-pointer ${
                      quickActionsSortMode === 'time'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Sort by recent / time"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Time</span>
                  </button>
                  <button
                    id="sort-by-alpha-btn"
                    data-testid="sort-by-alpha-btn"
                    type="button"
                    onClick={() => {
                      setQuickActionsSortMode('alpha');
                      try {
                        localStorage.setItem('sof_quick_actions_sort_mode', 'alpha');
                      } catch {}
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[10px] transition-all cursor-pointer ${
                      quickActionsSortMode === 'alpha'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Sort alphabetically (A-Z)"
                  >
                    <ArrowDownAZ className="w-3 h-3" />
                    <span>Alphabetical</span>
                  </button>
                </div>
              </div>

              {/* Utility Actions List with Collapsible Categories */}
              <div className="space-y-2 text-xs">
                {sortedUtilityActions.length > 0 ? (
                  <>
                    {/* Pinned Category (at the top for faster access) */}
                    {pinnedActions.length > 0 && (() => {
                      const isPinnedCollapsed = !quickActionsSearchQuery.trim() && !!collapsedCategories['pinned'];
                      return (
                        <div
                          id="pinned-actions-category"
                          data-testid="pinned-actions-category"
                          className="space-y-1 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 p-1 border border-amber-300/40 dark:border-amber-700/40"
                        >
                          <button
                            id="category-toggle-pinned"
                            data-testid="category-toggle-pinned"
                            type="button"
                            onClick={() => toggleCategoryCollapse('pinned')}
                            aria-expanded={!isPinnedCollapsed}
                            className="w-full flex items-center justify-between px-2 py-1 rounded-lg text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider transition-colors hover:bg-amber-500/10 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-1.5">
                              <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Pinned</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-semibold border border-amber-300/60 dark:border-amber-800/60">
                                {pinnedActions.length}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-200 ${
                                  isPinnedCollapsed ? '' : 'rotate-180'
                                }`}
                              />
                            </div>
                          </button>

                          {!isPinnedCollapsed && (
                            <div className="space-y-1 pt-0.5">
                              {pinnedActions.map(actionItem => (
                                <div
                                  key={actionItem.id}
                                  className="group/row flex items-center justify-between p-1 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-amber-300/40 dark:border-amber-700/40 transition-all hover:border-amber-400 dark:hover:border-amber-600"
                                >
                                  <button
                                    id={actionItem.id}
                                    data-testid={actionItem.id}
                                    type="button"
                                    onClick={() => {
                                      setIsQuickActionsOpen(false);
                                      setQuickActionsSearchQuery('');
                                      actionItem.onClick();
                                    }}
                                    className="flex items-center gap-2.5 flex-1 min-w-0 p-1 text-left cursor-pointer rounded-lg text-slate-800 dark:text-slate-200"
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover/row:scale-105 transition-transform ${actionItem.iconContainerClass}`}>
                                      {actionItem.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold flex items-center justify-between">
                                        <span className="truncate">{actionItem.title}</span>
                                        {actionItem.extraBadge}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        {actionItem.subtitle}
                                      </div>
                                    </div>
                                  </button>

                                  {/* Pin Toggle Button */}
                                  <button
                                    id={`pin-btn-${actionItem.id}`}
                                    data-testid={`pin-btn-${actionItem.id}`}
                                    type="button"
                                    onClick={(e) => togglePinAction(actionItem.id, e)}
                                    className="p-1.5 mr-0.5 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors cursor-pointer shrink-0"
                                    title="Unpin action from top"
                                    aria-label={`Unpin ${actionItem.title}`}
                                  >
                                    <Pin className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Category-Based Visual Grouping (Timer, Communication, Tasks) with Collapsible Sections */}
                    {utilityCategories.map(category => {
                      const catActions = unpinnedActions.filter(a => a.category === category.id);
                      const isTimerCategory = category.id === 'Timer';
                      const hasPresetMatch = quickActionsSearchQuery.trim()
                        ? ['timer', 'preset', '10', '25', '50', 'focus', 'sprint', ...timerPresets.map(p => `${p}m`)].some(term =>
                            term.includes(quickActionsSearchQuery.toLowerCase()) || quickActionsSearchQuery.toLowerCase().includes(term)
                          )
                        : true;

                      // When searching, hide category if it has no matching unpinned actions and no preset match
                      if (quickActionsSearchQuery.trim() && catActions.length === 0 && (!isTimerCategory || !hasPresetMatch)) {
                        return null;
                      }
                      const isCollapsed = !quickActionsSearchQuery.trim() && !!collapsedCategories[category.id];

                      return (
                        <div
                          key={category.id}
                          id={`category-section-${category.id.toLowerCase()}`}
                          data-testid={`category-section-${category.id.toLowerCase()}`}
                          className="space-y-1 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 p-1 border border-slate-150 dark:border-slate-800/80 transition-all"
                        >
                          {/* Collapsible Category Header Toggle */}
                          <button
                            id={`category-toggle-${category.id.toLowerCase()}`}
                            data-testid={`category-toggle-${category.id.toLowerCase()}`}
                            type="button"
                            onClick={() => toggleCategoryCollapse(category.id)}
                            aria-expanded={!isCollapsed}
                            className="w-full flex items-center justify-between px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-1.5">
                              {category.icon}
                              <span className={category.headerColor}>{category.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-semibold border ${category.badgeClass}`}>
                                {catActions.length}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                                  isCollapsed ? '' : 'rotate-180'
                                }`}
                              />
                            </div>
                          </button>

                          {/* Collapsible Action Items */}
                          {!isCollapsed && (
                            <div className="space-y-1 pt-0.5">
                              {catActions.length > 0 ? (
                                catActions.map(actionItem => (
                                  <div
                                    key={actionItem.id}
                                    className={`group/row flex items-center justify-between p-1 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 bg-white/60 dark:bg-slate-950/40 ${actionItem.hoverClass}`}
                                  >
                                    <button
                                      id={actionItem.id}
                                      data-testid={actionItem.id}
                                      type="button"
                                      onClick={() => {
                                        setIsQuickActionsOpen(false);
                                        setQuickActionsSearchQuery('');
                                        actionItem.onClick();
                                      }}
                                      className="flex items-center gap-2.5 flex-1 min-w-0 p-1 text-left cursor-pointer rounded-lg text-slate-800 dark:text-slate-200"
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover/row:scale-105 transition-transform ${actionItem.iconContainerClass}`}>
                                        {actionItem.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold flex items-center justify-between">
                                          <span className="truncate">{actionItem.title}</span>
                                          {actionItem.extraBadge}
                                        </div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                          {actionItem.subtitle}
                                        </div>
                                      </div>
                                    </button>

                                    {/* Pin Toggle Button */}
                                    <button
                                      id={`pin-btn-${actionItem.id}`}
                                      data-testid={`pin-btn-${actionItem.id}`}
                                      type="button"
                                      onClick={(e) => togglePinAction(actionItem.id, e)}
                                      className="p-1.5 mr-0.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer shrink-0 opacity-60 group-hover/row:opacity-100"
                                      title="Pin action to top"
                                      aria-label={`Pin ${actionItem.title} to top`}
                                    >
                                      <Pin className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="py-2 px-3 text-center text-[11px] text-slate-400 dark:text-slate-500 italic">
                                  All {category.name.toLowerCase()} actions pinned to top
                                </div>
                              )}

                              {/* Quick Timer Presets Section (Only in Timer Category) */}
                              {isTimerCategory && (
                                <div
                                  id="quick-timer-presets-section"
                                  data-testid="quick-timer-presets-section"
                                  className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/60 px-1 pb-1"
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-800 dark:text-amber-300">
                                      <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                      <span>Quick Timer Presets</span>
                                    </div>
                                    <button
                                      id="configure-presets-btn"
                                      data-testid="configure-presets-btn"
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsConfiguringPresets(prev => !prev);
                                      }}
                                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/60 dark:border-amber-800/60 transition-colors cursor-pointer"
                                      title="Configure Presets"
                                      aria-label="Configure Presets"
                                    >
                                      <SlidersHorizontal className="w-3 h-3" />
                                      <span>Configure Presets</span>
                                    </button>
                                  </div>

                                  {/* Configure Presets Overlay */}
                                  {isConfiguringPresets && (
                                    <div
                                      id="timer-presets-config-overlay"
                                      data-testid="timer-presets-config-overlay"
                                      onClick={(e) => e.stopPropagation()}
                                      className="mb-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 shadow-md space-y-2 text-xs"
                                    >
                                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                        <span className="flex items-center gap-1">
                                          <SlidersHorizontal className="w-3 h-3 text-amber-500" />
                                          Customize Timer Durations
                                        </span>
                                        <button
                                          id="close-presets-config-btn"
                                          data-testid="close-presets-config-btn"
                                          type="button"
                                          onClick={() => setIsConfiguringPresets(false)}
                                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                                          aria-label="Close presets configuration"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-3 gap-1.5">
                                        {presetDraft.map((val, idx) => (
                                          <div key={idx} className="space-y-0.5">
                                            <label htmlFor={`preset-input-${idx + 1}`} className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold block">
                                              Preset {idx + 1}
                                            </label>
                                            <div className="relative">
                                              <input
                                                id={`preset-input-${idx + 1}`}
                                                data-testid={`preset-input-${idx + 1}`}
                                                type="number"
                                                min={1}
                                                max={180}
                                                value={val}
                                                onChange={e => {
                                                  const num = parseInt(e.target.value, 10);
                                                  setPresetDraft(prev => {
                                                    const next = [...prev];
                                                    next[idx] = isNaN(num) ? 0 : num;
                                                    return next;
                                                  });
                                                }}
                                                className="w-full px-1.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                              />
                                              <span className="absolute right-1.5 top-1 text-[10px] text-slate-400 font-medium">m</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                                        <button
                                          id="reset-presets-btn"
                                          data-testid="reset-presets-btn"
                                          type="button"
                                          onClick={() => {
                                            const defaults = [10, 25, 50];
                                            setPresetDraft(defaults);
                                            setTimerPresets(defaults);
                                            try {
                                              localStorage.setItem('sof_quick_timer_presets', JSON.stringify(defaults));
                                            } catch {}
                                            showToast('Preset Direset', 'Durasi preset dikembalikan ke 10m, 25m, dan 50m.', 'info');
                                          }}
                                          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer font-medium underline"
                                        >
                                          Reset Default
                                        </button>
                                        <button
                                          id="save-presets-btn"
                                          data-testid="save-presets-btn"
                                          type="button"
                                          onClick={() => {
                                            const cleaned = presetDraft.map((v, i) => {
                                              const n = Number(v);
                                              return n > 0 ? n : (i === 0 ? 10 : i === 1 ? 25 : 50);
                                            });
                                            setTimerPresets(cleaned);
                                            setPresetDraft(cleaned);
                                            try {
                                              localStorage.setItem('sof_quick_timer_presets', JSON.stringify(cleaned));
                                            } catch {}
                                            setIsConfiguringPresets(false);
                                            showToast('Preset Tersimpan', `Durasi preset berhasil diperbarui: ${cleaned.map(m => `${m}m`).join(', ')}.`, 'success');
                                          }}
                                          className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer transition-colors shadow-xs"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Instant Start Preset Buttons */}
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {timerPresets.map((minutes, idx) => (
                                      <button
                                        key={idx}
                                        id={`timer-preset-${minutes}m`}
                                        data-testid={`timer-preset-${minutes}m`}
                                        type="button"
                                        onClick={() => startPresetTimer(minutes)}
                                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 hover:bg-amber-500/20 dark:hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 hover:border-amber-400 font-bold text-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
                                        title={`Start ${minutes}m timer instantly`}
                                      >
                                        <Zap className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                                        <span>{minutes}m</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="py-4 px-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    <p className="font-medium">No actions matching "{quickActionsSearchQuery}"</p>
                    <button
                      type="button"
                      onClick={() => setQuickActionsSearchQuery('')}
                      className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Reset filter
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Activities Feed Component (Last 5 performed quick actions) */}
              <RecentActivitiesFeed
                activities={quickActivities}
                onClear={() => setQuickActivities([])}
              />
            </div>
          )}
        </div>

        {/* Primary Bicarafar Floating Button */}
        <button
          id="floating-bicarafar-btn"
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs shadow-xl transition-all cursor-pointer group ${
            activeTab === 'assistant'
              ? 'bg-indigo-700 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/50'
              : 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
          }`}
          title="Bicarafar AI Assistant"
        >
          <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Bicarafar AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {/* Direct Quick Task Creation Modal */}
      <QuickTaskModal
        isOpen={isQuickTaskModalOpen}
        onClose={() => setIsQuickTaskModalOpen(false)}
        onAddTask={handleAddTask}
        team={team}
        onShowNotification={showToast}
        currentLang={currentLang}
      />

      {/* Quick Actions Modals */}
      <QuickTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        timerSeconds={timerSeconds}
        isRunning={isTimerRunning}
        initialDuration={timerDuration}
        onStart={handleStartTimer}
        onPause={handlePauseTimer}
        onReset={handleResetTimer}
        onAddMinutes={handleAddTimerMinutes}
      />

      <QuickNoteModal
        isOpen={isQuickNoteModalOpen}
        onClose={() => setIsQuickNoteModalOpen(false)}
        onAddTask={handleAddTask}
        onShowNotification={showToast}
        onLogActivity={(title, detail) => logQuickActivity('note', title, detail)}
      />

      <LogMeetingModal
        isOpen={isLogMeetingModalOpen}
        onClose={() => setIsLogMeetingModalOpen(false)}
        team={team}
        onAddTask={handleAddTask}
        onShowNotification={showToast}
        onLogActivity={(title, detail) => logQuickActivity('meeting', title, detail)}
      />

      {/* Push Notification Toast */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              activeToast.priority === 'urgent'
                ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                : activeToast.priority === 'success'
                ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
                : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            {activeToast.priority === 'urgent' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {activeToast.priority === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {activeToast.priority === 'info' && <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <div className="font-bold mb-0.5">{activeToast.title}</div>
              <div className="opacity-90 leading-relaxed text-[11px]">{activeToast.message}</div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
