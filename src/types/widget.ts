import type { LazyExoticComponent, ComponentType } from 'react';

export const WidgetCategory = {
  CHART: 'CHART',
  TABLE: 'TABLE',
  METRIC: 'METRIC',
  NEWS: 'NEWS',
  CUSTOM: 'CUSTOM',
} as const;

export type WidgetCategory = typeof WidgetCategory[keyof typeof WidgetCategory];

/**
 * Represents the configuration for how a widget fetches its data.
 */
export interface DataSourceConfig {
  /** The transport or calculation method */
  type: 'REST' | 'WEBSOCKET' | 'CALCULATED';
  /** The URL or channel identifier */
  endpoint?: string;
  /** Polling interval in ms for REST sources */
  refreshInterval?: number;
}

/**
 * Standard properties passed to every widget React component.
 */
export type WidgetComponentProps<TConfig, TData> = {
  config: TConfig;
  data?: TData;
  isLoading?: boolean;
  error?: Error | null;
};

export type WidgetComponentType<TConfig, TData> = ComponentType<WidgetComponentProps<TConfig, TData>>;

/**
 * The core contract defining a Meridian Dashboard Widget.
 * All widgets must satisfy this definition to be registered in the WidgetRegistry.
 */
export interface WidgetDefinition<TConfig = Record<string, unknown>, TData = unknown> {
  /** Unique identifier for the widget (e.g. 'holdings-table') */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Brief description shown in the catalogue */
  description: string;
  /** UI Category for grouping in the catalogue */
  category: WidgetCategory;
  /** Default grid dimensions (w, h) */
  defaultSize: { w: number; h: number };
  /** Minimum permitted grid dimensions */
  minSize: { w: number; h: number };
  /** Maximum permitted grid dimensions (optional) */
  maxSize?: { w: number; h: number };
  /** JSON Schema defining the shape of `config` for settings UI generation */
  configSchema: Record<string, unknown>; // JSONSchema7
  /** Default fallback configuration state */
  defaultConfig: TConfig;
  /** React lazy component reference to the widget's main entry point */
  component: LazyExoticComponent<WidgetComponentType<TConfig, TData>>;
  /** Lucide-react icon component for the catalogue */
  icon: any;
  /** How the widget fetches its internal data */
  dataSource: DataSourceConfig;
}
