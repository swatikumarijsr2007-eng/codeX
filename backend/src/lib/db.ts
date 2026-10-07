import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'crm-database.json');

export interface LeadEntity {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Converted' | 'Lost';
  executive: string;
  created: string;
  value: number;
  notes?: string;
}

export interface ContactEntity {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  status: 'Active' | 'Warm' | 'Inactive';
  employee: string;
  location?: string;
}

export interface CompanyEntity {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  opportunities: number;
  status: 'Active' | 'Prospect' | 'Negotiation' | 'Churn Risk';
  arr: string;
  employees: string;
  location: string;
}

export interface DealEntity {
  id: string;
  name: string;
  company: string;
  contact: string;
  value: number;
  probability: number;
  employee: string;
  closing: string;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
}

export interface TaskEntity {
  id: string;
  title: string;
  customer: string;
  owner: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Today' | 'In Progress' | 'Overdue' | 'Completed';
  completed: boolean;
}

export interface CalendarEventEntity {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Call' | 'Meeting' | 'Demo' | 'Task';
  attendees: string;
}

export interface MessageEntity {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
  status?: 'Sent' | 'Delivered' | 'Read';
}

export interface EmailThreadEntity {
  id: string;
  customer: string;
  email: string;
  subject: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Replied';
  time: string;
  preview: string;
  messages: MessageEntity[];
}

export interface WhatsAppThreadEntity {
  id: string;
  customer: string;
  phone: string;
  lastMessage: string;
  status: 'Delivered' | 'Seen';
  time: string;
  messages: MessageEntity[];
}

export interface SmsThreadEntity {
  id: string;
  customer: string;
  phone: string;
  lastMessage: string;
  status: 'Sent' | 'Delivered';
  time: string;
  messages: MessageEntity[];
}

export interface CallLogEntity {
  id: string;
  customer: string;
  phone: string;
  direction: 'Incoming' | 'Outgoing';
  status: 'Completed' | 'Missed' | 'Voicemail';
  duration: string;
  recording: 'Saved' | 'None';
  date: string;
}

export interface DocumentEntity {
  id: string;
  name: string;
  customer: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'KEY';
  uploadedBy: string;
  date: string;
  size: string;
}

export interface UserEntity {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SALES_EXECUTIVE' | 'SUPPORT_USER';
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
}

export interface ActivityEntity {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: string;
  user: string;
}

export interface DatabaseSchema {
  leads: LeadEntity[];
  contacts: ContactEntity[];
  companies: CompanyEntity[];
  deals: DealEntity[];
  tasks: TaskEntity[];
  events: CalendarEventEntity[];
  emailThreads: EmailThreadEntity[];
  whatsAppThreads: WhatsAppThreadEntity[];
  smsThreads: SmsThreadEntity[];
  callLogs: CallLogEntity[];
  documents: DocumentEntity[];
  users: UserEntity[];
  activities: ActivityEntity[];
}

