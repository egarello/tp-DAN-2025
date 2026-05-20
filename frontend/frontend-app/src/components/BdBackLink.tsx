'use client';

import Link from 'next/link';

interface BdBackLinkProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function BdBackLink({
  href,
  onClick,
  children,
  className = '',
}: BdBackLinkProps) {
  const label = children || 'Volver';
  const cls = `bd-back-link animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        ← {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      ← {label}
    </button>
  );
}
