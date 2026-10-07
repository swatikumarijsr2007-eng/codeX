import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export function ReportsPage() {
  const { deals, leads, tasks, addToast } = useCrm();
  const [period, setPeriod] = useState<'7d' | '30d' | 'qtd' | 'ytd'>('30d');

  const factor = period === '7d' ? 0.4 : period === '30d' ? 1 : period === 'qtd' ? 2.5 : 8.2;

  const pipelineSum = Math.round(deals.reduce((acc, d) => acc + d.value, 0) * factor);
  const conversionRate = period === '7d' ? '31.2%' : period === '30d' ? '34.8%' : '38.4%';
  const tasksCompleted = Math.round(184 * factor);

  const monthlyComms = [
    { month: 'Jan', value: Math.round(30 * factor) },
    { month: 'Feb', value: Math.round(48 * factor) },
    { month: 'Mar', value: Math.round(60 * factor) },
    { month: 'Apr', value: Math.round(58 * factor) },
    { month: 'May', value: Math.round(78 * factor) },
    { month: 'Jun', value: Math.round(96 * factor) },
  ];

  const maxVal = Math.max(...monthlyComms.map((m) => m.value), 1);

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Period\n' +
      `"Total Pipeline","$${pipelineSum.toLocaleString()}","${period.toUpperCase()}"\n` +
      `"Lead Conversion","${conversionRate}","${period.toUpperCase()}"\n` +
      `"Tasks Executed","${tasksCompleted}","${period.toUpperCase()}"\n` +
      `"Active Leads","${leads.length}","${period.toUpperCase()}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codex_crm_analytics_report_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Report Downloaded', description: 'Analytics CSV successfully generated.', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Executive Analytics
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              Q4 FY26
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Revenue & Sales Velocity Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conversion metrics, channel attribution, and sales pipeline performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.1] shadow-sm">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: 'qtd', label: 'QTD' },
              { id: 'ytd', label: 'YTD' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPeriod(id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  period === id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export Analytics CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Lead Conversion</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{conversionRate}</p>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
            +5.4% this period <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Sales Pipeline</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">${pipelineSum.toLocaleString()}</p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
            Across {deals.length} opportunities
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Won vs Lost Ratio</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">72 / 26</p>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            73.5% historic win velocity
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Tasks Executed</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{tasksCompleted}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            92% on-schedule fulfillment
          </span>
        </div>
      </div>

      {/* Dynamic Graph & Attribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Communication & Outreach Volume</h3>
              <p className="text-xs text-slate-500">Monthly cross-channel outbound touches</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full">
              +38% Growth
            </span>
          </div>

          <div className="h-56 flex items-end gap-4 pt-6 px-2">
            {monthlyComms.map((item) => {
              const heightPercent = Math.round((item.value / maxVal) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition font-mono">
                    {item.value}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            Channel Acquisition Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Organic Search & Website', pct: 42, color: 'bg-blue-500' },
              { label: 'Executive Referral', pct: 28, color: 'bg-emerald-500' },
              { label: 'Outbound SDR Campaign', pct: 18, color: 'bg-purple-500' },
              { label: 'Event & Conference', pct: 12, color: 'bg-amber-500' },
            ].map((channel) => (
              <div key={channel.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{channel.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{channel.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${channel.color}`} style={{ width: `${channel.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
