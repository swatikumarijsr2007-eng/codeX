import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export function CustomerProfilePage() {
  const { customerId } = useParams();
  const { contacts, deals, openInspector, addToast } = useCrm();

  const customer = contacts.find((c) => c.id === customerId) || contacts[0];
  const customerDeals = deals.filter((d) => d.contact.toLowerCase().includes(customer.name.toLowerCase()));

  const [milestones, setMilestones] = useState<string[]>([
    'Customer lead created via inbound web form',
    'Discovery briefing completed with Sales Engineer',
    'Product walkthrough deck & pricing delivered',
    'Security & compliance checklist approved',
    'Contract moved to Final Negotiation',
  ]);
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    setMilestones([newMilestone.trim(), ...milestones]);
    setNewMilestone('');
    addToast({ title: 'Milestone Logged', description: 'Added to customer timeline.', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/contacts"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              {customer.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              {customer.status}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {customer.name}
          </h1>
          <p className="text-xs text-slate-500">{customer.position} at {customer.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Left Column: Contact Data & Opportunities */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              Customer Profile Data
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-slate-400">Account:</span>
                <span className="font-bold text-slate-900 dark:text-white">{customer.company}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{customer.email}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{customer.phone}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <span className="text-slate-400">Executive Rep:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{customer.employee}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              Linked Opportunities
            </h3>
            <div className="space-y-2.5">
              {customerDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => openInspector({ type: 'deal', data: deal })}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{deal.name}</p>
                    <p className="text-[10px] text-slate-400">{deal.stage} • Close: {deal.closing}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ${deal.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Timeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Unified Customer Timeline</h3>
              <p className="text-xs text-slate-500">End-to-end journey from first lead touch to close</p>
            </div>
          </div>

          <form onSubmit={handleAddMilestone} className="flex gap-2">
            <input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Record a milestone or event (e.g. Sent MSA)..."
              className="flex-1 text-xs rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shrink-0"
            >
              + Add
            </button>
          </form>

          <div className="space-y-4 pt-2">
            {milestones.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/20 shrink-0 mt-1" />
                  {index !== milestones.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
                  )}
                </div>
                <div className="flex-1 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/[0.05]">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{item}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {index === 0 ? 'Recorded Today' : `Stage ${milestones.length - index} Verified`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
