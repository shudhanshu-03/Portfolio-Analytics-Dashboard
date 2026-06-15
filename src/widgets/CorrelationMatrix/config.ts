

export interface CorrelationMatrixConfig {
  lookbackPeriod: 30 | 60 | 90 | 252;
}

export const defaultCorrelationMatrixConfig: CorrelationMatrixConfig = {
  lookbackPeriod: 90
};

export const correlationMatrixConfigSchema = {
  type: 'object',
  properties: {
    lookbackPeriod: { type: 'number', enum: [30, 60, 90, 252] }
  }
};
