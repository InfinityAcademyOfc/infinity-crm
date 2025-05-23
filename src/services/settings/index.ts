
// Re-export all types
export * from './types';

// Re-export all functionality from individual modules
export * from './userSettings';
export * from './dashboardSettings';
export * from './automationSettings';
export * from './themeUtils';
export * from './securitySettings';

// Group all functions into settingsService for backward compatibility
import { getUserSettings, createOrUpdateUserSettings } from './userSettings';
import { saveDashboardConfig } from './dashboardSettings';
import { saveAutomationRules } from './automationSettings';
import { applyTheme } from './themeUtils';
import { updatePassword } from './securitySettings';

export const settingsService = {
  getUserSettings,
  createOrUpdateUserSettings,
  saveDashboardConfig,
  saveAutomationRules,
  applyTheme,
  updatePassword
};
