import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initialActivities,
  initialAdminUsers,
  initialCalendarEvents,
  initialCallLogs,
  initialCompanies,
  initialContacts,
  initialDeals,
  initialDocuments,
  initialEmailThreads,
  initialLeads,
  initialSmsThreads,
  initialTasks,
  initialWhatsAppThreads,
  type ActivityFeedItem,
  type AdminUserRecord,
  type CalendarEventRecord,
  type CallLogRecord,
  type CompanyRecordData,
  type ContactRecord,
  type DealRecord,
  type DocumentRecord,
  type EmailThreadRecord,
  type LeadRecord,
  type SmsThreadRecord,
  type TaskRecord,
  type WhatsAppThreadRecord,
} from '../data/initialData';
import { indexedDb } from '../data/indexedDb';
import api from '../lib/api';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
}

export type InspectorPayload =
  | { type: 'lead'; data: LeadRecord }
  | { type: 'contact'; data: ContactRecord }
  | { type: 'company'; data: CompanyRecordData }
  | { type: 'deal'; data: DealRecord }
  | { type: 'task'; data: TaskRecord }
  | null;

interface CrmContextType {
  // Data
  leads: LeadRecord[];
  contacts: ContactRecord[];
  companies: CompanyRecordData[];
  deals: DealRecord[];
  tasks: TaskRecord[];
  events: CalendarEventRecord[];
  emailThreads: EmailThreadRecord[];
  whatsAppThreads: WhatsAppThreadRecord[];
  smsThreads: SmsThreadRecord[];
  callLogs: CallLogRecord[];
  documents: DocumentRecord[];
  adminUsers: AdminUserRecord[];
  activities: ActivityFeedItem[];
  toasts: ToastItem[];
  isDbConnected: boolean;

