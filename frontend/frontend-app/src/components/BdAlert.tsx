'use client';

interface BdAlertProps {
  variant?: 'error' | 'success' | 'warning';
  message?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function BdAlert({
  variant = 'error',
  message,
  children,
  onClose,
  className = '',
}: BdAlertProps) {
  return (
    <div className={`bd-alert bd-alert-${variant} animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`}>
      <div className="bd-alert-body">
        {message || children}
      </div>
      {onClose && (
        <button className="bd-alert-close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
