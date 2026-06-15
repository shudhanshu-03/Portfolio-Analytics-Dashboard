import { PortfolioSummary, Holding, NewsArticle, Alert, MarketTicker } from '../types/data';

// Helper to simulate network latency
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const baseHoldings: Holding[] = [
  { holdingId: 'h1', ticker: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy', assetClass: 'Equity', quantity: 150000, averageCost: 2400, currentPrice: 2850, marketValue: 427500000, dailyPnL: 3750000, dailyPnLPercent: 0.88, weight: 0.15, currency: 'INR' },
  { holdingId: 'h2', ticker: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Technology', assetClass: 'Equity', quantity: 80000, averageCost: 3200, currentPrice: 3950, marketValue: 316000000, dailyPnL: -1200000, dailyPnLPercent: -0.38, weight: 0.11, currency: 'INR' },
  { holdingId: 'h3', ticker: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Financials', assetClass: 'Equity', quantity: 250000, averageCost: 1500, currentPrice: 1680, marketValue: 420000000, dailyPnL: 5000000, dailyPnLPercent: 1.20, weight: 0.15, currency: 'INR' },
  { holdingId: 'h4', ticker: 'INFY.NS', name: 'Infosys', sector: 'Technology', assetClass: 'Equity', quantity: 120000, averageCost: 1400, currentPrice: 1480, marketValue: 177600000, dailyPnL: 850000, dailyPnLPercent: 0.48, weight: 0.06, currency: 'INR' },
  { holdingId: 'h5', ticker: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Financials', assetClass: 'Equity', quantity: 300000, averageCost: 850, currentPrice: 1050, marketValue: 315000000, dailyPnL: 2100000, dailyPnLPercent: 0.67, weight: 0.11, currency: 'INR' },
];

export const fetchPortfolioSummary = async (id: string): Promise<PortfolioSummary> => {
  await delay(200);
  return {
    portfolioId: id,
    name: 'Meridian India Alpha Fund',
    aum: 45000000000, // 45 Billion USD equivalent approx
    dailyPnL: 350000000,
    dailyPnLPercent: 0.78,
    mtdReturn: 2.45,
    ytdReturn: 14.2,
    sharpeRatio: 1.85,
    benchmark: 'NIFTY 50',
    lastUpdated: new Date().toISOString()
  };
};

export const fetchHoldings = async (id: string): Promise<Holding[]> => {
  await delay(300);
  return baseHoldings;
};

export const fetchPerformance = async (id: string): Promise<{ date: string, value: number, benchmark: number }[]> => {
  await delay(250);
  const data = [];
  let value = 100;
  let benchmark = 100;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      value: value,
      benchmark: benchmark
    });
    // Random walk
    value = value * (1 + (Math.random() * 0.04 - 0.015)); // Slight upward bias
    benchmark = benchmark * (1 + (Math.random() * 0.03 - 0.012));
  }
  return data;
};

export const fetchRiskMetrics = async (id: string): Promise<{ historicalVaR: number, parametricVaR: number, stressTestLoss: number }> => {
  await delay(150);
  return {
    historicalVaR: 5200000,
    parametricVaR: 4800000,
    stressTestLoss: 15000000 // e.g. 2008 crash scenario
  };
};

export const fetchMarketOverview = async (): Promise<MarketTicker[]> => {
  await delay(100);
  return [
    { symbol: 'NIFTY 50', name: 'Nifty 50', price: 22450.50, change: 120.30, changePercent: 0.54, lastUpdated: new Date().toISOString() },
    { symbol: 'SENSEX', name: 'BSE Sensex', price: 73850.10, change: 350.20, changePercent: 0.48, lastUpdated: new Date().toISOString() },
    { symbol: 'USDINR', name: 'USD/INR', price: 83.45, change: -0.12, changePercent: -0.14, lastUpdated: new Date().toISOString() }
  ];
};

export const fetchNews = async (): Promise<NewsArticle[]> => {
  await delay(400);
  return [
    { articleId: 'n1', headline: 'RBI keeps repo rate unchanged', summary: 'The Monetary Policy Committee decided to keep the repo rate steady at 6.5%.', source: 'Reuters', publishedAt: new Date().toISOString(), sentiment: 'positive', sentimentScore: 0.6, relevantTickers: ['HDFCBANK.NS', 'ICICIBANK.NS'], category: 'Macro' },
    { articleId: 'n2', headline: 'Tech sector faces headwinds globally', summary: 'Global IT spending forecasts revised downwards amid economic uncertainty.', source: 'Bloomberg', publishedAt: new Date(Date.now() - 3600000).toISOString(), sentiment: 'negative', sentimentScore: -0.4, relevantTickers: ['TCS.NS', 'INFY.NS'], category: 'Technology' }
  ];
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  await delay(200);
  return [
    { alertId: 'a1', type: 'risk_limit', severity: 'warning', message: 'Portfolio VaR approaching 90% of internal limit.', triggeredAt: new Date().toISOString(), acknowledged: false },
    { alertId: 'a2', type: 'price_breach', severity: 'info', message: 'RELIANCE.NS crossed 2800 resistance level.', triggeredAt: new Date(Date.now() - 7200000).toISOString(), relatedEntity: 'RELIANCE.NS', acknowledged: true }
  ];
};