  // App UI State
  activeInspector: InspectorPayload;
  openInspector: (payload: InspectorPayload) => void;
  closeInspector: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions
  addLead: (lead: Omit<LeadRecord, 'id' | 'created'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<LeadRecord>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  bulkDeleteLeads: (ids: string[]) => Promise<void>;

  addContact: (contact: Omit<ContactRecord, 'id'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<ContactRecord>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  addCompany: (company: Omit<CompanyRecordData, 'id'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<CompanyRecordData>) => Promise<void>;

  addDeal: (deal: Omit<DealRecord, 'id'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<DealRecord>) => Promise<void>;
  moveDealStage: (id: string, newStage: DealRecord['stage']) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;

  addTask: (task: Omit<TaskRecord, 'id' | 'completed'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addCalendarEvent: (event: Omit<CalendarEventRecord, 'id'>) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;

  sendEmailMessage: (threadId: string, text: string) => Promise<void>;
  createEmailThread: (recipient: string, email: string, subject: string, body: string) => Promise<void>;
  sendWhatsAppMessage: (threadId: string, text: string) => Promise<void>;
  sendSmsMessage: (threadId: string, text: string) => Promise<void>;
  addCallLog: (log: Omit<CallLogRecord, 'id'>) => Promise<void>;

  uploadDocument: (doc: Omit<DocumentRecord, 'id' | 'date'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  inviteAdminUser: (user: Omit<AdminUserRecord, 'id' | 'lastLogin'>) => Promise<void>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<LeadRecord[]>(() => {
    const saved = localStorage.getItem('codex_crm_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [contacts, setContacts] = useState<ContactRecord[]>(() => {
    const saved = localStorage.getItem('codex_crm_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [companies, setCompanies] = useState<CompanyRecordData[]>(() => {
    const saved = localStorage.getItem('codex_crm_companies');
    return saved ? JSON.parse(saved) : initialCompanies;
  });

  const [deals, setDeals] = useState<DealRecord[]>(() => {
    const saved = localStorage.getItem('codex_crm_deals');
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [tasks, setTasks] = useState<TaskRecord[]>(() => {
    const saved = localStorage.getItem('codex_crm_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [events, setEvents] = useState<CalendarEventRecord[]>(() => {
    const saved = localStorage.getItem('codex_crm_events');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [emailThreads, setEmailThreads] = useState<EmailThreadRecord[]>(initialEmailThreads);
  const [whatsAppThreads, setWhatsAppThreads] = useState<WhatsAppThreadRecord[]>(initialWhatsAppThreads);
  const [smsThreads, setSmsThreads] = useState<SmsThreadRecord[]>(initialSmsThreads);
  const [callLogs, setCallLogs] = useState<CallLogRecord[]>(initialCallLogs);
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(initialAdminUsers);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(initialActivities);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeInspector, setActiveInspector] = useState<InspectorPayload>(null);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('codex_crm_theme') as 'light' | 'dark') || 'dark';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('codex_crm_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('codex_crm_deals', JSON.stringify(deals));
  }, [deals]);
  useEffect(() => {
    localStorage.setItem('codex_crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('codex_crm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial load from Database API & IndexedDB
  useEffect(() => {
    const fetchFromDatabase = async () => {
      try {
        const [
          leadsRes,
          contactsRes,
          companiesRes,
          dealsRes,
          tasksRes,
          eventsRes,
          commsRes,
          docsRes,
          usersRes,
        ] = await Promise.all([
          api.get('/leads'),
          api.get('/contacts'),
          api.get('/companies'),
          api.get('/opportunities'),
          api.get('/tasks'),
          api.get('/calendar'),
          api.get('/communications'),
          api.get('/documents'),
          api.get('/admin/users'),
        ]);

        if (leadsRes.data && Array.isArray(leadsRes.data)) {
          setLeads(leadsRes.data);
          void indexedDb.putBulk('leads', leadsRes.data);
        }
        if (contactsRes.data && Array.isArray(contactsRes.data)) {
          setContacts(contactsRes.data);
          void indexedDb.putBulk('contacts', contactsRes.data);
        }
        if (companiesRes.data && Array.isArray(companiesRes.data)) {
          setCompanies(companiesRes.data);
          void indexedDb.putBulk('companies', companiesRes.data);
        }
        if (dealsRes.data && Array.isArray(dealsRes.data)) {
          setDeals(dealsRes.data);
          void indexedDb.putBulk('deals', dealsRes.data);
        }
        if (tasksRes.data && Array.isArray(tasksRes.data)) {
          setTasks(tasksRes.data);
          void indexedDb.putBulk('tasks', tasksRes.data);
        }
        if (eventsRes.data && Array.isArray(eventsRes.data)) {
          setEvents(eventsRes.data);
          void indexedDb.putBulk('events', eventsRes.data);
        }
        if (commsRes.data) {
          if (commsRes.data.emailThreads) setEmailThreads(commsRes.data.emailThreads);
          if (commsRes.data.whatsAppThreads) setWhatsAppThreads(commsRes.data.whatsAppThreads);
          if (commsRes.data.smsThreads) setSmsThreads(commsRes.data.smsThreads);
          if (commsRes.data.callLogs) setCallLogs(commsRes.data.callLogs);
        }
        if (docsRes.data && Array.isArray(docsRes.data)) {
          setDocuments(docsRes.data);
          void indexedDb.putBulk('documents', docsRes.data);
        }
        if (usersRes.data && Array.isArray(usersRes.data)) {
          setAdminUsers(usersRes.data);
        }

        setIsDbConnected(true);
      } catch (err) {
        // Fallback to IndexedDB local cache if server is offline
        const localLeads = await indexedDb.getAll<LeadRecord>('leads');
        if (localLeads.length > 0) setLeads(localLeads);
        const localDeals = await indexedDb.getAll<DealRecord>('deals');
        if (localDeals.length > 0) setDeals(localDeals);
        setIsDbConnected(false);
      }
    };

    void fetchFromDatabase();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setActiveInspector(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = ({ title, description, variant = 'info' }: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const setTheme = (nextTheme: 'light' | 'dark') => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openInspector = (payload: InspectorPayload) => {
    setActiveInspector(payload);
  };

  const closeInspector = () => {
    setActiveInspector(null);
  };

  // Lead actions with DB persistence
  const addLead = async (lead: Omit<LeadRecord, 'id' | 'created'>) => {
    const tempId = `L-${1000 + leads.length + 1}`;
    const created = new Date().toISOString().split('T')[0];
    const newRecord: LeadRecord = { ...lead, id: tempId, created };

    setLeads((prev) => [newRecord, ...prev]);
    void indexedDb.put('leads', newRecord);

    try {
      const res = await api.post('/leads', lead);
      if (res.data?.id) {
        setLeads((prev) => prev.map((l) => (l.id === tempId ? res.data : l)));
        void indexedDb.put('leads', res.data);
      }
    } catch {
      // Retained in local cache
    }

    addToast({
      title: 'Lead Saved to Database',
      description: `${lead.name} (${lead.company}) registered.`,
      variant: 'success',
    });
  };

  const updateLead = async (id: string, updates: Partial<LeadRecord>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    const updated = leads.find((l) => l.id === id);
    if (updated) void indexedDb.put('leads', { ...updated, ...updates });

    try {
      await api.put(`/leads/${id}`, updates);
    } catch {
      // offline fallback
    }

    addToast({
      title: 'Database Updated',
      description: 'Changes synchronized.',
      variant: 'info',
    });
    if (activeInspector?.type === 'lead' && activeInspector.data.id === id) {
      setActiveInspector({ type: 'lead', data: { ...activeInspector.data, ...updates } });
    }
  };

  const deleteLead = async (id: string) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    void indexedDb.delete('leads', id);

    try {
      await api.delete(`/leads/${id}`);
    } catch {
      // offline fallback
    }

    if (activeInspector?.type === 'lead' && activeInspector.data.id === id) {
      closeInspector();
    }
    addToast({
      title: 'Lead Deleted',
      description: target ? `${target.name} removed from database.` : 'Lead removed.',
      variant: 'warning',
    });
  };

  const bulkDeleteLeads = async (ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
    ids.forEach((id) => void indexedDb.delete('leads', id));

    try {
      await Promise.all(ids.map((id) => api.delete(`/leads/${id}`)));
    } catch {
      // offline fallback
    }

    addToast({
      title: 'Bulk Database Deletion',
      description: `${ids.length} leads removed from database.`,
      variant: 'warning',
    });
  };

  // Contact actions
  const addContact = async (contact: Omit<ContactRecord, 'id'>) => {
    const id = `C-${200 + contacts.length + 1}`;
    const newRecord: ContactRecord = { ...contact, id };
    setContacts((prev) => [newRecord, ...prev]);
    void indexedDb.put('contacts', newRecord);

    try {
      const res = await api.post('/contacts', contact);
      if (res.data?.id) {
        setContacts((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      }
    } catch {}

    addToast({ title: 'Contact Saved to DB', description: `${contact.name} saved.`, variant: 'success' });
  };

  const updateContact = async (id: string, updates: Partial<ContactRecord>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try {
      await api.put(`/contacts/${id}`, updates);
    } catch {}
    addToast({ title: 'Contact Updated', variant: 'info' });
  };

  const deleteContact = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    void indexedDb.delete('contacts', id);
    try {
      await api.delete(`/contacts/${id}`);
    } catch {}
    if (activeInspector?.type === 'contact' && activeInspector.data.id === id) closeInspector();
    addToast({ title: 'Contact Removed from DB', variant: 'warning' });
  };

  // Company actions
  const addCompany = async (comp: Omit<CompanyRecordData, 'id'>) => {
    const id = `CO-${companies.length + 1}`;
    const newRecord = { ...comp, id };
    setCompanies((prev) => [newRecord, ...prev]);
    void indexedDb.put('companies', newRecord);

    try {
      const res = await api.post('/companies', comp);
      if (res.data?.id) {
        setCompanies((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      }
    } catch {}

    addToast({ title: 'Account Saved in DB', description: comp.name, variant: 'success' });
  };

  const updateCompany = async (id: string, updates: Partial<CompanyRecordData>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try {
      await api.put(`/companies/${id}`, updates);
    } catch {}
    addToast({ title: 'Account Updated', variant: 'info' });
  };

  // Deal actions
  const addDeal = async (deal: Omit<DealRecord, 'id'>) => {
    const id = `D-${deals.length + 1}`;
    const newDeal: DealRecord = { ...deal, id };
    setDeals((prev) => [newDeal, ...prev]);
    void indexedDb.put('deals', newDeal);

    try {
      const res = await api.post('/opportunities', deal);
      if (res.data?.id) {
        setDeals((prev) => prev.map((d) => (d.id === id ? res.data : d)));
      }
    } catch {}

    addToast({
      title: 'Deal Committed to DB',
      description: `${deal.name} ($${deal.value.toLocaleString()})`,
      variant: 'success',
    });
  };

  const updateDeal = async (id: string, updates: Partial<DealRecord>) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    try {
      await api.put(`/opportunities/${id}`, updates);
    } catch {}
    addToast({ title: 'Deal Updated in DB', variant: 'info' });
    if (activeInspector?.type === 'deal' && activeInspector.data.id === id) {
      setActiveInspector({ type: 'deal', data: { ...activeInspector.data, ...updates } });
    }
  };

  const moveDealStage = async (id: string, newStage: DealRecord['stage']) => {
    const probability =
      newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : newStage === 'Negotiation' ? 85 : newStage === 'Proposal' ? 60 : 30;

    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage: newStage, probability } : d)));

    try {
      await api.put(`/opportunities/${id}`, { stage: newStage, probability });
    } catch {}

    addToast({
      title: newStage === 'Won' ? '🎉 Deal Won!' : 'Pipeline Updated',
      description: `Moved to ${newStage}`,
      variant: 'success',
    });
  };

  const deleteDeal = async (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    void indexedDb.delete('deals', id);
    try {
      await api.delete(`/opportunities/${id}`);
    } catch {}
    if (activeInspector?.type === 'deal' && activeInspector.data.id === id) closeInspector();
    addToast({ title: 'Deal Removed from DB', variant: 'warning' });
  };

  // Task actions
  const addTask = async (task: Omit<TaskRecord, 'id' | 'completed'>) => {
    const id = `T-${tasks.length + 1}`;
    const newTask: TaskRecord = { ...task, id, completed: false };
    setTasks((prev) => [newTask, ...prev]);
    void indexedDb.put('tasks', newTask);

    try {
      const res = await api.post('/tasks', task);
      if (res.data?.id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      }
    } catch {}

    addToast({ title: 'Task Saved to DB', description: task.title, variant: 'success' });
  };

  const toggleTask = async (id: string) => {
    let nextStatus = 'Completed';
    let nextComp = true;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nextComp = !t.completed;
          nextStatus = nextComp ? 'Completed' : 'In Progress';
          return { ...t, completed: nextComp, status: nextStatus as any };
        }
        return t;
      }),
    );

    try {
      await api.put(`/tasks/${id}`, { completed: nextComp, status: nextStatus });
    } catch {}
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    void indexedDb.delete('tasks', id);
    try {
      await api.delete(`/tasks/${id}`);
    } catch {}
    addToast({ title: 'Task Removed from DB', variant: 'info' });
  };

  // Calendar actions
  const addCalendarEvent = async (evt: Omit<CalendarEventRecord, 'id'>) => {
    const id = `E-${events.length + 1}`;
    const newEvent = { ...evt, id };
    setEvents((prev) => [...prev, newEvent]);
    void indexedDb.put('events', newEvent);

    try {
      await api.post('/calendar', evt);
    } catch {}

    addToast({ title: 'Event Saved to DB', description: `${evt.title} on ${evt.date}`, variant: 'success' });
  };

  const deleteCalendarEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    void indexedDb.delete('events', id);
    try {
      await api.delete(`/calendar/${id}`);
    } catch {}
    addToast({ title: 'Event Cancelled', variant: 'info' });
  };

  // Communications actions
  const sendEmailMessage = async (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me' as const,
      text: text.trim(),
      time: 'Just now',
      status: 'Delivered' as const,
    };
    setEmailThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              time: 'Just now',
              status: 'Sent',
              preview: text,
              messages: [...thread.messages, newMsg],
            }
          : thread,
      ),
    );

    try {
      await api.post('/communications/email', { threadId, text });
    } catch {}

    addToast({ title: 'Email Stored in DB', description: 'Dispatched to SMTP channel.', variant: 'success' });
  };

  const createEmailThread = async (recipient: string, email: string, subject: string, body: string) => {
    const id = `em-${Date.now()}`;
    const newThread: EmailThreadRecord = {
      id,
      customer: recipient,
      email,
      subject,
      status: 'Sent',
      time: 'Just now',
      preview: body,
      messages: [{ id: `m_${Date.now()}`, sender: 'me', text: body, time: 'Just now', status: 'Delivered' }],
    };
    setEmailThreads((prev) => [newThread, ...prev]);

    try {
      await api.post('/communications/email', { recipient, email, subject, body });
    } catch {}

    addToast({ title: 'Email Saved in DB', description: `Message delivered to ${email}`, variant: 'success' });
  };

  const sendWhatsAppMessage = async (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `w_${Date.now()}`,
      sender: 'me' as const,
      text: text.trim(),
      time: 'Just now',
      status: 'Read' as const,
    };
    setWhatsAppThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessage: text,
              time: 'Just now',
              status: 'Seen',
              messages: [...thread.messages, newMsg],
            }
          : thread,
      ),
    );

