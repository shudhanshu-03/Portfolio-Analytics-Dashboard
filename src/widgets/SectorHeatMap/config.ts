

export interface SectorHeatMapConfig {
  colorScale: 'green-red' | 'blue-orange';
  sizeBy: 'marketValue' | 'weight';
}

export const defaultHeatMapConfig: SectorHeatMapConfig = {
  colorScale: 'green-red',
  sizeBy: 'marketValue'
};

export const heatMapConfigSchema = {
  type: 'object',
  properties: {
    colorScale: { type: 'string', enum: ['green-red', 'blue-orange'] },
    sizeBy: { type: 'string', enum: ['marketValue', 'weight'] }
  }
};
