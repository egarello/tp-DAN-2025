'use client';

interface BdEmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function BdEmptyState({
  title,
  message,
  action,
  className = '',
}: BdEmptyStateProps) {
  return (
    <div className={`bd-empty-state animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`}>
      {title && <p className="bd-empty-state-title">{title}</p>}
      {message && <p className="bd-empty-state-message">{message}</p>}
      {action && <div className="bd-empty-state-action">{action}</div>}
    </div>
  );
}
