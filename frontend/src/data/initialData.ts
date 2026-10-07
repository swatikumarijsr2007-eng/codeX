export interface LeadRecord {
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

export interface ContactRecord {
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

export interface CompanyRecordData {
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

export interface DealRecord {
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

export interface TaskRecord {
  id: string;
  title: string;
  customer: string;
  owner: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Today' | 'In Progress' | 'Overdue' | 'Completed';
  completed: boolean;
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Call' | 'Meeting' | 'Demo' | 'Task';
  attendees: string;
}

export interface MessageBubble {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
  status?: 'Sent' | 'Delivered' | 'Read';
}

export interface EmailThreadRecord {
  id: string;
  customer: string;
  email: string;
  subject: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Replied';
  time: string;
  preview: string;
  messages: MessageBubble[];
}

export interface WhatsAppThreadRecord {
  id: string;
  customer: string;
  phone: string;
  lastMessage: string;
  status: 'Delivered' | 'Seen';
  time: string;
  messages: MessageBubble[];
}

export interface SmsThreadRecord {
  id: string;
  customer: string;
  phone: string;
  lastMessage: string;
  status: 'Sent' | 'Delivered';
  time: string;
  messages: MessageBubble[];
}

export interface CallLogRecord {
  id: string;
  customer: string;
  phone: string;
  direction: 'Incoming' | 'Outgoing';
  status: 'Completed' | 'Missed' | 'Voicemail';
  duration: string;
  recording: 'Saved' | 'None';
  date: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  customer: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'KEY';
  uploadedBy: string;
  date: string;
  size: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Sales Executive' | 'Support/User';
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
}

export interface ActivityFeedItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'lead' | 'email' | 'call' | 'deal' | 'doc';
  user: string;
}

export const initialLeads: LeadRecord[] = [
  { id: 'L-1024', name: 'Sophia Nguyen', company: 'Northstar Labs', phone: '+1 (415) 234-7715', email: 'sophia@northstarlabs.ai', source: 'Website', status: 'Qualified', executive: 'Alicia James', created: '2026-10-01', value: 24000, notes: 'Looking to migrate 45 seats from legacy HubSpot.' },
  { id: 'L-1031', name: 'Daniel Rios', company: 'BluePeak Fintech', phone: '+1 (332) 447-9010', email: 'daniel@bluepeak.io', source: 'Referral', status: 'Proposal', executive: 'Marcus Lee', created: '2026-10-03', value: 18500, notes: 'Sent security compliance checklist; awaiting VP signoff.' },
  { id: 'L-1042', name: 'Priya Shah', company: 'Summit Works', phone: '+44 20 7946 0219', email: 'priya@summitworks.co', source: 'Outbound', status: 'Contacted', executive: 'Alicia James', created: '2026-10-04', value: 31000, notes: 'Discovery call completed. Interested in automated pipeline triggers.' },
  { id: 'L-1049', name: 'Ethan Brooks', company: 'Ora Systems', phone: '+1 (646) 888-2201', email: 'ethan@orasystems.com', source: 'Event', status: 'Converted', executive: 'Nina Patel', created: '2026-09-27', value: 14800, notes: 'Signed 12-month enterprise tier during TechWeek summit.' },
  { id: 'L-1055', name: 'Elena Rostova', company: 'Crestline Bio', phone: '+1 (650) 412-8890', email: 'elena@crestlinebio.com', source: 'LinkedIn', status: 'New', executive: 'Marcus Lee', created: '2026-10-05', value: 42000, notes: 'Enterprise inbound for 80-member clinical operations team.' },
  { id: 'L-1062', name: 'Tariq Mansoor', company: 'Nexus Logistics', phone: '+971 4 390 1144', email: 'tariq@nexuslog.ae', source: 'Organic', status: 'Qualified', executive: 'Nina Patel', created: '2026-10-06', value: 28000, notes: 'Regional rollout across UAE & Saudi branches.' },
];

export const initialContacts: ContactRecord[] = [
  { id: 'C-201', name: 'Sophia Nguyen', company: 'Northstar Labs', email: 'sophia@northstarlabs.ai', phone: '+1 (415) 234-7715', position: 'VP of Operations', status: 'Active', employee: 'Alicia James', location: 'San Francisco, CA' },
  { id: 'C-205', name: 'Daniel Rios', company: 'BluePeak Fintech', email: 'daniel@bluepeak.io', phone: '+1 (332) 447-9010', position: 'Head of Growth', status: 'Warm', employee: 'Marcus Lee', location: 'New York, NY' },
  { id: 'C-219', name: 'Priya Shah', company: 'Summit Works', email: 'priya@summitworks.co', phone: '+44 20 7946 0219', position: 'Chief Operating Officer', status: 'Active', employee: 'Alicia James', location: 'London, UK' },
  { id: 'C-228', name: 'Ethan Brooks', company: 'Ora Systems', email: 'ethan@orasystems.com', phone: '+1 (646) 888-2201', position: 'Director of Technology', status: 'Active', employee: 'Nina Patel', location: 'Austin, TX' },
  { id: 'C-234', name: 'Elena Rostova', company: 'Crestline Bio', email: 'elena@crestlinebio.com', phone: '+1 (650) 412-8890', position: 'VP Business Development', status: 'Warm', employee: 'Marcus Lee', location: 'Palo Alto, CA' },
];

export const initialCompanies: CompanyRecordData[] = [
  { id: 'CO-1', name: 'Northstar Labs', industry: 'Applied AI & ML', contactPerson: 'Sophia Nguyen', email: 'sophia@northstarlabs.ai', phone: '+1 (415) 234-7715', opportunities: 4, status: 'Active', arr: '$180,000', employees: '120-250', location: 'San Francisco, CA' },
  { id: 'CO-2', name: 'BluePeak Fintech', industry: 'Fintech & Payments', contactPerson: 'Daniel Rios', email: 'daniel@bluepeak.io', phone: '+1 (332) 447-9010', opportunities: 2, status: 'Negotiation', arr: '$94,000', employees: '50-100', location: 'New York, NY' },
  { id: 'CO-3', name: 'Summit Works', industry: 'Strategy Consulting', contactPerson: 'Priya Shah', email: 'priya@summitworks.co', phone: '+44 20 7946 0219', opportunities: 3, status: 'Prospect', arr: '$240,000', employees: '300-500', location: 'London, UK' },
  { id: 'CO-4', name: 'Ora Systems', industry: 'Cloud Infrastructure', contactPerson: 'Ethan Brooks', email: 'ethan@orasystems.com', phone: '+1 (646) 888-2201', opportunities: 1, status: 'Active', arr: '$62,000', employees: '40-80', location: 'Austin, TX' },
  { id: 'CO-5', name: 'Crestline Bio', industry: 'Biotech & Pharma', contactPerson: 'Elena Rostova', email: 'elena@crestlinebio.com', phone: '+1 (650) 412-8890', opportunities: 2, status: 'Prospect', arr: '$310,000', employees: '150-300', location: 'Palo Alto, CA' },
];

export const initialDeals: DealRecord[] = [
  { id: 'D-1', name: 'Northstar Expansion Tier', company: 'Northstar Labs', contact: 'Sophia Nguyen', value: 24000, probability: 72, employee: 'Alicia James', closing: '2026-11-10', stage: 'Qualified' },
  { id: 'D-2', name: 'BluePeak Annual Renewal', company: 'BluePeak Fintech', contact: 'Daniel Rios', value: 18500, probability: 64, employee: 'Marcus Lee', closing: '2026-11-22', stage: 'Proposal' },
  { id: 'D-3', name: 'Summit Enterprise Integration', company: 'Summit Works', contact: 'Priya Shah', value: 31000, probability: 88, employee: 'Nina Patel', closing: '2026-12-02', stage: 'Negotiation' },
  { id: 'D-4', name: 'Ora Pilot Onboarding', company: 'Ora Systems', contact: 'Ethan Brooks', value: 14800, probability: 100, employee: 'Alicia James', closing: '2026-10-20', stage: 'Won' },
  { id: 'D-5', name: 'Helio Workspace Addon', company: 'Helio Labs', contact: 'Mia Chen', value: 12200, probability: 28, employee: 'Marcus Lee', closing: '2026-10-30', stage: 'New' },
  { id: 'D-6', name: 'Vertex Data Connector', company: 'Vertex Inc', contact: 'Omar Ali', value: 8900, probability: 0, employee: 'Nina Patel', closing: '2026-11-15', stage: 'Lost' },
  { id: 'D-7', name: 'Crestline Regulatory Suite', company: 'Crestline Bio', contact: 'Elena Rostova', value: 42000, probability: 45, employee: 'Marcus Lee', closing: '2026-12-15', stage: 'Qualified' },
];

export const initialTasks: TaskRecord[] = [
  { id: 'T-1', title: 'Prepare custom proposal deck for Q4 rollout', customer: 'Northstar Labs', owner: 'Alicia James', dueDate: '2026-10-08', priority: 'High', status: 'In Progress', completed: false },
  { id: 'T-2', title: 'Follow up on MSA redlines with Legal', customer: 'BluePeak Fintech', owner: 'Marcus Lee', dueDate: '2026-10-09', priority: 'Medium', status: 'Today', completed: false },
  { id: 'T-3', title: 'Contract pricing approval from finance', customer: 'Summit Works', owner: 'Nina Patel', dueDate: '2026-10-06', priority: 'High', status: 'Overdue', completed: false },
  { id: 'T-4', title: 'Complete SSO & SAML onboarding checklist', customer: 'Ora Systems', owner: 'Alicia James', dueDate: '2026-10-11', priority: 'Low', status: 'Completed', completed: true },
  { id: 'T-5', title: 'Schedule security architecture review call', customer: 'Crestline Bio', owner: 'Marcus Lee', dueDate: '2026-10-14', priority: 'High', status: 'Pending', completed: false },
];

export const initialCalendarEvents: CalendarEventRecord[] = [
  { id: 'E-1', title: 'Northstar Discovery & Architecture Call', date: '2026-10-09', time: '10:00 AM', type: 'Call', attendees: 'Sophia Nguyen, Alicia James' },
  { id: 'E-2', title: 'BluePeak Executive Proposal Review', date: '2026-10-12', time: '02:30 PM', type: 'Meeting', attendees: 'Daniel Rios, Marcus Lee' },
  { id: 'E-3', title: 'Summit Works Contract Follow-up', date: '2026-10-14', time: '11:15 AM', type: 'Task', attendees: 'Priya Shah, Nina Patel' },
  { id: 'E-4', title: 'Quarterly Revenue & Pipeline Sync', date: '2026-10-18', time: '04:00 PM', type: 'Meeting', attendees: 'Entire Sales Team' },
  { id: 'E-5', title: 'Crestline Bio Product Deep-Dive Demo', date: '2026-10-21', time: '01:00 PM', type: 'Demo', attendees: 'Elena Rostova, Marcus Lee' },
];

export const initialEmailThreads: EmailThreadRecord[] = [
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
      { id: 'm2', sender: 'them', text: 'Thanks Alicia! We shared this with our VP of Engineering. Can you confirm if SOC2 Type II report is available in the data room?', time: 'Oct 06, 02:15 PM' },
      { id: 'm3', sender: 'me', text: 'Yes, fully certified! I just granted your security team access to our trust portal.', time: 'Today, 10:45 AM', status: 'Delivered' },
    ],
  },
  {
    id: 'em-2',
    customer: 'Daniel Rios',
    email: 'daniel@bluepeak.io',
    subject: 'Welcome packet and deployment timeline',
    status: 'Delivered',
    time: '2 hrs ago',
    preview: 'Hello Daniel, we have finalized the onboarding roadmap...',
    messages: [
      { id: 'm4', sender: 'me', text: 'Hello Daniel, we have finalized the onboarding roadmap for the BluePeak workspace setup.', time: 'Yesterday, 04:00 PM', status: 'Delivered' },
      { id: 'm5', sender: 'them', text: 'Looks thorough! We will complete the API sandbox credentials by tomorrow noon.', time: 'Today, 08:30 AM' },
    ],
  },
];

export const initialWhatsAppThreads: WhatsAppThreadRecord[] = [
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
      { id: 'w3', sender: 'them', text: 'Let’s sync next Tuesday at 2 PM PST.', time: '11:22 AM' },
    ],
  },
  {
    id: 'wa-2',
    customer: 'Daniel Rios',
    phone: '+1 (332) 447-9010',
    lastMessage: 'Thanks! We are ready for the discovery call.',
    status: 'Seen',
    time: '1 hr ago',
    messages: [
      { id: 'w4', sender: 'me', text: 'Hi Daniel, just sent the invite link to your calendar.', time: '09:00 AM', status: 'Read' },
      { id: 'w5', sender: 'them', text: 'Thanks! We are ready for the discovery call.', time: '09:14 AM' },
    ],
  },
];

