import React, { useState } from 'react';
import {
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Table as TableIcon,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import type { DealRecord } from '../../data/initialData';
import { NewDealModal } from '../modals/NewDealModal';

const STAGES: Array<DealRecord['stage']> = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const STAGE_COLORS: Record<DealRecord['stage'], { border: string; bg: string; badge: string }> = {
  New: { border: 'border-slate-300 dark:border-slate-700', bg: 'bg-slate-50 dark:bg-slate-900/60', badge: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  Qualified: { border: 'border-blue-400 dark:border-blue-500/40', bg: 'bg-blue-50/40 dark:bg-blue-950/20', badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
  Proposal: { border: 'border-cyan-400 dark:border-cyan-500/40', bg: 'bg-cyan-50/40 dark:bg-cyan-950/20', badge: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300' },
  Negotiation: { border: 'border-amber-400 dark:border-amber-500/40', bg: 'bg-amber-50/40 dark:bg-amber-950/20', badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
  Won: { border: 'border-emerald-400 dark:border-emerald-500/40', bg: 'bg-emerald-50/40 dark:bg-emerald-950/20', badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  Lost: { border: 'border-rose-400 dark:border-rose-500/40', bg: 'bg-rose-50/40 dark:bg-rose-950/20', badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300' },
};

export function KanbanBoard() {
  const { deals, moveDealStage, openInspector } = useCrm();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<DealRecord['stage']>('New');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealRecord['stage']) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      moveDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
  };

  const advanceStage = (deal: DealRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex < STAGES.length - 2) {
      moveDealStage(deal.id, STAGES[currentIndex + 1]);
    } else if (deal.stage === 'Negotiation') {
      moveDealStage(deal.id, 'Won');
    }
  };

  const regressStage = (deal: DealRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex > 0) {
      moveDealStage(deal.id, STAGES[currentIndex - 1]);
    }
  };

  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.stage !== 'Lost' ? d.value : 0), 0);
  const wonPipelineValue = deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Top Pipeline KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Active Pipeline</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            ${totalPipelineValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
            Across {deals.length} total sales opportunities
          </p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Closed Won Revenue</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            ${wonPipelineValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            100% realized ARR cash flow
          </p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Quick Pipeline Actions</span>
            <TrendingUp className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                setModalStage('New');
                setIsModalOpen(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm shadow-blue-500/25"
            >
              <Plus className="w-3.5 h-3.5" /> + New Opportunity
            </button>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-white/[0.06]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white' : 'text-slate-400'
                }`}
                title="Kanban Board View"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white' : 'text-slate-400'
                }`}
                title="Data Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Stages Grid */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const style = STAGE_COLORS[stage];

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className={`rounded-2xl border ${style.border} ${style.bg} p-3.5 min-h-[500px] flex flex-col transition-all duration-200`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {stage}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {stageDeals.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setModalStage(stage);
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition"
                    title={`Add deal to ${stage}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stage Value Metric */}
                <div className="py-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium tabular-nums flex items-center justify-between">
                  <span>Volume:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${stageTotal.toLocaleString()}</span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 mt-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => openInspector({ type: 'deal', data: deal })}
                      className="group p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-blue-400/80 dark:hover:border-blue-500/50 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {deal.name}
                        </h4>
                        <span className="shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          ${deal.value.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                        {deal.company} • {deal.contact}
                      </p>

                      {/* Probability progress bar */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Probability</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{deal.probability}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              deal.stage === 'Won'
                                ? 'bg-emerald-500'
                                : deal.stage === 'Lost'
                                ? 'bg-rose-500'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Info & Quick Move */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{deal.closing.split('-').slice(1).join('/')}</span>
                        </div>

                        {/* Interactive Move Arrows */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {stage !== 'New' && (
                            <button
                              onClick={(e) => regressStage(deal, e)}
                              title="Move back a stage"
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {stage !== 'Won' && stage !== 'Lost' && (
                            <button
                              onClick={(e) => advanceStage(deal, e)}
                              title="Advance to next stage"
                              className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-500 font-semibold transition"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] text-center text-[11px] text-slate-400">
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Alternative Table View */
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Deal Opportunity</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Win Probability</th>
                <th className="px-4 py-3">Closing Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => openInspector({ type: 'deal', data: deal })}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{deal.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{deal.company}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${deal.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STAGE_COLORS[deal.stage].badge}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{deal.probability}%</td>
                  <td className="px-4 py-3 text-slate-500">{deal.closing}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInspector({ type: 'deal', data: deal });
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-300 transition"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Deal Modal */}
      <NewDealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultStage={modalStage} />
    </div>
  );
}
