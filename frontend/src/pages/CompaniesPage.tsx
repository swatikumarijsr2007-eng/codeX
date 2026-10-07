import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Modal } from '../components/ui/Modal';

export function CompaniesPage({ searchTerm = '' }: { searchTerm?: string }) {
  const { companies, addCompany } = useCrm();
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'SaaS & Enterprise',
    contactPerson: 'Sarah Jenkins',
    email: 'contact@company.com',
    phone: '+1 (415) 555-0199',
    opportunities: 1,
    status: 'Active' as const,
    arr: '$120,000',
    employees: '50-100',
    location: 'San Francisco, CA',
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (comp) =>
        !query ||
        comp.name.toLowerCase().includes(query) ||
        comp.industry.toLowerCase().includes(query) ||
        comp.contactPerson.toLowerCase().includes(query),
    );
  }, [companies, query]);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;
    addCompany(newCompany);
    setIsModalOpen(false);
    setNewCompany({
      name: '',
      industry: 'SaaS & Enterprise',
      contactPerson: 'Sarah Jenkins',
      email: 'contact@company.com',
      phone: '+1 (415) 555-0199',
      opportunities: 1,
      status: 'Active',
      arr: '$120,000',
      employees: '50-100',
      location: 'San Francisco, CA',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Account Management
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredCompanies.length} Accounts
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Company Accounts & Enterprises
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strategic partner organizations, client accounts, and revenue tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + New Company
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by company name, industry, key contact..."
          className="w-full text-xs rounded-xl pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => (
          <Link
            key={company.id}
            to={`/companies/${company.id}`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-blue-400/80 dark:hover:border-blue-500/50 transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {company.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{company.industry}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    company.status === 'Active'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50'
                      : company.status === 'Negotiation'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50'
                  }`}
                >
                  {company.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.05] text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-slate-400 block text-[10px]">Annual ARR</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{company.arr || '$120,000'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                  <span className="text-slate-400 block text-[10px]">Open Deals</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{company.opportunities} active</span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <p><span className="font-medium text-slate-700 dark:text-slate-300">Lead Contact:</span> {company.contactPerson}</p>
                <p><span className="font-medium text-slate-700 dark:text-slate-300">HQ:</span> {company.location || 'San Francisco, CA'}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition">
              <span>View Account Intelligence</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* New Company Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Company Account" subtitle="Track accounts and enterprise organization parameters.">
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                placeholder="e.g. Acme Cloud Corp"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Industry Vertical
              </label>
              <input
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                placeholder="e.g. Fintech, Healthcare"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Contact
              </label>
              <input
                value={newCompany.contactPerson}
                onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                placeholder="Executive Contact"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                HQ Location
              </label>
              <input
                value={newCompany.location}
                onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                placeholder="City, State"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              Save Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
