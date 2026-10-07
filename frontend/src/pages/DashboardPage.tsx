import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  ClipboardList,
  Sparkles,
  ArrowUpRight,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { useAuth } from '../context/AuthContext';
import { NewLeadModal } from '../components/modals/NewLeadModal';
import { NewDealModal } from '../components/modals/NewDealModal';

export function DashboardPage() {
  const { leads, deals, tasks, activities, toggleTask, openInspector } = useCrm();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'qtd' | 'ytd'>('30d');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  // Timeframe dynamic multiplier
  const multiplier = timeframe === '7d' ? 0.35 : timeframe === '30d' ? 1 : timeframe === 'qtd' ? 2.8 : 9.5;

  const totalPipeline = deals.reduce((sum, d) => sum + (d.stage !== 'Lost' ? d.value : 0), 0) * multiplier;
  const wonRevenue = deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0) * multiplier;
  const activeLeadsCount = Math.round(leads.length * multiplier);
  const winRate = '73.4%';

  const pipelineStages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Welcome & Timeframe Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-purple-900/30 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/40 border border-blue-500/20 dark:border-white/[0.08] backdrop-blur-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
              Live Operations
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              October 2026 • CodeX Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Executive'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
            Q4 sales pipeline is currently pacing at <span className="font-bold text-emerald-600 dark:text-emerald-400">114% of quota</span>. You have 3 high-priority customer follow-ups scheduled today.
          </p>
        </div>

        {/* Timeframe pill selector & quick action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex p-1 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.1] shadow-sm">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: 'qtd', label: 'QTD' },
              { id: 'ytd', label: 'YTD' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeframe(id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  timeframe === id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsDealModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" /> Open Opportunity
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => navigate('/opportunities')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:border-blue-400/80 dark:hover:border-blue-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Sales Pipeline</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              ${Math.round(totalPipeline).toLocaleString()}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across {deals.length} active deal stages</p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => navigate('/leads')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:border-blue-400/80 dark:hover:border-blue-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Qualified Leads</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {activeLeadsCount}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              +12.1% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">42% inbound from organic channels</p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => navigate('/reports')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:border-blue-400/80 dark:hover:border-blue-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Win Conversion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {winRate}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              +6.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Industry SaaS benchmark: 48%</p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:border-blue-400/80 dark:hover:border-blue-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Open Follow-up Tasks</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {tasks.filter((t) => !t.completed).length}
            </p>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              3 due today
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">94% team completion velocity</p>
        </div>
      </div>

      {/* Main Grid: Pipeline Funnel & Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Pipeline Stage Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pipeline Stage Health</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live distribution of opportunity stages</p>
            </div>
            <button
              onClick={() => navigate('/opportunities')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open Pipeline Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {pipelineStages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage);
              const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
              const percentage = Math.min(Math.round((stageTotal / Math.max(totalPipeline, 1)) * 100), 100);

              return (
                <div key={stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">{stageDeals.length} deals</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ${stageTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Quick Actions Launcher */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              Instant Workflow Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Capture Lead</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Add prospect to queue</p>
              </button>

              <button
                onClick={() => setIsDealModalOpen(true)}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-800/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <DollarSign className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Create Deal</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Log new revenue value</p>
              </button>

              <button
                onClick={() => navigate('/communications')}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-purple-400 bg-slate-50/50 dark:bg-slate-800/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dispatch Email</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Outbound templates</p>
              </button>

              <button
                onClick={() => navigate('/calendar')}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Book Demo</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Calendar appointment</p>
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/30 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
            <span>Power shortcut: press <kbd className="px-1.5 py-0.5 bg-blue-200/60 dark:bg-blue-900/60 rounded font-mono font-bold">⌘K</kbd> anytime</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Audit Activities & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.1fr] gap-6">
        {/* Live Activity Stream */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Activity Feed</h3>
            <span className="text-[11px] text-slate-400">Live Audit Trail</span>
          </div>
          <div className="mt-4 space-y-3.5">
            {activities.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-white/[0.04]"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {item.user.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Follow-ups */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Account Follow-ups</h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="mt-4 space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-slate-200/60 dark:border-white/[0.05] bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-slate-400 hover:text-emerald-500 transition"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${task.completed ? 'text-emerald-500' : ''}`} />
                  </button>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold text-slate-800 dark:text-slate-200 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{task.customer} • Due {task.dueDate}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewLeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      <NewDealModal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)} />
    </div>
  );
}
