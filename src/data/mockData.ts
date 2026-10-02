import {
  Task,
  TeamMember,
  DocumentItem,
  ThirdPartyIntegration,
  NotificationItem,
  SecurityStatus,
  PredictiveMetric
} from '../types';

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'Farhan Maulana',
    role: 'Chief Technology Officer',
    department: 'Engineering & AI',
    email: 'farhan@sideoffar.cloud',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    performanceScore: 98,
    completedTasks: 42,
    activeTasks: 3,
    securityRole: 'super_admin',
    status: 'online'
  },
  {
    id: 'mem-2',
    name: 'Siti Rahmawati',
    role: 'Lead Project Manager',
    department: 'Operations',
    email: 'siti.r@sideoffar.cloud',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    performanceScore: 94,
    completedTasks: 38,
    activeTasks: 4,
    securityRole: 'manager',
    status: 'online'
  },
  {
    id: 'mem-3',
    name: 'Alexandre Dubois',
    role: 'Principal Cloud Architect',
    department: 'Infrastructure & SecOps',
    email: 'alex.dubois@sideoffar.cloud',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    performanceScore: 91,
    completedTasks: 29,
    activeTasks: 5,
    securityRole: 'team_lead',
    status: 'busy'
  },
  {
    id: 'mem-4',
    name: 'Elena Rostova',
    role: 'Senior Data Scientist',
    department: 'Predictive Intelligence',
    email: 'elena.r@sideoffar.cloud',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    performanceScore: 96,
    completedTasks: 35,
    activeTasks: 2,
    securityRole: 'team_member',
    status: 'online'
  },
  {
    id: 'mem-5',
    name: 'Kenji Takahashi',
    role: 'Full-Stack Developer',
    department: 'Product Development',
    email: 'kenji.t@sideoffar.cloud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    performanceScore: 88,
    completedTasks: 24,
    activeTasks: 6,
    securityRole: 'team_member',
    status: 'away'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'tsk-101',
    title: 'Audit Keamanan Enkripsi End-to-End & Rotasi Kunci HSM',
    description: 'Verifikasi kepatuhan standar AES-256 GCM pada transmisi data lintas wilayah sideoffar.cloud.',
    priority: 'urgent',
    status: 'in_progress',
    deadline: '2026-09-18',
    assignee: 'Farhan Maulana',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['Security', 'E2E', 'Compliance'],
    estimatedHours: 16,
    actualHours: 9,
    synced: true,
    createdAt: '2026-09-14'
  },
  {
    id: 'tsk-102',
    title: 'Implementasi Algoritma Prediktif Bottleneck Bicarafar',
    description: 'Pelatihan model machine learning untuk memprediksi potensi keterlambatan deadline sebelum H-3.',
    priority: 'high',
    status: 'in_progress',
    deadline: '2026-09-20',
    assignee: 'Elena Rostova',
    assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tags: ['AI Engine', 'Predictive', 'Bicarafar'],
    estimatedHours: 24,
    actualHours: 14,
    synced: true,
    createdAt: '2026-09-12'
  },
  {
    id: 'tsk-103',
    title: 'Sinkronisasi Otomatis Google Calendar & Webhook Zapier',
    description: 'Menghubungkan webhook integrasi dua arah agar jadwal rapat dan milestone langsung sinkron.',
    priority: 'medium',
    status: 'completed',
    deadline: '2026-09-15',
    assignee: 'Kenji Takahashi',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tags: ['Integration', 'Calendar', 'Webhooks'],
    estimatedHours: 12,
    actualHours: 11,
    synced: true,
    createdAt: '2026-09-10'
  },
  {
    id: 'tsk-104',
    title: 'Finalisasi Laporan Keuangan Q3 untuk Ekspor PDF & Spreadsheet',
    description: 'Agregasi neraca keuangan multi-cabang dengan visualisasi grafik untuk dewan direksi.',
    priority: 'urgent',
    status: 'review',
    deadline: '2026-09-17',
    assignee: 'Siti Rahmawati',
    assigneeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tags: ['Finance', 'Reports', 'Management'],
    estimatedHours: 20,
    actualHours: 19,
    synced: true,
    createdAt: '2026-09-11'
  },
  {
    id: 'tsk-105',
    title: 'Optimasi Cache Mode Offline & Queue Re-sync Otomatis',
    description: 'Penyimpanan IndexedDB/LocalStorage lokal agar operasional tetap lancar saat tanpa koneksi internet.',
    priority: 'high',
    status: 'todo',
    deadline: '2026-09-22',
    assignee: 'Alexandre Dubois',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tags: ['Offline', 'Sync', 'Resilience'],
    estimatedHours: 18,
    actualHours: 0,
    synced: true,
    createdAt: '2026-09-15'
  },
  {
    id: 'tsk-106',
    title: 'Dukungan Antarmuka Multi-Bahasa (ID, EN, AR, JA, ZH)',
    description: 'Penyelarasan tata letak RTL dan lokalisasi istilah teknis untuk klien global.',
    priority: 'medium',
    status: 'completed',
    deadline: '2026-09-16',
    assignee: 'Farhan Maulana',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['i18n', 'UI/UX', 'Global'],
    estimatedHours: 14,
    actualHours: 13,
    synced: true,
    createdAt: '2026-09-08'
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Protokol Keamanan & Enkripsi sideoffar.cloud v3.4.pdf',
    category: 'strategy',
    size: '4.8 MB',
    updatedAt: '2026-09-15 14:30',
    permission: 'e2e_confidential',
    owner: 'Farhan Maulana',
    encryptedHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    isEncrypted: true
  },
  {
    id: 'doc-02',
    title: 'Laporan Prediksi Kinerja Bisnis & ROI Kuartal III.xlsx',
    category: 'financial',
    size: '2.1 MB',
    updatedAt: '2026-09-14 09:15',
    permission: 'restricted_mgmt',
    owner: 'Siti Rahmawati',
    encryptedHash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
    isEncrypted: true
  },
  {
    id: 'doc-03',
    title: 'Blueprint Arsitektur API Gateway & Webhook Hub.json',
    category: 'technical',
    size: '850 KB',
    updatedAt: '2026-09-12 16:45',
    permission: 'team_collaborate',
    owner: 'Alexandre Dubois',
    encryptedHash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    isEncrypted: false
  },
  {
    id: 'doc-04',
    title: 'Perjanjian Kerjasama Mitra Global & SLA Enterprise.pdf',
    category: 'contract',
    size: '6.3 MB',
    updatedAt: '2026-09-09 11:20',
    permission: 'e2e_confidential',
    owner: 'Farhan Maulana',
    encryptedHash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    isEncrypted: true
  }
];

