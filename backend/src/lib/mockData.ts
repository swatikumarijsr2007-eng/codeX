export const mockUserAccounts = [
  {
    id: 'u-super-admin',
    name: 'System Super Admin',
    email: 'superadmin@codexcrm.local',
    role: 'SUPER_ADMIN',
  },
  {
    id: 'u-admin',
    name: 'Operations Admin',
    email: 'admin@codexcrm.local',
    role: 'ADMIN',
  },
  {
    id: 'u-manager',
    name: 'Sales Manager',
    email: 'manager@codexcrm.local',
    role: 'MANAGER',
  },
  {
    id: 'u-sales',
    name: 'Alicia Sales',
    email: 'sales@codexcrm.local',
    role: 'SALES_EXECUTIVE',
  },
  {
    id: 'u-support',
    name: 'Support Desk',
    email: 'support@codexcrm.local',
    role: 'SUPPORT_USER',
  },
];

export const isCustomPasswordAllowed = (password?: string) => {
  return typeof password === 'string' && password.trim().length > 0;
};

export const mockDashboard = {
  summary: [
    { label: 'Total leads', value: 1284 },
    { label: 'New leads', value: 142 },
    { label: 'Total contacts', value: 836 },
    { label: 'Active opportunities', value: 318 },
    { label: 'Won deals', value: 72 },
    { label: 'Lost deals', value: 26 },
    { label: 'Pending tasks', value: 84 },
  ],
  pipeline: [
    { stage: 'NEW', count: 234 },
    { stage: 'CONTACTED', count: 198 },
    { stage: 'QUALIFIED', count: 164 },
    { stage: 'PROPOSAL', count: 142 },
    { stage: 'NEGOTIATION', count: 94 },
    { stage: 'WON', count: 72 },
    { stage: 'LOST', count: 26 },
  ],
  activities: [
    { id: 'a1', title: 'Email sent to Northstar Labs', time: '2 mins ago', type: 'EMAIL' },
    { id: 'a2', title: 'WhatsApp message delivered to Sophia Nguyen', time: '17 mins ago', type: 'WHATSAPP' },
    { id: 'a3', title: 'Support ticket updated by operations team', time: '41 mins ago', type: 'NOTE' },
    { id: 'a4', title: 'New lead captured from campaign Q3', time: '1 hr ago', type: 'LEAD' },
  ],
};

export const mockLeads = [
  { id: 'lead-1', name: 'Sophia Nguyen', company: 'Northstar Labs', status: 'QUALIFIED', owner: 'Alicia Sales', amount: '$24,000' },
  { id: 'lead-2', name: 'Daniel Rios', company: 'BluePeak', status: 'PROPOSAL', owner: 'Alicia Sales', amount: '$18,500' },
  { id: 'lead-3', name: 'Priya Shah', company: 'Summit Works', status: 'NEW', owner: 'Sales Team', amount: '$9,200' },
];

export const mockContacts = [
  { id: 'contact-1', name: 'Sophia Nguyen', email: 'sophia@northstarlabs.ai', company: 'Northstar Labs', title: 'VP of Operations' },
  { id: 'contact-2', name: 'Daniel Rios', email: 'daniel@bluepeak.io', company: 'BluePeak', title: 'Head of Growth' },
  { id: 'contact-3', name: 'Priya Shah', email: 'priya@summitworks.co', company: 'Summit Works', title: 'COO' },
];

export const mockCompanies = [
  { id: 'company-1', name: 'Northstar Labs', industry: 'SaaS', employees: '120', city: 'San Francisco' },
  { id: 'company-2', name: 'BluePeak', industry: 'Fintech', employees: '54', city: 'New York' },
  { id: 'company-3', name: 'Summit Works', industry: 'Professional Services', employees: '74', city: 'Austin' },
];

export const mockOpportunities = [
  { id: 'opp-1', name: 'Northstar Expansion', stage: 'NEGOTIATION', amount: '$24,000', probability: 72 },
  { id: 'opp-2', name: 'BluePeak Renewal', stage: 'PROPOSAL', amount: '$18,500', probability: 61 },
  { id: 'opp-3', name: 'Summit Analytics', stage: 'DISCOVERY', amount: '$9,200', probability: 23 },
];

export const mockTasks = [
  { id: 'task-1', title: 'Prepare proposal deck', status: 'IN_PROGRESS', assignee: 'Alicia Sales', due: 'Today' },
  { id: 'task-2', title: 'Call new lead', status: 'TODO', assignee: 'Sales Team', due: 'Tomorrow' },
  { id: 'task-3', title: 'Documentation review', status: 'COMPLETED', assignee: 'Support Desk', due: 'Completed' },
];

export const mockCalendar = [
  { id: 'event-1', title: 'Discovery call', date: '2026-10-08', owner: 'Alicia Sales' },
  { id: 'event-2', title: 'Partner sync', date: '2026-10-09', owner: 'Operations Admin' },
  { id: 'event-3', title: 'Onboarding review', date: '2026-10-12', owner: 'Support Desk' },
];

export const mockCommunications = [
  { id: 'comm-1', channel: 'EMAIL', contact: 'Sophia Nguyen', subject: 'Proposal follow-up', status: 'SENT' },
  { id: 'comm-2', channel: 'WHATSAPP', contact: 'Daniel Rios', subject: 'Welcome message', status: 'DELIVERED' },
  { id: 'comm-3', channel: 'SMS', contact: 'Priya Shah', subject: 'Quick check-in', status: 'SENT' },
];

export const mockDocs = [
  { id: 'doc-1', name: 'northstar-proposal.pdf', size: '1.2 MB', owner: 'Alicia Sales' },
  { id: 'doc-2', name: 'bluepeak-contract.docx', size: '480 KB', owner: 'Sales Team' },
];

export const mockUsers = [
  { id: 'u-super-admin', name: 'System Super Admin', email: 'superadmin@codexcrm.local', role: 'SUPER_ADMIN' },
  { id: 'u-admin', name: 'Operations Admin', email: 'admin@codexcrm.local', role: 'ADMIN' },
  { id: 'u-manager', name: 'Sales Manager', email: 'manager@codexcrm.local', role: 'MANAGER' },
  { id: 'u-sales', name: 'Alicia Sales', email: 'sales@codexcrm.local', role: 'SALES_EXECUTIVE' },
  { id: 'u-support', name: 'Support Desk', email: 'support@codexcrm.local', role: 'SUPPORT_USER' },
];

export const mockReports = [
  { name: 'Pipeline coverage', value: '82%' },
  { name: 'Response time', value: '3.2h' },
  { name: 'Win rate', value: '31%' },
];
