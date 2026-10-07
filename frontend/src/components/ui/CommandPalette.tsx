import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  ClipboardList,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
  ShieldCheck,
  Plus,
  Sun,
  Moon,
  ExternalLink,
  Command,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, leads, deals, contacts, openInspector, toggleTheme, theme } = useCrm();
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads Pipeline', path: '/leads', icon: Briefcase },
    { label: 'Contacts Directory', path: '/contacts', icon: Users },
    { label: 'Companies Accounts', path: '/companies', icon: Briefcase },
    { label: 'Deals & Opportunities', path: '/opportunities', icon: TrendingUp },
    { label: 'Tasks & Follow-ups', path: '/tasks', icon: ClipboardList },
    { label: 'Meetings Calendar', path: '/calendar', icon: Calendar },
    { label: 'Communications Center', path: '/communications', icon: MessageSquare },
    { label: 'Documents Repository', path: '/documents', icon: FileText },
    { label: 'Analytics Reports', path: '/reports', icon: BarChart3 },
    { label: 'Admin Security Panel', path: '/admin', icon: ShieldCheck },
  ];

  const filteredNav = useMemo(() => {
    if (!query) return navigationItems;
    return navigationItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const matchedLeads = useMemo(() => {
    if (!query || query.length < 2) return [];
    return leads
      .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.company.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
  }, [leads, query]);

  const matchedDeals = useMemo(() => {
    if (!query || query.length < 2) return [];
    return deals
      .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.company.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
  }, [deals, query]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      <div
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.1] shadow-2xl overflow-hidden z-10 animate-scale-up">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.08]">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, navigate pages, jump to leads & deals..."
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 text-xs">
          {/* Matched Records */}
          {(matchedLeads.length > 0 || matchedDeals.length > 0) && (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching Records
              </p>
              {matchedLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    openInspector({ type: 'lead', data: lead });
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-[10px]">
                      L
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{lead.name}</p>
                      <p className="text-[11px] text-slate-400">{lead.company} • {lead.status}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">View Lead →</span>
                </button>
              ))}

              {matchedDeals.map((deal) => (
                <button
                  key={deal.id}
                  onClick={() => {
                    openInspector({ type: 'deal', data: deal });
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-[10px]">
                      $
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{deal.name}</p>
                      <p className="text-[11px] text-slate-400">{deal.company} • ${deal.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">View Deal →</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Actions & Preferences
            </p>
            <button
              onClick={() => {
                toggleTheme();
                setCommandPaletteOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              <span>Toggle theme to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={() => {
                switchRole('SUPER_ADMIN');
                setCommandPaletteOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Switch persona to Super Admin (Full Privileges)</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div>
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jump To Module
            </p>
            {filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigation hint:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">⌘K</kbd>
          </div>
          <span>CodeX Intelligence</span>
        </div>
      </div>
    </div>
  );
}
