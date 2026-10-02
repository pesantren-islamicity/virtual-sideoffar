import React from 'react';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  Lock,
  TrendingUp,
  Share2,
  Shield,
  Zap,
  HardDriveDownload,
  FileText
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { translations } from '../i18n/translations';

export type TabType = 'dashboard' | 'assistant' | 'tasks' | 'vault' | 'analytics' | 'integrations' | 'security';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentLang: LanguageCode;
  currentRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentLang,
  currentRole,
  isMobileOpen,
  onCloseMobile,
  onExportPDF,
  onExportCSV
}) => {
  const t = translations[currentLang];

  const navigationItems: { id: TabType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'assistant', label: t.nav.assistant, icon: Bot, badge: 'AI Pro' },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare },
    { id: 'vault', label: t.nav.vault, icon: Lock, badge: 'AES-256' },
    { id: 'analytics', label: t.nav.analytics, icon: TrendingUp },
    { id: 'integrations', label: t.nav.integrations, icon: Share2 },
    { id: 'security', label: t.nav.security, icon: Shield }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col justify-between p-4 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Quick System Badge */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="font-medium">Cloud Workspace</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                v3.4.1
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Multi-Region High Availability</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Quick Report Export & Security Snapshot */}
        <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="px-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ekspor Dokumen & Laporan
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="sidebar-export-pdf-btn"
                onClick={onExportPDF}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                title="Ekspor Ringkasan Eksekutif ke PDF"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF</span>
              </button>
              <button
                id="sidebar-export-csv-btn"
                onClick={onExportCSV}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                title="Ekspor Data ke format Google Sheets / CSV"
              >
                <HardDriveDownload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sheets/CSV</span>
              </button>
            </div>
          </div>

          {/* Quick AI Proactive Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-indigo-500/5 border border-indigo-200/60 dark:border-indigo-800/40 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>Bicarafar Workflow Engine</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Analisis prediktif memantau 6 alur kerja aktif tanpa jeda.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