export const initialIntegrations: ThirdPartyIntegration[] = [
  {
    id: 'int-1',
    name: 'Google Calendar Sync',
    service: 'google_calendar',
    description: 'Sinkronisasi dua arah untuk deadline tugas dan rapat proyek Bicarafar.',
    status: 'connected',
    lastSync: '2 menit yang lalu',
    eventsSyncedToday: 18,
    iconName: 'Calendar'
  },
  {
    id: 'int-2',
    name: 'Google Sheets & CSV Exporter',
    service: 'google_sheets',
    description: 'Penyaluran data analitik berkala otomatis ke Google Spreadsheet korporat.',
    status: 'connected',
    lastSync: '15 menit yang lalu',
    eventsSyncedToday: 4,
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'int-3',
    name: 'Slack Enterprise Alerts',
    service: 'slack',
    description: 'Pemberitahuan instan jika Bicarafar mendeteksi anomali atau risiko kritis.',
    status: 'connected',
    lastSync: 'Baru saja',
    eventsSyncedToday: 32,
    iconName: 'MessageSquare'
  },
  {
    id: 'int-4',
    name: 'Zapier Automation Hub',
    service: 'zapier',
    description: 'Menghubungkan 5,000+ aplikasi dengan pemicu peristiwa sideoffar.cloud.',
    status: 'connected',
    lastSync: '1 jam yang lalu',
    eventsSyncedToday: 12,
    iconName: 'Zap'
  },
  {
    id: 'int-5',
    name: 'Custom Webhook REST Endpoint',
    service: 'webhook',
    description: 'Menerima payload JSON aman berotentikasi HMAC SHA-256.',
    status: 'connected',
    lastSync: '30 menit yang lalu',
    eventsSyncedToday: 65,
    webhookUrl: 'https://sideoffar.cloud/api/v1/webhook/events',
    iconName: 'Webhook'
  },
  {
    id: 'int-6',
    name: 'SAP / Oracle ERP Bridge',
    service: 'sap_erp',
    description: 'Integrasi sistem perencanaan sumber daya perusahaan tingkat global.',
    status: 'disconnected',
    lastSync: 'Belum terhubung',
    eventsSyncedToday: 0,
    iconName: 'Database'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Peringatan Deadline Mendesak!',
    message: 'Tugas "Audit Keamanan Enkripsi End-to-End" jatuh tempo dalam 48 jam.',
    timestamp: '10 menit yang lalu',
    isRead: false,
    priority: 'urgent',
    type: 'deadline'
  },
  {
    id: 'notif-2',
    title: 'Wawasan Bicarafar AI',
    message: 'Diprediksi efisiensi tim meningkat +24% setelah restrukturisasi alur kerja Q3.',
    timestamp: '35 menit yang lalu',
    isRead: false,
    priority: 'info',
    type: 'ai'
  },
  {
    id: 'notif-3',
    title: 'Audit Keamanan Selesai',
    message: 'Semua berkas pada brankas E2E tervalidasi dengan sidik jari SHA-256.',
    timestamp: '2 jam yang lalu',
    isRead: true,
    priority: 'success',
    type: 'security'
  },
  {
    id: 'notif-4',
    title: 'Sinkronisasi Cloud Berhasil',
    message: '14 pembaruan offline berhasil direplikasi ke server sideoffar.cloud.',
    timestamp: '4 jam yang lalu',
    isRead: true,
    priority: 'info',
    type: 'sync'
  }
];

