import { describe, it, expect } from 'vitest';
import { transformHoldingsBySector, transformPerformanceData, calculateTotalPnL } from '../data/transformers';
import { Holding } from '../types/data';

describe('Data Transformers', () => {
  const mockHoldings: Holding[] = [
    { holdingId: '1', ticker: 'A', name: 'A', sector: 'Tech', assetClass: 'Equity', quantity: 1, averageCost: 10, currentPrice: 20, marketValue: 100, dailyPnL: 10, dailyPnLPercent: 1, weight: 0.5, currency: 'USD' },
    { holdingId: '2', ticker: 'B', name: 'B', sector: 'Tech', assetClass: 'Equity', quantity: 1, averageCost: 10, currentPrice: 20, marketValue: 200, dailyPnL: -5, dailyPnLPercent: -1, weight: 0.5, currency: 'USD' },
    { holdingId: '3', ticker: 'C', name: 'C', sector: 'Finance', assetClass: 'Equity', quantity: 1, averageCost: 10, currentPrice: 20, marketValue: 150, dailyPnL: 20, dailyPnLPercent: 2, weight: 0.5, currency: 'USD' }
  ];

  it('transformHoldingsBySector should aggregate market values correctly', () => {
    const result = transformHoldingsBySector(mockHoldings);
    expect(result.length).toBe(2);
    expect(result.find(r => r.name === 'Tech')?.value).toBe(300); // 100 + 200
    expect(result.find(r => r.name === 'Finance')?.value).toBe(150);
  });

  it('calculateTotalPnL should sum daily PnL correctly', () => {
    const totalPnL = calculateTotalPnL(mockHoldings);
    expect(totalPnL).toBe(25); // 10 - 5 + 20
  });

  it('transformPerformanceData should calculate spread and format dates', () => {
    const rawData = [
      { date: '2023-01-01T00:00:00.000Z', value: 110, benchmark: 100 }
    ];
    const result = transformPerformanceData(rawData);
    expect(result[0].spread).toBe(10);
    expect(result[0].date).toBe('Jan 1');
  });
});
