

export interface PerformanceLineChartConfig {
  benchmark: string;
  dateRange: '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'MAX';
  logScale: boolean;
}

export const defaultLineChartConfig: PerformanceLineChartConfig = {
  benchmark: 'NIFTY 50',
  dateRange: '1Y',
  logScale: false
};

export const lineChartConfigSchema = {
  type: 'object',
  properties: {
    benchmark: { type: 'string', enum: ['NIFTY 50', 'S&P 500', 'CUSTOM'] },
    dateRange: { type: 'string', enum: ['1W', '1M', '3M', '6M', '1Y', 'YTD', 'MAX'] },
    logScale: { type: 'boolean' }
  }
};
