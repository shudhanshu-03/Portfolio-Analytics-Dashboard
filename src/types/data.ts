export interface PortfolioSummary {
  portfolioId: string;
  name: string;
  aum: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  mtdReturn: number;
  ytdReturn: number;
  sharpeRatio: number;
  benchmark: string;
  lastUpdated: string;
}

export interface Holding {
  holdingId: string;
  ticker: string;
  name: string;
  sector: string;
  assetClass: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  weight: number;
  currency: string;
}

export interface NewsArticle {
  articleId: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  relevantTickers: string[];
  category: string;
}

export interface Alert {
  alertId: string;
  type: 'price_breach' | 'risk_limit' | 'news_event' | 'rebalance_signal';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  triggeredAt: string;
  relatedWidget?: string;
  relatedEntity?: string;
  acknowledged: boolean;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}
