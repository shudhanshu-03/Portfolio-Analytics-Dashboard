import { useQuery } from '@tanstack/react-query';
import * as api from '../data/mockApi';

export const usePortfolio = (id: string) => {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => api.fetchPortfolioSummary(id),
    staleTime: 60000, // 1 minute
  });
};

export const useHoldings = (id: string) => {
  return useQuery({
    queryKey: ['holdings', id],
    queryFn: () => api.fetchHoldings(id),
    staleTime: 30000, // 30 seconds
  });
};

export const usePerformance = (id: string) => {
  return useQuery({
    queryKey: ['performance', id],
    queryFn: () => api.fetchPerformance(id),
    staleTime: 5 * 60000, // 5 minutes
  });
};

export const useRiskMetrics = (id: string) => {
  return useQuery({
    queryKey: ['risk', id],
    queryFn: () => api.fetchRiskMetrics(id),
    staleTime: 10 * 60000, // 10 minutes
  });
};

export const useMarketOverview = () => {
  return useQuery({
    queryKey: ['marketOverview'],
    queryFn: () => api.fetchMarketOverview(),
    staleTime: 15000, // 15 seconds
  });
};

export const useMarketTicker = useMarketOverview;

export const useNewsFeed = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => api.fetchNews(),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // auto refetch every minute
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => api.fetchAlerts(),
    staleTime: 30000, // 30 seconds
  });
};
