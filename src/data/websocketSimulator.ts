import { Holding, MarketTicker, Alert } from '../types/data';

type WebSocketEventMap = {
  holdingsUpdate: Partial<Holding>[];
  marketOverviewUpdate: Partial<MarketTicker>[];
  newAlert: Alert;
};

type EventName = keyof WebSocketEventMap;
type Callback<T extends EventName> = (data: WebSocketEventMap[T]) => void;

class WebSocketSimulator {
  private listeners: { [K in EventName]?: Callback<K>[] } = {};
  private timerId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  public subscribe<T extends EventName>(event: T, callback: Callback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);

    return () => {
      this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback) as any;
    };
  }

  private emit<T extends EventName>(event: T, data: WebSocketEventMap[T]) {
    if (this.listeners[event]) {
      this.listeners[event]!.forEach(cb => cb(data));
    }
  }

  public connect() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[WS] Connected to simulated data stream');
    
    this.timerId = setInterval(() => {
      this.generateTicks();
    }, 2500); // Generate ticks every 2.5 seconds
  }

  public disconnect() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
    console.log('[WS] Disconnected from simulated data stream');
  }

  private generateTicks() {
    // Simulate market indices ticking
    const indicesUpdate: Partial<MarketTicker>[] = [
      { symbol: 'NIFTY 50', price: 22450.50 + (Math.random() * 20 - 10) },
      { symbol: 'SENSEX', price: 73850.10 + (Math.random() * 60 - 30) },
      { symbol: 'USDINR', price: 83.45 + (Math.random() * 0.1 - 0.05) }
    ];
    this.emit('marketOverviewUpdate', indicesUpdate);

    // Simulate holding price ticks
    const tickHoldings: Partial<Holding>[] = [
      { ticker: 'RELIANCE.NS', currentPrice: 2850 + (Math.random() * 10 - 5) },
      { ticker: 'TCS.NS', currentPrice: 3950 + (Math.random() * 15 - 7) },
      { ticker: 'HDFCBANK.NS', currentPrice: 1680 + (Math.random() * 5 - 2.5) }
    ];
    this.emit('holdingsUpdate', tickHoldings);

    // Occasional Alert (5% chance every 2.5 seconds)
    if (Math.random() < 0.05) {
      this.emit('newAlert', {
        alertId: `ws-a-${Date.now()}`,
        type: 'price_breach',
        severity: 'info',
        message: `High volatility detected across index components.`,
        triggeredAt: new Date().toISOString(),
        acknowledged: false
      });
    }
  }
}

export const wsSimulator = new WebSocketSimulator();
