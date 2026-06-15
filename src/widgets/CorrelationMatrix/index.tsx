import React, { useMemo, useState } from 'react';
import { useHoldings } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { CorrelationMatrixConfig } from './config';

export const CorrelationMatrixWidget: React.FC<WidgetComponentProps<CorrelationMatrixConfig, unknown>> = ({ config }) => {
  const { data: holdings, isLoading, error } = useHoldings('P-001');
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string; val: number } | null>(null);

  const matrixData = useMemo(() => {
    if (!holdings || holdings.length < 2) return { assets: [], matrix: [] };
    
    // Sort holdings by market value and take top 8 to avoid massive grids
    const topAssets = [...holdings]
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, 8)
      .map(h => h.ticker);
    
    // Generate a mock symmetric correlation matrix for these assets
    const size = topAssets.length;
    const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    
    // Seed random generator predictably
    const seed = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
      return hash;
    };

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else if (i < j) {
          // Generate a deterministic pseudo-random correlation between -1 and 1
          const hash = seed(`${topAssets[i]}-${topAssets[j]}-${config.lookbackPeriod}`);
          const val = (Math.abs(hash) % 200) / 100 - 1; // -1 to 1
          matrix[i][j] = val;
          matrix[j][i] = val; // Symmetric
        }
      }
    }

    return { assets: topAssets, matrix };
  }, [holdings, config.lookbackPeriod]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading Matrix...</div>;
  }

  if (error) {
    throw error;
  }

  const { assets, matrix } = matrixData;

  if (assets.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground">Insufficient data</div>;
  }

  // RdBu Color scale (-1 to 1) -> (Red to Blue)
  const getColor = (value: number) => {
    if (value === 1) return 'var(--primary)'; // Diagonal
    const intensity = Math.floor(Math.abs(value) * 100);
    if (value < 0) {
      return `color-mix(in srgb, #3b82f6 ${intensity}%, transparent)`; // Blue for negative
    } else {
      return `color-mix(in srgb, #ef4444 ${intensity}%, transparent)`; // Red for positive
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-2 bg-card rounded overflow-hidden">
      <div className="text-[10px] text-muted-foreground mb-2 flex justify-between">
        <span>Top {assets.length} Assets</span>
        <span>{config.lookbackPeriod}D Lookback</span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div 
          className="grid gap-0.5" 
          style={{ 
            gridTemplateColumns: `auto repeat(${assets.length}, minmax(0, 1fr))` 
          }}
        >
          {/* Top Header Row */}
          <div className="p-1"></div>
          {assets.map(asset => (
            <div key={`header-col-${asset}`} className="text-[10px] font-bold text-center text-muted-foreground truncate p-1">
              {asset}
            </div>
          ))}

          {/* Matrix Rows */}
          {assets.map((rowAsset, i) => (
            <React.Fragment key={`row-${rowAsset}`}>
              {/* Row Header */}
              <div className="text-[10px] font-bold text-right text-muted-foreground pr-2 flex items-center justify-end">
                {rowAsset}
              </div>
              
              {/* Cells */}
              {assets.map((colAsset, j) => {
                const val = matrix[i][j];
                const isHovered = hoveredCell && (hoveredCell.row === rowAsset || hoveredCell.col === colAsset);
                
                return (
                  <div 
                    key={`cell-${i}-${j}`}
                    className={`relative aspect-square flex items-center justify-center rounded-sm transition-all duration-200 cursor-pointer ${
                      isHovered ? 'ring-2 ring-primary ring-inset z-10' : ''
                    }`}
                    style={{ backgroundColor: getColor(val) }}
                    onMouseEnter={() => setHoveredCell({ row: rowAsset, col: colAsset, val })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span className="text-[9px] font-medium text-foreground opacity-0 hover:opacity-100 mix-blend-difference z-20">
                      {val.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend / Hover Details */}
      <div className="h-6 mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[10px]">
        {hoveredCell ? (
          <div className="font-medium text-foreground">
            {hoveredCell.row} &times; {hoveredCell.col}: <span className="font-bold">{hoveredCell.val.toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full max-w-[200px] mx-auto">
            <span className="text-muted-foreground">-1</span>
            <div className="flex-1 h-2 rounded bg-gradient-to-r from-blue-500 via-transparent to-red-500 opacity-50" />
            <span className="text-muted-foreground">+1</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CorrelationMatrixWidget);
