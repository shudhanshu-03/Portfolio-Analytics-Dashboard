import { Holding, MarketTicker, Alert, NewsArticle } from '../types/data';

type EventCallback = (data: any) => void;

class WebSocketSimulator {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private timers: ReturnType<typeof setInterval>[] = [];

  // Simulate geometric Brownian motion for price updates
  private updatePrice(currentPrice: number, volatility: number = 0.02): number {
    const drift = 0.0001; // Expected return
    const shock = (Math.random() - 0.5) * 2; // Random value between -1 and 1
    const change = currentPrice * (drift + volatility * shock);
    return Number((currentPrice + change).toFixed(2));
  }

  public subscribe(topic: string, callback: EventCallback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(callback);
    return () => this.unsubscribe(topic, callback);
  }

  public unsubscribe(topic: string, callback: EventCallback) {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners) {
      topicListeners.delete(callback);
    }
  }

  private emit(topic: string, data: any) {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners) {
      topicListeners.forEach(callback => callback(data));
    }
  }

  public connect() {
    console.log('[WSSimulator] Connected to simulated stream');

    // Ticker updates every 1.5 seconds
    const tickerInterval = setInterval(() => {
      const update = {
        symbol: 'NIFTY 50',
        price: this.updatePrice(22450.50, 0.005),
        timestamp: new Date().toISOString()
      };
      this.emit('tickerUpdate', update);
    }, 1500);

    // Random alerts every 15-30 seconds
    const alertInterval = setInterval(() => {
      const newAlert: Alert = {
        alertId: `a_${Date.now()}`,
        type: 'price_breach',
        severity: Math.random() > 0.8 ? 'critical' : 'info',
        message: `Volatility spike detected in TECH sector.`,
        triggeredAt: new Date().toISOString(),
        acknowledged: false
      };
      this.emit('newAlert', newAlert);
    }, Math.random() * 15000 + 15000);

    this.timers.push(tickerInterval, alertInterval);
  }

  public disconnect() {
    this.timers.forEach(clearInterval);
    this.timers = [];
    this.listeners.clear();
    console.log('[WSSimulator] Disconnected');
  }
}

export const wsSimulator = new WebSocketSimulator();
