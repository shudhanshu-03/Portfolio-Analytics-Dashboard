

export interface AlertPanelConfig {
  showSnoozed: boolean;
  minSeverity: 'info' | 'warning' | 'critical';
}

export const defaultAlertPanelConfig: AlertPanelConfig = {
  showSnoozed: false,
  minSeverity: 'info'
};

export const alertPanelConfigSchema = {
  type: 'object',
  properties: {
    showSnoozed: { type: 'boolean' },
    minSeverity: { type: 'string', enum: ['info', 'warning', 'critical'] }
  }
};
