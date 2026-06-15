import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useHoldings } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { SectorHeatMapConfig } from './config';

export const SectorHeatMapWidget: React.FC<WidgetComponentProps<SectorHeatMapConfig, unknown>> = ({ config }) => {
  const { data: holdings, isLoading, error } = useHoldings('P-001');
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!holdings) return null;
    
    // Group holdings by sector
    const sectors = Array.from(d3.group(holdings, d => d.sector), ([key, values]) => ({
      name: key,
      children: values.map(v => ({
        ...v,
        value: config.sizeBy === 'marketValue' ? v.marketValue : v.weight
      }))
    }));

    return { name: 'Portfolio', children: sectors };
  }, [holdings, config.sizeBy]);

  useEffect(() => {
    if (!chartData || dimensions.width === 0 || dimensions.height === 0 || !svgRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const root = d3.hierarchy(chartData as any)
      .sum((d: any) => d.value)
      .sort((a: any, b: any) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(1)
      .paddingTop(20)(root);

    const colorScale = d3.scaleLinear<string>()
      .domain([-5, 0, 5])
      // @ts-ignore
      .range(config.colorScale === 'green-red' ? ['#ef4444', '#1e293b', '#22c55e'] : ['#f97316', '#1e293b', '#3b82f6'])
      .clamp(true);

    // Create a tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'var(--card)')
      .style('color', 'var(--card-foreground)')
      .style('border', '1px solid var(--border)')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '10');

    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    leaf.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => colorScale(d.data.dailyPnLPercent))
      .attr('stroke', 'var(--background)')
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('stroke', 'var(--foreground)').attr('stroke-width', 2);
        tooltip.style('visibility', 'visible')
          .html(`
            <div class="font-bold">${d.data.name} (${d.data.ticker})</div>
            <div>Value: ₹${d.data.marketValue.toLocaleString()}</div>
            <div class="${d.data.dailyPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}">
              P&L: ${d.data.dailyPnLPercent.toFixed(2)}%
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', 'var(--background)').attr('stroke-width', 1);
        tooltip.style('visibility', 'hidden');
      });

    leaf.append('text')
      .attr('x', 4)
      .attr('y', 14)
      .text((d: any) => d.data.ticker)
      .attr('font-size', '10px')
      .attr('fill', '#ffffff')
      .style('pointer-events', 'none')
      .style('opacity', (d: any) => (d.x1 - d.x0) > 30 && (d.y1 - d.y0) > 20 ? 1 : 0);

    return () => {
      tooltip.remove();
    };
  }, [chartData, dimensions, config.colorScale]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading Map...</div>;
  }

  if (error) {
    throw error;
  }

  return (
    <div ref={containerRef} className="w-full h-full relative p-1 overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default React.memo(SectorHeatMapWidget);
