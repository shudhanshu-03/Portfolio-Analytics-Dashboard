import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardStore } from '../store/dashboardStore';

describe('Drag and Drop / Resize State Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useDashboardStore());
    act(() => {
      // clear active widgets
      result.current.activeWidgets.forEach(w => result.current.removeWidget(w.instanceId));
    });
  });

  it('should update activeWidgets order when reorderWidgets is called', () => {
    const { result } = renderHook(() => useDashboardStore());

    act(() => {
      result.current.addWidget('TEST_WIDGET_1', { i: 'test-1', x: 0, y: 0, w: 4, h: 3 });
      result.current.addWidget('TEST_WIDGET_2', { i: 'test-2', x: 0, y: 0, w: 4, h: 3 });
      result.current.addWidget('TEST_WIDGET_3', { i: 'test-3', x: 0, y: 0, w: 4, h: 3 });
    });

    const initialWidgets = result.current.activeWidgets;
    expect(initialWidgets.length).toBe(3);
    expect(initialWidgets[0].instanceId).toBe('test-1');
    expect(initialWidgets[1].instanceId).toBe('test-2');
    expect(initialWidgets[2].instanceId).toBe('test-3');

    // Reorder: Move 'test-3' (index 2) to 'test-1' (index 0)
    act(() => {
      result.current.reorderWidgets(2, 0);
    });

    const updatedWidgets = result.current.activeWidgets;
    expect(updatedWidgets[0].instanceId).toBe('test-3');
    expect(updatedWidgets[1].instanceId).toBe('test-1');
    expect(updatedWidgets[2].instanceId).toBe('test-2');
  });
});
