import React, { useState } from 'react';
import {
  Kanban,
  ListFilter,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  User,
  CalendarDays,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, Priority, LanguageCode, UserRole, TeamMember } from '../types';
import { translations } from '../i18n/translations';
import { exportTasksToSheetsCSV, exportTasksToICS } from '../utils/exportUtils';

interface TasksKanbanCalendarViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  tasks: Task[];
  team: TeamMember[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'synced'>) => void;
  onShowNotification: (title: string, message: string, priority: 'urgent' | 'info' | 'success') => void;
}

export const TasksKanbanCalendarView: React.FC<TasksKanbanCalendarViewProps> = ({
  currentLang,
  userRole,
  tasks,
  team,
  onUpdateTaskStatus,
  onAddTask,
  onShowNotification
}) => {
  const t = translations[currentLang];
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('high');
  const [newTaskAssignee, setNewTaskAssignee] = useState(team[0]?.name || 'Farhan Maulana');
  const [newTaskDeadline, setNewTaskDeadline] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [newTaskHours, setNewTaskHours] = useState(8);

  const columns: { id: TaskStatus; label: string; color: string; badge: string }[] = [
    { id: 'todo', label: t.tasks.todo, color: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { id: 'in_progress', label: t.tasks.inProgress, color: 'border-indigo-400 dark:border-indigo-700', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' },
    { id: 'review', label: t.tasks.review, color: 'border-amber-400 dark:border-amber-700', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300' },
    { id: 'completed', label: t.tasks.completed, color: 'border-emerald-400 dark:border-emerald-700', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300' }
  ];

  const safeTasks = Array.isArray(tasks) ? tasks.filter(t => t && typeof t === 'object') : [];

  const filteredTasks = safeTasks.filter(task => {
    const title = (task.title || '').toLowerCase();
    const assignee = (task.assignee || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(query) ||
      assignee.includes(query) ||
      (Array.isArray(task.tags) && task.tags.some(tag => tag && tag.toLowerCase().includes(query)));

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Tugas kolaboratif terkelola via sideoffar.cloud',
      priority: newTaskPriority,
      status: 'todo',
      deadline: newTaskDeadline,
      assignee: newTaskAssignee,
      tags: ['Sprint-Q3', 'Collab'],
      estimatedHours: Number(newTaskHours) || 8,
      actualHours: 0
    });

    onShowNotification(
      'Tugas Berhasil Ditambahkan',
      `Tugas "${newTaskTitle}" telah dijadwalkan dan siap disinkronkan ke kalender tim.`,
      'success'
    );

    setIsAddModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {}
      onShowNotification('Tugas Selesai!', 'Satu alur kerja berhasil diselesaikan tepat waktu.', 'success');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with Title and Mode Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.tasks.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.tasks.subtitle}
          </p>
        </div>

        {/* View Switcher, Calendar Sync, Add Task */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>{t.tasks.kanbanTab}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{t.tasks.listTab}</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{t.tasks.calendarTab}</span>
            </button>
          </div>

          {/* Calendar Export (.ics) */}
          <button
            id="export-calendar-ics-btn"
            onClick={() => exportTasksToICS(tasks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={t.tasks.exportIcs}
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Sinkron Kalender (.ics)</span>
          </button>

          {/* Sheets Export */}
          <button
            id="export-tasks-sheets-btn"
            onClick={() => exportTasksToSheetsCSV(tasks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Ekspor ke CSV / Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Sheets / CSV</span>
          </button>

          {/* Add Task Button */}
          <button
            id="open-add-task-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.tasks.newTask}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari alur kerja, penanggung jawab, atau tag..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">Mendesak (Urgent)</option>
            <option value="high">Tinggi (High)</option>
            <option value="medium">Sedang (Medium)</option>
            <option value="low">Rendah (Low)</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/70 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {col.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards Column */}
                <div className="space-y-2.5 flex-1 min-h-[300px]">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-2xs hover:shadow-md transition-shadow group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                              : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Quick Move Next Status */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => {
                                const nextMap: Record<TaskStatus, TaskStatus> = {
                                  todo: 'in_progress',
                                  in_progress: 'review',
                                  review: 'completed',
                                  completed: 'completed'
                                };
                                handleStatusChange(task.id, nextMap[col.id]);
                              }}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-500 transition-colors text-[10px] flex items-center gap-0.5"
                              title="Pindahkan ke status berikutnya"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {task.title || 'Tugas Tanpa Judul'}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description || '-'}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.deadline}</span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {(task.assignee || 'Tim').split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                      Tidak ada tugas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: STRUCTURED LIST */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Tugas</th>
                  <th className="p-3.5">Prioritas</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tenggat</th>
                  <th className="p-3.5">Penanggung Jawab</th>
                  <th className="p-3.5 text-right">Aksi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {task.description}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {task.deadline}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {task.assignee}
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                September 2026 - Jadwal Alur Kerja & Deadline Proyek
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Sinkronisasi Google Calendar Aktif
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
              <div key={day} className="py-1.5 font-bold text-slate-400 text-[11px] uppercase">
                {day}
              </div>
            ))}

            {/* Render 30 calendar day cells */}
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayTasks = tasks.filter(t => t.deadline === dateStr);
              const isToday = dayNum === 16;

              return (
                <div
                  key={dayNum}
                  className={`min-h-[85px] p-1.5 rounded-xl border text-left transition-all ${
                    isToday
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
                      : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.map(task => (
                      <div
                        key={task.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate leading-tight ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200'
                        }`}
                        title={`${task.title || 'Tugas'} (${task.assignee || 'Tim'})`}
                      >
                        {task.title || 'Tugas'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.tasks.newTask}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Alur Kerja / Tugas
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Contoh: Audit Enkripsi HSM Wilayah Asia Pasifik"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi & Spesifikasi
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Rincian objektif tugas dan deliverable alur kerja..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Prioritas
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
                  >
                    <option value="urgent">Mendesak (Urgent)</option>
                    <option value="high">Tinggi (High)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="low">Rendah (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="date"
                    required
                    value={newTaskDeadline}
                    onChange={e => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Penanggung Jawab (Assignee)
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estimasi Jam Kerja
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
