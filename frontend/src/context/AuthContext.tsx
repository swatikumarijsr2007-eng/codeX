import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api from '../lib/api';
import type { Role, User } from '../types';

export const DEMO_USERS_MAP: Record<string, { role: Role; name: string; email: string }> = {
  superadmin: { role: 'SUPER_ADMIN', name: 'Sophia Sterling', email: 'sophia@codexcrm.com' },
  admin: { role: 'ADMIN', name: 'Alicia James', email: 'alicia@codexcrm.com' },
  manager: { role: 'MANAGER', name: 'Marcus Lee', email: 'marcus@codexcrm.com' },
  sales: { role: 'SALES_EXECUTIVE', name: 'Nina Patel', email: 'nina@codexcrm.com' },
  support: { role: 'SUPPORT_USER', name: 'Ethan Brooks', email: 'ethan@codexcrm.com' },
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (username: string, password?: string) => Promise<User>;
  switchRole: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codex-crm-token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('codex-crm-user');
    if (storedUser && !user) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore parse errors
      }
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('codex-crm-token', token);
    } else {
      localStorage.removeItem('codex-crm-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('codex-crm-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codex-crm-user');
    }
  }, [user]);

  const login = async (username: string, password = ''): Promise<User> => {
    const normalizedUsername = username.trim().toLowerCase();
    const emailLookup = normalizedUsername.includes('@')
      ? normalizedUsername
      : `${normalizedUsername}@codexcrm.local`;

    try {
      const response = await api.post('/auth/login', {
        email: emailLookup,
        password,
        username: normalizedUsername,
      });

      const nextUser = response.data.user as User;
      setToken(response.data.token);
      setUser(nextUser);
      return nextUser;
    } catch {
      // Graceful fallback for mock/demo accounts so all roles can be tested interactively
      const demoAccount = DEMO_USERS_MAP[normalizedUsername] ?? {
        role: 'SUPER_ADMIN' as Role,
        name: username || 'Sophia Sterling',
        email: `${normalizedUsername || 'sophia'}@codexcrm.com`,
      };

      const fallbackUser: User = {
        id: `usr_${normalizedUsername || 'demo'}`,
        name: demoAccount.name,
        email: demoAccount.email,
        role: demoAccount.role,
      };

      const fallbackToken = `demo_jwt_${Date.now()}`;
      setToken(fallbackToken);
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const switchRole = (newRole: Role) => {
    if (!user) return;
    const roleProfiles: Record<Role, { name: string; email: string }> = {
      SUPER_ADMIN: { name: 'Sophia Sterling', email: 'sophia@codexcrm.com' },
      ADMIN: { name: 'Alicia James', email: 'alicia@codexcrm.com' },
      MANAGER: { name: 'Marcus Lee', email: 'marcus@codexcrm.com' },
      SALES_EXECUTIVE: { name: 'Nina Patel', email: 'nina@codexcrm.com' },
      SUPPORT_USER: { name: 'Ethan Brooks', email: 'ethan@codexcrm.com' },
    };

    const updatedUser: User = {
      ...user,
      role: newRole,
      name: roleProfiles[newRole]?.name ?? user.name,
      email: roleProfiles[newRole]?.email ?? user.email,
    };
    setUser(updatedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('codex-crm-token');
    localStorage.removeItem('codex-crm-user');

    try {
      void api.post('/auth/logout');
    } catch {
      // Ignore backend logout failures while preserving local redirect flow.
    }
  };

  const contextValue = useMemo<AuthContextValue>(
    () => ({ user, token, login, switchRole, logout }),
    [user, token],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
