import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  CheckCircle2,
  Send,
  Plus,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const { companies, deals, updateCompany, openInspector, addToast } = useCrm();

  const company = companies.find((c) => c.id === companyId) || companies[0];
  const companyDeals = deals.filter((d) => d.company.toLowerCase().includes(company.name.toLowerCase()));

  const [notes, setNotes] = useState<string[]>([
    'Annual review complete. Customer evaluating 50 additional user licenses.',
    'Security questionnaire approved by customer CISO.',
  ]);
  const [noteInput, setNoteInput] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setNotes([noteInput.trim(), ...notes]);
    setNoteInput('');
    addToast({ title: 'Account Note Logged', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <Link
          to="/companies"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              {company.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              {company.status}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {company.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left Column: Account Details & Deals */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              Account Overview & Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Industry</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{company.industry}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Annual ARR</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{company.arr || '$180,000'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Company Size</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{company.employees || '100-250'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Location</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{company.location || 'San Francisco, CA'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Primary Contact</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{company.contactPerson}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate block">{company.email}</span>
              </div>
            </div>
          </div>

          {/* Active Deals for this company */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Opportunities</h3>
                <p className="text-xs text-slate-500">Pipeline deals registered for this organization</p>
              </div>
            </div>

            <div className="space-y-3">
              {companyDeals.length > 0 ? (
                companyDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => openInspector({ type: 'deal', data: deal })}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{deal.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Contact: {deal.contact} • Close: {deal.closing}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">${deal.value.toLocaleString()}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                        {deal.stage} ({deal.probability}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-4 text-center">No deals linked to this account yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Account Activity Log */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4 flex flex-col h-[520px]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            Internal Account Log & Notes
          </h3>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Post an internal account update..."
              className="w-full text-xs rounded-xl p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              <Send className="w-3 h-3" /> Post Note
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/[0.04] text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Sales Account Team</span>
                  <span>{index === 0 ? 'Today' : 'Yesterday'}</span>
                </div>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
