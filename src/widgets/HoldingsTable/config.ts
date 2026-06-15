

export interface HoldingsTableConfig {
  defaultSortColumn: string;
  defaultSortDirection: 'asc' | 'desc';
  pageSize: number;
}

export const defaultHoldingsTableConfig: HoldingsTableConfig = {
  defaultSortColumn: 'marketValue',
  defaultSortDirection: 'desc',
  pageSize: 50
};

export const holdingsTableConfigSchema = {
  type: 'object',
  properties: {
    defaultSortColumn: { type: 'string' },
    defaultSortDirection: { type: 'string', enum: ['asc', 'desc'] },
    pageSize: { type: 'number', minimum: 10, maximum: 500 }
  }
};
