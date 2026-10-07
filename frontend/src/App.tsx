import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CrmProvider } from './context/CrmContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { ContactsPage } from './pages/ContactsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { InteractiveTasks } from './components/tasks/InteractiveTasks';
import { InteractiveCalendar } from './components/calendar/InteractiveCalendar';
import { InteractiveComms } from './components/communications/InteractiveComms';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';

export default function App() {
  return (
    <CrmProvider>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Dashboard Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
            <Route path="/opportunities" element={<KanbanBoard />} />
            <Route path="/tasks" element={<InteractiveTasks />} />
            <Route path="/calendar" element={<InteractiveCalendar />} />
            <Route path="/communications" element={<InteractiveComms />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/customers/:customerId" element={<CustomerProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </CrmProvider>
  );
}
