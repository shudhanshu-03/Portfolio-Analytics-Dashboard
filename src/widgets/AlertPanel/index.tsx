import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, Check, X, Bell } from 'lucide-react';
import { useAlerts } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { AlertPanelConfig } from './config';

export const AlertPanelWidget: React.FC<WidgetComponentProps<AlertPanelConfig, unknown>> = ({ config }) => {
  const { data: alerts, isLoading, error } = useAlerts();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = useMemo(() => {
    if (!alerts) return [];
    
    const severityOrder = { info: 0, warning: 1, critical: 2 };
    const minSev = severityOrder[config.minSeverity];

    return alerts
      .filter(a => severityOrder[a.severity] >= minSev)
      .filter(a => !dismissedIds.has(a.alertId))
      .filter(a => config.showSnoozed ? true : !snoozedIds.has(a.alertId))
      .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]); // highest severity first
  }, [alerts, config.minSeverity, config.showSnoozed, dismissedIds, snoozedIds]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading Alerts...</div>;
  }

  if (error) {
    throw error;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  const handleSnooze = (id: string) => {
    setSnoozedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="flex flex-col w-full h-full bg-card rounded overflow-hidden">
      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {visibleAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            
            return (
              <motion.div
                key={alert.alertId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`border rounded p-2 relative overflow-hidden group ${
                  isCritical ? 'bg-red-500/10 border-red-500/50' :
                  isWarning ? 'bg-amber-500/10 border-amber-500/50' :
                  'bg-blue-500/10 border-blue-500/50'
                }`}
              >
                {/* Critical Pulse */}
                {isCritical && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
                )}
                
                <div className="flex justify-between items-start mb-1 pl-2">
                  <div className="flex space-x-2 items-center">
                    {isCritical && <AlertCircle size={12} className="text-red-500" />}
                    {isWarning && <Bell size={12} className="text-amber-500" />}
                    {!isCritical && !isWarning && <Bell size={12} className="text-blue-500" />}
                    
                    <span className={`text-[10px] font-bold uppercase ${
                      isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-blue-500'
                    }`}>
                      {alert.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{new Date(alert.triggeredAt).toLocaleTimeString()}</span>
                </div>
                
                <p className="text-xs text-foreground pl-2">{alert.message}</p>
                
                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleSnooze(alert.alertId)}
                    className="flex items-center space-x-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-1.5 py-0.5 rounded"
                  >
                    <Clock size={10} />
                    <span>Snooze</span>
                  </button>
                  <button 
                    onClick={() => handleDismiss(alert.alertId)}
                    className="flex items-center space-x-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-1.5 py-0.5 rounded"
                  >
                    <Check size={10} />
                    <span>Dismiss</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {visibleAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-8">
            <Check size={24} className="mb-2 opacity-50" />
            <span className="text-xs font-semibold">All clear</span>
            <span className="text-[10px]">No active alerts</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AlertPanelWidget);
