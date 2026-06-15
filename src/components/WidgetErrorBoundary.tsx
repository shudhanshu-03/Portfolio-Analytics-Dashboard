import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  widgetName: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in widget: ${this.props.widgetName}`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center space-y-4 bg-destructive/5 text-destructive rounded-lg border border-destructive/20">
          <AlertTriangle size={32} className="opacity-80" />
          <div>
            <h4 className="font-semibold text-sm">Failed to load {this.props.widgetName}</h4>
            <p className="text-xs opacity-80 mt-1 max-w-xs break-words">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center space-x-2 px-3 py-1.5 bg-background border rounded-md shadow-sm hover:bg-muted text-foreground text-sm font-medium transition-colors"
          >
            <RefreshCcw size={14} />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
