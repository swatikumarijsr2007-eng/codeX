import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, addToast } = useCrm();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'SALES_EXECUTIVE' as const,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.name.trim()) return;
    setLoading(true);

    try {
      await login(form.username, form.password);
      addToast({
        title: 'Account Created',
        description: `Welcome to CodeX CRM, ${form.name}!`,
        variant: 'success',
      });
      navigate('/dashboard', { replace: true });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 ${
      theme === 'dark' ? 'bg-[#080d19]' : 'bg-[#f8fafc]'
    }`}>
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-2xl p-8 sm:p-10 relative z-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            CodeX <span className="text-blue-500">CRM</span>
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Start Your CRM Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Create an enterprise workspace with team pipeline access.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Elena Vance"
              className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Username
            </label>
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="elenavance"
              className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="elena@enterprise.io"
              className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Workspace Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="SUPER_ADMIN">Super Admin (All Privileges)</option>
              <option value="SALES_EXECUTIVE">Sales Executive</option>
              <option value="MANAGER">Sales Manager</option>
              <option value="SUPPORT_USER">Support & User Care</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-500/25 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account & Enter'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Sign in here →
          </Link>
        </div>
      </div>
    </div>
  );
}
