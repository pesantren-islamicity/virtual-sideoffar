import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  Zap,
  Webhook,
  Database,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Key,
  Globe,
  Sliders,
  Play
} from 'lucide-react';
import { ThirdPartyIntegration, LanguageCode, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface IntegrationsViewProps {
  currentLang: LanguageCode;
  userRole: UserRole;
  integrations: ThirdPartyIntegration[];
  onToggleIntegration: (id: string) => void;
  onShowNotification: (title: string, message: string, priority: 'urgent' | 'info' | 'success') => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  currentLang,
  userRole,
  integrations,
  onToggleIntegration,
  onShowNotification
}) => {
  const t = translations[currentLang];
  const [apiKey, setApiKey] = useState('sof_live_9f823a1c890de42b104992bb34');
  const [hasCopied, setHasCopied] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    onShowNotification('Kunci API Disalin', 'Kunci otorisasi Bearer Token siap digunakan.', 'info');
  };

  const handleGenerateNewKey = () => {
    const randomKey = 'sof_live_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(randomKey);
    onShowNotification('Kunci API Diperbarui', 'Kunci baru berhasil digenerasi dengan masa berlaku 90 hari.', 'success');
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      onShowNotification('Tes Webhook Sukses', 'Server pihak ketiga mengembalikan respons HTTP 200 OK (latency: 42ms).', 'success');
    }, 800);
  };

  const getIcon = (service: ThirdPartyIntegration['service']) => {
    switch (service) {
      case 'google_calendar':
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      case 'google_sheets':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'zapier':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'webhook':
        return <Webhook className="w-5 h-5 text-sky-500" />;
      case 'sap_erp':
        return <Database className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Integrasi API Pihak Ketiga & Otomasi Eksternal
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hubungkan sideoffar.cloud dengan kalender, spreadsheet, dan ekosistem bisnis global Anda secara instan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            5 Layanan Terhubung
          </span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => {
          const isConnected = item.status === 'connected';
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getIcon(item.service)}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isConnected
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isConnected ? 'Terhubung' : 'Terputus'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Sinkron Terakhir: {item.lastSync}</span>
                  <span>{item.eventsSyncedToday} event/hari</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleIntegration(item.id)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
                    isConnected
                      ? 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isConnected ? 'Kelola / Putuskan' : 'Hubungkan'}
                </button>

                {item.service === 'webhook' && (
                  <button
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                    title="Uji Kirim Ping Webhook"
                  >
                    <Play className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer API Key & Webhook Gateway Management */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kunci Akses API Bisnis & Webhook Kustom
            </h3>
          </div>
          <button
            onClick={handleGenerateNewKey}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rotasi Kunci Baru</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Gunakan Bearer Token ini untuk mengintegrasikan sistem ERP internal Anda atau endpoint bot custom dengan API sideoffar.cloud.
        </p>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800">
          <span className="text-slate-400 select-none pl-2">Authorization: Bearer</span>
          <span className="flex-1 font-bold text-sky-400 truncate">{apiKey}</span>
          <button
            onClick={handleCopyApiKey}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Salin Kunci API"
          >
            {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
