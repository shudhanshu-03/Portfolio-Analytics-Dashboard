

export interface NewsFeedConfig {
  defaultSource: string;
  showSentiment: boolean;
}

export const defaultNewsFeedConfig: NewsFeedConfig = {
  defaultSource: 'All',
  showSentiment: true
};

export const newsFeedConfigSchema = {
  type: 'object',
  properties: {
    defaultSource: { type: 'string' },
    showSentiment: { type: 'boolean' }
  }
};
