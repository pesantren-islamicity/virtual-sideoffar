export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string; // YYYY-MM-DD
  assignee: string;
  assigneeAvatar?: string;
  tags: string[];
  estimatedHours: number;
  actualHours: number;
  synced: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  performanceScore: number; // 0-100%
  completedTasks: number;
  activeTasks: number;
  securityRole: UserRole;
  status: 'online' | 'busy' | 'away' | 'offline';
}

export type PermissionLevel = 'public_read' | 'team_collaborate' | 'restricted_mgmt' | 'e2e_confidential';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'financial' | 'contract' | 'report' | 'technical' | 'strategy';
  size: string;
  updatedAt: string;
  permission: PermissionLevel;
  owner: string;
  encryptedHash: string; // Simulated SHA-256 fingerprint
  isEncrypted: boolean;
  downloadUrl?: string;
}

export interface PredictiveMetric {
  category: string;
  currentValue: number;
  predictedValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number; // percentage
  recommendation: string;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  service: 'google_calendar' | 'google_sheets' | 'slack' | 'zapier' | 'webhook' | 'sap_erp';
  description: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  eventsSyncedToday: number;
  webhookUrl?: string;
  iconName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'urgent' | 'info' | 'success' | 'warning';
  type: 'deadline' | 'task' | 'security' | 'sync' | 'ai';
  actionUrl?: string;
}

export type UserRole = 'super_admin' | 'manager' | 'team_lead' | 'team_member' | 'guest_client';

export type LanguageCode = 'id' | 'en' | 'ar' | 'ja' | 'zh';

export interface BicarafarMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isAudioPlaying?: boolean;
  suggestedAction?: {
    type: 'create_task' | 'export_report' | 'sync_calendar' | 'encrypt_vault' | 'resolve_risk';
    label: string;
    payload?: any;
  };
  predictiveInsight?: {
    riskLevel: 'low' | 'medium' | 'high';
    headline: string;
    detail: string;
  };
}

export interface SecurityStatus {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  e2eEncryptionActive: boolean;
  encryptionKeyFingerprint: string;
  lastAuditDate: string;
  securityScore: number; // 0-100
  overallScore?: number;
  encryptionStandard?: string;
  lastAuditTimestamp?: string;
  activeSessions: {
    id: string;
    device: string;
    location: string;
    ip: string;
    current: boolean;
    lastActive: string;
  }[];
}

export type PushNotification = NotificationItem;

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingQueueCount: number;
  lastSyncedTimestamp: string;
  syncSuccessCount?: number;
}

export type DashboardCardId =
  | 'kpi-metrics'
  | 'project-analytics'
  | 'recent-tasks'
  | 'security-status'
  | 'team-performance'
  | 'cloud-sync';

export interface DashboardCardConfig {
  id: DashboardCardId;
  title: string;
  description: string;
  category: 'overview' | 'analytics' | 'security' | 'operations';
  columnSpan?: 'full' | 'half';
  visible?: boolean;
}

export type DashboardPresetId =
  | 'analyst'
  | 'manager'
  | 'quick_action'
  | 'security_compliance'
  | 'standard'
  | 'custom';

export interface DashboardPreset {
  id: DashboardPresetId;
  name: string;
  badge: string;
  description: string;
  cardOrder: DashboardCardId[];
  cardSpans?: Partial<Record<DashboardCardId, 'full' | 'half'>>;
}

export interface DashboardLayoutConfig {
  version: number;
  activePresetId: DashboardPresetId;
  cardOrder: DashboardCardId[];
  cardSpans: Record<DashboardCardId, 'full' | 'half'>;
  lastSaved: string;
  isCustom: boolean;
}

export interface QuickActionActivity {
  id: string;
  type: 'timer' | 'note' | 'meeting' | 'task';
  title: string;
  detail?: string;
  timestamp: string;
  createdAt: number;
}

