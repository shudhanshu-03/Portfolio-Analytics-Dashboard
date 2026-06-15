import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { WidgetRegistry } from '../registry/WidgetRegistry';
import { nextAvailablePosition } from '../utils/grid';
import { LayoutPanelLeft, Plus, X } from 'lucide-react';
import { WidgetCategory } from '../types/widget';

interface WidgetCatalogueProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetCatalogue: React.FC<WidgetCatalogueProps> = ({ isOpen, onClose }) => {
  const { layouts, addWidget } = useDashboardStore();
  const [activeCategory, setActiveCategory] = useState<WidgetCategory | 'ALL'>('ALL');

  const allWidgets = WidgetRegistry.getAllWidgets();
  
  const displayedWidgets = activeCategory === 'ALL' 
    ? allWidgets 
    : allWidgets.filter(w => w.category === activeCategory);

  const categories = ['ALL', ...Object.values(WidgetCategory)];

  const handleAddWidget = (widgetId: string) => {
    const widgetDef = WidgetRegistry.getWidget(widgetId);
    if (!widgetDef) return;

    const currentLgLayout = layouts.lg || [];
    const position = nextAvailablePosition(
      currentLgLayout, 
      12, 
      widgetDef.defaultSize.w, 
      widgetDef.defaultSize.h
    );
    
    const newLayoutItem = {
      // eslint-disable-next-line react-hooks/purity
      i: `widget-${widgetId}-${Date.now()}`,
      x: position.x,
      y: position.y,
      w: widgetDef.defaultSize.w,
      h: widgetDef.defaultSize.h,
      minW: widgetDef.minSize.w,
      minH: widgetDef.minSize.h,
      maxW: widgetDef.maxSize?.w,
      maxH: widgetDef.maxSize?.h,
    };

    addWidget(widgetId, newLayoutItem);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2 text-foreground">
            <LayoutPanelLeft size={20} />
            <h2 className="font-semibold text-lg">Widget Catalogue</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto p-2 border-b space-x-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as WidgetCategory | 'ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Widget List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayedWidgets.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground mt-10">
              No widgets available in this category.
            </div>
          ) : (
            displayedWidgets.map(widget => {
              const Icon = widget.icon;
              return (
                <div 
                  key={widget.id} 
                  className="p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors shadow-sm group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-secondary rounded-lg text-primary">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{widget.name}</h4>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                          {widget.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddWidget(widget.id)}
                      className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                      title="Add to Dashboard"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {widget.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
