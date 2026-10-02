import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Task } from '../types';

interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'synced'>) => void;
  onShowNotification: (title: string, message: string, priority?: 'info' | 'success' | 'urgent') => void;
  onLogActivity?: (title: string, detail?: string) => void;
}

interface SavedNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onShowNotification,
  onLogActivity
}) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const stored = localStorage.getItem('sof_quick_notes');
      return stored ? JSON.parse(stored) : [
        {
          id: 'note-sample',
          title: 'Catatan Rapat Sync Tim',
          content: 'Tuntaskan review security headers & pastikan rate-limiting endpoint /api/sync aktif sebelum deployment ke production.',
          createdAt: '16 Sep 2026, 14:15'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sof_quick_notes', JSON.stringify(savedNotes));
    } catch (e) {
      console.warn('Gagal menyimpan catatan lokal:', e);
    }
  }, [savedNotes]);

  if (!isOpen) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() && !noteTitle.trim()) return;

    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: noteTitle.trim() || 'Catatan Kilat',
      content: noteContent.trim(),
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
    };

    setSavedNotes(prev => [newNote, ...prev]);
    setNoteTitle('');
    setNoteContent('');
    onShowNotification('Catatan Disimpan', `"${newNote.title}" berhasil disimpan di scratchpad lokal.`, 'success');
    onLogActivity?.(newNote.title, newNote.content.slice(0, 35) + (newNote.content.length > 35 ? '...' : ''));
  };

  const handleCopy = () => {
    const textToCopy = noteContent ? `${noteTitle ? noteTitle + '\n' : ''}${noteContent}` : '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowNotification('Disalin', 'Isi catatan berhasil disalin ke clipboard.', 'info');
  };

  const handleConvertToTask = () => {
    if (!noteContent.trim() && !noteTitle.trim()) return;

    const taskTitle = noteTitle.trim() || noteContent.trim().slice(0, 40) + '...';
    onAddTask({
      title: taskTitle,
      description: noteContent.trim() || 'Tugas turunan dari Quick Note scratchpad.',
      priority: 'medium',
      status: 'todo',
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      assignee: 'Farhan Maulana',
      tags: ['QuickNote', 'ActionItem'],
      estimatedHours: 4,
      actualHours: 0
    });

    onShowNotification(
      'Dikonversi ke Tugas',
      `Catatan "${taskTitle}" otomatis dibuat menjadi tugas di antrean kerja.`,
      'success'
    );
    onClose();
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div
      id="quick-note-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="quick-note-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Quick Note Scratchpad
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tuliskan ide atau memo singkat yang siap disalin atau dijadikan tugas
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

        {/* Input Form */}
        <form onSubmit={handleSaveNote} className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Judul Catatan (Opsional)
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={e => setNoteTitle(e.target.value)}
              placeholder="e.g. Ide Refactor API, Poin Diskusi Farhan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Isi Memo / Catatan Kilat
            </label>
            <textarea
              rows={4}
              required
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Tuliskan catatan kilat, tautan referensi, atau poin penting..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!noteContent.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium disabled:opacity-50"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
              </button>

              <button
                type="button"
                onClick={handleConvertToTask}
                disabled={!noteContent.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-xs font-medium disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Jadikan Tugas</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!noteContent.trim() && !noteTitle.trim()}
              className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              Simpan Catatan
            </button>
          </div>

          {/* Saved Notes History */}
          {savedNotes.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Catatan Tersimpan ({savedNotes.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedNotes.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
