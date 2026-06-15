import React, { useState } from 'react';
import { X, Settings, GripHorizontal } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { Modal } from './Modal';

interface WidgetShellProps {
  instanceId: string;
  title: string;
  children: React.ReactNode;
  attributes?: any;
  listeners?: any;
}

export const WidgetShell: React.FC<WidgetShellProps> = React.memo(({
  instanceId,
  title,
  children,
  attributes,
  listeners,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const removeWidget = useDashboardStore((state) => state.removeWidget);

  const handleRemove = () => {
    removeWidget(instanceId);
    setIsConfirmOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-card border shadow-sm rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b bg-gradient-to-r from-card to-muted/30 cursor-move drag-handle group"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center space-x-2">
          <GripHorizontal size={14} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          <h3 className="font-semibold text-xs tracking-wide uppercase text-muted-foreground">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1 cursor-default opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-secondary text-muted-foreground transition-colors" aria-label="Widget settings">
            <Settings size={14} />
          </button>
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            aria-label="Remove widget"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-3 relative bg-card cursor-default">
        {children}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Remove Widget"
        actions={
          <>
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Remove
            </button>
          </>
        }
      >
        <p>Are you sure you want to remove the <strong>{title}</strong> widget from the dashboard?</p>
      </Modal>
    </div>
  );
});
