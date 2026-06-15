import React from 'react';
import { useMarketTicker } from '../hooks/useData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MarketTickerBar: React.FC = () => {
  const { data: tickers, isLoading } = useMarketTicker();

  if (isLoading || !tickers || tickers.length === 0) {
    return <div className="h-8 bg-card border-b border-border flex items-center px-4 text-xs text-muted-foreground">Loading market data...</div>;
  }

  // Duplicate tickers to create a seamless infinite scroll effect
  const displayTickers = [...tickers, ...tickers, ...tickers];

  return (
    <div className="h-8 bg-card border-b border-border overflow-hidden flex items-center relative whitespace-nowrap">
      <div className="flex animate-marquee hover:pause whitespace-nowrap min-w-full items-center">
        {displayTickers.map((ticker, i) => {
          const isUp = ticker.change >= 0;
          return (
            <div key={`${ticker.symbol}-${i}`} className="inline-flex items-center px-4 space-x-2 border-r border-border/30 last:border-0">
              <span className="font-semibold text-xs text-foreground">{ticker.symbol}</span>
              <span className="text-xs text-muted-foreground">{ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`text-xs flex items-center font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                {Math.abs(ticker.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
