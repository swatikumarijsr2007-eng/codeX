import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCrm } from '../../context/CrmContext';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDocModal({ isOpen, onClose }: UploadDocModalProps) {
  const { uploadDocument, companies } = useCrm();
  const [formData, setFormData] = useState({
    name: '',
    customer: companies[0]?.name || 'Northstar Labs',
    type: 'PDF' as const,
    uploadedBy: 'Alicia James',
    size: '1.8 MB',
  });
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    uploadDocument(formData);
    onClose();
    setFormData({
      name: '',
      customer: companies[0]?.name || 'Northstar Labs',
      type: 'PDF',
      uploadedBy: 'Alicia James',
      size: '1.8 MB',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Customer Document" subtitle="Attach agreements, decks, or audits to customer account profiles.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mock Drag & Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              const file = e.dataTransfer.files[0];
              setFormData((prev) => ({
                ...prev,
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              }));
            }
          }}
          className={`p-6 rounded-2xl border-2 border-dashed text-center transition flex flex-col items-center justify-center cursor-pointer ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-300 dark:border-white/[0.15] bg-slate-50/50 dark:bg-slate-950/40 hover:border-blue-400'
          }`}
          onClick={() => {
            if (!formData.name) {
              setFormData((prev) => ({
                ...prev,
                name: 'security-compliance-matrix-2026.pdf',
                size: '2.4 MB',
              }));
            }
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {formData.name ? formData.name : 'Click to select or drag and drop file'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, XLSX, or Presentation decks up to 50MB</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Document Display Name <span className="text-rose-500">*</span>
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Master-Service-Agreement-v2.pdf"
            className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Associated Account / Customer
            </label>
            <input
              required
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              placeholder="e.g. Northstar Labs"
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Document Format
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="PDF">PDF Document</option>
              <option value="DOCX">Word Document (.docx)</option>
              <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
              <option value="KEY">Keynote Presentation</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm shadow-blue-500/25"
          >
            Store Document
          </button>
        </div>
      </form>
    </Modal>
  );
}
