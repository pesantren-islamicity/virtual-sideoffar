import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutTemplate,
  ChevronDown,
  Check,
  TrendingUp,
  Users,
  Zap,
  ShieldCheck,
  Layers,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { DashboardPreset, DashboardPresetId, DashboardCardId } from '../../types';

export const DASHBOARD_PRESETS: (DashboardPreset & {
  icon: React.ReactNode;
  themeColor: string;
})[] = [
  {
    id: 'analyst',
    name: 'Analyst View',
    badge: 'Data & Prediksi',
    themeColor: 'from-violet-500 to-indigo-600 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800',
    icon: <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
    description: 'Memprioritaskan analisis prediktif AI Bicarafar, radar risiko bottleneck, kecepatan sprint, dan metrik agregat.',
    cardOrder: [
      'project-analytics',
      'kpi-metrics',
      'recent-tasks',
      'team-performance',
      'security-status',
      'cloud-sync'
    ],
    cardSpans: {
      'project-analytics': 'full',
      'kpi-metrics': 'full',
      'recent-tasks': 'full',
      'team-performance': 'half',
      'security-status': 'half',
      'cloud-sync': 'half'
    }
  },
  {
    id: 'manager',
    name: 'Manager View',
    badge: 'Eksekutif & Alur Kerja',
    themeColor: 'from-sky-500 to-blue-600 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    icon: <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
    description: 'Fokus pada gambaran besar alur kerja tim, evaluasi performa personel, mitigasi bottleneck, dan ringkasan KPI eksekutif.',
    cardOrder: [
      'kpi-metrics',
      'recent-tasks',
      'team-performance',
      'project-analytics',
      'security-status',
      'cloud-sync'
    ],
    cardSpans: {
      'kpi-metrics': 'full',
      'recent-tasks': 'full',
      'team-performance': 'half',
      'project-analytics': 'half',
      'security-status': 'half',
      'cloud-sync': 'half'
    }
  },
  {
    id: 'quick_action',
    name: 'Quick-Action View',
    badge: 'Eksekusi Cepat',
    themeColor: 'from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    icon: <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    description: 'Menempatkan alur kerja & tugas prioritas di bagian teratas untuk peninjauan cepat, checklist eksekusi, dan penyelesaian instan.',
    cardOrder: [
      'recent-tasks',
      'project-analytics',
      'kpi-metrics',
      'team-performance',
      'security-status',
      'cloud-sync'
    ],
    cardSpans: {
      'recent-tasks': 'full',
      'project-analytics': 'full',
      'kpi-metrics': 'full',
      'team-performance': 'half',
      'security-status': 'half',
      'cloud-sync': 'half'
    }
  },
  {
    id: 'security_compliance',
    name: 'Security & Compliance View',
    badge: 'Kriptografi & Audit',
    themeColor: 'from-emerald-500 to-teal-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    description: 'Menyoroti status enkripsi E2E AES-256-GCM, sidik jari HSM, integritas replikasi cloud, dan jejak log audit.',
    cardOrder: [
      'security-status',
      'cloud-sync',
      'recent-tasks',
      'project-analytics',
      'kpi-metrics',
      'team-performance'
    ],
    cardSpans: {
      'security-status': 'full',
      'cloud-sync': 'full',
      'recent-tasks': 'half',
      'project-analytics': 'half',
      'kpi-metrics': 'half',
      'team-performance': 'half'
    }
  },
  {
    id: 'standard',
    name: 'Standard View',
    badge: 'Proporsional Seimbang',
    themeColor: 'from-indigo-500 to-indigo-700 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    icon: <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    description: 'Susunan seimbang yang menampilkan metrik KPI, analitik prediktif, alur kerja prioritas, dan keamanan secara proporsional.',
    cardOrder: [
      'kpi-metrics',
      'project-analytics',
      'recent-tasks',
      'security-status',
      'team-performance',
      'cloud-sync'
    ],
    cardSpans: {
      'kpi-metrics': 'full',
      'project-analytics': 'full',
      'recent-tasks': 'full',
      'security-status': 'half',
      'team-performance': 'half',
      'cloud-sync': 'half'
    }
  }
];

interface DashboardPresetsDropdownProps {
  currentPresetId: DashboardPresetId;
  onSelectPreset: (preset: DashboardPreset) => void;
  onResetLayout: () => void;
  isCustomized: boolean;
}

export const DashboardPresetsDropdown: React.FC<DashboardPresetsDropdownProps> = ({
  currentPresetId,
  onSelectPreset,
  onResetLayout,
  isCustomized
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activePreset = DASHBOARD_PRESETS.find(p => p.id === currentPresetId);

  // Friendly display name
  const currentLabel = isCustomized && currentPresetId === 'custom'
    ? 'Tata Letak Kustom'
    : activePreset?.name || 'Dashboard Presets';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        id="dashboard-presets-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs border ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/30'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
        }`}
      >
        <LayoutTemplate className={`w-3.5 h-3.5 ${isOpen ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
        <span className="hidden xs:inline">Dashboard Presets:</span>
        <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
          isOpen
            ? 'bg-white/20 text-white'
            : isCustomized && currentPresetId === 'custom'
            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
        }`}>
          {currentLabel}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-[340px] sm:w-[420px] max-w-[95vw] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Dashboard Presets
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih tata letak siap pakai untuk menyusun ulang kartu secara instan
              </p>
            </div>

            {isCustomized && (
              <button
                onClick={() => {
                  onResetLayout();
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke susunan awal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Preset Options List */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {DASHBOARD_PRESETS.map((preset) => {
              const isSelected = currentPresetId === preset.id && !isCustomized;

              // Card preview order labels
              const previewNames = preset.cardOrder.slice(0, 3).map(id => {
                if (id === 'project-analytics') return 'Analytics';
                if (id === 'recent-tasks') return 'Tasks';
                if (id === 'security-status') return 'Security';
                if (id === 'kpi-metrics') return 'KPIs';
                if (id === 'team-performance') return 'Team';
                return 'Cloud';
              }).join(' → ');

              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    setIsOpen(false);
                  }}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-indigo-500/80 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500/50 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${preset.themeColor}`}>
                        {preset.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {preset.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {preset.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          <Check className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Terapkan
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    {preset.description}
                  </p>

                  <div className="pl-8 pt-0.5 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-[9px]">Urutan:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                      {previewNames} ...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-indigo-500" />
              <span>Bisa di-drag secara manual kapan saja</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
