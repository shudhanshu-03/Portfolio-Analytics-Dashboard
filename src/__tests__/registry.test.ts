import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WidgetRegistry } from '../registry/WidgetRegistry';
import { WidgetCategory, WidgetDefinition } from '../types/widget';
import React from 'react';

describe('WidgetRegistryService', () => {
  const dummyComponent = React.lazy(() => Promise.resolve({ default: () => null }));
  const dummyIcon = () => null;

  const mockWidget1: WidgetDefinition = {
    id: 'w01',
    name: 'Widget 1',
    description: 'Test widget 1',
    category: WidgetCategory.CHART,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    configSchema: {},
    defaultConfig: {},
    component: dummyComponent,
    icon: dummyIcon,
    dataSource: { type: 'CALCULATED' }
  };

  const mockWidget2: WidgetDefinition = {
    id: 'w02',
    name: 'Widget 2',
    description: 'Test widget 2',
    category: WidgetCategory.TABLE,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 4 },
    configSchema: {},
    defaultConfig: {},
    component: dummyComponent,
    icon: dummyIcon,
    dataSource: { type: 'CALCULATED' }
  };

  beforeEach(() => {
    // Clear registry before each test
    WidgetRegistry.getAllWidgets().forEach(w => WidgetRegistry.unregisterWidget(w.id));
  });

  it('should successfully register and retrieve a widget', () => {
    WidgetRegistry.registerWidget(mockWidget1);
    
    const retrieved = WidgetRegistry.getWidget('w01');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('w01');
  });

  it('should warn when registering a duplicate widget ID', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    WidgetRegistry.registerWidget(mockWidget1);
    WidgetRegistry.registerWidget(mockWidget1);
    
    expect(consoleSpy).toHaveBeenCalledWith('Widget with ID w01 is already registered. Overwriting.');
    
    consoleSpy.mockRestore();
  });

  it('should retrieve all registered widgets', () => {
    WidgetRegistry.registerWidget(mockWidget1);
    WidgetRegistry.registerWidget(mockWidget2);
    
    const all = WidgetRegistry.getAllWidgets();
    expect(all.length).toBe(2);
    expect(all.find(w => w.id === 'w01')).toBeDefined();
    expect(all.find(w => w.id === 'w02')).toBeDefined();
  });

  it('should retrieve widgets by category', () => {
    WidgetRegistry.registerWidget(mockWidget1);
    WidgetRegistry.registerWidget(mockWidget2);
    
    const chartWidgets = WidgetRegistry.getWidgetsByCategory(WidgetCategory.CHART);
    expect(chartWidgets.length).toBe(1);
    expect(chartWidgets[0].id).toBe('w01');

    const tableWidgets = WidgetRegistry.getWidgetsByCategory(WidgetCategory.TABLE);
    expect(tableWidgets.length).toBe(1);
    expect(tableWidgets[0].id).toBe('w02');
  });

  it('should unregister a widget successfully', () => {
    WidgetRegistry.registerWidget(mockWidget1);
    WidgetRegistry.unregisterWidget('w01');
    
    expect(WidgetRegistry.getWidget('w01')).toBeUndefined();
    expect(WidgetRegistry.getAllWidgets().length).toBe(0);
  });
});
