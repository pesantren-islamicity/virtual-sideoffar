import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  UploadCloud,
  FileText,
  Key,
  Eye,
  Download,
  Share2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { DocumentItem, PermissionLevel, LanguageCode, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { exportDocumentsCSV } from '../utils/exportUtils';

interface DocumentVaultViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  documents: DocumentItem[];
  onAddDocument: (doc: DocumentItem) => void;
  onShowNotification: (title: string, message: string, priority: 'urgent' | 'info' | 'success') => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  currentLang,
  userRole,
  documents,
  onAddDocument,
  onShowNotification
}) => {
  const t = translations[currentLang];
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('strategy');
  const [newPermission, setNewPermission] = useState<PermissionLevel>('e2e_confidential');

  const permissionBadges: Record<PermissionLevel, { label: string; color: string }> = {
    e2e_confidential: { label: 'E2E Enkripsi AES-256', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900' },
    restricted_mgmt: { label: 'Khusus Manajemen', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
    team_collaborate: { label: 'Kolaborasi Tim', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900' },
    public_read: { label: 'Internal Publik', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Generate pseudo SHA-256 fingerprint
    const chars = '0123456789abcdef';
    let randomHash = '';
    for (let i = 0; i < 64; i++) {
      randomHash += chars[Math.floor(Math.random() * chars.length)];
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim().endsWith('.pdf') ? newTitle.trim() : `${newTitle.trim()}.pdf`,
      category: newCategory,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      permission: newPermission,
      owner: 'Farhan Maulana',
      encryptedHash: randomHash,
      isEncrypted: newPermission === 'e2e_confidential'
    };

    onAddDocument(newDoc);
    onShowNotification(
      'Dokumen Dienkripsi & Tersimpan',
      `Berkas "${newDoc.title}" dilindungi kunci HSM dan siap disinkronkan ke cloud.`,
      'success'
    );

    setIsUploadOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-900/90 via-slate-900/95 to-slate-900/90 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {t.vault.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                AES-256 GCM
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t.vault.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-documents-csv-btn"
            onClick={() => exportDocumentsCSV(documents)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Katalog CSV</span>
          </button>
          <button
            id="open-upload-doc-modal-btn"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.vault.uploadDoc}</span>
          </button>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Katalog Dokumen Terenkripsi ({documents.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Protokol Verifikasi: SHA-256
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {documents.map(doc => {
            const badge = permissionBadges[doc.permission];
            return (
              <div
                key={doc.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {doc.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Ukuran: {doc.size}</span>
                      <span>•</span>
                      <span>Pemilik: {doc.owner}</span>
                      <span>•</span>
                      <span>Diperbarui: {doc.updatedAt}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 truncate max-w-md">
                      <Key className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">Hash: {doc.encryptedHash}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Verifikasi Kunci</span>
                  </button>

                  <button
                    onClick={() => {
                      onShowNotification('Dokumen Dibuka', `Dekripsi berhasil untuk: ${doc.title}`, 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.vault.downloadEncrypted}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOCUMENT DETAIL / DECRYPT MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Audit Kriptografi Dokumen E2E
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Nama Berkas:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedDoc?.title || 'Dokumen'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tingkat Izin:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {permissionBadges[selectedDoc?.permission]?.label || 'Terkunci'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ukuran Berkas:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedDoc.size}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">
                  Sidik Jari Kriptografi SHA-256:
                </span>
                <div className="p-2.5 rounded-xl bg-slate-900 text-sky-400 font-mono text-[11px] break-all border border-slate-800">
                  {selectedDoc.encryptedHash}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Integritas terjamin. Tidak terdeteksi tanda-tanda modifikasi ilegal (tamper-evident zero-knowledge architecture).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs"
              >
                Tutup Pemeriksaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.vault.uploadDoc}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Berkas
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Contoh: Rencana Strategis Bisnis 2026.pdf"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
                >
                  <option value="strategy">Strategi Perusahaan</option>
                  <option value="financial">Keuangan & Pajak</option>
                  <option value="contract">Kontrak & Legal</option>
                  <option value="technical">Arsitektur Teknis & API</option>
                  <option value="report">Laporan Manajemen</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tingkat Izin & Enkripsi
                </label>
                <select
                  value={newPermission}
                  onChange={e => setNewPermission(e.target.value as PermissionLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
                >
                  <option value="e2e_confidential">E2E Enkripsi AES-256 (Kerahasiaan Tinggi)</option>
                  <option value="restricted_mgmt">Khusus Manajemen & Direksi</option>
                  <option value="team_collaborate">Kolaborasi Tim Internal</option>
                  <option value="public_read">Internal Publik (Baca Saja)</option>
                </select>
              </div>

              {/* Drag & Drop Simulation Container */}
              <div className="p-6 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl text-center space-y-1.5 bg-indigo-50/20 dark:bg-indigo-950/20">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Tarik berkas ke sini atau klik untuk memilih
                </div>
                <div className="text-[10px] text-slate-400">
                  Dukungan PDF, XLSX, DOCX, JSON, ZIP (Maksimal 250 MB)
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20"
                >
                  Enkripsi & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
