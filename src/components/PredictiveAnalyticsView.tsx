import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  Target,
  Sparkles,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';
import { Task, TeamMember, LanguageCode, UserRole, PredictiveMetric } from '../types';
import { translations } from '../i18n/translations';
import { predictiveMetrics } from '../data/mockData';
import { printExecutivePDFReport, exportTasksToSheetsCSV } from '../utils/exportUtils';

interface PredictiveAnalyticsViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  tasks: Task[];
  team: TeamMember[];
  onOpenAssistant: () => void;
}

export const PredictiveAnalyticsView: React.FC<PredictiveAnalyticsViewProps> = ({
  currentLang,
  userRole,
  tasks,
  team,
  onOpenAssistant
}) => {
  const t = translations[currentLang];

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const review = tasks.filter(t => t.status === 'review').length;
  const todo = tasks.filter(t => t.status === 'todo').length;

  const handlePrintPDF = () => {
    printExecutivePDFReport({
      tasks,
      team,
      securityScore: 98,
      reportTitle: 'Laporan Analitik Prediktif & Performa Alur Kerja sideoffar.cloud'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.analytics.title}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              Machine Learning Core
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="analytics-export-sheets-btn"
            onClick={() => exportTasksToSheetsCSV(tasks)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ekspor Sheets/CSV</span>
          </button>
          <button
            id="analytics-export-pdf-btn"
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Predictive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictiveMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold truncate max-w-[170px]">{metric.category}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                Akurasi {metric.confidence}%
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {metric.currentValue}{metric.unit}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Prediksi:</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm">
                  {metric.predictedValue}{metric.unit}
                </span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug border-t border-slate-100 dark:border-slate-800 pt-2">
              {metric.recommendation}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Analytics Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sprint Velocity & Task Burndown Visual Graph */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Proyeksi Kecepatan Alur Kerja (Sprint Velocity Trajectory)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Minggu 1 - 4 (Q3 2026)</span>
          </div>

          {/* Bar Chart Visualization (Pure CSS/SVG Responsive) */}
          <div className="space-y-3">
            {[
              { label: 'Minggu 1 (Selesai)', actual: 28, target: 25, highlight: false },
              { label: 'Minggu 2 (Selesai)', actual: 34, target: 30, highlight: false },
              { label: 'Minggu 3 (Saat Ini)', actual: 42, target: 35, highlight: true },
              { label: 'Minggu 4 (Prediksi Bicarafar)', actual: 51, target: 40, highlight: false, isPredicted: true }
            ].map((bar, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    {bar.isPredicted && <Sparkles className="w-3 h-3 text-amber-500" />}
                    <span>{bar.label}</span>
                  </span>
                  <span>
                    <strong>{bar.actual}</strong> / {bar.target} poin alur kerja
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      bar.isPredicted
                        ? 'bg-gradient-to-r from-indigo-500 to-sky-400 animate-pulse'
                        : bar.highlight
                        ? 'bg-indigo-600'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(100, (bar.actual / 55) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Distribution Progress Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Komposisi Status Tugas Real-Time ({totalTasks} Total)
              </span>
              <span className="text-[11px] text-slate-400">
                {Math.round((completed / (totalTasks || 1)) * 100)}% Selesai
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
              <div style={{ width: `${(completed / totalTasks) * 100}%` }} className="bg-emerald-500" title="Completed" />
              <div style={{ width: `${(inProgress / totalTasks) * 100}%` }} className="bg-indigo-500" title="In Progress" />
              <div style={{ width: `${(review / totalTasks) * 100}%` }} className="bg-amber-500" title="Review" />
              <div style={{ width: `${(todo / totalTasks) * 100}%` }} className="bg-slate-400" title="To Do" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Selesai ({completed})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" /> Sedang Dikerjakan ({inProgress})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500" /> Peninjauan ({review})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-slate-400" /> Belum Dikerjakan ({todo})</span>
            </div>
          </div>
        </div>

        {/* Right Col: Team Performance Matrix per Member */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.analytics.teamPerformance}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {team.map(member => (
              <div
                key={member.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {member.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {member.performanceScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Efisiensi</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span>Tugas Selesai: <strong className="text-slate-800 dark:text-slate-200">{member.completedTasks}</strong></span>
                  <span>Beban Aktif: <strong className="text-slate-800 dark:text-slate-200">{member.activeTasks} tugas</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Assistant Action Trigger */}
          <button
            onClick={onOpenAssistant}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:from-indigo-100 hover:to-sky-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Minta Optimasi Alokasi Tim ke Bicarafar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
