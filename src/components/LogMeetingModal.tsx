import React, { useState } from 'react';
import {
  X,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileCheck
} from 'lucide-react';
import { TeamMember, Task } from '../types';

interface LogMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamMember[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'synced'>) => void;
  onShowNotification: (title: string, message: string, priority?: 'info' | 'success' | 'urgent') => void;
  onLogActivity?: (title: string, detail?: string) => void;
}

export const LogMeetingModal: React.FC<LogMeetingModalProps> = ({
  isOpen,
  onClose,
  team,
  onAddTask,
  onShowNotification,
  onLogActivity
}) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('Sprint Sync');
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([team[0]?.name || 'Farhan Maulana']);
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState<string[]>(['']);
  const [autoCreateTasks, setAutoCreateTasks] = useState(true);

  if (!isOpen) return null;

  const handleToggleAttendee = (name: string) => {
    setSelectedAttendees(prev =>
      prev.includes(name) ? (prev.length > 1 ? prev.filter(n => n !== name) : prev) : [...prev, name]
    );
  };

  const handleActionItemChange = (index: number, val: string) => {
    const updated = [...actionItems];
    updated[index] = val;
    setActionItems(updated);
  };

  const handleAddActionItemField = () => {
    setActionItems(prev => [...prev, '']);
  };

  const handleRemoveActionItemField = (index: number) => {
    if (actionItems.length === 1) {
      setActionItems(['']);
      return;
    }
    setActionItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;

    const validActions = actionItems.filter(item => item.trim().length > 0);

    // If auto create tasks is enabled, generate tasks for action items
    if (autoCreateTasks && validActions.length > 0) {
      validActions.forEach((actionText, idx) => {
        onAddTask({
          title: `[${meetingType}] ${actionText.trim()}`,
          description: `Tindak lanjut dari notulensi rapat "${meetingTitle.trim()}".`,
          priority: 'high',
          status: 'todo',
          deadline: new Date(Date.now() + (idx + 2) * 86400000).toISOString().split('T')[0],
          assignee: selectedAttendees[idx % selectedAttendees.length] || 'Farhan Maulana',
          tags: ['MeetingAction', meetingType.replace(/\s+/g, '')],
          estimatedHours: 4,
          actualHours: 0
        });
      });
    }

    // Persist meeting log
    try {
      const stored = localStorage.getItem('sof_meeting_logs');
      const currentLogs = stored ? JSON.parse(stored) : [];
      const newLog = {
        id: `meet-${Date.now()}`,
        title: meetingTitle.trim(),
        type: meetingType,
        date: meetingDate,
        attendees: selectedAttendees,
        summary: summary.trim(),
        actionItems: validActions,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('sof_meeting_logs', JSON.stringify([newLog, ...currentLogs]));
    } catch (err) {
      console.warn('Gagal menyimpan notulensi rapat:', err);
    }

    onShowNotification(
      'Notulensi Rapat Disimpan',
      `Rapat "${meetingTitle.trim()}" berhasil dicatat${
        autoCreateTasks && validActions.length > 0
          ? ` dan ${validActions.length} tugas alur kerja dibuat otomatis.`
          : '.'
      }`,
      'success'
    );

    onLogActivity?.(
      meetingTitle.trim(),
      `${meetingType} • ${selectedAttendees.length} Hadir${validActions.length > 0 ? ` • ${validActions.length} Aksi` : ''}`
    );

    onClose();
  };

  return (
    <div
      id="log-meeting-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="log-meeting-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Log Meeting</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  Notulensi & Aksi
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dokumentasikan hasil koordinasi dan generate tindak lanjut alur kerja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Topik / Judul Rapat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g. Sync Arsitektur Cloud Q3 & Review API Security..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tipe Rapat
              </label>
              <select
                value={meetingType}
                onChange={e => setMeetingType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              >
                <option value="Sprint Sync">Sprint Sync</option>
                <option value="Architecture Review">Architecture Review</option>
                <option value="Client Coordination">Client Coordination</option>
                <option value="1-on-1 Alignment">1-on-1 Alignment</option>
                <option value="Executive Briefing">Executive Briefing</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                required
                value={meetingDate}
                onChange={e => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Attendees Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Peserta Rapat ({selectedAttendees.length} Hadir)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {team.map(m => {
                const isSelected = selectedAttendees.includes(m.name);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleToggleAttendee(m.name)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Ringkasan & Keputusan Kunci
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Hasil konsensus diskusi, keputusan strategis, atau kesepakatan tim..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs resize-none"
            />
          </div>

          {/* Action Items */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Action Items / Rencana Tindak Lanjut
              </label>
              <button
                type="button"
                onClick={handleAddActionItemField}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Poin</span>
              </button>
            </div>

            <div className="space-y-2">
              {actionItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleActionItemChange(idx, e.target.value)}
                    placeholder={`Tindak lanjut deliverable #${idx + 1}...`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveActionItemField(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Auto convert checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoCreateTasks}
                onChange={e => setAutoCreateTasks(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                Otomatis jadikan Action Items sebagai tugas di Kanban tim
              </span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Simpan Notulensi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
