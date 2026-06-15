import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts';
import { useHoldings } from '../../hooks/useData';
import { transformHoldingsBySector, transformHoldingsByAssetClass } from '../../data/transformers';
import type { WidgetComponentProps } from '../../types/widget';
import type { PortfolioPieChartConfig } from './config';

// 12-color categorical palette
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#A28DFF', '#FF6B6B', '#4BC0C0', '#F06292',
  '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--foreground)" className="text-sm">{`₹${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--muted-foreground)" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const PortfolioPieChartWidget: React.FC<WidgetComponentProps<PortfolioPieChartConfig, unknown>> = ({ config }) => {
  const { data: holdings, isLoading, error } = useHoldings('P-001');
  const [activeIndex, setActiveIndex] = useState(0);

  const chartData = useMemo(() => {
    if (!holdings) return [];
    if (config.groupBy === 'sector') {
      return transformHoldingsBySector(holdings);
    }
    return transformHoldingsByAssetClass(holdings);
  }, [holdings, config.groupBy]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading...</div>;
  }

  if (error) {
    throw error; // Let ErrorBoundary catch it
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const PieComponent = Pie as any;

  return (
    <div className="w-full h-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <PieComponent
            activeIndex={activeIndex}
            activeShape={renderActiveShape as unknown}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={config.style === 'donut' ? '50%' : 0}
            outerRadius="70%"
            dataKey="value"
            onMouseEnter={onPieEnter}
            animationDuration={500}
            paddingAngle={config.style === 'donut' ? 2 : 0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </PieComponent>
          <Tooltip 
            formatter={(value: unknown) => `₹${Number(value).toLocaleString()}`} 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
          {config.showLabels && (
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(PortfolioPieChartWidget);
