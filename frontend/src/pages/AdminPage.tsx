import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  UserCheck,
  UserX,
  ShieldAlert,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Modal } from '../components/ui/Modal';
import type { AdminUserRecord } from '../data/initialData';

export function AdminPage() {
  const { adminUsers, inviteAdminUser, addToast } = useCrm();
  const [users, setUsers] = useState<AdminUserRecord[]>(adminUsers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Sales Executive' as const,
    status: 'Active' as const,
  });

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
    addToast({ title: 'User Status Updated', description: 'Access permissions recalculated.', variant: 'info' });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    inviteAdminUser(newUser);
    setUsers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastLogin: 'Never',
      },
    ]);
    setIsInviteOpen(false);
    setNewUser({ name: '', email: '', role: 'Sales Executive', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Security Governance
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              RBAC Enabled
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Enterprise Admin & Security Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Role-based user permissions, access tokens, and organizational security policies.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + Invite Team Member
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3.5">User Account</th>
              <th className="px-4 py-3.5">Work Email</th>
              <th className="px-4 py-3.5">Assigned Role</th>
              <th className="px-4 py-3.5">Security Status</th>
              <th className="px-4 py-3.5">Last Session</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {user.email}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      user.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                  {user.lastLogin}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member" subtitle="Dispatch a secure activation link with assigned CRM permissions.">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Rachel Torres"
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Work Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="rachel@codexcrm.com"
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Role Permission Level
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Super Admin">Super Admin (All Modules)</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales Executive">Sales Executive</option>
              <option value="Support/User">Support / User</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              Dispatch Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
