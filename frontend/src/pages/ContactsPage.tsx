import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Trash2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Modal } from '../components/ui/Modal';

export function ContactsPage({ searchTerm = '' }: { searchTerm?: string }) {
  const { contacts, addContact, deleteContact, openInspector } = useCrm();
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    company: 'Northstar Labs',
    email: '',
    phone: '',
    position: 'Executive',
    status: 'Active' as const,
    employee: 'Alicia James',
    location: 'San Francisco, CA',
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.position.toLowerCase().includes(query),
    );
  }, [contacts, query]);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim()) return;
    addContact(newContact);
    setIsModalOpen(false);
    setNewContact({
      name: '',
      company: 'Northstar Labs',
      email: '',
      phone: '',
      position: 'Executive',
      status: 'Active',
      employee: 'Alicia James',
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
              People & Stakeholders
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredContacts.length} Contacts
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Customer Contacts Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key enterprise buyers, technical architects, and decision makers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + New Contact
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by name, company, position, email..."
          className="w-full text-xs rounded-xl pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Contacts Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3.5">Contact Name</th>
              <th className="px-4 py-3.5">Company Account</th>
              <th className="px-4 py-3.5">Title / Position</th>
              <th className="px-4 py-3.5">Email & Phone</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Account Manager</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {filteredContacts.map((contact) => (
              <tr
                key={contact.id}
                onClick={() => openInspector({ type: 'contact', data: contact })}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{contact.location || 'Remote'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {contact.company}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {contact.position}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  <p>{contact.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{contact.phone}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      contact.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {contact.employee}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openInspector({ type: 'contact', data: contact })}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-300 transition"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Customer Contact" subtitle="Add executive stakeholder records to accounts.">
        <form onSubmit={handleCreateContact} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="e.g. David Lin"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Account
              </label>
              <input
                required
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                placeholder="e.g. Northstar Labs"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="david@company.com"
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Title / Position
              </label>
              <input
                value={newContact.position}
                onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                placeholder="e.g. VP of Product"
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
              Save Contact
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
