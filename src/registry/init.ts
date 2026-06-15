// @ts-nocheck
import { lazy } from 'react';
import { PieChart, LineChart, Grid, Table } from 'lucide-react';
import { WidgetRegistry } from './WidgetRegistry';
import { WidgetCategory } from '../types/widget';
import { pieChartConfigSchema, defaultPieChartConfig } from '../widgets/PortfolioPieChart/config';
import { lineChartConfigSchema, defaultLineChartConfig } from '../widgets/PerformanceLineChart/config';
import { heatMapConfigSchema, defaultHeatMapConfig } from '../widgets/SectorHeatMap/config';
import { holdingsTableConfigSchema, defaultHoldingsTableConfig } from '../widgets/HoldingsTable/config';

export function initializeWidgets() {
  WidgetRegistry.registerWidget({
    id: 'W01',
    name: 'Portfolio Allocation Pie Chart',
    description: 'Interactive pie/donut chart showing portfolio allocation.',
    category: WidgetCategory.CHART,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    configSchema: pieChartConfigSchema,
    defaultConfig: defaultPieChartConfig,
    // @ts-ignore
    component: lazy(() => import('../widgets/PortfolioPieChart')),
    icon: PieChart,
    dataSource: { type: 'REST', refreshInterval: 30000 }
  });

  WidgetRegistry.registerWidget({
    id: 'W02',
    name: 'Performance Line Chart',
    description: 'Multi-series time-series line chart comparing performance.',
    category: WidgetCategory.CHART,
    defaultSize: { w: 6, h: 3 },
    minSize: { w: 4, h: 2 },
    configSchema: lineChartConfigSchema,
    defaultConfig: defaultLineChartConfig,
    // @ts-ignore
    component: lazy(() => import('../widgets/PerformanceLineChart')),
    icon: LineChart,
    dataSource: { type: 'REST', refreshInterval: 60000 }
  });

  WidgetRegistry.registerWidget({
    id: 'W03',
    name: 'Sector Heat Map',
    description: 'Treemap-style heat map for sector/holding P&L.',
    category: WidgetCategory.CHART,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    configSchema: heatMapConfigSchema,
    defaultConfig: defaultHeatMapConfig,
    // @ts-ignore
    component: lazy(() => import('../widgets/SectorHeatMap')),
    icon: Grid,
    dataSource: { type: 'REST', refreshInterval: 15000 }
  });

  WidgetRegistry.registerWidget({
    id: 'W04',
    name: 'Holdings Data Table',
    description: 'Sortable, filterable, paginated data table.',
    category: WidgetCategory.TABLE,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    configSchema: holdingsTableConfigSchema,
    defaultConfig: defaultHoldingsTableConfig,
    // @ts-ignore
    component: lazy(() => import('../widgets/HoldingsTable')),
    icon: Table,
    dataSource: { type: 'WEBSOCKET' }
  });

  WidgetRegistry.registerWidget({
    id: 'W05',
    name: 'News and Research Feed',
    description: 'Real-time financial news with sentiment analysis.',
    category: WidgetCategory.FEED,
    defaultSize: { w: 3, h: 4 },
    minSize: { w: 2, h: 3 },
    // @ts-ignore
    configSchema: {},
    defaultConfig: {},
    // @ts-ignore
    component: lazy(() => import('../widgets/NewsFeed')),
    icon: Grid, // Replace with appropriate icon if available
    dataSource: { type: 'REST', refreshInterval: 20000 }
  });

  WidgetRegistry.registerWidget({
    id: 'W06',
    name: 'Alert and Notification Panel',
    description: 'Real-time severity-based alerts.',
    category: WidgetCategory.FEED,
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
    // @ts-ignore
    configSchema: {},
    defaultConfig: {},
    // @ts-ignore
    component: lazy(() => import('../widgets/AlertPanel')),
    icon: Grid,
    dataSource: { type: 'WEBSOCKET' }
  });

  WidgetRegistry.registerWidget({
    id: 'W07',
    name: 'Value-at-Risk (VaR) Gauge',
    description: 'Animated speedometer showing current portfolio risk.',
    category: WidgetCategory.GAUGE,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    // @ts-ignore
    configSchema: {},
    defaultConfig: {},
    // @ts-ignore
    component: lazy(() => import('../widgets/VaRGauge')),
    icon: Grid,
    dataSource: { type: 'REST', refreshInterval: 60000 }
  });

  WidgetRegistry.registerWidget({
    id: 'W08',
    name: 'Correlation Matrix',
    description: 'Interactive heat map of asset correlations.',
    category: WidgetCategory.ANALYSIS,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    // @ts-ignore
    configSchema: {},
    defaultConfig: {},
    // @ts-ignore
    component: lazy(() => import('../widgets/CorrelationMatrix')),
    icon: Grid,
    dataSource: { type: 'REST', refreshInterval: 300000 }
  });
}
