'use client';

interface BdSkeletonProps {
  variant?: 'card' | 'text';
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

export default function BdSkeleton({
  variant = 'card',
  width,
  height,
  lines = 1,
  className = '',
}: BdSkeletonProps) {
  if (variant === 'text' && lines > 0) {
    return (
      <div className={`bd-skeleton-text${className ? ` ${className}` : ''}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="bd-skeleton bd-skeleton-line"
            style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bd-skeleton bd-skeleton-card${className ? ` ${className}` : ''}`}
      style={{ width, height }}
    />
  );
}