const DEFAULT_PASSWORD = 'password123';
const DEMO_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const SEED_DATA: DatabaseSchema = {
  leads: [
    { id: 'L-1024', name: 'Sophia Nguyen', company: 'Northstar Labs', phone: '+1 (415) 234-7715', email: 'sophia@northstarlabs.ai', source: 'Website', status: 'Qualified', executive: 'Alicia James', created: '2026-10-01', value: 24000, notes: 'Looking to migrate 45 seats from legacy HubSpot.' },
    { id: 'L-1031', name: 'Daniel Rios', company: 'BluePeak Fintech', phone: '+1 (332) 447-9010', email: 'daniel@bluepeak.io', source: 'Referral', status: 'Proposal', executive: 'Marcus Lee', created: '2026-10-03', value: 18500, notes: 'Sent security compliance checklist; awaiting VP signoff.' },
    { id: 'L-1042', name: 'Priya Shah', company: 'Summit Works', phone: '+44 20 7946 0219', email: 'priya@summitworks.co', source: 'Outbound', status: 'Contacted', executive: 'Alicia James', created: '2026-10-04', value: 31000, notes: 'Discovery call completed. Interested in automated pipeline triggers.' },
    { id: 'L-1049', name: 'Ethan Brooks', company: 'Ora Systems', phone: '+1 (646) 888-2201', email: 'ethan@orasystems.com', source: 'Event', status: 'Converted', executive: 'Nina Patel', created: '2026-09-27', value: 14800, notes: 'Signed 12-month enterprise tier during TechWeek summit.' },
    { id: 'L-1055', name: 'Elena Rostova', company: 'Crestline Bio', phone: '+1 (650) 412-8890', email: 'elena@crestlinebio.com', source: 'LinkedIn', status: 'New', executive: 'Marcus Lee', created: '2026-10-05', value: 42000, notes: 'Enterprise inbound for 80-member clinical operations team.' },
  ],
  contacts: [
    { id: 'C-201', name: 'Sophia Nguyen', company: 'Northstar Labs', email: 'sophia@northstarlabs.ai', phone: '+1 (415) 234-7715', position: 'VP of Operations', status: 'Active', employee: 'Alicia James', location: 'San Francisco, CA' },
    { id: 'C-205', name: 'Daniel Rios', company: 'BluePeak Fintech', email: 'daniel@bluepeak.io', phone: '+1 (332) 447-9010', position: 'Head of Growth', status: 'Warm', employee: 'Marcus Lee', location: 'New York, NY' },
    { id: 'C-219', name: 'Priya Shah', company: 'Summit Works', email: 'priya@summitworks.co', phone: '+44 20 7946 0219', position: 'Chief Operating Officer', status: 'Active', employee: 'Alicia James', location: 'London, UK' },
    { id: 'C-228', name: 'Ethan Brooks', company: 'Ora Systems', email: 'ethan@orasystems.com', phone: '+1 (646) 888-2201', position: 'Director of Technology', status: 'Active', employee: 'Nina Patel', location: 'Austin, TX' },
  ],
  companies: [
    { id: 'CO-1', name: 'Northstar Labs', industry: 'Applied AI & ML', contactPerson: 'Sophia Nguyen', email: 'sophia@northstarlabs.ai', phone: '+1 (415) 234-7715', opportunities: 4, status: 'Active', arr: '$180,000', employees: '120-250', location: 'San Francisco, CA' },
    { id: 'CO-2', name: 'BluePeak Fintech', industry: 'Fintech & Payments', contactPerson: 'Daniel Rios', email: 'daniel@bluepeak.io', phone: '+1 (332) 447-9010', opportunities: 2, status: 'Negotiation', arr: '$94,000', employees: '50-100', location: 'New York, NY' },
    { id: 'CO-3', name: 'Summit Works', industry: 'Strategy Consulting', contactPerson: 'Priya Shah', email: 'priya@summitworks.co', phone: '+44 20 7946 0219', opportunities: 3, status: 'Prospect', arr: '$240,000', employees: '300-500', location: 'London, UK' },
  ],
  deals: [
    { id: 'D-1', name: 'Northstar Expansion Tier', company: 'Northstar Labs', contact: 'Sophia Nguyen', value: 24000, probability: 72, employee: 'Alicia James', closing: '2026-11-10', stage: 'Qualified' },
    { id: 'D-2', name: 'BluePeak Annual Renewal', company: 'BluePeak Fintech', contact: 'Daniel Rios', value: 18500, probability: 64, employee: 'Marcus Lee', closing: '2026-11-22', stage: 'Proposal' },
    { id: 'D-3', name: 'Summit Enterprise Integration', company: 'Summit Works', contact: 'Priya Shah', value: 31000, probability: 88, employee: 'Nina Patel', closing: '2026-12-02', stage: 'Negotiation' },
    { id: 'D-4', name: 'Ora Pilot Onboarding', company: 'Ora Systems', contact: 'Ethan Brooks', value: 14800, probability: 100, employee: 'Alicia James', closing: '2026-10-20', stage: 'Won' },
  ],
  tasks: [
    { id: 'T-1', title: 'Prepare custom proposal deck for Q4 rollout', customer: 'Northstar Labs', owner: 'Alicia James', dueDate: '2026-10-08', priority: 'High', status: 'In Progress', completed: false },
    { id: 'T-2', title: 'Follow up on MSA redlines with Legal', customer: 'BluePeak Fintech', owner: 'Marcus Lee', dueDate: '2026-10-09', priority: 'Medium', status: 'Today', completed: false },
    { id: 'T-3', title: 'Contract pricing approval from finance', customer: 'Summit Works', owner: 'Nina Patel', dueDate: '2026-10-06', priority: 'High', status: 'Overdue', completed: false },
    { id: 'T-4', title: 'Complete SSO & SAML onboarding checklist', customer: 'Ora Systems', owner: 'Alicia James', dueDate: '2026-10-11', priority: 'Low', status: 'Completed', completed: true },
  ],
  events: [
    { id: 'E-1', title: 'Northstar Discovery & Architecture Call', date: '2026-10-09', time: '10:00 AM', type: 'Call', attendees: 'Sophia Nguyen, Alicia James' },
    { id: 'E-2', title: 'BluePeak Executive Proposal Review', date: '2026-10-12', time: '02:30 PM', type: 'Meeting', attendees: 'Daniel Rios, Marcus Lee' },
    { id: 'E-3', title: 'Summit Works Contract Follow-up', date: '2026-10-14', time: '11:15 AM', type: 'Task', attendees: 'Priya Shah, Nina Patel' },
  ],
  emailThreads: [
    {
      id: 'em-1',
      customer: 'Sophia Nguyen',
      email: 'sophia@northstarlabs.ai',
      subject: 'Proposal follow-up and security addendum',
      status: 'Sent',
      time: '25 mins ago',
      preview: 'Hi Sophia, attached is the revised proposal and pricing tier...',
      messages: [
        { id: 'm1', sender: 'me', text: 'Hi Sophia, following up from our Tuesday demo. Here is the revised proposal with the custom volume tier included.', time: 'Oct 05, 09:30 AM', status: 'Delivered' },
        { id: 'm2', sender: 'them', text: 'Thanks Alicia! We shared this with our VP of Engineering.', time: 'Oct 06, 02:15 PM' },
      ],
    },
  ],
  whatsAppThreads: [
    {
      id: 'wa-1',
      customer: 'Sophia Nguyen',
      phone: '+1 (415) 234-7715',
      lastMessage: 'Let’s sync next Tuesday at 2 PM PST.',
      status: 'Seen',
      time: '12 mins ago',
      messages: [
        { id: 'w1', sender: 'them', text: 'Hi! I’ve reviewed the slide deck. Team gave green light.', time: '11:15 AM' },
        { id: 'w2', sender: 'me', text: 'Fantastic news Sophia! Should we lock in the final contract walk-through?', time: '11:20 AM', status: 'Read' },
      ],
    },
  ],
  smsThreads: [
    {
      id: 'sms-1',
      customer: 'Priya Shah',
      phone: '+44 20 7946 0219',
      lastMessage: 'Reminder: 15-minute executive briefing tomorrow at 3 PM GMT.',
      status: 'Delivered',
      time: 'Yesterday',
      messages: [
        { id: 's1', sender: 'me', text: 'Reminder: 15-minute executive briefing tomorrow at 3 PM GMT.', time: 'Yesterday, 03:00 PM', status: 'Delivered' },
      ],
    },
  ],
  callLogs: [
    { id: 'cl-1', customer: 'Sophia Nguyen', phone: '+1 (415) 234-7715', direction: 'Outgoing', status: 'Completed', duration: '14:32', recording: 'Saved', date: 'Today, 11:30 AM' },
    { id: 'cl-2', customer: 'Daniel Rios', phone: '+1 (332) 447-9010', direction: 'Incoming', status: 'Completed', duration: '08:15', recording: 'Saved', date: 'Today, 09:15 AM' },
  ],
  documents: [
    { id: 'doc-1', name: 'northstar-expansion-proposal-v3.pdf', customer: 'Northstar Labs', type: 'PDF', uploadedBy: 'Alicia James', date: '2026-10-04', size: '2.4 MB' },
    { id: 'doc-2', name: 'bluepeak-master-services-agreement.docx', customer: 'BluePeak Fintech', type: 'DOCX', uploadedBy: 'Marcus Lee', date: '2026-10-06', size: '840 KB' },
  ],
  users: [
    { id: 'u-1', username: 'superadmin', name: 'Sophia Sterling', email: 'superadmin@codexcrm.local', passwordHash: DEMO_PASSWORD_HASH, role: 'SUPER_ADMIN', status: 'Active', lastLogin: 'Just now' },
    { id: 'u-2', username: 'admin', name: 'Alicia James', email: 'admin@codexcrm.local', passwordHash: DEMO_PASSWORD_HASH, role: 'ADMIN', status: 'Active', lastLogin: 'Today, 09:18' },
    { id: 'u-3', username: 'manager', name: 'Marcus Lee', email: 'manager@codexcrm.local', passwordHash: DEMO_PASSWORD_HASH, role: 'MANAGER', status: 'Active', lastLogin: 'Today, 08:55' },
    { id: 'u-4', username: 'sales', name: 'Nina Patel', email: 'sales@codexcrm.local', passwordHash: DEMO_PASSWORD_HASH, role: 'SALES_EXECUTIVE', status: 'Active', lastLogin: 'Yesterday, 18:22' },
    { id: 'u-5', username: 'support', name: 'Ethan Brooks', email: 'support@codexcrm.local', passwordHash: DEMO_PASSWORD_HASH, role: 'SUPPORT_USER', status: 'Active', lastLogin: 'Yesterday, 11:05' },
  ],
  activities: [
    { id: 'act-1', title: 'Deal moved to Negotiation', detail: 'Summit Enterprise Integration ($31,000) reached 88% probability', time: '14 mins ago', type: 'deal', user: 'Nina Patel' },
    { id: 'act-2', title: 'New lead qualified', detail: 'Sophia Nguyen from Northstar Labs ($24k potential ARR)', time: '38 mins ago', type: 'lead', user: 'Alicia James' },
  ],
};