export const initialSmsThreads: SmsThreadRecord[] = [
  {
    id: 'sms-1',
    customer: 'Priya Shah',
    phone: '+44 20 7946 0219',
    lastMessage: 'Reminder: 15-minute executive briefing tomorrow at 3 PM GMT.',
    status: 'Delivered',
    time: 'Yesterday',
    messages: [
      { id: 's1', sender: 'me', text: 'Reminder: 15-minute executive briefing tomorrow at 3 PM GMT. Looking forward to speaking with you!', time: 'Yesterday, 03:00 PM', status: 'Delivered' },
      { id: 's2', sender: 'them', text: 'Confirmed, see you then.', time: 'Yesterday, 03:22 PM' },
    ],
  },
];

export const initialCallLogs: CallLogRecord[] = [
  { id: 'cl-1', customer: 'Sophia Nguyen', phone: '+1 (415) 234-7715', direction: 'Outgoing', status: 'Completed', duration: '14:32', recording: 'Saved', date: 'Today, 11:30 AM' },
  { id: 'cl-2', customer: 'Daniel Rios', phone: '+1 (332) 447-9010', direction: 'Incoming', status: 'Completed', duration: '08:15', recording: 'Saved', date: 'Today, 09:15 AM' },
  { id: 'cl-3', customer: 'Priya Shah', phone: '+44 20 7946 0219', direction: 'Outgoing', status: 'Missed', duration: '00:00', recording: 'None', date: 'Yesterday, 04:45 PM' },
  { id: 'cl-4', customer: 'Ethan Brooks', phone: '+1 (646) 888-2201', direction: 'Incoming', status: 'Completed', duration: '21:05', recording: 'Saved', date: 'Oct 04, 02:00 PM' },
];

