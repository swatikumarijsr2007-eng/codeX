import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';

import { env } from './config/env.js';
import { signToken, verifyToken } from './lib/auth.js';
import { db } from './lib/db.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

const app = express();

const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = authHeader.slice(7);
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    return next();
  };
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// System Health
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'codeX-crm backend & database',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    records: {
      leads: db.getLeads().length,
      deals: db.getDeals().length,
      contacts: db.getContacts().length,
      tasks: db.getTasks().length,
    },
  });
});

app.get('/api/auth/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Authentication service ready',
  });
});

// Authentication
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, username, password } = req.body ?? {};
  const identifier = String(username ?? email ?? '').trim();

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const account = db.getUserByCredentials(identifier, String(password));

    if (!account) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userPayload = {
      id: account.id,
      username: account.username,
      email: account.email,
      name: account.name,
      role: account.role,
    };

    const token = signToken(userPayload);

    return res.json({
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to authenticate user' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, username, password, role } = req.body ?? {};

  const cleanName = String(name ?? '').trim();
  const cleanEmail = String(email ?? '').trim().toLowerCase();
  const cleanUsername = String(username ?? '').trim().toLowerCase();
  const cleanPassword = String(password ?? '');

  if (!cleanName || !cleanEmail || !cleanUsername || !cleanPassword) {
    return res.status(400).json({ message: 'Name, email, username and password are required' });
  }

  if (db.getUserByUsername(cleanUsername) || db.getUserByEmail(cleanEmail)) {
    return res.status(409).json({ message: 'An account with that username or email already exists' });
  }

  const hashedPassword = bcrypt.hashSync(cleanPassword, 10);
  const newUser = db.createUser({
    username: cleanUsername,
    name: cleanName,
    email: cleanEmail,
    passwordHash: hashedPassword,
    role: role || 'SALES_EXECUTIVE',
    status: 'Active',
  });

  const token = signToken({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });

  res.status(201).json({ token, user: newUser });
});

app.get('/api/auth/me', authRequired, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Dashboard & Aggregates
app.get('/api/dashboard', (_req, res) => {
  res.json(db.getDashboardStats());
});

app.get('/api/reports', (_req, res) => {
  const deals = db.getDeals();
  const leads = db.getLeads();
  const tasks = db.getTasks();
  const won = deals.filter((d) => d.stage === 'Won').length;
  const totalClosed = deals.filter((d) => d.stage === 'Won' || d.stage === 'Lost').length;
  const winRate = totalClosed > 0 ? `${Math.round((won / totalClosed) * 100)}%` : '74%';

  res.json({
    pipelineTotal: deals.reduce((acc, d) => acc + d.value, 0),
    winRate,
    leadsCount: leads.length,
    tasksCompleted: tasks.filter((t) => t.completed).length,
    stagesDistribution: db.getDashboardStats().pipeline,
  });
});

// Leads Endpoints
app.get('/api/leads', (_req, res) => {
  res.json(db.getLeads());
});

app.post('/api/leads', (req: Request, res: Response) => {
  const lead = db.createLead(req.body);
  res.status(201).json(lead);
});

app.put('/api/leads/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateLead(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Lead not found' });
  res.json(updated);
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteLead(id);
  if (!ok) return res.status(404).json({ message: 'Lead not found' });
  res.json({ success: true, id });
});

// Contacts Endpoints
app.get('/api/contacts', (_req, res) => {
  res.json(db.getContacts());
});

app.post('/api/contacts', (req: Request, res: Response) => {
  const contact = db.createContact(req.body);
  res.status(201).json(contact);
});

app.put('/api/contacts/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateContact(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  res.json(updated);
});

app.delete('/api/contacts/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteContact(id);
  if (!ok) return res.status(404).json({ message: 'Contact not found' });
  res.json({ success: true, id });
});

// Companies Endpoints
app.get('/api/companies', (_req, res) => {
  res.json(db.getCompanies());
});

app.post('/api/companies', (req: Request, res: Response) => {
  const company = db.createCompany(req.body);
  res.status(201).json(company);
});

