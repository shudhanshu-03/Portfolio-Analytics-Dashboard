import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Download, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useHoldings } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { HoldingsTableConfig } from './config';
import type { Holding } from '../../types/data';

export const HoldingsTableWidget: React.FC<WidgetComponentProps<HoldingsTableConfig, unknown>> = ({ config }) => {
  const { data: holdings, isLoading, error } = useHoldings('P-001');
  const [filter, setFilter] = useState('');
  const [sortCol, setSortCol] = useState<keyof Holding>(config.defaultSortColumn as keyof Holding);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(config.defaultSortDirection);

  const processedData = useMemo(() => {
    if (!holdings) return [];
    
    // Filter
    let result = holdings;
    if (filter.trim() !== '') {
      const lowerFilter = filter.toLowerCase();
      result = result.filter(h => 
        h.ticker.toLowerCase().includes(lowerFilter) || 
        h.name.toLowerCase().includes(lowerFilter) ||
        h.sector.toLowerCase().includes(lowerFilter)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [holdings, filter, sortCol, sortDir]);

  const handleSort = (col: keyof Holding) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const handleExportCSV = () => {
    if (processedData.length === 0) return;
    const headers = ['Ticker', 'Name', 'Sector', 'Asset Class', 'Qty', 'Price', 'Value', 'P&L', 'P&L %'];
    const rows = processedData.map(h => [
      h.ticker,
      `"${h.name}"`,
      h.sector,
      h.assetClass,
      h.quantity,
      h.currentPrice,
      h.marketValue,
      h.dailyPnL,
      h.dailyPnLPercent
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'holdings_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading Data...</div>;
  }

  if (error) {
    throw error;
  }

  const columns: { key: keyof Holding; label: string; align: 'left'|'right', format?: (val: any) => string }[] = [
    { key: 'ticker', label: 'Ticker', align: 'left' },
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'sector', label: 'Sector', align: 'left' },
    { key: 'quantity', label: 'Qty', align: 'right', format: (v: any) => v.toLocaleString() },
    { key: 'currentPrice', label: 'Price', align: 'right', format: (v: any) => `₹${v.toLocaleString()}` },
    { key: 'marketValue', label: 'Value', align: 'right', format: (v: any) => `₹${v.toLocaleString()}` },
    { key: 'dailyPnL', label: 'P&L', align: 'right', format: (v: any) => `₹${v.toLocaleString()}` },
    { key: 'dailyPnLPercent', label: 'P&L %', align: 'right', format: (v: any) => `${v.toFixed(2)}%` },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-card rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter ticker, name..." 
            className="pl-7 pr-2 py-1 text-xs bg-background border border-border rounded w-48 focus:outline-none focus:border-primary"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center space-x-1 px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs transition-colors"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Header Row */}
      <div className="flex bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground p-2 pr-4 shadow-sm z-10">
        {columns.map(col => (
          <div 
            key={col.key} 
            className={`flex-1 flex items-center cursor-pointer hover:text-foreground transition-colors ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}
            onClick={() => handleSort(col.key)}
          >
            <span>{col.label}</span>
            {sortCol === col.key && (
              <span className="ml-1 text-primary">
                {sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div className="flex-1 overflow-hidden bg-card">
        <Virtuoso
          data={processedData}
          itemContent={(index, holding) => (
            <div className={`flex border-b border-border/50 p-2 text-xs hover:bg-muted/30 transition-colors ${index % 2 === 0 ? '' : 'bg-secondary/10'}`}>
              {columns.map(col => {
                const val = holding[col.key];
                const isPnL = col.key === 'dailyPnL' || col.key === 'dailyPnLPercent';
                const isPositive = isPnL && (val as number) >= 0;
                const isNegative = isPnL && (val as number) < 0;

                return (
                  <div 
                    key={col.key} 
                    className={`flex-1 flex items-center truncate ${col.align === 'right' ? 'justify-end' : 'justify-start'} ${isPositive ? 'text-green-500' : ''} ${isNegative ? 'text-red-500' : ''}`}
                  >
                    <span className="truncate">
                      {col.format ? col.format(val) : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>
      
      {/* Footer */}
      <div className="p-1 border-t border-border text-[10px] text-muted-foreground flex justify-between bg-muted/20">
        <span>Total Rows: {processedData.length}</span>
        <span className="flex items-center text-green-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
          Live Updates
        </span>
      </div>
    </div>
  );
};

export default React.memo(HoldingsTableWidget);
