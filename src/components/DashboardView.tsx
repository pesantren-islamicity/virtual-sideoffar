import React, { useState, useEffect, useId } from 'react';
import {
  Zap,
  Plus,
  GripVertical,
  Sliders,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Check,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Activity,
  Users,
  HardDrive,
  Maximize2,
  Minimize2,
  HelpCircle,
  Move,
  Database,
  Save,
  CheckCheck
} from 'lucide-react';
import { Task, TeamMember, LanguageCode, UserRole, SyncState, DashboardCardId, DashboardCardConfig, DashboardPreset, DashboardPresetId, DashboardLayoutConfig } from '../types';
import { translations } from '../i18n/translations';
import {
  KpiMetricsCard,
  RecentTasksCard,
  SecurityStatusCard,
  ProjectAnalyticsCard,
  TeamPerformanceCard,
  CloudSyncCard
} from './dashboard/DashboardCards';
import {
  DashboardPresetsDropdown,
  DASHBOARD_PRESETS
} from './dashboard/DashboardPresetsDropdown';
import {
  loadDashboardLayout,
  saveDashboardLayout,
  resetDashboardLayout,
  sanitizeLayoutConfig
} from '../utils/dashboardLayoutStorage';

interface DashboardViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  tasks: Task[];
  team: TeamMember[];
  syncState: SyncState;
  onOpenAssistant: () => void;
  onNavigateToTab: (tab: any) => void;
  onAddTaskModal: () => void;
  onExportPDF: () => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: Task['status']) => void;
  onShowNotification?: (notification: any) => void;
}

const DEFAULT_CARDS: DashboardCardConfig[] = [
  {
    id: 'kpi-metrics',
    title: 'Ringkasan KPI Alur Kerja',
    description: 'Metrik agregat tugas aktif, ketepatan waktu, dan skor keamanan',
    category: 'overview',
    columnSpan: 'full',
    visible: true
  },
  {
    id: 'project-analytics',
    title: 'Project Analytics',
    description: 'Analisis prediktif AI Bicarafar, radar risiko bottleneck, dan kecepatan sprint',
    category: 'analytics',
    columnSpan: 'full',
    visible: true
  },
  {
    id: 'recent-tasks',
    title: 'Recent Tasks',
    description: 'Daftar alur kerja prioritas, filter status, dan penanggung jawab',
    category: 'operations',
    columnSpan: 'full',
    visible: true
  },
  {
    id: 'security-status',
    title: 'Security Status',
    description: 'Kepatuhan enkripsi E2E AES-256-GCM, 2FA, sidik jari HSM, dan jejak audit',
    category: 'security',
    columnSpan: 'half',
    visible: true
  },
  {
    id: 'team-performance',
    title: 'Performa Tim',
    description: 'Distribusi beban kerja dan skor efisiensi anggota tim',
    category: 'operations',
    columnSpan: 'half',
    visible: true
  },
  {
    id: 'cloud-sync',
    title: 'Integritas Cloud & Mode Luring',
    description: 'Status sinkronisasi multi-region, antrean offline, dan verifikasi replikasi',
    category: 'security',
    columnSpan: 'half',
    visible: true
  }
];

