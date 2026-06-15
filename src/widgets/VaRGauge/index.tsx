import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRiskMetrics } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { VaRGaugeConfig } from './config';

export const VaRGaugeWidget: React.FC<WidgetComponentProps<VaRGaugeConfig, unknown>> = ({ config }) => {
  const { data: riskMetrics, isLoading, error } = useRiskMetrics('P-001');

  const { value, limit, percentage } = useMemo(() => {
    if (!riskMetrics) return { value: 0, limit: 100, percentage: 0 };
    // In a real app we'd use config.confidenceLevel and method to pick the correct metric
    // For now, let's derive a mock value based on the risk metrics
    const varValue = Math.abs(riskMetrics.historicalVaR); 
    const limitValue = varValue * 1.5; // Derive a mock limit if none exists
    const pct = Math.min(100, (varValue / limitValue) * 100);
    return { value: varValue, limit: limitValue, percentage: pct };
  }, [riskMetrics, config]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading VaR...</div>;
  }

  if (error) {
    throw error;
  }

  // Calculate needle angle (-90 to 90 degrees)
  const angle = -90 + (percentage / 100) * 180;
  
  // Determine color zone
  const isDanger = percentage > 90;
  const isWarning = percentage > 70 && percentage <= 90;
  const colorClass = isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-green-500';
  const fillPath = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative overflow-hidden bg-card">
      <div className="relative w-48 h-24 mb-2">
        {/* Background Arc */}
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Green Zone (0-70%) */}
          <path
            d="M 10 50 A 40 40 0 0 1 34.72 18.54"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-50"
          />
          {/* Amber Zone (70-90%) */}
          <path
            d="M 34.72 18.54 A 40 40 0 0 1 74.28 18.54"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-50"
          />
          {/* Red Zone (90-100%) */}
          <path
            d="M 74.28 18.54 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-50"
          />

          {/* Value Arc overlay */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={fillPath}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * percentage) / 100}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-foreground origin-bottom rounded-full z-10"
          style={{ x: '-50%', y: '10%' }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        >
          {/* Needle Base */}
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-card" />
        </motion.div>
      </div>

      <div className="text-center z-20">
        <h3 className={`text-2xl font-bold tracking-tight ${colorClass}`}>
          ₹{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </h3>
        <p className="text-xs text-muted-foreground uppercase font-bold mt-1">
          {config.confidenceLevel}% {config.calculationMethod} VaR
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Limit: ₹{limit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
};

export default React.memo(VaRGaugeWidget);
