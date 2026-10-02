import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Users,
  HardDrive,
  Copy,
  Check,
  Key,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Task, TeamMember, SyncState, SecurityStatus } from '../../types';
import { securityStatus, mockAuditLogs } from '../../data/mockData';

// --- Card 1: KPI Metrics Card ---
interface KpiMetricsCardProps {
  tasks: Task[];
  onNavigateToTab: (tab: any) => void;
}

export const KpiMetricsCard: React.FC<KpiMetricsCardProps> = ({ tasks, onNavigateToTab }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');
  const completionPercentage = Math.round((completedTasks / (totalTasks || 1)) * 100);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: Active Workflows */}
      <div
        onClick={() => onNavigateToTab('tasks')}
        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Alur Kerja Aktif</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {totalTasks}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{inProgressTasks} jalan</span>
          <span>•</span>
          <span>{completedTasks} tuntas</span>
        </div>
      </div>

      {/* Metric 2: Completion Rate */}
      <div
        onClick={() => onNavigateToTab('analytics')}
        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Ketepatan Waktu</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {completionPercentage}%
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>+12% optimasi</span>
        </div>
      </div>

      {/* Metric 3: Urgent Tasks */}
      <div
        onClick={() => onNavigateToTab('tasks')}
        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Tugas Mendesak</span>
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
          {urgentTasks.length}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {urgentTasks.length > 0 ? 'Perlu atensi audit' : 'Alur kerja lancar'}
        </div>
      </div>

      {/* Metric 4: E2E Security */}
      <div
        onClick={() => onNavigateToTab('vault')}
        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Keamanan E2E</span>
          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          98.4%
        </div>
        <div className="mt-1 text-[11px] text-sky-600 dark:text-sky-400 font-semibold truncate">
          2FA & AES-256 Aktif
        </div>
      </div>
    </div>
  );
};

// --- Card 2: Recent Tasks Card ---
interface RecentTasksCardProps {
  tasks: Task[];
  onNavigateToTab: (tab: any) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: Task['status']) => void;
  onAddTaskModal: () => void;
}