app.put('/api/companies/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateCompany(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Company not found' });
  res.json(updated);
});

// Opportunities (Deals) Endpoints
app.get('/api/opportunities', (_req, res) => {
  res.json(db.getDeals());
});

app.post('/api/opportunities', (req: Request, res: Response) => {
  const deal = db.createDeal(req.body);
  res.status(201).json(deal);
});

app.put('/api/opportunities/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateDeal(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Deal not found' });
  res.json(updated);
});

app.delete('/api/opportunities/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteDeal(id);
  if (!ok) return res.status(404).json({ message: 'Deal not found' });
  res.json({ success: true, id });
});

// Tasks Endpoints
app.get('/api/tasks', (_req, res) => {
  res.json(db.getTasks());
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const task = db.createTask(req.body);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateTask(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteTask(id);
  if (!ok) return res.status(404).json({ message: 'Task not found' });
  res.json({ success: true, id });
});

// Calendar Endpoints
app.get('/api/calendar', (_req, res) => {
  res.json(db.getEvents());
});

app.post('/api/calendar', (req: Request, res: Response) => {
  const event = db.createEvent(req.body);
  res.status(201).json(event);
});

app.delete('/api/calendar/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteEvent(id);
  if (!ok) return res.status(404).json({ message: 'Event not found' });
  res.json({ success: true, id });
});

// Communications Endpoints
app.get('/api/communications', (_req, res) => {
  res.json(db.getCommunications());
});

app.post('/api/communications/email', (req: Request, res: Response) => {
  const { threadId, text, recipient, email, subject, body } = req.body;
  if (threadId && text) {
    const updated = db.addEmailMessage(threadId, text);
    return res.json(updated);
  }
  if (recipient && email && subject && body) {
    const created = db.createEmailThread(recipient, email, subject, body);
    return res.status(201).json(created);
  }
  return res.status(400).json({ message: 'Invalid email payload' });
});

app.post('/api/communications/whatsapp', (req: Request, res: Response) => {
  const { threadId, text } = req.body;
  const updated = db.addWhatsAppMessage(threadId, text);
  res.json(updated);
});

app.post('/api/communications/sms', (req: Request, res: Response) => {
  const { threadId, text } = req.body;
  const updated = db.addSmsMessage(threadId, text);
  res.json(updated);
});

app.post('/api/communications/calls', (req: Request, res: Response) => {
  const log = db.addCallLog(req.body);
  res.status(201).json(log);
});

// Documents Endpoints
app.get('/api/documents', (_req, res) => {
  res.json(db.getDocuments());
});

app.post('/api/documents', (req: Request, res: Response) => {
  const doc = db.createDocument(req.body);
  res.status(201).json(doc);
});

app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const ok = db.deleteDocument(id);
  if (!ok) return res.status(404).json({ message: 'Document not found' });
  res.json({ success: true, id });
});

// Users & Admin Endpoints
app.get('/api/users', (_req, res) => {
  res.json(db.getUsers());
});

app.get('/api/admin/users', (_req, res) => {
  res.json(db.getUsers());
});

app.post('/api/admin/users', (req: Request, res: Response) => {
  const payload = req.body ?? {};
  const username = String(payload.username ?? payload.email ?? '').trim().toLowerCase() || 'new-user';
  const email = String(payload.email ?? '').trim().toLowerCase();
  const name = String(payload.name ?? 'New user').trim();
  const role = String(payload.role ?? 'SUPPORT_USER');
  const passwordHash = payload.passwordHash || bcrypt.hashSync(String(payload.password ?? 'password123'), 10);

  const user = db.createUser({
    username,
    name,
    email,
    passwordHash,
    role: role as 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SALES_EXECUTIVE' | 'SUPPORT_USER',
    status: payload.status || 'Active',
  });
  res.status(201).json(user);
});

app.put('/api/admin/users/:id', (req: Request, res: Response) => {
  const id = String(req.params.id ?? '');
  const updated = db.updateUser(id, req.body);
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});

// Error handling
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(env.PORT, () => {
  console.log(`[Database Server] Live on http://localhost:${env.PORT}`);
});
