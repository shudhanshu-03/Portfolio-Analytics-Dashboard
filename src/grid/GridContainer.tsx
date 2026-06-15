import React, { Suspense } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDashboardStore } from '../store/dashboardStore';
import { WidgetShell } from '../components/WidgetShell';
import { WidgetRegistry } from '../registry/WidgetRegistry';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { WidgetErrorBoundary } from '../components/WidgetErrorBoundary';

interface SortableGridItemProps {
  id: string;
  widget: any;
  widgetConfigs: any;
}

const SortableGridItem: React.FC<SortableGridItemProps> = ({ id, widget, widgetConfigs }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const widgetDef = WidgetRegistry.getWidget(widget.widgetId);

  if (!widgetDef) {
    return (
      <div ref={setNodeRef} style={style} className="col-span-12">
        <WidgetShell instanceId={widget.instanceId} title="Unknown Widget" attributes={attributes} listeners={listeners}>
          <div className="flex items-center justify-center h-full text-destructive p-4 text-center">
            Widget definition not found for ID: {widget.widgetId}
          </div>
        </WidgetShell>
      </div>
    );
  }

  const WidgetComponent = widgetDef.component;
  const mergedConfig = {
    ...widgetDef.defaultConfig,
    ...(widgetConfigs[widget.instanceId] || {}),
  };

  // Map the default widget width (RGL grid size 1-12) to Tailwind col-span classes
  const colSpanClass = `col-span-12 lg:col-span-${widgetDef.defaultSize.w}`;

  return (
    <div ref={setNodeRef} style={style} className={`${colSpanClass} transition-shadow h-[400px]`}>
      <WidgetShell instanceId={widget.instanceId} title={widgetDef.name} attributes={attributes} listeners={listeners}>
        <WidgetErrorBoundary widgetName={widgetDef.name}>
          <Suspense fallback={<LoadingSkeleton />}>
            <WidgetComponent config={mergedConfig} />
          </Suspense>
        </WidgetErrorBoundary>
      </WidgetShell>
    </div>
  );
};

export const GridContainer: React.FC = () => {
  const { activeWidgets, widgetConfigs, reorderWidgets } = useDashboardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activeWidgets.findIndex((w) => w.instanceId === active.id);
      const newIndex = activeWidgets.findIndex((w) => w.instanceId === over.id);
      reorderWidgets(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] p-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeWidgets.map(w => w.instanceId)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-max">
            {activeWidgets.map((widget) => (
              <SortableGridItem
                key={widget.instanceId}
                id={widget.instanceId}
                widget={widget}
                widgetConfigs={widgetConfigs}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
