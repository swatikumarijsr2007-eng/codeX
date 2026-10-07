import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  MoreVertical,
  Building2,
  Mail,
  Phone,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import type { LeadRecord } from '../data/initialData';
import { NewLeadModal } from '../components/modals/NewLeadModal';

export function LeadsPage({ searchTerm = '' }: { searchTerm?: string }) {
  const { leads, deleteLead, bulkDeleteLeads, updateLead, openInspector, addToast } = useCrm();
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof LeadRecord>('created');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesQuery =
          !query ||
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone.includes(query);

        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

        return matchesQuery && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
  }, [leads, query, statusFilter, sourceFilter, sortField, sortAsc]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Company,Email,Phone,Source,Status,EstValue,CreatedDate']
        .concat(
          filteredLeads.map(
            (l) =>
              `${l.id},"${l.name}","${l.company}",${l.email},${l.phone},${l.source},${l.status},${l.value},${l.created}`,
          ),
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codex_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Export Successful', description: 'Leads CSV saved to downloads.', variant: 'success' });
  };

  const handleSort = (field: keyof LeadRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Pipeline Records
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredLeads.length} Total
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Leads Pipeline Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Capture, qualify, and route prospects across your inbound and outbound channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> + New Lead
          </button>
        </div>
      </div>

      {/* Filter and Bulk Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by name, company, email..."
              className="w-full text-xs rounded-xl pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Converted">Converted</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs rounded-xl px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Outbound">Outbound</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Bulk Action Ribbon when selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 animate-fade-in text-xs text-blue-700 dark:text-blue-300">
            <span className="font-bold">{selectedIds.length} Selected</span>
            <button
              onClick={() => {
                selectedIds.forEach((id) => updateLead(id, { status: 'Qualified' }));
                setSelectedIds([]);
              }}
              className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 font-semibold text-[11px]"
            >
              Mark Qualified
            </button>
            <button
              onClick={() => {
                bulkDeleteLeads(selectedIds);
                setSelectedIds([]);
              }}
              className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-500 font-semibold text-[11px]"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-3 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Lead Contact</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('company')}
                  className="px-3 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Company</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-3.5">Contact Channel</th>
                <th className="px-3 py-3.5">Source</th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-3 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('value')}
                  className="px-3 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Est. Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-3.5">Assigned Rep</th>
                <th className="px-3 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);

                return (
                  <tr
                    key={lead.id}
                    onClick={() => openInspector({ type: 'lead', data: lead })}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5" onClick={(e) => toggleSelect(lead.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{lead.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {lead.company}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 dark:text-slate-400">
                      <p className="truncate max-w-[150px]">{lead.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{lead.phone}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          lead.status === 'Qualified'
                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50'
                            : lead.status === 'Converted'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50'
                            : lead.status === 'Proposal'
                            ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200/50'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      ${lead.value ? lead.value.toLocaleString() : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
                      {lead.executive}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openInspector({ type: 'lead', data: lead })}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-300 transition"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
