import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';

const demoRolesList = [
  {
    role: 'Super Admin',
    username: 'superadmin',
    desc: 'Unrestricted access to all 11 modules & RBAC admin',
    icon: ShieldCheck,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    role: 'Sales Executive',
    username: 'sales',
    desc: 'Deals pipeline, lead qualification & customer comms',
    icon: TrendingUp,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    role: 'Sales Manager',
    username: 'manager',
    desc: 'Team performance, reports analytics & forecasting',
    icon: Briefcase,
    color: 'from-purple-600 to-indigo-600',
  },
  {
    role: 'Support User',
    username: 'support',
    desc: 'Customer accounts, tasks, communications & docs',
    icon: Headphones,
    color: 'from-amber-600 to-orange-600',
  },
];

export function LoginPage() {
  const { login } = useAuth();
  const { theme, addToast } = useCrm();
  const navigate = useNavigate();

  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      addToast({ title: 'Welcome Back', description: `Authenticated as ${username}`, variant: 'success' });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid credentials. Please test using the 1-click persona options.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoUsername: string) => {
    setLoading(true);
    try {
      await login(demoUsername, 'password123');
      addToast({
        title: 'Instant Demo Login',
        description: `Logged in as ${demoUsername} with authentic persona permissions`,
        variant: 'success',
      });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Unable to load demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 ${
      theme === 'dark' ? 'bg-[#080d19]' : 'bg-[#f8fafc]'
    }`}>
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-2xl overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr]">
        {/* Left: Interactive Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                CodeX <span className="text-blue-500">CRM</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in to Workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter credentials or select a persona on the right for instant access.
            </p>

            <form onSubmit={handleManualLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Username or Email
                </label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin, sales, manager..."
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs rounded-xl pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-500/25 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-xs text-slate-500 flex items-center justify-between">
            <span>New customer organization?</span>
            <Link to="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create account →
            </Link>
          </div>
        </div>

        {/* Right: Instant 1-Click Persona Chooser */}
        <div className="p-8 sm:p-10 bg-slate-50/80 dark:bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-white/[0.06] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Instant Demo Access
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Click any persona card below to immediately enter the CRM with customized role permissions:
            </p>

            <div className="space-y-3">
              {demoRolesList.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.username}
                    onClick={() => handleQuickDemoLogin(item.username)}
                    className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.07] hover:border-blue-500/60 hover:shadow-md transition text-left group flex items-start gap-3.5"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {item.role}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-500 transition">
                          Login →
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400">
            Enterprise RBAC • SOC2 Certified Architecture
          </div>
        </div>
      </div>
    </div>
  );
}
