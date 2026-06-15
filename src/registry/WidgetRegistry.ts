import type { WidgetDefinition, WidgetCategory } from '../types/widget';

class WidgetRegistryService {
  private widgets: Map<string, WidgetDefinition> = new Map();

  /**
   * Registers a new widget type in the registry.
   */
  registerWidget(widget: WidgetDefinition): void {
    if (this.widgets.has(widget.id)) {
      console.warn(`Widget with ID ${widget.id} is already registered. Overwriting.`);
    }
    this.widgets.set(widget.id, widget);
  }

  /**
   * Unregisters a widget by ID.
   */
  unregisterWidget(id: string): void {
    this.widgets.delete(id);
  }

  /**
   * Retrieves a widget definition by ID.
   */
  getWidget(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  /**
   * Retrieves all registered widgets.
   */
  getAllWidgets(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Retrieves all widgets belonging to a specific category.
   */
  getWidgetsByCategory(category: WidgetCategory): WidgetDefinition[] {
    return Array.from(this.widgets.values()).filter(
      (widget) => widget.category === category
    );
  }
}

export const WidgetRegistry = new WidgetRegistryService();
