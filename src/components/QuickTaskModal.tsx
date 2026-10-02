import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Calendar,
  Clock,
  User,
  Tag,
  CheckSquare,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Task, Priority, TeamMember, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface QuickTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'synced'>) => void;
  team: TeamMember[];
  onShowNotification: (title: string, message: string, priority?: 'info' | 'success' | 'urgent') => void;
  currentLang?: LanguageCode;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  team,
  onShowNotification,
  currentLang = 'id'
}) => {
  const t = translations[currentLang] || translations.id;

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [assignee, setAssignee] = useState(team[0]?.name || 'Farhan Maulana');
  const [deadline, setDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [estimatedHours, setEstimatedHours] = useState(6);
  const [selectedTags, setSelectedTags] = useState<string[]>(['QuickTask', 'Sprint-Q3']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('high');
      setAssignee(team[0]?.name || 'Farhan Maulana');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow.toISOString().split('T')[0]);
      setEstimatedHours(6);
      setSelectedTags(['QuickTask', 'Sprint-Q3']);
    }
  }, [isOpen, team]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const cleanTag = customTagInput.trim();
      if (!selectedTags.includes(cleanTag)) {
        setSelectedTags(prev => [...prev, cleanTag]);
      }
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedAssignee = team.find(m => m.name === assignee);

    onAddTask({
      title: title.trim(),
      description: description.trim() || 'Tugas cepat yang dibuat langsung via quick-action panel.',
      priority,
      status: 'todo',
      deadline,
      assignee,
      assigneeAvatar: matchedAssignee?.avatar,
      tags: selectedTags.length > 0 ? selectedTags : ['QuickTask'],
      estimatedHours: Number(estimatedHours) || 4,
      actualHours: 0
    });

    onShowNotification(
      'Tugas Cepat Dibuat',
      `Tugas "${title.trim()}" berhasil dibuat langsung tanpa navigasi.`,
      'success'
    );

    onClose();
  };

  const priorityOptions: { value: Priority; label: string; badge: string }[] = [
    { value: 'urgent', label: 'Urgent', badge: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    { value: 'high', label: 'High', badge: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { value: 'medium', label: 'Medium', badge: 'border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
    { value: 'low', label: 'Low', badge: 'border-slate-400 text-slate-600 bg-slate-50 dark:bg-slate-800' }
  ];

  const suggestedTags = ['QuickTask', 'Sprint-Q3', 'BugFix', 'ClientSync', 'Audit', 'Review'];

  return (
    <div
      id="quick-task-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="quick-task-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>New Quick Task</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  Direct Action
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Buat tugas langsung ke alur kerja tanpa meninggalkan tampilan saat ini.
              </p>
            </div>
          </div>
          <button
            id="close-quick-task-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.common.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Title Input */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Judul Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              id="quick-task-title-input"
              type="text"
              autoFocus
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Audit Enkripsi Dokumen Q3, Implementasi Endpoint..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Deskripsi & Catatan Singkat
            </label>
            <textarea
              id="quick-task-desc-input"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Rincian hasil deliverable atau instruksi pelaksanaan alur kerja..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Prioritas Tugas
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map(p => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`py-2 px-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                      isSelected
                        ? `${p.badge} ring-2 ring-indigo-500/20 shadow-sm`
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee & Deadline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Penanggung Jawab</span>
              </label>
              <select
                id="quick-task-assignee-select"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              >
                {team.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Tenggat Waktu</span>
              </label>
              <input
                id="quick-task-deadline-input"
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              >
              </input>
            </div>
          </div>

          {/* Estimated Hours & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimasi Jam Kerja</span>
              </label>
              <input
                id="quick-task-hours-input"
                type="number"
                min={1}
                max={160}
                value={estimatedHours}
                onChange={e => setEstimatedHours(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Tambah Tag Khusus</span>
              </label>
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Ketik tag & Enter..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Tag Pills */}
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">
              Tag Terpilih:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags.map(tag => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              ⚡ Ditambahkan langsung ke Kanban
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                {t.common.cancel}
              </button>
              <button
                id="submit-quick-task-btn"
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Tugas</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
