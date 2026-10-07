import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  Trash2,
  Building2,
  Filter,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { NewTaskModal } from '../modals/NewTaskModal';

interface TasksPageProps {
  searchTerm?: string;
}

export function InteractiveTasks({ searchTerm = '' }: TasksPageProps) {
  const { tasks, toggleTask, deleteTask, openInspector } = useCrm();
  const [filter, setFilter] = useState<'All' | 'Today' | 'In Progress' | 'Overdue' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    // Search match
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Today') return task.status === 'Today' && !task.completed;
    if (filter === 'Overdue') return task.status === 'Overdue' && !task.completed;
    if (filter === 'In Progress') return task.status === 'In Progress' && !task.completed;

    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header controls & stats */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-white/[0.06] overflow-x-auto">
          {[
            { id: 'All', label: 'All Tasks', count: tasks.length },
            { id: 'Today', label: 'Due Today', count: tasks.filter((t) => t.status === 'Today' && !t.completed).length },
            { id: 'Overdue', label: 'Overdue', count: tasks.filter((t) => t.status === 'Overdue' && !t.completed).length },
            { id: 'In Progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress' && !t.completed).length },
            { id: 'Completed', label: 'Completed', count: completedCount },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setFilter(id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-mono">
                {count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + Create Task
        </button>
      </div>

      {/* Task List Items */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-white/[0.05]">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between gap-4 transition group ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-950/30 opacity-70'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Interactive Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`p-1 rounded-lg transition ${
                    task.completed
                      ? 'text-emerald-500 hover:text-emerald-600'
                      : 'text-slate-400 hover:text-blue-500'
                  }`}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.priority === 'High'
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {task.customer}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" /> Due {task.dueDate}
                    </span>
                    <span>•</span>
                    <span>Assigned to {task.owner}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openInspector({ type: 'task', data: task })}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition"
                >
                  Inspect
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">No matching tasks found</p>
            <p className="text-[11px] text-slate-400">All customer follow-ups in this filter category are up to date.</p>
          </div>
        )}
      </div>

      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
