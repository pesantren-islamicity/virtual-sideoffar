import { DashboardCardId, DashboardLayoutConfig, DashboardPresetId } from '../types';

export const DEFAULT_CARD_IDS: DashboardCardId[] = [
  'kpi-metrics',
  'project-analytics',
  'recent-tasks',
  'security-status',
  'team-performance',
  'cloud-sync'
];

export const DEFAULT_CARD_SPANS: Record<DashboardCardId, 'full' | 'half'> = {
  'kpi-metrics': 'full',
  'project-analytics': 'full',
  'recent-tasks': 'full',
  'security-status': 'half',
  'team-performance': 'half',
  'cloud-sync': 'half'
};

export const STORAGE_KEY_CONFIG = 'sof_dashboard_layout_config_v2';
export const STORAGE_KEY_ORDER = 'sof_dashboard_cards_order_v2';
export const STORAGE_KEY_SPAN = 'sof_dashboard_cards_span_v2';
export const STORAGE_KEY_PRESET = 'sof_dashboard_active_preset';

/**
 * Loads and validates the dashboard layout configuration from localStorage.
 * Automatically handles data recovery, schema migration, and missing cards.
 */
export function loadDashboardLayout(): DashboardLayoutConfig {
  try {
    // 1. Try to load from primary unified config
    const rawConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (rawConfig) {
      const parsed = JSON.parse(rawConfig);
      if (parsed && Array.isArray(parsed.cardOrder) && parsed.cardOrder.length > 0) {
        return sanitizeLayoutConfig(parsed);
      }
    }

    // 2. Fallback to legacy individual keys if primary config not yet populated
    const legacyOrderRaw = localStorage.getItem(STORAGE_KEY_ORDER);
    const legacySpanRaw = localStorage.getItem(STORAGE_KEY_SPAN);
    const legacyPreset = localStorage.getItem(STORAGE_KEY_PRESET) as DashboardPresetId | null;

    if (legacyOrderRaw) {
      const legacyOrder = JSON.parse(legacyOrderRaw);
      const legacySpans = legacySpanRaw ? JSON.parse(legacySpanRaw) : {};
      return sanitizeLayoutConfig({
        cardOrder: legacyOrder,
        cardSpans: legacySpans,
        activePresetId: legacyPreset || 'standard',
        isCustom: legacyPreset === 'custom'
      });
    }
  } catch (err) {
    console.warn('[DashboardStorage] Failed to read layout configuration from localStorage, falling back to defaults:', err);
  }

  // 3. Fallback: Default standard layout
  return getDefaultLayoutConfig();
}

/**
 * Sanitizes and fills in any missing cards or properties from a partial layout config
 */
export function sanitizeLayoutConfig(raw: Partial<DashboardLayoutConfig>): DashboardLayoutConfig {
  const validIds: DashboardCardId[] = [];
  if (Array.isArray(raw.cardOrder)) {
    raw.cardOrder.forEach(id => {
      if (DEFAULT_CARD_IDS.includes(id as DashboardCardId) && !validIds.includes(id as DashboardCardId)) {
        validIds.push(id as DashboardCardId);
      }
    });
  }

  // Append any default cards that were missing from storage
  DEFAULT_CARD_IDS.forEach(id => {
    if (!validIds.includes(id)) {
      validIds.push(id);
    }
  });

  // Ensure spans exist for each card
  const spans: Record<DashboardCardId, 'full' | 'half'> = { ...DEFAULT_CARD_SPANS };
  if (raw.cardSpans && typeof raw.cardSpans === 'object') {
    Object.entries(raw.cardSpans).forEach(([id, span]) => {
      if (DEFAULT_CARD_IDS.includes(id as DashboardCardId) && (span === 'full' || span === 'half')) {
        spans[id as DashboardCardId] = span;
      }
    });
  }

  const activePresetId: DashboardPresetId = raw.activePresetId || 'standard';
  const isCustom = raw.isCustom !== undefined
    ? raw.isCustom
    : JSON.stringify(validIds) !== JSON.stringify(DEFAULT_CARD_IDS);

  return {
    version: 2,
    activePresetId,
    cardOrder: validIds,
    cardSpans: spans,
    lastSaved: raw.lastSaved || new Date().toISOString(),
    isCustom
  };
}

/**
 * Returns default layout configuration
 */
export function getDefaultLayoutConfig(): DashboardLayoutConfig {
  return {
    version: 2,
    activePresetId: 'standard',
    cardOrder: [...DEFAULT_CARD_IDS],
    cardSpans: { ...DEFAULT_CARD_SPANS },
    lastSaved: new Date().toISOString(),
    isCustom: false
  };
}

/**
 * Persists the dashboard layout configuration to localStorage across all relevant keys.
 */
export function saveDashboardLayout(
  config: {
    cardOrder: DashboardCardId[];
    cardSpans: Record<DashboardCardId, 'full' | 'half'>;
    activePresetId: DashboardPresetId;
    isCustom?: boolean;
  }
): DashboardLayoutConfig {
  const fullConfig: DashboardLayoutConfig = {
    version: 2,
    activePresetId: config.activePresetId,
    cardOrder: config.cardOrder,
    cardSpans: config.cardSpans,
    lastSaved: new Date().toISOString(),
    isCustom: config.isCustom !== undefined
      ? config.isCustom
      : config.activePresetId === 'custom' || JSON.stringify(config.cardOrder) !== JSON.stringify(DEFAULT_CARD_IDS)
  };

  try {
    const serialized = JSON.stringify(fullConfig);
    // Write unified config
    localStorage.setItem(STORAGE_KEY_CONFIG, serialized);
    // Write legacy keys for backwards compatibility
    localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(fullConfig.cardOrder));
    localStorage.setItem(STORAGE_KEY_SPAN, JSON.stringify(fullConfig.cardSpans));
    localStorage.setItem(STORAGE_KEY_PRESET, fullConfig.activePresetId);

    // Dispatch event for in-page updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sof_dashboard_layout_updated', { detail: fullConfig }));
    }
  } catch (err) {
    console.error('[DashboardStorage] Error saving layout config to localStorage:', err);
  }

  return fullConfig;
}

/**
 * Resets the layout back to the default configuration and clears custom state.
 */
export function resetDashboardLayout(): DashboardLayoutConfig {
  const defaultConfig = getDefaultLayoutConfig();
  try {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_ORDER);
    localStorage.removeItem(STORAGE_KEY_SPAN);
    localStorage.setItem(STORAGE_KEY_PRESET, 'standard');

    // Also store the standard layout
    saveDashboardLayout(defaultConfig);
  } catch (err) {
    console.error('[DashboardStorage] Error resetting layout config in localStorage:', err);
  }
  return defaultConfig;
}
