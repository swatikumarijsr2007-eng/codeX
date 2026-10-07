import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  Eye,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { UploadDocModal } from '../components/modals/UploadDocModal';
import { Modal } from '../components/ui/Modal';
import type { DocumentRecord } from '../data/initialData';

export function DocumentsPage() {
  const { documents, deleteDocument, addToast } = useCrm();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.customer.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || doc.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [documents, search, typeFilter]);

  const handleDownload = (doc: DocumentRecord) => {
    const dummyText = `--- CODEX CRM VAULT DOCUMENT ---\nDocument: ${doc.name}\nAccount: ${doc.customer}\nUploaded by: ${doc.uploadedBy}\nDate: ${doc.date}\nFile Size: ${doc.size}\n\nConfidential Customer Data Agreement & Technical Proposal Specifications.`;
    const element = document.createElement('a');
    const file = new Blob([dummyText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast({ title: 'Download Triggered', description: `${doc.name} downloaded successfully.`, variant: 'success' });
  };

  const getDocIcon = (type: string) => {
    if (type === 'XLSX') return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Encrypted Vault
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredDocs.length} Files
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Documents & Contracts Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customer proposals, NDAs, Master Service Agreements, and technical specifications.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + Upload Document
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents or accounts..."
              className="w-full text-xs rounded-xl pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-xl px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Formats</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3.5">Document File</th>
              <th className="px-4 py-3.5">Customer Account</th>
              <th className="px-4 py-3.5">Format</th>
              <th className="px-4 py-3.5">Uploaded By</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Size</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      {getDocIcon(doc.type)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Vault ID: {doc.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {doc.customer}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {doc.type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {doc.uploadedBy}
                </td>
                <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                  {doc.date}
                </td>
                <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                  {doc.size}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-500 transition flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UploadDocModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview: ${previewDoc.name}`}
          subtitle={`Account: ${previewDoc.customer} • Uploaded by ${previewDoc.uploadedBy}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
              <p className="font-bold text-blue-600 dark:text-blue-400">--- CODEX CRM VERIFIED DOCUMENT VAULT ---</p>
              <p>Document Name: {previewDoc.name}</p>
              <p>Type: {previewDoc.type} • File Size: {previewDoc.size}</p>
              <p>Timestamp: {previewDoc.date}</p>
              <p className="border-t border-slate-200 dark:border-white/[0.06] pt-3 text-[11px] leading-relaxed font-sans text-slate-600 dark:text-slate-400">
                This document contains standard executive clauses, pricing scope definitions, SOC2 compliance addenda, and terms of service authorized for {previewDoc.customer}.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
