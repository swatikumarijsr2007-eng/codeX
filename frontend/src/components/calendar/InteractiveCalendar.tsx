import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Video,
  Phone,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { NewEventModal } from '../modals/NewEventModal';

export function InteractiveCalendar() {
  const { events, deleteCalendarEvent } = useCrm();
  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr };
  });

  const selectedDayEvents = events.filter((e) => e.date === selectedDate);

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'Call':
        return 'bg-blue-500 text-white';
      case 'Meeting':
        return 'bg-purple-500 text-white';
      case 'Demo':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-amber-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
        {/* Left Calendar Grid */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 p-5 shadow-sm">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{currentMonth}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/50 dark:border-blue-500/20">
                {events.length} Scheduled
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Book Event
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="mt-4">
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {daysInMonth.map(({ dayNum, dateStr }) => {
                const dayEvents = events.filter((e) => e.date === dateStr);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-20 p-2 rounded-xl border text-left transition flex flex-col justify-between relative group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/15 ring-2 ring-blue-500/30'
                        : dayEvents.length > 0
                        ? 'border-slate-200 dark:border-white/[0.1] bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-400'
                        : 'border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden w-full">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${getEventBadgeClass(
                            ev.type,
                          )}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-bold block">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Day Details Panel */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Day Agenda</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedDate}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold"
            >
              + Schedule on {selectedDate.split('-')[2]}th
            </button>
          </div>

          <div className="flex-1 mt-4 space-y-3 overflow-y-auto">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.07] bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-blue-400 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getEventBadgeClass(ev.type)}`}>
                        {ev.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{ev.title}</h4>
                    </div>
                    <button
                      onClick={() => deleteCalendarEvent(ev.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/40 dark:border-white/[0.04]">
                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{ev.attendees}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] text-center space-y-2 my-auto">
                <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No events on {selectedDate}</p>
                <p className="text-[11px] text-slate-400">Your agenda is open for client discovery calls and sales reviews.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
                >
                  <Plus className="w-3 h-3" /> Add Event Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </div>
  );
}
