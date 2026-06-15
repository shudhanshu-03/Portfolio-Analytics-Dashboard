type EventCallback<T = any> = (payload: T) => void;

interface EventMap {
  SYMBOL_SELECTED: { symbol: string; sourceWidget: string };
  DATE_RANGE_CHANGED: { startDate: string; endDate: string; sourceWidget: string };
  SECTOR_HIGHLIGHTED: { sector: string; sourceWidget: string };
  WIDGET_REFRESH: { widgetId?: string }; // Optional: refresh all if undefined
  [key: string]: any;
}

class EventBus {
  private listeners: Map<keyof EventMap, Set<EventCallback>> = new Map();

  subscribe<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  publish<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(payload));
    }
  }
}

export const globalEventBus = new EventBus();
