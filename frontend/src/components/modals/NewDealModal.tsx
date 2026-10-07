import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useCrm } from '../../context/CrmContext';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
}

export function NewDealModal({ isOpen, onClose, defaultStage = 'New' }: NewDealModalProps) {
  const { addDeal, companies } = useCrm();
  const [formData, setFormData] = useState({
    name: '',
    company: companies[0]?.name || 'Northstar Labs',
    contact: 'Sophia Nguyen',
    value: 20000,
    probability: 30,
    employee: 'Alicia James',
    closing: '2026-11-30',
    stage: defaultStage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addDeal(formData);
    onClose();
    setFormData({
      name: '',
      company: companies[0]?.name || 'Northstar Labs',
      contact: 'Sophia Nguyen',
      value: 20000,
      probability: 30,
      employee: 'Alicia James',
      closing: '2026-11-30',
      stage: defaultStage,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open Opportunity Deal" subtitle="Create and track a pipeline deal across sales stages.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Deal Name <span className="text-rose-500">*</span>
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Q4 Platform Migration"
            className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Company
            </label>
            <input
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Northstar Labs"
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Contact
            </label>
            <input
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g. Sophia Nguyen"
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Deal Value ($)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pipeline Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expected Close Date
            </label>
            <input
              type="date"
              value={formData.closing}
              onChange={(e) => setFormData({ ...formData, closing: e.target.value })}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm shadow-emerald-500/25"
          >
            Create Opportunity
          </button>
        </div>
      </form>
    </Modal>
  );
}
