import React, { useState, useEffect } from 'react';
import { GridContainer } from './grid/GridContainer';
import { WidgetCatalogue } from './components/WidgetCatalogue';
import { Plus, Moon, Sun, Monitor, PanelLeftClose, PanelLeft, Search } from 'lucide-react';
import { useDashboardStore } from './store/dashboardStore';
import { CommandPalette } from './components/CommandPalette';
import { MarketTickerBar } from './components/MarketTickerBar';
import { EmptyState } from './components/EmptyState';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const theme = useDashboardStore((s) => s.theme);
  const setTheme = useDashboardStore((s) => s.setTheme);
  const sidebarOpen = useDashboardStore((s) => s.sidebarOpen);
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);
  const hasHydrated = useDashboardStore((s) => s._hasHydrated);
  const activeWidgets = useDashboardStore((s) => s.activeWidgets);

  // Initialize global websocket subscription
  useWebSocket();

  // ── Sync theme with document ─────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolved: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mql.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? 'dark' : 'light');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // ── Cycle through themes ─────────────────────────────────────────────────
  const cycleTheme = () => {
    const order = ['dark', 'light', 'system'] as const;
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  // ── Hydration gate ───────────────────────────────────────────────────────
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-lg bg-primary/50" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-30">
        {/* Left: Brand + Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
              M
            </div>
            <h1 className="text-lg font-semibold tracking-tight hidden sm:block">
              Meridian Analytics
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Command Palette Hint */}
          <div className="hidden md:flex items-center text-xs text-muted-foreground bg-secondary/50 border border-border/50 rounded-md px-2 py-1 mr-2 cursor-pointer hover:bg-secondary transition-colors" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}>
            <Search size={12} className="mr-2" />
            <span>Search...</span>
            <div className="ml-4 flex items-center space-x-1">
              <kbd className="font-sans bg-background border border-border rounded px-1 text-[10px]">Ctrl</kbd>
              <kbd className="font-sans bg-background border border-border rounded px-1 text-[10px]">K</kbd>
            </div>
          </div>

          <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title={`Theme: ${theme}`}
          >
            <ThemeIcon size={16} />
          </button>

          <button
            onClick={() => setIsCatalogueOpen(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Widget</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 border-r border-border bg-card/50 backdrop-blur-sm flex-shrink-0 hidden lg:flex flex-col">
            <div className="p-4 border-b border-border/50">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Navigation
              </h2>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium">
                <span>📊</span><span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground text-sm transition-colors">
                <span>📈</span><span>Analytics</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground text-sm transition-colors">
                <span>🔔</span><span>Alerts</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground text-sm transition-colors">
                <span>⚙️</span><span>Settings</span>
              </a>
            </nav>
          </aside>
        )}

        {/* Dashboard Area */}
        <main className="flex-1 overflow-hidden flex flex-col bg-muted/10 relative">
          <MarketTickerBar />
          
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            {activeWidgets.length === 0 ? (
              <EmptyState onAddWidget={() => setIsCatalogueOpen(true)} />
            ) : (
              <GridContainer />
            )}
          </div>
        </main>
      </div>

      {/* ── Overlays ───────────────────────────────────────────────────────── */}
      <CommandPalette />
      <WidgetCatalogue
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
      />
    </div>
  );
}

export default App;
