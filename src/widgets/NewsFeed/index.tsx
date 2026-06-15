import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { useNewsFeed } from '../../hooks/useData';
import type { WidgetComponentProps } from '../../types/widget';
import type { NewsFeedConfig } from './config';

export const NewsFeedWidget: React.FC<WidgetComponentProps<NewsFeedConfig, unknown>> = ({ config }) => {
  const { data: news, isLoading, error } = useNewsFeed();
  const [filter, setFilter] = useState('');
  const [source, setSource] = useState(config.defaultSource);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sources = useMemo(() => {
    if (!news) return ['All'];
    const s = new Set(news.map(n => n.source));
    return ['All', ...Array.from(s)];
  }, [news]);

  const filteredNews = useMemo(() => {
    if (!news) return [];
    return news.filter(n => {
      const matchesSearch = filter === '' || n.headline.toLowerCase().includes(filter.toLowerCase()) || n.relevantTickers.some(t => t.toLowerCase().includes(filter.toLowerCase()));
      const matchesSource = source === 'All' || n.source === source;
      return matchesSearch && matchesSource;
    });
  }, [news, filter, source]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading News...</div>;
  }

  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col w-full h-full bg-card rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30">
        <div className="relative flex-1 mr-2">
          <Search size={14} className="absolute left-2 top-2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search keywords, tickers..." 
            className="pl-7 pr-2 py-1 text-xs bg-background border border-border rounded w-full focus:outline-none focus:border-primary"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-1">
          <Filter size={14} className="text-muted-foreground" />
          <select 
            className="py-1 text-xs bg-background border border-border rounded focus:outline-none focus:border-primary"
            value={source}
            onChange={e => setSource(e.target.value)}
          >
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {filteredNews.map((article) => (
            <motion.div
              key={article.articleId}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="border border-border/50 rounded bg-background p-2 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setExpandedId(expandedId === article.articleId ? null : article.articleId)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex space-x-2 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{article.source}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(article.publishedAt).toLocaleTimeString()}</span>
                </div>
                {config.showSentiment && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    article.sentiment === 'positive' ? 'bg-green-500/20 text-green-500' :
                    article.sentiment === 'negative' ? 'bg-red-500/20 text-red-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {article.sentiment.toUpperCase()}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">{article.headline}</h4>
              <div className="flex flex-wrap gap-1 mb-1">
                {article.relevantTickers.map(t => (
                  <span key={t} className="text-[10px] bg-secondary text-secondary-foreground px-1 rounded">{t}</span>
                ))}
              </div>
              
              <AnimatePresence>
                {expandedId === article.articleId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2 pb-1">
                      {article.summary}
                    </p>
                    <a href="#" onClick={e => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center mt-1">
                      Read full article <ExternalLink size={10} className="ml-1" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredNews.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-4">No news matches filters.</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(NewsFeedWidget);
