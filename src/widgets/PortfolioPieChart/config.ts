

export interface PortfolioPieChartConfig {
  groupBy: 'sector' | 'assetClass';
  showLabels: boolean;
  style: 'pie' | 'donut';
}

export const defaultPieChartConfig: PortfolioPieChartConfig = {
  groupBy: 'sector',
  showLabels: true,
  style: 'donut'
};

export const pieChartConfigSchema = {
  type: 'object',
  properties: {
    groupBy: { type: 'string', enum: ['sector', 'assetClass'] },
    showLabels: { type: 'boolean' },
    style: { type: 'string', enum: ['pie', 'donut'] }
  }
};
