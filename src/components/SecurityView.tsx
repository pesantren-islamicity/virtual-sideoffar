import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sliders,
  UserCheck
} from 'lucide-react';
import { SecurityStatus, LanguageCode, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { securityStatus as initialSecurity, mockAuditLogs } from '../data/mockData';

interface SecurityViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  onShowNotification: (title: string, message: string, priority: 'urgent' | 'info' | 'success') => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  currentLang,
  userRole,
  onShowNotification
}) => {
  const t = translations[currentLang];
  const [security, setSecurity] = useState<SecurityStatus>(initialSecurity);
  const [isAuditing, setIsAuditing] = useState(false);

  const toggle2FA = () => {
    const newState = !security.twoFactorEnabled;
    setSecurity(prev => ({
      ...prev,
      twoFactorEnabled: newState,
      overallScore: newState ? 98 : 86
    }));

    onShowNotification(
      newState ? '2FA Berhasil Diaktifkan' : '2FA Dinonaktifkan',
      newState ? 'Autentikasi dua faktor melindungi akun dengan TOTP/Hardware Key.' : 'Peringatan: Akun Anda rentan tanpa proteksi multi-faktor.',
      newState ? 'success' : 'urgent'
    );
  };

  const handleRunSecurityAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setSecurity(prev => ({
        ...prev,
        lastAuditTimestamp: 'Baru saja (Lolos 100%)',
        overallScore: 99
      }));
      onShowNotification(
        'Audit Kriptografi Selesai',
        'Semua kunci AES-256 GCM, sertifikat TLS 1.3, dan RBAC diverifikasi tanpa celah.',
        'success'
      );
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Security Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pusat Keamanan Korporat & Enkripsi End-to-End
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                Skor: {security.overallScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standar ISO/IEC 27001, SOC 2 Type II, dan enkripsi zero-knowledge berstandar perbankan.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSecurityAudit}
          disabled={isAuditing}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Memindai Kriptografi...' : 'Jalankan Audit Keamanan'}</span>
        </button>
      </div>

      {/* Security Modules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: End-to-End Encryption */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Lock className="w-5 h-5 text-indigo-600" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {security.encryptionStandard}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Enkripsi End-to-End
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Data terenkripsi di perangkat klien sebelum dikirim ke sideoffar.cloud. Kunci privat tidak pernah menyentuh server publik.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kriptografi Aktif & Terverifikasi</span>
          </div>
        </div>

        {/* Module 2: 2FA Authentication */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Smartphone className="w-5 h-5 text-sky-600" />
            <button
              onClick={toggle2FA}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                security.twoFactorEnabled
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
              }`}
            >
              {security.twoFactorEnabled ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Autentikasi Dua Faktor (2FA)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Mewajibkan verifikasi kode TOTP (Google Authenticator / YubiKey) pada setiap login perangkat baru.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={toggle2FA}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {security.twoFactorEnabled ? 'Nonaktifkan Proteksi 2FA' : 'Aktifkan 2FA Sekarang'}
            </button>
          </div>
        </div>

        {/* Module 3: Session & HSM Shield */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Key className="w-5 h-5 text-amber-600" />
            <span className="text-[11px] font-mono text-slate-400">
              Rotasi: 30 Hari
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sesi & Proteksi Perangkat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              3 sesi aktif diidentifikasi. Deteksi anomali IP otomatis memutuskan akses jika terjadi pola login mencurigakan.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onShowNotification('Sesi Diputus', 'Semua sesi perangkat lain berhasil ditutup secara aman.', 'info')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cabut Semua Sesi Lain</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Matriks Hak Akses & Peran Berjenjang (RBAC)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Peran Anda saat ini: <strong className="text-indigo-600 dark:text-indigo-400">{userRole.replace('_', ' ').toUpperCase()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Peran Pengguna</th>
                <th className="p-3">Asisten AI Bicarafar</th>
                <th className="p-3">Manajemen Alur Kerja</th>
                <th className="p-3">Brankas Dokumen E2E</th>
                <th className="p-3">Analitik Prediktif</th>
                <th className="p-3">Konfigurasi API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Super Admin</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh & Kunci HSM</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Project Manager</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-indigo-600 font-bold">Sesuai Izin</td>
                <td className="p-3 text-emerald-600 font-bold">Penuh</td>
                <td className="p-3 text-slate-400">Lihat Saja</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Team Member</td>
                <td className="p-3 text-emerald-600 font-bold">Standar</td>
                <td className="p-3 text-indigo-600 font-bold">Tugas Terkait</td>
                <td className="p-3 text-indigo-600 font-bold">Kolaboratif</td>
                <td className="p-3 text-slate-400">Metrik Pribadi</td>
                <td className="p-3 text-slate-400">Terbatas</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Client Viewer</td>
                <td className="p-3 text-slate-400">Tanya Jawab Laporan</td>
                <td className="p-3 text-slate-400">Lihat Progres</td>
                <td className="p-3 text-slate-400">Publik Saja</td>
                <td className="p-3 text-indigo-600 font-bold">Ringkasan Eksekutif</td>
                <td className="p-3 text-slate-400">Tidak Ada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Log Audit Jejak Kemanan & Kepatuhan Real-Time
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {mockAuditLogs.map(log => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.actor}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.ipAddress})</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {log.status}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px]">{log.action}</div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
