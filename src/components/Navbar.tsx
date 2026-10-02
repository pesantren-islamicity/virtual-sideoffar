import React, { useState } from 'react';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  Mic,
  Menu,
  Check,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { LanguageCode, UserRole, SyncState, NotificationItem } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentLang?: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  currentRole?: UserRole;
  userRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleTheme?: () => void;
  syncState?: SyncState;
  onTriggerSync?: () => void;
  onToggleOfflineMode?: () => void;
  notifications?: NotificationItem[];
  onMarkAllNotificationsRead?: () => void;
  onClearNotifications?: () => void;
  onOpenAssistant?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang = 'id',
  onSelectLang,
  onLanguageChange,
  currentRole: propRole,
  userRole,
  onSelectRole,
  onRoleChange,
  isDarkMode = false,
  onToggleDarkMode,
  onToggleTheme,
  syncState = { isOnline: true, isSyncing: false, lastSyncedTimestamp: 'Sekarang', pendingQueueCount: 0 },
  onTriggerSync = () => {},
  onToggleOfflineMode = () => {},
  notifications = [],
  onMarkAllNotificationsRead,
  onClearNotifications,
  onOpenAssistant = () => {},
  onToggleMobileSidebar = () => {}
}) => {
  const activeRole: UserRole = propRole || userRole || 'super_admin';
  const handleSelectRole = onSelectRole || onRoleChange || (() => {});
  const handleSelectLang = onSelectLang || onLanguageChange || (() => {});
  const handleToggleTheme = onToggleDarkMode || onToggleTheme || (() => {});
  const handleClearNotif = onMarkAllNotificationsRead || onClearNotifications || (() => {});

  const t = translations[currentLang] || translations.id;
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications.filter(Boolean) : [];
  const unreadCount = safeNotifications.filter(n => !n.isRead).length;

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    super_admin: { title: 'Super Administrator', badge: 'Full Access', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
    manager: { title: 'Project Manager', badge: 'Ops Lead', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    team_lead: { title: 'Team Lead', badge: 'Sprint Admin', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    team_member: { title: 'Team Member', badge: 'Contributor', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    guest_client: { title: 'Client / Guest', badge: 'Read Only', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' }
  };

  const activeRoleMeta = roleLabels[activeRole] || roleLabels.super_admin;

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'zh', label: '中文 (Mandarin)', flag: '🇨🇳' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-slate-900/90">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Mobile toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-500/20">
              <Cloud className="w-5 h-5" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  sideoffar<span className="text-indigo-500">.cloud</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                  <ShieldCheck className="w-3 h-3" /> E2E Vault
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none hidden sm:block">
                Powered by <strong className="text-slate-700 dark:text-slate-200">Bicarafar AI</strong> Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Center: Bicarafar AI Quick Trigger */}
        <div className="hidden md:flex items-center">
          <button
            id="navbar-bicarafar-trigger-btn"
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 hover:from-indigo-100 hover:to-sky-100 dark:hover:from-indigo-900/50 dark:hover:to-sky-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-semibold">Bicarafar Virtual Assistant</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] group-hover:scale-110 transition-transform">
              <Mic className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* Right Section: Sync, Notif, Lang, Theme, Role */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cloud Sync Indicator & Offline Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              id="offline-mode-toggle-btn"
              onClick={onToggleOfflineMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                syncState.isOnline
                  ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  : 'bg-amber-500 text-white shadow-xs'
              }`}
              title={syncState.isOnline ? 'Klik untuk simulasi Mode Luring' : 'Klik untuk kembali Terhubung'}
            >
              {syncState.isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Luring</span>
                  {syncState.pendingQueueCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-bold">
                      {syncState.pendingQueueCount}
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              id="manual-sync-btn"
              onClick={onTriggerSync}
              disabled={syncState.isSyncing}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700/80 transition-colors disabled:opacity-50 cursor-pointer"
              title={t.common.syncNow}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          {/* Real-time Notifications Bell */}
          <div className="relative">
            <button
              id="notifications-dropdown-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title={t.common.notifications}
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.common.notifications}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleClearNotif}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {t.common.markAllRead}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {safeNotifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        notif.isRead
                          ? 'border-transparent bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                          : 'border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/30 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                          {notif.priority === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span>{notif.title || 'Notifikasi'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                  {safeNotifications.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Tidak ada notifikasi baru
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              id="language-dropdown-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.common.language}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">{currentLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      handleSelectLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      currentLang === l.code
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            id="dark-mode-toggle-btn"
            onClick={handleToggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? t.common.lightMode : t.common.darkMode}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* RBAC Role Switcher & User Profile */}
          <div className="relative">
            <button
              id="role-dropdown-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                FM
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                  Farhan Maulana
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {activeRoleMeta?.title || 'Super Administrator'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  {t.common.role} (Simulasi RBAC)
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map(roleKey => {
                  const roleMeta = roleLabels[roleKey];
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        handleSelectRole(roleKey);
                        setShowRoleMenu(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors ${
                        activeRole === roleKey
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {roleMeta?.title || roleKey}
                        </div>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${roleMeta?.color || ''}`}>
                          {roleMeta?.badge || 'Role'}
                        </span>
                      </div>
                      {activeRole === roleKey && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