export const initialDocuments: DocumentRecord[] = [
  { id: 'doc-1', name: 'northstar-expansion-proposal-v3.pdf', customer: 'Northstar Labs', type: 'PDF', uploadedBy: 'Alicia James', date: '2026-10-04', size: '2.4 MB' },
  { id: 'doc-2', name: 'bluepeak-master-services-agreement.docx', customer: 'BluePeak Fintech', type: 'DOCX', uploadedBy: 'Marcus Lee', date: '2026-10-06', size: '840 KB' },
  { id: 'doc-3', name: 'summit-works-pricing-calculator.xlsx', customer: 'Summit Works', type: 'XLSX', uploadedBy: 'Nina Patel', date: '2026-10-05', size: '1.1 MB' },
  { id: 'doc-4', name: 'codex-enterprise-security-whitepaper.pdf', customer: 'General Collateral', type: 'PDF', uploadedBy: 'Sophia Sterling', date: '2026-09-28', size: '4.8 MB' },
  { id: 'doc-5', name: 'crestline-bio-pilot-specification.pdf', customer: 'Crestline Bio', type: 'PDF', uploadedBy: 'Marcus Lee', date: '2026-10-06', size: '3.2 MB' },
];

export const initialAdminUsers: AdminUserRecord[] = [
  { id: 'u-1', name: 'Sophia Sterling', email: 'sophia@codexcrm.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
  { id: 'u-2', name: 'Alicia James', email: 'alicia@codexcrm.com', role: 'Admin', status: 'Active', lastLogin: 'Today, 09:18' },
  { id: 'u-3', name: 'Marcus Lee', email: 'marcus@codexcrm.com', role: 'Manager', status: 'Active', lastLogin: 'Today, 08:55' },
  { id: 'u-4', name: 'Nina Patel', email: 'nina@codexcrm.com', role: 'Sales Executive', status: 'Active', lastLogin: 'Yesterday, 18:22' },
  { id: 'u-5', name: 'Ethan Brooks', email: 'ethan@codexcrm.com', role: 'Support/User', status: 'Active', lastLogin: 'Yesterday, 11:05' },
];

export const initialActivities: ActivityFeedItem[] = [
  { id: 'act-1', title: 'Deal moved to Negotiation', detail: 'Summit Enterprise Integration ($31,000) reached 88% probability', time: '14 mins ago', type: 'deal', user: 'Nina Patel' },
  { id: 'act-2', title: 'New lead qualified', detail: 'Tariq Mansoor from Nexus Logistics ($28k potential ARR)', time: '38 mins ago', type: 'lead', user: 'Nina Patel' },
  { id: 'act-3', title: 'Proposal document shared', detail: 'Sent northstar-expansion-proposal-v3.pdf to Sophia Nguyen', time: '2 hrs ago', type: 'doc', user: 'Alicia James' },
  { id: 'act-4', title: 'Follow-up call completed', detail: 'Discussed API security standards with Daniel Rios (08:15)', time: '3 hrs ago', type: 'call', user: 'Marcus Lee' },
  { id: 'act-5', title: 'Email answered', detail: 'Customer acknowledged trust center SOC2 report receipt', time: '5 hrs ago', type: 'email', user: 'Alicia James' },
];
