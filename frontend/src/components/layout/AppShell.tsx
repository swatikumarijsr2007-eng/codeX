import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  MessageSquareText,
  FileText,
  BarChart3,
  ShieldCheck,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Zap,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCrm } from '../../context/CrmContext';
import { ToastContainer } from '../ui/ToastContainer';
import { DetailDrawer } from '../ui/DetailDrawer';
import { CommandPalette } from '../ui/CommandPalette';
import type { Role } from '../../types';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'leads', label: 'Leads Pipeline', path: '/leads', icon: Briefcase },
  { key: 'contacts', label: 'Contacts', path: '/contacts', icon: Users },
  { key: 'companies', label: 'Companies', path: '/companies', icon: Building2 },
  { key: 'opportunities', label: 'Opportunities', path: '/opportunities', icon: TrendingUp },
  { key: 'tasks', label: 'Tasks & Follow-ups', path: '/tasks', icon: ClipboardList },
  { key: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { key: 'communications', label: 'Communications', path: '/communications', icon: MessageSquareText },
  { key: 'documents', label: 'Documents Vault', path: '/documents', icon: FileText },
  { key: 'reports', label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { key: 'admin', label: 'Admin Security', path: '/admin', icon: ShieldCheck },
];

const roleAccess: Record<Role, string[]> = {
  SUPER_ADMIN: ['dashboard', 'leads', 'contacts', 'companies', 'opportunities', 'tasks', 'calendar', 'communications', 'documents', 'reports', 'admin'],
  ADMIN: ['dashboard', 'leads', 'contacts', 'companies', 'opportunities', 'tasks', 'calendar', 'communications', 'documents', 'reports', 'admin'],
  MANAGER: ['dashboard', 'leads', 'contacts', 'companies', 'opportunities', 'tasks', 'calendar', 'communications', 'reports'],
  SALES_EXECUTIVE: ['dashboard', 'leads', 'contacts', 'companies', 'opportunities', 'tasks', 'calendar', 'communications'],
  SUPPORT_USER: ['dashboard', 'contacts', 'communications', 'documents', 'tasks'],
};

export function AppShell() {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme, setCommandPaletteOpen, searchQuery, setSearchQuery, addToast, isDbConnected } = useCrm();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'New lead qualified', detail: 'Sophia Nguyen added to sales queue', time: '4m ago', read: false },
    { id: 2, title: 'Contract update', detail: 'Northstar Labs expansion marked for signoff', time: '18m ago', read: false },
    { id: 3, title: 'Follow-up due today', detail: 'BluePeak Fintech MSA redline review', time: '1h ago', read: false },
    { id: 4, title: 'Call completed', detail: 'Outgoing 14m call logged with Daniel Rios', time: '2h ago', read: false },
  ]);

  const currentRole = user?.role || 'SUPER_ADMIN';
  const allowedNav = navItems.filter((item) => roleAccess[currentRole]?.includes(item.key));

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({ title: 'Notifications Cleared', variant: 'info' });
  };

  const handleRoleSelect = (role: Role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    addToast({
      title: 'Persona Switched',
      description: `Active role changed to ${role.replace('_', ' ')}`,
      variant: 'info',
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 border-r z-30 flex flex-col justify-between backdrop-blur-xl ${
        theme === 'dark' ? 'bg-slate-950/80 border-white/[0.07]' : 'bg-white/90 border-slate-200/90'
      }`}>
        <div>
          {/* Brand header */}
          <div className="p-4.5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  CodeX <span className="text-blue-500 font-extrabold">CRM</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">Enterprise Suite</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Modules
            </p>
            {allowedNav.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-slate-900/60 hover:border-blue-400 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Executive'}</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">{currentRole.replace('_', ' ')}</p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.1] shadow-xl z-50 space-y-1 text-xs animate-scale-up">
                <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Role Permissions
                </p>
                {(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES_EXECUTIVE', 'SUPPORT_USER'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition font-medium flex items-center justify-between ${
                      currentRole === r
                        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top App Header */}
        <header className={`sticky top-0 z-20 h-16 border-b px-6 flex items-center justify-between backdrop-blur-xl transition-colors ${
          theme === 'dark' ? 'bg-slate-950/75 border-white/[0.07]' : 'bg-white/80 border-slate-200/90'
        }`}>
          {/* Spotlight Search trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/60 dark:bg-slate-900/60 hover:border-blue-400 text-slate-400 text-xs w-full max-w-sm transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Search records, leads, commands...</span>
            <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-500 border border-slate-300/60 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.1] shadow-2xl z-50 p-3 animate-scale-up space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Activity Alerts</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notificationsList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border text-xs transition ${
                          item.read
                            ? 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-100 dark:border-white/[0.03] opacity-60'
                            : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Database live connection indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.06] text-xs">
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {isDbConnected ? 'Database Live' : 'Local DB'}
              </span>
            </div>
          </div>
        </header>

        {/* Router Outlet for Page Content */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <ToastContainer />
      <DetailDrawer />
      <CommandPalette />
    </div>
  );
}
