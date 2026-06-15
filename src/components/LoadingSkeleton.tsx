import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full p-4 flex flex-col space-y-4 animate-pulse ${className}`}>
      {/* Title placeholder */}
      <div className="h-6 bg-muted rounded w-1/3"></div>
      
      {/* Content placeholders */}
      <div className="flex-1 w-full bg-muted rounded"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-4/6"></div>
    </div>
  );
};
