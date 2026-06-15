import { Holding } from '../types/data';

/**
 * Transforms raw holdings data into a format suitable for the sector allocation pie chart.
 */
export const transformHoldingsBySector = (holdings: Holding[]) => {
  const sectorMap = new Map<string, number>();
  
  holdings.forEach(h => {
    const current = sectorMap.get(h.sector) || 0;
    sectorMap.set(h.sector, current + h.marketValue);
  });

  return Array.from(sectorMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Transforms raw holdings data into a format suitable for the asset class allocation pie chart.
 */
export const transformHoldingsByAssetClass = (holdings: Holding[]) => {
  const assetMap = new Map<string, number>();
  
  holdings.forEach(h => {
    const current = assetMap.get(h.assetClass) || 0;
    assetMap.set(h.assetClass, current + h.marketValue);
  });

  return Array.from(assetMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Calculates total PnL from an array of holdings.
 */
export const calculateTotalPnL = (holdings: Holding[]) => {
  return holdings.reduce((sum, h) => sum + h.dailyPnL, 0);
};

/**
 * Normalizes raw performance time series data to ensure consistent date formatting
 * and calculates the spread between portfolio value and benchmark.
 */
export const transformPerformanceData = (data: { date: string, value: number, benchmark: number }[]) => {
  return data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    spread: Number((d.value - d.benchmark).toFixed(2))
  }));
};
