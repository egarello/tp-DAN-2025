'use client';

interface BdCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BdCard({
  title,
  children,
  className = '',
}: BdCardProps) {
  return (
    <div className={`bd-card shadow-bd-card transition-all duration-200 hover:-translate-y-1 hover:shadow-bd-card-hover hover:border-bd-medium hover:bg-bd-card-hover animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`}>
      {title && <h3 className="bd-card-title">{title}</h3>}
      {children}
    </div>
  );
}