class DatabaseManager {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[Database] Failed to read existing database file, re-initializing seed:', err);
    }

    // Save default seed data to disk
    this.persistSync(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  private persistSync(data: DatabaseSchema) {
    try {
      this.ensureDataDirectory();
      const tmp = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (err) {
      console.error('[Database] Sync persist failed:', err);
    }
  }

  private scheduleSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistSync(this.data);
      this.saveTimeout = null;
    }, 100);
  }

  // Leads CRUD
  public getLeads(): LeadEntity[] {
    return this.data.leads;
  }

  public getLeadById(id: string): LeadEntity | undefined {
    return this.data.leads.find((l) => l.id === id);
  }

  public createLead(leadData: Omit<LeadEntity, 'id' | 'created'>): LeadEntity {
    const id = `L-${1000 + this.data.leads.length + 1}`;
    const created = new Date().toISOString().split('T')[0];
    const newLead: LeadEntity = { ...leadData, id, created };
    this.data.leads = [newLead, ...this.data.leads];

    this.createActivity({
      title: 'New Lead Created',
      detail: `${newLead.name} (${newLead.company}) added to database.`,
      time: 'Just now',
      type: 'lead',
      user: newLead.executive || 'System',
    });

    this.scheduleSave();
    return newLead;
  }

  public updateLead(id: string, updates: Partial<LeadEntity>): LeadEntity | null {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.data.leads[idx] = { ...this.data.leads[idx], ...updates };
    this.scheduleSave();
    return this.data.leads[idx];
  }

  public deleteLead(id: string): boolean {
    const initialLen = this.data.leads.length;
    this.data.leads = this.data.leads.filter((l) => l.id !== id);
    if (this.data.leads.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Contacts CRUD
  public getContacts(): ContactEntity[] {
    return this.data.contacts;
  }

  public createContact(contactData: Omit<ContactEntity, 'id'>): ContactEntity {
    const id = `C-${200 + this.data.contacts.length + 1}`;
    const newContact: ContactEntity = { ...contactData, id };
    this.data.contacts = [newContact, ...this.data.contacts];
    this.scheduleSave();
    return newContact;
  }

  public updateContact(id: string, updates: Partial<ContactEntity>): ContactEntity | null {
    const idx = this.data.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.contacts[idx] = { ...this.data.contacts[idx], ...updates };
    this.scheduleSave();
    return this.data.contacts[idx];
  }

  public deleteContact(id: string): boolean {
    const initialLen = this.data.contacts.length;
    this.data.contacts = this.data.contacts.filter((c) => c.id !== id);
    if (this.data.contacts.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Companies CRUD
  public getCompanies(): CompanyEntity[] {
    return this.data.companies;
  }

  public createCompany(companyData: Omit<CompanyEntity, 'id'>): CompanyEntity {
    const id = `CO-${this.data.companies.length + 1}`;
    const newCompany: CompanyEntity = { ...companyData, id };
    this.data.companies = [newCompany, ...this.data.companies];
    this.scheduleSave();
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<CompanyEntity>): CompanyEntity | null {
    const idx = this.data.companies.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.companies[idx] = { ...this.data.companies[idx], ...updates };
    this.scheduleSave();
    return this.data.companies[idx];
  }

  // Deals (Opportunities) CRUD
  public getDeals(): DealEntity[] {
    return this.data.deals;
  }

  public createDeal(dealData: Omit<DealEntity, 'id'>): DealEntity {
    const id = `D-${this.data.deals.length + 1}`;
    const newDeal: DealEntity = { ...dealData, id };
    this.data.deals = [newDeal, ...this.data.deals];

    this.createActivity({
      title: 'Deal Created in Database',
      detail: `${newDeal.name} ($${newDeal.value.toLocaleString()}) entered pipeline stage ${newDeal.stage}.`,
      time: 'Just now',
      type: 'deal',
      user: newDeal.employee || 'System',
    });

    this.scheduleSave();
    return newDeal;
  }

  public updateDeal(id: string, updates: Partial<DealEntity>): DealEntity | null {
    const idx = this.data.deals.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.deals[idx] = { ...this.data.deals[idx], ...updates };
    this.scheduleSave();
    return this.data.deals[idx];
  }

  public deleteDeal(id: string): boolean {
    const initialLen = this.data.deals.length;
    this.data.deals = this.data.deals.filter((d) => d.id !== id);
    if (this.data.deals.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Tasks CRUD
  public getTasks(): TaskEntity[] {
    return this.data.tasks;
  }

  public createTask(taskData: Omit<TaskEntity, 'id' | 'completed'>): TaskEntity {
    const id = `T-${this.data.tasks.length + 1}`;
    const newTask: TaskEntity = { ...taskData, id, completed: false };
    this.data.tasks = [newTask, ...this.data.tasks];
    this.scheduleSave();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<TaskEntity>): TaskEntity | null {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates };
    this.scheduleSave();
    return this.data.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);
    if (this.data.tasks.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Calendar CRUD
  public getEvents(): CalendarEventEntity[] {
    return this.data.events;
  }

  public createEvent(eventData: Omit<CalendarEventEntity, 'id'>): CalendarEventEntity {
    const id = `E-${this.data.events.length + 1}`;
    const newEvent: CalendarEventEntity = { ...eventData, id };
    this.data.events = [...this.data.events, newEvent];
    this.scheduleSave();
    return newEvent;
  }

  public deleteEvent(id: string): boolean {
    const initialLen = this.data.events.length;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    if (this.data.events.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Communications CRUD
  public getCommunications() {
    return {
      emailThreads: this.data.emailThreads,
      whatsAppThreads: this.data.whatsAppThreads,
      smsThreads: this.data.smsThreads,
      callLogs: this.data.callLogs,
    };
  }

  public addEmailMessage(threadId: string, text: string): EmailThreadEntity | null {
    const thread = this.data.emailThreads.find((t) => t.id === threadId);
    if (!thread) return null;
    const msg: MessageEntity = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text,
      time: 'Just now',
      status: 'Delivered',
    };
    thread.messages.push(msg);
    thread.preview = text;
    thread.time = 'Just now';
    this.scheduleSave();
    return thread;
  }

  public createEmailThread(recipient: string, email: string, subject: string, body: string): EmailThreadEntity {
    const id = `em-${Date.now()}`;
    const newThread: EmailThreadEntity = {
      id,
      customer: recipient,
      email,
      subject,
      status: 'Sent',
      time: 'Just now',
      preview: body,
      messages: [{ id: `m_${Date.now()}`, sender: 'me', text: body, time: 'Just now', status: 'Delivered' }],
    };
    this.data.emailThreads = [newThread, ...this.data.emailThreads];
    this.scheduleSave();
    return newThread;
  }

  public addWhatsAppMessage(threadId: string, text: string): WhatsAppThreadEntity | null {
    const thread = this.data.whatsAppThreads.find((t) => t.id === threadId);
    if (!thread) return null;
    const msg: MessageEntity = {
      id: `w_${Date.now()}`,
      sender: 'me',
      text,
      time: 'Just now',
      status: 'Read',
    };
    thread.messages.push(msg);
    thread.lastMessage = text;
    thread.time = 'Just now';
    this.scheduleSave();
    return thread;
  }

  public addSmsMessage(threadId: string, text: string): SmsThreadEntity | null {
    const thread = this.data.smsThreads.find((t) => t.id === threadId);
    if (!thread) return null;
    const msg: MessageEntity = {
      id: `s_${Date.now()}`,
      sender: 'me',
      text,
      time: 'Just now',
      status: 'Delivered',
    };
    thread.messages.push(msg);
    thread.lastMessage = text;
    thread.time = 'Just now';
    this.scheduleSave();
    return thread;
  }

  public addCallLog(logData: Omit<CallLogEntity, 'id'>): CallLogEntity {
    const id = `cl-${Date.now()}`;
    const newLog: CallLogEntity = { ...logData, id };
    this.data.callLogs = [newLog, ...this.data.callLogs];
    this.scheduleSave();
    return newLog;
  }

  // Documents CRUD
  public getDocuments(): DocumentEntity[] {
    return this.data.documents;
  }

  public createDocument(docData: Omit<DocumentEntity, 'id' | 'date'>): DocumentEntity {
    const id = `doc-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newDoc: DocumentEntity = { ...docData, id, date };
    this.data.documents = [newDoc, ...this.data.documents];
    this.scheduleSave();
    return newDoc;
  }

  public deleteDocument(id: string): boolean {
    const initialLen = this.data.documents.length;
    this.data.documents = this.data.documents.filter((d) => d.id !== id);
    if (this.data.documents.length !== initialLen) {
      this.scheduleSave();
      return true;
    }
    return false;
  }

  // Users & Admin
  public getUsers(): UserEntity[] {
    return this.data.users;
  }

  public getUserByEmail(email: string): UserEntity | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByUsername(username: string): UserEntity | undefined {
    const key = String(username || '').trim().toLowerCase();
    if (!key) return undefined;
    return this.data.users.find((u) => u.username.toLowerCase() === key || u.email.split('@')[0].toLowerCase() === key);
  }

  public getUserByCredentials(username: string, password: string): UserEntity | null {
    const user = this.getUserByUsername(username);
    if (!user || !user.passwordHash) return null;
    if (bcrypt.compareSync(String(password || ''), user.passwordHash)) {
      return user;
    }
    return null;
  }

  public createUser(userData: Omit<UserEntity, 'id' | 'lastLogin'>): UserEntity {
    const id = `u-${Date.now()}`;
    const newUser: UserEntity = { ...userData, id, lastLogin: 'Never' };
    this.data.users = [...this.data.users, newUser];
    this.scheduleSave();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserEntity>): UserEntity | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.scheduleSave();
    return this.data.users[idx];
  }

  // Activities
  public getActivities(): ActivityEntity[] {
    return this.data.activities;
  }

  public createActivity(activityData: Omit<ActivityEntity, 'id'>): ActivityEntity {
    const id = `act-${Date.now()}`;
    const newAct: ActivityEntity = { ...activityData, id };
    this.data.activities = [newAct, ...this.data.activities.slice(0, 49)];
    this.scheduleSave();
    return newAct;
  }

  // Dashboard Aggregates
  public getDashboardStats() {
    const totalPipeline = this.data.deals.reduce((sum, d) => sum + (d.stage !== 'Lost' ? d.value : 0), 0);
    const wonRevenue = this.data.deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);

    return {
      summary: [
        { label: 'Total leads', value: this.data.leads.length },
        { label: 'Active deals', value: this.data.deals.length },
        { label: 'Active pipeline', value: `$${totalPipeline.toLocaleString()}` },
        { label: 'Won revenue', value: `$${wonRevenue.toLocaleString()}` },
        { label: 'Total contacts', value: this.data.contacts.length },
        { label: 'Pending tasks', value: this.data.tasks.filter((t) => !t.completed).length },
      ],
      pipeline: [
        { stage: 'NEW', count: this.data.deals.filter((d) => d.stage === 'New').length },
        { stage: 'QUALIFIED', count: this.data.deals.filter((d) => d.stage === 'Qualified').length },
        { stage: 'PROPOSAL', count: this.data.deals.filter((d) => d.stage === 'Proposal').length },
        { stage: 'NEGOTIATION', count: this.data.deals.filter((d) => d.stage === 'Negotiation').length },
        { stage: 'WON', count: this.data.deals.filter((d) => d.stage === 'Won').length },
        { stage: 'LOST', count: this.data.deals.filter((d) => d.stage === 'Lost').length },
      ],
      activities: this.data.activities,
    };
  }
}

export const db = new DatabaseManager();
