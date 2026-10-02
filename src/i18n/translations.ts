import { LanguageCode } from '../types';

export const translations: Record<LanguageCode, {
  appName: string;
  assistantName: string;
  tagline: string;
  nav: {
    dashboard: string;
    assistant: string;
    tasks: string;
    calendar: string;
    vault: string;
    analytics: string;
    integrations: string;
    security: string;
  };
  common: {
    online: string;
    offline: string;
    offlineMode: string;
    offlineNotice: string;
    syncedJustNow: string;
    syncing: string;
    syncNow: string;
    pendingQueue: string;
    notifications: string;
    markAllRead: string;
    darkMode: string;
    lightMode: string;
    role: string;
    language: string;
    exportPdf: string;
    exportSheets: string;
    close: string;
    save: string;
    cancel: string;
    search: string;
    filter: string;
    active: string;
    status: string;
    priority: string;
    deadline: string;
    assignee: string;
    actions: string;
  };
  assistant: {
    greeting: string;
    subtitle: string;
    inputPlaceholder: string;
    listening: string;
    speakVoice: string;
    stopVoice: string;
    suggestedActions: string;
    predictiveBadge: string;
    quickPrompts: {
      optimize: string;
      riskAnalysis: string;
      createTask: string;
      summarize: string;
    };
  };
  tasks: {
    title: string;
    subtitle: string;
    kanbanTab: string;
    listTab: string;
    calendarTab: string;
    newTask: string;
    exportIcs: string;
    syncGoogleCal: string;
    todo: string;
    inProgress: string;
    review: string;
    completed: string;
  };
  vault: {
    title: string;
    subtitle: string;
    e2eBadge: string;
    uploadDoc: string;
    shaFingerprint: string;
    permissions: string;
    downloadEncrypted: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    efficiencyBoost: string;
    taskVelocity: string;
    completionProb: string;
    predictiveRisk: string;
    teamPerformance: string;
  };
  security: {
    title: string;
    subtitle: string;
    score: string;
    twoFactor: string;
    twoFactorDesc: string;
    e2eEnc: string;
    e2eDesc: string;
    activeSessions: string;
    rbacTitle: string;
  };
}> = {
  id: {
    appName: "sideoffar.cloud",
    assistantName: "Bicarafar AI",
    tagline: "Sistem Manajemen Bisnis Terpusat & Asisten AI Otomatis",
    nav: {
      dashboard: "Dasbor Utama",
      assistant: "Asisten Bicarafar",
      tasks: "Manajemen Tugas",
      calendar: "Kalender Tim",
      vault: "Brankas Dokumen E2E",
      analytics: "Analitik Prediktif",
      integrations: "Integrasi API",
      security: "Keamanan & 2FA"
    },
    common: {
      online: "Terhubung (Cloud Aktif)",
      offline: "Mode Luring (Offline)",
      offlineMode: "Simulasi Luring",
      offlineNotice: "Bekerja secara lokal. Perubahan akan disinkronkan otomatis saat terhubung kembali.",
      syncedJustNow: "Tersinkronisasi baru saja",
      syncing: "Sedang Menyinkronkan...",
      syncNow: "Sinkronkan Sekarang",
      pendingQueue: "antrean tunda",
      notifications: "Notifikasi Real-time",
      markAllRead: "Tandai Semua Dibaca",
      darkMode: "Mode Gelap",
      lightMode: "Mode Terang",
      role: "Peran Pengguna",
      language: "Bahasa",
      exportPdf: "Ekspor PDF",
      exportSheets: "Ekspor Google Sheets / CSV",
      close: "Tutup",
      save: "Simpan",
      cancel: "Batal",
      search: "Cari data, tugas, dokumen...",
      filter: "Filter",
      active: "Aktif",
      status: "Status",
      priority: "Prioritas",
      deadline: "Tenggat Waktu",
      assignee: "Penanggung Jawab",
      actions: "Aksi"
    },
    assistant: {
      greeting: "Halo! Saya Bicarafar, asisten cerdas sideoffar.cloud siap mengoptimalkan alur kerja bisnis Anda.",
      subtitle: "Didukung AI mutakhir dengan analisis prediktif real-time dan otomasi tugas global.",
      inputPlaceholder: "Tanyakan apapun pada Bicarafar, atau perintahkan otomasi alur kerja...",
      listening: "Mendengarkan suara Anda...",
      speakVoice: "Dengarkan Jawaban (Suara)",
      stopVoice: "Hentikan Suara",
      suggestedActions: "Rekomendasi Otomasi Cerdas",
      predictiveBadge: "Wawasan Prediktif",
      quickPrompts: {
        optimize: "Optimasi Alur Kerja Proyek",
        riskAnalysis: "Analisis Risiko Deadline Q3",
        createTask: "Buat Tugas Audit Keamanan",
        summarize: "Ringkas Performa Tim Minggu Ini"
      }
    },
    tasks: {
      title: "Kolaborasi Tugas & Alur Kerja",
      subtitle: "Manajemen tugas terpadu dengan sinkronisasi kalender real-time",
      kanbanTab: "Papan Kanban",
      listTab: "Daftar Terstruktur",
      calendarTab: "Jadwal Kalender",
      newTask: "Tambah Tugas Baru",
      exportIcs: "Ekspor Kalender (.ics)",
      syncGoogleCal: "Sinkronkan Google Calendar",
      todo: "Belum Dikerjakan",
      inProgress: "Sedang Dikerjakan",
      review: "Dalam Peninjauan",
      completed: "Selesai"
    },
    vault: {
      title: "Brankas Dokumen & Berbagi Berizin",
      subtitle: "Penyimpanan dokumen terenkripsi end-to-end dengan kontrol hak akses granular",
      e2eBadge: "Enkripsi AES-256 Aktif",
      uploadDoc: "Unggah Dokumen Baru",
      shaFingerprint: "Sidik Jari Kriptografi",
      permissions: "Tingkat Izin",
      downloadEncrypted: "Buka / Unduh Berkas"
    },
    analytics: {
      title: "Dasbor Analitik Prediktif & KPI",
      subtitle: "Wawasan operasional mendalam bertenaga machine learning untuk manajemen",
      efficiencyBoost: "Peningkatan Efisiensi Alur Kerja",
      taskVelocity: "Kecepatan Tim (Task Velocity)",
      completionProb: "Probabilitas Tepat Waktu Proyek",
      predictiveRisk: "Prediksi Titik Kemacetan (Bottleneck)",
      teamPerformance: "Analitik Performa Setiap Anggota Tim"
    },
    security: {
      title: "Keamanan Enterprise & Hak Akses (RBAC)",
      subtitle: "Proteksi data menyeluruh dengan autentikasi dua faktor (2FA) dan audit berkala",
      score: "Skor Keamanan Sistem",
      twoFactor: "Autentikasi Dua Faktor (2FA)",
      twoFactorDesc: "Lindungi akun Anda dengan kode TOTP 6-digit saat masuk.",
      e2eEnc: "Enkripsi End-to-End (E2E)",
      e2eDesc: "Semua pesan dan dokumen dienkripsi pada perangkat sebelum dikirim ke cloud.",
      activeSessions: "Sesi Perangkat Aktif",
      rbacTitle: "Matriks Akses Berbasis Peran"
    }
  },
  en: {
    appName: "sideoffar.cloud",
    assistantName: "Bicarafar AI",
    tagline: "Centralized Business Workspace & Automated AI Assistant",
    nav: {
      dashboard: "Main Dashboard",
      assistant: "Bicarafar Assistant",
      tasks: "Task Management",
      calendar: "Team Calendar",
      vault: "E2E Document Vault",
      analytics: "Predictive Analytics",
      integrations: "API Integrations",
      security: "Security & 2FA"
    },
    common: {
      online: "Connected (Cloud Active)",
      offline: "Offline Mode",
      offlineMode: "Simulate Offline",
      offlineNotice: "Working locally. Modifications will auto-sync upon reconnection.",
      syncedJustNow: "Synced just now",
      syncing: "Syncing with Cloud...",
      syncNow: "Sync Now",
      pendingQueue: "queued changes",
      notifications: "Real-time Notifications",
      markAllRead: "Mark All Read",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      role: "User Role",
      language: "Language",
      exportPdf: "Export PDF",
      exportSheets: "Export Google Sheets / CSV",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      search: "Search data, tasks, documents...",
      filter: "Filter",
      active: "Active",
      status: "Status",
      priority: "Priority",
      deadline: "Deadline",
      assignee: "Assignee",
      actions: "Actions"
    },
    assistant: {
      greeting: "Hello! I am Bicarafar, your sideoffar.cloud intelligent assistant ready to optimize your workflow.",
      subtitle: "Powered by modern AI with real-time predictive insights and global workflow automation.",
      inputPlaceholder: "Ask Bicarafar anything or issue workflow automation commands...",
      listening: "Listening to voice input...",
      speakVoice: "Read Aloud (Voice)",
      stopVoice: "Stop Audio",
      suggestedActions: "Smart Automation Actions",
      predictiveBadge: "Predictive Insight",
      quickPrompts: {
        optimize: "Optimize Project Workflow",
        riskAnalysis: "Q3 Deadline Risk Analysis",
        createTask: "Create Security Audit Task",
        summarize: "Summarize Team Performance"
      }
    },
    tasks: {
      title: "Collaborative Tasks & Workflows",
      subtitle: "Unified task board with real-time calendar synchronization",
      kanbanTab: "Kanban Board",
      listTab: "Structured List",
      calendarTab: "Calendar Schedule",
      newTask: "Create New Task",
      exportIcs: "Export Calendar (.ics)",
      syncGoogleCal: "Sync Google Calendar",
      todo: "To Do",
      inProgress: "In Progress",
      review: "In Review",
      completed: "Completed"
    },
    vault: {
      title: "Secure Document Vault & Permission Sharing",
      subtitle: "End-to-end encrypted storage with granular permission access controls",
      e2eBadge: "AES-256 GCM Encryption Active",
      uploadDoc: "Upload New Document",
      shaFingerprint: "Cryptographic Fingerprint",
      permissions: "Permission Level",
      downloadEncrypted: "Unlock / Download File"
    },
    analytics: {
      title: "Predictive Analytics & KPI Dashboard",
      subtitle: "In-depth machine learning operational metrics for executive management",
      efficiencyBoost: "Workflow Efficiency Gain",
      taskVelocity: "Team Task Velocity",
      completionProb: "On-Time Completion Probability",
      predictiveRisk: "Predicted Operational Bottlenecks",
      teamPerformance: "Visual Performance per Team Member"
    },
    security: {
      title: "Enterprise Security & Role-Based Access (RBAC)",
      subtitle: "End-to-end encryption, two-factor authentication (2FA), and active audit trails",
      score: "System Security Rating",
      twoFactor: "Two-Factor Authentication (2FA)",
      twoFactorDesc: "Enforce 6-digit TOTP code verification on every authentication request.",
      e2eEnc: "End-to-End Encryption (E2E)",
      e2eDesc: "All confidential records are encrypted on client devices before cloud replication.",
      activeSessions: "Active Device Sessions",
      rbacTitle: "Role-Based Access Control Matrix"
    }
  },
  ar: {
    appName: "sideoffar.cloud",
    assistantName: "المساعد الذكي Bicarafar",
    tagline: "مساحة العمل السحابية المركزية والمساعد الذكي لإدارة الأعمال",
    nav: {
      dashboard: "لوحة التحكم",
      assistant: "مساعد Bicarafar",
      tasks: "إدارة المهام",
      calendar: "تقويم الفريق",
      vault: "خزينة المستندات المشفرة",
      analytics: "التحليلات التنبؤية",
      integrations: "تكامل واجهات API",
      security: "الأمان والمصادقة الثنائية"
    },
    common: {
      online: "متصل بالإنترنت",
      offline: "وضع عدم الاتصال",
      offlineMode: "محاكاة عدم الاتصال",
      offlineNotice: "تعمل محلياً. ستتم المزامنة التلقائية فور عودة الاتصال.",
      syncedJustNow: "تمت المزامنة للتو",
      syncing: "جاري المزامنة...",
      syncNow: "مزامنة الآن",
      pendingQueue: "تغييرات معلقة",
      notifications: "الإشعارات اللحظية",
      markAllRead: "تحديد الكل كمقروء",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع المضيء",
      role: "الدور",
      language: "اللغة",
      exportPdf: "تصدير PDF",
      exportSheets: "تصدير Google Sheets / CSV",
      close: "إغلاق",
      save: "حفظ",
      cancel: "إلغاء",
      search: "بحث في البيانات والمهام...",
      filter: "تصفية",
      active: "نشط",
      status: "الحالة",
      priority: "الأولوية",
      deadline: "الموعد النهائي",
      assignee: "المسؤول",
      actions: "الإجراءات"
    },
    assistant: {
      greeting: "أهلاً بك! أنا Bicarafar، مساعدك الذكي في sideoffar.cloud لتحسين تدفقات العمل المؤسسية.",
      subtitle: "مدعوم بأحدث تقنيات الذكاء الاصطناعي والتحليلات التنبؤية اللحظية.",
      inputPlaceholder: "اطلب أي شيء من Bicarafar أو أصدر أوامر الأتمتة...",
      listening: "جاري الاستماع...",
      speakVoice: "تشغيل الصوت",
      stopVoice: "إيقاف الصوت",
      suggestedActions: "إجراءات مقترحة",
      predictiveBadge: "رؤية تنبؤية",
      quickPrompts: {
        optimize: "تحسين تدفق العمل",
        riskAnalysis: "تحليل مخاطر المواعيد النهائية",
        createTask: "إنشاء مهمة تدقيق أمني",
        summarize: "ملخص أداء الفريق"
      }
    },
    tasks: {
      title: "إدارة المهام والتعاون",
      subtitle: "لوحة موحدة متزامنة مع التقويم في الوقت الفعلي",
      kanbanTab: "لوحة كانبان",
      listTab: "قائمة منظمة",
      calendarTab: "التقويم الزمني",
      newTask: "مهمة جديدة",
      exportIcs: "تصدير (.ics)",
      syncGoogleCal: "مزامنة تقويم Google",
      todo: "قيد الانتظار",
      inProgress: "قيد التنفيذ",
      review: "قيد المراجعة",
      completed: "مكتمل"
    },
    vault: {
      title: "خزينة المستندات المشفرة",
      subtitle: "تخزين مشفر من طرف إلى طرف (E2E) مع تحكم كامل بالصلاحيات",
      e2eBadge: "تشفير AES-256 مفعّل",
      uploadDoc: "رفع مستند جديد",
      shaFingerprint: "البصمة التشفيرية",
      permissions: "مستوى الأذونات",
      downloadEncrypted: "فتح / تنزيل"
    },
    analytics: {
      title: "التحليلات التنبؤية ومؤشرات الأداء",
      subtitle: "رؤى تشغيلية مدعومة بالذكاء الاصطناعي لفريق الإدارة",
      efficiencyBoost: "زيادة الكفاءة التشغيلية",
      taskVelocity: "سرعة إنجاز المهام",
      completionProb: "احتمالية الإنجاز في الوقت المحدد",
      predictiveRisk: "توقع الاختناقات التشغيلية",
      teamPerformance: "أداء أعضاء الفريق"
    },
    security: {
      title: "الأمان المؤسسي والتحكم بالوصول (RBAC)",
      subtitle: "تشفير شامل، ومصادقة ثنائية (2FA)، وتتبع نشاط الجلسات",
      score: "تقييم أمان النظام",
      twoFactor: "المصادقة الثنائية (2FA)",
      twoFactorDesc: "حماية إضافية برمز TOTP من 6 أرقام.",
      e2eEnc: "التشفير من طرف إلى طرف",
      e2eDesc: "تشفير جميع المستندات الحساسة على جهازك مباشرة.",
      activeSessions: "الجلسات النشطة",
      rbacTitle: "مصفوفة الأدوار والصلاحيات"
    }
  },
  ja: {
    appName: "sideoffar.cloud",
    assistantName: "Bicarafar AI",
    tagline: "統合ビジネスワークスペース＆自律型AIアシスタント",
    nav: {
      dashboard: "メインダッシュボード",
      assistant: "Bicarafar AI",
      tasks: "タスク管理",
      calendar: "チームカレンダー",
      vault: "暗号化ドキュメント保管庫",
      analytics: "予測アナリティクス",
      integrations: "API連携",
      security: "セキュリティ＆2FA"
    },
    common: {
      online: "接続中 (クラウド稼働)",
      offline: "オフラインモード",
      offlineMode: "オフライン試行",
      offlineNotice: "ローカル作業中。再接続時に自動同期されます。",
      syncedJustNow: "同期完了",
      syncing: "同期中...",
      syncNow: "今すぐ同期",
      pendingQueue: "保留中の変更",
      notifications: "リアルタイム通知",
      markAllRead: "すべて既読にする",
      darkMode: "ダークモード",
      lightMode: "ライトモード",
      role: "ユーザー権限",
      language: "言語",
      exportPdf: "PDF出力",
      exportSheets: "Googleスプレッドシート / CSV出力",
      close: "閉じる",
      save: "保存",
      cancel: "キャンセル",
      search: "検索...",
      filter: "絞り込み",
      active: "有効",
      status: "ステータス",
      priority: "優先度",
      deadline: "期日",
      assignee: "担当者",
      actions: "操作"
    },
    assistant: {
      greeting: "こんにちは！sideoffar.cloudのAIアシスタントBicarafarです。ビジネスワークフローを最適化します。",
      subtitle: "最先端AIとリアルタイム予測分析によるグローバルタスク自動化基盤。",
      inputPlaceholder: "Bicarafarに質問、または自動化コマンドを入力...",
      listening: "音声を認識中...",
      speakVoice: "音声読み上げ",
      stopVoice: "停止",
      suggestedActions: "AI自動化提案",
      predictiveBadge: "予測インサイト",
      quickPrompts: {
        optimize: "ワークフロー最適化",
        riskAnalysis: "Q3期日リスク分析",
        createTask: "セキュリティ監査タスク作成",
        summarize: "チーム実績サマリー"
      }
    },
    tasks: {
      title: "タスク管理＆協働ワークフロー",
      subtitle: "カレンダーとシームレスに同期する統合タスクボード",
      kanbanTab: "カンバン",
      listTab: "リスト",
      calendarTab: "カレンダー",
      newTask: "新規タスク作成",
      exportIcs: "カレンダー出力 (.ics)",
      syncGoogleCal: "Googleカレンダー同期",
      todo: "未着手",
      inProgress: "進行中",
      review: "レビュー中",
      completed: "完了"
    },
    vault: {
      title: "暗号化ドキュメント保管庫",
      subtitle: "AES-256エンドツーエンド暗号化と厳格な権限管理",
      e2eBadge: "E2E暗号化有効",
      uploadDoc: "書類をアップロード",
      shaFingerprint: "暗号フィンガープリント",
      permissions: "アクセス権限",
      downloadEncrypted: "復号してダウンロード"
    },
    analytics: {
      title: "予測アナリティクス＆KPI",
      subtitle: "機械学習に基づく経営陣向け運用洞察",
      efficiencyBoost: "業務効率改善率",
      taskVelocity: "タスク処理速度",
      completionProb: "期限内完了確率",
      predictiveRisk: "ボトルネック予測",
      teamPerformance: "メンバー別パフォーマンス分析"
    },
    security: {
      title: "企業セキュリティ＆RBAC",
      subtitle: "E2E暗号化、二要素認証(2FA)、アクセスログ監査",
      score: "セキュリティスコア",
      twoFactor: "二要素認証 (2FA)",
      twoFactorDesc: "TOTP認証コードによる厳格なログイン保護。",
      e2eEnc: "エンドツーエンド暗号化",
      e2eDesc: "データは端末側で暗号化されてからクラウドへ同期されます。",
      activeSessions: "アクティブセッション",
      rbacTitle: "ロールベースアクセス制御"
    }
  },
  zh: {
    appName: "sideoffar.cloud",
    assistantName: "Bicarafar 智能助手",
    tagline: "集中式企业工作空间与智能工作流自动化平台",
    nav: {
      dashboard: "主控制台",
      assistant: "Bicarafar 助手",
      tasks: "任务协作",
      calendar: "团队日历",
      vault: "E2E加密文档库",
      analytics: "预测分析",
      integrations: "API集成",
      security: "安全与2FA"
    },
    common: {
      online: "已连接 (云端活跃)",
      offline: "离线模式",
      offlineMode: "模拟离线",
      offlineNotice: "当前处于本地模式，网络恢复后将自动同步。",
      syncedJustNow: "刚刚同步",
      syncing: "正在同步到云端...",
      syncNow: "立即同步",
      pendingQueue: "项待同步变更",
      notifications: "实时通知",
      markAllRead: "标记为已读",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      role: "用户角色",
      language: "语言",
      exportPdf: "导出PDF报告",
      exportSheets: "导出Google表格 / CSV",
      close: "关闭",
      save: "保存",
      cancel: "取消",
      search: "搜索任务、数据、文档...",
      filter: "筛选",
      active: "启用",
      status: "状态",
      priority: "优先级",
      deadline: "截止日期",
      assignee: "负责人",
      actions: "操作"
    },
    assistant: {
      greeting: "您好！我是 Bicarafar，您的 sideoffar.cloud 智能业务助手，随时协助优化企业工作流。",
      subtitle: "集成先进AI模型与实时预测分析，助力全球业务协同与效率飞跃。",
      inputPlaceholder: "向 Bicarafar 提问或下达业务自动化指令...",
      listening: "正在倾听语音输入...",
      speakVoice: "语音朗读",
      stopVoice: "停止朗读",
      suggestedActions: "智能自动化建议",
      predictiveBadge: "预测洞察",
      quickPrompts: {
        optimize: "优化当前项目工作流",
        riskAnalysis: "Q3项目延期风险分析",
        createTask: "创建安全合规审计任务",
        summarize: "总结团队本周产出"
      }
    },
    tasks: {
      title: "协作任务与工作流",
      subtitle: "统一看板管理，并与日历系统实时保持同步",
      kanbanTab: "看板视图",
      listTab: "结构化列表",
      calendarTab: "日程视图",
      newTask: "新建任务",
      exportIcs: "导出日历 (.ics)",
      syncGoogleCal: "同步到Google日历",
      todo: "待办",
      inProgress: "进行中",
      review: "审核中",
      completed: "已完成"
    },
    vault: {
      title: "安全加密文档库与权限分享",
      subtitle: "端到端AES-256加密存储，支持细粒度权限管控",
      e2eBadge: "E2E加密防护已启用",
      uploadDoc: "上传新文档",
      shaFingerprint: "加密指纹",
      permissions: "权限级别",
      downloadEncrypted: "解密并下载"
    },
    analytics: {
      title: "预测分析与KPI指标看板",
      subtitle: "基于机器学习的业务洞察，专为管理层决策打造",
      efficiencyBoost: "流程效率提升度",
      taskVelocity: "团队任务流速",
      completionProb: "准时交付成功率",
      predictiveRisk: "潜在瓶颈预警",
      teamPerformance: "团队成员效能全景"
    },
    security: {
      title: "企业级安全与权限控制 (RBAC)",
      subtitle: "端到端加密、双重认证(2FA)与会话审计日志",
      score: "系统综合安全评分",
      twoFactor: "双重身份验证 (2FA)",
      twoFactorDesc: "登录时需输入6位动态TOTP验证码保障账户安全。",
      e2eEnc: "端到端加密防护",
      e2eDesc: "数据在离开客户端之前全部完成加密封包。",
      activeSessions: "当前活动设备",
      rbacTitle: "角色权限控制矩阵"
    }
  }
};
