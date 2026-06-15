

export interface VaRGaugeConfig {
  confidenceLevel: 95 | 99;
  calculationMethod: 'historical' | 'parametric';
}

export const defaultVaRGaugeConfig: VaRGaugeConfig = {
  confidenceLevel: 95,
  calculationMethod: 'historical'
};

export const varGaugeConfigSchema = {
  type: 'object',
  properties: {
    confidenceLevel: { type: 'number', enum: [95, 99] },
    calculationMethod: { type: 'string', enum: ['historical', 'parametric'] }
  }
};
