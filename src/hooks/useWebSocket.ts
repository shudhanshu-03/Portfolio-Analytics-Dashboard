import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsSimulator } from '../data/websocketSimulator';
import { Holding, MarketTicker, Alert } from '../types/data';

export const useWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Start the simulator when the app mounts
    wsSimulator.connect();

    const unsubMarket = wsSimulator.subscribe('marketOverviewUpdate', (updates: Partial<MarketTicker>[]) => {
      queryClient.setQueryData<MarketTicker[]>(['marketOverview'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(ticker => {
          const update = updates.find(u => u.symbol === ticker.symbol);
          if (update && update.price) {
            const oldPrice = ticker.price;
            const newPrice = update.price;
            const change = newPrice - oldPrice;
            return { 
              ...ticker, 
              price: newPrice,
              change: ticker.change + change,
              lastUpdated: new Date().toISOString()
            };
          }
          return ticker;
        });
      });
    });

    const unsubHoldings = wsSimulator.subscribe('holdingsUpdate', (updates: Partial<Holding>[]) => {
      const queries = queryClient.getQueriesData<Holding[]>({ queryKey: ['holdings'] });
      
      queries.forEach(([queryKey, oldData]) => {
        if (!oldData) return;
        queryClient.setQueryData<Holding[]>(queryKey, (old) => {
          if (!old) return old;
          return old.map(holding => {
            const update = updates.find(u => u.ticker === holding.ticker);
            if (update && update.currentPrice) {
              const newPrice = update.currentPrice;
              const newMarketValue = newPrice * holding.quantity;
              const costValue = holding.averageCost * holding.quantity;
              const newPnL = newMarketValue - costValue;
              const newPnLPercent = (newPnL / costValue) * 100;
              
              return {
                ...holding,
                currentPrice: newPrice,
                marketValue: newMarketValue,
                dailyPnL: newPnL,
                dailyPnLPercent: newPnLPercent
              };
            }
            return holding;
          });
        });
      });
    });

    const unsubAlerts = wsSimulator.subscribe('newAlert', (newAlert: Alert) => {
      queryClient.setQueryData<Alert[]>(['alerts'], (oldData) => {
        if (!oldData) return [newAlert];
        return [newAlert, ...oldData].slice(0, 50); // Keep last 50
      });
    });

    return () => {
      unsubMarket();
      unsubHoldings();
      unsubAlerts();
      wsSimulator.disconnect();
    };
  }, [queryClient]);
};