export const RecentTasksCard: React.FC<RecentTasksCardProps> = ({
  tasks,
  onNavigateToTab,
  onUpdateTaskStatus,
  onAddTaskModal
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'urgent' | 'completed'>('all');

  const safeTasks = Array.isArray(tasks) ? tasks.filter(t => t && typeof t === 'object') : [];

  const filteredTasks = safeTasks.filter(task => {
    if (filter === 'in_progress') return task.status === 'in_progress';
    if (filter === 'urgent') return task.priority === 'urgent' && task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Sub-header with task filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semua ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'in_progress'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Berjalan
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'urgent'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mendesak
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tuntas
          </button>
        </div>

        <button
          onClick={() => onNavigateToTab('tasks')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>Buka Papan Kanban</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filteredTasks.slice(0, 5).map(task => (
          <div
            key={task.id}
            className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    task.priority === 'urgent'
                      ? 'bg-rose-500 ring-2 ring-rose-300/40'
                      : task.priority === 'high'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  title={`Prioritas: ${task.priority}`}
                />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {task.title || 'Tugas Tanpa Judul'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {task.deadline}
                </span>
                <span>•</span>
                <span>PJ: <strong className="text-slate-700 dark:text-slate-300">{task.assignee}</strong></span>
                {task.tags && task.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {task.tags[0]}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onUpdateTaskStatus && task.status !== 'completed' && (
                <button
                  onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                  title="Tandai Selesai"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  task.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                    : task.status === 'in_progress'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                    : task.status === 'review'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {task.status === 'in_progress'
                  ? 'Sedang Jalan'
                  : task.status === 'completed'
                  ? 'Selesai'
                  : task.status === 'review'
                  ? 'Review'
                  : 'Antrean'}
              </span>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Tidak ada tugas dalam kategori ini.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Card 3: Security Status Card ---
interface SecurityStatusCardProps {
  onNavigateToTab: (tab: any) => void;
  onShowNotification?: (notification: any) => void;
}

export const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({
  onNavigateToTab,
  onShowNotification
}) => {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText(securityStatus.encryptionKeyFingerprint);
    setCopiedKey(true);
    if (onShowNotification) {
      onShowNotification({
        title: 'Sidik Jari Kunci Disalin',
        message: 'Fingerprint kunci kriptografi HSM berhasil disalin ke papan klip.',
        priority: 'info'
      });
    }
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Security Score & Standard Badge */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/10 via-sky-900/10 to-indigo-900/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {securityStatus.securityScore || 98}%
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                A+ Maksimum
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Enkripsi Perangkat Keras Zero-Knowledge HSM Aktif
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('vault')}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-xs"
        >
          <span>Buka Brankas E2E</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Security Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Param 1: Encryption Standard */}
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Standar Kriptografi:</span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white">
              {securityStatus.encryptionStandard || 'AES-256-GCM'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Tervalidasi FIPS</span>
          </div>
        </div>

        {/* Param 2: 2FA Authentication */}
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Autentikasi Dua Faktor (2FA):</span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white">
              {securityStatus.twoFactorEnabled ? 'Aktif (TOTP / Auth App)' : 'Non-aktif'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Param 3: Key Fingerprint */}
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Key className="w-3 h-3 text-indigo-500" />
              Sidik Jari Kunci Publik HSM (SHA-256):
            </span>
            <button
              onClick={handleCopyFingerprint}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Disalin' : 'Salin Kunci'}</span>
            </button>
          </div>
          <code className="text-[11px] font-mono text-slate-800 dark:text-slate-200 block truncate bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            {securityStatus.encryptionKeyFingerprint}
          </code>
        </div>
      </div>

      {/* Latest Audit Entry */}
      <div className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/30 dark:bg-indigo-950/20 text-xs flex items-center justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            Jejak Audit Terakhir
          </span>
          <p className="text-slate-800 dark:text-slate-200 truncate text-[11px]">
            {mockAuditLogs[0]?.action || 'Rotasi Kunci HSM Asimetris & Ekspor Laporan E2E'}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
          VERIFIED
        </span>
      </div>
    </div>
  );
};

// --- Card 4: Project Analytics Card ---
interface ProjectAnalyticsCardProps {
  onNavigateToTab: (tab: any) => void;
  onExportPDF: () => void;
  onOpenAssistant: () => void;
}

export const ProjectAnalyticsCard: React.FC<ProjectAnalyticsCardProps> = ({
  onNavigateToTab,
  onExportPDF,
  onOpenAssistant
}) => {
  return (
    <div className="space-y-4">
      {/* Predictive ML Alert Box */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/60 dark:from-indigo-950/50 dark:via-slate-900 dark:to-sky-950/40 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Analisis Prediktif Real-Time Bicarafar
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Model Machine Learning sideoffar.cloud memproyeksikan trajektori sprint
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
            Peringatan Dini
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/90 text-xs space-y-2 mt-2">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>Prediksi Bottleneck Deadline H-2 (Audit Keamanan)</span>
            <span className="text-rose-600 font-extrabold">Probabilitas Risiko: 78%</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Beban kerja unit Kriptografi mendekati batas aman. Bicarafar merekomendasikan mengalihkan 2 tugas review non-kritis ke Kenji Takahashi untuk menjaga jadwal tetap tepat waktu.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTab('tasks')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Atur Ulang Alur Kerja</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={onExportPDF}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              Unduh Wawasan PDF
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-indigo-500" />
              <span>Tanya Solusi AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: Efficiency & Velocity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300 mb-1">
            <span>Efisiensi Alur Kerja +28%</span>
            <span className="text-emerald-600 font-extrabold">Optimal</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Integrasi otomatis Google Calendar & Zapier memangkas 4.2 jam/minggu pekerjaan administratif.
          </p>
        </div>

        <div className="p-3 rounded-xl border border-sky-200/80 dark:border-sky-800/80 bg-sky-50/40 dark:bg-sky-950/20">
          <div className="flex items-center justify-between font-bold text-sky-900 dark:text-sky-300 mb-1">
            <span>Kecepatan Sprint (Velocity)</span>
            <span className="text-sky-600 font-extrabold">42 SP / Sprint</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Peningkatan konsisten 14% dibandingkan sprint sebelumnya berkat otomatisasi alur kerja Bicarafar.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Card 5: Team Performance Card ---
interface TeamPerformanceCardProps {
  team: TeamMember[];
  onNavigateToTab: (tab: any) => void;
}

export const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({
  team,
  onNavigateToTab
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Skor efisiensi & alokasi beban kerja sprint aktif:
        </span>
        <button
          onClick={() => onNavigateToTab('analytics')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Lihat Analitik Tim
        </button>
      </div>

      <div className="space-y-3">
        {team.slice(0, 4).map(member => (
          <div key={member.id} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block leading-tight">
                    {member.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {member.role}
                  </span>
                </div>
              </div>
              <span className="font-black text-slate-900 dark:text-white">
                {member.performanceScore}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  member.performanceScore >= 90
                    ? 'bg-emerald-500'
                    : member.performanceScore >= 75
                    ? 'bg-indigo-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${member.performanceScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Card 6: Cloud & Offline Sync Card ---
interface CloudSyncCardProps {
  syncState: SyncState;
  onNavigateToTab: (tab: any) => void;
}

export const CloudSyncCard: React.FC<CloudSyncCardProps> = ({ syncState, onNavigateToTab }) => {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Status Replikasi:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {syncState.isOnline ? 'Real-time Lintas Wilayah' : 'Luring (Antrean Siap)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Antrean Tunda:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {syncState.pendingQueueCount} perubahan tersimpan lokal
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Pembaruan Terakhir:</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {syncState.lastSyncedTimestamp}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onNavigateToTab('vault')}
          className="flex-1 py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Buka Brankas Enkripsi</span>
        </button>
        <button
          onClick={() => onNavigateToTab('integrations')}
          className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Webhook</span>
        </button>
      </div>
    </div>
  );
};