const STORAGE_KEY = 'sof_dashboard_cards_order_v2';
const STORAGE_SPAN_KEY = 'sof_dashboard_cards_span_v2';

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLang,
  userRole,
  tasks,
  team,
  syncState,
  onOpenAssistant,
  onNavigateToTab,
  onAddTaskModal,
  onExportPDF,
  onUpdateTaskStatus,
  onShowNotification
}) => {
  const t = translations[currentLang];

  // Initial layout loaded from localStorage (survives page refreshes and browser restarts)
  const [initialConfig] = useState<DashboardLayoutConfig>(() => loadDashboardLayout());
  const [cardOrder, setCardOrder] = useState<DashboardCardId[]>(initialConfig.cardOrder);
  const [cardSpans, setCardSpans] = useState<Record<DashboardCardId, 'full' | 'half'>>(initialConfig.cardSpans);
  const [activePresetId, setActivePresetId] = useState<DashboardPresetId>(initialConfig.activePresetId);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>(initialConfig.lastSaved);

  // Drag and drop state
  const [draggedCardId, setDraggedCardId] = useState<DashboardCardId | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<DashboardCardId | null>(null);
  const [isCustomizeModeOpen, setIsCustomizeModeOpen] = useState(false);
  const [justSavedNotification, setJustSavedNotification] = useState<string | null>(null);

  // Cross-tab synchronization via window storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sof_dashboard_layout_config_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const sanitized = sanitizeLayoutConfig(parsed);
          setCardOrder(sanitized.cardOrder);
          setCardSpans(sanitized.cardSpans);
          setActivePresetId(sanitized.activePresetId);
          setLastSavedTimestamp(sanitized.lastSaved);
        } catch (err) {
          console.warn('[DashboardView] Error syncing storage change across tabs', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const triggerSaveToast = (msg: string) => {
    setJustSavedNotification(msg);
    setTimeout(() => setJustSavedNotification(null), 2500);
    if (onShowNotification) {
      onShowNotification({
        title: 'Tersimpan ke LocalStorage',
        message: msg,
        priority: 'success'
      });
    }
  };

  // Unified persistent layout updater (writes to localStorage immediately on any modification)
  const persistLayout = (
    newOrder: DashboardCardId[],
    newSpans: Record<DashboardCardId, 'full' | 'half'>,
    presetId: DashboardPresetId,
    toastMsg?: string
  ) => {
    setCardOrder(newOrder);
    setCardSpans(newSpans);
    setActivePresetId(presetId);

    const saved = saveDashboardLayout({
      cardOrder: newOrder,
      cardSpans: newSpans,
      activePresetId: presetId
    });

    setLastSavedTimestamp(saved.lastSaved);
    triggerSaveToast(toastMsg || 'Tata letak dasbor tersimpan di LocalStorage');
  };

  // Preset layouts handler
  const handleSelectPreset = (preset: DashboardPreset) => {
    const updatedSpans = preset.cardSpans
      ? ({ ...cardSpans, ...preset.cardSpans } as Record<DashboardCardId, 'full' | 'half'>)
      : cardSpans;

    persistLayout(
      preset.cardOrder,
      updatedSpans,
      preset.id,
      `Preset '${preset.name}' berhasil diaktifkan & disimpan ke LocalStorage`
    );
  };

  // Reordering helpers (drag-and-drop or arrow buttons)
  const moveCard = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= cardOrder.length || toIndex < 0 || toIndex >= cardOrder.length) return;
    if (fromIndex === toIndex) return;

    const newOrder = [...cardOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    // Check if newOrder matches any known preset
    const matchingPreset = DASHBOARD_PRESETS.find(
      p => JSON.stringify(p.cardOrder) === JSON.stringify(newOrder)
    );
    const newPresetId: DashboardPresetId = matchingPreset ? matchingPreset.id : 'custom';

    persistLayout(
      newOrder,
      cardSpans,
      newPresetId,
      'Posisi kartu berhasil diperbarui & tersimpan di LocalStorage'
    );
  };

  const moveCardUp = (index: number) => {
    if (index > 0) moveCard(index, index - 1);
  };

  const moveCardDown = (index: number) => {
    if (index < cardOrder.length - 1) moveCard(index, index + 1);
  };

  // Toggle span between full and half
  const toggleCardSpan = (id: DashboardCardId) => {
    const currentSpan = cardSpans[id] || 'full';
    const nextSpan = currentSpan === 'full' ? 'half' : 'full';
    const updated = { ...cardSpans, [id]: nextSpan };
    persistLayout(
      cardOrder,
      updated,
      'custom',
      'Ukuran kolom kartu berhasil diperbarui & disimpan di LocalStorage'
    );
  };

  // Reset to default layout
  const resetToDefault = () => {
    const defaultConfig = resetDashboardLayout();
    setCardOrder(defaultConfig.cardOrder);
    setCardSpans(defaultConfig.cardSpans);
    setActivePresetId(defaultConfig.activePresetId);
    setLastSavedTimestamp(defaultConfig.lastSaved);
    triggerSaveToast('Tata letak direset ke standar & diperbarui di LocalStorage');
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: DashboardCardId) => {
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: DashboardCardId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCardId !== targetId) {
      setDragOverCardId(targetId);
    }
  };

  const handleDragLeave = (_e: React.DragEvent, targetId: DashboardCardId) => {
    if (dragOverCardId === targetId) {
      setDragOverCardId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: DashboardCardId) => {
    e.preventDefault();
    const sourceId = (e.dataTransfer.getData('text/plain') as DashboardCardId) || draggedCardId;
    if (sourceId && sourceId !== targetId) {
      const fromIndex = cardOrder.indexOf(sourceId);
      const toIndex = cardOrder.indexOf(targetId);
      if (fromIndex !== -1 && toIndex !== -1) {
        moveCard(fromIndex, toIndex);
      }
    }
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  // Check if layout is customized from default
  const isCustomized =
    activePresetId === 'custom' ||
    JSON.stringify(cardOrder) !== JSON.stringify(DEFAULT_CARDS.map(c => c.id));

  // Helper metadata dictionary
  const cardMetaMap: Record<
    DashboardCardId,
    {
      title: string;
      subtitle: string;
      badge?: string;
      badgeColor?: string;
      icon: React.ReactNode;
      categoryLabel: string;
    }
  > = {
    'kpi-metrics': {
      title: 'Ringkasan KPI Alur Kerja',
      subtitle: 'Metrik kesehatan operasional sprint real-time',
      badge: 'Agregat',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      icon: <Activity className="w-4 h-4 text-sky-500" />,
      categoryLabel: 'Ringkasan Eksekutif'
    },
    'project-analytics': {
      title: 'Project Analytics',
      subtitle: 'Analisis prediktif AI Bicarafar & radar bottleneck alur kerja',
      badge: 'Machine Learning',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      icon: <TrendingUp className="w-4 h-4 text-indigo-500" />,
      categoryLabel: 'Prediktif & AI'
    },
    'recent-tasks': {
      title: 'Recent Tasks',
      subtitle: 'Tugas prioritas alur kerja bisnis aktif & tenggat waktu',
      badge: `${tasks.length} Alur Kerja`,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      categoryLabel: 'Operasional'
    },
    'security-status': {
      title: 'Security Status',
      subtitle: 'Enkripsi hardware HSM E2E AES-256-GCM, 2FA & kepatuhan audit',
      badge: 'A+ Zero-Knowledge',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      categoryLabel: 'Keamanan'
    },
    'team-performance': {
      title: 'Performa Tim',
      subtitle: 'Kecepatan sprint & pembagian beban kerja anggota tim',
      badge: `${team.length} Personel`,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: <Users className="w-4 h-4 text-amber-500" />,
      categoryLabel: 'Kolaborasi'
    },
    'cloud-sync': {
      title: 'Integritas Cloud & Mode Luring',
      subtitle: 'Status replikasi multi-region & antrean persistensi offline',
      badge: syncState.isOnline ? 'Online Mesh' : 'Offline Buffer',
      badgeColor: syncState.isOnline
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: <HardDrive className="w-4 h-4 text-sky-500" />,
      categoryLabel: 'Infrastruktur'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Cloud Intelligence */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white p-5 sm:p-6 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 border border-white/15">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Bicarafar Enterprise Core v2.4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              sideoffar.cloud Workspace & Virtual Assistant
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Pusat orkestrasi alur kerja bisnis otomatis dengan analisis prediktif real-time, enkripsi end-to-end, dan sinkronisasi data lintas wilayah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dashboard-open-assistant-btn"
              onClick={onOpenAssistant}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Bicara dengan Bicarafar</span>
            </button>
            <button
              id="dashboard-add-task-btn"
              onClick={onAddTaskModal}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tugas Baru</span>
            </button>
          </div>
        </div>

        {/* Subtle geometric pattern overlay */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Drag-and-Drop Customization Bar */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Kustomisasi Tata Letak Dasbor (Drag & Drop)
                </h2>
                {isCustomized ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                    Kustom Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Tata Letak Standar
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Seret kartu untuk menyusun ulang posisi, atau gunakan preset cepat di bawah.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* LocalStorage Persistence Status Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 shadow-2xs"
              title="Perubahan tata letak kartu dasbor tersimpan otomatis di LocalStorage browser"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>LocalStorage Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Dashboard Presets Dropdown */}
            <DashboardPresetsDropdown
              currentPresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onResetLayout={resetToDefault}
              isCustomized={isCustomized}
            />

            {isCustomized && (
              <button
                id="reset-dashboard-layout-btn"
                onClick={resetToDefault}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Kembalikan urutan kartu ke default standar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              id="toggle-customize-mode-btn"
              onClick={() => setIsCustomizeModeOpen(!isCustomizeModeOpen)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isCustomizeModeOpen
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>{isCustomizeModeOpen ? 'Selesai Mengatur' : 'Atur Posisi'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Customization Details & Presets */}
        {isCustomizeModeOpen && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  <strong>Tips Alur Kerja:</strong> Seret ikon grip <GripVertical className="w-3 h-3 inline text-indigo-500" /> pada kartu mana pun, atau gunakan tombol panah untuk menaikkan/menurunkan prioritas kartu.
                </span>
              </div>

              {/* LocalStorage info & Manual Save */}
              <div className="flex items-center gap-2 self-start md:self-auto text-[11px] text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">
                  Tersimpan di browser: {new Date(lastSavedTimestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <button
                  id="save-dashboard-layout-btn"
                  onClick={() =>
                    persistLayout(
                      cardOrder,
                      cardSpans,
                      activePresetId,
                      'Konfigurasi tata letak tersimpan di LocalStorage & persisten saat refresh'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold flex items-center gap-1 transition-colors border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
                  title="Simpan status tata letak ke LocalStorage secara eksplisit"
                >
                  <Save className="w-3 h-3" />
                  <span>Simpan Tata Letak</span>
                </button>
              </div>
            </div>

            {/* Preset workflow quick buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">Preset Tata Letak:</span>
              {DASHBOARD_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    activePresetId === p.id && !isCustomized
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Quick Reorder Pills Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Urutan Sekarang:</span>
              {cardOrder.map((cardId, index) => {
                const meta = cardMetaMap[cardId];
                return (
                  <div
                    key={cardId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span>{meta?.title || cardId}</span>
                    <div className="flex items-center ml-1 border-l border-slate-300 dark:border-slate-700 pl-1">
                      <button
                        onClick={() => moveCardUp(index)}
                        disabled={index === 0}
                        title="Geser ke kiri / atas"
                        className="p-0.5 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveCardDown(index)}
                        disabled={index === cardOrder.length - 1}
                        title="Geser ke kanan / bawah"
                        className="p-0.5 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Temporary toast saved indicator */}
        {justSavedNotification && (
          <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{justSavedNotification}</span>
          </div>
        )}
      </div>

      {/* Grid of Draggable Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {cardOrder.map((cardId, index) => {
          const meta = cardMetaMap[cardId];
          const span = cardSpans[cardId] || 'full';
          const isFullWidth = span === 'full';
          const isDraggingThis = draggedCardId === cardId;
          const isDropTarget = dragOverCardId === cardId && draggedCardId !== cardId;

          return (
            <div
              key={cardId}
              id={`dashboard-card-${cardId}`}
              draggable
              onDragStart={(e) => handleDragStart(e, cardId)}
              onDragOver={(e) => handleDragOver(e, cardId)}
              onDragLeave={(e) => handleDragLeave(e, cardId)}
              onDrop={(e) => handleDrop(e, cardId)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl border transition-all duration-200 relative group/card flex flex-col ${
                isFullWidth ? 'lg:col-span-2' : 'lg:col-span-1'
              } ${
                isDraggingThis
                  ? 'opacity-40 border-indigo-500 border-dashed scale-[0.99] shadow-inner bg-indigo-50/20 dark:bg-indigo-950/20'
                  : isDropTarget
                  ? 'border-indigo-500 ring-2 ring-indigo-400/50 shadow-lg scale-[1.01] bg-indigo-50/30 dark:bg-indigo-950/30'
                  : 'border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Drop Target Guide Indicator */}
              {isDropTarget && (
                <div className="absolute -top-3 left-4 right-4 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-sm z-30" />
              )}

              {/* Card Header with Drag Handle & Reorder Tools */}
              <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Dedicated Drag Handle */}
                  <div
                    className="p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                    title="Klik & seret untuk memindahkan posisi kartu"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {meta?.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {meta?.title}
                        </h3>
                        {meta?.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 hidden sm:inline-block ${
                              meta.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {meta.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                        {meta?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header Actions: Position indicator, Width toggle & Reorder buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Position Badge */}
                  <span
                    className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-extrabold flex items-center justify-center"
                    title={`Posisi #${index + 1} dari ${cardOrder.length}`}
                  >
                    {index + 1}
                  </span>

                  {/* Toggle Full / Half width */}
                  <button
                    onClick={() => toggleCardSpan(cardId)}
                    title={isFullWidth ? 'Ubah ke Lebar Kompak (1 Kolom)' : 'Ubah ke Lebar Penuh (2 Kolom)'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    {isFullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Up / Down Reorder Buttons */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => moveCardUp(index)}
                      disabled={index === 0}
                      title="Pindahkan ke atas"
                      className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveCardDown(index)}
                      disabled={index === cardOrder.length - 1}
                      title="Pindahkan ke bawah"
                      className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content Render */}
              <div className="p-4 sm:p-5 flex-1">
                {cardId === 'kpi-metrics' && (
                  <KpiMetricsCard tasks={tasks} onNavigateToTab={onNavigateToTab} />
                )}

                {cardId === 'recent-tasks' && (
                  <RecentTasksCard
                    tasks={tasks}
                    onNavigateToTab={onNavigateToTab}
                    onUpdateTaskStatus={onUpdateTaskStatus}
                    onAddTaskModal={onAddTaskModal}
                  />
                )}

                {cardId === 'security-status' && (
                  <SecurityStatusCard
                    onNavigateToTab={onNavigateToTab}
                    onShowNotification={onShowNotification}
                  />
                )}

                {cardId === 'project-analytics' && (
                  <ProjectAnalyticsCard
                    onNavigateToTab={onNavigateToTab}
                    onExportPDF={onExportPDF}
                    onOpenAssistant={onOpenAssistant}
                  />
                )}

                {cardId === 'team-performance' && (
                  <TeamPerformanceCard team={team} onNavigateToTab={onNavigateToTab} />
                )}

                {cardId === 'cloud-sync' && (
                  <CloudSyncCard syncState={syncState} onNavigateToTab={onNavigateToTab} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
