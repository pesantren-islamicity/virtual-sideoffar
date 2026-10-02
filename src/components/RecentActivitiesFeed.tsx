import React from 'react';
import {
  History,
  Timer,
  FileText,
  Users,
  CheckSquare,
  Clock,
  Trash2
} from 'lucide-react';
import { QuickActionActivity } from '../types';

interface RecentActivitiesFeedProps {
  activities: QuickActionActivity[];
  onClear?: () => void;
}

export const RecentActivitiesFeed: React.FC<RecentActivitiesFeedProps> = ({
  activities,
  onClear
}) => {
  const getIcon = (type: QuickActionActivity['type']) => {
    switch (type) {
      case 'timer':
        return (
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Timer className="w-3.5 h-3.5" />
          </div>
        );
      case 'note':
        return (
          <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
            <FileText className="w-3.5 h-3.5" />
          </div>
        );
      case 'meeting':
        return (
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Users className="w-3.5 h-3.5" />
          </div>
        );
      case 'task':
      default:
        return (
          <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const getActionBadge = (type: QuickActionActivity['type']) => {
    switch (type) {
      case 'timer':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300';
      case 'note':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300';
      case 'meeting':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'task':
      default:
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300';
    }
  };

  return (
    <div
      id="recent-activities-feed"
      data-testid="recent-activities-feed"
      className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col"
    >
      {/* Section Header */}
      <div className="px-2 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <History className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Activities
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {activities.length}
          </span>
        </div>
        {onClear && activities.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-0.5"
            title="Bersihkan riwayat aksi cepat"
          >
            <Trash2 className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Feed Items (Max 5) */}
      <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
        {activities.length === 0 ? (
          <div className="py-3 px-2 text-center text-[11px] text-slate-400 dark:text-slate-500 italic">
            Belum ada aksi cepat yang dilakukan.
          </div>
        ) : (
          activities.slice(0, 5).map(item => (
            <div
              key={item.id}
              className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-2 text-left group"
            >
              {getIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400 shrink-0 font-medium flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {item.timestamp}
                  </span>
                </div>
                {item.detail && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