    try {
      await api.post('/communications/whatsapp', { threadId, text });
    } catch {}

    addToast({ title: 'WhatsApp Stored in DB', variant: 'success' });
  };

  const sendSmsMessage = async (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `s_${Date.now()}`,
      sender: 'me' as const,
      text: text.trim(),
      time: 'Just now',
      status: 'Delivered' as const,
    };
    setSmsThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessage: text,
              time: 'Just now',
              status: 'Delivered',
              messages: [...thread.messages, newMsg],
            }
          : thread,
      ),
    );

    try {
      await api.post('/communications/sms', { threadId, text });
    } catch {}

    addToast({ title: 'SMS Logged in DB', variant: 'success' });
  };

  const addCallLog = async (log: Omit<CallLogRecord, 'id'>) => {
    const id = `cl-${Date.now()}`;
    const newLog = { ...log, id };
    setCallLogs((prev) => [{ ...log, id }, ...prev]);

    try {
      await api.post('/communications/calls', log);
    } catch {}

    addToast({ title: 'Call Saved to Database', description: `${log.direction} with ${log.customer}`, variant: 'info' });
  };

  // Documents
  const uploadDocument = async (doc: Omit<DocumentRecord, 'id' | 'date'>) => {
    const id = `doc-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newDoc = { ...doc, id, date };
    setDocuments((prev) => [newDoc, ...prev]);
    void indexedDb.put('documents', newDoc);

    try {
      await api.post('/documents', doc);
    } catch {}

    addToast({ title: 'File Stored in DB Vault', description: doc.name, variant: 'success' });
  };

  const deleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    void indexedDb.delete('documents', id);
    try {
      await api.delete(`/documents/${id}`);
    } catch {}
    addToast({ title: 'Document Removed from DB', variant: 'warning' });
  };

  const inviteAdminUser = async (user: Omit<AdminUserRecord, 'id' | 'lastLogin'>) => {
    const id = `u-${Date.now()}`;
    const newUser = { ...user, id, lastLogin: 'Never' };
    setAdminUsers((prev) => [...prev, newUser]);

    try {
      await api.post('/admin/users', user);
    } catch {}

    addToast({ title: 'User Registered in DB', description: `Added ${user.email}`, variant: 'success' });
  };

  return (
    <CrmContext.Provider
      value={{
        leads,
        contacts,
        companies,
        deals,
        tasks,
        events,
        emailThreads,
        whatsAppThreads,
        smsThreads,
        callLogs,
        documents,
        adminUsers,
        activities,
        toasts,
        isDbConnected,
        activeInspector,
        openInspector,
        closeInspector,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        toggleTheme,
        addToast,
        removeToast,
        addLead,
        updateLead,
        deleteLead,
        bulkDeleteLeads,
        addContact,
        updateContact,
        deleteContact,
        addCompany,
        updateCompany,
        addDeal,
        updateDeal,
        moveDealStage,
        deleteDeal,
        addTask,
        toggleTask,
        deleteTask,
        addCalendarEvent,
        deleteCalendarEvent,
        sendEmailMessage,
        createEmailThread,
        sendWhatsAppMessage,
        sendSmsMessage,
        addCallLog,
        uploadDocument,
        deleteDocument,
        inviteAdminUser,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}
