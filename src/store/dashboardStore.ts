import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Layout Types ───────────────────────────────────────────────────────────

export interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

export interface Layouts {
  [P: string]: Layout[];
}

export interface ActiveWidget {
  instanceId: string;
  widgetId: string;
}

// ─── Theme Types ────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system';

// ─── Full State Interface ───────────────────────────────────────────────────

/**
 * Main dashboard application state powered by Zustand.
 */
interface DashboardState {
  // ── State Properties ──
  
  /** Grid layout definitions mapped by breakpoint (lg, md, sm, etc.) */
  layouts: Layouts;
  
  /** Ordered list of active widgets currently rendered on the dashboard */
  activeWidgets: ActiveWidget[];

  /** Widget-specific instance configuration overrides keyed by instanceId */
  widgetConfigs: Record<string, Record<string, unknown>>;

  /** Application appearance theme */
  theme: Theme;
  
  /** Whether the sidebar is currently open or collapsed */
  sidebarOpen: boolean;

  /** Internal flag indicating if Zustand has successfully rehydrated state from LocalStorage */
  _hasHydrated: boolean;

  // ── Layout Actions ──
  
  /** Add a new widget instance to the dashboard grid */
  addWidget: (widgetId: string, layout: Layout) => void;
  
  /** Remove a widget instance by its unique instanceId */
  removeWidget: (instanceId: string) => void;
  
  /** Reorder widgets using @dnd-kit */
  reorderWidgets: (startIndex: number, endIndex: number) => void;

  // ── Config Actions ──
  
  /** Update the internal configuration payload for a specific widget instance */
  updateWidgetConfig: (instanceId: string, config: Record<string, unknown>) => void;

  // ── UI Actions ──
  
  /** Switch the application theme */
  setTheme: (theme: Theme) => void;
  
  /** Toggle the visibility of the left sidebar navigation */
  toggleSidebar: () => void;
  
  /** Explicitly set the visibility of the left sidebar navigation */
  setSidebarOpen: (open: boolean) => void;

  // ── System Actions ──
  
  /** Hydration setter */
  setHasHydrated: (state: boolean) => void;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // ── Initial State ─────────────────────────────────────────────────
      layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
      activeWidgets: [],
      widgetConfigs: {},
      theme: 'dark',
      sidebarOpen: true,
      _hasHydrated: false,

      // ── Layout Actions ────────────────────────────────────────────────

      addWidget: (widgetId, layout) =>
        set((state) => {
          const instanceId = layout.i;
          const newWidget: ActiveWidget = { instanceId, widgetId };
          return {
            activeWidgets: [...state.activeWidgets, newWidget],
          };
        }),

      removeWidget: (instanceId) =>
        set((state) => {
          const newConfigs = { ...state.widgetConfigs };
          delete newConfigs[instanceId];

          return {
            activeWidgets: state.activeWidgets.filter(
              (w) => w.instanceId !== instanceId
            ),
            widgetConfigs: newConfigs,
          };
        }),

      reorderWidgets: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.activeWidgets);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { activeWidgets: result };
        }),

      // ── Widget Config Actions ─────────────────────────────────────────

      updateWidgetConfig: (instanceId, config) =>
        set((state) => ({
          widgetConfigs: {
            ...state.widgetConfigs,
            [instanceId]: {
              ...(state.widgetConfigs[instanceId] || {}),
              ...config,
            },
          },
        })),

      // ── UI Actions ────────────────────────────────────────────────────

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ── Hydration ─────────────────────────────────────────────────────

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'meridian-dashboard-storage',
      storage: createJSONStorage(() => localStorage),

      // Only persist the data we care about, NOT hydration flag
      partialize: (state) => ({
        layouts: state.layouts,
        activeWidgets: state.activeWidgets,
        widgetConfigs: state.widgetConfigs,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);
