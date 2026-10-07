import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Plus,
  Send,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export function DetailDrawer() {
  const { activeInspector, closeInspector, updateLead, deleteLead, updateDeal, deleteDeal, moveDealStage, addToast } = useCrm();
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'actions'>('details');
  const [noteInput, setNoteInput] = useState('');
  const [localNotes, setLocalNotes] = useState<string[]>([
    'Initial qualification call completed. High customer purchase intent.',
    'Follow-up scheduled with decision maker.',
  ]);

  if (!activeInspector) return null;

  const { type, data } = activeInspector;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setLocalNotes([noteInput.trim(), ...localNotes]);
    setNoteInput('');
    addToast({ title: 'Note Logged', description: 'Internal team note added to audit trail.', variant: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={closeInspector}
        className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[2px] pointer-events-auto transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-white/[0.08] shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
                  {type.toUpperCase()} • {data.id}
                </span>
                {'status' in data && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                    {data.status}
                  </span>
                )}
                {'stage' in data && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-500/20">
                    Stage: {data.stage}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {'name' in data ? data.name : 'title' in data ? data.title : 'Record Details'}
              </h2>
              {'company' in data && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {data.company}
                </p>
              )}
            </div>

            <button
              onClick={closeInspector}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Ribbon */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/20 dark:bg-slate-950/20 flex items-center gap-2 overflow-x-auto">
            {'email' in data && data.email && (
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/20 hover:bg-blue-100/70 dark:hover:bg-blue-500/20 transition"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}
            {'phone' in data && data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-500/20 transition"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            )}
            {type === 'lead' && (
              <button
                onClick={() => {
                  updateLead(data.id, { status: 'Qualified' });
                  addToast({ title: 'Lead Status Updated', description: 'Marked as Qualified', variant: 'success' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20 hover:bg-purple-100/70 dark:hover:bg-purple-500/20 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualify
              </button>
            )}
            {type === 'deal' && (
              <button
                onClick={() => moveDealStage(data.id, 'Won')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Mark Won
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 dark:border-white/[0.06] px-5">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Notes & Activity ({localNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'actions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Pipeline Controls
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-sm">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {Object.entries(data).map(([key, value]) => {
                    if (typeof value === 'object' || Array.isArray(value)) return null;
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/[0.05]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 break-words">
                          {typeof value === 'number' && (key.includes('value') || key.includes('arr'))
                            ? `$${value.toLocaleString()}`
                            : String(value ?? '—')}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {'notes' in data && data.notes && (
                  <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                    <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">Lead Context & Objectives</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{data.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <div className="relative">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Type a team note, call summary, or meeting takeaway..."
                      rows={3}
                      className="w-full text-xs rounded-xl p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
                  >
                    <Send className="w-3 h-3" /> Log Note
                  </button>
                </form>

                <div className="space-y-2.5 pt-2">
                  {localNotes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/[0.05]"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Internal Sales Rep Note</span>
                        <span>{index === 0 ? 'Today' : 'Oct 04'}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-4">
                {type === 'deal' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Pipeline Stage
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const).map((stage) => (
                        <button
                          key={stage}
                          onClick={() => moveDealStage(data.id, stage)}
                          className={`px-3 py-2 text-xs rounded-lg font-medium border text-left transition ${
                            data.stage === stage
                              ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1.5">Danger Zone</p>
                  <p className="text-xs text-slate-500 mb-3">Permanently remove this record and all associated timeline entries.</p>
                  <button
                    onClick={() => {
                      if (type === 'lead') deleteLead(data.id);
                      if (type === 'deal') deleteDeal(data.id);
                      closeInspector();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-500/20 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete this {type}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
