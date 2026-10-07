export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SALES_EXECUTIVE' | 'SUPPORT_USER';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type DashboardSummary = {
  label: string;
  value: number | string;
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  type: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  status: string;
  owner: string;
  amount: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
};

export type CompanyRecord = {
  id: string;
  name: string;
  industry: string;
  employees: string;
  city: string;
};

export type Opportunity = {
  id: string;
  name: string;
  stage: string;
  amount: string;
  probability: number;
};

export type TaskItem = {
  id: string;
  title: string;
  status: string;
  assignee: string;
  due: string;
};

export type Communication = {
  id: string;
  channel: string;
  contact: string;
  subject: string;
  status: string;
};