export const initialSecurityStatus: SecurityStatus = {
  twoFactorEnabled: true,
  twoFactorSecret: 'SOF-9824-BICA-7712',
  e2eEncryptionActive: true,
  encryptionKeyFingerprint: 'RSA-4096-SHA256:d8:a4:21:99:c2:4e:30:17:8b:2d:4c:90',
  lastAuditDate: '2026-09-15 22:00 UTC',
  securityScore: 98,
  activeSessions: [
    {
      id: 'sess-01',
      device: 'MacBook Pro 16" (Current Session)',
      location: 'Jakarta, Indonesia',
      ip: '103.144.17.42',
      current: true,
      lastActive: 'Aktif sekarang'
    },
    {
      id: 'sess-02',
      device: 'iPhone 15 Pro - Safari Mobile',
      location: 'Singapore',
      ip: '188.166.240.11',
      current: false,
      lastActive: '12 menit yang lalu'
    },
    {
      id: 'sess-03',
      device: 'Windows 11 Workstation',
      location: 'Bandung, Indonesia',
      ip: '36.88.21.109',
      current: false,
      lastActive: '3 jam yang lalu'
    }
  ]
};

export const predictiveMetrics: PredictiveMetric[] = [
  {
    category: 'Efisiensi Operasional',
    currentValue: 78,
    predictedValue: 92,
    unit: '%',
    trend: 'up',
    confidence: 94,
    recommendation: 'Otomatisasikan peninjauan dokumen via Bicarafar untuk memangkas jeda persetujuan 3.5 jam/hari.'
  },
  {
    category: 'Ketepatan Waktu Proyek',
    currentValue: 84,
    predictedValue: 96,
    unit: '%',
    trend: 'up',
    confidence: 89,
    recommendation: 'Alokasikan Alexandre Dubois untuk mendampingi review arsitektur sebelum H-2.'
  },
  {
    category: 'Beban Kerja Tim (Workload Risk)',
    currentValue: 71,
    predictedValue: 58,
    unit: '%',
    trend: 'down',
    confidence: 92,
    recommendation: 'Redistribusikan 2 tugas prioritas sedang dari Farhan Maulana ke Kenji Takahashi.'
  },
  {
    category: 'Skor Kepatuhan Enkripsi & E2E',
    currentValue: 98,
    predictedValue: 100,
    unit: '%',
    trend: 'up',
    confidence: 99,
    recommendation: 'Pertahankan kebijakan rotasi kunci otomatis 30 hari pada brankas sideoffar.cloud.'
  }
];

export const mockTasks = initialTasks;
export const mockTeamMembers = initialTeamMembers;
export const mockDocuments = initialDocuments;
export const mockIntegrations = initialIntegrations;
export const mockNotifications = initialNotifications;
export const securityStatus: SecurityStatus = {
  ...initialSecurityStatus,
  overallScore: 98,
  encryptionStandard: 'AES-256-GCM',
  lastAuditTimestamp: '15 Sep 2026, 22:00 UTC'
};

export const mockAuditLogs = [
  {
    id: 'log-1',
    actor: 'Farhan Maulana (Super Admin)',
    action: 'Rotasi Kunci HSM Asimetris & Ekspor Laporan E2E',
    timestamp: '16 Sep 2026, 13:30 WIB',
    ipAddress: '103.144.17.42',
    status: 'VERIFIED'
  },
  {
    id: 'log-2',
    actor: 'Siti Rahmawati (Manager)',
    action: 'Persetujuan Dokumen Keuangan Q3 & Penjadwalan Kalender',
    timestamp: '16 Sep 2026, 12:15 WIB',
    ipAddress: '103.144.17.44',
    status: 'VERIFIED'
  },
  {
    id: 'log-3',
    actor: 'Bicarafar AI Autonomous Daemon',
    action: 'Deteksi Bottleneck Alur Kerja & Notifikasi Rekomendasi Tim',
    timestamp: '16 Sep 2026, 11:00 WIB',
    ipAddress: 'sideoffar.cloud-internal-mesh',
    status: 'OPTIMIZED'
  },
  {
    id: 'log-4',
    actor: 'Kenji Takahashi (Developer)',
    action: 'Tes Koneksi Webhook REST API & Sinkronisasi Sprint',
    timestamp: '16 Sep 2026, 09:40 WIB',
    ipAddress: '36.88.21.109',
    status: 'VERIFIED'
  }
];

