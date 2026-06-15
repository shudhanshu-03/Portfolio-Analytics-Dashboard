import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush 
} from 'recharts';
import { usePerformance } from '../../hooks/useData';
import { transformPerformanceData } from '../../data/transformers';
import type { WidgetComponentProps } from '../../types/widget';
import type { PerformanceLineChartConfig } from './config';

export const PerformanceLineChartWidget: React.FC<WidgetComponentProps<PerformanceLineChartConfig, unknown>> = ({ config }) => {
  const { data: rawPerformance, isLoading, error } = usePerformance('P-001');

  const chartData = useMemo(() => {
    if (!rawPerformance) return [];
    return transformPerformanceData(rawPerformance);
  }, [rawPerformance]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading Chart...</div>;
  }

  if (error) {
    throw error;
  }

  return (
    <div className="w-full h-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted-foreground)" 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
            tickLine={false}
          />
          <YAxis 
            scale={config.logScale ? "log" : "auto"} 
            domain={['auto', 'auto']} 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(val) => `₹${val.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            formatter={(value: unknown) => `₹${Number(value).toLocaleString()}`}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Portfolio NAV" 
            stroke="var(--primary)" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            name={config.benchmark} 
            stroke="var(--muted-foreground)" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }} 
          />
          <Brush 
            dataKey="date" 
            height={30} 
            stroke="var(--primary)" 
            fill="var(--card)"
            travellerWidth={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(PerformanceLineChartWidget);
