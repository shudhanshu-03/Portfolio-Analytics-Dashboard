import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Monitor, Moon, Sun, LayoutDashboard, Plus, Trash2 } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { WidgetRegistry } from '../registry/WidgetRegistry';
import { v4 as uuidv4 } from 'uuid';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { theme, setTheme, toggleSidebar, activeWidgets, removeWidget, addWidget } = useDashboardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const actions = [
    {
      id: 'theme-light',
      title: 'Set Theme: Light',
      icon: <Sun size={16} />,
      keywords: ['theme', 'light', 'day'],
      perform: () => { setTheme('light'); close(); }
    },
    {
      id: 'theme-dark',
      title: 'Set Theme: Dark',
      icon: <Moon size={16} />,
      keywords: ['theme', 'dark', 'night'],
      perform: () => { setTheme('dark'); close(); }
    },
    {
      id: 'theme-system',
      title: 'Set Theme: System',
      icon: <Monitor size={16} />,
      keywords: ['theme', 'system', 'auto'],
      perform: () => { setTheme('system'); close(); }
    },
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar',
      icon: <LayoutDashboard size={16} />,
      keywords: ['sidebar', 'menu', 'toggle', 'hide', 'show'],
      perform: () => { toggleSidebar(); close(); }
    },
    {
      id: 'clear-dashboard',
      title: 'Clear Dashboard (Remove All Widgets)',
      icon: <Trash2 size={16} className="text-red-500" />,
      keywords: ['clear', 'remove', 'delete', 'all', 'empty', 'reset'],
      perform: () => {
        activeWidgets.forEach(w => removeWidget(w.instanceId));
        close();
      }
    }
  ];

  // Add available widgets to actions
  const widgets = WidgetRegistry.getAllWidgets();
  widgets.forEach(w => {
    actions.push({
      id: `add-widget-${w.id}`,
      title: `Add Widget: ${w.name}`,
      icon: <Plus size={16} />,
      keywords: ['add', 'widget', ...w.name.toLowerCase().split(' ')],
      perform: () => {
        addWidget(w.id, {
          i: uuidv4(),
          x: 0,
          y: Infinity, // puts it at the bottom
          w: w.defaultSize.w,
          h: w.defaultSize.h,
          minW: w.minSize.w,
          minH: w.minSize.h
        });
        close();
      }
    });
  });

  const filteredActions = actions.filter(action => {
    if (!query) return true;
    const q = query.toLowerCase();
    return action.title.toLowerCase().includes(q) || action.keywords.some(k => k.includes(q));
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex justify-center items-start pt-[15vh] z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[60vh]"
            >
              <div className="flex items-center px-4 py-3 border-b border-border/50">
                <Search size={18} className="text-muted-foreground mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
                />
                <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 rounded ml-2">ESC</span>
              </div>
              
              <div className="overflow-y-auto p-2">
                {filteredActions.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No results found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.perform}
                        className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-secondary text-left transition-colors group"
                      >
                        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {action.icon}
                        </div>
                        <span className="ml-3 text-sm text-foreground">{action.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
